import React, { useState, useEffect } from 'react';

const IntegratedLibraryPortal = () => {
  // --- State Management ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentRole, setCurrentRole] = useState('Student'); 
  const [activeSection, setActiveSection] = useState('catalog');
  const [userSession, setUserSession] = useState({ name: '', branch: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [liveTime, setLiveTime] = useState(new Date().toLocaleTimeString());
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // --- Static Data ---
  const libraryData = [
    { title: "Introduction to Algorithms", auth: "Cormen", sub: "CSE", isbn: "CSE-101", total: 10, issued: 3},
    { title: "The C Programming Language", auth: "Ritchie", sub: "CSE", isbn: "CSE-102", total: 15, issued: 5 },
    { title: "Data Structure", auth: "Lipschutz", sub: "CSE", isbn: "CSE-103", total: 5, issued: 5 },
    { title: "Computer Networks", auth: "Andrew S.Tanenbaum", sub: "CSE", isbn: "CSE-104", total: 12, issued: 3 },
    { title: "Database System", auth: "Henry F.Korth", sub: "CSE", isbn: "CSE-105", total: 5, issued: 5},
    { title: "Artificial Intelligence", auth: "Stuart Russell", sub: "CSE", isbn: "CSE-106", total: 8, issued:3 },
    { title: "Electrical Machinery", auth: "P.S. Bimbhra", sub: "EEE", isbn: "EEE-202", total: 10, issued: 5 },
    { title: "Power System Engineering", auth: "Nagrath", sub: "EEE", isbn: "EEE-203", total: 8, issued: 2 },
    { title: "Digital Electronics", auth: "Morris Mano", sub: "ECE", isbn: "ECE-301", total: 12, issued: 4 },
    { title: "Microelectronic Circuits", auth: "Sedra & Smith", sub: "ECE", isbn: "ECE-302", total: 7, issued: 1 },
    { title: "Structural Analysis", auth: "R.C. Hibbeler", sub: "Civil", isbn: "CIV-401", total: 6, issued: 2 },
    { title: "Concrete Technology", auth: "M.S. Shetty", sub: "Civil", isbn: "CIV-402", total: 10, issued: 3 },
    { title: "Thermodynamics", auth: "P.K. Nag", sub: "Mechanical", isbn: "MEC-501", total: 15, issued: 4 },
    { title: "Theory of Machines", auth: "S.S. Rattan", sub: "Mechanical", isbn: "MEC-502", total: 9, issued: 2 },
    { title: "Indian Polity", auth: "M. Laxmikanth", sub: "Civil Services", isbn: "IAS-901", total: 25, issued: 5 },
    { title: "Ancient India", auth: "R.S. Sharma", sub: "Civil Services", isbn: "IAS-902", total: 12, issued: 8 }
  ];

  const issuedHistory = [
    { title: "Introduction to Algorithms", isbn: "CSE-101", branch: "CSE", date: "01-Apr-2026", due: "15-Apr-2026" },
    { title: "Computer Networks", isbn: "CSE-104", branch: "CSE", date: "15-Mar-2026", due: "30-Mar-2026" },
    { title: "Indian Polity", isbn: "IAS-901", branch: "Civil Services", date: "05-Apr-2026", due: "20-Apr-2026" },
    { title: "Ancient India", isbn: "IAS-902", branch: "Civil Services", date: "20-Mar-2026", due: "04-Apr-2026" }
  ];

  // --- Update Live Clock ---
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // --- Dynamic Fine Calculation Logic ---
  const calculateFine = (dueDateStr) => {
    const today = new Date();
    const dueDate = new Date(dueDateStr);
    const diffTime = today - dueDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const dailyRate = 5; 
    return diffDays > 0 ? diffDays * dailyRate : 0;
  };

  // --- Handlers ---
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userId = formData.get('loginID');
    const name = formData.get('loginName');
    const password = formData.get('loginPassword');
    const branch = currentRole === 'Student' ? formData.get('loginBranch') : 'Administration';

    const savedUserData = JSON.parse(localStorage.getItem(`user_${userId}`));

    if (savedUserData) {
        if (savedUserData.password !== password) {
            alert("❌ Incorrect Password for this ID.");
            return;
        }
    } else {
        const newUserData = { userId, name, password, branch };
        localStorage.setItem(`user_${userId}`, JSON.stringify(newUserData));
        alert(`✅ Credentials for ID ${userId} saved.`);
    }
    
    setUserSession({ name, branch });
    setIsLoggedIn(true);
    setActiveSection('catalog');
  };

  const handleGoogleContinue = () => {
    setUserSession({ name: 'Google User', branch: 'CSE' });
    setIsLoggedIn(true);
    setActiveSection('catalog');
  };

  const roleConfigs = {
    Student: {
      img: "https://cache.careers360.mobi/media/presets/720X480/colleges/social-media/media-gallery/5168/2020/11/2/Library%20of%20Indus%20Institute%20of%20Technology%20and%20Engineering%20Ahmedabad_Library.jpg",
      title: "Student Hub",
      desc: "Access branch-specific resources and manage your active loans."
    },
    Faculty: {
      img: "https://vemu.org/assets/img/library/IMG_9709.jpg",
      title: "Faculty Access",
      desc: "Manage departmental research materials and reserve journals."
    },
    Librarian: {
      img: "https://vemu.org/assets/img/library/IMG_9709.jpg",
      title: "Staff Control",
      desc: "Monitor global circulation, stock levels, and student penalties."
    }
  };

  // --- Filtered and Calculated Data ---
  const filteredBooks = libraryData.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.isbn.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = (currentRole === 'Student') ? b.sub === userSession.branch : true;
    return matchesSearch && matchesRole;
  });

  const userHistory = issuedHistory.filter(i => (currentRole === 'Student' ? i.branch === userSession.branch : true));
  
  const totalFineAmount = userHistory.reduce((sum, item) => sum + calculateFine(item.due), 0);

  return (
    <div className="portal-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Poppins', sans-serif; }
        .portal-container { background: #0f172a; color: white; min-height: 100vh; width: 100%; display: flex; flex-direction: column; }
        .login-screen { 
          min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;
          background: linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url("https://vemu.org/assets/img/library/IMG_9709.jpg") center/cover;
        }
        .login-card { display: flex; width: 90%; max-width: 900px; height: 600px; background: rgba(30, 41, 59, 0.8); backdrop-filter: blur(20px); border-radius: 25px; border: 1px solid rgba(0, 255, 255, 0.2); overflow: hidden; margin-top: 70px; }
        .info-side { flex: 1; padding: 40px; background: rgba(0, 255, 255, 0.05); text-align: center; display: flex; flex-direction: column; justify-content: center; align-items: center; border-right: 1px solid rgba(255,255,255,0.1); }
        .info-side img { width: 100%; max-width: 250px; border-radius: 15px; margin-bottom: 20px; box-shadow: 0 0 20px rgba(0,255,255,0.2); }
        .form-side { flex: 1.2; padding: 30px; display: flex; flex-direction: column; justify-content: center; position: relative; }
        .role-tabs { display: flex; background: rgba(0,0,0,0.3); padding: 5px; border-radius: 50px; margin-bottom: 20px; }
        .tab { flex: 1; text-align: center; padding: 10px; border-radius: 50px; cursor: pointer; transition: 0.3s; font-size: 14px; }
        .tab.active { background: #00ffff; color: #0f172a; font-weight: 600; }
        input, select { width: 100%; padding: 10px; margin-bottom: 12px; border-radius: 8px; border: none; background: white; color: #333; outline: none; }
        .login-btn { width: 100%; padding: 12px; background: #00ffff; border: none; border-radius: 50px; color: #0f172a; font-weight: bold; cursor: pointer; transition: 0.3s; }
        .login-btn:hover { background: #00cccc; transform: scale(1.02); }
        .forgot-pass { color: #00ffff; font-size: 12px; text-align: right; margin-bottom: 15px; cursor: pointer; text-decoration: underline; }
        .google-btn { display: flex; align-items: center; justify-content: center; gap: 10px; background: white; color: #555; padding: 10px; border-radius: 50px; cursor: pointer; border: none; font-weight: 600; margin-top: 10px; font-size: 13px; }
        nav { height: 70px; background: #1e293b; display: flex; justify-content: space-between; align-items: center; padding: 0 40px; border-bottom: 2px solid #00ffff; position: sticky; top: 0; z-index: 1000; }
        .nav-links { display: flex; gap: 25px; align-items: center; }
        .nav-link { cursor: pointer; color: #cbd5e1; font-size: 14px; text-decoration: none; }
        .nav-link.active { color: #00ffff; font-weight: bold; }
        .ticker { background: #00ffff; color: #0f172a; padding: 6px; font-size: 13px; font-weight: 500; overflow: hidden; }
        .ticker-move { display: inline-block; white-space: nowrap; animation: move 25s linear infinite; }
        @keyframes move { from { transform: translateX(100%); } to { transform: translateX(-100%); } }
        .content { padding: 40px; max-width: 1200px; margin: 0 auto; flex: 1; width: 100%; }
        .card-stat { background: #1e293b; padding: 20px; border-radius: 15px; border: 1px solid #334155; text-align: center; }
        .book-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; margin-top: 30px; }
        .book-card { background: #1e293b; padding: 20px; border-radius: 15px; border: 1px solid rgba(255,255,255,0.1); }
        .status-badge { font-size: 10px; padding: 3px 10px; border-radius: 50px; font-weight: bold; }
        .bg-avail { background: rgba(34, 197, 94, 0.2); color: #4ade80; }
        .bg-out { background: rgba(239, 68, 68, 0.2); color: #f87171; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; color: white; }
        th { text-align: left; padding: 12px; border-bottom: 2px solid #00ffff; color: blue; font-size: 12px; }
        td { padding: 12px; border-bottom: 1px solid #334155; font-size: 14px;color:black }
        .librarian-footer { background: #1e293b; border-top: 1px solid #00ffff; padding: 30px 40px; margin-top: 50px; display: flex; justify-content: space-around; align-items: center; flex-wrap: wrap; gap: 20px; }
        .lib-info-block { display: flex; align-items: center; gap: 15px; }
        .lib-avatar { width: 50px; height: 50px; border-radius: 50%; border: 2px solid #00ffff; object-fit: cover; }
      `}</style>

      {!isLoggedIn ? (
        <div className="login-screen">
          <header style={{position: 'absolute', top: 0, width: '100%', textAlign: 'center', padding: '20px', background: 'rgba(0,0,0,0.5)', borderBottom: '2px solid #00ffff'}}>
            <h2>CENTRAL LIBRARY PORTAL</h2>
          </header>

          <div className="login-card">
            <div className="info-side">
              <img src={roleConfigs[currentRole].img} alt="Library" />
              <h3>{roleConfigs[currentRole].title}</h3>
              <p style={{fontSize: '13px', opacity: 0.7, marginTop: '10px'}}>{roleConfigs[currentRole].desc}</p>
            </div>

            <div className="form-side">
              {!showForgotPassword ? (
                <>
                  <div className="role-tabs">
                    {['Student', 'Faculty', 'Librarian'].map(role => (
                      <div key={role} className={`tab ${currentRole === role ? 'active' : ''}`} onClick={() => setCurrentRole(role)}>
                        {role}
                      </div>
                    ))}
                  </div>

                  <h2 style={{marginBottom: '15px'}}>{currentRole} Login</h2>
                  <form onSubmit={handleLoginSubmit}>
                    <input type="text" name="loginID" placeholder="Enter ID (e.g. 101)" required />
                    <input type="text" name="loginName" placeholder="Enter Full Name" required />
                    <input type="password" name="loginPassword" placeholder="Enter Password" required />
                    
                    <div className="forgot-pass" onClick={() => setShowForgotPassword(true)}>Forgot Password?</div>
                    
                    {currentRole === 'Student' && (
                      <select name="loginBranch">
                        <option value="CSE">Computer Science (CSE)</option>
                        <option value="EEE">Electrical (EEE)</option>
                        <option value="ECE">Electronics (ECE)</option>
                        <option value="Mechanical">Mechanical</option>
                        <option value="Civil Services">Civil Services</option>
                      </select>
                    )}

                    <button type="submit" className="login-btn">Secure Login</button>
                  </form>
                </>
              ) : (
                <div style={{textAlign: 'center'}}>
                    <h2 style={{marginBottom: '20px'}}>Reset Access</h2>
                    <input type="email" placeholder="Enter Registered Email" />
                    <input type="password" placeholder="Enter New Password" />
                    <button className="login-btn" style={{marginBottom: '15px'}} onClick={() => setShowForgotPassword(false)}>Update & Login</button>
                    
                    <div style={{margin: '10px 0', fontSize: '12px'}}>OR</div>
                    
                    <button className="google-btn" style={{width: '100%'}} onClick={handleGoogleContinue}>
                        <img src="https://img.icons8.com/color/24/000000/google-logo.png" alt="google" />
                        Continue with Google
                    </button>
                    <p style={{marginTop: '20px', cursor: 'pointer', fontSize: '12px'}} onClick={() => setShowForgotPassword(false)}>← Back to Login</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div style={{display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
          <nav>
            <div style={{fontWeight: 'bold', color: '#00ffff'}}>📚 CENTRAL LIBRARY</div>
            <div className="nav-links">
              <div className={`nav-link ${activeSection === 'catalog' ? 'active' : ''}`} onClick={() => setActiveSection('catalog')}>Catalog</div>
              <div className={`nav-link ${activeSection === 'issued' ? 'active' : ''}`} onClick={() => setActiveSection('issued')}>My Books</div>
              <div className={`nav-link ${activeSection === 'status' ? 'active' : ''}`} onClick={() => setActiveSection('status')}>Account Status</div>
              <div style={{fontSize: '12px', border: '1px solid #00ffff', padding: '4px 10px', borderRadius: '5px', color: '#00ffff'}}>{liveTime}</div>
              <button onClick={() => setIsLoggedIn(false)} style={{background: '#ef4444', border: 'none', color: 'white', padding: '5px 15px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold'}}>Logout</button>
            </div>
          </nav>

          <div className="ticker">
            <div className="ticker-move">
              ⚠️ NOTICE: Library open until 10 PM for exams. | 📚 NEW: "Advanced React" books added to CSE. | 💳 REMINDER: Fines are calculated daily at ₹5/day overdue.
            </div>
          </div>

          <div className="content">
            {activeSection === 'catalog' && (
              <>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <h1>Welcome, {userSession.name}</h1>
                  <div style={{display: 'flex', gap: '15px'}}>
                    <div className="card-stat">
                      <p style={{fontSize: '10px', color: '#94a3b8'}}>TOTAL TITLES</p>
                      <h3>{libraryData.length}</h3>
                    </div>
                    <div className="card-stat">
                      <p style={{fontSize: '10px', color: '#94a3b8'}}>ACCESSIBLE</p>
                      <h3 style={{color: '#00ffff'}}>{filteredBooks.length}</h3>
                    </div>
                  </div>
                </div>

                <input 
                  type="text" 
                  placeholder="Search by title, author or ISBN..." 
                  style={{marginTop: '30px', background: '#1e293b', color: 'white', border: '1px solid #334155'}}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />

                <div className="book-grid">
                  {filteredBooks.map((book, idx) => (
                    <div key={idx} className="book-card">
                      <span className={`status-badge ${(book.total - book.issued) > 0 ? 'bg-avail' : 'bg-out'}`}>
                        {(book.total - book.issued) > 0 ? 'AVAILABLE' : 'OUT OF STOCK'}
                      </span>
                      <h3 style={{marginTop: '10px'}}>{book.title}</h3>
                      <p style={{fontSize: '12px', color: '#94a3b8'}}>By {book.auth} | {book.isbn}</p>
                      <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginTop: '15px', borderTop: '1px solid #334155', paddingTop: '10px'}}>
                        <span>Stock: {book.total - book.issued}</span>
                        <span>Issued: {book.issued}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeSection === 'issued' && (
              <div>
                <h2>Issued Tracking Log</h2>
                <table>
                  <thead>
                    <tr><th>Book Details</th><th>Issued On</th><th>Due Date</th><th>Current Fine</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {userHistory.map((item, idx) => {
                      const fine = calculateFine(item.due);
                      return (
                        <tr key={idx}>
                          <td>{item.title} ({item.isbn})</td>
                          <td>{item.date}</td>
                          <td>{item.due}</td>
                          <td style={{color: fine > 0 ? '#f87171' : '#4ade80'}}>₹{fine}.00</td>
                          <td>
                            <span className={`status-badge ${fine > 0 ? 'bg-out' : 'bg-avail'}`}>
                              {fine > 0 ? 'Overdue' : 'Active'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {activeSection === 'status' && (
              <div>
                <h2>Account Summary</h2>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px'}}>
                  <div className="card-stat" style={{borderColor: totalFineAmount > 0 ? '#ef4444' : '#22c55e'}}>
                    <p>TOTAL OUTSTANDING FINE</p>
                    <h1 style={{color: totalFineAmount > 0 ? '#f87171' : '#4ade80'}}>₹{totalFineAmount}.00</h1>
                  </div>
                  <div className="card-stat">
                    <p>ACTIVE LOANS</p>
                    <h1>{userHistory.length}</h1>
                  </div>
                </div>

                <div style={{marginTop: '30px', display: 'grid', gridTemplateColumns: '1fr', gap: '20px'}}>
                  {totalFineAmount > 0 && (
                    <div style={{background: 'rgba(239, 68, 68, 0.1)', borderLeft: '4px solid #ef4444', padding: '20px', borderRadius: '8px'}}>
                      <h4 style={{color: '#f87171', marginBottom: '10px'}}>⚠️ Fine Settlement Required</h4>
                      <p style={{fontSize: '13px', color: '#cbd5e1'}}>
                        Your fines are increasing by <strong>₹5.00 every 24 hours</strong>. 
                        Please visit the Accounts Desk to clear your dues and avoid borrowing restrictions.
                      </p>
                    </div>
                  )}

                  <div className="card-stat" style={{textAlign: 'left', background: 'linear-gradient(145deg, #1e293b, #0f172a)'}}>
                    <h4 style={{color: '#00ffff', marginBottom: '15px', borderBottom: '1px solid #334155', paddingBottom: '10px'}}>Membership Details</h4>
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px'}}>
                      <div>
                        <p style={{fontSize: '10px', color: '#94a3b8'}}>STUDENT NAME</p>
                        <p style={{fontSize: '14px', textTransform: 'uppercase'}}>{userSession.name}</p>
                      </div>
                      <div>
                        <p style={{fontSize: '10px', color: '#94a3b8'}}>DEPARTMENT/BRANCH</p>
                        <p style={{fontSize: '14px'}}>{userSession.branch}</p>
                      </div>
                      <div>
                        <p style={{fontSize: '10px', color: '#94a3b8'}}>MEMBERSHIP TYPE</p>
                        <p style={{fontSize: '14px'}}>{currentRole} Premium</p>
                      </div>
                      <div>
                        <p style={{fontSize: '10px', color: '#94a3b8'}}>BORROWING LIMIT</p>
                        <p style={{fontSize: '14px'}}>{currentRole === 'Student' ? '5 Books' : '15 Books'}</p>
                      </div>
                      <div>
                        <p style={{fontSize: '10px', color: '#94a3b8'}}>LOAN DURATION</p>
                        <p style={{fontSize: '14px'}}>15 Days</p>
                      </div>
                      <div>
                        <p style={{fontSize: '10px', color: '#94a3b8'}}>ACCOUNT VALIDITY</p>
                        <p style={{fontSize: '14px'}}>Active ({new Date().toLocaleString('default', { month: 'short' })} {new Date().getFullYear()})</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <footer className="librarian-footer">
            <div className="lib-info-block">
              <img className="lib-avatar" src="https://vemu.org/assets/img/library/IMG_9709.jpg" alt="Librarian" />
              <div>
                <p style={{color: '#00ffff', fontWeight: 'bold', fontSize: '14px'}}>Dr. Arvin Sharma</p>
                <p style={{fontSize: '11px', color: '#94a3b8'}}>Chief Librarian (PhD Library Science)</p>
              </div>
            </div>
            <div style={{textAlign: 'center'}}>
              <p style={{fontSize: '12px', color: '#cbd5e1'}}>Office: Second Floor, West Wing</p>
              <p style={{fontSize: '11px', color: '#94a3b8'}}>Contact: arvin.library@college.edu</p>
            </div>
            <div style={{textAlign: 'right'}}>
              <p style={{fontSize: '12px', color: '#cbd5e1'}}>Working Hours</p>
              <p style={{fontSize: '11px', color: '#00ffff'}}>9:10 AM — 4:00 PM</p>
            </div>
          </footer>
        </div>
      )}
    </div>
  );                        
};

export default IntegratedLibraryPortal;