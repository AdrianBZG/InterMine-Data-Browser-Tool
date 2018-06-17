var express = require('express');
var imjs = require('imjs');
var request = require('request');
var router = express.Router();

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
        "select": "dataSets.name",
        "orderBy": [{
            "path": "dataSets.name",
            "direction": "ASC"
        }]
    };

    service.rows(query).then(function(rows) {
        res.json(rows);
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
            "select": "goAnnotation.ontologyTerm.name",
            "orderBy": [{
                "path": "goAnnotation.ontologyTerm.name",
                "direction": "ASC"
            }]
        };

        service.rows(query).then(function(rows) {
            res.json(rows);
        });

    }

    if (className == "Protein") {
        var query = {
            "from": className,
            "select": "ontologyAnnotations.ontologyTerm.name",
            "orderBy": [{
                "path": "ontologyAnnotations.ontologyTerm.name",
                "direction": "ASC"
            }]
        };

        service.rows(query).then(function(rows) {
            res.json(rows);
        });
    }
});

module.exports = router;