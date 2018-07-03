"use strict";

//importing 3rd party libraries
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//Mongoose use built in es6 promises
mongoose.Promise = global.Promise;

// Modularize routes to blogs
const {BlogPost} = require('./models');

//when the blogs route is called, return the blog post
router.get('/', (req, res) => {
  BlogPost
    .find()
    .then(blogPosts => {
      res.json({
        blogPosts: blogPosts.map(blogPost =>
         blogPost.serialize()
       )});
    })
  .catch(err => {
    console.error(err);
    res.status(500).json({error: "internal server error"});
  });
});

//when a specific blog is called, return that blog post
router.get('/:id', (req, res) => {
  BlogPost
    .findById(req.params.id)
    .then(blogPost => {
      res.json(blogPost.serialize()
    )})
    .catch(err => {
    console.error(err);
    res.status(500).json({error: "internal server error"});
  });
});

//when this route is called, returned blog is updated with changes
router.post('/', (req, res) => {
  const requiredFields =  ['title', 'content', 'author'];
  for(let i = 0; i < requiredFields.length; i++) {
    if(!(requiredFields[i] in req.body)) {
      const errorMessage = (`Missing \`${requiredFields[i]}\` in request body`);
      console.error(errorMessage);
      return res.status(400).send(errorMessage);
    }
  }
  BlogPost
    .create({
      title: req.body.title,
      content: req.body.content,
      author: req.body.author,
      created: req.body.created
    })
    .then(blogPost => {res.status(201).json(blogPost.serialize())
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({message: "Internal server error"})
    });
  });

//when this route is called, returned blog is updated to remove the item specified
router.delete('/:id', (req, res) => {
  BlogPost
  .findByIdAndRemove(req.params.id)
  .then(blogPost => {
    console.log(`Deleted blog ${req.params.id}`);
    res.status(204).end();
  })
  .catch(err => {
    res.status(500).json({message: "Internal server error"})
  })
});

// when route is called, the blog specified is updates with the new info
router.put('/:id', (req, res) => {
  const requiredFields =  ['title', 'content', 'author'];
  for(let i = 0; i < requiredFields.length; i++) {
    if(!(requiredFields[i] in req.body)) {
      const errorMessage = (`Missing \`${requiredFields[i]}\` in request body`);
      console.error(errorMessage);
      return res.status(400).send(errorMessage);
    }
  }
  if(req.params.id !== req.body.id) {
    const errorMessage = (`Request path id (${req.params.id}) and request body
      id (${req.body.id}) must match`);
    console.error(errorMessage);
    return res.status(400).send(errorMessage);
  }
  const updatedPost= {};
  const updatedableFields = ['title', 'content', 'author'];
  updatedableFields.forEach(field => {
    if(field in req.body) {
      updatedPost[field] = req.body[field];
    }
  });
  BlogPost
    .findByIdAndUpdate(req.params.id, {$set: updatedPost})
    .then(post => {
      console.log(`Updating blog post with blog id \`${req.params.id}\``);
      res.status(204).end()
    })
    .catch(err => {
      res.status(500).json({message: "Something went wrong"});
    })
});

//catch all in case user enters non-existent endpoint
router.use("*", function(req, res) {
  res.status(404).json({message: "Sorry, Not Found"});
})

module.exports = router;
