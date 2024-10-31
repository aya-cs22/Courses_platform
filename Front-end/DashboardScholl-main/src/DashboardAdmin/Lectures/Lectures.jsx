import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Lecture.css";

function Lectures() {
  const { groupId, lectureId } = useParams();
  const [loading, setLoading] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [tableLecture, setTable] = useState(false);
  const [dataLecture, setDataLecture] = useState({
    title: "",
    description: "",
    article: "",
    resources: [],
  });
  const navigate = useNavigate();
  const [allDataLectures, setAllDataLectures] = useState([]);

  const getToken = JSON.parse(localStorage.getItem("token"));

  if (!getToken) {
    toast.error("Unauthorized. Please log in.");
    return;
  }
  const handleClick = () => {
    setIsClicked(!isClicked);
  };
  useEffect(() => {
    const fetchDataGroup = async () => {
      setLoading(true);
      const response = await axios.get("http://localhost:8000/api/lectures");
      const filterGroup = response.data.filter(
        (item) => item.group_id === groupId
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
    if (dataLecture.title && dataLecture.description && dataLecture.article) {
      await axios.post(
        "http://localhost:8000/api/lectures",
        {
          group_id: groupId,
          title: dataLecture.title,
          description: dataLecture.description,
          article: dataLecture.article,
          resources: dataLecture.resources,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${getToken}`,
          },
        }
      );
      toast.success("Successed");
      setTimeout(() => {
        setTable(false);
      }, 2000);
    } else {
      // alert("please inter all data");
      toast.error("Error !");
    }
  };
  const handleDeleteLecture = (id) => {
    // console.log(id)
    axios
      .delete("http://localhost:8000/api/lectures/" + id, {
        headers: {
          Authorization: `${getToken}`,
        },
      })
      .then(() => toast.success("Delete Lecture Successful"));

    setTimeout(() => {
      window.location.reload();
    }, 3000);
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
                <li className="list-group-item">Number :{item.title}</li>
                <li className="list-group-item">article :{item.article}</li>
                <li className="list-group-item">
                  description : {item.description}
                </li>
                <li className="list-group-item">
                  <Link
                    target="_blank"
                    to={item.resources}
                    className="text-primary"
                  >
                    Link Lecture
                  </Link>
                </li>
                <li className="list-group-item">Attendance : </li>
                <li className="list-group-item">Upload : {item.upload}</li>
                <li className="list-group-item">
                  <Link to={`/admin/${groupId}/lectures/newTask/${item._id}`}>
                    <button className="btn btn-primary">New Task</button>
                  </Link>
                  <button className="btn btn-success ">
                    <Link
                      to={`/admin/${groupId}/tasks/${item._id}`}
                      className="text-light "
                    >
                      View Task
                    </Link>
                  </button>
                </li>

                <li>
                  <Link to={`/admin/${groupId}/lectures/update/${item._id}`}>
                    <button className="btn btn-success m-2">Update</button>
                  </Link>

                  <button
                    className="btn btn-danger m-2"
                    onClick={() => {
                      handleDeleteLecture(item._id);
                    }}
                  >
                    Delete
                  </button>
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
              placeholder="Title"
              className="border rounded p-2 m-2 col-lg-6 col-md-10 col-sm-5"
              onChange={(e) =>
                setDataLecture({
                  ...dataLecture,
                  title: e.target.value,
                })
              }
            />
            <input
              type="text"
              placeholder="article"
              className=" border rounded p-2 m-2 col-lg-6 col-md-10 col-sm-5"
              onChange={(e) =>
                setDataLecture({ ...dataLecture, article: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="description"
              className=" border rounded p-2 m-2 col-lg-6 col-md-10 col-sm-5"
              onChange={(e) =>
                setDataLecture({ ...dataLecture, description: e.target.value })
              }
            />
            <input
              type="url"
              placeholder="Url lecture"
              className=" border rounded p-2 m-2 col-lg-6 col-md-10 col-sm-5"
              onChange={(e) =>
                setDataLecture({
                  ...dataLecture,
                  resources: e.target.value,
                })
              }
            />
          </form>
          <button
            className="btn btn-primary col-lg-3 col-md-5 ms-4 "
            onClick={handleAddLecture}
          >
            Create
          </button>
        </>
      )}

      <Outlet />
    </>
  );
}

export default Lectures;
