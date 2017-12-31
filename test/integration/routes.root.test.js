process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

const server = require('../../app');

describe('routes : index', () => {

  beforeEach((done) => {
    done();
  });

  afterEach((done) => {
    done();
  });

  describe('GET /', () => {
    it('should render the index', (done) => {
      chai.request(server)
        .get('/')
        .end((err, res) => {
          res.redirects.length.should.equal(0);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('<h1>Do you have a secure place to stay?</h1>');
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

after((done) => {
  done();
  // Done with the tests time to close. This should be placed in the last test file
  process.exit();
});
