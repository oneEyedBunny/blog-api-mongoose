'use strict';

//import dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
const moment = require('moment');

//lets us use expect & should style syntax in tests
const expect = chai.expect;
const should = chai.should();

//
const {BlogPost} = require('../models');
const {closeServer, runServer, app} = require('../server');
const {PORT, TEST_DATABASE_URL} = require('../config');

//lets us make http requests in our tests
chai.use(chaiHttp);

//creates data in test db before testing starts
function seedBlogData() {
  console.info('seeding blog data');
  const seedData = [];
  for (let i = 1; i <= 10; i++) {
    seedData.push(generateBlogData());
  }
  // this will return a promise
  return BlogPost.insertMany(seedData);
};

// generate an object representing a blog. Can be used to generate seed data for db
// or request.body data
function generateBlogData() {
  return {
    title: faker.lorem.words(),
    content: faker.lorem.paragraphs(),
    created: faker.date.past(),
    author: {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName()
    }
  };
};

// Deletes the entire database. Called in an `afterEach` block below to ensure
// data from one test isn't there for subsequent tests
function tearDownDb() {
  console.warn('Deleting database');
  return mongoose.connection.dropDatabase();
}


describe ('Blog Router', function() {
//hook functions to return a promise so we dont need to call a done callback
//ensures there isn't a race condition with tests starting before server
  before(function() {
    return runServer(TEST_DATABASE_URL); //returns promise
  });
  beforeEach(function() {
    return seedBlogData();
  });
  afterEach(function() {
    return tearDownDb();
  });
  after(function() {
    return closeServer();
  });

//normal test case for GET route
  describe('GET endpoint', function() {
  it('should return all blogs', function() {
    let res;
    return chai.request(app)
    .get('/blogs')
    .then(function(_res) {
      res = _res;
      expect(res).to.have.status(200);
      return BlogPost.count();
    })
    .then(function(count) {
        expect(res.body.blogPosts).to.have.lengthOf(count);
    });
  });

  it.only('should return blogs with the correct fields', function() {
    let blogSample;
    return chai.request(app)
    .get('/blogs')
    .then(function(res) {
      expect(res).to.be.json;
      expect(res.body.blogPosts).to.be.a('array');
      res.body.blogPosts.forEach(function(item) {
        expect(item).to.be.a('object');
        expect(item).to.include.keys('id', 'title', 'content', 'author', 'created')
      })
      blogSample = res.body.blogPosts[0];
      console.log("blogSample:", blogSample);
      return BlogPost.findById(blogSample.id)
    })
    .then(function(blog) {
      console.log("blog:", blog);
      /////////////how do we know that the same blog is going to be selected since we didnt specify [0]
      expect(blogSample.id).to.equal(blog.id);
      expect(blogSample.title).to.equal(blog.title);
      expect(blogSample.content).to.contain(blog.content);
      expect(blogSample.author).to.equal(blog.fullName);
      expect(moment(blogSample.created).format()).to.equal(moment(blog.created).format());
    })
  });
}) //closes describe for GET

  //normal test case for POST route
  describe('POST endpoints', function() {
  it('should create a new blog post', function() {
    const newBlogPost = generateBlogData();
    return chai.request(app)
    .post('/blogs')
    .send(newBlogPost)
    .then(function(res) { //checking that creation of object works
      res.should.be.json;
      expect(res).to.have.status(201);
      expect(res.body).to.be.a('object');
      expect(res.body).to.include.keys('id', 'title', 'content', 'author', 'created');
      expect(res.body.title).to.equal(newBlogPost.title);
      expect(res.body.content).to.equal(newBlogPost.content);
      expect(moment(res.body.created).format()).to.equal(moment(newBlogPost.created).format());
      console.log("res.body = ", res.body.author);
      console.log("newBlogPost = ", newBlogPost);
      expect(res.body.author).to.equal(newBlogPost.firstName &" "& newBlogPost.lastName);
      expect(res.body.id).to.not.be.null;
      return BlogPost.findById(res.body.id);
    })
    .then(function(blog) { //checking that created item is in db
      expect(blog.title).to.equal(newBlogPost.title);
      expect(blog.content).to.equal(newBlogPost.content);
      expect(moment(blog.created).format()).to.equal(moment(newBlogPost.created).format());
      console.log("blog = ", blog.author);
      console.log("newBlogPost = ", newBlogPost.fullName);
      expect(blog.author).to.equal(newBlogPost.fullName);
    });
  });
});//closes post endpoint test
//
//   //normal test case for DELETE route
//   describe('DELETE endpoints', function() {
//   it('should delete a specified blog post', function() {
//     let selectedBlog;
//     return BlogPost.findOne()
//     .then(function(_selectedBlog) {
//       selectedBlog = _selectedBlog;
//       return chai.request(app)
//       .delete(`/blogs/${selectedBlog.id}`);
//     })
//     .then(function(res) {
//       expect(res).to.have.status(204);
//       return BlogPost.findById(selectedBlog.id);
//     })
//       .then(function(_blog) {
//           expect(_blog).to.be.null;
//       });
//   });
//  }); //closes delete tests

  //normal test case for PUT route
 //  describe('PUT endpoint', function() {
 //  it('should update a specified blog post', function() {
 //    let selectedBlog;
 //    return BlogPost.findOne()
 //    .then(function(_selectedBlog) {
 //      selectedBlog = _selectedBlog;
 //      console.log("my blog BEFORE edit is", selectedBlog);
 //      selectedBlog.title = faker.lorem.words(),
 //      console.log("my blog AFTER edit is", selectedBlog);
 //      return chai.request(app)
 //        .put(`/blogs/${selectedBlog.id}`)
 //        .send(selectedBlog)
 //      })
 //      .then(function(res) {
 //        expect(res).to.have.status(200);
 //        return BlogPost.findById(selectedBlog.id);
 //      })
 //      .then(function(blog) {
 //        expect(blog.body.title).to.equal(selectedBlog.title);
 //        expect(blog.body.content).to.equal(selectedBlog.content);
 //      })
 //    });
 // }); //closes PUT test case
});//closes whole test set
