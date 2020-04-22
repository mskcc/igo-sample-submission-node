var express = require("express");
const SubmissionController = require("../controllers/SubmissionController");

var router = express.Router();

router.get("/list", SubmissionController.list);
router.get("/grid", SubmissionController.grid);
router.get("/:id", SubmissionController.submission);
router.post("/save", SubmissionController.save);
router.post("/delete", SubmissionController.delete);

module.exports = router;