/**
 * This method takes the selection made in the sidebar and formats it accordingly to feed the logic constraint in the im-table query
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

    $('#locationSearchButton').click(function() {
        if (window.locationFilter) clearLocationConstraint();

		var chromosomeInput = $('#locationChromosomeSearchInput').val();
        var startLocationInput = $('#locationStartSearchInput').val();
        var endLocationInput = $('#locationEndSearchInput').val();
		
		if (!chromosomeInput) {
			if ($("#locationFilterAlert").length == 0) {
                $("#navbarResponsive").prepend("<div class='alert' id='locationFilterAlert'><span class='closebtn' id='closeLocationFilterAlert'>×</span>Please, specify a chromosome in the filter input field.</div><br/>");

                $("#closeLocationFilterAlert").click(function() {
                    $("#locationFilterAlert").hide();
                });
            } else {
                $("#locationFilterAlert").show();
            }
		}

        if (!$.isNumeric(startLocationInput) || !$.isNumeric(endLocationInput)) {
            if ($("#locationFilterAlert").length == 0) {
                $("#navbarResponsive").prepend("<div class='alert' id='locationFilterAlert'><span class='closebtn' id='closeLocationFilterAlert'>×</span>Please, write a integer number in both the 'Start' and 'End' input fields.</div><br/>");

                $("#closeLocationFilterAlert").click(function() {
                    $("#locationFilterAlert").hide();
                });
            } else {
                $("#locationFilterAlert").show();
            }

            return;

        }

        if (parseInt(startLocationInput) > parseInt(endLocationInput)) {
            if ($("#locationFilterAlert").length == 0) {
                $("#navbarResponsive").prepend("<div class='alert' id='locationFilterAlert'><span class='closebtn' id='closeLocationFilterAlert'>×</span>The location start position must be less or equal to the end position.</div><br/>");

                $("#closeLocationFilterAlert").click(function() {
                    $("#locationFilterAlert").hide();
                });
            } else {
                $("#locationFilterAlert").show();
            }

            return;
        }

		window.locationFilter = [];
		
        window.imTable.query.addConstraint({
            "path": "locations.start",
            "op": ">=",
            "value": startLocationInput
        });

        window.locationFilter.push(window.imTable.query.constraints[window.imTable.query.constraints.length - 1]);

        window.imTable.query.addConstraint({
            "path": "locations.end",
            "op": "<=",
            "value": endLocationInput
        });

        window.locationFilter.push(window.imTable.query.constraints[window.imTable.query.constraints.length - 1]);
		
		window.imTable.query.addConstraint({
            "path": "locations.locatedOn.primaryIdentifier",
            "op": "==",
            "value": chromosomeInput
        });

        window.locationFilter.push(window.imTable.query.constraints[window.imTable.query.constraints.length - 1]);
    });

    $('#locationResetButton').click(function() {
        if (window.locationFilter) clearLocationConstraint();
        $("#locationStartSearchInput").val('');
        $("#locationEndSearchInput").val('');
		$("#locationChromosomeSearchInput").val('');
    });
	
	$('#interactionsSearchButton').click(function() {
        if (window.interactionsFilter) clearInteractionsConstraint();

		var participant2Input = $('#interactionsParticipant2SearchInput').val();
        var interactionsTypeSel = $('#interactionsTypeSelector').val();
        var interactionsDatasetSel = $('#interactionsDatasetSelector').val();

		window.interactionsFilter = [];
		
		if(participant2Input) {
			window.imTable.query.addConstraint({
				"path": "interactions.participant2.symbol",
				"op": "==",
				"value": participant2Input
			});

			window.interactionsFilter.push(window.imTable.query.constraints[window.imTable.query.constraints.length - 1]);
		}

		if(interactionsTypeSel != "All") {
			window.imTable.query.addConstraint({
				"path": "interactions.details.type",
				"op": "==",
				"value": interactionsTypeSel
			});

			window.interactionsFilter.push(window.imTable.query.constraints[window.imTable.query.constraints.length - 1]);
		}
		
		if(interactionsDatasetSel != "All") {
			window.imTable.query.addConstraint({
				"path": "interactions.details.dataSets.name",
				"op": "==",
				"value": interactionsDatasetSel
			});

			window.interactionsFilter.push(window.imTable.query.constraints[window.imTable.query.constraints.length - 1]);
		}
    });

    $('#interactionsResetButton').click(function() {
        if (window.interactionsFilter) clearInteractionsConstraint();
        $("#interactionsParticipant2SearchInput").val('');
    });
	
	$('#clinvarSearchButton').click(function() {
        if (window.clinVarFilter) clearClinVarConstraint();

		var clinVarSignificanceSel = $('#clinvarClinicalSignificanceSearchInput').val();
        var clinVarTypeSel = $('#clinvarTypeSearchInput').val();
		
		if (!clinVarSignificanceSel || !clinVarTypeSel) {
			if ($("#clinvarFilterAlert").length == 0) {
                $("#navbarResponsive").prepend("<div class='alert' id='clinvarFilterAlert'><span class='closebtn' id='closeClinVarFilterAlert'>×</span>Please, specify a clinical significante and type in the filter input field.</div><br/>");

                $("#closeClinVarFilterAlert").click(function() {
                    $("#clinvarFilterAlert").hide();
                });
            } else {
                $("#clinvarFilterAlert").show();
            }
			return;
		}

		window.clinVarFilter = [];
		

		window.imTable.query.addConstraint({
			"path": "alleles.clinicalSignificance",
			"op": "==",
			"value": clinVarSignificanceSel
		});

		window.clinVarFilter.push(window.imTable.query.constraints[window.imTable.query.constraints.length - 1]);
		
		window.imTable.query.addConstraint({
			"path": "alleles.type",
			"op": "==",
			"value": clinVarTypeSel
		});

		window.clinVarFilter.push(window.imTable.query.constraints[window.imTable.query.constraints.length - 1]);

    });

    $('#clinvarResetButton').click(function() {
        if (window.clinVarFilter) clearClinVarConstraint();
        $("#clinvarClinicalSignificanceSearchInput").val('');
		$("#clinvarTypeSearchInput").val('');
    });

    $('#expressionSearchButton').click(function() {
        if (window.expressionFilter) clearExpressionFilterConstraint();

        var expressionPvalue = $('#expressionPvalueSearchInput').val();
        var expressionTstatistic = $('#expressionTstatisticSearchInput').val();
        var expressionExpressionSelector = $('#expressionExpressionSelector').val();
        var expressionDatasetSelector = $('#expressionDatasetSelector').val();
        
        window.expressionFilter = [];

        if (expressionPvalue) {
            window.imTable.query.addConstraint({
                "path": "atlasExpression.pValue",
                "op": ">=",
                "value": expressionPvalue
             });

            window.expressionFilter.push(window.imTable.query.constraints[window.imTable.query.constraints.length - 1]);
        }

        if (expressionTstatistic) {
            window.imTable.query.addConstraint({
                "path": "atlasExpression.tStatistic",
                "op": ">=",
                "value": expressionTstatistic
             });

            window.expressionFilter.push(window.imTable.query.constraints[window.imTable.query.constraints.length - 1]);
        }

        window.imTable.query.addConstraint({
            "path": "atlasExpression.expression",
            "op": "==",
            "value": expressionExpressionSelector
        });

        window.expressionFilter.push(window.imTable.query.constraints[window.imTable.query.constraints.length - 1]);
        
        if (expressionDatasetSelector != "All") {
            window.imTable.query.addConstraint({
                "path": "atlasExpression.dataSets.name",
                "op": "==",
                "value": expressionDatasetSelector
            });

            window.expressionFilter.push(window.imTable.query.constraints[window.imTable.query.constraints.length - 1]);
        }
    });

    $('#expressionResetButton').click(function() {
        if (window.expressionFilter) clearExpressionFilterConstraint();
        $("#expressionTstatisticSearchInput").val('');
        $("#expressionPvalueSearchInput").val('');
    });

    $('#proteinLocalisationSearchButton').click(function() {
        if (window.proteinLocalisationFilter) clearProteinLocalisationFilterConstraint();

        var proteinLocalisationCellTypeSearchInput = $('#proteinLocalisationCellTypeSearchInput').val();
        var proteinLocalisationExpressionTypeSelector = $('#proteinLocalisationExpressionTypeSelector').val();
        var proteinLocalisationLevelSelector = $('#proteinLocalisationLevelSelector').val();
        var proteinLocalisationTissueSearchInput = $('#proteinLocalisationTissueSearchInput').val();
        var proteinLocalisationRealibilitySelector = $('#proteinLocalisationRealibilitySelector').val();

        window.proteinLocalisationFilter = [];

        if (proteinLocalisationCellTypeSearchInput) {
            window.imTable.query.addConstraint({
                "path": "proteinAtlasExpression.cellType",
                "op": "==",
                "value": proteinLocalisationCellTypeSearchInput
             });

            window.proteinLocalisationFilter.push(window.imTable.query.constraints[window.imTable.query.constraints.length - 1]);
        }

        if (proteinLocalisationTissueSearchInput) {
            window.imTable.query.addConstraint({
                "path": "proteinAtlasExpression.tissue.name",
                "op": "==",
                "value": proteinLocalisationTissueSearchInput
             });

            window.proteinLocalisationFilter.push(window.imTable.query.constraints[window.imTable.query.constraints.length - 1]);
        }

        if (proteinLocalisationExpressionTypeSelector != "All") {
            window.imTable.query.addConstraint({
                "path": "proteinAtlasExpression.expressionType",
                "op": "==",
                "value": proteinLocalisationExpressionTypeSelector
            });

            window.proteinLocalisationFilter.push(window.imTable.query.constraints[window.imTable.query.constraints.length - 1]);
        }

        if (proteinLocalisationLevelSelector != "All") {
            window.imTable.query.addConstraint({
                "path": "proteinAtlasExpression.level",
                "op": "==",
                "value": proteinLocalisationLevelSelector
            });

            window.proteinLocalisationFilter.push(window.imTable.query.constraints[window.imTable.query.constraints.length - 1]);
        }

        if (proteinLocalisationRealibilitySelector != "All") {
            window.imTable.query.addConstraint({
                "path": "proteinAtlasExpression.reliability",
                "op": "==",
                "value": proteinLocalisationRealibilitySelector
            });

            window.proteinLocalisationFilter.push(window.imTable.query.constraints[window.imTable.query.constraints.length - 1]);
        }
    });

    $('#proteinLocalisationResetButton').click(function() {
        if (window.proteinLocalisationFilter) clearProteinLocalisationFilterConstraint();
        $("#proteinLocalisationCellTypeSearchInput").val('');
        $("#proteinLocalisationTissueSearchInput").val('');
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
    console.log(window.imTable);
}