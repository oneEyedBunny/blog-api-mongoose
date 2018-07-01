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

//Creates a new Mongoose model (BlogPost) that uses the Schema defined above
const BlogPost = mongoose.model('BlogPost', blogPostSchema);

module.exports = {BlogPost};

// const BlogPosts = {
//   create: function(title, content, author, publishDate) {
//     const post = {
//       id: uuid.v4(),
//       title: title,
//       content: content,
//       author: author,
//       publishDate: publishDate || Date.now()
//     };
//     this.posts.push(post);
//     return post;
//   },
//   get: function(id=null) {
//     // if id passed in, retrieve single post,
//     // otherwise send all posts.
//     if (id !== null) {
//       return this.posts.find(post => post.id === id);
//     }
//     // return posts sorted (descending) by
//     // publish date
//     return this.posts.sort(function(a, b) {
//       return b.publishDate - a.publishDate
//     });
//   },
//
//   delete: function(id) {
//     const postIndex = this.posts.findIndex(
//       post => post.id === id);
//     if (postIndex > -1) {
//       this.posts.splice(postIndex, 1);
//     }
//   },
//
//   update: function(updatedPost) {
//     const {id} = updatedPost;
//     const postIndex = this.posts.findIndex(
//       post => post.id === updatedPost.id);
//     if (postIndex === -1) {
//       throw new StorageException(
//         `Can't update item \`${id}\` because doesn't exist.`)
//     }
//     this.posts[postIndex] = Object.assign(
//       this.posts[postIndex], updatedPost);
//     return this.posts[postIndex];
//   }
// };
//
// function createBlogPostsModel() {
//   const storage = Object.create(BlogPosts);
//   storage.posts = [];
//   return storage;
// }
