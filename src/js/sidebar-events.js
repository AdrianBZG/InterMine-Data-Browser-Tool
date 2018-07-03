// This method takes the selection made in the sidebar and formats it accordingly to feed the logic constraint in the im-table query
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

// This method adds the event handling to the sidebar
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
            "op": "==",
            "value": startLocationInput
        });

        window.locationFilter.push(window.imTable.query.constraints[window.imTable.query.constraints.length - 1]);

        window.imTable.query.addConstraint({
            "path": "locations.end",
            "op": "==",
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
}

function clearLocationConstraint() {
	for(var i = 0; i < window.locationFilter.length; i++) {
		window.imTable.query.removeConstraint(window.locationFilter[i]);
	}
    window.locationFilter = null;
}

function clearInteractionsConstraint() {
	for(var i = 0; i < window.interactionsFilter.length; i++) {
		window.imTable.query.removeConstraint(window.interactionsFilter[i]);
	}
    window.interactionsFilter = null;
}

// This method adds a dataset constraint to the im-table
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