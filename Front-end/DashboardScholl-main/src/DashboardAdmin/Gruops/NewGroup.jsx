import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify"; 

function NewGroup() {
  const [newGroup, setNewGroup] = useState({
    title: "",
    type_course: "online",
    location: "",
    start_date: "",
    end_date: "",
  });
  const [offline, setOffline] = useState(false);
  const navigate = useNavigate()
  const handleNewGroup = async (e) => {
    e.preventDefault();

    const getToken = JSON.parse(localStorage.getItem("token"));
    if (!getToken) {
      toast.error("Unauthorized. Please log in.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:8000/api/groups",
        {
          title: newGroup.title,
          type_course: newGroup.type_course,
          location: newGroup.location , 
          start_date: newGroup.start_date,
          end_date: newGroup.end_date,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: ` ${getToken}`, 
          },
        }
      );
      toast.success("Creating successful");
      setTimeout(() => {
        navigate("/admin/allGroups")
      }, 3000);
    } catch (error) {
      console.error("Error creating group:", error);
      toast.error("Failed to create group. Please try again.");
    }
  };

  const handleOffline = (e) => {
    const selectedValue = e.target.value;
    setNewGroup({ ...newGroup, type_course: selectedValue });
    setOffline(selectedValue === "offline");
  };

  return (
    <div>
      <ToastContainer />
      <h1>New Group</h1>
      <form className="container" onSubmit={handleNewGroup}>
        <input
          type="text"
          placeholder="Title"
          className="form-control mb-3 mt-4"
          onChange={(e) => setNewGroup({ ...newGroup, title: e.target.value })}
          required 
        />
        <select
          className="form-control"
          onChange={handleOffline}
          value={newGroup.type_course}
        >
          <option value="online">Online</option>
          <option value="offline">Offline</option>
        </select>
        {offline && (
          <input
            type="text"
            placeholder="Location"
            className="form-control ml-3 mt-4"
            value={newGroup.location}
            onChange={(e) =>
              setNewGroup({ ...newGroup, location: e.target.value })
            }
            required 
          />
        )}

        <input
          type="date"
          className="form-control ml-3 mt-4"
          onChange={(e) =>
            setNewGroup({ ...newGroup, start_date: e.target.value })
          }
          required 
        />
        <input
          type="date"
          className="form-control ml-3 mt-4"
          onChange={(e) =>
            setNewGroup({ ...newGroup, end_date: e.target.value })
          }
          required 
        />

        <button type="submit" className="btn btn-primary mt-4">
          Submit
        </button>
      </form>
    </div>
  );
}

export default NewGroup;
