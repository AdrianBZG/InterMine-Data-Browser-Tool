var express = require('express');
var router = express.Router();

/* GET count of items per class in a certain mine. */
router.get('/count/:mine/:classname', function(req, res, next) {
  var mine = req.params.mine;
  var className = req.params.classname;
  res.send(mine);
});

module.exports = router;
