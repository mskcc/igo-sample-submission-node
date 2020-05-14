const { chai, server, should } = require('./testConfig');
// const UserModel = require("../models/UserModel");
const axios = require('axios');
const moxios = require('moxios');

/**
 * Test cases to test all the authentication APIs
 * Covered Routes:
 * (1) Login
 
 */

describe('Auth', () => {
  // Before each test we empty the database
  // before((done) => {
  //     UserModel.deleteMany({}, (err) => {
  //         done();
  //     });
  // });

  // Prepare data for testing
  const testData = {
    username: 'test',
    password: 'Test@123',
    token: 'dsadsa3r894',
  };

  /*
   * Test the /POST route
   */
  describe('/POST Login', () => {
    it('it should respond with Invalid Username or Password.', (done) => {
      chai
        .request(server)
        .post('/api/auth/login')
        .send({
          username: testData.username,
          password: testData.password,
        })
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have
            .property('message')
            .eql('Invalid username or password. Please try again.');
          done();
        });
    });
  });

  /*
   * Test the /POST route
   */
  describe('/POST Login', () => {
    it('it should respond with missing param warning.', (done) => {
      chai
        .request(server)
        .post('/api/auth/login')
        .send({
          password: testData.password,
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message').eql('Validation error.');
          done();
        });
    });
  });
});
