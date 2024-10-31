import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

function NewTask() {
  const {groupId , lectureId } = useParams();

  const [newTask, setNewTask] = useState({
    description_task: "",
    start_date: "",
    end_date: "",
  });
const navigate = useNavigate()
  const getToken = JSON.parse(localStorage.getItem("token"));

  if (!getToken) {
    toast.error("Unauthorized. Please log in.");
    return;
  }
  const handleAddTask = (e) => {
    e.preventDefault();
    try{

      axios.post(
        `http://localhost:8000/api/lectures/${lectureId}/createtasks`,
        {
          newTask,
        },
        {
          headers: {
            "Content-Type": 'application/json',
            Authorization: `${getToken}`,
          },
        }
      ).then(()=>{
        toast.success("Creating TasK Successful")
        setTimeout(() => {
            navigate(`/admin/${groupId}/lectures`)
        }, 3000);
      })
    } catch(error){
        toast.error("Error : " + error)
    }
  };
  return (
    <>
    <ToastContainer />
    <div>
      <form className="row m-2 w-100" onSubmit={handleAddTask}>
        <h2>New Task</h2>
        <input
          type="text"
          placeholder="Description"
          className="border rounded p-2 m-2 col-lg-6 col-md-10 col-sm-5"
          onChange={(e) =>
            setNewTask({ newTask, description_task: e.target.value })
          }
        />
        <input
          type="datetime-local"
          name=""
          id=""
          className="border rounded p-2 m-2 col-lg-6 col-md-10 col-sm-5"
          onChange={(e) => setNewTask({ newTask, start_date: e.target.value })}
        />
        <input
          type="datetime-local"
          name=""
          id=""
          className="border rounded p-2 m-2 col-lg-6 col-md-10 col-sm-5"
          onChange={(e) => setNewTask({ newTask, end_date: e.target.value })}
        />
      </form>
      <button className="btn btn-primary col-3 m-3 " onClick={handleAddTask}>Create</button>
    </div>
    </>
  );
}

export default NewTask;
