const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    rollNumber: { type: String, required: true, trim: true },
    class: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
    guardianContact: { type: String, trim: true },
  },
  { timestamps: true }
);

studentSchema.index({ class: 1, rollNumber: 1 }, { unique: true });

module.exports = mongoose.model("Student", studentSchema);
