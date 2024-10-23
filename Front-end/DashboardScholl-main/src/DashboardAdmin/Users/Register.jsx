import React, { useEffect, useState } from "react";
import "./register.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { Helmet } from "react-helmet-async";

function Register() {
  const navigate = useNavigate();

  const [register, setRegister] = useState({
    name: "",
    email: "",
    password: "",
    phone_number: "",
  });
  const [showInput, setShowInput] = useState(false);
  const [number, setNumber] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handle form submission
  const handleRegister = (e) => {
    e.preventDefault();

    // // Check if all fields are filled
    if (
      !register.email ||
      !register.name ||
      !register.password ||
      !register.phone_number
    ) {
      toast.error("All fields are required");
      return;
    }
    setLoading(true);
    axios
      .post(
        "http://localhost:8000/api/users/register",
        {
          name: register.name,
          email: register.email,
          password: register.password,
          phone_number: register.phone_number,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(() => {
        toast.success(
          "Hello " +
            register.name +
            ", registration successful! Please check your email for verification."
        );
        setLoading(false);
        setShowInput(true);
      })
      .catch((err) => {
        toast.error("Error... ");
        setLoading(false);
        console.log("Error:" + err);
      });
  };
  // handle Send Code verify
  async function handleSendCode(e) {
    e.preventDefault();
    console.log("Sending verification with:", {
      email: register.email,
      code: number.replace(/\s/g, ""),
    });
    const res = await axios.post(
      "http://localhost:8000/api/users/verify-Email",
      {
        email: register.email,
        code: number.replace(/\s/g, ""),
      },
      {
        headers: {
          "Content-type": "application/json",
        },
      }
    );
    if (res.status == 200) {
      setIsDisabled(true);
      setLoading(true);
      toast.success("Hello " + register.name);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } else {
      toast.error("Verification failed. Please check the code.");
    }
  }
  const handleChangeCode = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setLoading(false);
    const fromattedInput = value.split("").join(" ").substr(0, 12);
    if (value.length <= 6) {
      setNumber(fromattedInput);
      if (value.length === 6) {
        handleSendCode();
      }
    } else {
      setLoading(true);
      setIsDisabled(true);
      setTimeout(() => {
        setIsDisabled(false);
        setLoading(false);
      }, 4000);
      toast.error("Error Code");
    }
  };

  return (
    <>
      <ToastContainer />
      <Helmet>
        <title>Register </title>
      </Helmet>
      <div className="bg-form">
        {!showInput ? (
          <form className="p-3 rounded" onSubmit={handleRegister}>
            <h1 className="text-center">Register</h1>
            <input
              type="text"
              placeholder="Name"
              className="form-control border rounded mt-3"
              value={register.name}
              // required
              onChange={(e) =>
                setRegister({ ...register, name: e.target.value })
              }
            />
            <input
              type="email"
              placeholder="Email"
              className="form-control border rounded mt-3"
              value={register.email}
              // required
              onChange={(e) =>
                setRegister({ ...register, email: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="Password"
              className="form-control border rounded mt-3"
              value={register.password}
              onChange={(e) =>
                setRegister({ ...register, password: e.target.value })
              }
              // required
            />
            <input
              type="text"
              placeholder="Phone Number"
              className="form-control border rounded mt-3"
              value={register.phone_number}
              onChange={(e) =>
                setRegister({ ...register, phone_number: e.target.value })
              }
              // required
            />

            <div className="mt-2 p-2">
              <button
                className="btn btn-primary d-block w-100"
                disabled={loading}
              >
                {loading ? "Loading..." : "Submit"}
              </button>
            </div>

            <Link to="/login" className="text-decoration-underline p-2 mt-2">
              Sign In
            </Link>
          </form>
        ) : (
          <form className="p-3 rounded">
            <h1 className="text-center">Verifiction</h1>
            <input
              type="text"
              placeholder="- - - - - -"
              className="text-center form-control border rounded "
              onChange={handleChangeCode}
              value={number}
              disabled={isDisabled}
            />
            <button className="btn btn-primary d-block w-100 mt-3 mx-auto mt-2 p-2" onClick={handleSendCode}>
              {loading ? "loading..." : "Send"}
            </button>
          </form>
        )}
      </div>
    </>
  );
}

export default Register;
