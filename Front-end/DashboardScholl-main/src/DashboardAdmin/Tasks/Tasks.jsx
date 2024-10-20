import React from "react";
import './Task.css'
import { Link, useParams } from "react-router-dom";
function Tasks() {
  const { groupId } = useParams();
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
          <tr>
            <td className="border p-2">Task 2</td>
            <td className="border p-2">HTML , CSS 1</td>

            <td className="border p-2">5</td>
            <td className="border p-2"></td>
            <td className="border p-2"></td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

export default Tasks;
