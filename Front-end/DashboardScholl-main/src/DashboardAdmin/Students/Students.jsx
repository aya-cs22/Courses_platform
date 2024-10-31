import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

function Students() {
  const { groupId } = useParams();

  const [students, setStudents] = useState([]);
  const [allDataTasks, setAllDataTasks] = useState({
    allAttendace: 2,
    allTasks: 2,
    allQuiz: 3,
  });
  const [allAttendace, setAllAttendace] = useState(10);
  const [allTasks, setAllTasks] = useState(10);
  const [allQuiz, setAllQuiz] = useState(10);
  const [evaluation, setEvaluation] = useState();
  const getToken = JSON.parse(localStorage.getItem("token"));

  useEffect(() => {
    const calcAllTask = allAttendace + allTasks + allQuiz;
    const allEvaluation =
      allDataTasks.allAttendace + allDataTasks.allTasks + allDataTasks.allQuiz;
    const evaluation = calcAllTask > 0 ? (allEvaluation / calcAllTask) * 100 : 0;
    setEvaluation(evaluation);
  }, [allAttendace, allTasks, allQuiz, allDataTasks]);
  

  const handleChangeStudents = (e) => {
    e.preventDefault();
    setNewStudent(!newStudent);
  };

  const [newStudent, setNewStudent] = useState(false);
  const [newDataStudent, setNewDataStudent] = useState({
    group_id: groupId || null ,
    name: "",
    email: "",
    password: "",
    phone_number: "",
    role: "user",
  });

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!getToken) {
      toast.error("Unauthorized. Please log in.");
      return;
    }
  
    try {
  await axios.post(
        "http://localhost:8000/api/users/adduser",
        newDataStudent,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${getToken}`,
          },
        }
      );
      toast.success("Successfully added new student");
      setNewStudent(false);

    } catch (error) {
      toast.error("Failed to add student");
      console.error(error);
    }
  };
  
  useEffect(() => {
  axios.get("http://localhost:8000/api/users", {
      headers: {
        Authorization: `${getToken}`,
      },
    }).then((res)=>{

      const filterStudentGroup = res.data.filter(
        (item) => item.group_id === groupId
      );
      console.log(filterStudentGroup);
      setStudents(filterStudentGroup)
    })
  }, []);

  return (
    <>
      <ToastContainer />
      <div>
        <button className="btn btn-success m-2" onClick={handleChangeStudents}>
          {!newStudent ? " New Student" : "Show Students"}
        </button>
      </div>
      {!newStudent ? (
        <table className="text-center m-auto mt-2 mb-2">
          <thead>
            <tr>
              <th className="border">ID</th>
              <th className="border">Name</th>
              <th className="border">Email</th>

              <th className="border">Attendance</th>
              <th className="border">Tasks</th>
              <th className="border">Quiz</th>
              <th className="border">Evaluation</th>
              <th className="border">All Details</th>
        
            </tr>
          </thead>
          <tbody>
            {students &&
              students.map((item, index) => (
                <tr key={index}>
                  <td className="border">{index + 1}</td>
                  <td className="border">{item.name}</td>
                  <td className="border">{item.email}</td>

                
                  <td className="border">
                    {item.attendanceCount}%
                  </td>
                  <td className="border">
                    {item.tasks}
                  </td>
                  <td  className="border"></td>
                  <td  className="border"></td>
                  <td  className="border">see More</td>
            
                </tr>
              ))}
          </tbody>
        </table>
      ) : (
        <>
          <form className="row m-2 w-100">
            <h2>New Student</h2>
            <input
              type="text"
              value={groupId}
              disabled
              className=" border rounded p-2 m-2 col-lg-6 col-md-10 col-sm-5"
            />
            <input
              type="text"
              placeholder="Username"
              className="border rounded p-2 m-2 col-lg-6 col-md-10 col-sm-5"
              onChange={(e) =>
                setNewDataStudent({
                  ...newDataStudent,
                  name: e.target.value,
                })
              }
            />
            <input
              type="email"
              placeholder="Email"
              className=" border rounded p-2 m-2 col-lg-6 col-md-10 col-sm-5"
              onChange={(e) =>
                setNewDataStudent({ ...newDataStudent, email: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="password"
              className=" border rounded p-2 m-2 col-lg-6 col-md-10 col-sm-5"
              onChange={(e) =>
                setNewDataStudent({
                  ...newDataStudent,
                  password: e.target.value,
                })
              }
            />
            <input
              type="text"
              placeholder="number"
              className=" border rounded p-2 m-2 col-lg-6 col-md-10 col-sm-5"
              onChange={(e) =>
                setNewDataStudent({
                  ...newDataStudent,
                  phone_number: e.target.value,
                })
              }
            />

            <select
              className="border rounded p-2 m-2 col-lg-6 col-md-10 col-sm-5"
              onChange={(e) =>
                setNewDataStudent({
                  ...newDataStudent,
                  role: e.target.value,
                })
              }
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </form>
          <button
            className="btn btn-primary col-3 m-3 "
            onClick={handleAddStudent}
          >
            Create
          </button>
        </>
      )}
    </>
  );
}

export default Students;
