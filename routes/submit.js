var express = require("express");
const SubmitController = require("../controllers/SubmitController");

var router = express.Router();

router.get("/", SubmitController.submissionsList);
router.post("/", SubmitController.submissionsList);
router.get("/:username", SubmitController.submissionsList);
router.get("/:id", SubmitController.submissionsList);
router.delete("/:id", SubmitController.submissionsList);

// router.get("/:id", BookController.bookDetail);
// router.post("/", BookController.bookStore);
// router.put("/:id", BookController.bookUpdate);
// router.delete("/:id", BookController.bookDelete);

module.exports = router;