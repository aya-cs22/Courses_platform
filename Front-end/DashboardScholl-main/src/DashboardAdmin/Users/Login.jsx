import React, { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { Helmet } from "react-helmet-async";
function Login() {
  const [login, setLogin] = useState({
    email: "",
    passwordLogin: "",
  });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const resposnse = await axios.post(
        "http://localhost:8000/api/users/login",
        {
          email: login.email,
          password: login.passwordLogin,
           role: "user"
        }
      );
      if (resposnse.data.jwt) {
        // toast.success("Login successful!");
        // setTimeout(()=>{
        //   navigate("/admin");
        // },2000)
      } else {
        toast.error("Invalid email or password.");
      }
    } catch (error) {
      console.log("Error:" + error);
    }
  };

  return (
    <>
      <ToastContainer />
      <Helmet>
        <title>Login </title>
      </Helmet>
      <div className="bg-form">
        <form className="p-3 rounded" onSubmit={handleLogin}>
          <h1 className="text-center ">Login</h1>

          <input
            type="email"
            placeholder="Email"
            className="form-control border rounded mt-3 "
            required
            onChange={(e) => setLogin({ ...login, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            className="form-control border rounded mt-3 "
            required
            onChange={(e) =>
              setLogin({ ...login, passwordLogin: e.target.value })
            }
          />

          <div className="mt-2 p-2">
            <button className="btn btn-primary   d-block w-100 m-atuo">
              Submit
            </button>
          </div>

          <Link to={"/login"} className="text-decoration-underline p-2 mt-2">
            Sign up
          </Link>
        </form>
      </div>
    </>
  );
}

export default Login;
