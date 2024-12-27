const chai = require('chai');
const chaiHttp = require('chai-http');
const server = 'http://localhost:3000';
chai.should();

chai.use(chaiHttp);

describe('Order API', () => {
  it('should create a new order', (done) => {
    chai
      .request(server)
      .post('/api/orders')
      .send({
        userId: 1,
        items: [{ productId: 1, quantity: 2, price: 99.99 }],
        shippingAddress: '123 Main St',
        paymentMethod: 'credit_card',
      })
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(200);
        res.body.should.have.property('success').eql(true);
        res.body.should.have.property('orderId');
        done();
      }); 
  });

  it('should get orders for a user', (done) => {
    chai
      .request(server)
      .get('/api/orders/1')
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(200);
        res.body.should.have.property('success').eql(true);
        res.body.should.have.property('orders').be.an('array');
        done();
      });
  });
});
