import React, { useEffect, useState } from "react";

import { json, Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { Helmet } from "react-helmet-async";
function Login() {
  const [login, setLogin] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const getToken = JSON.parse(localStorage.getItem("token"));
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!getToken) {
      toast.error("Unauthorized. Please log in.");
      return;
    }
    try {
      const res = await axios.post(
        "http://localhost:8000/api/users/login",
        {
          email: login.email,
          password: login.password,
        },
        {
          headers: {
            Authorization: `${getToken}`,
          },
        }
      );

      if (res.data.token) {
        toast.success("Login successful!");
        localStorage.setItem("token", JSON.stringify(res.data.token));
        setTimeout(() => {
          navigate("/admin");
        }, 2000);
      } else {
        toast.error("Invalid email or password.");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error("Invalid email or password.");
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  const handleForgetPass = (e) => {
    e.preventDefault();
    console.log({ email: login.email });
    if (!login.email) {
      toast.error("Please Enter Email");
    } else {
      axios.post("http://localhost:8000/api/users/forgot-password", {
        email: login.email,
      });
      navigate("/forgetpassword");
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
            <button className="btn btn-primary   d-block w-100 m-atuo">
              Submit
            </button>
          </div>

          <Link
            to={"/login"}
            className="text-decoration-underline p-2 mt-2 text-light"
          >
            Sign up
          </Link>
          <button onClick={handleForgetPass} className="btn">
            Forget Passwrod
          </button>
        </form>
      </div>
    </>
  );
}

export default Login;
