var express = require('express');
const UploadController = require('../controllers/UploadController');

var router = express.Router();

router.get('/headerValues', UploadController.headerValues);
router.get('/materialsAndSpecies', UploadController.materialsAndSpecies);
router.get('/applicationsAndContainers', UploadController.applicationsAndContainers);
router.get('/picklist', UploadController.picklist);
router.post('/grid', UploadController.grid);
router.post('/deidentifyIds', UploadController.deidentifyIds);
router.post('/mrnToCid', UploadController.mrnToCid);
router.post('/additionalRows', UploadController.additionalRows);
router.post('/export', UploadController.export);

module.exports = router;
