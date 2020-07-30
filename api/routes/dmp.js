var express = require('express');
const DmpController = require('../controllers/DmpController');

var router = express.Router();

router.get('/headerValues', DmpController.headerValues);
router.get('/readyForDmp', DmpController.readyForDmp);
router.get('/updateStatus', DmpController.updateStatus);
// router.get('/picklist', DmpController.picklist);
router.post('/grid', DmpController.grid);
router.post('/submit', DmpController.submit);
// router.post('/crdbId', DmpController.crdbId);
// router.post('/additionalRows', DmpController.additionalRows);
// router.post('/export', DmpController.export);

module.exports = router;
