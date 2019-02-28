var express = require('express');
var router = express.Router();

var ctrlHome = require('../controllers/Home');
router.get('/', ctrlHome.index);
router.post('/Convert.html', ctrlHome.convert);
module.exports = router;
