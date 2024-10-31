import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

function StudentsTable() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataUpdateStudent, setdataUpdateStudent] = useState({
    name: "",
    email: "",
    role: "",
    group_id: "",
  });
  const navigate = useNavigate();
  const { groudId } = useParams();
  const [dataUpdateStudentGroup, setDataUpdateStudentGroup] = useState([]);
  const [attendanceData, setAttendanceData] = useState([
    { lecture: "Lecture 1", attended: true },
    { lecture: "Lecture 2", attended: false },
    { lecture: "Lecture 3", attended: true },
    { lecture: "Lecture 4", attended: false },
    { lecture: "Lecture 5", attended: true },
    { lecture: "Lecture 6", attended: true },
    { lecture: "Lecture 7", attended: true },
    { lecture: "Lecture 8", attended: true },
    { lecture: "Lecture 9", attended: false },
  ]);

  // const [attendanceData, setAttendanceData] = useState({lecture:"",attended:""})
  const { studentId } = useParams();
  const getToken = JSON.parse(localStorage.getItem("token"));
  useEffect(() => {
    if (!getToken) {
      toast.error("Unauthorized. Please log in.");
      return;
    }
    const fetchStudents = async () => {
      const res = await axios.get(
        "http://localhost:8000/api/users/" + studentId,
        {
          headers: {
            Authorization: `${getToken}`,
          },
        }
      );
      setStudents(res.data);
      setLoading(false);
    };

    fetchStudents();
  }, [studentId, getToken]);

  const attendanceCount = attendanceData.reduce(
    (acc, curr) => {
      if (curr.attended) {
        acc.present += 1;
      } else {
        acc.absent += 1;
      }
      return acc;
    },
    { present: 0, absent: 0 }
  );
  const attendanceTotal = attendanceCount.present + attendanceCount.absent;
  useEffect(() => {
    const fetchStudent = async () => {
      if (!getToken) {
        toast.error("Unauthorized. Please log in.");
        return;
      }
      try {
        const res = await axios.get(
          `http://localhost:8000/api/users/${studentId}`,
          {
            headers: {
              Authorization: `${getToken}`,
            },
          }
        );
        setStudents(res.data);
        setdataUpdateStudent({
          name: res.data.name,
          email: res.data.email,
          role: res.data.role,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching student:", error);
        toast.error("Failed to load student data");
      }
    };

    fetchStudent();
  }, [studentId, getToken]);

  useEffect(() => {
    axios.get("http://localhost:8000/api/groups").then((res) => {
      const filterStudentGroup = res.data.filter(
        (item) => item.group_id === groudId
      );
      setDataUpdateStudentGroup(filterStudentGroup);
    });
  }, []);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  // update user
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:8000/api/users/${studentId}`,
        dataUpdateStudent,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${getToken}`,
          },
        }
      );
      toast.success("Student updated successfully");
    } catch (error) {
      toast.error("Failed to update student");
      console.error("Update error:", error);
    }
  };

  const handleDelete = (id) => {
    axios
      .delete("http://localhost:8000/api/users/" + id, {
        headers: {
          Authorization: `${getToken}`,
        },
      })
      .then(() => {
        toast.success("Deleted Student");
        setTimeout(() => {
          navigate("/admin/allStudent");
        }, 3000);
      });
  };

  return (
    <>
      <ToastContainer />
      <h1 className="text-center mt-2">Name : {students.name} </h1>
      <table className=" text-center m-auto mt-2 mb-2">
        <thead>
          <tr>
            {/* <th className="border">ID</th> */}
            <th className="border">Name</th>
            <th className="border">Email</th>
            <th className="border">Phone Number</th>
            <th className="border">Group Id</th>
            <th className="border">Role</th>
            <th className="border">Update</th>
            <th className="border">Delete</th>
          </tr>
        </thead>
        <tbody>
          {
            <tr>
              {/* <td className="border">{students._id}</td> */}
              <td className="border">{students.name}</td>
              <td className="border">{students.email}</td>
              <td className="border">{students.phone_number}</td>
              <td className="border">{students.group_id}</td>
              <td className="border">{students.role}</td>
              <td className="border">
                <button>Update</button>
              </td>
              <td className="border">
                <button onClick={() => handleDelete(studentId)}>Delete</button>
              </td>
            </tr>
          }
        </tbody>
      </table>
      <div className="d-flex flex-wrap m-auto justify-content-center align-items-center ">
        <div className="m-1 p-2 ">
          <h1 className="text-center">Attendance</h1>
          <ol>
            {attendanceData.map((item, index) => (
              <li key={index}>
                {item.lecture} :
                <span
                  className={item.attended ? "text-success" : "text-danger"}
                >
                  {item.attended ? " Done" : " Absent"}
                </span>
              </li>
            ))}
          </ol>
          <div className="text-center">
            <h2> Total : {attendanceTotal} </h2>
            <p>Present: {attendanceCount.present}</p>
            <p>Absent: {attendanceCount.absent}</p>
          </div>
        </div>

        <div className=" p-2 m-1">
          <h1 className="text-center">Tasks</h1>
          <ol>
            {attendanceData.map((item, index) => (
              <li key={index}>
                {item.lecture} :
                <span
                  className={item.attended ? "text-success" : "text-danger"}
                >
                  {item.attended ? " Done" : " Absent"} 7/10
                </span>
              </li>
            ))}
          </ol>
          <div className="text-center">
            <h2> Total : {attendanceTotal} </h2>
            <p>Present: {attendanceCount.present}</p>
            <p>Absent: {attendanceCount.absent}</p>
          </div>
        </div>
      </div>
      <div>
        <form className="row m-2 w-100 ms-1" onSubmit={handleUpdate}>
          <h2>Update Student</h2>
          <input
            type="text"
            placeholder="Name"
            value={dataUpdateStudent.name}
            disabled
            onChange={(e) =>
              setdataUpdateStudent({
                ...dataUpdateStudent,
                name: e.target.value,
              })
            }
            className="border rounded p-2 mt-2 mb-2 m-lg-1 col-lg-3 col-md-10 col-sm-5"
          />
          <input
            type="email"
            placeholder="Email"
            value={dataUpdateStudent.email}
            disabled
            onChange={(e) =>
              setdataUpdateStudent({
                ...dataUpdateStudent,
                email: e.target.value,
              })
            }
            className="border rounded p-2 mt-2 mb-2 m-lg-1 col-lg-3 col-md-10 col-sm-5"
          />
          <select
            value={dataUpdateStudent.role}
            className="border rounded p-2 m-2 col-lg-6 col-md-10 col-sm-5"
            onChange={(e) =>
              setdataUpdateStudent({
                ...dataUpdateStudent,
                role: e.target.value,
              })
            }
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <select
            value={dataUpdateStudent.group_id || ""}
            className="border rounded p-2 m-2 col-lg-6 col-md-10 col-sm-5"
            onChange={(e) =>
              setdataUpdateStudent({
                ...dataUpdateStudent,
                group_id: e.target.value,
              })
            }
            key={Math.random()}
          >
            {dataUpdateStudentGroup.map((item, index) => (
              
              <option key={index} value={item._id}>
                {item.title}
              </option>
            ))}
          </select>
          <button className="btn btn-danger p-2 mt-2 mb-2 m-lg-1 col-lg-3 col-md-10 col-sm-5">Not Active</button>
        </form>
        <button
          type="submit"
          className="btn btn-success col-3 m-3 "
          onClick={handleUpdate}
        >
          Update
        </button>
      </div>
    </>
  );
}

export default StudentsTable;
