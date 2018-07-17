var express = require('express');
var imjs = require('imjs');
var request = require('request');
var router = express.Router();

/**
 * GET endpoint to retrieve the count of items per class in HumanMine.
 */
router.get('/count/primary/:mineUrl', function(req, res, next) {
    var mineUrl = req.params.mineUrl.replace(/_/g,":").replace(/-/g,"/");

    var result = []

    var service = new imjs.Service({
        root: mineUrl
    });

    var query = {
        "from": 'Gene',
        "select": ['primaryIdentifier']
    };

    service.count(query).then(function(response) {
        result.push({
            "name": "Gene",
            "count": response
        });
        var query = {
            "from": 'Protein',
            "select": ['primaryIdentifier']
        };
        service.count(query).then(function(response) {
            result.push({
                "name": "Protein",
                "count": response
            });
            res.json(result);
        })

    })
});

/**
 * POST count of items inside a class (parameter) using custom constraints in HumanMine
 */
router.post('/count/items/:mineUrl/:classname', function(req, res, next) {	
	var constraints = req.body;	
    var className = req.params.classname;
    var mineUrl = req.params.mineUrl.replace(/_/g,":").replace(/-/g,"/");

    if (className != "Protein" && className != "Gene") {
        res.status(500).send('You need to specify a valid class: Protein, Gene');
    }

    var result = []

    var service = new imjs.Service({
        root: mineUrl
    });

    if (className == "Gene") {
        var query = {
            "from": 'Gene',
            "select": ['primaryIdentifier'],
            "model": {
                'name': 'genomic'
            },
			"where": constraints
        };

        var q = new imjs.Query(query, service);

        q.summarize("Gene.organism.shortName", 10)
            .then(function(response) {
                result.push({
                    "itemName": "Organism short name",
                    "response": response
                });
				res.json(result);
            }).catch(function(error) {
                console.log('error');
                console.log(error.message);
            });

    }

    if (className == "Protein") {
        var query = {
            "from": 'Protein',
            "select": ['primaryIdentifier'],
            "model": {
                'name': 'genomic'
            },
			"where": constraints
        };

        var q = new imjs.Query(query, service);

        q.summarize("Protein.organism.shortName", 10)
            .then(function(response) {
                result.push({
                    "itemName": "Organism short name",
                    "response": response
                });
                res.json(result);
            }).catch(function(error) {
                console.log('error');
                console.log(error.message);
            });
    }

});

/**
 * GET count of items inside a class (parameter) in HumanMine
 */
router.get('/count/items/:mineUrl/:classname', function(req, res, next) {	
    var className = req.params.classname;
    var mineUrl = req.params.mineUrl.replace(/_/g,":").replace(/-/g,"/");

    if (className != "Protein" && className != "Gene") {
        res.status(500).send('You need to specify a valid class: Protein, Gene');
    }

    var result = []

    var service = new imjs.Service({
        root: mineUrl
    });

    if (className == "Gene") {
        var query = {
            "from": 'Gene',
            "select": ['primaryIdentifier'],
            "model": {
                'name': 'genomic'
            }
        };

        var q = new imjs.Query(query, service);

        q.summarize("Gene.organism.shortName", 10)
            .then(function(response) {
                result.push({
                    "itemName": "Organism short name",
                    "response": response
                });
				res.json(result);
            }).catch(function(error) {
                console.log('error');
                console.log(error.message);
            });

    }

    if (className == "Protein") {
        var query = {
            "from": 'Protein',
            "select": ['primaryIdentifier'],
            "model": {
                'name': 'genomic'
            }
        };

        var q = new imjs.Query(query, service);

        q.summarize("Protein.organism.shortName", 10)
            .then(function(response) {
                result.push({
                    "itemName": "Organism short name",
                    "response": response
                });
                res.json(result);
            }).catch(function(error) {
                console.log('error');
                console.log(error.message);
            });
    }

});

module.exports = router;