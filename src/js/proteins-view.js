$(document).ready(function() {

    window.currentClassView = "Protein";
    document.title = window.currentClassView + " in HumanMine";
    $("#genesButton").removeClass("btn-primary").addClass("btn-default");
    $("#proteinsButton").removeClass("btn-default").addClass("btn-primary");
    var mineUrl = window.mineUrl.replace(/COLON/g, ":").replace(/SLASH/g, "/");

    // Instantiate the im-table with all the data available in Protein from HumanMine
    var selector = '#dataTable';
    var service = {
        root: mineUrl,
        token: getSessionToken()        
    };
    var query = {
        select: ['*'],
        from: 'Protein'
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
            table.children.table.on("all", function(changeDetail) {
                updateElements(table.history.currentQuery.constraints, "PieChart");
            });
			
			window.imTable = table.children.table;
        },
        function(error) {
            console.error('Could not load table', error);
        }
    );
});