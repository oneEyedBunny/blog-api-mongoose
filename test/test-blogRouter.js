//import dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');

//import
const {app, runServer, closeServer} = require('../server');

//lets us use *expect & should* style syntax in tests
const expect = chai.expect;
const should = chai.should();

//lets us make http requests in our tests
chai.use(chaiHttp);

describe ('Blog Router', function() {

  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });

  //normal test case for GET route
  it('should get the blog on GET request', function() {
    return chai.request(app)
    .get('/blog-posts')
    .then(function(res) {
      expect(res).to.be.json;
      expect(res.body).to.be.a('array');
      expect(res.body.length).to.be.at.least(1);
      res.body.forEach(function(item) {
        expect(item).to.have.all.keys('id', 'title', 'content', 'author', 'publishDate')
      })
    });
  });

  //normal test case for POST route
  it('should create a blog post on POST request', function() {
    const newBlogPost = {title:'testblogpost', content:'testingtesting', author:"Tessy Tester", publishDate: 1529852206190}
    return chai.request(app)
    .post('/blog-posts')
    .send(newBlogPost)
    .then(function(res) {
      expect(res).to.be.json;
      expect(res).to.have.status(201);
      expect(res.body).to.be.a('object');
      expect(res.body).to.include.keys('id', 'title', 'content', 'author', 'publishDate');
      expect(res.body).to.deep.equal(Object.assign(newBlogPost, {id:res.body.id}));
    })
  });

  //normal test case for DELETE route
  it('should delete a specified blog post on DELETE request', function() {
    return chai.request(app)
    .get('/blog-posts')
    .then(function(res) {
      return chai.request(app)
      .delete('/blog-posts/${res.body[0].id}');
    })
    .then(function(res) {
      expect(res).to.have.status(204);
    });
  });

  //normal test case for PUT route
  it('should update a specified blog post on PUT request', function() {
    return chai.request(app)
    .get('/blog-posts')
    .then(function(res) {
      const updatedBlogPost = Object.assign(res.body[0], {
        title:'testblogpost2',
        content:'testingtestingtesting',
        author:"Tess Tester",
        publishDate: 1529852206191
      });
      return chai.request(app)
      .put('/blog-posts/${updatedBlogPost.id}')
      .send(updatedBlogPost)
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res).to.be.a('object');
        expect(res.body.id).to.deep.equal(updatedBlogPost.id);
      });
    });
  });
});
