import React, { useState } from "react";

import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
// Dashboard
import Dashboard from "./DashboardAdmin/Dashboard/Dashboard";
import Error from "./DashboardAdmin/Error";
import Login from "./DashboardAdmin/Dashboard/Login";
import DashboardIndex from "./DashboardAdmin/Dashboard//DashboardIndex";
// Group
import NewGroup from "./DashboardAdmin/Gruops/NewGroup";
import AllGroups from "./DashboardAdmin/Gruops/AllGroups";
import DetailsGroup from "./DashboardAdmin/Gruops/DetailsGroup";
// tasks
import Tasks from "./DashboardAdmin/Tasks/Tasks";
// students
import Students from "./DashboardAdmin/Students/Students";
import AllStudents from "./DashboardAdmin/Students/AllStudents";
import NewTask from "./DashboardAdmin/Tasks/NewTask";
// lecture
import Lectures from "./DashboardAdmin/Lectures/Lectures";
import UpdateLecture from "./DashboardAdmin/Lectures/UpdateLecture";

import PrivateRoute from "./DashboardAdmin/PrivateRoute";
// user
import Register from "./DashboardAdmin/Users/Register";
import LoginUser from "./DashboardAdmin/Users/Login";
import LectureQRCode from "./DashboardAdmin/Lectures/LectureQRCode";
import FormQr from "./DashboardAdmin/Users/FormQr";
import DetailsStudent from "./DashboardAdmin/Students/DetailsStudent";
import ForgetPass from "./DashboardAdmin/Users/ForgetPass";

const helmetContext = {};

function App() {
  var [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = createBrowserRouter([
    {
      path: "/login/admin",
      // element: <Login setIsLoggedIn={setIsLoggedIn} />,
      element: <Login />,
    },
    {
      path: "/admin",
      // element: <PrivateRoute element={<Dashboard />} isLoggedIn={isLoggedIn} />,
      element: <Dashboard />,

      children: [
        {
          index: true,
          element: <DashboardIndex />,
        },
        {
          path: "newGroup",
          element: <NewGroup />,
        },
        {
          path: "allGroups",
          element: <AllGroups />,
        },
        {
          path: "allStudent",
          element: <AllStudents />,
        },
        {
          path: "/admin/student/:studentId",
          element: <DetailsStudent />,
        },
        {
          path: "/admin/qr",
          element: <LectureQRCode />,
        },
        {
          path: "/admin/:groupId",
          element: <DetailsGroup />,
          children: [
            {
              path: "/admin/:groupId/tasks",
              element: <Tasks />,
            },
            {
              path: "/admin/:groupId/students",
              element: <Students />,
            },
            {
              path: "/admin/:groupId/lectures",
              element: <Lectures />,
            },
            {
              path: "/admin/:groupId/lectures/update/:lectureId",
              element: <UpdateLecture />,
            },
            {
              path: "/admin/:groupId/lectures/newTask/:lectureId",
              element: <NewTask />,
            },
          ],
        },
      ],
    },
    // user
    {
      path: "/Register",
      element: <Register />,
    },
    {
      path: "/login",
      element: <LoginUser />,
    },
    {
      path: "/forgetpassword",
      element: <ForgetPass />,
    },
    {
      path: "/attendance?/:id",
      element: <FormQr />,
    },
 
 
    {
      path: "*",
      element: <Error />,
    },
  ]);

  return (
    <HelmetProvider context={helmetContext}>
      <RouterProvider router={router} />
    </HelmetProvider>
  );
}

export default App;
