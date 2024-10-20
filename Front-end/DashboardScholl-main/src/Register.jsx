import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    axios.post("http://localhost:1337/api/student-data", { data: registerData }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((res) => {
      console.log('Response:', res.data); // تحقق من البيانات الراجعة
      setLoading(false);

    })
    .catch((err) => {
      // تسجيل التفاصيل بشكل مفصل
      console.error('Error Response:', err.response ? err.response.data : 'No response');
      setError(err.response ? err.response.data.error.message : 'Something went wrong');
      setLoading(false);
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Register</h1>
      {error && <div>Error: {error}</div>}
      <input
        type="text"
        placeholder="User Name"
        value={registerData.name}
        onChange={(e) =>
          setRegisterData({ ...registerData, name: e.target.value })
        }
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={registerData.email}
        onChange={(e) =>
          setRegisterData({ ...registerData, email: e.target.value })
        }
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={registerData.password}
        onChange={(e) =>
          setRegisterData({ ...registerData, password: e.target.value })
        }
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};

export default Register;
