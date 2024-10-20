import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

function UpdateLecture() {
  const { groupId, lectureId } = useParams();
  const navigate = useNavigate();
  console.log(groupId);

  const [dataUpdate, setdataUpdate] = useState({
    lecuter_number: "",
    task: "",
    quiz: "",
    link_lecture: "",
    upload: "false",
    group: groupId || "",
  });
  useEffect(() => {
    axios.get(`http://localhost:1337/api/lecture/${lectureId}` ).then((res) => {
      setdataUpdate(res.data.data.attributes);
    });
  }, [lectureId]);
  const handleUpdate = (e) => {
    e.preventDefault();
    axios
      .put(
        `http://localhost:1337/api/lecture/${lectureId}`,
        { data: { ...dataUpdate, group: groupId } },
        {
          headers: {
            "Content-Type": "application/json",
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
          placeholder="lecuter_number"
          className="border rounded p-2 mt-2 mb-2 m-lg-1 col-lg-3 col-md-10 col-sm-5"
          onChange={(e) =>
            setdataUpdate({
              ...dataUpdate,
              lecuter_number: e.target.value,
            })
          }
          value={dataUpdate.lecuter_number}
        />
        <input
          type="text"
          placeholder="Quiz"
          className=" border rounded p-2 mt-2 mb-2 m-lg-1 col-lg-3 col-md-10 col-sm-5"
          onChange={(e) =>
            setdataUpdate({ ...dataUpdate, quiz: e.target.value })
          }
          value={dataUpdate.quiz}
        />
        <input
          type="text"
          placeholder="task"
          className=" border rounded p-2 mt-2 mb-2 m-lg-1 col-lg-3 col-md-10 col-sm-5"
          onChange={(e) =>
            setdataUpdate({ ...dataUpdate, task: e.target.value })
          }
          value={dataUpdate.task}
        />
        <input
          type="url"
          placeholder="Url lecture"
          className=" border rounded p-2 mt-2 mb-2 m-lg-1 col-lg-6 col-md-10 col-sm-5"
          onChange={(e) =>
            setdataUpdate({
              ...dataUpdate,
              link_lecture: e.target.value,
            })
          }
          value={dataUpdate.link_lecture}
        />
        {/* <select
          name="upload"
          className=" border rounded p-2 mt-2 mb-2 m-lg-1 col-lg-3 col-md-10 col-sm-5"
          onChange={(e) => {
            setdataUpdate({ ...dataUpdate, upload: e.target.value });
          }}
          value={dataUpdate.upload}
        >
          <option value="false">False</option>
          <option value="true">True</option>
        </select> */}
        <input
          type="date"
          className="border rounded p-2 mt-2 mb-2 m-lg-1 col-lg-3 col-md-10 col-sm-5"
          onChange={(e) =>
            setdataUpdate({
              ...dataUpdate,
              group: e.target.value,
            })
          }
          value={dataUpdate.group}
          readOnly
        />
      </form>
      <button className="btn btn-success col-3 " onClick={handleUpdate}>
        Update
      </button>
    </>
  );
}

export default UpdateLecture;
