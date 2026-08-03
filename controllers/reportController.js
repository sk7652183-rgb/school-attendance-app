const { Parser } = require("json2csv");
const Attendance = require("../models/Attendance");

// @route GET /api/reports/daily?classId=...&date=YYYY-MM-DD
const dailyReport = async (req, res) => {
  try {
    const { classId, date } = req.query;
    if (!classId || !date) {
      return res.status(400).json({ message: "classId and date are required" });
    }

    const day = new Date(date);
    day.setHours(0, 0, 0, 0);
    const nextDay = new Date(day);
    nextDay.setDate(nextDay.getDate() + 1);

    const records = await Attendance.find({
      class: classId,
      date: { $gte: day, $lt: nextDay },
    }).populate("student", "name rollNumber");

    const summary = {
      date,
      classId,
      total: records.length,
      present: records.filter((r) => r.status === "present").length,
      absent: records.filter((r) => r.status === "absent").length,
      late: records.filter((r) => r.status === "late").length,
      records,
    };

    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/reports/monthly?classId=...&year=2026&month=8
const monthlyReport = async (req, res) => {
  try {
    const { classId, year, month } = req.query;
    if (!classId || !year || !month) {
      return res.status(400).json({ message: "classId, year, and month are required" });
    }

    const start = new Date(Number(year), Number(month) - 1, 1);
    const end = new Date(Number(year), Number(month), 1);

    const records = await Attendance.find({
      class: classId,
      date: { $gte: start, $lt: end },
    }).populate("student", "name rollNumber");

    // Group by student
    const byStudent = {};
    for (const r of records) {
      const key = r.student._id.toString();
      if (!byStudent[key]) {
        byStudent[key] = {
          student: r.student.name,
          rollNumber: r.student.rollNumber,
          present: 0,
          absent: 0,
          late: 0,
          total: 0,
        };
      }
      byStudent[key][r.status] += 1;
      byStudent[key].total += 1;
    }

    res.json({
      classId,
      year: Number(year),
      month: Number(month),
      summary: Object.values(byStudent),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/reports/export?classId=...&startDate=...&endDate=...
// Streams a CSV file of attendance records for the given range.
const exportCSV = async (req, res) => {
  try {
    const { classId, startDate, endDate } = req.query;
    if (!classId || !startDate || !endDate) {
      return res.status(400).json({ message: "classId, startDate, and endDate are required" });
    }

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const records = await Attendance.find({
      class: classId,
      date: { $gte: start, $lte: end },
    })
      .populate("student", "name rollNumber")
      .populate("class", "name section")
      .sort({ date: 1 });

    const rows = records.map((r) => ({
      date: r.date.toISOString().split("T")[0],
      class: r.class?.name || "",
      section: r.class?.section || "",
      studentName: r.student?.name || "",
      rollNumber: r.student?.rollNumber || "",
      status: r.status,
    }));

    const parser = new Parser({
      fields: ["date", "class", "section", "studentName", "rollNumber", "status"],
    });
    const csv = parser.parse(rows);

    res.header("Content-Type", "text/csv");
    res.attachment(`attendance_${classId}_${startDate}_to_${endDate}.csv`);
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { dailyReport, monthlyReport, exportCSV };
