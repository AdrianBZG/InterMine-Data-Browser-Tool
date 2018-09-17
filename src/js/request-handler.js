/**
 * Method to get the different intermines names and URLs from the registry
 * @returns {array} an array with the server response containing the different intermines with their URLs
 */
function getIntermines() {
    return $.ajax({
        url: 'http://registry.intermine.org/service/instances?mines=%27prod%27',
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
            console.log('Error');
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
 * Method to get the different items inside a class (count per organism) in order to feed the sidebar
 * @param {array} constraints: the constraints for the endpoint call
 * @returns {array} an array with the server response containing the different items in a class
 */
function getItemsInClass(constraints) {
    return $.ajax({
        url: '/statistics/count/items/' + window.mineUrl + '/' + sessionStorage.getItem('currentClassView'),
        type: 'POST',
        data: JSON.stringify(constraints),
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
function getGeneLengthsInClass(constraints) {
    return $.ajax({
        url: '/statistics/genelength/' + window.mineUrl + '/' + sessionStorage.getItem('currentClassView'),
        type: 'POST',
        data: JSON.stringify(constraints),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        error: function(e) {
            console.log(e);
        },
        success: function(data) {}
    })
}