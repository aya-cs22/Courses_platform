import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Lecture.css";

function Lectures() {
  const { groupId } = useParams();
  const [loading, setLoading] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [tableLecture, setTable] = useState(false);

  const [dataLecture, setDataLecture] = useState({
    lecuter_number: "",
    task: "",
    quiz: "",
    link_lecture: "",
    upload: "false",
    group: groupId,
  });
  const [allDataLectures, setAllDataLectures] = useState([]);

  const handleClick = () => {
    setIsClicked(!isClicked);
  };
  useEffect(() => {
    const fetchDataGroup = async () => {
      setLoading(true);
      const response = await axios.get("http://localhost:1337/api/lecture");
      const filterGroup = response.data.data.filter(
        (item) => item.attributes.group === groupId
      );

      setAllDataLectures(filterGroup);
      setLoading(false);
    };

    fetchDataGroup();
  }, [groupId]);
  const handleChangeLecture = (e) => {
    e.preventDefault();
    setTable(!tableLecture);
  };
  const handleAddLecture = async (e) => {
    e.preventDefault();
    if (dataLecture.lecuter_number && dataLecture.task && dataLecture.quiz) {
      await axios.post(
        "http://localhost:1337/api/lecture",
        { data: dataLecture },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Successed");
      setTimeout(() => {
        setTable(false);
      }, 2000);
    } else {
      // alert("plase inter all data");
      toast.error("Error !");
    }
  };
  return (
    <>
      <ToastContainer position="top-right" />
      {/* <h1>Lectures : {groupId}</h1> */}

      {loading && <h1>Loading...</h1>}
      <button className="btn btn-success m-2" onClick={handleChangeLecture}>
        {tableLecture ? "Show Lectures" : "New Lecture"}
      </button>
      {!tableLecture ? (
        <main className="container m-auto  mt-2 p-2 row  lectures-card">
          {allDataLectures.map((item, index) => (
            <div className="card" key={index}>
              <ul className="list-group list-group-flush ">
                <li className="list-group-item">
                  Number :{item.attributes.lecuter_number}
                </li>
                <li className="list-group-item">
                  Quiz :{item.attributes.quiz}
                </li>
                <li className="list-group-item">
                  Task : {item.attributes.task}
                </li>
                <li className="list-group-item">
                  <Link target="_blank"
                    to={item.attributes.link_lecture}
                    className="text-primary"
                  >
                    Link Lecture
                  </Link>
                </li>
                <li className="list-group-item">Attendance : </li>
                <li className="list-group-item">
                  Upload : {item.attributes.upload}
                </li>
                <li>
                  <Link to={`/admin/${groupId}/lectures/update/${item.id}`}>
                    <button className="btn btn-success m-2">Update</button>
                  </Link>

                  <button className="btn btn-danger m-2">Delete</button>
                </li>
              </ul>
            </div>
          ))}
        </main>
      ) : (
        <>
          <form className="row p-3 w-100 m-2">
            <h2>New Lecture</h2>
            <input
              type="text"
              placeholder="lecuter_number"
              className="border rounded p-2 m-2 col-lg-6 col-md-10 col-sm-5"
              onChange={(e) =>
                setDataLecture({
                  ...dataLecture,
                  lecuter_number: e.target.value,
                })
              }
            />
            <input
              type="text"
              placeholder="Quiz"
              className=" border rounded p-2 m-2 col-lg-6 col-md-10 col-sm-5"
              onChange={(e) =>
                setDataLecture({ ...dataLecture, quiz: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="task"
              className=" border rounded p-2 m-2 col-lg-6 col-md-10 col-sm-5"
              onChange={(e) =>
                setDataLecture({ ...dataLecture, task: e.target.value })
              }
            />
            <input
              type="url"
              placeholder="Url lecture"
              className=" border rounded p-2 m-2 col-lg-6 col-md-10 col-sm-5"
              onChange={(e) =>
                setDataLecture({
                  ...dataLecture,
                  link_lecture: e.target.value,
                })
              }
            />
            <select
              className=" border rounded p-2 m-2 col-lg-6 col-md-10 col-sm-5"
              onChange={(e) => {
                setDataLecture({ ...dataLecture, upload: e.target.value });
              }}
            >
              <option value="false">False</option>
              <option value="true">True</option>
            </select>
            <input
              type="date"
              className="border rounded p-2 m-2 col-lg-6 col-md-10 col-sm-5"
              value={groupId}
              onChange={(e) =>
                setDataLecture({
                  ...dataLecture,
                  group:groupId,
                })
              }
            />
          </form>
          <button className="btn btn-primary col-lg-3 col-md-5 ms-4 " onClick={handleAddLecture}>
            Create
          </button>
        </>
      )}

      <Outlet />
    </>
  );
}

export default Lectures;
