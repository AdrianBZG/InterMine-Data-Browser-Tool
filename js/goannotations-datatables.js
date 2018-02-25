// Call the dataTables jQuery plugin
$(document).ready(function() {
	  // Fetch number of GO annotations
var im = new intermine.Service({root: 'http://www.humanmine.org/humanmine/service'});
var query    = {
   "from": "GOAnnotation",
  "select": [
    "subject.primaryIdentifier",
    "ontologyTerm.identifier",
    "ontologyTerm.name"
  ],
  "orderBy": [
    {
      "path": "subject.primaryIdentifier",
      "direction": "ASC"
    }
  ]
};


var dataSet = [];
var table;

im.rows(query).then(function(rows) {
  console.log("No. of GO annotations: " + rows.length);
  rows.forEach(function printRow(row) {
    dataSet.push(row)
  });
  document.getElementById("loader").style.display = "none";
  table = $('#dataTable').DataTable( {
	    processing: true, // for show progress bar
		serverSide: false,
        filter: true, // this is for disable filter (search box)
        data: dataSet,
		columns: [
            { title: "Subject Primary Identifier" },
			{ title: "Ontology Term Identifier" },
			{ title: "Ontology Term Name" },
			{ data: null, title: "Actions" }
        ],
		"columnDefs": 
        [
            { 
                "targets": 0,
                "visible": true
            }, 
            {
                "targets": 1,
                 "visible": true    
            },
			{
                "targets": 2,
                 "visible": true    
            },
            {
                "data": null,
                "defaultContent": "<i class='fa fa-fw fa-link' id='gotoentry' title='Go to InterMine entry'></i>",
                "targets": -1
            }
         ]
    } );
   });
   
   $('#dataTable tbody').on( 'click', 'i[id="gotoentry"]', function () {
        var data = table.row( $(this).parents('tr') ).data();
		var intermineLink = "http://www.humanmine.org/humanmine/keywordSearchResults.do?searchTerm=" + data[1] + "&searchSubmit=Search";
        var win = window.open(intermineLink, '_blank');
		if (win) {
			//Browser has allowed it to be opened
			win.focus();
		}
    } );

});
