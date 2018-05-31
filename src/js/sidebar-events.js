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
        var formattedConstraint = formatAsConstraintForFilter($('.checked a p').toArray());
        filterTableByOrganismShortname(formattedConstraint[0], formattedConstraint[1]);
    });
}

// This method receives the formatted constraints and the logic to apply to them, and queries the im-tables appropriately to update it
function filterTableByOrganismShortname(constraint, logic) {
    $('#dataTable').empty();

    var selector = '#dataTable';
    var service = {
        root: 'http://www.humanmine.org/humanmine/service'
    };
	console.log('probando');
	
	console.log(constraint);
	
    var query = {
        constraintLogic: logic,
        select: ['*'],
        from: window.currentClassView,
        where: constraint
    };

    imtables.configure({
        TableCell: {
            PreviewTrigger: 'click'
        },
        TableResults: {
            CacheFactor: 20
        }
    });

    imtables.loadDash(
        selector, {
            "start": 0,
            "size": 25
        }, {
            service: service,
            query: query
        }
    ).then(
        function(table) {
            console.log('Table loaded', table);
        },
        function(error) {
            console.error('Could not load table', error);
        }
    );
}