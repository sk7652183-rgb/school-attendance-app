const express = require("express");
const {
  createClass,
  getClasses,
  getClassById,
  updateClass,
  deleteClass,
} = require("../controllers/classController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/role");

const router = express.Router();

router.use(protect);

router.get("/", getClasses);
router.get("/:id", getClassById);
router.post("/", authorize("admin"), createClass);
router.put("/:id", authorize("admin"), updateClass);
router.delete("/:id", authorize("admin"), deleteClass);

module.exports = router;
