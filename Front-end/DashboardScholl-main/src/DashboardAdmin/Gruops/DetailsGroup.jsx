import axios from "axios";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { NavLink, Outlet, useParams } from "react-router-dom";

function DetailsGroup() {
  const { groupId } = useParams();
  const [showDetailsGroup, setShowDetailsGroup] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/groups/" + groupId)
      .then((res) => setShowDetailsGroup(res.data), setLoading(true));
  }, [groupId]);

  const getLinkClassName = ({ isActive }) =>
    isActive ? "btn btn-success m-2" : "btn btn-warning m-2";

  return (
    <>
      <Helmet>
        <title>
          Group :
          {loading
            ? `${showDetailsGroup.title} ${showDetailsGroup.start_date}`
            : ` loading.. `}
        </title>
      </Helmet>
      <div>
        <h1 className="text-center">
          { loading ?  ` Group : ${showDetailsGroup.title} - ${showDetailsGroup.start_date} ` : " loading.."}
       
        </h1>
        <NavLink to={`/admin/${groupId}/students`} className={getLinkClassName}>
          Students
        </NavLink>
        <NavLink to={`/admin/${groupId}/tasks`} className={getLinkClassName}>
          Tasks
        </NavLink>
        <NavLink to={`/admin/${groupId}/lectures`} className={getLinkClassName}>
          Lectures
        </NavLink>
      </div>
      <Outlet />
    </>
  );
}

export default DetailsGroup;
