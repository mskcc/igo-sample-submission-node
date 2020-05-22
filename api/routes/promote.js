var express = require('express');
const PromoteController = require('../controllers/PromoteController');

var router = express.Router();

router.get('/grid', PromoteController.grid);
router.post('/load', PromoteController.load);
router.post('/promote', PromoteController.promote);
router.post('/dryrun', PromoteController.promote);

module.exports = router;
