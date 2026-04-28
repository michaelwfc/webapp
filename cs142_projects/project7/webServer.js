/**
 * This builds on the webServer of previous projects in that it exports the
 * current directory via webserver listing on a hard code (see portno below)
 * port. It also establishes a connection to the MongoDB named 'cs142project6'.
 *
 * To start the webserver run the command:
 *    node webServer.js
 *
 * Note that anyone able to connect to localhost:portNo will be able to fetch
 * any file accessible to the current user in the current directory or any of
 * its children.
 *
 * This webServer exports the following URLs:
 * /            - Returns a text status message. Good for testing web server
 *                running.
 * /test        - Returns the SchemaInfo object of the database in JSON format.
 *                This is good for testing connectivity with MongoDB.
 * /test/info   - Same as /test.
 * /test/counts - Returns the population counts of the cs142 collections in the
 *                database. Format is a JSON object with properties being the
 *                collection name and the values being the counts.
 *
 * The following URLs need to be changed to fetch there reply values from the
 * database:
 * /user/list         - Returns an array containing all the User objects from
 *                      the database (JSON format).
 * /user/:id          - Returns the User object with the _id of id (JSON
 *                      format).
 * /photosOfUser/:id  - Returns an array with all the photos of the User (id).
 *                      Each photo should have all the Comments on the Photo
 *                      (JSON format).
 */

const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");

const async = require("async");

const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const multer = require("multer");


const app = express();

// Enables sessions: This middleware allows Express to manage user sessions across requests.
// Required for login/logout: Without it, request.session.user_id wouldn't work in /admin/login or other handlers.
// What it does:
// Sets up session storage (in-memory by default).
// Uses cookies to track sessions between requests.
// Protects session data with the secret key.

// Finally you need to add the express-session and body-parser middleware to express with the Express use like so:
// where "secretKey" is the secret you use to cryptographically protect the session cookie. 
// We will use the multer middleware in the photo upload code.
app.use(session({
  secret: "cs142Project7Secret",
  resave: false,
  saveUninitialized: false,
}));

app.use(bodyParser.json());

// app.use(multer().array());



// Load the Mongoose schema for User, Photo, and SchemaInfo
// This line connects your code to the users collection in MongoDB.
const User = require("./schema/user.js");
const Photo = require("./schema/photo.js");
const SchemaInfo = require("./schema/schemaInfo.js");

// XXX - Your submission should work without this line. Comment out or delete
// this line for tests and before submission!


mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1/cs142project6", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// We have the express static module
// (http://expressjs.com/en/starter/static-files.html) do all the work for us.
app.use(express.static(__dirname));



app.get("/", function (request, response) {
  response.send("Simple web server of files from " + __dirname);
});

/**
 * Use express to handle argument passing in the URL. This .get will cause
 * express to accept URLs with /test/<something> and return the something in
 * request.params.p1.
 *
 * If implement the get as follows:
 * /test        - Returns the SchemaInfo object of the database in JSON format.
 *                This is good for testing connectivity with MongoDB.
 * /test/info   - Same as /test.
 * /test/counts - Returns an object with the counts of the different collections
 *                in JSON format.
 */
app.get("/test/:p1", function (request, response) {
  // Express parses the ":p1" from the URL and returns it in the request.params
  // objects.
  console.log("/test called with param1 = ", request.params.p1);

  const param = request.params.p1 || "info";

  if (param === "info") {
    // SchemaInfo.find(query, callback):
    // Fetch the SchemaInfo. There should only one of them. The query of {} will  match it.
    // - query is an object specifying the search criteria,
    // - function (err, info)The second argument is a callback function:
    // callback is a function that will be called with the results of the query.
    //  - err is the error object if the query fails.
    //  - info is the array of documents returned by the query
    // The callback runs after the database returns results. If err is non-null, the query failed; otherwise info contains the found documents.
    SchemaInfo.find({}, function (err, info) {
      if (err) {
        // Query returned an error. We pass it back to the browser with an
        // Internal Service Error (500) error code.
        console.error("Error in /user/info:", err);
        response.status(400).send(JSON.stringify(err));
        return;
      }
      if (info.length === 0) {
        // Query didn't return an error but didn't find the SchemaInfo object -
        // This is also an internal error return.
        response.status(400).send("Missing SchemaInfo");
        return;
      }

      // We got the object - return it in JSON format.
      console.log("SchemaInfo", info[0]);
      response.end(JSON.stringify(info[0]));
    });
  } else if (param === "counts") {
    // In order to return the counts of all the collections we need to do an
    // async call to each collections. That is tricky to do so we use the async
    // package do the work. We put the collections into array and use async.each
    // to do each .count() query.
    const collections = [
      { name: "user", collection: User },
      { name: "photo", collection: Photo },
      { name: "schemaInfo", collection: SchemaInfo },
    ];
    async.each(
      collections,
      function (col, done_callback) {
        col.collection.countDocuments({}, function (err, count) {
          col.count = count;
          done_callback(err);
        });
      },
      function (err) {
        if (err) {
          response.status(500).send(JSON.stringify(err));
        } else {
          const obj = {};
          for (let i = 0; i < collections.length; i++) {
            obj[collections[i].name] = collections[i].count;
          }
          response.end(JSON.stringify(obj));
        }
      },
    );
  } else {
    // If we know understand the parameter we return a (Bad Parameter) (400)
    // status.
    response.status(400).send("Bad param " + param);
  }
});

/**
 * URL /user/list - Returns all the User objects.
 */
app.get("/user/list", function (request, response) {

  User.find({}, function (err, users) {
    if (err) {
      // Query returned an error. We pass it back to the browser with an
      // Internal Service Error (500) error code.
      console.error("Error in /user/list:", err);
      response.status(500).send(JSON.stringify(err));
      return;
    }
    // Query didn't return an error.
    // Now we build the array of objects with the information we want to
    // return.
    // Updated the server (webServer.js): Changed the /user/list endpoint to return only 
    // the required properties (_id, first_name, last_name) by mapping the user objects.
    const userList = users.map(user => ({
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name
    }));
    response.status(200).send(userList);
  });
});

/**
 * URL /user/:id - Returns the information for User (id).
 */
app.get("/user/:id", function (request, response) {
  if(!request.session.user_id) {
    response.status(401).send("Unauthorized: Please log in to view user details.");
    return;
  }

  const id = request.params.id;

  User.findOne({ _id: id }, function (err, user) {
    if (err) {
      // Query returned an error. We pass it back to the browser with an
      // Internal Service Error (500) error code.
      console.error("Error in /user/:id:", err);
      response.status(400).send(JSON.stringify(err));
      return;
    }
    // Query didn't return an error but didn't find the user - This is a
    // Bad Param error return.
    if (user === null) {
      console.log("User with _id:" + id + " not found.");
      response.status(400).send("Not found");
      return;
    }

    // Object.keys(user)
    // (7) ['_id', 'first_name', 'last_name', 'location', 'description', 'occupation', '__v']
    // Your /user/:id response is a Mongoose document, so it includes MongoDB metadata like __v. The current failure means the returned object contain

    const userInfo = {
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      location: user.location,
      description: user.description,
      occupation: user.occupation,
    };

    // We got the user - return it in JSON format.
    response.status(200).send(userInfo);
  });
});

/**
 * /admin/login router 
 * 
 * */

app.post("/admin/login", function (request, response) { 
  const { login_name, password } = request.body;
  // ensure login_name and password are provided
  if (!login_name || !password) {
    response.status(400).send("Missing login_name or password");
    return;
  }

  // ensure login_name exists in database
  // login_name is the unique identifier for a user, so we search for a user with that login_name.
  User.findOne({ login_name: login_name.toLowerCase() }, function (err, user) {
    if (err) {
      console.error("Error in /admin/login:", err);
      response.status(500).send(JSON.stringify(err));
      return;
    }
    if (!user) {
      response.status(400).send("User not found");
    }

    // ensure password matches
    // if (user.password !== password) {
    //   response.status(400).send("Incorrect password");
    //   return;
    // }
    
    // Note the login register handler should ensure that there exists a user with the given login_name. 
    // If so, it stores some information in the Express session where it can be checked by other request handlers that need to know whether a user is logged in. 
    // set session user_id to logged in user's _id
    request.session.user_id = user._id;

    // login successful
    console.log("Login successful");
    // return the logged-in user data:
    response.status(200).send({ _id: user._id, first_name: user.first_name });
  });

});


// app logout router
app.post("/admin/logout", function (request, response) {
  if (!request.session.user_id) {
    response.status(400).send("Not logged in");
    return;
  }
  // clear session user_id
  request.session.user_id = null;
  console.log("Logout successful");
  response.status(200).send("Logout successful");
});

/**
 * URL /photosOfUser/:id - Returns the Photos for User (id).
 * 
 * Right now /photosOfUser/:id is returning raw Mongoose Photo documents, 
 * which do NOT include populated user info inside comments.

* console.log(JSON.stringify(photos[0], null, 2));
 {
  "_id": "69e17487fc1da694a91330e8",
  "file_name": "malcolm2.jpg",
  "date_time": "2009-09-13T12:00:00.000Z",
  "user_id": "69e17486fc1da694a91330d6",
  "comments": [
    {
      "comment": "If there is one thing the history of evolution has taught us it's that life will not be contained. Life breaks free, it expands to new territories and crashes through barriers, painfully, maybe even dangerously, but, uh... well, there it is. Life finds a way.",
      "date_time": "2009-09-14T10:07:00.000Z",
      "user_id": "69e17486fc1da694a91330d6",
      "_id": "69e17487fc1da694a9133100"
    }
  ],
  "__v": 1
}

2. After .populate() : .populate("comments.user_id", "_id first_name last_name")
Now Mongoose transforms the data into:
{
  "comment": "...",
  "user_id": {
    "_id": "69e17486fc1da694a91330d6",
    "first_name": "Ian",
    "last_name": "Malcolm"
  }
}
user_id is NO LONGER an ID — it's now a full object with the fields we specified in the .populate() call.

2. Transform Code : user: comment.user_id
This simply renames the field:

  MongoDB (ObjectId reference)
          ↓
  Mongoose populate (JOIN-like)
          ↓
  Transform to API model (rename user_id → user)
          ↓
  Frontend uses clean object
 * 
 */
app.get("/photosOfUser/:id", function (request, response) {
  const id = request.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    response.status(400).send("Invalid id");
    return;
  }

  Photo.find({ user_id: id })
     
     // Replace the user_id (which is just an ObjectId) with the actual User document.
     // .populate() is basically a JOIN.
    .populate("comments.user_id", "_id first_name last_name")  // ✅ populate user
  
    // populate the user_id field in comments with the user's _id, first_name, and last_name
    // "comments.user_id": Go inside comments, find field user_id
    // "_id first_name last_name" : Only fetch these fields from User, controls exactly which fields appear:
    // The first_name and last_name come from the User collection via populate
    // “For each comment, replace user_id with the corresponding User object, but only include _id, first_name, and last_name.”
    .exec(function (err, photos) {
    if (err) {
      // Query returned an error. We pass it back to the browser with an
      // Internal Service Error (500) error code.
      console.error("Error in /photosOfUser/:id:", err);
      response.status(500).send(JSON.stringify(err));
      return;
    }
    // Query didn't return an error but didn't find the photos - This is a
    // Bad Param error return.
    if (photos.length === 0) {
      console.log("Photos for user with _id:" + id + " not found.");
      response.status(400).send("Not found");
      return;
    }
    // We got the photos - return them in JSON format.
    console.log("Photos of user with _id:" + id + " found:\n", JSON.stringify(photos, null, 2));
    console.log(JSON.stringify(photos[0], null, 2));

    // transform the photos to API model (rename user_id → user)
    const transformedResults = photos.map((photo) => {
      return {
        _id: photo._id,
        file_name: photo.file_name,
        date_time: photo.date_time,
        user_id: photo.user_id,
        comments: photo.comments.map((comment) => (
          {
            _id: comment._id,
            user: comment.user_id, // rename user_id → user, populated user object
            comment: comment.comment,
            date_time: comment.date_time,
          }))
        };  
    });

    response.status(200).send(transformedResults);
  });
});



const server = app.listen(3000, function () {
  const port = server.address().port;
  console.log(
    "Listening at http://localhost:" +
      port +
      " exporting the directory " +
      __dirname,
  );
});
