function getItemsInClass() {
    return $.ajax({
        url: '/statistics/count/items/humanmine/Protein',
        type: 'GET',
        error: function(e) {
            console.log(e);
        },
        success: function(data) {}
    })
}

$(document).ready(function() {
    var selector = '#dataTable';
    var service = {
        root: 'http://www.humanmine.org/humanmine/service'
    };
    var query = {
        select: ['*'],
        from: 'Protein'
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

    var ctx = document.getElementById("proteinsViewPieChart1");

    $.when(getItemsInClass()).done(function(result) {
        var countData = [];
        var labelsData = [];
        var colorsData = getColorsArray(result[0].response['results'].length);

        for (var i = 0; i < result[0].response['results'].length; i++) {
            countData.push(result[0].response['results'][i]['count']);
            labelsData.push(result[0].response['results'][i]['item']);
        }

        // Plot
        var pieOptions = {
            elements: {
                center: {
                    text: '90%',
                    color: '#FF6384', // Default is #000000
                    fontStyle: 'Arial', // Default is Arial
                    sidePadding: 20 // Defualt is 20 (as a percentage)
                }
            }
        };


        var myPieChart = new Chart(ctx, {
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
});