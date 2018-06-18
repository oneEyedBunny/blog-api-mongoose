'use strict'

//importing 3rd party libraries
const express = require('express');
const router = express.Router();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


// Modularize routes to /blog-posts
const {BlogPosts} = require('./models');

//creates the new express app, no need to server up static assets as there are none
const app = express();



//log the http layer
app.use(morgan('common'));

//Adding some blog post to test functionality
BlogPosts.create("Cats are super", "BlahBlah1", "Cathy Caterson");
BlogPosts.create("Dogs are great", "BlahBlah2", "Danny Doggery");
BlogPosts.create("Bunnies are snuggly", "BlahBlah3", "Bonnie Bunyon");
BlogPosts.create("Snakes are slithery", "BlahBlah4", "Seth Slitheran");


//when this route is called, return the blog post
app.get('/blog-posts', (req, res) => {
  res.json(BlogPosts.get());
});

// app.post('/blog-posts', (req, res) => {
//
// });
//
// app.delete('/blog-posts/:id', (req, res) => {
//
// });
//
// app.put('/blog-posts/:id', (req, res) => {
//
// });

app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`)
});
