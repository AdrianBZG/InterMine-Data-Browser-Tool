/**
 * Method to get the different intermines names and URLs from the registry
 * @returns {array} an array with the server response containing the different intermines with their URLs
 */
function getIntermines() {
    return $.ajax({
        url: 'https://registry.intermine.org/service/instances?mines=%27prod%27',
        type: 'GET',
        error: function(e) {
            console.log(e);
        },
        success: function(data) {}
    })
}

/**
 * Method to get the different ontology terms inside a class in order to feed the typeahead
 * @returns {array} an array with the server response containing the different ontology terms
 */
function getOntologyTermsInClass() {
    return $.ajax({
        url: '/fetch/ontologyterms/' + window.mineUrl + '/' + sessionStorage.getItem('currentClassView'),
        type: 'GET',
        error: function(e) {
            console.log(e);
        },
        success: function(data) {}
    })
}

/**
 * Method to get the different alleles clinical significance inside a class in order to feed the typeahead
 * @returns {array} an array with the server response containing the different alleles clinical significances
 */
function getAllelesClinicalSignifanceInClass() {
    return $.ajax({
        url: '/fetch/clinicalsignificance/' + window.mineUrl + '/' + sessionStorage.getItem('currentClassView'),
        type: 'GET',
        error: function(e) {
            console.log(e);
        },
        success: function(data) {}
    })
}

/**
 * Method to get the different protein atlas expression cell types inside a class in order to feed the typeahead
 * @returns {array} an array with the server response containing the different protein atlas expression cell types
 */
function getProteinAtlasExpressionCellTypesInClass() {
    return $.ajax({
        url: '/fetch/proteinatlascelltypes/' + window.mineUrl + '/' + sessionStorage.getItem('currentClassView'),
        type: 'GET',
        error: function(e) {
            console.log(e);
        },
        success: function(data) {}
    })
}

/**
 * Method to get the different protein atlas expression tissue names inside a class in order to feed the typeahead
 * @returns {array} an array with the server response containing the different protein atlas expression tissue names
 */
function getProteinAtlasExpressionTissueNamesInClass() {
    return $.ajax({
        url: '/fetch/proteinatlastissuenames/' + window.mineUrl + '/' + sessionStorage.getItem('currentClassView'),
        type: 'GET',
        error: function(e) {
            console.log(e);
        },
        success: function(data) {}
    })
}

/**
 * Method to get the different alleles types inside a class in order to feed the typeahead
 * @returns {array} an array with the server response containing the different alleles types
 */
function getAllelesTypesInClass() {
    return $.ajax({
        url: '/fetch/allelestype/' + window.mineUrl + '/' + sessionStorage.getItem('currentClassView'),
        type: 'GET',
        error: function(e) {
            console.log(e);
        },
        success: function(data) {}
    })
}

/**
 * Method to get the different dataset names inside a class in order to feed the typeahead
 * @returns {array} an array with the server response containing the different dataset names
 */
function getDatasetNamesInClass() {
    return $.ajax({
        url: '/fetch/datasets/' + window.mineUrl + '/' + sessionStorage.getItem('currentClassView'),
        type: 'GET',
        error: function(e) {
            console.log(e);
        },
        success: function(data) {}
    })
}

/**
 * Method to get the different pathway names inside a class in order to feed the typeahead
 * @returns {array} an array with the server response containing the different pathway names
 */
function getPathwayNamesInClass() {
    return $.ajax({
        url: '/fetch/pathways/' + window.mineUrl + '/' + sessionStorage.getItem('currentClassView'),
        type: 'GET',
        error: function(e) {
            console.log(e);
        },
        success: function(data) {}
    })
}

/**
 * Method to get the different diseases names inside a class in order to feed the typeahead
 * @returns {array} an array with the server response containing the different diseases names
 */
function getDiseasesNamesInClass() {
    return $.ajax({
        url: '/fetch/diseases/' + window.mineUrl + '/' + sessionStorage.getItem('currentClassView'),
        type: 'GET',
        error: function(e) {
            console.log(e);
        },
        success: function(data) {}
    })
}

/**
 * Method to get the different protein domain names inside a class in order to feed the typeahead
 * @returns {array} an array with the server response containing the different protein domain names
 */
function getProteinDomainNamesInClass() {
    return $.ajax({
        url: '/fetch/proteindomainname/' + window.mineUrl,
        type: 'GET',
        error: function(e) {
            console.log(e);
        },
        success: function(data) {}
    })
}

/**
 * Method to get the different Participant 2 gene symbols in order to feed the typeahead
 * @returns {array} an array with the server response containing the different participant 2 gene symbols in Interactions
 */
function getParticipant2SymbolsInClass() {
    return $.ajax({
        url: '/fetch/participant2genesymbols/' + window.mineUrl,
        type: 'GET',
        error: function(e) {
            console.log(e);
        },
        success: function(data) {}
    })
}

/**
* Method that returns a valid session API key for the current mine
*/
function getSessionToken() {

    // Check if the user has a session token in Local Storage, for this mine
    if (typeof(Storage) !== "undefined") {
        if (localStorage.getItem("api-keys")) {
            var apiKeysObject = JSON.parse(localStorage.getItem("api-keys"));
            if(findElementJSONarray(apiKeysObject, "mine", window.selectedMineName)) {
                var apiKeyForThisMine = findElementJSONarray(apiKeysObject, "mine", window.selectedMineName)["apikey"];
                if(apiKeyForThisMine && apiKeyForThisMine != "" && apiKeyForThisMine != "Paste your API key here") {
                    // Change the added/not added API key icon
                    $("#APIKeyIconNotAdded").hide();
                    $("#APIKeyIconAdded").show();
                    return apiKeyForThisMine;
                }
            }
        }
    }

    // Otherwise get a public one from the session route
    var tokenUrl = escapeMineURL(window.mineUrl);
    var tokenKey = "";

    if(tokenUrl.slice(-1) == "/") {
        tokenUrl += "session";
    } else {
        tokenUrl += "/session";
    }

    // Get token
    $.ajax({
        'url': tokenUrl,
        data: {},
        async: false,
        error: function(xhr, status) {},
        success: function(data) {
            tokenKey = data.token;
        }
    });

    return tokenKey;
}

/**
 * Method to get the model of a mine given its query service
 * @returns {array} an array with the server response with the mine model
 */
function getMineModel(serviceUrl) {
    return $.ajax({
        url: serviceUrl,
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        error: function(e) {
            console.log(e);
        },
        success: function(data) {}
    })
}

/**
 * Method to get the summary of gene length inside a class (in buckets) in order to feed the bar graph
 * @param {array} constraints: the constraints for the endpoint call
 * @returns {array} an array with the server response containing the summaries
 */
function getGeneLengthsInClass(className, constraints) {
    return new Promise((resolve, reject) => {
        var service = new imjs.Service({
            root: escapeMineURL(window.mineUrl)
        });

        var query = {
            "constraintLogic": "(A OR B OR C OR D OR E OR F OR G OR H OR I OR J) AND (K) AND (L) AND (M) AND (N) AND (O) AND (P) AND (Q) AND (R) AND (O AND S) AND (T AND U AND V) AND (W AND X AND Y AND Z)",
            "from": className,
            "select": ["length", "primaryIdentifier"],
            "model": {
                "name": "genomic"
            },
            "where": constraints,
            "orderBy": [{
                "path": "length",
                "direction": "ASC"
            }]
        };

        var genelengths = new imjs.Query(query, service),
        genelengthsPath = [query.from, query.select[0]].join('.');
            genelengths.summarize(genelengthsPath).then(function(genelengthsSummary) {
            //This returns the gene length and the number of gene rows associated with the gene length
            resolve(genelengthsSummary);
        }).catch(function(error) {
            reject(error.message);
        });
    });
}

/**
 * Method to get the different items inside a class (count per organism) in order to feed the sidebar
 * @param {array} constraints: the constraints for the endpoint call
 * @returns {array} an array with the server response containing the different items in a class
 */
function getItemsInClass(className, constraints) {
    return new Promise((resolve, reject) => {
        var result = [];
        
        var service = new imjs.Service({
            root: escapeMineURL(window.mineUrl)
        });

        if (className == "Gene") {
            var query = {
                "constraintLogic": "(A OR B OR C OR D OR E OR F OR G OR H OR I OR J) AND (K) AND (L) AND (M) AND (N) AND (O) AND (P) AND (Q) AND (R) AND (O AND S) AND (T AND U AND V) AND (W AND X AND Y AND Z)",
                "from": 'Gene',
                "select": ['primaryIdentifier'],
                "model": {
                    'name': 'genomic'
                },
                "where": constraints
            };

            var q = new imjs.Query(query, service);

            q.summarize("Gene.organism.shortName", 50)
                .then(function(response) {
                    result.push({
                        "itemName": "Organism short name",
                        "response": response
                    });
                    resolve(result);
                }).catch(function(error) {
                    reject(error.message);
                });

        }

        if (className == "Protein") {
            var query = {
                "constraintLogic": "(A OR B OR C OR D OR E OR F OR G OR H OR I OR J) AND (K) AND (L) AND (M) AND (N) AND (O) AND (P) AND (Q) AND (R) AND (O AND S) AND (T AND U AND V) AND (W AND X AND Y AND Z)",
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
                    resolve(result);
                }).catch(function(error) {
                    reject(error.message);
                });
        }
    })
}

function getPhenotypeNames() {
    return $.ajax({
        url: '/fetch/phenotypes/' + window.mineUrl,
        type: 'GET',
        error: function(e) {
            console.log(e);
        },
        success: function(data) {}
    })
}

/**
 * Method to get the summary of gene length inside a class (in buckets) in order to feed the bar graph
 * @param {array} constraints: the constraints for the endpoint call
 * @returns {array} an array with the server response containing the summaries
 */
function getSavedLists() {
    var hm = window.interminesHashMap;
    var apiKey;
    for(var i = 0; i < hm.length; ++i) {
        var mineData = hm[i];
        if(window.formatMineURL(mineData.mineurl) === window.mineUrl) {
            var apiKeyArray = JSON.parse(localStorage.getItem('api-keys'));
            for(var j = 0; j < apiKeyArray.length; ++j) {
                if(mineData.mine === apiKeyArray[j].mine) {
                    apiKey = apiKeyArray[j].apikey;
                    break;
                }
            }
        }
    }
    
    return $.ajax({
        url: '/fetch/lists/' + window.mineUrl,
        type: 'POST', 
        body: JSON.stringify({
            token: apiKey
        }),
        error: function(e){
            console.log(e);
        },
        success: function(data) {}
    });
}