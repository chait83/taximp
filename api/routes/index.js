var express = require('express');
var router = express.Router();
var ctrlCandidate = require('../controllers/CandidateCont');
router.post('/NewCandidate.html', ctrlCandidate.createCandidate);
router.post('/EditCandidate.html', ctrlCandidate.editCandidate);
router.post('/DelCandidate.html', ctrlCandidate.delCandidate);
router.post('/FindCandidate.html', ctrlCandidate.findCandidate);


module.exports = router;
