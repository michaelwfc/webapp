# CS142 Project 6: Appserver and Database

**Due: Thursday, May 25, 2023 at 11:59 PM**

In this project, you will start up a database system and convert your Photo Sharing App you built in Project 5 to fetch the views' models from it. We provide you with a new `webServer.js` supporting the same interface as Project 5's web server but it also establishes a connection to a database. This allows you to make your app into a legitimate full stack application.

## Setup

You should have MongoDB and Node.js installed on your system. If not, follow the installation instructions now.

**IMPORTANT!** Project 6 setup is different from the previous projects. You start by making a copy of your `project5` directory files into a directory named `project6`. Into the `project6` directory extract the contents of [this zip file](https://web.stanford.edu/class/cs142/project6-react.zip). This zip file will overwrite the files `package.json`, `webServer.js`, `.eslintrc.json`, and `index.html` and add several new files and directories. In the unlikely event you had made necessary changes in any of these files in your `project5` directory, you will need to reapply the changes after doing the unzip.

Once you have the Project 6 files, fetch the dependent software using the command:

```bash
npm install
```

If you run `npm install` without removing the `node_modules` folder, you may encounter warnings like:

```
npm WARN library_A requires a peer of library_B but none is installed. You must install peer dependencies yourself.
```

You may encounter the warnings because the dependencies we use may not match each other's requirements of peer dependencies. You can safely ignore these warnings.

For this and the rest of the assignments in the course, we will be running all three tiers of the web application (browser, web server, database) on your local machine.

## Start and initialize the MongoDB database

Make sure you have MongoDB up and running in your environment as described in the installation instructions. Since the `mongod` command doesn't return until the database is shutdown you will want to either run it in a separate window or as a background process (e.g. `mongod (args) &` on Linux/MacOS).


Once the MongoDB server is started you can load the photo app data set by running the command:

```bash
node loadDatabase.js
```

This program loads the fake model data from previous projects (i.e. `modelData/photoApp.js`) into the database. Since our app currently doesn't have any support for adding or updating things you should only need to run `loadDatabase.js` once. The program erases whatever is in the database before loading the data set so it is safe to run multiple times.

We use the MongooseJS Object Definition Language (ODL) to define a schema to store the photo app data in MongoDB. The schema definition files are in the directory `schema`:

- `schema/user.js` - Defines the User collection containing the objects describing each user.
- `schema/photo.js` - Defines the Photos collection containing the objects describing each photo. It also defines the objects we use to store the comments made on the photo.
- `schema/schemaInfo.js` - Defines the SchemaInfo collection containing the object describing the schema version.

These files are loaded both into the `loadDatabase.js` program where they are used to create the database and the `webServer.js` where they are used to access the database. 

**Note:** The object schema stored in the database is similar to but necessarily different from the `cs142models` JavaScript objects used in the previous assignment. Familiarize yourself with these schema definitions.

## Start the Node.js web server

Once you have the database up and running you will need to start the web server. This can be done with the same command as the previous assignments (e.g. `node webServer.js`).

Start your web server with the command from your `project6` directory:

```bash
node webServer.js
```

If you use the above command, remember to restart the web server after each change you make to the server code.

You can also use `nodemon`, which will watch for any changes to the server code and automatically restart the web server:

```bash
nodemon webServer.js
```

If you ever encounter `command not found: nodemon` error when running nodemon, try to run:

```bash
node_modules/.bin/nodemon webServer.js
```

After updating your Photo Share App with the new files from Project 6 and starting the database and web server make sure the app is still working before continuing on to the assignment.

## Problem 1: Convert the web server to use the database (40 points)

The `webServer.js` we give you in this project is like the Project 5 `webServer.js` in that the app's model fetching routes use the magic `cs142models` rather than a database. Your job is to convert all the routes to use the MongoDB database. There should be no accesses to `cs142models` in your code and your app should work without the line:

```javascript
const cs142models = require('./modelData/photoApp.js').cs142models;
```

in `webServer.js`. Note that any `console.log` statements in `webServer.js` will print to the terminal rather than the browser.

### Web Server API

As in Project 5 the web server will return JSON-encoded model data in response to HTTP GET requests to specific URLs. We provide the following specification of what URLs need to be supported and what they should return. Your web server should support the following model fetching API:

- **`/test`** - Return the schema info (`/test/info`) and object counts (`/test/counts`) of the database. This interface is for testing and as an example for you, we provide an implementation that fetches the information from the database. You will not have to change this one.

- **`/user/list`** - Return the list of users' models appropriate for the navigation sidebar list. Since we anticipate a large number of users, this API should only return an array of the user properties needed by the navigation sidebar (`_id`, `first_name`, `last_name`). It replaces the `cs142models.userListModel()` call in the provided code.

- **`/user/:id`** - Return the detailed information of the user with `_id` of `id`. This should return the information we have on the user for the detail view (`_id`, `first_name`, `last_name`, `location`, `description`, `occupation`) and replaces the `cs142models.userModel()` call. If something other than the id of a User is provided, the response should be an HTTP status of 400 and an informative message.

- **`/photosOfUser/:id`** - Return the photos of the user with `_id` of `id`. This call generates all the model data needed for the photos view including all the photos of the user as well as the comments on the photos. The photos properties should be (`_id`, `user_id`, `comments`, `file_name`, `date_time`) and the comments array elements should have (`comment`, `date_time`, `_id`, `user`) and only the minimum user object information (`_id`, `first_name`, `last_name`). This replaces the `cs142models.photoOfUserModel()` call. If something other than the id of a User is provided, the response should be an HTTP status of 400 and an informative message. Note this API will need some assembling from multiple different objects in the database.

The asynchronous interface to the database provided by Mongoose means these multiple object fetches can be done concurrently. Your code must not unnecessarily serialize the fetches. The assignment's `package.json` file fetches the `async` module that can be helpful in managing the concurrent fetches.

To help you make sure your web server conforms to the proper API we provide a test suite in the sub-directory `test`. Please make sure that all of the tests in the suite pass before submitting. See the Testing section below for details.

Your GET requests do not return exactly the same thing that the `cs142models` functions return but they do need to return the information needed by your app so that the model data of each view can be displayed with a single `fetchModel` call. You will need to do subsetting and/or augmentation of the objects coming from the database to build your response to meet the needs of the UI. For this assignment you are not allowed to alter the database schema in any way.

**IMPORTANT!** Implementing these Express request handlers requires interacting with two different "model" data objects. 
- The Mongoose system returns models from the objects stored in MongoDB while the request itself should return the data models needed by the Photo App views. 
- Unfortunately, since the Mongoose models are set by the database schema and front end models are set by the needs of the UI views they don't align perfectly. 
  Handling these requests will require processing to assemble the model needed by the front end from the Mongoose models returned from the database.

Care needs to be taken when doing this processing since the models returned by Mongoose are JavaScript objects but have special processing done on them so that any modifications that do not match the declared schema are tossed. This means that simply updating a Mongoose model to have the properties expected by the front end doesn't work as expected.

One way to work around this issue is to create a new JavaScript object and populate it with the fields sourced from the Mongoose model. The exact JavaScript data structure specified by the API can be built this way and returned in the HTTP response. For REST endpoints in which the API model closely matches the Mongoose model, another approach is to use the Mongoose projection operator (select) to have the query return only the API-specified model fields. Section will cover these techniques in more detail.

Even if the Mongoose and API models are identical, returning the Mongoose model without performing a projection is a poor programming practice. Future projects will extend the database schema (e.g., add a password to the User model), but we won't want these properties included in the API models.

## Problem 2: Convert your app to use axios (10 points)

In preparation for the next assignment where we will use more of the REST API, convert your photo sharing app to use the `axios` library for making HTTP requests instead of the built-in `fetch` API or other methods you may have been using.