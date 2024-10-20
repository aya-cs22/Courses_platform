import React from 'react'

function FormQr() {
  return (
  
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
   
  )
}

export default FormQr
