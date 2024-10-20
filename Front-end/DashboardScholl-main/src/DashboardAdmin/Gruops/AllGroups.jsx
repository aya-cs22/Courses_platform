import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function AllGroups() {
  const [allData, setAllData] = useState({ data: [] });
  const [offline, setOffline] = useState([]);
  const [online, setOnline] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("http://localhost:1337/api/groups");

      const onlineGroup = response.data.data.filter(
        (item) => item.attributes.Name_group === "online"
      );
      setOnline(onlineGroup);
      const offlineGroup = response.data.data.filter(
        (item) => item.attributes.Name_group !== "online"
      );
      setOffline(offlineGroup);
    };
    fetchData();
  }, [allData]);
  return (
    <div>
      <h1 className="text-center">All Groups</h1>
      <div className="d-flex flex-wrap justify-content-between container m-auto ">
        <div className="  m-2">
          <h1>Online Groups</h1>
          {online.map((item) => (
            <Link to={`/admin/${item.attributes.Date_Group.slice(0, 10)}`} key={item.id}>
              <button  className="btn btn-warning d-block m-2">
                {item.attributes.Name_group} -
                {item.attributes.Date_Group.slice(0, 10)}
              </button>
            </Link>
          ))}
        </div>
        <div className="  m-2 ">
          <h1>Offline Groups</h1>
          {offline.map((item) => (
            <Link to={`/admin/${item.attributes.Date_Group.slice(0, 10)}`} key={item.id}>
              <button  className="btn btn-warning d-block m-2">
                {item.attributes.Name_group} -
                {item.attributes.Date_Group.slice(0, 10)}
              </button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AllGroups;
