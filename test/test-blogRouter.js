//import dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');

//import
const {app, runServer, closeServer} = require('../server');
//const blogRouter = require('../blogRouter');

//lets us use *expect & should* style syntax in tests
const expect = chai.expect;
const should = chai.should();

//lets us make http requests in our tests
chai.use(chaiHttp);
