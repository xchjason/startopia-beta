import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import LoginPage from "./pages/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile"; // Import Profile component
import { NavBar } from "./components/navbar/NavBar"; // Import NavBar component
import Create from "./pages/Create"; // Import Create component
import Judge from "./pages/Judge"; // Import Judge component
import Browse from "./pages/Browse"; // Import Browse component

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppRoutes = ({ isAuthenticated }) => (
  <Routes>
    <Route
      path="/"
      element={isAuthenticated ? <Navigate to="/profile" /> : <Home />}
    />
    <Route path="/login" element={<LoginPage />} />
    <Route
      path="/profile"
      element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      }
    />
    {/* Add new routes for Create, Judge, and Browse */}
    <Route path="/create" element={<Create />} />
    <Route path="/judge" element={<Judge />} />
    <Route path="/browse" element={<Browse />} />
  </Routes>
);

const App = () => {
  const { isAuthenticated, user } = useAuth0();

  return (
    <Router>
      <div className="App">
        <NavBar currentUser={user} /> {/* Always display NavBar */}
        <AppRoutes isAuthenticated={isAuthenticated} />
      </div>
    </Router>
  );
};

export default App;