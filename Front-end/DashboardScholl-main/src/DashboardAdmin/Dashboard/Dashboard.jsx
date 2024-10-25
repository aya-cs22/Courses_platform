import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import "./Dashboard.css";
import axios from "axios";

import { IoMenu } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";

function Dashboard() {
  const [openTag, setOpenTag] = useState({
    online: true,
    offline: true,
    attecndace: true,
  });
  const [loading, setLoading] = useState(false);
  const [allData, setAllData] = useState({ data: [] });
  const [offline, setOffline] = useState([]);
  const [online, setOnline] = useState([]);
  const [dark, setDark] = useState(false);
  const [toggleNav, setToggleNav] = useState(true);

  const handleClick = (e) => {
    e.preventDefault();
    setDark(!dark);
  };
  const handleToggle = (e) => {
    e.preventDefault();
    setToggleNav(!toggleNav);
  };
  // useEffect(() => {
  //   // axios.get("http://localhost:1337/api/groups").then((res) => {
  //   //   console.log(res.data);
  //   // });
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
  const handleOpen = (tag) => {
    // console.log("open");
    // setOpenTag(!openTag)
    setOpenTag((prevState) => ({
      ...prevState,
      [tag]: !prevState[tag],
    }));
  };
  return (
    <div className="row">
      <div className={"col-lg-3 col-md-4 col-sm-12 p-0 "}>
        <div className="toggleMenu">
          <button className="btn btn-success" onClick={handleToggle}>
            <IoMenu />
          </button>
        </div>
        <ul
          className={`${
            toggleNav
              ? "dashboard-left p-2 m-0"
              : " dashboard-left p-2 m-0 toggle"
          }`}
        >
          <li className="d-flex  align-items-center">
            <button
              className="btn btn-warning text-dark"
              onClick={handleToggle}
            >
              <Link to={"/admin/newGroup"} className="text-dark">
                New Group
              </Link>
            </button>
            <button className="btn btn-dark text m-2" onClick={handleClick}>
              Dark
            </button>
            {/* <span>
          <IoMdClose />
          </span> */}
          </li>
          <li>
            <Link to={"/admin/allGroups"}>
              <button className="btn btn-warning text-dark   w-100 text-start ">
                All Groups
              </button>
            </Link>
          </li>
          <li>
            <Link to={"/admin/allStudent"}>
              <button className="btn btn-warning text-dark w-100 text-start ">
                All Students
              </button>
            </Link>
          </li>
          <li>
            <button
              className="btn btn-warning text-dark  dropdown-toggle w-100 text-start "
              onClick={() => handleOpen("online")}
            >
              Online
            </button>
            <ul className={openTag.online ? "ulShow" : ""}>
              {loading
                ? "Loading... "
                : online.map((item) => (
                    <Link
                      to={`/admin/${item.attributes.Date_Group.slice(0, 10)}`}
                      key={item.id}
                    >
                      <li key={item.id}>
                        {item.attributes.Name_group} -{" "}
                        {item.attributes.Date_Group.slice(0, 10)}
                      </li>
                    </Link>
                  ))}
            </ul>
          </li>
          <li>
            <button
              className="btn btn-warning text-dark dropdown-toggle  w-100 text-start "
              onClick={() => handleOpen("offline")}
            >
              Offline
            </button>
            <ul className={openTag.offline ? "ulShow" : ""}>
              {loading
                ? "Loading... "
                : offline.map((item) => (
                    <Link
                      to={`/admin/${item.attributes.Date_Group.slice(0, 10)}`}
                      key={item.id}
                    >
                      <li>
                        {item.attributes.Name_group}
                        {item.attributes.Date_Group.slice(0, 10)}
                      </li>
                    </Link>
                  ))}
            </ul>
          </li>
          <li>
            {/* <button
              className="btn btn-warning text-dark   w-100 text-start "
              // onClick={() => handleOpen("attecndace")}
            > */}
              <Link to={"/admin/qr"} className="btn btn-warning text-dark   w-100 text-start ">Attendance</Link>
              
            {/* </button> */}
            <ul className={openTag.attecndace ? "ulShow" : ""}></ul>
          </li>
          <li>
            <Link to={"/admin/search"}>
              <button className="btn btn-warning text-dark w-100 text-start ">
                Search
              </button>
            </Link>
          </li>
        </ul>
      </div>
      <div className={`col outlet ${dark ? "bg-dark text-light" : ""}`}>
        <Outlet />
      </div>
    </div>
  );
}

export default Dashboard;
