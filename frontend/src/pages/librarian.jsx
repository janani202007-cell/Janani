import React, { useState } from "react";
import axios from "axios";
export default function LibrarianLogin() {
  const [showModal, setShowModal] = useState(false);
  const [libID, setLibID] = useState("");
  const [libPass, setLibPass] = useState("");
  const [statusMsg, setStatusMsg] = useState("");

  const openGoogleModal = () => setShowModal(true);
  const closeGoogleModal = () => setShowModal(false);

  const autoLogin = (email) => {
    alert("Authenticating: " + email);
    window.location.href = "/librarian1";
  };

  const handleManualLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: libID,
          password: libPass
        })
      });

      const data = await res.json();

      if (data.success) {
        window.location.href = "/librarian1";
      } else {
        setStatusMsg(data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      setStatusMsg("Server Error - Please try again");
    }
  };

  return (
    <div className="page">
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Segoe UI', sans-serif; }

        .page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          color: white;
          background: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)),
                      url("https://vemu.org/assets/img/library/IMG_9709.jpg") center/cover no-repeat;
        }

        header {
          width: 100%;
          text-align: center;
          padding: 20px 0;
          font-size: 28px;
          font-weight: bold;
          background: rgba(0,0,0,0.4);
          box-shadow: 0 0 12px aqua;
        }

        .login-box {
          margin: 80px 0;
          width: 360px;
          padding: 35px;
          border-radius: 15px;
          text-align: center;
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(15px);
          box-shadow: 0 0 20px aqua;
        }

        .staff-only {
          color: #ff4d4d;
          font-size: 11px;
          font-weight: bold;
          margin-bottom: 20px;
          letter-spacing: 1px;
        }

        input {
          width: 100%;
          padding: 12px;
          margin: 8px 0;
          border: none;
          border-radius: 8px;
          background: white;
          color: #333;
        }

        button {
          width: 100%;
          padding: 12px;
          margin-top: 15px;
          border: none;
          border-radius: 25px;
          background: aqua;
          color: black;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
        }

        .google-btn {
          background: white;
          color: #444;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          padding: 10px;
          border-radius: 25px;
          cursor: pointer;
          border: none;
          font-weight: 600;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.85);
          z-index: 100;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .google-modal {
          background: white;
          color: #333;
          width: 340px;
          border-radius: 12px;
          padding: 25px;
          text-align: left;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }

        .account-item {
          display: flex;
          align-items: center;
          padding: 12px;
          border: 1px solid #eee;
          border-radius: 8px;
          margin-bottom: 10px;
          cursor: pointer;
        }

        .account-item:hover {
          background: #f0faff;
          border-color: aqua;
        }

        .account-item img {
          width: 35px;
          height: 35px;
          border-radius: 50%;
          margin-right: 12px;
        }

        .account-info span {
          display: block;
          font-size: 14px;
          font-weight: bold;
        }

        .account-info small {
          color: #008b8b;
          font-size: 11px;
          font-weight: 600;
        }

        .cancel-btn {
          text-align: center;
          margin-top: 15px;
          font-size: 14px;
          color: #999;
          cursor: pointer;
        }

        #statusMsg {
          font-size: 12px;
          margin-top: 10px;
          font-weight: bold;
          color: #ff4d4d;
        }
      `}</style>

      <header>📚 Central Library Management</header>

      <div className="login-box">
        <form onSubmit={handleManualLogin}>
          <h2>Librarian Login</h2>
          <p className="staff-only">OFFICIAL STAFF ACCESS ONLY</p>

          <input
            type="text"
            placeholder="Librarian ID (LIB-XXX)"
            value={libID}
            onChange={(e) => setLibID(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={libPass}
            onChange={(e) => setLibPass(e.target.value)}
          />

          <button type="submit">Access Dashboard</button>

          <div id="statusMsg">{statusMsg}</div>
        </form>

        <div style={{ margin: "20px 0", color: "#ccc", fontSize: "12px" }}>
          OR
        </div>

        <button className="google-btn" onClick={openGoogleModal}>
          <img
            src="https://tse3.mm.bing.net/th/id/OIP.uBYsSL7JDekYP3VpxWZvYQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3"
            width="40"
            alt="google"
          />
          Continue with Google
        </button>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="google-modal">
            <h3 style={{ textAlign: "center" }}>Choose an account</h3>
            <p style={{ textAlign: "center", fontSize: "13px", color: "#666" }}>
              to continue to Library Portal
            </p>

            <div className="account-item" onClick={() => autoLogin("admin.librarian@library.com")}>
              <img src="https://ui-avatars.com/api/?name=Admin+Librarian&background=00ffff&color=000" alt="" />
              <div className="account-info">
                <span>Admin Librarian</span>
                <small>admin.librarian@library.com</small>
              </div>
            </div>

            <div className="account-item" onClick={() => autoLogin("staff.assistant@library.com")}>
              <img src="https://ui-avatars.com/api/?name=Staff+Assistant&background=00ffff&color=000" alt="" />
              <div className="account-info">
                <span>Staff Assistant</span>
                <small>staff.assistant@library.com</small>
              </div>
            </div>

            <div className="cancel-btn" onClick={closeGoogleModal}>
              Cancel
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

