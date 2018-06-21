var express = require('express');
var imjs = require('imjs');
var request = require('request');
var router = express.Router();

/* GET Pathway Names from HumanMine inside a class (parameter). */
router.get('/pathways/humanmine/:classname', function(req, res, next) {
    var className = req.params.classname;

    if (className != "Protein" && className != "Gene") {
        res.status(500).send('You need to specify a valid class: Protein, Gene');
    }

    var service = new imjs.Service({
        root: 'http://www.humanmine.org/humanmine/service'
    });

    var query = {
        "from": className,
        "select": ["pathways.name", "primaryIdentifier"],
        "model": {
            "name": "genomic"
        },
        "orderBy": [{
            "path": "pathways.name",
            "direction": "ASC"
        }]
    };

    var pathways = new imjs.Query(query, service),
        pathwaysPath = [query.from, query.select[0]].join('.');
    pathways.summarize(pathwaysPath).then(function(pathwaySummary) {
        //This returns the pathway name and the number of gene rows associated with the pathway
        res.json(pathwaySummary);
    });
});

/* GET Datasets Names from HumanMine inside a class (parameter). */
router.get('/datasets/humanmine/:classname', function(req, res, next) {
    var className = req.params.classname;

    if (className != "Protein" && className != "Gene") {
        res.status(500).send('You need to specify a valid class: Protein, Gene');
    }

    var service = new imjs.Service({
        root: 'http://www.humanmine.org/humanmine/service'
    });

    var query = {
        "from": className,
        "select": ["dataSets.name", "primaryIdentifier"],
        "model": {
            "name": "genomic"
        },
        "orderBy": [{
            "path": "dataSets.name",
            "direction": "ASC"
        }]
    };

    var datasets = new imjs.Query(query, service),
        datasetsPath = [query.from, query.select[0]].join('.');
    datasets.summarize(datasetsPath).then(function(datasetSummary) {
        res.json(datasetSummary);
    });
});

/* GET Ontology Terms from HumanMine inside a class (parameter). */
router.get('/ontologyterms/humanmine/:classname', function(req, res, next) {
    var className = req.params.classname;

    if (className != "Protein" && className != "Gene") {
        res.status(500).send('You need to specify a valid class: Protein, Gene');
    }

    var service = new imjs.Service({
        root: 'http://www.humanmine.org/humanmine/service'
    });

    if (className == "Gene") {
        var query = {
            "from": className,
            "select": ["goAnnotation.ontologyTerm.name", "primaryIdentifier"],
            "model": {
                "name": "genomic"
            },
            "orderBy": [{
                "path": "goAnnotation.ontologyTerm.name",
                "direction": "ASC"
            }]
        };

        var goterms = new imjs.Query(query, service),
            gotermsPath = [query.from, query.select[0]].join('.');
        goterms.summarize(gotermsPath).then(function(gotermSummary) {
            res.json(gotermSummary);
        });

    }

    if (className == "Protein") {
        var query = {
            "from": className,
            "select": ["ontologyAnnotations.ontologyTerm.name", "primaryIdentifier"],
            "model": {
                "name": "genomic"
            },
            "orderBy": [{
                "path": "ontologyAnnotations.ontologyTerm.name",
                "direction": "ASC"
            }]
        };

        var goterms = new imjs.Query(query, service),
            gotermsPath = [query.from, query.select[0]].join('.');
        goterms.summarize(gotermsPath).then(function(gotermSummary) {
            res.json(gotermSummary);
        });
    }
});

module.exports = router;