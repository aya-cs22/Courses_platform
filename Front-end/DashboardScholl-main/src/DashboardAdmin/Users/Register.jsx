import React, { useState } from "react";
import "./register.css";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";

function Register() {
  const [showInputVerif, setShowInputVerif] = useState(false);
  const [number, setNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [register, setRegister] = useState({
    name: "",
    email: "",
    password: "",
    phone_number: "",
  });

  const handleRegister = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8000/api/users/register", register, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(() => {
        localStorage.setItem("token", JSON.stringify(res.data.token));
        setShowInputVerif(true);
        toast.success("Hello " + register.name + ", please check your email.");
      })
      .catch((err) => console.log("Error:" + err));
  };

  const handleVerification = (e) => {
    e.preventDefault();
    setLoading(true);
    const code = number.replace(/\s+/g, "");

    axios
      .post("http://localhost:8000/api/users/verify-Email", {
        email: register.email,
        code,
      })
      .then(() => {
        toast.success("Welcome " + register.name);
        setLoading(false);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      })
      .catch((err) => {
        toast.error("Verification failed: " + err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleChangeValue = (e) => {
    const inputNumber = e.target.value.replace(/\D/g, "");
    if (inputNumber.length <= 6) {
      const formattedInput = inputNumber.split("").join(" ").substr(0, 13);
      setNumber(formattedInput);
    } else {
      toast.error("يجب ادخال 6 ارقام");
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="bg-form">
        {!showInputVerif ? (
          <form className="p-3 rounded" onSubmit={handleRegister}>
            <h1 className="text-center">Register</h1>
            <input
              type="text"
              placeholder="Name"
              className="form-control border rounded mt-3"
              onChange={(e) =>
                setRegister({ ...register, name: e.target.value })
              }
            />
            <input
              type="email"
              placeholder="Email"
              className="form-control border rounded mt-3"
              onChange={(e) =>
                setRegister({ ...register, email: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="Password"
              className="form-control border rounded mt-3"
              required
              onChange={(e) =>
                setRegister({ ...register, password: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Phone Number"
              className="form-control border rounded mt-3"
              onChange={(e) =>
                setRegister({ ...register, phone_number: e.target.value })
              }
            />
            <div className="mt-2 p-2">
              <button className="btn btn-primary d-block w-100 m-auto">
                Submit
              </button>
            </div>
            <Link to={"/login"} className="text-decoration-underline p-2 mt-2">
              Sign In
            </Link>
          </form>
        ) : (
          <form className="p-3 rounded" onSubmit={handleVerification}>
            <h1 className="text-center">Verification</h1>
            <input
              type="text"
              placeholder="- - - - - -"
              className="form-control border rounded mt-3 text-center"
              required
              value={number}
              onChange={handleChangeValue}
            />
            <div className="mt-2 p-2">
              <button
                className="btn btn-primary d-block w-100 m-auto"
                disabled={number.replace(/\s+/g, "").length < 6}
              >
                {!loading ? "Send" : "Loading..."}
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}

export default Register;
