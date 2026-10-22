const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    age:{
        type: Number,
        required: true,
        min: [18, "Student Age Must be greater that 18"]
    }
});

const Student = mongoose.model("Student",studentSchema);

module.exports = Student;