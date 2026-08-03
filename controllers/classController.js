const Class = require("../models/Class");

// @route POST /api/classes  (admin only)
const createClass = async (req, res) => {
  try {
    const { name, section, teacher } = req.body;
    const newClass = await Class.create({ name, section, teacher });
    res.status(201).json(newClass);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/classes
const getClasses = async (req, res) => {
  try {
    const classes = await Class.find().populate("teacher", "name email");
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/classes/:id
const getClassById = async (req, res) => {
  try {
    const classDoc = await Class.findById(req.params.id).populate("teacher", "name email");
    if (!classDoc) return res.status(404).json({ message: "Class not found" });
    res.json(classDoc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/classes/:id  (admin only)
const updateClass = async (req, res) => {
  try {
    const updated = await Class.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: "Class not found" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route DELETE /api/classes/:id  (admin only)
const deleteClass = async (req, res) => {
  try {
    const deleted = await Class.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Class not found" });
    res.json({ message: "Class deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createClass, getClasses, getClassById, updateClass, deleteClass };
