import React, { useEffect, useState } from "react";
import "./register.css";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
function Register() {
  const navigate = useNavigate();
  const [register, setRegister] = useState({
    name: "",
    email: "",
    password: "",
  
    number: "",
    dataGroup: "",
  });
  const handleRegister = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:8000/api/users/register",   { 
        email: register.email,
        username:register.name,
        password: register.password,
        phone:register.number,
        group:register.dataGroup
      })
      .then(() => {
        toast.success("Hello " + register.name);
        // setTimeout(() => {
        //   navigate("/login");
        // }, 2000);
      })
      .catch((err) => console.log("Error:" + err));
  };


  return (
    <>
      <ToastContainer />
      <div className="bg-form">
        <form className="p-3 rounded" onSubmit={handleRegister}>
          <h1 className="text-center ">Register</h1>
          <input
            type="text"
            placeholder="Name"
            className="form-control border rounded mt-3 "
            // required
            onChange={(e) => setRegister({ ...register, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            className="form-control border rounded mt-3 "
            // required
            onChange={(e) =>
              setRegister({ ...register, email: e.target.value })
            }
          />
          <input
            type="password"
            placeholder="Password"
            className="form-control border rounded mt-3 "
            required
            onChange={(e) =>
              setRegister({ ...register, password: e.target.value })
            }
          />
       
          <input
            type="text"
            placeholder="number"
            className="form-control border rounded mt-3 "
            // required
            onChange={(e) =>
              setRegister({ ...register, number: e.target.value })
            }
          />
          <input
            type="date"
            className="form-control border rounded mt-3 "
            // required
            onChange={(e) =>
              setRegister({ ...register, dataGroup: e.target.value })
            }
          />
          <div className="mt-2 p-2">
            <button className="btn btn-primary   d-block w-100 m-atuo">
              Submit
            </button>
          </div>

          <Link to={"/login"} className="text-decoration-underline p-2 mt-2">
            Sign In
          </Link>
        </form>
      </div>
    </>
  );
}

export default Register;
