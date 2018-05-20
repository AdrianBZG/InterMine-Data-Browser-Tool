//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe('Statistics', () => {
/*
  * Test the count of elements per class
  */
  describe('/GET count of HumanMine genes', () => {
      it('it should GET the count of HumanMine genes', (done) => {
        chai.request(server)
            .get('/statistics/count/humanmine/Gene')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('number');
                res.body.should.be.at.least(0);
              done();
            });
      });
	  
	  it('it should GET the count of HumanMine proteins', (done) => {
        chai.request(server)
            .get('/statistics/count/humanmine/Protein')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('number');
                res.body.should.be.at.least(0);
              done();
            });
      });
  });

});