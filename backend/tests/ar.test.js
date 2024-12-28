import dotenv from 'dotenv';
dotenv.config();

import { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../index.js';

chai.use(chaiHttp);

describe('AR API', () => {
  it('should create a new AR session', (done) => {
    chai.request(app)
      .post('/api/ar/')
      .set('Authorization', `Bearer your_jwt_token`)
      .send({ /* AR session data */ })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('success', true);
        expect(res.body.data).to.be.an('object');
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
