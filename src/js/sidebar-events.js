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
            "value": selection[i].innerHTML.split("(")[0].trim(),
            "code": alphabet[i]
        });

        result[1].push(alphabet[i]);
    }

    if (result[1].length > 1) {
        result[1] = result[1].join(" or ");
    } else {
        result[1] = result[1].join("");
    }

    return result;
}

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

function filterTableByOrganismShortname(constraint, logic) {
    $('#dataTable').empty();

    var selector = '#dataTable';
    var service = {
        root: 'http://www.humanmine.org/humanmine/service'
    };
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