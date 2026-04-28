import React, { useState, useEffect } from 'react';

const CentralLibraryGateway = () => {
  const [clock, setClock] = useState("00:00:00 AM");
  const [date, setDate] = useState("");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      
      // Format Time
      let hours = now.getHours();
      let minutes = now.getMinutes();
      let seconds = now.getSeconds();
      let ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? '0' + minutes : minutes;
      seconds = seconds < 10 ? '0' + seconds : seconds;
      
      const timeStr = hours + ':' + minutes + ':' + seconds + ' ' + ampm;
      setClock(timeStr);

      // Format Date
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const dateStr = now.toLocaleDateString(undefined, options);
      setDate(dateStr);
    };

    const timer = setInterval(updateClock, 1000);
    updateClock();

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="gateway-body">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');

        .gateway-body { 
            background: #0f172a; 
            color: white; 
            min-height: 100vh; 
            display: flex; 
            flex-direction: column;
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Poppins', sans-serif;
        }

        /* --- HEADER SECTION --- */
        header {
            background: #1e293b;
            padding: 20px 50px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 3px solid #a855f7;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        }

        .lib-logo h1 { font-size: 24px; color: #a855f7; letter-spacing: 1px; margin: 0; }
        
        #dateTimeDisplay {
            text-align: right;
            background: rgba(168, 85, 247, 0.1);
            padding: 10px 20px;
            border-radius: 10px;
            border: 1px solid rgba(168, 85, 247, 0.3);
        }
        #clock { font-size: 20px; font-weight: 600; color: #f8fafc; }
        #date { font-size: 12px; color: #94a3b8; }

        /* --- NOTICE TICKER --- */
        .ticker-wrap {
            background: #a855f7;
            color: white;
            padding: 5px 0;
            overflow: hidden;
        }
        .ticker {
            display: inline-block;
            white-space: nowrap;
            padding-right: 100%;
            animation: ticker 20s linear infinite;
            font-size: 14px;
            font-weight: 500;
        }
        @keyframes ticker {
            0% { transform: translate3d(100%, 0, 0); }
            100% { transform: translate3d(-100%, 0, 0); }
        }

        /* --- MAIN CONTENT --- */
        .main-container {
            flex: 1;
            padding: 40px;
            max-width: 1300px;
            margin: 0 auto;
            width: 100%;
        }

        .welcome-text { text-align: center; margin-bottom: 40px; }
        .welcome-text h2 { font-size: 32px; margin-bottom: 10px; }
        .welcome-text p { color: #94a3b8; }

        /* --- LOGIN SELECTION CARDS --- */
        .login-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 25px;
            margin-bottom: 50px;
        }

        .role-card {
            background: #1e293b;
            padding: 30px;
            border-radius: 20px;
            text-align: center;
            border: 1px solid #334155;
            transition: all 0.3s ease;
            cursor: pointer;
            position: relative;
            overflow: hidden;
        }

        .role-card:hover {
            transform: translateY(-10px);
            border-color: #a855f7;
            box-shadow: 0 10px 30px rgba(168, 85, 247, 0.2);
        }

        .role-card .icon { font-size: 40px; margin-bottom: 15px; display: block; }
        .role-card h3 { font-size: 20px; margin-bottom: 10px; color: #f8fafc; }
        .role-card p { font-size: 13px; color: #94a3b8; margin-bottom: 20px; }
        
        .btn-select {
            background: #a855f7;
            color: white;
            padding: 10px 25px;
            border-radius: 25px;
            text-decoration: none;
            font-weight: 600;
            font-size: 14px;
            display: inline-block;
            transition: 0.3s;
        }
        .role-card:hover .btn-select { background: #9333ea; }

        /* --- RULES & INFO SECTION --- */
        .info-section {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin-top: 20px;
        }

        .info-card {
            background: rgba(30, 41, 59, 0.5);
            padding: 30px;
            border-radius: 15px;
            border: 1px solid #334155;
        }

        .info-card h3 { margin-bottom: 20px; color: #a855f7; display: flex; align-items: center; gap: 10px; }
        
        .list-item { 
            display: flex; 
            align-items: flex-start; 
            gap: 12px; 
            margin-bottom: 15px; 
            font-size: 14px;
            line-height: 1.5;
        }

        .check { color: #22c55e; font-weight: bold; }
        .cross { color: #ef4444; font-weight: bold; }

        footer {
            text-align: center;
            padding: 20px;
            background: #1e293b;
            color: #64748b;
            font-size: 12px;
            border-top: 1px solid #334155;
            margin-top: auto;
        }
      `}</style>

      <header>
        <div className="lib-logo">
          <h1>📚 CENTRAL LIBRARY</h1>
        </div>
        <div id="dateTimeDisplay">
          <div id="clock">{clock}</div>
          <div id="date">{date}</div>
        </div>
      </header>

      <div className="ticker-wrap">
        <div className="ticker">
          ⚠️ NOTICE: Library will remain closed on second Saturdays. | 📖 NEW ARRIVALS: 50+ Engineering Journals added to the CSE Section. | 🛡️ Reminder: Please renew your membership cards by month-end.
        </div>
      </div>

      <div className="main-container">
        <div className="welcome-text">
          <h2>Welcome to Unified Library Access</h2>
          <p>Please select your role to proceed to the secure login portal.</p>
        </div>

        <div className="login-grid">
          <div className="role-card" onClick={() => window.location.href='/studentlogin'}>
            <span className="icon">👨‍🎓</span>
            <h3>Student Login</h3>
            <p>Access catalog, check due dates, and reserve books online.</p>
            <span className="btn-select">Enter Portal</span>
          </div>

          <div className="role-card" onClick={() => window.location.href='/facultylogin'}>
            <span className="icon">🎓</span>
            <h3>Faculty Login</h3>
            <p>Request new procurements and manage department resources.</p>
            <span className="btn-select">Enter Portal</span>
          </div>

          <div className="role-card" onClick={() => window.location.href='/librarian'}>
            <span className="icon">📑</span>
            <h3>Librarian</h3>
            <p>Manage inventory, issue/return books, and handle fines.</p>
            <span className="btn-select">Staff Access</span>
          </div>

          <div className="role-card" onClick={() => window.location.href='/adminlogin'}>
            <span className="icon">🛡️</span>
            <h3>Admin</h3>
            <p>System configuration, user management, and analytics.</p>
            <span className="btn-select">Control Panel</span>
          </div>
        </div>

        <div className="info-section">
          <div className="info-card">
            <h3>✅ Library Do's</h3>
            <div className="list-item">
              <span className="check">✔</span>
              <span>Maintain absolute silence in the reading zones at all times.</span>
            </div>
            <div className="list-item">
              <span className="check">✔</span>
              <span>Keep books back on the trolley after use; do not misplace them.</span>
            </div>
            <div className="list-item">
              <span className="check">✔</span>
              <span>Check the condition of the book before borrowing.</span>
            </div>
            <div className="list-item">
              <span className="check">✔</span>
              <span>Show your ID card to the security while entering and exiting.</span>
            </div>
          </div>

          <div className="info-card">
            <h3>❌ Library Don'ts</h3>
            <div className="list-item">
              <span className="cross">✖</span>
              <span>Strictly no food or beverages allowed inside the library.</span>
            </div>
            <div className="list-item">
              <span className="cross">✖</span>
              <span>Do not use mobile phones; keep them on silent mode.</span>
            </div>
            <div className="list-item">
              <span className="cross">✖</span>
              <span>Avoid writing, highlighting, or folding corners of library books.</span>
            </div>
            <div className="list-item">
              <span className="cross">✖</span>
              <span>Do not reserve seats by leaving personal belongings behind.</span>
            </div>
          </div>
        </div>

        <div className="info-card" style={{ marginTop: '30px', textAlign: 'center' }}>
          <h3 style={{ justifyContent: 'center' }}>ℹ️ Library Timings</h3>
          <p style={{ color: '#cbd5e1' }}>Monday - Friday: 09:10 AM to 06:00 PM</p>
          <p style={{ color: '#cbd5e1' }}>Saturday: 09:10 AM to 04:00 PM | Sunday: Closed</p>
        </div>
      </div>

      <footer>
        &copy; 2026 Central Library Management System. All Rights Reserved. Developed by IT Department.
      </footer>
    </div>
  );
};

export default CentralLibraryGateway;