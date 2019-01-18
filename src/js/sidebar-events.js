/**
 * This method takes the selection made in the sidebar and formats it accorsngly to feed the logic constraint in the im-table query
 * @param {string} input the selection made in the sidebar
 * @returns {string} constraint in im-table format and logic constraint
 */
function formatAsConstraintForFilter(selection) {
    var result = [
        [],
        []
    ]
    var alphabet = 'ABCDEFGHIJKLMNOPRQSTUVWXYZ'.split('');

    for (var i = 0; i < selection.length; i++) {
        result[0].push({
            "path": "organism.shortName",
            "op": "=",
            "value": selection[i].innerHTML.split("(")[0].trim(), // Get only the organism short name of the selection, not the number
            "code": alphabet[i] // Assign it a unique code, to build the logical OR in the query
        });

        result[1].push(alphabet[i]);
    }

    // Build the logic (OR)
    if (result[1].length > 1) {
        result[1] = result[1].join(" or ");
    } else {
        result[1] = result[1].join("");
    }

    return result;
}

/**
 * This method adds the event handling to the sidebar
 */
function createSidebarEvents() {
    $('#organismshortnamelist li').click(function() {
        if ($(this).hasClass("checked")) {
            $(this).removeClass("checked");
        } else {
            $(this).addClass("checked");
        }

        // Filter by the selected organisms
        window.imTable.query.addConstraint({
            "path": "organism.shortName",
            "op": "==",
            "value": $('.checked a p').toArray()[0].innerHTML
        });
        //updateElements(formattedConstraint[0], "PieChart");

    });

    $('#btnDatasetViewMore').click(function() {
        if (!window.showingMoreDatasets) {
            window.showingMoreDatasets = true;
            showMoreDatasetNames();
            $('#btnDatasetViewMore').remove();
        }
    });
}

/**
 * This method removes any constraint that has been applied to the Protein Localisation filter
 */
function clearProteinLocalisationFilterConstraint() {
    for(var i = 0; i < window.proteinLocalisationFilter.length; i++) {
        try {
            window.imTable.query.removeConstraint(window.proteinLocalisationFilter[i]);
        }
        catch(err) {
            continue;
        }
    }
    window.expressionFilter = null;
}

/**
 * This method removes any constraint that has been applied to the Expression filter
 */
function clearExpressionFilterConstraint() {
    for(var i = 0; i < window.expressionFilter.length; i++) {
        try {
            window.imTable.query.removeConstraint(window.expressionFilter[i]);
        }
        catch(err) {
            continue;
        }
    }
    window.expressionFilter = null;
}

/**
 * This method removes any constraint that has been applied to the Locations filter
 */
function clearLocationConstraint() {
	for(var i = 0; i < window.locationFilter.length; i++) {
        try {
            window.imTable.query.removeConstraint(window.locationFilter[i]);
        }
        catch(err) {
            continue;
        }
	}
    window.locationFilter = null;
}

/**
 * This method removes any constraint that has been applied to the Interactions filter
 */
function clearInteractionsConstraint() {
	for(var i = 0; i < window.interactionsFilter.length; i++) {
        try {
            window.imTable.query.removeConstraint(window.interactionsFilter[i]);
        }
        catch(err) {
            continue;
        }
	}
    window.interactionsFilter = null;
}

/**
 * This method removes any constraint that has been applied to the ClinVar filter
 */
function clearClinVarConstraint() {
	for(var i = 0; i < window.clinVarFilter.length; i++) {
        try {
            window.imTable.query.removeConstraint(window.clinVarFilter[i]);
	    }
        catch(err) {
            continue;
        }
    }
    window.clinVarFilter = null;
}

/**
 * This method adds a dataset constraint to the im-table.
 * @param {string} input the dataset name to be added as a filter
 */
function addDatasetConstraint(datasetName) {
    // Filter by the selected dataset name
    window.imTable.query.addConstraint({
        "path": "dataSets.name",
        "op": "==",
        "value": datasetName,
        "code": datasetName.replace(/ /g, '')
    });
    //console.log(window.imTable);
}