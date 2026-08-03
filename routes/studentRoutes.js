const express = require("express");
const {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} = require("../controllers/studentController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/role");

const router = express.Router();

router.use(protect);

router.get("/", getStudents);
router.get("/:id", getStudentById);
router.post("/", authorize("admin"), createStudent);
router.put("/:id", authorize("admin"), updateStudent);
router.delete("/:id", authorize("admin"), deleteStudent);

module.exports = router;
