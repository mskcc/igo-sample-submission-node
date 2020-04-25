var express = require("express");
const SubmissionController = require("../controllers/SubmissionController");

var router = express.Router();

router.get("/list", SubmissionController.list);
router.get("/grid", SubmissionController.grid);
router.get("/:id", SubmissionController.submission);
router.post("/create", SubmissionController.create);
router.post("/update", SubmissionController.update);
router.post("/delete", SubmissionController.delete);
router.post("/submit", SubmissionController.submit);
router.post("/unsubmit", SubmissionController.unsubmit);


module.exports = router;