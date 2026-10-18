import { useState } from "react";
import { useEffect } from "react"


function StudentList(){

    async function getStudentData(){
            const response = await fetch("http://localhost:3000/api/students");
            const studentData = await response.json();
            setStudents(studentData);
        }

    const [students,setStudents] = useState([]);
    useEffect(()=>{
        getStudentData();
        console.log(students)
    },[]);

    const [name,setName] = useState("guest");
    const [age,setAge] = useState(18);

    function handleNameInput(e){
        setName(e.target.value)
        console.log(name);
    }
    function handleAgeInput(e){
        setAge(e.target.value)
        console.log(age);
    }

    function addNewStudent(e){
        e.preventDefault();
        async function sendData(){
            const response = await fetch("http://localhost:3000/api/students",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name: name,
                        age: age
                    })
                }
            );
            const newStudentData = await response.json();
            console.log(newStudentData);
            getStudentData();
            
        }
        sendData();
    }
    function editStudent(id){

        let newName = prompt("Enter New Name");
        let newAge = prompt("Enter New Age");


        async function editData(id){
            const response = await fetch(`http://localhost:3000/api/students/${id}`,{
                method: "PATCH",
                headers:{
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: newName,
                    age: newAge
                })
            });
            const updatedData = await response.json();
            console.log(updatedData);
            getStudentData();
        }
        editData(id);

    }

    function deleteStudent(id){

        async function deleteData(){
            const response = await fetch(`http://localhost:3000/api/students/${id}`,{
                method: "DELETE"
            });

            const deletedStudent = await response.json();
            console.log(deletedStudent)
            getStudentData();
        }
        deleteData(id);
    }
    return(
        <>
        <form onSubmit={addNewStudent}>
            <label htmlFor="nameInput">Name: </label>
            <input type="text" placeholder="Enter Name here.." value={name} onChange={handleNameInput} id="nameInput"/>
            <label htmlFor="ageInput">Age: </label>
            <input type="Number" placeholder="Enter Age here.." value={age} onChange={handleAgeInput} id="nameInput"/>
            <button type="submit"> Add New Student </button>
        </form>
         <h1> All Studnets Info is here: </h1>
         <ul>
         {students.map((student)=>{
           return <li key={student._id}> {student.name} - {student.age} 
            <button onClick={() => editStudent(student._id)}> Edit </button>
            <button onClick={() => deleteStudent(student._id)}> Delete </button>
           </li>
         })}
         </ul>
        </>
    )
}

export default StudentList