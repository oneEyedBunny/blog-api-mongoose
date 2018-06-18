'use strict'

//importing 3rd party libraries
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

// Modularize routes to /blog-posts
const {BlogPosts} = require('./models');


//Adding some blog post to test functionality
BlogPosts.create("Cats are super", "BlahBlah1", "Cathy Caterson");
BlogPosts.create("Dogs are great", "BlahBlah2", "Danny Doggery");
BlogPosts.create("Bunnies are snuggly", "BlahBlah3", "Bonnie Bunyon");
BlogPosts.create("Snakes are slithery", "BlahBlah4", "Seth Slitheran");


//when this route is called, return the blog post
router.get('/', (req, res) => {
  res.json(BlogPosts.get());
});

//when this route is called, returned blog is updated with user changes
router.post('/', jsonParser, (req, res) => {
  const requiredFields =  ['title', 'content', 'author'];
  for(let i = 0; i < requiredFields.length; i++) {
    if(!(requiredFields[i] in req.body)) {
      const errorMessage = (`Missing \`${requiredFields[i]}\` in request body`);
      console.error(errorMessage);
      return res.status(400).send(errorMessage);
    }
  }
  const item = BlogPosts.create(req.body.title, req.body.content, req.body.author)
  res.status(201).json(item);
});

//when this route is called, returned blog is updated to remove the item specified
router.delete('/:id', (req, res) => {
  BlogPosts.delete(req.params.id);
  console.log(`Deleted blog ${req.params.id}`);
  res.status(204).end();
});

// when route is called, the blog specified is updates with the new info
router.put('/:id', jsonParser, (req, res) => {
  const requiredFields =  ['id', 'title', 'content', 'author'];
  for(let i = 0; i < requiredFields.length; i++) {
    if(!(requiredFields[i] in req.body)) {
      const errorMessage = (`Missing \`${requiredFields[i]}\` in request body`);
      console.error(errorMessage);
      return res.status(400).send(errorMessage);
    }
  }
  if(req.params.id !== req.body.id) {
    const message = `Request path id (${req.params.id}) and request body id (${req.body.id}) must match`;
    console.error(message);
    return res.status(400).send(message);
  }
  console.log(`Updating blog post with blog id \`${req.params.id}\``);
  let item = BlogPosts.update({
    id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author
  }

);
  res.status(200).json(item);
});

module.exports = router;
