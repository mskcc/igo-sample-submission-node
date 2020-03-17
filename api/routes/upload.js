var express = require("express");
const UploadController = require("../controllers/UploadController");

var router = express.Router();

router.get("/", UploadController.submissionsList);
router.get("/headerValues", UploadController.headerValues);
router.get("/materialsAndSpecies", UploadController.materialsAndSpecies);
router.get("/applicationsAndContainers", UploadController.applicationsAndContainers);
router.get("/picklist", UploadController.picklist);
router.post("/grid", UploadController.grid);
router.post("/", UploadController.submissionsList);
router.get("/:username", UploadController.submissionsList);
router.get("/:id", UploadController.submissionsList);
router.delete("/:id", UploadController.submissionsList);

// router.get("/:id", BookController.bookDetail);
// router.post("/", BookController.bookStore);
// router.put("/:id", BookController.bookUpdate);
// router.delete("/:id", BookController.bookDelete);

module.exports = router;