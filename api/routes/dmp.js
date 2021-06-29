var express = require('express');
const DmpController = require('../controllers/DmpController');

var router = express.Router();

// returns picklist values and grid columns
router.get('/headerValues', DmpController.headerValues);
router.get('/readyForDmp', DmpController.readyForDmp);
router.get('/updateStatus', DmpController.updateStatus);
// router.get('/picklist', DmpController.picklist);
router.post('/grid', DmpController.grid);
// saves submissions to db
router.post('/submit', DmpController.submit);
router.post('/loadFromDmp', DmpController.loadFromDmp);
router.get('/trackingIdList', DmpController.trackingIdList);
router.get('/igoSampleInformation', DmpController.igoSampleInformation);

// router.post('/crdbId', DmpController.crdbId);
// router.post('/additionalRows', DmpController.additionalRows);
// router.post('/export', DmpController.export);

module.exports = router;
