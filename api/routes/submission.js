var express = require('express');
const SubmissionController = require('../controllers/SubmissionController');

var router = express.Router();

router.get('/list', SubmissionController.list);
router.get('/grid/:type', SubmissionController.grid);
router.get('/since/:type/:time', SubmissionController.since);
router.get('/get/:id/:type', SubmissionController.submission);
router.get('/download', SubmissionController.download);
router.post('/create', SubmissionController.create);
router.post('/update', SubmissionController.update);
router.post('/delete', SubmissionController.delete);
router.post('/submit', SubmissionController.submit);
router.post('/unsubmit', SubmissionController.unsubmit);

module.exports = router;
