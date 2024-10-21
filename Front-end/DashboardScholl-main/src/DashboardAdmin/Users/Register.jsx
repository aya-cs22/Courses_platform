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
    phone_number: "",
  });

  // Handle form submission
  const handleRegister = (e) => {
    e.preventDefault();

    // // Check if all fields are filled
    if (!register.email || !register.name || !register.password || !register.phone_number) {
      toast.error("All fields are required");
      return;
    }

    axios
      .post("http://localhost:8000/api/users/register", {
        name: register.name,        
        email: register.email,      
        password: register.password,
        phone_number: register.phone_number,
      })
      .then(() => {
        toast.success("Hello " + register.name + ", registration successful! Please check your email for verification.");
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
          <h1 className="text-center">Register</h1>
          <input
            type="text"
            placeholder="Name"
            className="form-control border rounded mt-3"
            value={register.name}
            // required
            onChange={(e) => setRegister({ ...register, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            className="form-control border rounded mt-3"
            value={register.email}
            // required
            onChange={(e) => setRegister({ ...register, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            className="form-control border rounded mt-3"
            value={register.password}
            onChange={(e) => setRegister({ ...register, password: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Phone Number"
            className="form-control border rounded mt-3"
            value={register.phone_number}
            onChange={(e) => setRegister({ ...register, phone_number: e.target.value })}
            required
          />

          <div className="mt-2 p-2">
            <button className="btn btn-primary d-block w-100">
              Submit
            </button>
          </div>

          <Link to="/login" className="text-decoration-underline p-2 mt-2">
            Sign In
          </Link>
        </form>
      </div>
    </>
  );
}

export default Register;
