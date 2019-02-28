var express = require('express');
var router = express.Router();
var ctrlLocations = require('../controllers/locations');
var ctrlOthers = require('../controllers/others');

/* Locations pages */

var ctrlHome = require('../controllers/Home');
router.get('/', ctrlHome.index);
router.post('/Convert.html', ctrlHome.convert);
module.exports = router;
