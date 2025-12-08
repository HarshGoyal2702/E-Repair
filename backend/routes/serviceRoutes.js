const express = require("express");
const { getServices, addService } = require("../controllers/serviceController");
const { authorize } = require("../middleware/auth");
const router = express.Router();

router.get("/", getServices);
router.post("/", authorize("user"), addService);

module.exports = router;
