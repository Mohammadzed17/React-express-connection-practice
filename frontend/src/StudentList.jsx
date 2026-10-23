import { useState } from "react";
import { useEffect } from "react"


function StudentList(){

    const API_URL = import.meta.env.VITE_API_URL;



    const [loading,setLoading] = useState(true);
    const [saving,setSaving] = useState(false);
    const [error,setError] = useState("");
    const [success,setSuccess] = useState("");

    async function getStudentData(){
        try{
            const response = await fetch(`${API_URL}/api/students`);
            
            if(!response.ok){
                throw new Error("Could Not Fetch Students List")
            }
            const studentData = await response.json();
            setStudents(studentData);

        }
        catch(error){
            setError(error.message);
        }
        finally{
            setLoading(false);
        }
        }

    const [students,setStudents] = useState([]);
    useEffect(()=>{
        setError("");
        setSuccess("");
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
        setSaving(true);
        setError("");
        setSuccess("");
        e.preventDefault();
        async function sendData(){
            try{
            const response = await fetch(`${API_URL}/api/students`,
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

            if(!response.ok){
                throw new Error ("Enable to add this Student, please make sure age is >18 ")
            }
        
            const newStudentData = await response.json();
            setSuccess(` Student name: ${name} Data is saved suceesfully `)
            console.log(newStudentData);
            getStudentData();
            
        }
         catch(error){
            setError(error.message);
        }
        finally{
            setSaving(false);
        }
    }
        sendData();
    }
    function editStudent(id){
        setError("");
        setSuccess("");

        let newName = prompt("Enter New Name");
        let newAge = prompt("Enter New Age");

       
        async function editData(id){
            setSuccess("");
            setError("");
            
            try{
            const response = await fetch(`${API_URL}/api/students/${id}`,{
                method: "PATCH",
                headers:{
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: newName,
                    age: newAge
                })
            });

            if(!response.ok){
                throw new Error("Enable to Edit This Student's Data")
            }
            const updatedData = await response.json();
            console.log(updatedData);
            setSuccess(`${newName} data is updated successfully`)
        }
          catch(error){
            setError(error.message);
        }
            getStudentData();
        }
       
        editData(id);

    }

    function deleteStudent(id){
        setError("");
        setSuccess("");

        async function deleteData(){
        try{
            const response = await fetch(`${API_URL}/api/students/${id}`,{
                method: "DELETE"
            });

            if(!response.ok){
                throw new Error("Enable to Delete")
            }
            const deletedStudent = await response.json();
            console.log(deletedStudent)

            setSuccess("Student Data is Successfully Deleted");
        }
        catch(error){
            setError(error.message);
        }
            getStudentData();
        }
        deleteData(id);
    }
    if(loading){
        return(<h1> Loading..... </h1>);
    }
    return(
        <>
        <form onSubmit={addNewStudent}>
            <label htmlFor="nameInput">Name: </label>
            <input type="text" placeholder="Enter Name here.." value={name} onChange={handleNameInput} id="nameInput"/>
            <label htmlFor="ageInput">Age: </label>
            <input type="Number" placeholder="Enter Age here.." value={age} onChange={handleAgeInput} id="ageInput"/>
            <button type="submit" disabled={saving}> {saving ? "Saving...": "Add New Student"} </button>
        </form>
        <div className="message">
           {error &&  <p> {error} </p>}
           {success && <p> {success}</p>}
        </div>
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