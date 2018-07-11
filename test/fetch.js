//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();

chai.use(chaiHttp);

describe('Fetch', () => {
  describe('/GET listing of ontology terms of HumanMine primary classes', () => {	  
	  it('it should GET the listing of ontology terms inside class Protein in HumanMine', (done) => {
        chai.request(server)
            .get('/fetch/ontologyterms/humanmine/Protein')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.results.should.be.a('array');
				res.body.results.length.should.be.at.least(1);
				done();
            });
      });
	  
	  it('it should GET the listing of ontology terms inside class Gene in HumanMine', (done) => {
        chai.request(server)
            .get('/fetch/ontologyterms/humanmine/Gene')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.results.should.be.a('array');
				res.body.results.length.should.be.at.least(1);
				done();
            });
      });
	  
	  it('it should GET the listing of dataset names inside class Protein in HumanMine', (done) => {
        chai.request(server)
            .get('/fetch/datasets/humanmine/Protein')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.results.should.be.a('array');
				res.body.results.length.should.be.at.least(1);
				done();
            });
      });
	  
	  it('it should GET the listing of dataset names inside class Gene in HumanMine', (done) => {
        chai.request(server)
            .get('/fetch/datasets/humanmine/Gene')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.results.should.be.a('array');
				res.body.results.length.should.be.at.least(1);
				done();
            });
      });
	  
	  it('it should GET the listing of pathway names inside class Protein in HumanMine', (done) => {
        chai.request(server)
            .get('/fetch/pathways/humanmine/Protein')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.results.should.be.a('array');
				res.body.results.length.should.be.at.least(1);
				done();
            });
      });
	  
	  it('it should GET the listing of pathway names inside class Gene in HumanMine', (done) => {
        chai.request(server)
            .get('/fetch/pathways/humanmine/Gene')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.results.should.be.a('array');
				res.body.results.length.should.be.at.least(1);
				done();
            });
      });
	  
	  it('it should GET the listing of protein domain names inside HumanMine', (done) => {
        chai.request(server)
            .get('/fetch/proteindomainname/humanmine')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.results.should.be.a('array');
				res.body.results.length.should.be.at.least(1);
				done();
            });
      });
	  
	  it('it should GET the listing of Participant 2 Gene symbols inside HumanMine', (done) => {
        chai.request(server)
            .get('/fetch/participant2genesymbols/humanmine')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.results.should.be.a('array');
				res.body.results.length.should.be.at.least(1);
				done();
            });
      });
	  
	  it('it should GET the listing of Diseases Names inside HumanMine', (done) => {
        chai.request(server)
            .get('/fetch/diseases/humanmine/Gene')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.results.should.be.a('array');
				res.body.results.length.should.be.at.least(1);
				done();
            });
      });
	  
	  it('it should GET the listing of Alleles types inside HumanMine', (done) => {
        chai.request(server)
            .get('/fetch/allelestype/humanmine/Gene')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.results.should.be.a('array');
				res.body.results.length.should.be.at.least(1);
				done();
            });
      });
	  
	  it('it should GET the listing of Alleles Clinical Significance inside HumanMine', (done) => {
        chai.request(server)
            .get('/fetch/clinicalsignificance/humanmine/Gene')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.results.should.be.a('array');
				res.body.results.length.should.be.at.least(1);
				done();
            });
      });
  });

});