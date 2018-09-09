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
            .get('/fetch/ontologyterms/httpCOLONSLASHSLASHwww.humanmine.orgSLASHhumanmineSLASHservice/Protein')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.results.should.be.a('array');
				res.body.results.length.should.be.at.least(1);
				done();
            });
      });
	  
	  it('it should GET the listing of ontology terms inside class Gene in HumanMine', (done) => {
        chai.request(server)
            .get('/fetch/ontologyterms/httpCOLONSLASHSLASHwww.humanmine.orgSLASHhumanmineSLASHservice/Gene')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.results.should.be.a('array');
				res.body.results.length.should.be.at.least(1);
				done();
            });
      });
	  
	  it('it should GET the listing of dataset names inside class Protein in HumanMine', (done) => {
        chai.request(server)
            .get('/fetch/datasets/httpCOLONSLASHSLASHwww.humanmine.orgSLASHhumanmineSLASHservice/Protein')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.results.should.be.a('array');
				res.body.results.length.should.be.at.least(1);
				done();
            });
      });
	  
	  it('it should GET the listing of dataset names inside class Gene in HumanMine', (done) => {
        chai.request(server)
            .get('/fetch/datasets/httpCOLONSLASHSLASHwww.humanmine.orgSLASHhumanmineSLASHservice/Gene')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.results.should.be.a('array');
				res.body.results.length.should.be.at.least(1);
				done();
            });
      });
	  
	  it('it should GET the listing of pathway names inside class Protein in HumanMine', (done) => {
        chai.request(server)
            .get('/fetch/pathways/httpCOLONSLASHSLASHwww.humanmine.orgSLASHhumanmineSLASHservice/Protein')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.results.should.be.a('array');
				res.body.results.length.should.be.at.least(1);
				done();
            });
      });
	  
	  it('it should GET the listing of pathway names inside class Gene in HumanMine', (done) => {
        chai.request(server)
            .get('/fetch/pathways/httpCOLONSLASHSLASHwww.humanmine.orgSLASHhumanmineSLASHservice/Gene')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.results.should.be.a('array');
				res.body.results.length.should.be.at.least(1);
				done();
            });
      });
	  
	  it('it should GET the listing of protein domain names inside HumanMine', (done) => {
        chai.request(server)
            .get('/fetch/proteindomainname/httpCOLONSLASHSLASHwww.humanmine.orgSLASHhumanmineSLASHservice')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.results.should.be.a('array');
				res.body.results.length.should.be.at.least(1);
				done();
            });
      });
	  
	  it('it should GET the listing of Participant 2 Gene symbols inside HumanMine', (done) => {
        chai.request(server)
            .get('/fetch/participant2genesymbols/httpCOLONSLASHSLASHwww.humanmine.orgSLASHhumanmineSLASHservice')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.results.should.be.a('array');
				res.body.results.length.should.be.at.least(1);
				done();
            });
      });
	  
	  it('it should GET the listing of Diseases Names inside HumanMine', (done) => {
        chai.request(server)
            .get('/fetch/diseases/httpCOLONSLASHSLASHwww.humanmine.orgSLASHhumanmineSLASHservice/Gene')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.results.should.be.a('array');
				res.body.results.length.should.be.at.least(1);
				done();
            });
      });
	  
	  it('it should GET the listing of Alleles types inside HumanMine', (done) => {
        chai.request(server)
            .get('/fetch/allelestype/httpCOLONSLASHSLASHwww.humanmine.orgSLASHhumanmineSLASHservice/Gene')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.results.should.be.a('array');
				res.body.results.length.should.be.at.least(1);
				done();
            });
      });
	  
	  it('it should GET the listing of Alleles Clinical Significance inside HumanMine', (done) => {
        chai.request(server)
            .get('/fetch/clinicalsignificance/httpCOLONSLASHSLASHwww.humanmine.orgSLASHhumanmineSLASHservice/Gene')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.results.should.be.a('array');
				res.body.results.length.should.be.at.least(1);
				done();
            });
      });

      it('it should GET the listing of Protein Atlas Expression Cell Types inside HumanMine', (done) => {
        chai.request(server)
            .get('/fetch/proteinatlascelltypes/httpCOLONSLASHSLASHwww.humanmine.orgSLASHhumanmineSLASHservice/Gene')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.results.should.be.a('array');
                res.body.results.length.should.be.at.least(1);
                done();
            });
      });

      it('it should GET the listing of Protein Atlas Expression Tissue Names inside HumanMine', (done) => {
        chai.request(server)
            .get('/fetch/proteinatlastissuenames/httpCOLONSLASHSLASHwww.humanmine.orgSLASHhumanmineSLASHservice/Gene')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.results.should.be.a('array');
                res.body.results.length.should.be.at.least(1);
                done();
            });
      });

      it('it should GET the Gene Length summary inside a mine', (done) => {
        chai.request(server)
            .get('/fetch/genelength/httpCOLONSLASHSLASHwww.humanmine.orgSLASHhumanmineSLASHservice/Gene')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.results.should.be.a('array');
                res.body.results.length.should.be.at.least(1);
                done();
            });
      });
  });
});