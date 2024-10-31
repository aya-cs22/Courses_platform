import axios from "axios";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

function ForgetPass() {
  const [forgetPass, setForgetPass] = useState({
    resetCode: "",
    newPassword: "",
  });
  const navigate = useNavigate();
  const handleReset = (e) => {
    e.preventDefault();
    try{

        axios
          .post(
            "http://localhost:8000/api/users/reset-password",
            {
              resetCode: forgetPass.resetCode,
              newPassword: forgetPass.newPassword,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
          .then(() => {
            toast.success("Reset Successful");
            setTimeout(() => {
              navigate("/login");
            }, 2000);
          });
    
        if (!forgetPass.resetCode && !forgetPass.newPassword) {
          toast.error("Error : Reset Code");
        }
    } catch(error){
        toast.error("Error " + error )
    }
  };

  return (
    <>
      <ToastContainer />
      <Helmet>
        <title>Forget Password </title>
      </Helmet>
      <div className="bg-form">
        <form className="p-3 rounded" onSubmit={handleReset}>
          <h1 className="text-center ">Forget Password</h1>

          <input
            type="text"
            placeholder="Reset Code"
            className="form-control border rounded mt-3 "
            required
            onChange={(e) =>
              setForgetPass({ ...forgetPass, resetCode: e.target.value })
            }
          />
          <input
            type="password"
            placeholder="New Password"
            className="form-control border rounded mt-3 "
            required
            onChange={(e) =>
              setForgetPass({ ...forgetPass, newPassword: e.target.value })
            }
          />

          <div className="mt-2 p-2">
            <button className="btn btn-primary   d-block w-100 m-atuo">
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default ForgetPass;
