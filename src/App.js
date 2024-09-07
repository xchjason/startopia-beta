// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Tasks from "./pages/Tasks";
import LoginPage from "./pages/Login";

const App = () => {
  return (
    <Router>
      <div className="App">
        <h1>Task Manager</h1>
        <Routes>
          <Route path="/" element={<Tasks />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;