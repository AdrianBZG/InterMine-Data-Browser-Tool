//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();
let intermine = require('imjs');

chai.use(chaiHttp);

describe('API requests using imjs', () => {
  describe('/Obtain pathway names in a given class should not be empty', () => {	  
	  it('it should get the pathway names inside class Gene in HumanMine', (done) => {
        
        var service = new intermine.Service({
            root: "https://www.humanmine.org/humanmine/service"
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
            pathwaySummary.should.be.a('array');
			pathwaySummary.length.should.be.at.least(1);
            done();
        });

      });
  });
});