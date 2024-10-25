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
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        "http://localhost:1337/api/data-students"
      );
      const filterGroupStudent = response.data.data.filter(
        (item) => item.attributes.group === groupId
        // console.log(item.id)
      );
      setStudents(filterGroupStudent);
    };

    fetchData();
  }, [students]);
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
    confPassword: "",
    number: "",
    group: groupId,
  });

  const handleChangeStudents = (e) => {
    e.preventDefault();
    setNewStudent(!newStudent);
  };
  const handleAddStudent = (e) => {
    e.preventDefault();
    if (
      newDataStudent.name &&
      newDataStudent.email &&
      newDataStudent.password
    ) {
      axios
        .post(
          "http://localhost:1337/api/data-students",
          { data: newDataStudent },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then(() => {
          toast.success("Successfly New Student");
          setTimeout(() => {
            setNewStudent(false);
          }, 2000);
        });
    } else {
      toast.error("Error !");
    }
  };
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
                <tr key={item.id}>
                  <td className="border">{index + 1}</td>
                  <td className="border">{item.attributes.name}</td>
                  <td className="border">{item.attributes.email}</td>

                  <td className="border">
                    {allAttendace} / {allDataTasks.allAttendace}
                  </td>
                  <td className="border">
                    {allTasks} / {allDataTasks.allTasks}
                  </td>
                  <td className="border">
                    {allQuiz} / {allDataTasks.allQuiz}
                  </td>
                  <td className="border">{evaluation.toString().slice(0,5)}%</td>
                  <td className="border">{item.attributes.group}</td>
                </tr>
              ))}
          </tbody>
        </table>
      ) : (
        <>
          <form className="row m-2">
            <h2 >New Student</h2>
            <input
              type="text"
              placeholder="Username"
              className="border rounded col-lg-3 col-md-10 col-sm-5 p-2 m-3"
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
              className=" border rounded col-lg-3 col-md-10 col-sm-5 p-2 m-3"
              onChange={(e) =>
                setNewDataStudent({ ...newDataStudent, email: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="password"
              className=" border rounded col-lg-3 col-md-10 col-sm-5 p-2 m-3"
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
              className=" border rounded col-lg-3 col-md-10 col-sm-5 p-2 m-3"
              onChange={(e) =>
                setNewDataStudent({
                  ...newDataStudent,
                  number: e.target.value,
                })
              }
            />

            <input
              type="date"
              className="border rounded col-lg-3 col-md-10 col-sm-5 p-2 m-3"
              value={groupId}
              onChange={(e) =>
                setDataLecture({
                  ...dataLecture,
                  group: groupId,
                })
              }
              readOnly
            />
          </form>
          <button className="btn btn-primary col-3 m-3 " onClick={handleAddStudent}>
            Create
          </button>
        </>
      )}
    </>
  );
}

export default Students;
