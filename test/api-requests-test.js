//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
var expect = chai.expect;
let intermine = require('imjs');

chai.use(chaiHttp);

describe('API requests using imjs', () => {
  describe('/Obtain pathway names in a given class should not be empty', () => {	  
	  it('it should get the pathway names inside class Gene in zebrafishmine', (done) => {
        
        var service = new intermine.Service({
            root: 'http://zebrafishmine.org/service'
        }); 
        var query = {
            "from": "Gene",
            "select": ["pathways.name", "primaryIdentifier"],
            "model": {
                "name": "genomic"
            },
            "orderBy": [{
                "path": "pathways.name",
                "direction": "ASC"
            }]
        };

        var pathways = new intermine.Query(query, service),
            pathwaysPath = [query.from, query.select[0]].join('.');
            pathways.summarize(pathwaysPath).then(function(pathwaySummary) {

            //This returns the pathway name and the number of gene rows associated with the pathway
            expect(pathwaySummary).to.be.a('object');
            expect(pathwaySummary).to.include({rootClass: 'Gene'});;
            done();
        });

      });
  });
});