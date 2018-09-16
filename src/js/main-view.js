$(document).ready(function() {

    if(!sessionStorage.getItem('currentClassView')) {
        sessionStorage.setItem('currentClassView', 'Gene');
    }

    var currentClassView = sessionStorage.getItem('currentClassView');

    // Handle the current class filter
    handleCurrentClassFilter(currentClassView);

    document.title = currentClassView + " in HumanMine";
    $("#proteinsButton").removeClass("btn-primary").addClass("btn-default");
    $("#genesButton").removeClass("btn-default").addClass("btn-primary");
    var mineUrl = window.mineUrl.replace(/COLON/g, ":").replace(/SLASH/g, "/");

    // Instantiate the im-table with all the data available in Gene from HumanMine
    var selector = '#dataTable';
    var service = {
        root: mineUrl,
        token: getSessionToken()
    };
    var query = {
        select: ['*'],
        //select: ['*','goAnnotation.ontologyTerm.name','pathways.name'],
        from: currentClassView
    };

    imtables.configure({
        TableCell: {
            PreviewTrigger: 'click'
        }
    });

    imtables.configure('TableResults.CacheFactor', 20);

    var imtable = imtables.loadDash(
        selector, {
            "start": 0,
            "size": 25
        }, {
            service: service,
            query: query
        }
    ).then(
        function(table) {
            console.log('Table loaded', table.children.table);
            //this .on listener will do something when someone interacts with the table. 
            table.children.table.on("rendered", function(changeDetail) {
                console.log("Rendered table");
                console.log(changeDetail);
                document.title = sessionStorage.getItem('currentClassView') + " in " + window.selectedMineName;
                updateElements(table.history.currentQuery.constraints, "PieChart");
                updateGeneLengthChart(table.history.currentQuery.constraints, "GeneLengthChart");
            });

            window.imTable = table.children.table;
        },
        function(error) {
            console.error('Could not load table', error);
        }
    );
});

/**
 * Method that dynamically adds a IN, NOT IN and LOOKUP filter based on the current class to the left sidebar
 * @param {string} currentClassView: the current class being viewed
 */
function handleCurrentClassFilter(currentClassView) {
    // Add the element to the sidebar
    $("#sidebarUl").prepend(
        '<li class="nav-item" data-toggle="tooltip" data-placement="right" title="' + currentClassView + '" id="' + currentClassView + 'FilterLi"><a class="nav-link" data-toggle="collapse" href="#'+ currentClassView + 'SearchCardBlock" aria-controls="' + currentClassView + 'SearchCardBlock" style="color:black;"><i class="fa fa-fw fa-eye"></i><span class="nav-link-text"></span>' + currentClassView + '</a><div class="card" style="width: 100%;"><div class="collapse card-block" id="' + currentClassView + 'SearchCardBlock" style="overflow: auto;"><div class="ul list-group list-group-flush" id="' + currentClassView + 'FilterList"></div><form-group class="ui-front"><input class="form-control" type="text" id="' + currentClassView + 'SearchInput" placeholder="Search input..."/><select class="form-control" id="' + currentClassView + 'SearchTypeSelector" style="width: 100%;"><option value="LOOKUP">LOOKUP identifier(s)</option><option value="IN">IN list</option><option value="NOTIN">NOT IN list</option></select><button class="btn btn-success" type="button" style="width:100%;" id="' + currentClassView + 'SearchButton">Go!</button><button class="btn btn-danger" type="button" style="width:100%;" id="' + currentClassView + 'ResetButton">Reset</button></form-group></div></div></li>');

    // Handle the events
    $('#' + currentClassView + 'SearchButton').click(function() {
        if (window.currentClassViewFilter) clearCurrentClassViewConstraint();

		var currentClassViewInput = $('#' + currentClassView + 'SearchInput').val();
        var currentClassViewSearchType = $('#' + currentClassView + 'SearchTypeSelector').val();

		window.currentClassViewFilter = [];
        
        // Any input given?
		if(currentClassViewInput) {
            // LOOKUP, IN or NOTIN ?
            if(currentClassViewSearchType === "LOOKUP") {
                window.imTable.query.addConstraint({
                    "path": currentClassView,
                    "op": "LOOKUP",
                    "value": currentClassViewInput,
                    "extraValue": ""
                });
    
                window.currentClassViewFilter.push(window.imTable.query.constraints[window.imTable.query.constraints.length - 1]);
            }

            if(currentClassViewSearchType === "IN") {
                window.imTable.query.addConstraint({
                    "path": currentClassView,
                    "op": "IN",
                    "value": currentClassViewInput
                });
    
                window.currentClassViewFilter.push(window.imTable.query.constraints[window.imTable.query.constraints.length - 1]);
            }

            if(currentClassViewSearchType === "NOTIN") {
                window.imTable.query.addConstraint({
                    "path": currentClassView,
                    "op": "NOT IN",
                    "value": currentClassViewInput
                });
    
                window.currentClassViewFilter.push(window.imTable.query.constraints[window.imTable.query.constraints.length - 1]);
            }
		}
    });

    $('#' + currentClassView + 'ResetButton').click(function() {
        if (window.currentClassViewFilter) clearCurrentClassViewConstraint();
        $("#" + currentClassView + "SearchInput").val('');
    });
}

/**
 * This method removes any constraint that has been applied to the current class view filter
 */
function clearCurrentClassViewConstraint() {
	for(var i = 0; i < window.currentClassViewFilter.length; i++) {
        try {
            window.imTable.query.removeConstraint(window.currentClassViewFilter[i]);
        }
        catch(err) {
            continue;
        }
	}
    window.currentClassViewFilter = null;
}