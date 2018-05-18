var express = require('express');
var imjs = require('imjs');
var request = require('request');
var router = express.Router();

/* GET count of items per class in a certain mine. */
router.get('/count/:mine/:classname', function(req, res, next) {
  var mine = req.params.mine;
  var className = req.params.classname;
  
   var service = new imjs.Service({
         root: 'http://www.humanmine.org/' + mine + '/service'
	});
  
  var query = {
    "from": className,
    "select": ['primaryIdentifier']
  };
  
  service.count(query).then(function(response) {
	res.json(response);
  })  
});

module.exports = router;
