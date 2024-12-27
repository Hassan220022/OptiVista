const chai = require('chai');
const chaiHttp = require('chai-http');
const server = 'http://localhost:3000';
chai.should();

chai.use(chaiHttp);

describe('Feedback API', () => {
  it('should add feedback for a product', (done) => {
    chai
      .request(server)
      .post('/api/feedback')
      .send({
        userId: 1,
        productId: 1,
        rating: 5,
        review: 'Great product!',
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('success').eql(true);
        res.body.should.have.property('message').eql('Feedback added successfully');
        done();
      });
  });

  it('should get feedback for a product', (done) => {
    chai
      .request(server)
      .get('/api/feedback/1')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('success').eql(true);
        res.body.should.have.property('feedback').be.an('array');
        done();
      });
  });
});
