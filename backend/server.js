const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Student = require("./models/student");

require("dotenv").config();

const app = express();

const port = process.env.PORT;

app.listen(port,()=>{
    console.log(`server is listening on port: ${port}`);
});

app.use(cors({
    origin: "http://localhost:5173"
}));

app.use(express.json());

async function main(){
    await mongoose.connect(process.env.MONGODB_URL);
}

main().then(res => console.log("connection successful"))
.catch((err) => console.log(err));

app.use((req,res,next) =>{
    console.log(`${req.method} ${req.path} ${new Date().toLocaleTimeString()}`);
    next();
});

app.get("/api/health",(req,res) =>{
    res.send("Api is running");
});

app.get("/api/students",async (req,res) =>{
    try{
    const allStudents = await Student.find();

    res.status(200).json(allStudents);
    }
    catch(error){
        res.status(400).json({
            message: error
        })
    }
});

app.post("/api/students", async (req,res) =>{
    try{
        const {name,age} = req.body;
        
        const newStudent = new Student({
            name: name,
            age: age
        });

        await newStudent.save();
        console.log(`${name}'s data is saved`);

        res.status(201).json({
            newStudent : newStudent,
            message: "Successfully Created"
        });
    }
    catch(error){
        res.status(400).json({
            message: error
        })
    }
});

app.patch("/api/students/:id",async (req,res) =>{
    try{
    const {id} = req.params;
    const {name, age} = req.body;

    const updatedStudent = await Student.findByIdAndUpdate(id, {name: name, age: age},{new: true, runValidators: true });
    res.status(200).json({
        message: "Successfully updated"
    })
    }
    catch(error){
        res.status(400).json({
            message: error
        })
    }

});

app.delete("/api/students/:id", async (req,res) =>{
    try{
    const {id} = req.params;
    const deletedStudent = await Student.findByIdAndDelete(id);
    res.status(200).json({
        message: "Student Data is Deleted Successfully"
    })
    }
    catch(error){
        res.status(400).json({
            message: error
        })
    }
});