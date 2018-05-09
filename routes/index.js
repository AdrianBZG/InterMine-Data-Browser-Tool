var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Index' });
});

router.get('/diseases', function(req, res, next) {
  res.render('diseases', { title: 'Diseases' });
});

router.get('/proteins', function(req, res, next) {
  res.render('proteins', { title: 'Proteins' });
});

router.get('/goannotations', function(req, res, next) {
  res.render('goannotations', { title: 'GO Annotations' });
});

router.get('/genes', function(req, res, next) {
  res.render('genes', { title: 'Genes' });
});

module.exports = router;
