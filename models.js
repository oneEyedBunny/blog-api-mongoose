"use strict";

//importing 3rd party libraries
const uuid = require('uuid');
const mongoose = require('mongoose');

//Mongoose use built in es6 promises
mongoose.Promise = global.Promise;

//defining schema for blog BlogPosts
const blogPostSchema = mongoose.Schema({
      title: { type: String, required: true },
      content: { type: String, required: true },
      created: { type: Date, default: Date.now },
      author: {
        firstName: String,
        lastName: String
      }
});

//creating a string to represent the full name, not stored in DB
blogPostSchema.virtual('fullName').get(function() {
  return `${this.author.firstName} ${this.author.lastName}`.trim();
});

//
blogPostSchema.methods.serialize = function() {
  return {
    id: this._id,
    title: this.title,
    content:this.content,
    created: this.created,
    author: this.fullName
  };
};

//Creates a new Mongoose model (BlogPost) off the blogs collection in the DB.
//the model will uses the Schema defined above
const BlogPost = mongoose.model('Blogs', blogPostSchema);

module.exports = {BlogPost};
