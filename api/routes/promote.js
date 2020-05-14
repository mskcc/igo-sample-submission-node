var express = require('express');
const PromoteController = require('../controllers/PromoteController');

var router = express.Router();

router.get('/grid', PromoteController.grid);
router.post('/load', PromoteController.load);
// router.get("/materialsAndSpecies", PromoteController.materialsAndSpecies);
// router.get("/applicationsAndContainers", PromoteController.applicationsAndContainers);
// router.get("/picklist", PromoteController.picklist);
// router.post("/grid", PromoteController.grid);
// router.post("/crdbId", PromoteController.crdbId);
// router.post("/additionalRows", PromoteController.additionalRows);
// router.post("/export", PromoteController.export);

module.exports = router;
