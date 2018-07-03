"use strict";
//importing 3rd party libraries
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

//Mongoose use built in es6 promises
mongoose.Promise = global.Promise;

// Modularize routes to /blog-posts
const blogRouter = require('./blogRouter');

// config.js is where we control constants for the entire app
const {PORT, DATABASE_URL} = require('./config');

//creates the new express app, no need to server up static assets as there are none
const app = express();
app.use(express.json()); //subs for bodyParser

//log the http layer
app.use(morgan('common'));

//when requests come into the landing page, they get routed to the express router
app.use('/blogs', blogRouter);


app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});


let server;

//connects to our DB, starts the server and returns a promise > facilitates async testing
function runServer(databaseURL, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(
      databaseURL, err => {
        if(err) {
          return reject(err);
        }
        server = app
        .listen(port, () => {
          console.log(`Your app is listening on port ${port}`);
          resolve();
        })
        .on("error", err => {
          mongoose.disconnect();
          reject(err);
        });
      }
    );
  });
}

//stops the server and returns a promise > facilitates async testing
function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if(err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  });
}

//if server is called directly (aka with node server.js or nodemon), this will run. Otherwise when called in testing
if(require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}

//exports so server can be run for use in test-blogRouter.js
module.exports = {app, runServer, closeServer};
