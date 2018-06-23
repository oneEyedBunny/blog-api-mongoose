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
      res.body.forEach(function(item) {
        expect(item).to.have.all.keys('id', 'title', 'content', 'author', 'publishDate')
      })
    });
 });

//  //normal test case for POST route
//  it('should get the blog on GET request', function() {
//    return chai.request(app)
//
// });
// //normal test case for DELETE route
// it('should get the blog on GET request', function() {
//   return chai.request(app)
//
// });
// //normal test case for PUT route
// it('should get the blog on GET request', function() {
//   return chai.request(app)
//
// });


});
