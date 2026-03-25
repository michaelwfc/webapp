"use strict";

/**
 * A simple Node.js program for exporting the current working directory via a
 * webserver listing on a hard code (see portno below) port. To start the
 * webserver run the command:
 *    node webServer.js
 *
 * Note that anyone able to connect to localhost:3001 will be able to fetch any
 * file accessible to the current user in the current directory or any of its
 * children.
 */

var express = require("express");

var portno = 3000; // Port number to use

var app = express();

// We have the express static module
// express.static is built-in middleware that automatically serves files from a folder.
// (http://expressjs.com/en/starter/static-files.html) do all the work for us.
// So this one line essentially turns your Node.js process into a full static file server —
// no extra configuration needed. Any file in that directory (HTML, CSS, JS, images) becomes accessible via the browser.
app.use(express.static(__dirname));

// The function passed as the second argument is a callback that runs only once the server is ready and actually listening.
var server = app.listen(portno, function () {
  var port = server.address().port;
  console.log(
    "Listening at http://localhost:" +
      port +
      " exporting the directory " +
      __dirname,
  );
});
