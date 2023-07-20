var express = require('express');
const DmpController = require('../controllers/DmpController');

var router = express.Router();

// returns picklist values for form
router.get('/headerValues', DmpController.headerValues);
// returns grid columns based on form selections
router.post('/grid', DmpController.grid);
// saves submissions to db, PMs and investigators can submit; if PMs submit submission.isReviewed is set to true
router.post('/submit', DmpController.submit);
// used when PM clicks Update DMP Status button
router.get('/updateStatus', DmpController.updateStatus);
// router.get('/picklist', DmpController.picklist);
router.post('/loadFromDmp', DmpController.loadFromDmp);

router.get('/updateOriginalCohortId', DmpController.updateOriginalCohortId);

// IGO endpoints used by DMP
router.get('/trackingIdList', DmpController.trackingIdList);
router.get('/igoSampleInformation', DmpController.igoSampleInformation);
// returns samples that were approved by PMs - CURRENTLY NOT USED BY DMP TEAM
router.get('/readyForDmp', DmpController.readyForDmp);

// router.post('/crdbId', DmpController.crdbId);
// router.post('/additionalRows', DmpController.additionalRows);
// router.post('/export', DmpController.export);

module.exports = router;
