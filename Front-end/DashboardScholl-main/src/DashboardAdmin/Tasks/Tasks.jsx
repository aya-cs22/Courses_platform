import React, { useEffect, useState } from "react";
import "./Task.css";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
function Tasks() {
const {groupId} = useParams()
console.log(groupId)
  const [dataTask,setDataTask] = useState([])
  const getToken = JSON.parse(localStorage.getItem("token"));

  if (!getToken) {
    toast.error("Unauthorized. Please log in.");
    return;
  }
  useEffect(()=>{
    axios.get(`http://localhost:8000/api/lectures/${groupId}/tasks`,{
      headers:{
        Authorization:`${getToken}`
      }
    }).then((res)=>{
      console.log(res.data)
    })
  },[])
  return (
    <>
      <table className="text-center m-auto mt-2 mb-2">
        <thead>
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Delivered</th>
            <th className="border p-2">Start Date</th>
            <th className="border p-2">End Date</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border p-2">Task 1</td>
            <td className="border p-2">HTML </td>
            <td className="border p-2">5</td>
            <td className="border p-2">
              <input type="datetime-local" name="" id="" className="border" />
            </td>
            <td className="border p-2">
              <input type="datetime-local" name="" id="" className="border" />
            </td>
          </tr>
            {
              dataTask.map((item,index)=>(
                <tr key={index}>
                <th className="border p-2">{item.title}</th>
                <th className="border p-2">Description</th>
                <th className="border p-2">Delivered</th>
                <th className="border p-2">Start Date</th>
                <th className="border p-2">End Date</th>
              </tr>
              ))
            }
        </tbody>
      </table>

   
    </>
  );
}

export default Tasks;
