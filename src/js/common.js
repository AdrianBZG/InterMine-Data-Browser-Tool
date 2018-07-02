$(document).ready(function() {
    if (window.location.protocol.includes("https")) {
        $("#navbarResponsive").prepend("<div class='alert' id='httpsAlert'><span class='closebtn' id='closeHttpsMessage'>×</span>You are currently viewing the HTTPS website. Due to security limitations, we are unable to show results from HTTP-only InterMines. You may be able to see more results if you <a href='http://im-browser-prototype.herokuapp.com/'>reload this site</a> via HTTP.</div><br/>");

        $("#closeHttpsMessage").click(function() {
            $("#httpsAlert").hide();
        });
    }

    if ($(window).width() < 992) {
        $("#pathwayNameSearchCardBlock").removeClass("show");
        $("#datasetNameSearchCardBlock").removeClass("show");
        $("#goAnnotationSearchCardBlock").removeClass("show");
    }

    window.imTableConstraint = [
        [],
        [],
        [],
		[]
    ]; // 0 = GO annotation, 1 = Dataset Name, 2 = Pathway Name, 3 = Protein Domain Name

    window.locationFilter = null;
});

// This method is used to get an array of hexadecimal colors, following the rainbow pattern, with the given size (useful for plots)
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

// Method to get the different ontology terms inside a class in order to feed the typeahead
function getOntologyTermsInClass() {
    return $.ajax({
        url: '/fetch/ontologyterms/humanmine/' + window.currentClassView,
        type: 'GET',
        error: function(e) {
            console.log(e);
        },
        success: function(data) {}
    })
}

// Method to get the different dataset names inside a class in order to feed the typeahead
function getDatasetNamesInClass() {
    return $.ajax({
        url: '/fetch/datasets/humanmine/' + window.currentClassView,
        type: 'GET',
        error: function(e) {
            console.log(e);
        },
        success: function(data) {}
    })
}

// Method to get the different pathway names inside a class in order to feed the typeahead
function getPathwayNamesInClass() {
    return $.ajax({
        url: '/fetch/pathways/humanmine/' + window.currentClassView,
        type: 'GET',
        error: function(e) {
            console.log(e);
        },
        success: function(data) {}
    })
}

// Method to get the different protein domain names inside a class in order to feed the typeahead
function getProteinDomainNamesInClass() {
    return $.ajax({
        url: '/fetch/proteindomainname/humanmine',
        type: 'GET',
        error: function(e) {
            console.log(e);
        },
        success: function(data) {}
    })
}

// Method to get the different items inside a class (count per organism) in order to feed the sidebar
function getItemsInClass(constraints) {
    return $.ajax({
        url: '/statistics/count/items/humanmine/' + window.currentClassView,
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

function flatten(arr) {
    return arr.reduce(function(flat, toFlatten) {
        return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
    }, []);
}

var myPieChart;

function updateTableWithConstraints() {

    while (window.imTable.query.constraints.length > 0) {
        window.imTable.query.removeConstraint(window.imTable.query.constraints[0]);
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
}

// Auxiliary function to remove an element from an array
function remove(arr, what) {
    var found = arr.indexOf(what);

    while (found !== -1) {
        arr.splice(found, 1);
        found = arr.indexOf(what);
    }
}

function showMoreDatasetNames() {
    $.when(getDatasetNamesInClass()).done(function(result) {
        var availableDatasetNames = [];

        for (var i = 0; i < result.results.length; i++) {
            if (result.results[i]["item"] != null) {
                availableDatasetNames.push({
                    label: result.results[i]["item"] + " (" + result.results[i]["count"] + ")",
                    value: result.results[i]["item"]
                });
            }
        }

        var resultantElementsArray = [];

        for (var i = 0; i < result.results.length; i++) {
            resultantElementsArray.push(result.results[i]["item"]);
        }

        resultantElementsArray.sort();

        // Remove first 5 elements (already in the sidebar)
        resultantElementsArray = resultantElementsArray.slice(5);
        console.log(resultantElementsArray);

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

// This methods updates the piechart and sidebar elements according to the received constraints
function updateElements(constraints, pieChartID) {
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

                //item = selected item
                //do your stuff.
                alert(item);

                //dont forget to return the item to reflect them into input
                return item;
            },
            select: function(event, ui) {
                event.preventDefault();
                $("#goAnnotationSearchInput").val(ui.item.value);

                window.imTableConstraint[0].push(ui.item.value);
                updateTableWithConstraints();

                var buttonId = ui.item.value.replace(/ /g, '') + "button";

                $("#goAnnotationFilterList").append(
                    '<li class="list-group-item" style="height: 50px; padding: 10px 15px;" id="' + ui.item.value.replace(/ /g, '') + '"><span class="float-md-left">' + ui.item.value.slice(0, 22) + '</span><div class="input-group-append float-md-right"><button class="btn btn-sm btn-outline-secondary" type="button" id="' + buttonId + '">x</button></li>');

                $("#" + buttonId).click(function() {
                    remove(window.imTableConstraint[0], ui.item.value);
                    updateTableWithConstraints();
                    $("#" + ui.item.value.replace(/ /g, '')).remove();
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

            for (var i = 0; i < result.results.length; i++) {
                resultantElementsArray.push(result.results[i]["item"]);
            }

            resultantElementsArray.sort();

            // At most, 5 elements, which are ordered (top 3)
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

                var buttonId = ui.item.value.replace(/ /g, '') + "button";

                $("#proteinDomainNameFilterList").append(
                    '<li class="list-group-item" style="height: 50px; padding: 10px 15px;" id="' + ui.item.value.replace(/ /g, '') + '"><span class="float-md-left">' + ui.item.value.slice(0, 22) + '</span><div class="input-group-append float-md-right"><button class="btn btn-sm btn-outline-secondary" type="button" id="' + buttonId + '">x</button></li>');

                $("#" + buttonId).click(function() {
                    remove(window.imTableConstraint[3], ui.item.value);
                    updateTableWithConstraints();
                    $("#" + ui.item.value.replace(/ /g, '')).remove();
                });
            },
            focus: function(event, ui) {
                event.preventDefault();
                $("#proteinDomainNameSearchInput").val(ui.item.value);
            }
        });

    });

    $.when(getItemsInClass(constraints)).done(function(result) {
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

        createSidebarEvents();

        // Update pie
        if (myPieChart) {
            myPieChart.destroy();
        }

        var ctx = document.getElementById(pieChartID);

        var countData = [];
        var labelsData = [];
        var colorsData = getColorsArray(result[0].response['results'].length);

        for (var i = 0; i < result[0].response['results'].length; i++) {
            countData.push(result[0].response['results'][i]['count']);
            labelsData.push(result[0].response['results'][i]['item']);
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

                    selectedSegment = myPieChart.data.labels[index];

                    // Filter the table
                    window.imTable.query.addConstraint({
                        "path": "organism.shortName",
                        "op": "==",
                        "value": selectedSegment
                    });

                }

                myPieChart.update();
            }
        };

        myPieChart = new Chart(ctx, {
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
    });
}