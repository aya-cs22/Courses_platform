import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function AllGroups() {
  const { groupId} = useParams()
  const [offline, setOffline] = useState([]);
  const [online, setOnline] = useState([]);

  const getToken = JSON.parse(localStorage.getItem("token"));
  if (!getToken) {
    toast.error("Unauthorized. Please log in.");
    return;
  }

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/groups", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${getToken}`,
        },
      })
      .then((res) => {

        const onlineGroup = res.data.filter(
          (item) => item.type_course === "online"
        );
        setOnline(onlineGroup);
        const offlineGroup = res.data.filter(
          (item) => item.type_course !== "online"
        );
        setOffline(offlineGroup);
      });
  }, [groupId]);
  return (
    <div>
      <h1 className="text-center">All Groups</h1>
      <div className="d-flex flex-wrap justify-content-between container m-auto ">
        <div className="  m-2">
          <h1>Online Groups</h1>
          {online.map((item, index) => (
            <Link to={`/admin/${item._id}`} key={index}>
              <button className="btn btn-warning d-block m-2">
                {item.title} -{item.start_date.slice(0, 10)}
              </button>
            </Link>
          ))}
        </div>
        <div className="  m-2 ">
          <h1>Offline Groups</h1>
          {offline.map((item, index) => (
            <Link to={`/admin/${item._id}`} key={index}>
              <button className="btn btn-warning d-block m-2">
                {item.title} -{item.start_date.slice(0, 10)}
              </button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AllGroups;
