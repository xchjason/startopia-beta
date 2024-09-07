// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Tasks from "./pages/Tasks";

const App = () => {
  return (
    <Router>
      <div className="App">
        <h1>Task Manager</h1>
        <Routes>
          <Route path="/" element={<Tasks />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;