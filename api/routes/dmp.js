var express = require('express');
const DmpController = require('../controllers/DmpController');

var router = express.Router();

router.get('/headerValues', DmpController.headerValues);
// router.get('/picklist', DmpController.picklist);
router.post('/grid', DmpController.grid);
// router.post('/crdbId', DmpController.crdbId);
// router.post('/additionalRows', DmpController.additionalRows);
// router.post('/export', DmpController.export);

module.exports = router;
