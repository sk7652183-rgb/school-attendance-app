const express = require("express");
const { dailyReport, monthlyReport, exportCSV } = require("../controllers/reportController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.get("/daily", dailyReport);
router.get("/monthly", monthlyReport);
router.get("/export", exportCSV);

module.exports = router;
