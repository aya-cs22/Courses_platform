import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

function UpdateLecture() {
  const { groupId, lectureId } = useParams();
  const navigate = useNavigate();


  const [dataUpdate, setdataUpdate] = useState({
    title: "",
    description: "",
    article: "",
    resources: [],
    link_lecture: "",
  });
  const getToken = JSON.parse(localStorage.getItem("token"));

  if (!getToken) {
    toast.error("Unauthorized. Please log in.");
    return;
  }
  useEffect(() => {
    axios.get(`http://localhost:8000/api/lectures/${lectureId}`,{
      headers:{
        Authorization:`${getToken}`
      }
    }).then((res) => {
      setdataUpdate(res.data);
    });
  }, [lectureId]);
  const handleUpdate = (e) => {
    e.preventDefault();
    axios
      .put(
        `http://localhost:8000/api/lectures/${lectureId}`,
        {
           group_id: groupId,
          title:dataUpdate.title,
          description:dataUpdate.description,
          article:dataUpdate.article,
          resources:dataUpdate.resources
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${getToken}`,
          },
        }
      )
      .then(
        () => toast.success("Successfully updated"),
        setTimeout(() => {
          navigate(`/admin/${groupId}/lectures`);
        }, 2000)
      )
      .catch((err) => {
        console.error("Error updating data:", err);
        toast.error("Failed to update data");
      });
  };

  return (
    <>
      <ToastContainer />
      <form className="row p-2 ms-1  w-100">
        <h2>Update Lecture</h2>
        <input
          type="text"
          placeholder="Title"
          className="border rounded p-2 mt-2 mb-2 m-lg-1 col-lg-3 col-md-10 col-sm-5"
          onChange={(e) =>
            setdataUpdate({
              ...dataUpdate,
              title: e.target.value,
            })
          }
          value={dataUpdate.title}
        />
        <input
          type="text"
          placeholder="description"
          className=" border rounded p-2 mt-2 mb-2 m-lg-1 col-lg-3 col-md-10 col-sm-5"
          onChange={(e) =>
            setdataUpdate({ ...dataUpdate, description: e.target.value })
          }
          value={dataUpdate.description}
        />
        <input
          type="text"
          placeholder="article"
          className=" border rounded p-2 mt-2 mb-2 m-lg-1 col-lg-3 col-md-10 col-sm-5"
          onChange={(e) =>
            setdataUpdate({ ...dataUpdate, article: e.target.value })
          }
          value={dataUpdate.article}
        />
        <input
          type="url"
          placeholder="Url lecture"
          className=" border rounded p-2 mt-2 mb-2 m-lg-1 col-lg-6 col-md-10 col-sm-5"
          onChange={(e) =>
            setdataUpdate({
              ...dataUpdate,
              resources: e.target.value,
            })
          }
          value={dataUpdate.resources}
        />
      </form>
      <button className="btn btn-success col-3 " onClick={handleUpdate}>
        Update
      </button>
    </>
  );
}

export default UpdateLecture;
