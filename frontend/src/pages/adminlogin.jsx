import React, { useState, useEffect } from 'react';

const CentralLibraryAdmin = () => {
  // --- SYSTEM STATES ---
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState('loginPage'); 
  const [activeTab, setActiveTab] = useState('tab-reports');
  const [searchTerm, setSearchTerm] = useState('');

  // --- DATA STATES (Initialized from LocalStorage or Defaults) ---
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('lib_users');
    return saved ? JSON.parse(saved) : [
      { id: "U101", name: "Rahul Sharma", role: "Student", branch: "CSE" },
      { id: "U102", name: "Ananya Rao", role: "Librarian", branch: "Staff" },
      { id: "U103", name: "Dr. Smith", role: "Faculty", branch: "EEE" }
    ];
  });

  const [books, setBooks] = useState(() => {
    const saved = localStorage.getItem('lib_books');
    return saved ? JSON.parse(saved) : [
      { id: "B001", title: "Engineering Mathematics", dept: "CSE", status: "Available" },
      { id: "B002", title: "Digital Logic Design", dept: "ECE", status: "Available" },
      { id: "B003", title: "Thermodynamics", dept: "Mechanical", status: "Issued" }
    ];
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('lib_trans');
    return saved ? JSON.parse(saved) : [
      { id: 'T1', type: 'Issue', item: 'Thermodynamics', user: 'Rahul Sharma', date: new Date().toLocaleDateString() }
    ];
  });

  const [logs, setLogs] = useState([{ msg: "System Boot Sequence Complete.", time: new Date().toLocaleTimeString() }]);

  // --- PERSISTENCE EFFECT ---
  useEffect(() => {
    localStorage.setItem('lib_users', JSON.stringify(users));
    localStorage.setItem('lib_books', JSON.stringify(books));
    localStorage.setItem('lib_trans', JSON.stringify(transactions));
  }, [users, books, transactions]);

  // --- AUTH LOGIC ---
  const handleAdminLogin = () => {
    const id = document.getElementById('adminUser').value;
    const pass = document.getElementById('adminPass').value;
    if (id === "admin123" && pass === "admin@123") {
      setIsAdminLoggedIn(true);
      setCurrentView('dashboard');
      addLog("Admin Authentication Success");
    } else {
      alert("Invalid Admin Credentials!");
    }
  };

  const handleGoogleLogin = () => {
    addLog("Google Auth Redirecting...");
    setTimeout(() => { setIsAdminLoggedIn(true); setCurrentView('dashboard'); }, 1000);
  };

  const addLog = (msg) => {
    setLogs(prev => [{ msg, time: new Date().toLocaleTimeString() }, ...prev].slice(0, 50));
  };

  // --- USER MGMT (Add/Update/Delete) ---
  const handleUserAction = () => {
    const id = document.getElementById('newUserId').value;
    const name = document.getElementById('newUserName').value;
    const role = document.getElementById('newUserRole').value;
    const branch = document.getElementById('newUserBranch').value;

    if (!id || !name) return alert("Fill all fields");

    const existingIndex = users.findIndex(u => u.id === id);
    if (existingIndex > -1) {
      // UPDATE
      const updatedUsers = [...users];
      updatedUsers[existingIndex] = { id, name, role, branch };
      setUsers(updatedUsers);
      addLog(`Updated User: ${name}`);
    } else {
      // ADD
      setUsers([...users, { id, name, role, branch }]);
      addLog(`Registered New User: ${name}`);
    }
    document.getElementById('newUserId').value = '';
    document.getElementById('newUserName').value = '';
  };

  const deleteUser = (id) => {
    if(window.confirm("Delete this user?")) {
      setUsers(users.filter(u => u.id !== id));
      addLog(`Deleted User ID: ${id}`);
    }
  };

  // --- BOOK MGMT (Add/Update/Delete) ---
  const handleBookAction = () => {
    const id = document.getElementById('newBookId').value;
    const title = document.getElementById('newBookTitle').value;
    const dept = document.getElementById('newBookDept').value;

    if (!id || !title) return alert("Fill all fields");

    const existingIndex = books.findIndex(b => b.id === id);
    if (existingIndex > -1) {
      const updatedBooks = [...books];
      updatedBooks[existingIndex] = { ...updatedBooks[existingIndex], title, dept };
      setBooks(updatedBooks);
      addLog(`Updated Book: ${title}`);
    } else {
      setBooks([...books, { id, title, dept, status: "Available" }]);
      addLog(`Added to Catalog: ${title}`);
    }
  };

  const toggleBookStatus = (id) => {
    setBooks(books.map(b => {
      if (b.id === id) {
        const newStatus = b.status === 'Available' ? 'Issued' : 'Available';
        if (newStatus === 'Issued') {
            setTransactions([{id: 'T'+Date.now(), type: 'Issue', item: b.title, user: 'Admin Walk-in', date: new Date().toLocaleDateString()}, ...transactions]);
        }
        return { ...b, status: newStatus };
      }
      return b;
    }));
  };

  // --- DATABASE HELPERS ---
  const handleBackup = () => {
    const data = JSON.stringify({ users, books, transactions });
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lib_backup_${new Date().getTime()}.json`;
    link.click();
    addLog("System Backup Exported");
  };

  // --- ANALYTICS ---
  const stats = {
    students: users.filter(u => u.role === "Student").length,
    faculty: users.filter(u => u.role === "Faculty").length,
    cse: users.filter(u => u.branch === "CSE" && u.role === "Student").length,
    ece: users.filter(u => u.branch === "ECE" && u.role === "Student").length,
    issued: books.filter(b => b.status === "Issued").length
  };

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600&display=swap');
    :root { --neon: #00f2ff; --danger: #ff4d4d; --success: #2ecc71; --warning: #f1c40f; --glass: rgba(15, 23, 42, 0.9); --bg-dash: #0b0f19; }
    .lib-app { background-color: var(--bg-dash); color: #fff; min-height: 100vh; font-family: 'Outfit', sans-serif; }
    .auth-mode { background: radial-gradient(circle at center, #1e293b 0%, #0b0f19 100%); display: flex; align-items: center; justify-content: center; }
    .glass-card { background: var(--glass); border: 1px solid rgba(0, 242, 255, 0.1); padding: 40px; border-radius: 20px; width: 100%; max-width: 400px; box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
    nav { background: #111827; padding: 0 40px; height: 70px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #1f2937; position: sticky; top:0; z-index: 100; }
    .nav-links { display: flex; gap: 20px; }
    .nav-links a { color: #94a3b8; cursor: pointer; font-size: 14px; font-weight: 500; transition: 0.3s; padding: 10px; border-radius: 8px; }
    .nav-links a.active { color: var(--neon); background: rgba(0, 242, 255, 0.1); }
    .container { padding: 30px; max-width: 1400px; margin: auto; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
    .stat-card { background: #1e293b; padding: 25px; border-radius: 16px; position: relative; overflow: hidden; border: 1px solid #334155; }
    .stat-card::after { content: ''; position: absolute; bottom: 0; left: 0; width: 100%; height: 4px; background: var(--neon); opacity: 0.5; }
    .card { background: #111827; padding: 24px; border-radius: 16px; border: 1px solid #1f2937; }
    .search-bar { background: #1e293b; border: 1px solid #334155; padding: 10px 15px; border-radius: 8px; color: white; width: 300px; margin-bottom: 20px; }
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; padding: 15px; color: #64748b; font-size: 12px; text-transform: uppercase; border-bottom: 1px solid #1f2937; }
    td { padding: 15px; border-bottom: 1px solid #1f2937; font-size: 14px;color:black }
    .btn-action { padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 12px; border: none; font-weight: 600; }
    .badge { padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 700; }
  `;

  return (
    <div className={`lib-app ${!isAdminLoggedIn ? 'auth-mode' : ''}`}>
      <style>{styles}</style>

      {/* --- AUTHENTICATION --- */}
      {!isAdminLoggedIn && (
        <div className="glass-card">
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h2 style={{ color: 'var(--neon)', margin: 0 }}>LIB-OS ADMIN</h2>
            <p style={{ color: '#64748b', fontSize: '14px' }}>Central Library Control Management</p>
          </div>
          
          {currentView === 'loginPage' ? (
            <>
              <div className="input-box" style={{marginBottom:'15px'}}>
                <label style={{fontSize: '11px', color: '#64748b'}}>ADMIN IDENTIFIER</label>
                <input type="text" id="adminUser" placeholder="admin123" style={{width:'92%', padding:'12px', borderRadius:'8px', border:'1px solid #334155', background:'#0b0f19', color:'white'}} />
              </div>
              <div className="input-box" style={{marginBottom:'20px'}}>
                <label style={{fontSize: '11px', color: '#64748b'}}>ACCESS KEY</label>
                <input type="password" id="adminPass" placeholder="••••••••" style={{width:'92%', padding:'12px', borderRadius:'8px', border:'1px solid #334155', background:'#0b0f19', color:'white'}} />
              </div>
              <button className="btn-neon" style={{background:'var(--neon)', color:'#000', width:'100%', padding:'12px', borderRadius:'8px', fontWeight:'600', cursor:'pointer'}} onClick={handleAdminLogin}>AUTHENTICATE</button>
              <button className="btn-google" style={{width:'100%', marginTop:'10px', padding:'10px', borderRadius:'8px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'10px'}} onClick={handleGoogleLogin}>
                <img src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png" width="18" alt="G" /> Sign in with Google
              </button>
              <p onClick={() => setCurrentView('forgotPage')} style={{textAlign:'center', fontSize:'12px', marginTop:'20px', cursor:'pointer', color:'#64748b'}}>Recovery Options</p>
            </>
          ) : (
            <div style={{textAlign:'center'}}>
              <h3>Account Recovery</h3>
              <p style={{color:'#64748b', fontSize:'13px'}}>A secure link will be sent to the registered administrator email address.</p>
              <input type="email" placeholder="admin@university.edu" style={{width:'92%', padding:'12px', borderRadius:'8px', border:'1px solid #334155', background:'#0b0f19', color:'white', marginBottom:'15px'}} />
              <button className="btn-neon" style={{background:'var(--neon)', color:'#000', width:'100%', padding:'12px', borderRadius:'8px'}} onClick={() => {alert("Reset link dispatched."); setCurrentView('loginPage')}}>SEND LINK</button>
              <p onClick={() => setCurrentView('loginPage')} style={{marginTop:'15px', cursor:'pointer', color: 'var(--neon)'}}>Return to Login</p>
            </div>
          )}
        </div>
      )}

      {/* --- DASHBOARD --- */}
      {isAdminLoggedIn && (
        <>
          <nav>
            <div style={{ display:'flex', alignItems:'center', gap:'10px'}}>
              <div style={{width:'30px', height:'30px', background:'var(--neon)', borderRadius:'6px'}}></div>
              <span style={{ fontWeight: 700, letterSpacing:'1px' }}>CORE-LIBRARY <span style={{color:'var(--neon)'}}>v2.0</span></span>
            </div>
            <div className="nav-links">
              <a onClick={() => setActiveTab('tab-reports')} className={activeTab === 'tab-reports' ? 'active' : ''}>Overview</a>
              <a onClick={() => setActiveTab('tab-users')} className={activeTab === 'tab-users' ? 'active' : ''}>Members</a>
              <a onClick={() => setActiveTab('tab-books')} className={activeTab === 'tab-books' ? 'active' : ''}>Catalog</a>
              <a onClick={() => setActiveTab('tab-database')} className={activeTab === 'tab-database' ? 'active' : ''}>System</a>
              <a onClick={() => window.location.reload()} style={{ color: 'var(--danger)' }}>Logout</a>
            </div>
          </nav>

          <div className="container">
            {activeTab === 'tab-reports' && (
              <>
                <div className="stats-grid">
                  <div className="stat-card"><p style={{fontSize:'12px', color:'#94a3b8', margin:0}}>Total Books</p><h2 style={{margin:'10px 0'}}>{books.length}</h2><span className="badge" style={{background:'rgba(46, 204, 113, 0.2)', color:'var(--success)'}}>+2 New today</span></div>
                  <div className="stat-card"><p style={{fontSize:'12px', color:'#94a3b8', margin:0}}>Active Users</p><h2 style={{margin:'10px 0'}}>{users.length}</h2><span className="badge" style={{background:'rgba(0, 242, 255, 0.1)', color:'var(--neon)'}}>Verified</span></div>
                  <div className="stat-card"><p style={{fontSize:'12px', color:'#94a3b8', margin:0}}>Total Faculty</p><h2 style={{margin:'10px 0'}}>{stats.faculty}</h2></div>
                  <div className="stat-card"><p style={{fontSize:'12px', color:'#94a3b8', margin:0}}>Current Issues</p><h2 style={{margin:'10px 0', color:'var(--warning)'}}>{stats.issued}</h2><span className="badge" style={{background:'rgba(241, 196, 15, 0.2)', color:'var(--warning)'}}>Daily Update</span></div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '25px' }}>
                  <div className="card">
                    <h4 style={{marginTop:0}}>Transactions Report</h4>
                    <table>
                      <thead><tr><th>Action</th><th>Item</th><th>User</th><th>Date</th></tr></thead>
                      <tbody>
                        {transactions.map(t => (
                          <tr key={t.id}>
                            <td><span className="badge" style={{background: t.type === 'Issue' ? '#3b2f11' : '#113b24', color: t.type === 'Issue' ? 'var(--warning)' : 'var(--success)'}}>{t.type}</span></td>
                            <td>{t.item}</td><td>{t.user}</td><td>{t.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="card">
                    <h4 style={{marginTop:0}}>Demographics (Students)</h4>
                    <div style={{display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid #1f2937'}}><span>CSE Branch</span><span style={{color:'var(--neon)'}}>{stats.cse}</span></div>
                    <div style={{display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid #1f2937'}}><span>ECE Branch</span><span style={{color:'var(--neon)'}}>{stats.ece}</span></div>
                    <div style={{display:'flex', justifyContent:'space-between', padding:'10px 0'}}><span>Others</span><span style={{color:'var(--neon)'}}>{stats.students - (stats.cse + stats.ece)}</span></div>
                    
                    <h4 style={{marginTop:'30px'}}>Live System Logs</h4>
                    <div style={{fontSize:'11px', background:'#0b0f19', padding:'15px', borderRadius:'10px', height:'120px', overflowY:'auto', border:'1px solid #1f2937'}}>
                      {logs.map((l, i) => <div key={i} style={{marginBottom:'5px'}}><span style={{color:'var(--neon)'}}>[{l.time}]</span> {l.msg}</div>)}
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'tab-users' && (
              <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '25px' }}>
                <div className="card">
                  <h4>Member Management</h4>
                  <p style={{fontSize:'12px', color:'#64748b'}}>Register or Update member details. Unique ID is required.</p>
                  <input type="text" id="newUserId" placeholder="User ID (e.g. U500)" className="search-bar" style={{width:'90%'}} />
                  <input type="text" id="newUserName" placeholder="Full Name" className="search-bar" style={{width:'90%'}} />
                  <select id="newUserRole" className="search-bar" style={{width:'100%'}}>
                    <option>Student</option><option>Faculty</option><option>Librarian</option>
                  </select>
                  <select id="newUserBranch" className="search-bar" style={{width:'100%'}}>
                    <option>CSE</option><option>ECE</option><option>EEE</option><option>MECH</option><option>CIVIL</option><option>Staff</option>
                  </select>
                  <button className="btn-neon" style={{background:'var(--neon)', width:'100%', padding:'12px', borderRadius:'8px', color:'#000', fontWeight:'600'}} onClick={handleUserAction}>COMMIT USER DATA</button>
                </div>
                <div className="card">
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <h4>Member Directory</h4>
                    <input type="text" placeholder="Search members..." className="search-bar" onChange={(e) => setSearchTerm(e.target.value)} />
                  </div>
                  <table>
                    <thead><tr><th>ID</th><th>Name</th><th>Role</th><th>Branch</th><th>Actions</th></tr></thead>
                    <tbody>
                      {users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase())).map(u => (
                        <tr key={u.id}>
                          <td>{u.id}</td><td>{u.name}</td><td>{u.role}</td><td>{u.branch}</td>
                          <td>
                            <button onClick={() => {
                              document.getElementById('newUserId').value = u.id;
                              document.getElementById('newUserName').value = u.name;
                            }} style={{color:'var(--neon)', background:'none', border:'none', cursor:'pointer', marginRight:'10px'}}>Edit</button>
                            <button onClick={() => deleteUser(u.id)} style={{color:'var(--danger)', background:'none', border:'none', cursor:'pointer'}}>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'tab-books' && (
              <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '25px' }}>
                <div className="card">
                  <h4>Catalog Manager</h4>
                  <input type="text" id="newBookId" placeholder="ISBN Number" className="search-bar" style={{width:'90%'}} />
                  <input type="text" id="newBookTitle" placeholder="Book Title" className="search-bar" style={{width:'90%'}} />
                  <select id="newBookDept" className="search-bar" style={{width:'100%'}}>
                    <option>CSE</option><option>ECE</option><option>EEE</option><option>Mechanical</option><option>Civil</option>
                  </select>
                  <button className="btn-neon" style={{background:'var(--neon)', width:'100%', padding:'12px', borderRadius:'8px', color:'#000', fontWeight:'600'}} onClick={handleBookAction}>SAVE TO CATALOG</button>
                </div>
                <div className="card">
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <h4>Inventory Directory</h4>
                    <input type="text" placeholder="Search books..." className="search-bar" onChange={(e) => setSearchTerm(e.target.value)} />
                  </div>
                  <table>
                    <thead><tr><th>ISBN</th><th>Title</th><th>Dept</th><th>Status</th><th>Toggle Status</th></tr></thead>
                    <tbody>
                      {books.filter(b => b.title.toLowerCase().includes(searchTerm.toLowerCase())).map(b => (
                        <tr key={b.id}>
                          <td>{b.id}</td><td>{b.title}</td><td>{b.dept}</td>
                          <td><span style={{color: b.status === 'Available' ? 'var(--success)' : 'var(--warning)'}}>{b.status}</span></td>
                          <td>
                            <button className="btn-action" style={{background:'#1f2937', color:'white'}} onClick={() => toggleBookStatus(b.id)}>
                              {b.status === 'Available' ? 'Issue Book' : 'Return Book'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'tab-database' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
                <div className="card" style={{textAlign:'center', padding:'50px'}}>
                  <div style={{fontSize:'40px', marginBottom:'20px'}}>📦</div>
                  <h4>Cloud Backup</h4>
                  <p style={{color:'#64748b'}}>Download a localized JSON instance of the entire library state.</p>
                  <button className="btn-neon" style={{background:'var(--neon)', padding:'12px 30px', borderRadius:'8px'}} onClick={handleBackup}>GENERATE SNAPSHOT</button>
                </div>
                <div className="card" style={{textAlign:'center', padding:'50px'}}>
                  <div style={{fontSize:'40px', marginBottom:'20px'}}>🛡️</div>
                  <h4>System Integrity</h4>
                  <p style={{color:'#64748b'}}>Wipe current session data and restore from a previous backup file.</p>
                  <button className="btn-neon" style={{background:'var(--danger)', padding:'12px 30px', borderRadius:'8px', color:'white'}} onClick={() => { localStorage.clear(); window.location.reload(); }}>HARD RESET SYSTEM</button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CentralLibraryAdmin;