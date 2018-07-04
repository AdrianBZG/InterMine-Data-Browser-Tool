var express = require('express');
var router = express.Router();

/**
 * GET home page: redirect to the Gene view
 */
router.get('/', function(req, res, next) {
  res.render('genes');
});

/**
 * GET the Protein view
 */
router.get('/proteins', function(req, res, next) {
  res.render('proteins');
});

/**
 * GET the Gene view
 */
router.get('/genes', function(req, res, next) {
  res.render('genes');
});

module.exports = router;
