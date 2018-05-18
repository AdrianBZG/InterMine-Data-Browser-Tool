// Call the dataTables jQuery plugin
$(document).ready(function() {

var selector = '#dataTable';
var service  = {root: 'http://www.humanmine.org/humanmine/service'};
var query    = {
  select: ['*'],
  from: 'Gene'
};

// Configure options here, using nested notation
imtables.configure({TableCell: {PreviewTrigger: 'click'}});

// Or using path names:
imtables.configure('TableResults.CacheFactor', 20);


imtables.loadDash(
  selector, // Can also be an element, or a jQuery object.
  {"start":0,"size":25}, // May be null
  {service: service, query: query} // May be an imjs.Query
).then(
  function (table) { console.log('Table loaded', table); },
  function (error) { console.error('Could not load table', error); }
);

/*var im = new intermine.Service({root: 'http://www.humanmine.org/humanmine/service'});
var query    = {
  "from": "Gene",
  "select": [
    "primaryIdentifier",
	"symbol",
    "name",
    "organism.name"
  ],
  "orderBy": [
    {
      "path": "name",
      "direction": "ASC"
    }
  ]
};

var dataSet = [];
var table;

im.rows(query).then(function(rows) {
  console.log("No. of genes: " + rows.length);
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
            { title: "Primary Identifier" },
			{ title: "Symbol" },
            { title: "Name" },
            { title: "Organism Name" },
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
                "defaultContent": "<i class='fa fa-fw fa-link' id='gotoentry' title='Go to InterMine entry'></i><i class='fa fa-fw fa-database' id='homologues' title='Find homologues'></i>",
                "targets": -1
            }
         ]
    } );
   });
   
   $('#dataTable tbody').on( 'click', 'i[id="gotoentry"]', function () {
        var data = table.row( $(this).parents('tr') ).data();
		var intermineLink = "http://www.humanmine.org/humanmine/keywordSearchResults.do?searchTerm=" + data[0] + "&searchSubmit=Search";
        var win = window.open(intermineLink, '_blank');
		if (win) {
			//Browser has allowed it to be opened
			win.focus();
		}
    } );
	
   $('#dataTable tbody').on( 'click', 'i[id="homologues"]', function () {
        var data = table.row( $(this).parents('tr') ).data();
        alert("Find homologues of gene with Primary ID: " + data[0] + " | Unavailable yet");
    } );*/

});
