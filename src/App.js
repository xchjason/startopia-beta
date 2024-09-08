import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Tasks from "./pages/Tasks";
import LoginPage from "./pages/Login";
import Home from "./pages/Home";
import { NavBar } from "./components/navbar/NavBar"; // Import NavBar component

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppRoutes = ({ isAuthenticated }) => (
  <Routes>
    <Route path="/" element={isAuthenticated ? <Tasks /> : <Home />} />
    <Route path="/login" element={<LoginPage />} />
  </Routes>
);

const App = () => {
  const { isAuthenticated, user } = useAuth0();

  return (
    <Router>
      <div className="App">
        {!isAuthenticated && <NavBar currentUser={user} />} {/* Display NavBar on Home page */}
        <AppRoutes isAuthenticated={isAuthenticated} />
      </div>
    </Router>
  );
};

export default App;