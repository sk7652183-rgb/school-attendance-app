const mongoose = require("mongoose");
const Attendance = require("../models/Attendance");


// @route POST /api/attendance
// body: { classId, date, records: [{ studentId, status }, ...] }

const markAttendance = async (req, res) => {
  try {

    const { classId, date, records } = req.body;


    console.log(
      "Attendance request:",
      JSON.stringify(req.body, null, 2)
    );


    if (
      !classId ||
      !date ||
      !Array.isArray(records) ||
      records.length === 0
    ) {
      return res.status(400).json({
        message: "classId, date, and records[] are required"
      });
    }


    if (!mongoose.Types.ObjectId.isValid(classId)) {
      return res.status(400).json({
        message: "Invalid classId"
      });
    }


    const day = new Date(date);
    day.setHours(0,0,0,0);



    const validRecords = records.filter(record => {

      return (
        record.studentId &&
        record.studentId !== "null" &&
        record.studentId !== "undefined" &&
        mongoose.Types.ObjectId.isValid(record.studentId)
      );

    });



    if (validRecords.length === 0) {

      return res.status(400).json({
        message: "No valid student IDs received",
        received: records
      });

    }



    const results = await Promise.all(

      validRecords.map(({studentId,status}) => {


        return Attendance.findOneAndUpdate(

          {
            student: studentId,
            class: classId,
            date: day
          },


          {
            student: studentId,
            class: classId,
            date: day,
            status,
            markedBy: req.user._id
          },


          {
            upsert:true,
            new:true,
            runValidators:true
          }

        );


      })

    );



    res.status(201).json(results);



  } catch(error){

    console.error(
      "Attendance error:",
      error
    );


    res.status(500).json({
      message:error.message
    });

  }
};





// @route GET /api/attendance?classId=...&date=...&studentId=...

const getAttendance = async (req,res)=>{

  try{


    const {
      classId,
      date,
      studentId
    } = req.query;


    const filter={};



    if(classId){
      filter.class = classId;
    }


    if(studentId){
      filter.student = studentId;
    }



    if(date){

      const day = new Date(date);

      day.setHours(0,0,0,0);


      const nextDay = new Date(day);

      nextDay.setDate(
        nextDay.getDate()+1
      );


      filter.date={
        $gte:day,
        $lt:nextDay
      };

    }



    const attendance =
      await Attendance.find(filter)
      .populate(
        "student",
        "name rollNumber"
      )
      .populate(
        "class",
        "name section"
      )
      .sort({
        date:-1
      });



    res.json(attendance);



  }catch(error){

    res.status(500).json({
      message:error.message
    });

  }

};






// @route PUT /api/attendance/:id

const updateAttendance = async(req,res)=>{

  try{


    const {
      status
    } = req.body;



    const updated =
      await Attendance.findByIdAndUpdate(

        req.params.id,

        {
          status,
          markedBy:req.user._id
        },

        {
          new:true,
          runValidators:true
        }

      );



    if(!updated){

      return res.status(404).json({
        message:"Attendance record not found"
      });

    }



    res.json(updated);



  }catch(error){

    res.status(500).json({
      message:error.message
    });

  }

};






// @route DELETE /api/attendance/:id

const deleteAttendance = async(req,res)=>{

  try{


    const deleted =
      await Attendance.findByIdAndDelete(
        req.params.id
      );


    if(!deleted){

      return res.status(404).json({
        message:"Attendance record not found"
      });

    }



    res.json({
      message:"Attendance record deleted"
    });



  }catch(error){

    res.status(500).json({
      message:error.message
    });

  }

};





module.exports = {
  markAttendance,
  getAttendance,
  updateAttendance,
  deleteAttendance
};

