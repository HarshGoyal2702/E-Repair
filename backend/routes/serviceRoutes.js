const express = require("express");
const { getServices, addService } = require("../controllers/serviceController");
const auth = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/", getServices);
router.post("/", auth, addService);

module.exports = router;
