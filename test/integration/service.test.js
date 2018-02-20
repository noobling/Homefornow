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

  describe('POST /addService', () => {
    it('should create a new service successfully given all the valid details and user is logged in', (done) => {
      const serviceJson = {
        name: 'Youth Peoples Care',
        suburb: 'Cannington',
        postcode: 6107,
        state: 'WA',
        lat: 32.0170,
        long: 115.9340,
        minAge: 15,
        maxAge: 20,
        number: '93809316',
        serviceType: 'crisis',
        stayLength: 2,
        available: true,
        website: 'www.rand-web.com',
        uri: 'youth-peoples-care',
        description: 'very good service',
      };
      const req = request.agent(server).post('/addService');
      req.cookies = cookie;
      req.send(serviceJson)
        .redirects(1)
        .end((err, res) => {
          should.not.exist(err);
          res.text.should.contain(serviceJson.description);
          done();
        });
    });
  });
});

describe('routes : services dashboard', () => {
  beforeEach((done) => {
    done();
  });
  afterEach((done) => {
    done();
  });

  describe('GET /service/dashboard/', () => {
    it('Should route correctly (HTTP 200)', (done) => {
      chai.request(server)
        .get('/service/dashboard')
        .end((err, res) => {
          res.redirects.length.should.equal(0);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          done();
        });
    });
  });

  describe('GET /service/dashboard/profile', () => {
    it('Should no longer route corrently (HTTP 404)', (done) => {
      chai.request(server)
        .get('/service/dashboard/profile')
        .end((err, res) => {
          res.redirects.length.should.equal(0);
          res.status.should.equal(404);
          res.type.should.equal('text/html');
          done();
        });
    });
  });
});
