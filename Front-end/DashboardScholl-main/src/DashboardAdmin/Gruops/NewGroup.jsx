import axios from "axios";
import React, { useState } from "react";

function NewGroup() {
  const [newGroup, setNewGroup] = useState({
    Name_group: "online", // Default to "online" to match the initial value
    Date_Group: "",
  });
  const [offline, setOffline] = useState(false);

  const handleNewGroup = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:1337/api/groups", {data : newGroup},{header:{
        "Content-text":"application/json"
    }})
   
  };

  const handleOffline = (e) => {
    const selectedValue = e.target.value;
    setNewGroup({ ...newGroup, Name_group: selectedValue });
    setOffline(selectedValue === "offline"); // Update offline state based on selection
  };

  return (
    <div>
      <h1>New Group</h1>
      <form className="container" onSubmit={handleNewGroup}>
        <select
          className="form-control"
          onChange={handleOffline}
          value={newGroup.Name_group}
        >
          <option value="online">Online</option>
          <option value="offline">Offline</option>
        </select>
        {offline && (
          <input
            type="text"
            placeholder="Name Group"
            className="form-control ml-3 mt-4"
            onChange={(e) =>
              setNewGroup({ ...newGroup, Name_group: e.target.value })
            }
          />
        )}

        <input
          type="datetime-local"
          className="form-control ml-3 mt-4"
          onChange={(e) =>
            setNewGroup({ ...newGroup, Date_Group: e.target.value })
          }
        />

        <button type="submit" className="btn btn-primary mt-4">
          Submit
        </button>
      </form>
    </div>
  );
}

export default NewGroup;
