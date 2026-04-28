import React, { useState, useEffect } from "react";
import axios from "axios";
export default function Home() {

  // 🔹 Background Images (same style as About.js)
  const images = [
    "https://images.unsplash.com/photo-1518770660439-4636190af475", // CSE
    "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789", // EEE
    "https://frontlinesmedia.in/wp-content/uploads/2023/03/ece.jpg", // ECE
    "https://tse4.mm.bing.net/th/id/OIP.yjOtliDB7DYjXMYr7iIKegHaE8?rs=1&pid=ImgDetMain&o=7&rm=3",    // CIVIL
    "https://th.bing.com/th/id/OIP.4kumO5OCvFxx-X28AhRJQgHaEJ?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3"  // MECH
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
    }, 3000);

    return () => clearInterval(interval);
  }, [next, images.length]);

  return (
    <>
      {/* SAME CSS STRUCTURE AS ABOUT */}
      <style>{`
        .container {
          position: relative;
          height: 100vh;
          overflow-y: auto;
          font-family: 'Segoe UI', sans-serif;
        }

        .bg-layer {
          position: absolute;
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          transition: opacity 1s ease-in-out;
        }

        .bg1 { z-index: 1; }
        .bg2 { z-index: 2; opacity: 0; }
        .bg2.active { opacity: 1; }

        .overlay {
          position: relative;
          z-index: 3;
          min-height: 100%;
          background: rgba(0,0,0,0.7);
          color: white;
          padding: 40px;
          text-align: center;
        }

        .navbar h2 {
          font-size: 30px;
          margin-bottom: 20px;
        }

        .content {
          height: 80vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 0 20%;
        }

        .content h1 {
          font-size: 48px;
          margin-bottom: 20px;
        }

        .content p {
          font-size: 20px;
          line-height: 1.6;
          font-weight: bold;
        }

        /* BRANCH CARDS */
        .branches {
          margin-top: 40px;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 20px;
        }

        .branch-card {
          position: relative;
          width: 200px;
          height: 140px;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 0 10px black;
        }

        .branch-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s;
        }

        .branch-card:hover img {
          transform: scale(1.1);
        }

        .label {
          position: absolute;
          bottom: 0;
          width: 100%;
          background: rgba(0,0,0,0.6);
          text-align: center;
          padding: 5px;
          font-weight: bold;
        }

        .back {
          margin-top: 20px;
        }

        .back a {
          color: aqua;
          text-decoration: none;
          font-size: 20px;
        }
      `}</style>

      <div className="container">

        {/* BACKGROUND */}
        <div
          className="bg-layer bg1"
          style={{ backgroundImage: `url(${images[current]})` }}
        ></div>

        <div
          className={`bg-layer bg2 ${fade ? "active" : ""}`}
          style={{ backgroundImage: `url(${images[next]})` }}
        ></div>

        {/* CONTENT */}
        <div className="overlay">

          <div className="navbar">
            <h2><u>HOME PAGE</u></h2>
          </div>

          <div className="content">
            <h1>Welcome to VEMU Central Library</h1>

            <p>
              Welcome to the Department Library System, a smart and user-friendly
              platform developed to simplify library management.<br /><br />

              Our system helps students and faculty to search books,
              check availability, issue/return books, and manage their
              library activities online.<br /><br />

              It provides a fast, secure, and efficient way to access
              departmental learning resources anytime.
            </p>
          </div>

          {/* BRANCHES */}
          <div className="branches">
            <div className="branch-card">
              <img src={images[0]} alt="CSE" />
              <div className="label">CSE</div>
            </div>

            <div className="branch-card">
              <img src={images[1]} alt="EEE" />
              <div className="label">EEE</div>
            </div>

            <div className="branch-card">
              <img src={images[2]} alt="ECE" />
              <div className="label">ECE</div>
            </div>

            <div className="branch-card">
              <img src={images[3]} alt="CIVIL" />
              <div className="label">CIVIL</div>
            </div>

            <div className="branch-card">
              <img src={images[4]} alt="MECH" />
              <div className="label">MECH</div>
            </div>
          </div>

          <div className="back">
            <a href="/">⬅ Back to Home</a>
          </div>

        </div>
      </div>
    </>
  );
}