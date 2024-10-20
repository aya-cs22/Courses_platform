import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ setIsLoggedIn  }) {
  const [login, setLogin] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      login.email === "amer73090@gmail.com" &&
      login.password === "01020873873"
    ) {
      setLoading(true);
      setTimeout(() => {
        setIsLogin(true);
        navigate("/admin");
        setLoading(false);
        // setIsLoggedIn(true);
      }, 2000);
    } else {
      alert("Email or Password is not correct");
    }
  };

  // Redirect if the user is logged in
  React.useEffect(() => {
    if (isLogin) {
      navigate("/admin");
    }
  }, [isLogin, navigate]);

  return (
    <>
      <form
        className="container m-auto login card p-4"
        onSubmit={handleSubmit}
      >
        <h1 className="text-center">Admin Login</h1>
        <input
          type="email"
          placeholder="Email.."
          className="form-control m-2"
          value={login.email}
          onChange={(e) => setLogin({ ...login, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="form-control m-2"
          value={login.password}
          onChange={(e) => setLogin({ ...login, password: e.target.value })}
        />
        <button type="submit" className="btn btn-primary m-2">Submit</button>
      </form>
      {loading && <h1 className="text-center m-2">Loading....</h1>}
    </>
  );
}

export default Login;
