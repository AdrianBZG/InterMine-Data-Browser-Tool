$(document).ready(function() {
    checkForHTTPS();
    initializeStartupConfiguration();
});

/**
 * This method checks if the user is using HTTPS protocol to access the browser in order to show an informative warning
 */
function checkForHTTPS() {
    if (window.location.protocol.includes("https")) {
        $("#navbarResponsive").prepend("<div class='alert' id='httpsAlert'><span class='closebtn' id='closeHttpsMessage'>×</span>You are currently viewing the HTTPS website. Due to security limitations, we are unable to show results from HTTP-only InterMines. You may be able to see more results if you <a href='http://im-browser-prototype.herokuapp.com/'>reload this site</a> via HTTP.</div><br/>");

        $("#closeHttpsMessage").click(function() {
            $("#httpsAlert").hide();
        });
    }
}

/**
 * This method initialies the global variables used for the filters, reads the JSON filters config
 * and handles the default mine view.
 */
function initializeStartupConfiguration() {
    window.imTableConstraint = [
        [],
        [],
        [],
        [],
        []
    ]; // 0 = GO annotation, 1 = Dataset Name, 2 = Pathway Name, 3 = Protein Domain Name, 4 = Disease Name

    window.locationFilter = null;
    window.interactionsFilter = null;
    window.clinVarFilter = null;
    window.expressionFilter = null;
    window.proteinLocalisationFilter = null;
    window.pieChartObject = null;

    window.minesConfigs = null;

    readTextFile("./mine_configs/mines_filters.json", function(text) {
        window.minesConfigs = JSON.parse(text);
        console.log(window.minesConfigs);
    });



    // Initial mine service url (HumanMine), name and view
    window.mineUrl = "httpCOLONSLASHSLASHwww.humanmine.orgSLASHhumanmineSLASHservice";
    window.selectedMineName = "HumanMine";
    window.currentClassView = "Gene";
}

/**
 * This method is used to get an array of hexadecimal colors, following the rainbow pattern, with the given size (useful for plots)
 * @param {number} input the size of the array of colors
 * @returns {array} an array of hexadecimal colors with the specific size, following a rainbow pattern
 */
function getColorsArray(size) {
    var rainbow = [
        "#fbb735", "#e98931", "#eb403b", "#b32E37", "#6c2a6a",
        "#5c4399", "#274389", "#1f5ea8", "#227FB0", "#2ab0c5",
        "#39c0b3", '#b3cae5', '#dbdde4', '#e4e3e4', '#f7ddbb', '#efcab2',
        '#bccacc', '#c7d8d6', '#d9ebe0', '#ebf9e3', '#f4f8d0',
        '#5e7fb1', '#dce8f7', '#eff1f4', '#fce1a8', '#f7ec86',
        '#8fb8ee', '#cbe2f4', '#dbe5eb', '#f9d3b8', '#e0b2a3',
        '#a2e0f9', '#cef5fc', '#eafaeb', '#fefcd3', '#fdf4ba',
        '#6bafd2', '#a4c8dc', '#d6cbca', '#eabc96', '#db8876',
        '#b4ced8', '#d7e5d4', '#e2e8c9', '#f1e5b9', '#edd7ac',
        '#29153e', '#657489', '#bfb6aa', '#ead79d', '#f2ebda',
        '#20202f', '#273550', '#416081', '#adacb2', '#eac3a2',
        '#555351', '#555351', '#8d7b6c', '#cc9d7a', '#fff9aa',
        '#171c33', '#525f83', '#848896', '#bb9d78', '#f6e183',
        '#ffe3c8', '#efad9e', '#c79797', '#a78a92', '#857d8d',
        '#6f749e', '#9a8daf', '#d0a8b9', '#f8bbb1', '#fde6b1',
        '#536a97', '#8087ad', '#bca391', '#bd968a', '#a38b8a',
        '#325176', '#7b9ea7', '#9baf93', '#dbaf81', '#fbdf73',
        '#727288', '#8e889b', '#d3c2bd', '#f9d89a', '#f8c785',
        '#506e90', '#7695aa', '#a7bdb8', '#e2e2b8', '#fdf998',
        '#634b5f', '#868080', '#b7b29b', '#dfd6a4', '#e9f3a2',
        '#7e74b2', '#b3a2c2', '#e2cdbe', '#f6cf97', '#f4a77a',
        '#34a4ca', '#59d7dd', '#a8f2f0', '#d0f8ef', '#d6f6e1',
        '#7696cd', '#8fb2e4', '#b0cff0', '#d7e5ec', '#dee0e7',
        '#8dd6c3', '#c5e5e2', '#eafaeb', '#f9f7ca', '#fceea1',
        '#4e72c7', '#6d9ed7', '#a4c8d5', '#b4d9e1', '#c4d9d6',
        '#47565f', '#5b625a', '#947461', '#f98056', '#f7ec86',
        '#95b3bf', '#c6cdd3', '#e5d8d9', '#f1e1d9', '#f3e1cd',
        '#4c86ab', '#95a5bc', '#bfcdc9', '#dcd6c9', '#edd9c7',
        '#0f124a', '#1b2360', '#515b80', '#758391', '#e5e3b0',
        '#889db6', '#a5b8ce', '#c1cfdd', '#dee1e4', '#d5d1cf',
        '#74bddb', '#a8d1eb', '#cddbf5', '#e4e6fb', '#f6f4f8',
        '#a7d3cb', '#bcc1c4', '#e5cab3', '#fee6c5', '#fdecd0',
        '#325571', '#8e9fa4', '#decab2', '#f2d580', '#ffa642',
        '#c5d4d7', '#d6b98d', '#c99262', '#8c5962', '#43577e'
    ];

    return rainbow;
};

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
        url: '/fetch/ontologyterms/' + window.mineUrl + '/' + window.currentClassView,
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
        url: '/fetch/clinicalsignificance/' + window.mineUrl + '/' + window.currentClassView,
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
        url: '/fetch/proteinatlascelltypes/' + window.mineUrl + '/' + window.currentClassView,
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
        url: '/fetch/proteinatlastissuenames/' + window.mineUrl + '/' + window.currentClassView,
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
        url: '/fetch/allelestype/' + window.mineUrl + '/' + window.currentClassView,
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
        url: '/fetch/datasets/' + window.mineUrl + '/' + window.currentClassView,
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
        url: '/fetch/pathways/' + window.mineUrl + '/' + window.currentClassView,
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
        url: '/fetch/diseases/' + window.mineUrl + '/' + window.currentClassView,
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
 * Method to get the different items inside a class (count per organism) in order to feed the sidebar
 * @param {array} constraints: the constraints for the endpoint call
 * @returns {array} an array with the server response containing the different items in a class
 */
function getItemsInClass(constraints) {
    return $.ajax({
        url: '/statistics/count/items/' + window.mineUrl + '/' + window.currentClassView,
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
 * Auxiliary function to flatten an array
 * @param {array} arr: the array to be flattened
 * @returns {array} the flattened array
 */
function flatten(arr) {
    return arr.reduce(function(flat, toFlatten) {
        return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
    }, []);
}

/**
 * Method to update the im-table with the filters selected in the sidebar
 */
function updateTableWithConstraints() {

    while (window.imTable.query.constraints.length > 0) {
        try {
            window.imTable.query.removeConstraint(window.imTable.query.constraints[0]);
        } catch (err) {
            continue;
        }
    }

    // GO Annotation
    if (window.imTableConstraint[0].length > 0) {
        if (window.currentClassView == "Gene") {
            window.imTable.query.addConstraint({
                "path": "goAnnotation.ontologyTerm.name",
                "op": "ONE OF",
                "values": window.imTableConstraint[0]
            });
        } else {
            window.imTable.query.addConstraint({
                "path": "ontologyAnnotations.ontologyTerm.name",
                "op": "ONE OF",
                "values": window.imTableConstraint[0]
            });
        }
    }

    // Dataset Name
    if (window.imTableConstraint[1].length > 0) {
        window.imTable.query.addConstraint({
            "path": "dataSets.name",
            "op": "ONE OF",
            "values": window.imTableConstraint[1]
        });
    }

    // Pathway Name
    if (window.imTableConstraint[2].length > 0) {
        window.imTable.query.addConstraint({
            "path": "pathways.name",
            "op": "ONE OF",
            "values": window.imTableConstraint[2]
        });
    }

    // Protein Domain Name
    if (window.imTableConstraint[3].length > 0) {
        if (window.currentClassView == "Gene") {
            window.imTable.query.addConstraint({
                "path": "proteins.proteinDomainRegions.proteinDomain.name",
                "op": "ONE OF",
                "values": window.imTableConstraint[3]
            });
        } else {
            window.imTable.query.addConstraint({
                "path": "proteinDomainRegions.proteinDomain.name",
                "op": "ONE OF",
                "values": window.imTableConstraint[3]
            });
        }
    }

    // Disease Name
    if (window.imTableConstraint[4].length > 0) {
        window.imTable.query.addConstraint({
            "path": "diseases.name",
            "op": "ONE OF",
            "values": window.imTableConstraint[4]
        });
    }
}

/**
 * Auxiliary function to remove an element from an array
 */
function remove(arr, what) {
    var found = arr.indexOf(what);

    while (found !== -1) {
        arr.splice(found, 1);
        found = arr.indexOf(what);
    }
}

/**
 * Method to expand the dataset names filter, showing the remaining ones and adding the appropriate event handling to them
 */
function showMoreDatasetNames() {
    $.when(getDatasetNamesInClass()).done(function(result) {
        var availableDatasetNames = [];

        for (var i = 0; i < result.results.length; i++) {
            if (result.results[i]["item"] != null) {
                if (result.results[i]["item"] == "KEGG pathways data set" || result.results[i]["item"] == "HGNC identifiers" || result.results[i]["item"] == "BioGRID interaction data set" || result.results[i]["item"] == "IntAct interactions data set" || result.results[i]["item"] == "ClinVar data set" || result.results[i]["item"] == "OMIM diseases") {
                    continue;
                }
                availableDatasetNames.push({
                    label: result.results[i]["item"] + " (" + result.results[i]["count"] + ")",
                    value: result.results[i]["item"]
                });
            }
        }

        var resultantElementsArray = [];

        for (var i = 0; i < availableDatasetNames.length; i++) {
            resultantElementsArray.push(availableDatasetNames[i]["value"]);
        }

        resultantElementsArray.sort();

        // Remove first 3 elements (already in the sidebar)
        if (resultantElementsArray.length < 4) return;
        resultantElementsArray = resultantElementsArray.slice(3);

        var resultantElementsNumber = resultantElementsArray.length;

        for (var i = 0; i < resultantElementsNumber; i++) {
            var datasetName = resultantElementsArray[i];
            //var datasetCount = "(" + result.results[i]["count"] + ")";
            $("#datasetsSelector").append(
                '<div class="form-check" style="margin-left: 10px;"><input class="form-check-input" type="checkbox" id="' + datasetName.replace(/[^a-zA-Z0-9]/g, '') + '" value="' + datasetName + '"><label class="form-check-label" for="' + datasetName + '"><p>' + datasetName + '</p></label></div>');

            $('#' + datasetName.replace(/[^a-zA-Z0-9]/g, '')).change(function() {
                if ($(this).is(":checked")) {
                    var checkboxValue = $(this).val();
                    window.imTableConstraint[1].push(checkboxValue);
                    updateTableWithConstraints();
                } else {
                    var checkboxValue = $(this).val();
                    remove(window.imTableConstraint[1], checkboxValue);
                    updateTableWithConstraints();
                }
            });
        }
    });
}

/**
 * Method to read a json file from a given location
 */
function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

/**
 * Method to remove the current extra filters in the sidebar
 */
function clearExtraFilters() {
    $("#locationFilterLi").remove();
    $("#diseasesFilterLi").remove();
    $("#clinvarFilterLi").remove();
    $("#proteinLocalisationFilterLi").remove();
    $("#proteinDomainFilterLi").remove();
    $("#interactionsFilterLi").remove();
    $("#expressionFilterLi").remove();
    window.extraFiltersAdded = false;
}

function addExtraFilters() {
    // Read the JSON config file
    if (!window.extraFiltersAdded) {
        var extraFiltersAvailable = window.minesConfigs[window.selectedMineName].extra_filters;

        // Location filter
        if (extraFiltersAvailable.includes('location')) {
            $("#sidebarUl").append(
                '<li class="nav-item" data-toggle="tooltip" data-placement="right" title="Location" id="locationFilterLi"><a class="nav-link" data-toggle="collapse" href="#locationSearchCardBlock" aria-controls="locationSearchCardBlock" style="color:black;"><i class="fa fa-fw fa-location-arrow"></i><span class="nav-link-text"></span>Location</a>    <div class="card" style="width: 100%;">        <div class="collapse card-block" id="locationSearchCardBlock" style="overflow-y: auto; overflow-x:hidden;">            <div class="ul list-group list-group-flush" id="locationFilterList"></div>            <form-group class="ui-front">                <div class="row" style="align: center;"><input class="form-control" type="text" id="locationChromosomeSearchInput" placeholder="Chromosome (e.g. 12)" style="width: 100%; float:left; margin-left: 15px;" /></div>                <div class="row" style="align: center;"><input class="form-control" type="text" id="locationStartSearchInput" placeholder="Start" style="width: 45%; float:left; margin-left: 15px;" /><input class="form-control" type="text" id="locationEndSearchInput" placeholder="End" style="width: 45%;"                    /></div><button class="btn btn-success" type="button" style="width:100%;" id="locationSearchButton">Go!</button><button class="btn btn-danger" type="button" style="width:100%;" id="locationResetButton">Reset</button></form-group>        </div>    </div></li>');
        }

        // Diseases filter
        if (extraFiltersAvailable.includes('diseases')) {
            $("#sidebarUl").append(
                '<li class="nav-item" data-toggle="tooltip" data-placement="right" title="Diseases (OMIM)" id="diseasesFilterLi"><a class="nav-link" data-toggle="collapse" href="#diseasesSearchCardBlock" aria-controls="diseasesSearchCardBlock" style="color:black;"><i class="fa fa-fw fa-certificate"></i><span class="nav-link-text"></span>Diseases (OMIM)</a><div class="card" style="width: 100%;"><div class="collapse card-block" id="diseasesSearchCardBlock" style="overflow: auto;"><div class="ul list-group list-group-flush" id="diseasesFilterList"></div><form-group class="ui-front"><input class="form-control" type="text" id="diseasesSearchInput" placeholder="e.g. alzheimer disease"/></form-group></div></div></li>');

            $.when(getDiseasesNamesInClass()).done(function(result) {

                var availableDiseasesNames = [];

                for (var i = 0; i < result.results.length; i++) {
                    if (result.results[i]["item"] != null) {
                        availableDiseasesNames.push({
                            label: result.results[i]["item"] + " (" + result.results[i]["count"] + ")",
                            value: result.results[i]["item"]
                        });
                    }
                }

                $("#diseasesSearchInput").autocomplete({
                    minLength: 3,
                    source: function(request, response) {
                        var results = $.ui.autocomplete.filter(availableDiseasesNames, request.term);
                        response(results.slice(0, 15));
                    },
                    select: function(event, ui) {
                        event.preventDefault();
                        $("#diseasesSearchInput").val(ui.item.value);

                        // Filter the table
                        window.imTableConstraint[4].push(ui.item.value);
                        updateTableWithConstraints();

                        var buttonId = ui.item.value.replace(/[^a-zA-Z0-9]/g, '') + "button";

                        $("#diseasesFilterList").append(
                            '<li class="list-group-item" style="height: 50px; padding: 10px 15px;" id="' + ui.item.value.replace(/[^a-zA-Z0-9]/g, '') + '"><span class="float-md-left">' + ui.item.value.slice(0, 22) + '</span><div class="input-group-append float-md-right"><button class="btn btn-sm btn-outline-secondary" type="button" id="' + buttonId + '">x</button></li>');

                        $("#" + buttonId).click(function() {
                            remove(window.imTableConstraint[4], ui.item.value);
                            updateTableWithConstraints();
                            $("#" + ui.item.value.replace(/[^a-zA-Z0-9]/g, '')).remove();
                        });
                    },
                    focus: function(event, ui) {
                        event.preventDefault();
                        $("#diseasesSearchInput").val(ui.item.value);
                    }
                });

            });
        }

        // ClinVar filter
        if (extraFiltersAvailable.includes('clinvar')) {
            $("#sidebarUl").append(
                '<li class="nav-item" data-toggle="tooltip" data-placement="right" title="ClinVar" id="clinvarFilterLi"><a class="nav-link" data-toggle="collapse" href="#clinvarSearchCardBlock" aria-controls="clinvarSearchCardBlock" style="color:black;"><i class="fa fa-fw fa-eyedropper"></i><span class="nav-link-text"></span>ClinVar</a><div class="card" style="width: 100%;"><div class="collapse card-block" id="clinvarSearchCardBlock" style="overflow-y: auto; overflow-x:hidden;"><form-group class="ui-front"><div style="align: center;"><input class="form-control" type="text" id="clinvarClinicalSignificanceSearchInput" placeholder="Significance (e.g. Pathogenic)" style="width: 100%;"/><input class="form-control" type="text" id="clinvarTypeSearchInput" placeholder="Type (e.g. insertion)" style="width: 100%;"/></div><button class="btn btn-success" type="button" style="width:100%;" id="clinvarSearchButton">Go!</button><button class="btn btn-danger" type="button" style="width:100%;" id="clinvarResetButton">Reset</button></form-group></div></div></li>');

            $.when(getAllelesClinicalSignifanceInClass()).done(function(result) {

                var availableData = [];

                for (var i = 0; i < result.results.length; i++) {
                    if (result.results[i]["item"] != null) {
                        availableData.push({
                            label: result.results[i]["item"] + " (" + result.results[i]["count"] + ")",
                            value: result.results[i]["item"]
                        });
                    }
                }

                $("#clinvarClinicalSignificanceSearchInput").autocomplete({
                    minLength: 2,
                    source: function(request, response) {
                        var results = $.ui.autocomplete.filter(availableData, request.term);
                        response(results.slice(0, 15));
                    },
                    select: function(event, ui) {
                        event.preventDefault();
                        $("#clinvarClinicalSignificanceSearchInput").val(ui.item.value);
                    },
                    focus: function(event, ui) {
                        event.preventDefault();
                        $("#clinvarClinicalSignificanceSearchInput").val(ui.item.value);
                    }
                });

            });

            $.when(getAllelesTypesInClass()).done(function(result) {

                var availableData = [];

                for (var i = 0; i < result.results.length; i++) {
                    if (result.results[i]["item"] != null) {
                        availableData.push({
                            label: result.results[i]["item"] + " (" + result.results[i]["count"] + ")",
                            value: result.results[i]["item"]
                        });
                    }
                }

                $("#clinvarTypeSearchInput").autocomplete({
                    minLength: 2,
                    source: function(request, response) {
                        var results = $.ui.autocomplete.filter(availableData, request.term);
                        response(results.slice(0, 15));
                    },
                    select: function(event, ui) {
                        event.preventDefault();
                        $("#clinvarTypeSearchInput").val(ui.item.value);
                    },
                    focus: function(event, ui) {
                        event.preventDefault();
                        $("#clinvarTypeSearchInput").val(ui.item.value);
                    }
                });

            });
        }

        // Protein localisation filter
        if (extraFiltersAvailable.includes('protein-localisation')) {
            $("#sidebarUl").append(
                '<li class="nav-item" data-toggle="tooltip" data-placement="right" title="Protein Localisation" id="proteinLocalisationFilterLi"><a class="nav-link" data-toggle="collapse" href="#proteinLocalisationSearchCardBlock" aria-controls="proteinLocalisationSearchCardBlock" style="color:black;"><i class="fa fa-fw fa-trello"></i><span class="nav-link-text"></span>Protein Localisation</a><div class="card" style="width: 100%;"><div class="collapse card-block" id="proteinLocalisationSearchCardBlock" style="overflow-y: auto; overflow-x:hidden;"><div class="ul list-group list-group-flush" id="proteinLocalisationFilterList"></div><form-group class="ui-front"><div class="row"><input class="form-control" type="text" id="proteinLocalisationCellTypeSearchInput" placeholder="Cell type (e.g. adipocytes)" style="width: 100%; margin-left: 15px;"/></div><div class="row" style="align: center;"><select class="form-control" id="proteinLocalisationExpressionTypeSelector" style="width: 45%; float:left; margin-left: 15px;"><option value="All">All (Type)</option><option value="APE - two or more antibodies">Two or more antibodies</option><option value="Staining - one antibody only">One antibody only</option></select><select class="form-control" id="proteinLocalisationLevelSelector" style="width: 45%;"><option value="All">All (Level)</option><option value="Low">Low</option><option value="Medium">Medium</option><option value="High">High</option><option value="Not detected">Not detected</option></select></div><div class="row" style="align: center;"><input class="form-control" type="text" id="proteinLocalisationTissueSearchInput" placeholder="Tissue" style="width: 45%; float:left; margin-left: 15px;"/><select class="form-control" id="proteinLocalisationRealibilitySelector" style="width: 45%;"><option value="All">All (Realibility)</option><option value="Low">Low</option><option value="Uncertain">Uncertain</option><option value="Supportive">Supportive</option><option value="High">High</option></select></div><button class="btn btn-success" type="button" style="width:100%;" id="proteinLocalisationSearchButton">Go!</button><button class="btn btn-danger" type="button" style="width:100%;" id="proteinLocalisationResetButton">Reset</button></form-group></div></div></li>');

            $.when(getProteinAtlasExpressionCellTypesInClass()).done(function(result) {

                var availableData = [];

                for (var i = 0; i < result.results.length; i++) {
                    if (result.results[i]["item"] != null) {
                        availableData.push({
                            label: result.results[i]["item"] + " (" + result.results[i]["count"] + ")",
                            value: result.results[i]["item"]
                        });
                    }
                }

                $("#proteinLocalisationCellTypeSearchInput").autocomplete({
                    minLength: 2,
                    source: function(request, response) {
                        var results = $.ui.autocomplete.filter(availableData, request.term);
                        response(results.slice(0, 15));
                    },
                    select: function(event, ui) {
                        event.preventDefault();
                        $("#proteinLocalisationCellTypeSearchInput").val(ui.item.value);
                    },
                    focus: function(event, ui) {
                        event.preventDefault();
                        $("#proteinLocalisationCellTypeSearchInput").val(ui.item.value);
                    }
                });

            });

            $.when(getProteinAtlasExpressionTissueNamesInClass()).done(function(result) {

                var availableData = [];

                for (var i = 0; i < result.results.length; i++) {
                    if (result.results[i]["item"] != null) {
                        availableData.push({
                            label: result.results[i]["item"] + " (" + result.results[i]["count"] + ")",
                            value: result.results[i]["item"]
                        });
                    }
                }

                $("#proteinLocalisationTissueSearchInput").autocomplete({
                    minLength: 2,
                    source: function(request, response) {
                        var results = $.ui.autocomplete.filter(availableData, request.term);
                        response(results.slice(0, 15));
                    },
                    select: function(event, ui) {
                        event.preventDefault();
                        $("#proteinLocalisationTissueSearchInput").val(ui.item.value);
                    },
                    focus: function(event, ui) {
                        event.preventDefault();
                        $("#proteinLocalisationTissueSearchInput").val(ui.item.value);
                    }
                });

            });
        }

        // Protein domain filter
        if (extraFiltersAvailable.includes('protein-domain')) {
            $("#sidebarUl").append(
                '<li class="nav-item" data-toggle="tooltip" data-placement="right" title="Protein Domain Name" id="proteinDomainFilterLi"><a class="nav-link" data-toggle="collapse" href="#proteinDomainNameSearchCardBlock" aria-controls="proteinDomainNameSearchCardBlock" style="color:black;"><i class="fa fa-fw fa-product-hunt"></i><span class="nav-link-text"></span>Protein Domain Name</a><div class="card" style="width: 100%;"><div class="collapse card-block" id="proteinDomainNameSearchCardBlock" style="overflow: auto;"><div class="ul list-group list-group-flush" id="proteinDomainNameFilterList"></div><form-group class="ui-front"><input class="form-control" type="text" id="proteinDomainNameSearchInput" placeholder="e.g. immunoglobulin subtype"/></form-group></div></div></li>');

            $.when(getProteinDomainNamesInClass()).done(function(result) {

                var availableProteinDomainNames = [];

                for (var i = 0; i < result.results.length; i++) {
                    if (result.results[i]["item"] != null) {
                        availableProteinDomainNames.push({
                            label: result.results[i]["item"] + " (" + result.results[i]["count"] + ")",
                            value: result.results[i]["item"]
                        });
                    }
                }

                $("#proteinDomainNameSearchInput").autocomplete({
                    minLength: 3,
                    source: function(request, response) {
                        var results = $.ui.autocomplete.filter(availableProteinDomainNames, request.term);
                        response(results.slice(0, 15));
                    },
                    select: function(event, ui) {
                        event.preventDefault();
                        $("#proteinDomainNameSearchInput").val(ui.item.value);

                        // Filter the table
                        window.imTableConstraint[3].push(ui.item.value);
                        updateTableWithConstraints();

                        var buttonId = ui.item.value.replace(/[^a-zA-Z0-9]/g, '') + "button";

                        $("#proteinDomainNameFilterList").append(
                            '<li class="list-group-item" style="height: 50px; padding: 10px 15px;" id="' + ui.item.value.replace(/[^a-zA-Z0-9]/g, '') + '"><span class="float-md-left">' + ui.item.value.slice(0, 22) + '</span><div class="input-group-append float-md-right"><button class="btn btn-sm btn-outline-secondary" type="button" id="' + buttonId + '">x</button></li>');

                        $("#" + buttonId).click(function() {
                            remove(window.imTableConstraint[3], ui.item.value);
                            updateTableWithConstraints();
                            $("#" + ui.item.value.replace(/[^a-zA-Z0-9]/g, '')).remove();
                        });
                    },
                    focus: function(event, ui) {
                        event.preventDefault();
                        $("#proteinDomainNameSearchInput").val(ui.item.value);
                    }
                });

            });
        }

        // Interactions filter
        if (extraFiltersAvailable.includes('interactions')) {
            $("#sidebarUl").append(
                '<li class="nav-item" data-toggle="tooltip" data-placement="right" title="Interactions" id="interactionsFilterLi"><a class="nav-link" data-toggle="collapse" href="#interactionsSearchCardBlock" aria-controls="interactionsSearchCardBlock" style="color:black;"><i class="fa fa-fw fa-podcast"></i><span class="nav-link-text"></span>Interactions</a><div class="card" style="width: 100%;"><div class="collapse card-block" id="interactionsSearchCardBlock" style="overflow-y: auto; overflow-x:hidden;"><div class="ul list-group list-group-flush" id="interactionsFilterList"></div><form-group class="ui-front"><div class="row" style="align: center;"><input class="form-control" type="text" id="interactionsParticipant2SearchInput" placeholder="Optional: Participant 2 (symbol)" style="width: 100%; float:left; margin-left: 15px;"/></div><div class="row" style="align: center;"><select class="form-control" id="interactionsTypeSelector" style="width: 45%; float:left; margin-left: 15px;"><option value="All">All (Type)</option><option value="physical">Physical</option><option value="genetic">Genetic</option></select><select class="form-control" id="interactionsDatasetSelector" style="width: 45%;"><option value="All">All (Set)</option><option value="BioGRID interaction data set">BioGRID</option><option value="IntAct interactions data set">IntAct</option></select></div><button class="btn btn-success" type="button" style="width:100%;" id="interactionsSearchButton">Go!</button><button class="btn btn-danger" type="button" style="width:100%;" id="interactionsResetButton">Reset</button></form-group></div></div></li>');

            $.when(getParticipant2SymbolsInClass()).done(function(result) {

                var availableParticipant2Symbol = [];

                for (var i = 0; i < result.results.length; i++) {
                    if (result.results[i]["item"] != null) {
                        availableParticipant2Symbol.push({
                            label: result.results[i]["item"] + " (" + result.results[i]["count"] + ")",
                            value: result.results[i]["item"]
                        });
                    }
                }

                $("#interactionsParticipant2SearchInput").autocomplete({
                    minLength: 3,
                    source: function(request, response) {
                        var results = $.ui.autocomplete.filter(availableParticipant2Symbol, request.term);
                        response(results.slice(0, 15));
                    },
                    select: function(event, ui) {
                        event.preventDefault();
                        $("#interactionsParticipant2SearchInput").val(ui.item.value);
                    },
                    focus: function(event, ui) {
                        event.preventDefault();
                        $("#interactionsParticipant2SearchInput").val(ui.item.value);
                    }
                });

            });
        }

        // Expression filter
        if (extraFiltersAvailable.includes('expression')) {
            $("#sidebarUl").append(
                '<li class="nav-item" data-toggle="tooltip" data-placement="right" title="Expression" id="expressionFilterLi"><a class="nav-link" data-toggle="collapse" href="#expressionSearchCardBlock" aria-controls="expressionSearchCardBlock" style="color:black;"><i class="fa fa-fw fa-tasks"></i><span class="nav-link-text"></span>Expression</a><div class="card" style="width: 100%;"><div class="collapse card-block" id="expressionSearchCardBlock" style="overflow-y: auto; overflow-x:hidden;"><div class="ul list-group list-group-flush" id="expressionFilterList"></div><form-group class="ui-front"><div class="row" style="align: center;"><select class="form-control" id="expressionExpressionSelector" style="width: 45%; float:left; margin-left: 15px;"><option value="UP">UP</option><option value="DOWN">DOWN</option><option value="NONDE">NONDE</option></select><select class="form-control" id="expressionDatasetSelector" style="width: 45%;"><option value="All">All (Set)</option><option value="ArrayExpress accession: E-MTAB-62">E-MTAB-62</option><option value="E-MTAB-513 illumina body map">Illumina bodymap</option></select></div><div class="row" style="align: center;"><input class="form-control" type="text" id="expressionPvalueSearchInput" placeholder="P-value (Opt)" style="width: 45%; float:left; margin-left: 15px;"/><input class="form-control" type="text" id="expressionTstatisticSearchInput" placeholder="T-statistic (Opt)" style="width: 45%;"/></div><button class="btn btn-success" type="button" style="width:100%;" id="expressionSearchButton">Go!</button><button class="btn btn-danger" type="button" style="width:100%;" id="expressionResetButton">Reset</button></form-group></div></div></li>');

        }

        window.extraFiltersAdded = true;
    }
}

/**
 * Method updates the organisms filter based upon the organisms present in the
 * current query
 * @param {string} results: the organism query results from the InterMine server
 */
function displayItemsInClass(result) {

    // First remove the li elements
    $('#organismshortnamelist').parent().find('li').remove();

    var countData = [];
    var labelsData = [];
    var colorsData = getColorsArray(result[0].response['results'].length);

    for (var i = 0; i < result[0].response['results'].length; i++) {
        countData.push(result[0].response['results'][i]['count']);
        labelsData.push(result[0].response['results'][i]['item']);
    }

    var resultantElements = result[0].response['results'].length;

    // At most, 5 elements, which are ordered (top 5)
    if (resultantElements > 5) {
        resultantElements = 5;
    }

    // Fill the organism short name dropdown with top 5 organisms according to count
    for (var i = 0; i < resultantElements; i++) {
        var organismName = result[0].response['results'][i]['item'];
        var organismCount = "(" + result[0].response['results'][i]['count'] + ")";
        $("#organismshortnamelist").append('<li class="list-group-item" style="border-width: 2px; border-style: solid; border-color: ' + colorsData[i] + ';"><a class="nav-link" href="#" style="color:black; text-align:center;"><p class="float-md-left">' + organismName + '</p><p class="float-md-right">' + organismCount + '</p></a></li>');
    }

}

/**
 * Method that escapes a mine URL (to not valid URL format)
 * @param {string} mineURL: the mine URL
 * @returns {string} the escapped mine URL
 */
function formatMineURL(mineURL) {
    return mineURL.replace(/:/g, "COLON").replace(/\//g, "SLASH");
}

/**
 * Method that escapes a mine URL (to valid URL format)
 * @param {string} mineURL: the mine URL
 * @returns {string} the formatted mine URL
 */
function escapeMineURL(mineURL) {
    return mineURL.replace(/COLON/g, ":").replace(/SLASH/g, "/");
}

/**
 * Method updates the pie chart based on the organisms present
 * in the current query
 * @param {string} results: the organism query results from the InterMine server
 */
function updatePieChart(result, pieChartID) {

    // Update pie
    if (window.pieChartObject) {
        window.pieChartObject.destroy();
    }

    var ctx = document.getElementById(pieChartID);

    var countData = [];
    var labelsData = [];
    var colorsData = getColorsArray(result[0].response['results'].length);

    for (var i = 0; i < result[0].response['results'].length; i++) {
        countData.push(result[0].response['results'][i]['count']);
        labelsData.push(result[0].response['results'][i]['item'] + " (" + result[0].response['results'][i]['count'] + ")");
    }

    // Plot
    var pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        elements: {
            center: {
                text: '90%',
                color: '#FF6384', // Default is #000000
                fontStyle: 'Arial', // Default is Arial
                sidePadding: 20 // Default is 20 (as a percentage)
            }
        },
        legend: {
            display: true,
            position: 'top',
            onClick: function(e) {
                e.stopPropagation();
            }
        },
        hover: {
            mode: 'nearest',
            intersect: true,
        },
        tooltips: {
            callbacks: {
                label: function(tooltipItem, data) {
                    return data.labels[tooltipItem.index];
                }
            },
            custom: function(tooltip) {
                if (!tooltip.opacity) {
                    document.getElementById(pieChartID).style.cursor = 'default';
                    return;
                }
            }
        },
        onClick: function(evt, elements) {
            var datasetIndex;
            var dataset;

            if (elements.length) {
                var index = elements[0]._index;

                selectedSegment = window.pieChartObject.data.labels[index].split("(")[0].trim();

                // Filter the table
                window.imTable.query.addConstraint({
                    "path": "organism.shortName",
                    "op": "==",
                    "value": selectedSegment
                });

            }

            window.pieChartObject.update();
        }
    };

    window.pieChartObject = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labelsData,
            datasets: [{
                data: countData,
                backgroundColor: colorsData,
            }],
        },
        options: pieOptions
    });
}

/**
 * Method to add the default filters for all mines
 */
function addDefaultFilters() {
    $.when(getOntologyTermsInClass()).done(function(result) {

        var availableGoTerms = [];

        for (var i = 0; i < result.results.length; i++) {
            if (result.results[i]["item"] != null) {
                availableGoTerms.push({
                    label: result.results[i]["item"] + " (" + result.results[i]["count"] + ")",
                    value: result.results[i]["item"]
                });
            }
        }

        $("#goAnnotationSearchInput").autocomplete({
            minLength: 3,
            source: function(request, response) {
                var results = $.ui.autocomplete.filter(availableGoTerms, request.term);
                response(results.slice(0, 15));
            },
            updater: function(item) {
                return item;
            },
            select: function(event, ui) {
                event.preventDefault();
                $("#goAnnotationSearchInput").val(ui.item.value);

                window.imTableConstraint[0].push(ui.item.value);
                updateTableWithConstraints();

                var buttonId = ui.item.value.replace(/[^a-zA-Z0-9]/g, '') + "button";

                $("#goAnnotationFilterList").append(
                    '<li class="list-group-item" style="height: 50px; padding: 10px 15px;" id="' + ui.item.value.replace(/[^a-zA-Z0-9]/g, '') + '"><span class="float-md-left">' + ui.item.value.slice(0, 22) + '</span><div class="input-group-append float-md-right"><button class="btn btn-sm btn-outline-secondary" type="button" id="' + buttonId + '">x</button></li>');

                $("#" + buttonId).click(function() {
                    remove(window.imTableConstraint[0], ui.item.value);
                    updateTableWithConstraints();
                    $("#" + ui.item.value.replace(/[^a-zA-Z0-9]/g, '')).remove();
                });
            },
            focus: function(event, ui) {
                event.preventDefault();
                $("#goAnnotationSearchInput").val(ui.item.value);
            }
        });

    });

    $.when(getDatasetNamesInClass()).done(function(result) {
        if (!window.datasetNamesLoaded) {
            var availableDatasetNames = [];

            for (var i = 0; i < result.results.length; i++) {
                if (result.results[i]["item"] != null) {
                    if (result.results[i]["item"] == "KEGG pathways data set" || result.results[i]["item"] == "HGNC identifiers" || result.results[i]["item"] == "BioGRID interaction data set" || result.results[i]["item"] == "IntAct interactions data set" || result.results[i]["item"] == "ClinVar data set" || result.results[i]["item"] == "OMIM diseases") {
                        continue;
                    }
                    availableDatasetNames.push({
                        label: result.results[i]["item"] + " (" + result.results[i]["count"] + ")",
                        value: result.results[i]["item"]
                    });
                }
            }

            // First remove the form-check elements
            $('#datasetsSelector').empty();

            var resultantElementsNumber = result.results.length;
            var resultantElementsArray = [];

            for (var i = 0; i < availableDatasetNames.length; i++) {
                resultantElementsArray.push(availableDatasetNames[i]["value"]);
            }

            resultantElementsArray.sort();

            // At most, 3 elements, which are ordered (top 3)
            if (resultantElementsNumber > 3) {
                resultantElementsNumber = 3;
            }

            // Fill the organism short name dropdown with top 5 organisms according to count
            for (var i = 0; i < resultantElementsNumber; i++) {
                var datasetName = resultantElementsArray[i];
                //var datasetCount = "(" + result.results[i]["count"] + ")";
                $("#datasetsSelector").append(
                    '<div class="form-check" style="margin-left: 10px;"><input class="form-check-input" type="checkbox" id="' + datasetName.replace(/[^a-zA-Z0-9]/g, '') + '" value="' + datasetName + '"><label class="form-check-label" for="' + datasetName + '"><p>' + datasetName + '</p></label></div>');

                $('#' + datasetName.replace(/[^a-zA-Z0-9]/g, '')).change(function() {
                    if ($(this).is(":checked")) {
                        var checkboxValue = $(this).val();
                        window.imTableConstraint[1].push(checkboxValue);
                        updateTableWithConstraints();
                    } else {
                        var checkboxValue = $(this).val();
                        remove(window.imTableConstraint[1], checkboxValue);
                        updateTableWithConstraints();
                    }
                });
            }

            window.datasetNamesLoaded = true;
        }

    });

    $.when(getPathwayNamesInClass()).done(function(result) {

        var availablePathwayNames = [];

        for (var i = 0; i < result.results.length; i++) {
            if (result.results[i]["item"] != null) {
                availablePathwayNames.push({
                    label: result.results[i]["item"] + " (" + result.results[i]["count"] + ")",
                    value: result.results[i]["item"]
                });
            }
        }

        $("#pathwayNameSearchInput").autocomplete({
            minLength: 3,
            source: function(request, response) {
                var results = $.ui.autocomplete.filter(availablePathwayNames, request.term);
                response(results.slice(0, 15));
            },
            select: function(event, ui) {
                event.preventDefault();
                $("#pathwayNameSearchInput").val(ui.item.value);

                // Filter the table
                window.imTableConstraint[2].push(ui.item.value);
                updateTableWithConstraints();

                var buttonId = ui.item.value.replace(/[^a-zA-Z0-9]/g, '') + "button";

                $("#pathwayFilterList").append(
                    '<li class="list-group-item" style="height: 50px; padding: 10px 15px;" id="' + ui.item.value.replace(/[^a-zA-Z0-9]/g, '') + '"><span class="float-md-left">' + ui.item.value.slice(0, 22) + '</span><div class="input-group-append float-md-right"><button class="btn btn-sm btn-outline-secondary" type="button" id="' + buttonId + '">x</button></li>');

                $("#" + buttonId).click(function() {
                    remove(window.imTableConstraint[2], ui.item.value);
                    updateTableWithConstraints();
                    $("#" + ui.item.value.replace(/[^a-zA-Z0-9]/g, '')).remove();
                });
            },
            focus: function(event, ui) {
                event.preventDefault();
                $("#pathwayNameSearchInput").val(ui.item.value);
            }
        });

    });
}

/**
 * Method to fill the mine selector and add the proper event handling
 */
function fillMineSelector() {
    if ($('#mineSelector option').length == 0) {
        var windowUrl = new URL(window.location.href);

        $.when(getIntermines()).done(function(result) {
            $('#mineSelector').find('option').remove().end().append('<option value="httpCOLONSLASHSLASHwww.humanmine.orgSLASHhumanmineSLASHservice">HumanMine</option>').val('httpCOLONSLASHSLASHwww.humanmine.orgSLASHhumanmineSLASHservice');

            for (var i = 0; i < result.instances.length; i++) {
                if (result.instances[i].name == "HumanMine" || result.instances[i].url.startsWith("https")) continue;

                // Temporarily skiping mines with missing concepts for the default filters
                if (result.instances[i].name == "GrapeMine" || result.instances[i].name == "RepetDB" || result.instances[i].name == "Wheat3BMine" || result.instances[i].name == "WormMine" || result.instances[i].name == "XenMine" || result.instances[i].name == "PlanMine") continue;

                // Mines giving error when querying the API or not responding
                if (result.instances[i].name == "ModMine" || result.instances[i].name == "MitoMiner") continue;

                var mineUrl = result.instances[i].url;

                // Check for mines not requiring to format the URL
                if (mineUrl[mineUrl.length - 1] == "/") {
                    mineUrl += "service";
                } else {
                    mineUrl += "/service";
                }


                mineUrl = formatMineURL(mineUrl);

                $('#mineSelector').append('<option value="' + mineUrl + '">' + result.instances[i].name + '</option>').val(mineUrl);

                // In case that the user gave a mine to be rendered, set it here
                if (windowUrl.searchParams.get("givenMine") && result.instances[i].name == windowUrl.searchParams.get("givenMine")) {
                    window.mineUrl = mineUrl;
                    window.selectedMineName = result.instances[i].name;
                    document.title = window.currentClassView + " in " + window.selectedMineName;

                    // Update the imTable
                    clearExtraFilters();
                    updateElements(window.imTable.history.currentQuery.constraints, "PieChart");
                }

            }

            // Select the correct option from the dropdown
            $("#mineSelector option").filter(function() {
                return $(this).text() == window.selectedMineName;
            }).prop("selected", true);

            // Event handling
            $("#mineSelector").change(function() {
                window.mineUrl = $(this).val();
                window.selectedMineName = $("#mineSelector option:selected").text();
                document.title = window.currentClassView + " in " + window.selectedMineName;
                window.datasetNamesLoaded = false;
                window.extraFiltersAdded = false;

                // Update the imTable
                clearExtraFilters();
                updateElements(window.imTable.history.currentQuery.constraints, "PieChart");

                // Instantiate the im-table with all the data available in Gene from HumanMine
                var selector = '#dataTable';
                var service = {
                    root: escapeMineURL(window.mineUrl)
                };
                var query = {
                    select: ['*'],
                    from: window.currentClassView
                };

                imtables.configure({
                    TableCell: {
                        PreviewTrigger: 'click'
                    }
                });

                imtables.configure('TableResults.CacheFactor', 20);

                var imtable = imtables.loadTable(
                    selector, {
                        "start": 0,
                        "size": 25
                    }, {
                        service: service,
                        query: query
                    }
                ).then(
                    function(table) {
                        //console.log('Table loaded', table);
                        //this .on listener will do something when someone interacts with the table. 
                        table.on("rendered", function(changeDetail) {
                            console.log("Rendered table");
                            console.log(changeDetail);
                            updateElements(table.history.currentQuery.constraints, "PieChart");
                        });

                        window.imTable = table;
                    },
                    function(error) {
                        console.error('Could not load table', error);
                    }
                );
            });
        });
    }
}

/**
 * Method to handle the extra filters available in the current selected mine
 */
function handleExtraFilters() {
    if (!window.extraFiltersAdded) {
        if (window.minesConfigs[window.selectedMineName]) {
            addExtraFilters();
            window.extraFiltersAdded = true;
        }
    }
}

/**
 * Method updates the piechart and sidebar elements according to the received constraints
 * @param {string} constraints: the new constraints that the im-table is using
 * @param {string} pieChartID: the div id of the pie chart, in order to update it
 */
function updateElements(constraints, pieChartID) {
    fillMineSelector();
    addDefaultFilters();
    handleExtraFilters();

    $.when(getItemsInClass(constraints)).done(function(result) {
        displayItemsInClass(result);
        createSidebarEvents();
        updatePieChart(result, pieChartID);
    });
}