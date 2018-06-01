// Method to get the different items inside Gene (count per organism) in order to feed the sidebar
function getItemsInClass() {
    return $.ajax({
        url: '/statistics/count/items/humanmine/Gene',
        type: 'GET',
        error: function(e) {
            console.log(e);
        },
        success: function(data) {}
    })
}

$(document).ready(function() {

    window.currentClassView = "Gene";
    document.title = window.currentClassView + " in HumanMine";
    $("#proteinsButton").removeClass("btn-primary").addClass("btn-default");
    $("#genesButton").removeClass("btn-default").addClass("btn-primary");

    // Instantiate the im-table with all the data available in Gene from HumanMine
    var selector = '#dataTable';
    var service = {
        root: 'http://www.humanmine.org/humanmine/service'
    };
    var query = {
        select: ['*'],
        from: 'Gene'
    };

    imtables.configure({
        TableCell: {
            PreviewTrigger: 'click'
        }
    });

    imtables.configure('TableResults.CacheFactor', 20);


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

    // Build the pie chart showing the distribution of the data among the different organisms
    var ctx = document.getElementById("genesViewPieChart1");

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
                    sidePadding: 20 // Default is 20 (as a percentage)
                }
            },
            legend: {
                display: true,
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
                        document.getElementById("genesViewPieChart1").style.cursor = 'default';
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

                    // Filter by the selected segment in the pie chart
                    var formattedConstraint = formatChartClickedSegmentAsConstraintForFilter(selectedSegment);
                    filterTableByOrganismShortname(formattedConstraint[0], formattedConstraint[1]);

                }

                myPieChart.update();
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
    });
});