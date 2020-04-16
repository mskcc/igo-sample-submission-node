var express = require("express");
const UploadController = require("../controllers/UploadController");

var router = express.Router();

router.get("/headerValues", UploadController.headerValues);
router.get("/materialsAndSpecies", UploadController.materialsAndSpecies);
router.get("/applicationsAndContainers", UploadController.applicationsAndContainers);
router.get("/picklist", UploadController.picklist);
router.post("/grid", UploadController.grid);
router.post("/crdbId", UploadController.crdbId);

// router.get("/:id", BookController.bookDetail);
// router.post("/", BookController.bookStore);
// router.put("/:id", BookController.bookUpdate);
// router.delete("/:id", BookController.bookDelete);

module.exports = router;