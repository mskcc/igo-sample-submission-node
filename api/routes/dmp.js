var express = require('express');
const DmpController = require('../controllers/DmpController');

var router = express.Router();

// returns picklist values and grid columns
router.get('/headerValues', DmpController.headerValues);
// returns columns of grid based on form selections
router.post('/grid', DmpController.grid);
// saves submissions to db, PMs and investigators can submit; if PMs submit submission.isReviewed is set to true
router.post('/submit', DmpController.submit);
// returns samples that were approved by PMs - not documented on Confluence are DMP developers aware of this endpoint?
router.get('/readyForDmp', DmpController.readyForDmp);
// used when PM clicks Update DMP Status button
router.get('/updateStatus', DmpController.updateStatus);
// router.get('/picklist', DmpController.picklist);



router.post('/loadFromDmp', DmpController.loadFromDmp);
router.get('/trackingIdList', DmpController.trackingIdList);
router.get('/igoSampleInformation', DmpController.igoSampleInformation);

// router.post('/crdbId', DmpController.crdbId);
// router.post('/additionalRows', DmpController.additionalRows);
// router.post('/export', DmpController.export);

module.exports = router;
