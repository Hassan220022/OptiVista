const chai = require('chai');
const chaiHttp = require('chai-http');
const server = 'http://localhost:3000';
chai.should();

chai.use(chaiHttp);

describe('Auth API', () => {
  it('should register a new user', (done) => {
    chai
      .request(server)
      .post('/api/auth/register')
      .send({
        username: 'test_user',
        email: 'test_user@example.com',
        password: 'StrongPassword123',
        role: 'customer',
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('success').eql(true);
        res.body.should.have.property('user');
        done();
      });
  });

  it('should login a user', (done) => {
    chai
      .request(server)
      .post('/api/auth/login')
      .send({
        email: 'test_user@example.com',
        password: 'StrongPassword123',
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('success').eql(true);
        res.body.should.have.property('token');
        done();
      });
  });
});
