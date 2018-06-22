'use strict'

//importing 3rd party libraries
const express = require('express');
const router = express.Router();
const morgan = require('morgan');

// Modularize routes to /blog-posts
const blogRouter = require('./blogRouter');

//creates the new express app, no need to server up static assets as there are none
const app = express();

//log the http layer
app.use(morgan('common'));

//routing for landing page
app.use('/blog-posts', blogRouter);


app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`)
});

let server;

//starts the server and returns a promise > facilitates async testing
function runServer() {
  const port = process.env.PORT || 8080;
  return new Promise((resolve, reject) => {
    server = app
    .listen(port, () => {
      console.log('Your app is listening on port ${port}');
      resolve(server);
    })
    .on('error', err => {
      reject(err);
    });
  });
}

//stops the server and returns a promise > facilitates async testing
function closeServer() {
  return new Promise((resolve, reject) => {
    console.log('Closing server');
    resolve(server);
    server.close(err => {
      if(err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

//server is called directly (node server.js or nodemon), this will run
if(require.main === module) {
  runServer().catch(err => console.log(err));
}

//exports so server can be run for use in test-blogRouter.js
module.exports = {app, runServer, closeServer};
