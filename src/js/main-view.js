$(document).ready(function() {

    if(!sessionStorage.getItem('currentClassView')) {
        sessionStorage.setItem('currentClassView', 'Gene');
    }

    var currentClassView = sessionStorage.getItem('currentClassView');

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