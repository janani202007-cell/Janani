import React, { useState, useEffect } from "react";
import axios from "axios";
export default function LibraryAbout() {

  // 🔹 Background Images
  const images = [
    "https://th.bing.com/th/id/R.5b7925e677f1e97d037bea95ee99e51a?rik=qmM2%2fbBnSNxILA&riu=http%3a%2f%2fvemu.org%2fuploads%2fgallery%2f16_12_2019_2025775230.png&ehk=yf58ISxXj1fnwgmY2SZOMuXPNuusqPKyCtMYI0swRrA%3d&risl=&pid=ImgRaw&r=0",
    "https://images.shiksha.com/mediadata/images/1491905641phpAZEI2c_g.jpg",
    "https://th.bing.com/th/id/R.0a992ecf150903c212c3b98d8fa5835c?rik=AV3c6PKV6Ey2og&riu=http%3a%2f%2fvemu.org%2fassets%2fimg%2fdepartment%2fmooc-course.jpg&ehk=hjmGquX%2fLduNyEgxLJMYIvjHJZ5ZCSzyAl45tCXy1Og%3d&risl=&pid=ImgRaw&r=0"
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
      {/* ✅ CSS */}
      <style>{`
        .about-container {
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

        .overlay h1 {
          font-size: 45px;
          margin-bottom: 20px;
        }

        .overlay p {
          max-width: 900px;
          margin: auto;
          font-size: 18px;
          line-height: 1.7;
        }

        /* CARDS */
        .features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
          margin-top: 40px;
        }

        .card {
          background: rgba(255,255,255,0.1);
          border-radius: 15px;
          padding: 20px;
          backdrop-filter: blur(10px);
          box-shadow: 0 0 10px rgba(0,0,0,0.6);
          transition: transform 0.3s;
        }

        .card:hover {
          transform: scale(1.05);
        }

        .icon {
          font-size: 30px;
          margin-bottom: 10px;
        }

        .card h3 {
          margin-bottom: 10px;
        }

        /* IMAGE GALLERY */
        .gallery {
          margin-top: 40px;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 20px;
        }

        .gallery img {
          width: 260px;
          height: 180px;
          object-fit: cover;
          border-radius: 12px;
          box-shadow: 0 0 10px black;
          transition: transform 0.3s;
        }

        .gallery img:hover {
          transform: scale(1.05);
        }
      `}</style>

      <div className="about-container">

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
          <h1>Welcome to VEMU Central Library</h1>

          <p>
            The VEMU Central Library is a modern knowledge hub designed to support
            students and faculty with a vast collection of academic resources.
            It helps in managing books digitally, tracking issued and returned records,
            and improving accessibility for all users.
            <br /><br />
            Our library encourages reading, research, and innovation by providing
            a peaceful environment and advanced facilities for academic excellence.
          </p>

          {/* FEATURES */}
          <div className="features">

            <div className="card">
              <div className="icon">📚</div>
              <h3>Extensive Collection</h3>
              <p>Thousands of books, journals, and research materials.</p>
            </div>

            <div className="card">
              <div className="icon">💻</div>
              <h3>Digital System</h3>
              <p>Automated library management with easy access.</p>
            </div>

            <div className="card">
              <div className="icon">🔍</div>
              <h3>Easy Search</h3>
              <p>Quickly find books using organized catalog system.</p>
            </div>

            <div className="card">
              <div className="icon">🪑</div>
              <h3>Reading Space</h3>
              <p>Quiet and comfortable environment for study.</p>
            </div>

            <div className="card">
              <div className="icon">🌐</div>
              <h3>Internet Access</h3>
              <p>Online resources and browsing facilities.</p>
            </div>

            <div className="card">
              <div className="icon">📥</div>
              <h3>Book Requests</h3>
              <p>Recommend new books for academic needs.</p>
            </div>

          </div>

          {/* GALLERY */}
          <div className="gallery">
            <img src="https://vemu.org/assets/img/library/IMG_9709.jpg" alt="Library" />
            <img src="https://www.vemu.org/assets/img/campus_life/green_campus/2.jpg" alt="Campus" />
            <img src="https://vemu.org/uploads/gallery/16_12_2019_121690574.jpg" alt="Students" />
            <img src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da" alt="Reading" />
          </div>

        </div>
      </div>
    </>
  );
}