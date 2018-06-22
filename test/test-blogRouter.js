//import dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');

//import
const {app, runServer, closeServer} = require('../server');
const blogRouter = require('../blogRouter');

//lets us use *expect & should* style syntax in tests
const expect = chai.expect;
const should = chai.should();

//lets us make http requests in our tests
chai.use(chaiHttp);

// describe ('blogRouter', function() {
//
//   before(function() {
//     return runServer();
//   });
//
//   after(function() {
//     return closeServer();
//   });
//
//   //normal test case for GET route
//   it('should get the blog on GET request', function() {
//     return chai.request(app)
//     .get('/blog-posts')
//     .then(function(res) {
//
//     });
//  })
// });
