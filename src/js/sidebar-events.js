function createSidebarEvents() {
    $('#organismshortnamelist li').click(function() {
        $('#organismshortnamelist li').removeClass("checked");
        $(this).addClass("checked");
        filterTableByOrganismShortname($(this).find('p').text().split("(")[0].trim());
    });
}

function filterTableByOrganismShortname(organismShortName) {
    $('#dataTable').empty();

    var selector = '#dataTable';
    var service = {
        root: 'http://www.humanmine.org/humanmine/service'
    };
    var query = {
        select: ['*'],
        from: window.currentClassView,
        where: [{
            "path": "organism.shortName",
            "op": "=",
            "value": organismShortName,
            "code": "A"
        }]
    };

    // Configure options here, using nested notation
    imtables.configure({
        TableCell: {
            PreviewTrigger: 'click'
        }
    });

    // Or using path names:
    imtables.configure('TableResults.CacheFactor', 20);


    imtables.loadDash(
        selector, // Can also be an element, or a jQuery object.
        {
            "start": 0,
            "size": 25
        }, // May be null
        {
            service: service,
            query: query
        } // May be an imjs.Query
    ).then(
        function(table) {
            console.log('Table loaded', table);
        },
        function(error) {
            console.error('Could not load table', error);
        }
    );
}