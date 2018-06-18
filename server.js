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
