var express = require('express');
var router = express.Router();

/* GET home page: redirect to the Gene view. */
router.get('/', function(req, res, next) {
  res.render('genes', { title: 'Genes' });
});

/* GET the Protein view */
router.get('/proteins', function(req, res, next) {
  res.render('proteins', { title: 'Proteins' });
});

/* GET the Gene view */
router.get('/genes', function(req, res, next) {
  res.render('genes', { title: 'Genes' });
});

module.exports = router;
