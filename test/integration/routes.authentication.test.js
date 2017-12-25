const chai = require('chai');
const chaiHttp = require('chai-http');
const request = require('supertest');
const users = require('../../seeded_users.json');

const should = chai.should();
chai.use(chaiHttp);

const server = require('../../app');

describe('routes : authentication', () => {
  beforeEach((done) => {
    done();
  });

  afterEach((done) => {
    done();
  });

  describe('POST /login', () => {
    it('should login with valid credentials', (done) => {
      request.agent(server)
        .post('/login')
        .send({
          email: users[0].email,
          password: users[0].password,
        })
        .redirects(1)
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.equal(200);
          res.text.should.contain(`Welcome ${users[0].name}`);
          done();
        });
    });

    it('should fail to login with invalid credentials', (done) => {
      request.agent(server)
        .post('/login')
        .send({
          email: 'randomemail@email.com',
          password: 'invalidpass',
        })
        .redirects(1)
        .expect(200)
        .end((err, res) => {
          should.not.exist(err);
          res.text.should.contain('Incorrect username');
          done();
        });
    });
  });

  describe('GET /404', () => {
    it('should throw an error', (done) => {
      chai.request(server)
        .get('/404')
        .end((err, res) => {
          res.redirects.length.should.equal(0);
          res.status.should.equal(404);
          done();
        });
    });
  });

});
