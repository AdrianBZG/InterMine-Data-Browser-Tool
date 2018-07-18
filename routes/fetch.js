var express = require('express');
var imjs = require('imjs');
var request = require('request');
var router = express.Router();
var jsdom = require("jsdom");
const {
    JSDOM
} = jsdom;
const {
    document
} = (new JSDOM('<!doctype html><html><body></body></html>')).window;
global.document = document;
global.window = document.defaultView;
var $ = require('jquery');

/**
 * GET Pathway Names from HumanMine inside a class (parameter)
 */
router.get('/pathways/:mineUrl/:classname', function(req, res, next) {
    var className = req.params.classname;
    var mineUrl = req.params.mineUrl.replace(/_/g, ":").replace(/-/g, "/");

    if (className != "Protein" && className != "Gene") {
        res.status(500).send('You need to specify a valid class: Protein, Gene');
    }

    var service = new imjs.Service({
        root: mineUrl
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

/**
 * GET Protein Atlas Expression Tissue Names from HumanMine inside a class (parameter)
 */
router.get('/proteinatlastissuenames/:mineUrl/:classname', function(req, res, next) {
    var className = req.params.classname;
    var mineUrl = req.params.mineUrl.replace(/_/g, ":").replace(/-/g, "/");

    if (className != "Protein" && className != "Gene") {
        res.status(500).send('You need to specify a valid class: Protein, Gene');
    }

    var service = new imjs.Service({
        root: mineUrl
    });

    var query = {
        "from": className,
        "select": ["proteinAtlasExpression.tissue.name", "primaryIdentifier"],
        "model": {
            "name": "genomic"
        },
        "orderBy": [{
            "path": "proteinAtlasExpression.tissue.name",
            "direction": "ASC"
        }]
    };

    var theQuery = new imjs.Query(query, service),
        queryPath = [query.from, query.select[0]].join('.');
    theQuery.summarize(queryPath).then(function(querySummary) {
        res.json(querySummary);
    });
});

/**
 * GET Protein Atlas Expression Cell Types from HumanMine inside a class (parameter)
 */
router.get('/proteinatlascelltypes/:mineUrl/:classname', function(req, res, next) {
    var className = req.params.classname;
    var mineUrl = req.params.mineUrl.replace(/_/g, ":").replace(/-/g, "/");

    if (className != "Protein" && className != "Gene") {
        res.status(500).send('You need to specify a valid class: Protein, Gene');
    }

    var service = new imjs.Service({
        root: mineUrl
    });

    var query = {
        "from": className,
        "select": ["proteinAtlasExpression.cellType", "primaryIdentifier"],
        "model": {
            "name": "genomic"
        },
        "orderBy": [{
            "path": "proteinAtlasExpression.cellType",
            "direction": "ASC"
        }]
    };

    var theQuery = new imjs.Query(query, service),
        queryPath = [query.from, query.select[0]].join('.');
    theQuery.summarize(queryPath).then(function(querySummary) {
        res.json(querySummary);
    });
});

/**
 * GET Clinical Significance values from HumanMine inside a class (parameter)
 */
router.get('/clinicalsignificance/:mineUrl/:classname', function(req, res, next) {
    var className = req.params.classname;
    var mineUrl = req.params.mineUrl.replace(/_/g, ":").replace(/-/g, "/");

    if (className != "Protein" && className != "Gene") {
        res.status(500).send('You need to specify a valid class: Protein, Gene');
    }

    var service = new imjs.Service({
        root: mineUrl
    });

    var query = {
        "from": className,
        "select": ["alleles.clinicalSignificance", "primaryIdentifier"],
        "model": {
            "name": "genomic"
        },
        "orderBy": [{
            "path": "alleles.clinicalSignificance",
            "direction": "ASC"
        }]
    };

    var theQuery = new imjs.Query(query, service),
        queryPath = [query.from, query.select[0]].join('.');
    theQuery.summarize(queryPath).then(function(querySummary) {
        //This returns the pathway name and the number of gene rows associated with the pathway
        res.json(querySummary);
    });
});

/**
 * GET Alleles Type values from HumanMine inside a class (parameter)
 */
router.get('/allelestype/:mineUrl/:classname', function(req, res, next) {
    var className = req.params.classname;
    var mineUrl = req.params.mineUrl.replace(/_/g, ":").replace(/-/g, "/");

    if (className != "Protein" && className != "Gene") {
        res.status(500).send('You need to specify a valid class: Protein, Gene');
    }

    var service = new imjs.Service({
        root: mineUrl
    });

    var query = {
        "from": className,
        "select": ["alleles.type", "primaryIdentifier"],
        "model": {
            "name": "genomic"
        },
        "orderBy": [{
            "path": "alleles.type",
            "direction": "ASC"
        }]
    };

    var theQuery = new imjs.Query(query, service),
        queryPath = [query.from, query.select[0]].join('.');
    theQuery.summarize(queryPath).then(function(querySummary) {
        //This returns the pathway name and the number of gene rows associated with the pathway
        res.json(querySummary);
    });
});

/**
 * GET Diseases Names from HumanMine inside a class (parameter)
 */
router.get('/diseases/:mineUrl/:classname', function(req, res, next) {
    var className = req.params.classname;
    var mineUrl = req.params.mineUrl.replace(/_/g, ":").replace(/-/g, "/");

    if (className != "Protein" && className != "Gene") {
        res.status(500).send('You need to specify a valid class: Protein, Gene');
    }

    var service = new imjs.Service({
        root: mineUrl
    });

    var query = {
        "from": className,
        "select": ["diseases.name", "primaryIdentifier"],
        "model": {
            "name": "genomic"
        },
        "orderBy": [{
            "path": "diseases.name",
            "direction": "ASC"
        }]
    };

    var diseases = new imjs.Query(query, service),
        diseasesPath = [query.from, query.select[0]].join('.');
    diseases.summarize(diseasesPath).then(function(diseasesSummary) {
        //This returns the pathway name and the number of gene rows associated with the pathway
        res.json(diseasesSummary);
    });
});

/**
 * GET Datasets Names from HumanMine inside a class (parameter)
 */
router.get('/datasets/:mineUrl/:classname', function(req, res, next) {
    var className = req.params.classname;
    var mineUrl = req.params.mineUrl.replace(/_/g, ":").replace(/-/g, "/");

    if (className != "Protein" && className != "Gene") {
        res.status(500).send('You need to specify a valid class: Protein, Gene');
    }

    var service = new imjs.Service({
        root: mineUrl
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

/**
 * GET Ontology Terms from HumanMine inside a class (parameter)
 */
router.get('/ontologyterms/:mineUrl/:classname', function(req, res, next) {
    var className = req.params.classname;
    var mineUrl = req.params.mineUrl.replace(/_/g, ":").replace(/-/g, "/");

    if (className != "Protein" && className != "Gene") {
        res.status(500).send('You need to specify a valid class: Protein, Gene');
    }

    var service = new imjs.Service({
        root: mineUrl
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

/**
 * GET Protein Domain Name from HumanMine
 */
router.get('/proteindomainname/:mineUrl', function(req, res, next) {
    var mineUrl = req.params.mineUrl.replace(/_/g, ":").replace(/-/g, "/");

    var service = new imjs.Service({
        root: mineUrl
    });


    var query = {
        "from": "Gene",
        "select": ["proteins.proteinDomainRegions.proteinDomain.name", "primaryIdentifier"],
        "model": {
            "name": "genomic"
        },
        "orderBy": [{
            "path": "proteins.proteinDomainRegions.proteinDomain.name",
            "direction": "ASC"
        }]
    };

    var protdomname = new imjs.Query(query, service),
        protdomnamePath = [query.from, query.select[0]].join('.');
    protdomname.summarize(protdomnamePath).then(function(protdomnameSummary) {
        res.json(protdomnameSummary);
    });


});

/**
 * GET Interaction Participant 2 Gene Symbol from HumanMine
 */
router.get('/participant2genesymbols/:mineUrl', function(req, res, next) {
    var mineUrl = req.params.mineUrl.replace(/_/g, ":").replace(/-/g, "/");

    var service = new imjs.Service({
        root: mineUrl
    });

    var query = {
        "from": "Gene",
        "select": ["interactions.participant2.symbol"],
        "model": {
            "name": "genomic"
        },
        "orderBy": [{
            "path": "interactions.participant2.symbol",
            "direction": "ASC"
        }]
    };

    var part2genesymbol = new imjs.Query(query, service),
        part2genesymbolPath = [query.from, query.select[0]].join('.');
    part2genesymbol.summarize(part2genesymbolPath).then(function(part2genesymbolSummary) {
        res.json(part2genesymbolSummary);
    });


});

module.exports = router;