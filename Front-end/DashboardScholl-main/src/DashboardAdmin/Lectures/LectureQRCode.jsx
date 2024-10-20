import axios from "axios";
import React, { useState } from "react";
import QRCode from "react-qr-code";

function LectureQRCode() {
  const [qrValue, setQrValue] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [studentName, setStudentName] = useState({
    name: "",
    group: "",
  });

  const handleCreateQR = (e) => {
    e.preventDefault();
    const currentDateTime = new Date().toLocaleString();
    const attendance = `${qrValue} - ${currentDateTime}`;
    axios
      .post("http://localhost:1337/api/attendances", { data: { attendance } })
      .then((res) => console.log(res.data));
  };
  const handleQRRead = () => {
    setShowForm(true);
    setQrValue(false);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const attendanceData = { name: studentName.name, group: studentName.group };
    console.log(attendanceData);

    axios
      .post("http://localhost:1337/api/student-attendances", {data:attendanceData})
      .then((res) => console.log(res.data));

    setStudentName("");
    setShowForm(false);
  };
  const handlePrint =(e)=>{
    e.preventDefault()
    window.print()
  }

  return (
    <>
      <form className="m-2">
        <h1 className="m-2">Create New QR</h1>
        <input
          type="text"
          className="form-control m-2"
          placeholder="Lecture ID"
          onChange={(e) => setQrValue(e.target.value)}
        />
        <button className="btn btn-primary m-2" onClick={handleCreateQR}>
          Create
        </button>
        <button className="btn btn-primary m-2" onClick={handlePrint}>Print</button>
      </form>

      <div 
        style={{
          height: "auto",
          margin: "20px",
          maxWidth: 200,
          width: "100%",
        }}
      >
        {qrValue && (
          
          <div onClick={handleQRRead}>
            <h1 className="text-center"> QR </h1>
            <QRCode
              size={256}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              value={`https://forms.gle/soriGmhnmVZgBjTt6?lectureId=${qrValue}`} // إضافة lectureId
              viewBox={`0 0 256 256`}
            />
          </div>
        )}
       
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="m-2">
          <h2>Enter your name</h2>
          <input
            type="text"
            className="form-control m-2"
            placeholder="Your Name"
            value={studentName.name}
            onChange={(e) =>
              setStudentName({ ...studentName, name: e.target.value })
            }
            required
          />
          <input
            type="date"
             className="form-control m-2"
            value={studentName.group}
            onChange={(e) =>
              setStudentName({ ...studentName, group: e.target.value })
            }
          />
          <button className="btn btn-success m-2" type="submit">
            Submit
          </button>
        </form>
      )}
    </>
  );
}

export default LectureQRCode;
