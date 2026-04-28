import React, { useState, useEffect } from "react";
// import axios from "axios";
export default function Services() {

  const images = [
    "https://images.unsplash.com/photo-1521587760476-6c12a4b040da",
    "https://images.unsplash.com/photo-1507842217343-583bb7270b66",
    "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f"
  ];

  const [current, setCurrent] = useState(0);
  const [next, setNext] = useState(1);
  const [fade, setFade] = useState(false);

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
          overflow-y: auto;
        }

        .bg-layer {
          position: absolute;
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          transition: opacity 1s ease-in-out;
        }

        .bg2 { opacity: 0; }
        .bg2.active { opacity: 1; }

        .overlay {
          position: relative;
          z-index: 2;
          min-height: 100%;
          background: linear-gradient(to right, rgba(0,0,0,0.85), rgba(0,0,0,0.6));
          color: white;
          padding: 40px;
          text-align: center;
        }

        .navbar {
          height: 10px;
        }

        .hero {
          margin-top: 40px;
        }

        .hero h1 {
          font-size: 48px;
          margin-bottom: 10px;
        }

        .hero p {
          font-size: 18px;
          color: #ccc;
        }

        .services {
          margin-top: 50px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 25px;
          padding: 0 40px;
        }

        .card {
          position: relative;
          padding: 25px;
          border-radius: 20px;
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(12px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.6);
          transition: all 0.4s ease;
        }

        .card:hover {
          transform: translateY(-10px) scale(1.03);
        }

        .icon {
          font-size: 35px;
          margin-bottom: 15px;
        }

        .card p {
          color: #ddd;
        }

        /* 🔥 NEW TIMINGS SECTION */
        .timings {
          margin-top: 60px;
          padding: 25px;
          border-radius: 15px;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          width: 60%;
          margin-left: auto;
          margin-right: auto;
          box-shadow: 0 0 15px rgba(0,0,0,0.5);
        }

        .timings h2 {
          margin-bottom: 15px;
        }

        .timings p {
          font-size: 16px;
          margin: 6px 0;
          color: #eee;
        }

        .back {
          margin-top: 40px;
        }

        .back a {
          color: aqua;
          font-size: 20px;
          text-decoration: none;
        }
      `}</style>

      <div className="container">

        {/* BACKGROUND */}
        <div
          className="bg-layer"
          style={{ backgroundImage: `url(${images[current]})` }}
        ></div>

        <div
          className={`bg-layer bg2 ${fade ? "active" : ""}`}
          style={{ backgroundImage: `url(${images[next]})` }}
        ></div>

        {/* CONTENT */}
        <div className="overlay">

          <div className="navbar"></div>

          {/* HERO */}
          <div className="hero">
            <h1>Smart Library Services</h1>
            <p>
              Everything you need to manage, access, and explore knowledge efficiently
            </p>
          </div>

          {/* SERVICES */}
          <div className="services">

            <div className="card">
              <div className="icon">📚</div>
              <h3>Book Management</h3>
              <p>Efficiently manage issuing, returning, and availability of books.</p>
            </div>

            <div className="card">
              <div className="icon">🔎</div>
              <h3>Book Search</h3>
              <p>Quickly find books by title, author, or category.</p>
            </div>

            <div className="card">
              <div className="icon">💻</div>
              <h3>Digital Library</h3>
              <p>Access e-books and online academic resources anytime.</p>
            </div>

            <div className="card">
              <div className="icon">⏳</div>
              <h3>Due Tracking</h3>
              <p>Track due dates and avoid fines with alerts.</p>
            </div>

            <div className="card">
              <div className="icon">📩</div>
              <h3>Recommendations</h3>
              <p>Suggest new books and resources for the library.</p>
            </div>

            <div className="card">
              <div className="icon">👨‍🏫</div>
              <h3>Faculty Access</h3>
              <p>xtended borrowing and special privileges for faculty.</p>
            </div>

          </div>

          {/* 🔥 NEW LIBRARY TIMINGS */}
          <div className="timings">
            <h2>📅 Library Timings</h2>
            <p>Monday – Friday : 9:10 AM – 6:00 PM</p>
            <p>Saturday : 9:10 AM – 4:00 PM</p>
            <p>Sunday : Closed</p>
          </div>

          <div className="back">
            <a href="/">⬅ Back to Home</a>
          </div>

        </div>
      </div>
    </>
  );
}