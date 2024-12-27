const chai = require('chai');
const chaiHttp = require('chai-http');
const server = 'http://localhost:3000';
chai.should();

chai.use(chaiHttp);

describe('Product API', () => {
  it('should fetch all products', (done) => {
    chai
      .request(server)
      .get('/api/products')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('success').eql(true);
        res.body.should.have.property('products').be.an('array');
        done();
      });
  });

  it('should fetch a product by ID', (done) => {
    chai
      .request(server)
      .get('/api/products/1')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('success').eql(true);
        res.body.should.have.property('product').be.an('object');
        done();
      });
  });
});
