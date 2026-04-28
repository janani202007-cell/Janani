import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const authAPI = {
  adminLogin: (userId, password) => api.post("/auth/login", { userId, password }),
  studentLogin: (userId, password) => api.post("/auth/login", { userId, password }),
  facultyLogin: (userId, password) => api.post("/auth/login", { userId, password }),
  librarianLogin: (userId, password) => api.post("/auth/login", { userId, password }),
};

export const booksAPI = {
  getAllBooks: () => api.get("/books"),
  addBook: (bookData) => api.post("/books/add", bookData),
};

export const loansAPI = {
  issueBook: (loanData) => api.post("/loans/issue", loanData),
  returnBook: (returnData) => api.post("/loans/return", returnData),
};

export default api;
