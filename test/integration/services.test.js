process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

const server = require('../../app');

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
    it('Should route correctly (HTTP 200)', (done) => {
      chai.request(server)
        .get('/service/dashboard/profile')
        .end((err, res) => {
          res.redirects.length.should.equal(0);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          done();
        });
    });
  });
});
