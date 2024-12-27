const chai = require('chai');
const chaiHttp = require('chai-http');
const server = 'http://192.168.1.84:3000'; // Update if necessary
chai.should(); // Initialize the should interface

chai.use(chaiHttp);

describe('AR Session API', () => {
  it('should create an AR session', (done) => {
    chai
      .request(server)
      .post('/api/ar')
      .send({
        userId: 1,
        productId: 1,
        snapshots: ['snapshot1.jpg', 'snapshot2.jpg'],
        sessionMetadata: { device: 'iPhone' },
      })
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(200);
        res.body.should.have.property('success').eql(true);
        res.body.should.have.property('sessionId');
        done();
      });
  });

  it('should get AR sessions for a user', (done) => {
    chai
      .request(server)
      .get('/api/ar/1')
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(200);
        res.body.should.have.property('success').eql(true);
        res.body.should.have.property('sessions').be.an('array');
        done();
      });
  });
});
