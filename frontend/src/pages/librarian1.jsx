import React, { useState, useEffect } from 'react';
import axios from "axios";
const LibrarianSystem = () => {
  // --- CONSTANTS ---
  const DAILY_FINE_RATE = 2.50;

  // --- STATE MANAGEMENT ---
  const [activePage, setActivePage] = useState('inventory-page');
  const [libraryData, setLibraryData] = useState([
    { id: 101, title: "Systematic Theology", author: "Wayne Grudem", edition: "2nd", subject: "Theology", status: "Available" },
    { id: 102, title: "Greek Grammar", author: "William Mounce", edition: "4th", subject: "Theology", status: "Issued" },
    { id: 103, title: "Basic Counseling Skills", author: "Richard Nelson", edition: "1st", subject: "Counseling", status: "Available" },
    { id: 104, title: "Global History", author: "Stearns", edition: "6th", subject: "History", status: "Available" }
  ]);

  const [activeLoans, setActiveLoans] = useState(() => {
    let overdueDate = new Date();
    overdueDate.setDate(overdueDate.getDate() - 4);
    return [{ loanId: 501, uId: "STU-882", bId: 102, bTitle: "Greek Grammar", dueDate: overdueDate }];
  });

  const [transactionHistory, setTransactionHistory] = useState([
    { uId: "FAC-012", title: "Church History", date: "2024-03-10", fine: "0.00" },
    { uId: "STU-115", title: "Human Anatomy", date: "2024-03-12", fine: "5.00" }
  ]);

  const [totalCollectedFines, setTotalCollectedFines] = useState(5.00);
  const [editTargetId, setEditTargetId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Form States
  const [form, setForm] = useState({ title: "", author: "", edition: "", subject: "" });
  const [issueForm, setIssueForm] = useState({ uId: "", role: "student", bId: "" });

  // --- LOGIC FUNCTIONS ---

  const calculateFine = (due) => {
    const now = new Date();
    const dueDate = new Date(due);
    if (now > dueDate) {
      const diffTime = Math.abs(now - dueDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return (diffDays * DAILY_FINE_RATE).toFixed(2);
    }
    return "0.00";
  };

  const inventoryAction = () => {
    const { title, author, edition, subject } = form;
    if (!title || !author || !subject) return alert("Please fill all required fields.");

    if (editTargetId) {
      setLibraryData(libraryData.map(b => b.id === editTargetId ? { ...b, title, author, edition, subject } : b));
      setEditTargetId(null);
    } else {
      setLibraryData([...libraryData, { id: Date.now(), title, author, edition, subject, status: "Available" }]);
    }
    setForm({ title: "", author: "", edition: "", subject: "" });
  };

  const editBook = (id) => {
    const b = libraryData.find(x => x.id === id);
    setForm({ title: b.title, author: b.author, edition: b.edition, subject: b.subject });
    setEditTargetId(id);
    setActivePage('inventory-page');
  };

  const deleteBook = (id) => {
    if (window.confirm("Are you sure you want to remove this book from the library records?")) {
      setLibraryData(libraryData.filter(b => b.id !== id));
    }
  };

const issueProcess = async () => {
  const { uId, role, bId } = issueForm;

  const book = libraryData.find(b => b.id === parseInt(bId));

  await fetch("http://localhost:5000/api/loans/issue", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      userId: uId,
      role,
      bookId: bId,
      bookTitle: book.title
    })
  });

  alert("Book Issued");
};

  const returnProcess = (loanId) => {
    const loan = activeLoans.find(l => l.loanId === loanId);
    const fine = parseFloat(calculateFine(loan.dueDate));

    if (fine > 0) {
      alert("LATE RETURN: A fine of $" + fine.toFixed(2) + " has been recorded.");
      setTotalCollectedFines(prev => prev + fine);
    }

    setLibraryData(libraryData.map(b => b.id === loan.bId ? { ...b, status: "Available" } : b));
    setTransactionHistory([{ uId: loan.uId, title: loan.bTitle, date: new Date().toLocaleDateString(), fine: fine.toFixed(2) }, ...transactionHistory]);
    setActiveLoans(activeLoans.filter(l => l.loanId !== loanId));
  };

  const filteredBooks = libraryData.filter(b => 
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.author.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f4f7f9', overflow: 'hidden', fontFamily: 'Segoe UI, sans-serif' }}>
      <style>{`
        :root { --lbc-red: #c41230; --lbc-blue: #1a73e8; --dark-gray: #202124; --light-bg: #f4f7f9; --success: #1e8e3e; --danger: #d93025; }
        nav { width: 280px; background: var(--dark-gray); color: white; display: flex; flex-direction: column; box-shadow: 2px 0 12px rgba(0,0,0,0.2); z-index: 10; }
        .nav-header { padding: 30px 20px; border-bottom: 1px solid #3c4043; text-align: center; }
        .nav-link { padding: 18px 25px; cursor: pointer; display: flex; align-items: center; gap: 15px; transition: 0.3s; color: #bdc1c6; text-decoration: none; border-left: 5px solid transparent; }
        .nav-link:hover { background: #3c4043; color: white; }
        .nav-link.active { background: #3c4043; color: white; border-left-color: var(--lbc-blue); font-weight: bold; }
        .logout-btn { padding: 18px 25px; background: #3c4043; color: white; text-decoration: none; border-left: 5px solid transparent; cursor: pointer; margin-top: auto;}
        main { flex: 1; overflow-y: auto; padding: 40px; }
        .card { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border-top: 5px solid var(--lbc-blue); margin-bottom: 30px; }
        .form-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 25px; }
        input, select { padding: 12px; border: 1px solid #dadce0; border-radius: 4px; font-size: 14px; }
        .btn { padding: 12px 25px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; transition: 0.2s; text-transform: uppercase; }
        .btn-blue { background: var(--lbc-blue); color: white; }
        .btn-green { background: var(--success); color: white; }
        .btn-red { background: var(--danger); color: white; padding: 8px 15px; font-size: 11px; }
        table { width: 100%; border-collapse: collapse; background: white; margin-top: 10px; }
        th { text-align: left; background: #f8f9fa; padding: 15px; color: #5f6368; font-size: 12px; border-bottom: 2px solid #eee; }
        td { padding: 15px; border-bottom: 1px solid #eee; font-size: 14px; }
        .badge { padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: bold; }
        .badge-avail { background: #e6ffed; color: #1e7e34; }
        .badge-out { background: #fff8e1; color: #b05a00; }
        .fine-text { color: var(--danger); font-weight: bold; animation: blink 1.5s infinite; }
        @keyframes blink { 50% { opacity: 0.5; } }
      `}</style>

      {/* --- SIDEBAR --- */}
      <nav>
        <div className="nav-header">
          <h2 style={{ fontSize: '30px', color: '#c41230' }}>WELCOME TO</h2>
          <p style={{ fontSize: '25px', color: '#888', margin: '5px 0' }}>central library</p>
        </div>
        <div style={{ flex: 1, paddingTop: '20px' }}>
          <div className={`nav-link ${activePage === 'inventory-page' ? 'active' : ''}`} onClick={() => setActivePage('inventory-page')}>📦 Inventory Management</div>
          <div className={`nav-link ${activePage === 'circulation-page' ? 'active' : ''}`} onClick={() => setActivePage('circulation-page')}>🔄 Circulation Desk</div>
          <div className={`nav-link ${activePage === 'reports-page' ? 'active' : ''}`} onClick={() => setActivePage('reports-page')}>📊 Activity Reports</div>
          <a href="librarian.js" className="logout-btn">LOGOUT</a>
        </div>
      </nav>

      <main>
        {/* --- INVENTORY PAGE --- */}
        {activePage === 'inventory-page' && (
          <div className="webpage active">
            <h1>Inventory Management</h1>
            <div className="card">
              <h3 style={{ color: '#c41230' }}>Add or Update Library Books</h3>
              <div className="form-row">
                <input type="text" placeholder="Book Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                <input type="text" placeholder="Author Name" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
                <input type="text" placeholder="Edition (e.g., 3rd)" value={form.edition} onChange={(e) => setForm({ ...form, edition: e.target.value })} />
                <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}>
                  <option value="">Select Subject</option>
                  <option>Theology</option><option>Counseling</option><option>History</option><option>Science</option><option>Arts</option>
                </select>
              </div>
              <button className="btn btn-blue" onClick={inventoryAction}>{editTargetId ? "Update Book Details" : "Add New Book to Library"}</button>
            </div>

            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ color: '#c41230' }}>Check Book Availability & Records</h3>
                <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ width: '350px' }} />
              </div>
              <table>
                <thead>
                  <tr><th>Book Details</th><th>Subject</th><th>Status</th><th>Manage</th></tr>
                </thead>
                <tbody>
                  {filteredBooks.map(b => (
                    <tr key={b.id}>
                      <td><strong>{b.title}</strong><br /><small>By {b.author} ({b.edition} Ed.)</small></td>
                      <td>{b.subject}</td>
                      <td><span className={`badge ${b.status === 'Available' ? 'badge-avail' : 'badge-out'}`}>{b.status}</span></td>
                      <td>
                        <button className="btn btn-blue" style={{ padding: '5px 10px', fontSize: '10px', marginRight: '5px' }} onClick={() => editBook(b.id)}>Update</button>
                        <button className="btn btn-red" onClick={() => deleteBook(b.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- CIRCULATION PAGE --- */}
        {activePage === 'circulation-page' && (
          <div className="webpage active">
            <h1>Circulation Desk</h1>
            <div className="card" style={{ borderTopColor: '#1e8e3e' }}>
              <h3 style={{ color: '#c41230' }}>Issue Book to Student or Faculty</h3>
              <div className="form-row">
                <input type="text" placeholder="Borrower ID" value={issueForm.uId} onChange={(e) => setIssueForm({ ...issueForm, uId: e.target.value })} />
                <select value={issueForm.role} onChange={(e) => setIssueForm({ ...issueForm, role: e.target.value })}>
                  <option value="student">Student (14-Day Loan)</option>
                  <option value="faculty">Faculty (90-Day Loan)</option>
                </select>
                <select value={issueForm.bId} onChange={(e) => setIssueForm({ ...issueForm, bId: e.target.value })}>
                  <option value="">-- Select Available Book --</option>
                  {libraryData.filter(b => b.status === "Available").map(b => (
                    <option key={b.id} value={b.id}>{b.title}</option>
                  ))}
                </select>
              </div>
              <button className="btn btn-green" onClick={issueProcess}>Issue Book</button>
            </div>

            <div className="card">
              <h3 style={{ color: '#c41230' }}>Active Loans & Automatic Fine Calculation</h3>
              <table>
                <thead>
                  <tr><th>Borrower ID</th><th>Book Title</th><th>Due Date</th><th>Running Fine</th><th>Return Action</th></tr>
                </thead>
                <tbody>
                  {activeLoans.map(l => {
                    const fine = calculateFine(l.dueDate);
                    return (
                      <tr key={l.loanId}>
                        <td>{l.uId}</td><td>{l.bTitle}</td><td>{new Date(l.dueDate).toDateString()}</td>
                        <td className={parseFloat(fine) > 0 ? 'fine-text' : ''}>${fine}</td>
                        <td><button className="btn btn-green" style={{ padding: '5px 10px', fontSize: '10px' }} onClick={() => returnProcess(l.loanId)}>Accept Return</button></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- REPORTS PAGE --- */}
        {activePage === 'reports-page' && (
          <div className="webpage active">
            <h1>Administrative Activity Reports</h1>
            <div className="form-row">
              <div className="card" style={{ textAlign: 'center', borderTopColor: '#202124' }}>
                <h2>{libraryData.length}</h2><p>TOTAL BOOKS</p>
              </div>
              <div className="card" style={{ textAlign: 'center', borderTopColor: '#c41230' }}>
                <h2>{activeLoans.length}</h2><p>CIRCULATING</p>
              </div>
              <div className="card" style={{ textAlign: 'center', borderTopColor: '#1e8e3e' }}>
                <h2>${totalCollectedFines.toFixed(2)}</h2><p>FINES COLLECTED</p>
              </div>
            </div>
            <div className="card">
              <h3 style={{ color: '#c41230' }}>Historical Issue/Return Log</h3>
              <table>
                <thead>
                  <tr><th>User ID</th><th>Book Title</th><th>Return Date</th><th>Fine Paid</th></tr>
                </thead>
                <tbody>
                  {transactionHistory.map((h, i) => (
                    <tr key={i}><td>{h.uId}</td><td>{h.title}</td><td>{h.date}</td><td>${h.fine}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default LibrarianSystem;