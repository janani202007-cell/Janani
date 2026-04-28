import React, { useState, useEffect } from "react";
// import axios from "axios";
export default function Contact() {

  const images = [
    "https://images.unsplash.com/photo-1521587760476-6c12a4b040da",
    "https://images.unsplash.com/photo-1507842217343-583bb7270b66",
    "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f"
  ];

  const [current, setCurrent] = useState(0);
  const [next, setNext] = useState(1);
  const [fade, setFade] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  // Background animation
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(true);
      setTimeout(() => {
        setCurrent(next);
        setNext((next + 1) % images.length);
        setFade(false);
      }, 1000);
    }, 3500);

    return () => clearInterval(interval);
  }, [next, images.length]);

  // Send message
  const handleSend = () => {
    if (!name || !email || !message) {
      alert("Please fill all fields");
      return;
    }

    const newMessage = {
      name,
      email,
      message,
      time: new Date().toLocaleString()
    };

    const existing = JSON.parse(localStorage.getItem("messages")) || [];
    existing.push(newMessage);
    localStorage.setItem("messages", JSON.stringify(existing));

    setSuccess(true);
    setTimeout(() => setSuccess(false), 2500);

    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <>
      <style>{`
        body {
          margin: 0;
          font-family: 'Segoe UI', sans-serif;
        }

        .container {
          position: relative;
          height: 100vh;
          overflow: hidden;
        }

        .bg-layer {
          position: absolute;
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          transition: opacity 1s;
        }

        .bg2 { opacity: 0; }
        .bg2.active { opacity: 1; }

        /* 🔥 FIXED OVERLAY FOR BETTER TEXT VISIBILITY */
        .overlay {
          position: relative;
          z-index: 2;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          background: rgba(0,0,0,0.75);
        }

        .card {
          width: 90%;
          max-width: 1000px;
          display: flex;
          border-radius: 20px;
          overflow: hidden;
          backdrop-filter: blur(15px);
          background: rgba(255,255,255,0.08);
          box-shadow: 0 0 25px rgba(0,0,0,0.6);
        }

        .left, .right {
          flex: 1;
          padding: 30px;
          color: white;
        }

        .left {
          background: rgba(0,0,0,0.5);
        }

        .left h2, .right h2 {
          color: #ffffff;
          text-shadow: 0 0 8px rgba(0,0,0,0.8);
          margin-bottom: 20px;
        }

        .info {
          margin-bottom: 15px;
          color: #ffffff;
        }

        .info span {
          display: block;
          color: #dddddd;
        }

        .form-group {
          position: relative;
          margin-bottom: 20px;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 12px;
          border: none;
          border-radius: 8px;
          outline: none;
          background: rgba(255,255,255,0.9);
          color: #000;
          font-weight: 500;
        }

        .form-group label {
          position: absolute;
          top: 50%;
          left: 12px;
          transform: translateY(-50%);
          color: #cccccc;
          font-size: 14px;
          pointer-events: none;
          transition: 0.3s;
        }

        .form-group input:focus + label,
        .form-group textarea:focus + label,
        .form-group input:not(:placeholder-shown) + label,
        .form-group textarea:not(:placeholder-shown) + label {
          top: -8px;
          left: 8px;
          font-size: 12px;
          color: aqua;
          background: black;
          padding: 0 5px;
        }

        .btn {
          width: 100%;
          padding: 12px;
          border: none;
          border-radius: 25px;
          background: aqua;
          color: black;
          font-weight: bold;
          cursor: pointer;
          transition: 0.3s;
        }

        .btn:hover {
          transform: scale(1.05);
          background: #00cccc;
        }

        .success {
          position: absolute;
          top: 20px;
          right: 20px;
          background: green;
          padding: 10px 15px;
          border-radius: 8px;
          color: white;
        }

        @media(max-width: 768px) {
          .card {
            flex-direction: column;
          }
        }
      `}</style>
    
      <div className="container">
        {/* Background Images */}
        <div
          className="bg-layer"
          style={{ backgroundImage: `url(${images[current]})` }}
        ></div>

        <div
          className={`bg-layer bg2 ${fade ? "active" : ""}`}
          style={{ backgroundImage: `url(${images[next]})` }}
        ></div>

        {/* Content */}
        <div className="overlay">

          {success && <div className="success">✅ Message Sent</div>}

          <div className="card">

            {/* LEFT SIDE */}
            <div className="left">
              <h2>📞 Contact Info</h2>

              <div className="info">
                📍 <span>VEMU Institute of Technology</span>
              </div>

              <div className="info">
                📞 <span>+91 8886661148/28/50</span>
              </div>

              <div className="info">
                📧 <span>vemupat@gmail.com</span>
              </div>

              <div className="info">
                📧 <span>P.Kothakota,Tirupati-Chittoor Highwat.</span>
                <span>Chittoor (Dt),AP-517112.</span>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="right">
              <h2>📩 Send Message</h2>

              <div className="form-group">
                <input value={name} onChange={(e)=>setName(e.target.value)} placeholder=" " />
                <label>Name</label>
              </div>

              <div className="form-group">
                <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder=" " />
                <label>Email</label>
              </div>

              <div className="form-group">
                <textarea rows="4" value={message} onChange={(e)=>setMessage(e.target.value)} placeholder=" "></textarea>
                <label>Message</label>
              </div>

              <button className="btn" onClick={handleSend}>
                🚀 Send Message
              </button>

            </div>

          </div>
        </div>
      </div>
    </>
  );
}