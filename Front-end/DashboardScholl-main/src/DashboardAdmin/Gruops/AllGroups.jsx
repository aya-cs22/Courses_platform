import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function AllGroups() {
  // const [allData, setAllData] = useState({ data: [] });
  const [offline, setOffline] = useState([]);
  const [online, setOnline] = useState([]);
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const response = await axios.get("http://localhost:1337/api/groups");

  //     const onlineGroup = response.data.data.filter(
  //       (item) => item.attributes.Name_group === "online"
  //     );
  //     setOnline(onlineGroup);
  //     const offlineGroup = response.data.data.filter(
  //       (item) => item.attributes.Name_group !== "online"
  //     );
  //     setOffline(offlineGroup);
  //   };
  //   fetchData();
  // }, [allData]);
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
          Authorization: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MWEyY2NjOWZlNGJmODlmMWZjYTk3MSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcyOTc5MzA0MCwiZXhwIjoxNzI5ODAzODQwfQ.AI4c7QogO1eCV6zjoC7SP_HW0Z1zl4zuX0HzNUXSAI8`,
        },
      })
      .then((res) => {
        console.log(res.data);
        const onlineGroup = res.data.filter(
          (item) => item.type_course === "online"
        );
        setOnline(onlineGroup);
        const offlineGroup = res.data.filter(
          (item) => item.type_course !== "online"
        );
        setOffline(offlineGroup);
      });
  }, []);
  return (
    <div>
      <h1 className="text-center">All Groups</h1>
      <div className="d-flex flex-wrap justify-content-between container m-auto ">
        <div className="  m-2">
          <h1>Online Groups</h1>
          {online.map((item) => (
            <Link to={`/admin/${item._id}`} key={item.id}>
              <button className="btn btn-warning d-block m-2">
                {item.title} -{item.start_date.slice(0, 10)}
              </button>
            </Link>
          ))}
        </div>
        <div className="  m-2 ">
          <h1>Offline Groups</h1>
          {offline.map((item) => (
            <Link to={`/admin/${item._id})}`} key={item.id}>
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
