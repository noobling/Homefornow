const chai = require('chai');
const server = require('../../app');
const request = require('supertest');
const users = require('../../seeded_users.json');

const should = chai.should();

describe('services : test', () => {
  let cookie; // Make the cookie available to all service tests
  describe('GET /service', () => {
    // Login to get a cookie so we can use sessions for each test
    request.agent(server)
      .post('/login')
      .send({
        email: users[1].email,
        password: users[1].password,
      })
      .end((err, res) => {
        should.not.exist(err);
        [cookie] = res.headers['set-cookie'].pop().split(';');
      });

    it.skip('should fail if not logged in', (done) => {
      request.agent(server)
        .get('/service')
        .end((err, res) => {
          should.not.exist(err);
          res.text.should.contain('must be signed in');
          done();
        });
    });
    it('should succeed if logged in as user', (done) => {
      const req = request.agent(server).get('/service');
      req.cookies = cookie;
      req.end((err, res) => {
        should.not.exist(err);
        res.text.should.contain('Do you have a bed available?');
        done();
      });
    });
  });

  describe.skip('POST /addService', () => {
    it('should create a new service successfully given all the valid details and user is logged in', (done) => {
      const serviceJson = {
        available: '',
        description: 'very good service',
      };
      const req = request.agent(server).post('/service')
      req.cookies = cookie;
      req.send(serviceJson);
    });
  }); 
});
