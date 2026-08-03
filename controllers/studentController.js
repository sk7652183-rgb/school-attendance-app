const Student = require("../models/Student");

// @route POST /api/students  (admin only)
const createStudent = async (req, res) => {
  try {
    const { name, rollNumber, class: classId, guardianContact } = req.body;
    const student = await Student.create({ name, rollNumber, class: classId, guardianContact });
    res.status(201).json(student);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Roll number already exists in this class" });
    }
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/students?classId=...
const getStudents = async (req, res) => {
  try {
    const filter = {};
    if (req.query.classId) filter.class = req.query.classId;

    const students = await Student.find(filter).populate("class", "name section");
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/students/:id
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate("class", "name section");
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/students/:id  (admin only)
const updateStudent = async (req, res) => {
  try {
    const updated = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: "Student not found" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route DELETE /api/students/:id  (admin only)
const deleteStudent = async (req, res) => {
  try {
    const deleted = await Student.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Student not found" });
    res.json({ message: "Student deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createStudent, getStudents, getStudentById, updateStudent, deleteStudent };
