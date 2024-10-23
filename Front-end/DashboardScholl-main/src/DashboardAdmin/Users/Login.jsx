import React, { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { Helmet } from "react-helmet-async";
function Login() {
  const [login, setLogin] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:8000/api/users/login",
        {
          email: login.email,
          password: login.password,

        },
        {
          headers: {
            "Content-Type": "application/json  ",
          },
        }
      );
  
      // console.log(res.data.token)
      if (res.data.token) {
        toast.success("Login successful!");
        setTimeout(() => {
          navigate("/profile");
        }, 2000);
      } else {
        toast.error("Invalid email or password.");
      }
    } catch (error) {
      console.log("Error:" + error);
      toast.error("Invalid email or password.");
      setLoading(true);
    } finally {
      setTimeout(()=>{
        setLoading(false);
      },3000)
      
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
            onChange={(e) => setLogin({ ...login, password: e.target.value })}
          />

          <div className="mt-2 p-2">
          <button className="btn btn-primary d-block w-100" disabled={loading}>
              {loading ? "Loading..." : "Submit"}
            </button>
          </div>

          <Link to={"/register"} className="text-decoration-underline p-2 mt-2">
            Sign up
          </Link>
        </form>
      </div>
    </>
  );
}

export default Login;
