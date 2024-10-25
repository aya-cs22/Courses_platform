import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

function AllStudents() {
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
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/users", {
        headers: {
          Authorization:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MWEyY2NjOWZlNGJmODlmMWZjYTk3MSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcyOTc5MzA0MCwiZXhwIjoxNzI5ODAzODQwfQ.AI4c7QogO1eCV6zjoC7SP_HW0Z1zl4zuX0HzNUXSAI8",
        },
      })
      .then((res) => setStudents(res.data));
  }, []);
  useEffect(() => {
    const calcAllTask = allAttendace + allTasks + allQuiz;
    const allEvaluation =
      allDataTasks.allAttendace + allDataTasks.allTasks + allDataTasks.allQuiz;
    const evaluation = (allEvaluation / calcAllTask) * 100;
    setEvaluation(evaluation);
  }, []);

  const [newStudent, setNewStudent] = useState(false);
  const [newDataStudent, setNewDataStudent] = useState({
    name: "",
    email: "",
    password: "",
    phone_number: "",
    role: "user",
  });

  const handleChangeStudents = (e) => {
    e.preventDefault();
    setNewStudent(!newStudent);
  };
  const handleAddStudent = (e) => {
    e.preventDefault();
    console.log(newDataStudent);

    axios
      .post(
        "http://localhost:8000/api/users/adduser",
        {
          name: newDataStudent.name,
          email: newDataStudent.email,
          password: newDataStudent.password,
          phone_number: newDataStudent.phone_number,
          role: newDataStudent.role,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MWEyY2NjOWZlNGJmODlmMWZjYTk3MSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcyOTc5MzA0MCwiZXhwIjoxNzI5ODAzODQwfQ.AI4c7QogO1eCV6zjoC7SP_HW0Z1zl4zuX0HzNUXSAI8",
          },
        }
      )
      .then(() => {
        toast.success("Successfly New Student");

        setTimeout(() => {
          setNewStudent(false);
        }, 2000);
      });
  };
  return (
    <>
      <ToastContainer />
      <div>
        <h1>Students</h1>
        <button className="btn btn-success" onClick={handleChangeStudents}>
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
                <tr key={item.id}>
                  <td className="border">{index + 1}</td>
                  <td className="border">{item.name}</td>
                  <td className="border">{item.email}</td>

                  <td className="border">
                    {allAttendace} / {allDataTasks.allAttendace}
                  </td>
                  <td className="border">
                    {allTasks} / {allDataTasks.allTasks}
                  </td>
                  <td className="border">
                    {allQuiz} / {allDataTasks.allQuiz}
                  </td>
                  <td className="border">
                    {evaluation.toString().slice(0, 5)}%
                  </td>
                  <td className="border">{item.group}</td>
                </tr>
              ))}
          </tbody>
        </table>
      ) : (
        <>
          <form className="row p-2">
            <h2>New Student</h2>
            <input
              type="text"
              placeholder="Username"
              className="border rounded p-2 m-2 col-lg-3 col-md-10 col-sm-5"
              onChange={(e) =>
                setNewDataStudent({
                  ...newDataStudent,
                  name: e.target.value,
                })
              }
            />
            <input
              type="text"
              placeholder="Email"
              className=" border rounded p-2 m-2 col-lg-3 col-md-10 col-sm-5"
              onChange={(e) =>
                setNewDataStudent({ ...newDataStudent, email: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="password"
              className=" border rounded p-2 m-2 col-lg-3 col-md-10 col-sm-5"
              onChange={(e) =>
                setNewDataStudent({
                  ...newDataStudent,
                  password: e.target.value,
                })
              }
            />
            <input
              type="text"
              placeholder="Number"
              className=" border rounded p-2 m-2 col-lg-3 col-md-10 col-sm-5"
              onChange={(e) =>
                setNewDataStudent({
                  ...newDataStudent,
                  phone_number: e.target.value,
                })
              }
            />
            <select
              onChange={(e) => {
                setNewDataStudent({ ...newDataStudent, role: e.target.value });
              }}
              className=" border rounded p-2 m-2 col-lg-3 col-md-10 col-sm-5"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </form>
          <button className="btn btn-primary col-3 " onClick={handleAddStudent}>
            Create
          </button>
        </>
      )}
    </>
  );
}

export default AllStudents;
