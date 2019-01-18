var express = require('express');
var router = express.Router();
const url = require('url');

/**
 * GET home page: redirect to the Gene view
 */
router.get('/', function(req, res, next) {
  res.render('main-view');
});

/**
 * Route to access directly to the browser view of a given mine
 */
router.get('/mine/:mineName', function(req, res, next) {
  res.redirect(url.format({
       pathname:"/",
       query: {
          "givenMine": req.params.mineName
        }
     }));
});

module.exports = router;
