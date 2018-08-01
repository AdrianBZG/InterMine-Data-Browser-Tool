var express = require('express');
var router = express.Router();
const url = require('url');

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

/**
 * Route to access directly to the browser view of a given mine
 */
router.get('/mine/:mineName', function(req, res, next) {
  res.redirect(url.format({
       pathname:"/genes",
       query: {
          "givenMine": req.params.mineName
        }
     }));
});

module.exports = router;
