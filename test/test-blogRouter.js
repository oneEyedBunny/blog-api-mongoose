'use strict';

//import dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

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

  describe("GET endpoint", function() {
  //normal test case for GET route
  it('should return all blogs on GET request', function() {
    let res;
    return chai.request(app)
    .get('/blogs')
    .then(function(_res) {
      res = _res;
      expect(res).to.have.status(200);
      return BlogPost.count();
    })
    .then(function(count) {
        expect(res.body.blogPosts).to.have.lengthOf(count);//is blogs right??
    });
  });

  it('should return blogs with the correct fields', function() {
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
      return BlogPost.findById(blogSample.id);
    })
    .then(function(blog) {
      console.log("blog:", blog);
      /////////////how do we know that the same blog is going to be selected since we didnt specify [0]
      expect(blogSample.id).to.equal(blog.id);
      expect(blogSample.title).to.equal(blog.title);
      expect(blogSample.content).to.contain(blog.content);
      expect(blogSample.author).to.equal(blog.fullName); //not returning full name, instead object with each
      expect(blogSample.created).to.equal(blog.created);
    })
  });
}) //closes describe for GET

  // //normal test case for POST route
  // it('should create a blog post on POST request', function() {
  //   const newBlogPost = {title:'testblogpost', content:'testingtesting', author:"Tessy Tester", created: 1529852206190}
  //   return chai.request(app)
  //   .post('/blog-posts')
  //   .send(newBlogPost)
  //   .then(function(res) {
  //     expect(res).to.be.json;
  //     expect(res).to.have.status(201);
  //     expect(res.body).to.be.a('object');
  //     expect(res.body).to.include.keys('id', 'title', 'content', 'author', 'created');
  //     expect(res.body).to.deep.equal(Object.assign(newBlogPost, {id:res.body.id}));
  //   })
  // });
  //
  // //normal test case for DELETE route
  // it('should delete a specified blog post on DELETE request', function() {
  //   return chai.request(app)
  //   .get('/blog-posts')
  //   .then(function(res) {
  //     return chai.request(app)
  //     .delete(`/blog-posts/${res.body[0].id}`);
  //   })
  //   .then(function(res) {
  //     expect(res).to.have.status(204);
  //   });
  // });
  //
  // //normal test case for PUT route
  // it('should update a specified blog post on PUT request', function() {
  //   return chai.request(app)
  //   .get('/blog-posts')
  //   .then(function(res) {
  //     console.log("my object before edit is", res.body[0]);
  //     const updatedBlogPost = Object.assign(res.body[0], {
  //       title:'testblogpost2',
  //       content:'testingtestingtesting',
  //       author:"Tess Tester",
  //       created: 1529852206191
  //     });
  //     return chai.request(app)
  //     .put(`/blog-posts/${updatedBlogPost.id}`)
  //     .send(updatedBlogPost)
  //     .then(function(res) {
  //       expect(res).to.have.status(200);
  //       expect(res).to.be.json;
  //       expect(res).to.be.a('object');
  //       expect(res.body.id).to.deep.equal(updatedBlogPost.id);
  //     });
  //   });
  // });
});
