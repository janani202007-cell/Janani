import React, { useState, useEffect } from "react";

function Library() {

  // 🎯 TYPING EFFECT (HEADING)
  const [displayText, setDisplayText] = useState("");
  const fullText = "Welcome to VEMU Institute of Technology";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayText(fullText.slice(0, i + 1));
      i++;
      if (i === fullText.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // 🎯 PARAGRAPH TYPING
  const [paraText, setParaText] = useState("");
  const fullPara =
    "Explore our extensive collection of books, journals, and digital resources.";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setParaText(fullPara.slice(0, i + 1));
      i++;
      if (i === fullPara.length) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  // 🎯 BUTTON HOVER
  const [hover, setHover] = useState(false);

  return (
    <div style={styles.mainContainer}>

      {/* ✅ GLOBAL CSS FIX */}
      <style>
        {`
          html {
            scroll-behavior: smooth;
          }

          .nav-link {
            position: relative;
            text-decoration: none;
            color: white;
            cursor: pointer;
          }

          .nav-link::after {
            content: "";
            position: absolute;
            width: 0%;
            height: 2px;
            left: 0;
            bottom: -5px;
            background-color: #00ffff;
            transition: 0.3s;
          }

          .nav-link:hover::after {
            width: 100%;
          }

          .card:hover {
            transform: translateY(-10px);
            background: rgba(0,255,255,0.2);
            box-shadow: 0 0 20px #00ffff;
          }
        `}
      </style>

      {/* 🎥 BACKGROUND VIDEO */}
      <video autoPlay muted loop style={styles.video}>
        <source src="VEMU Institute of Technology.mp4" type="video/mp4" />
      </video>

      {/* 🌑 OVERLAY */}
      <div style={styles.overlay}></div>

      {/* 🔝 NAVBAR */}
      <nav style={styles.nav}>
        <ul style={styles.navLinks}>
          <li><a href="#home" className="nav-link">Home</a></li>
          <li><a href="#about" className="nav-link">About</a></li>
          <li><a href="#services" className="nav-link">Services</a></li>
          <li><a href="#contact" className="nav-link">Contact</a></li>
        </ul>

        <button
          style={{
            ...styles.loginBtn,
            transform: hover ? "scale(1.1)" : "scale(1)",
            boxShadow: hover ? "0 0 20px #00ffff" : "none"
          }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={() => window.location.href = "/library2"}
        >
          LOGIN
        </button>
      </nav>

      {/* 🏠 HOME */}
      <section id="home" style={styles.section}>
        <h1 style={styles.heading}>{displayText}</h1>
        <p style={styles.para}>{paraText}</p>

        <p style={styles.extraText}>
          Our central library is a hub of knowledge, offering a vast collection of academic books,
          research journals, and digital resources to support student learning.
        </p>
      </section>

      {/* ℹ️ ABOUT */}
      <section id="about" style={styles.section}>
        <h2>About</h2>

        <p style={styles.extraText}>
          VEMU Institute of Technology is a premier engineering institution committed to excellence
          in education, research, and innovation.
        </p>

        <p style={styles.extraText}>
          The campus features modern infrastructure, digital classrooms, and a well-equipped central library.
        </p>

        <p style={styles.extraText}>
          Our mission is to empower students with knowledge, skills, and values to succeed globally.
        </p>
      </section>

      {/* ⚙️ SERVICES */}
      <section id="services" style={styles.section}>
        <h2>Services</h2>

        <div style={styles.serviceGrid}>
          <div style={styles.card}>
            <img src="https://cdn-icons-png.flaticon.com/512/29/29302.png" style={styles.icon} />
            <p>Library Access</p>
          </div>

          <div style={styles.card}>
            <img src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png" style={styles.icon} />
            <p>Digital Resources</p>
          </div>

          <div style={styles.card}>
            <img src="https://cdn-icons-png.flaticon.com/512/2232/2232688.png" style={styles.icon} />
            <p>Book Borrowing</p>
          </div>

          <div style={styles.card}>
            <img src="https://cdn-icons-png.flaticon.com/512/3135/3135755.png" style={styles.icon} />
            <p>Research Support</p>
          </div>
        </div>

        <p style={styles.extraText}>
          Students can also reserve books online, renew them digitally, and access e-journals anytime.
        </p>
      </section>

      {/* 📞 CONTACT */}
      <section id="contact" style={styles.section}>
        <h2>Contact</h2>

        <p>📞 +91 8886661148</p>
        <p>📧 vemupat@gmail.com</p>
        <p>📍 Chittoor, Andhra Pradesh</p>

        <p style={styles.extraText}>
          Library Timings: 9:00 AM – 6:00 PM (Monday to Saturday)
        </p>

        <p style={styles.extraText}>
          Our staff is always available to assist you with book search, research, and digital access.
        </p>
      </section>

    </div>
  );
}

const styles = {

  mainContainer: {
    position: "relative",
    height: "100vh",
    overflowY: "scroll",
    color: "white"
  },

  video: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    zIndex: -2
  },

  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.6)",
    zIndex: -1
  },

  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 40px",
    position: "fixed",
    width: "100%",
    top: 0,
    zIndex: 100
  },

  navLinks: {
    display: "flex",
    gap: "30px",
    listStyle: "none",
    fontSize: "30px",
    fontWeight: "bold"
  },

  loginBtn: {
    padding: "15px 30px",
    background: "linear-gradient(45deg, #00ffff, #0077ff)",
    border: "none",
    borderRadius: "12px",
    fontWeight: "bold",
    cursor: "pointer",
    marginRight: "70px"
  },

  section: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    padding: "20px"
  },

  heading: {
    fontSize: "40px",
    marginBottom: "20px"
  },

  para: {
    fontSize: "20px"
  },

  extraText: {
    fontSize: "16px",
    marginTop: "15px",
    maxWidth: "700px",
    lineHeight: "1.6"
  },

  serviceGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "30px",
    marginTop: "30px",
    width: "80%"
  },

  card: {
    background: "rgba(255,255,255,0.1)",
    padding: "20px",
    borderRadius: "15px",
    textAlign: "center",
    transition: "0.3s",
    cursor: "pointer"
  },

  icon: {
    width: "60px",
    marginBottom: "10px"
  }
};

export default Library;