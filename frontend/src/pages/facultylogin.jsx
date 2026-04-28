import React, { useState } from "react";
import "./index.css";

function App() {
  const [page, setPage] = useState("login");
  const [facultyId, setFacultyId] = useState("");
  const [password, setPassword] = useState("1234");
  const [inputPassword, setInputPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const books = [
    { title: "Data Structures & Algorithms", author: "N. Karumanchi", branch: "CSE", available: 12 },
    { title: "Electrical Machines", author: "P.S. Bimbhra", branch: "EEE", available: 8 },
    { title: "Modern Control Systems", author: "Richard C. Dorf", branch: "ECE", available: 5 },
    { title: "Design of Steel Structures", author: "S.K. Duggal", branch: "Civil", available: 3 },
    { title: "Engineering Thermodynamics", author: "P.K. Nag", branch: "Mechanical", available: 7 },
    { title: "Indian Polity", author: "M. Laxmikanth", branch: "Civil Services", available: 20 }
  ];

  const history = [
    { title: "Advanced Engineering Math", borrowed: "2026-01-10", due: "2026-04-10", status: "Borrowed" },
    { title: "Introduction to Algorithms", borrowed: "2026-02-01", due: "2026-05-01", status: "Borrowed" },
    { title: "A Brief History of Modern India", borrowed: "2026-01-20", due: "2026-04-20", status: "Borrowed" }
  ];

  const login = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/faculty/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        facultyId: facultyId,
        password: inputPassword
      })
    });

    const data = await res.json();

    if (data.success) {
      setFacultyId(data.user.facultyId);
      setPage("inventory");
    } else {
      alert(data.message);
    }
  } catch (err) {
    alert("Server Error");
  }
};

  const resetPassword = () => {
    if (newPassword === confirmPassword && newPassword !== "") {
      setPassword(newPassword);
      alert("Password Updated Successfully");
      setPage("login");
    } else {
      alert("Passwords do not match");
    }
  };

  const googleLogin = () => {
    alert("Redirecting to Google Login...");
    setTimeout(() => {
      setFacultyId("FAC-GOOGLE");
      setPage("inventory");
    }, 1000);
  };

  return (
    <div>
      {/* NAVBAR */}
      {page !== "login" && (
        <nav className="navbar">
          <div className="logo">LIB-TECH FACULTY</div>
          <div className="nav-links">
            <span onClick={() => setPage("inventory")}>Browse Books</span>
            <span onClick={() => setPage("history")}>Borrowing History</span>
            <span onClick={() => setPage("recommend")}>Recommend</span>
            <span onClick={() => setPage("login")}>Logout</span>
          </div>
        </nav>
      )}

      {/* LOGIN PAGE */}
      {page === "login" && (
        <div className="login-page">
          <h1 className="title">Central Library Maintenance System</h1>

          <div className="login-box">
            <h2>Faculty Login</h2>
            <input
  type="text"
  placeholder="Faculty ID"
  value={facultyId}
  onChange={(e) => setFacultyId(e.target.value)}
/>
            <input
              type="password"
              placeholder="Password"
              value={inputPassword}
              onChange={(e) => setInputPassword(e.target.value)}
            />
            <button onClick={login}>Login</button>

            <p className="link" onClick={() => setPage("forgot")}>
              Forgot Password?
            </p>

            <button className="google-btn" onClick={googleLogin}>
              Continue with Google
            </button>
          </div>
        </div>
      )}

      {/* FORGOT PASSWORD */}
      {page === "forgot" && (
        <div className="login-page">
          <div className="login-box">
            <h2>Reset Password</h2>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button onClick={resetPassword}>Confirm</button>
          </div>
        </div>
      )}

      {/* INVENTORY */}
      {page === "inventory" && (
        <div className="container">
          <div className="profile">
            <h3>ID: {facultyId}</h3>
            <p>Portal Access Active</p>
          </div>

          <h2>Book Repository (All Branches)</h2>

          <input className="search" placeholder="Search by Title, Author..." />

          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Branch</th>
                <th>Availability</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {books.map((book, index) => (
                <tr key={index}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.branch}</td>
                  <td>{book.available} Available</td>
                  <td>
                    <button className="reserve-btn">Reserve</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* HISTORY */}
      {page === "history" && (
        <div className="container">
          <h2>My Borrowing History</h2>

          <div className="alert">
            ⚠ Faculty members have a standard 90-day return policy.
          </div>

          <table>
            <thead>
              <tr>
                <th>Book Title</th>
                <th>Borrowed Date</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {history.map((item, index) => (
                <tr key={index}>
                  <td>{item.title}</td>
                  <td>{item.borrowed}</td>
                  <td>{item.due}</td>
                  <td className="status">{item.status}</td>
                  <td>
                    <button className="action-btn">Request Extension</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* RECOMMEND */}
      {page === "recommend" && (
        <div className="recommend-box">
          <h2>Recommend New Purchase</h2>
          <input placeholder="Book Title" />
          <input placeholder="Author" />
          <select>
            <option>CSE</option>
            <option>EEE</option>
            <option>ECE</option>
          </select>
          <textarea placeholder="Reason..." />
          <button>Submit</button>
        </div>
      )}
    </div>
  );
}

export default App;