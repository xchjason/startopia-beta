import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import LoginPage from "./pages/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import { NavBar } from "./components/navbar/NavBar";
import Create from "./pages/Create";
import Portfolio from "./pages/Portfolio";
import IdeaPage from "./pages/IdeaPage"; // Import the new IdeaPage component

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
    <Route path="/create" element={<Create />} />
    <Route path="/portfolio" element={<Portfolio />} />
    <Route path="/idea/:id" element={<IdeaPage />} /> {/* Add new route for IdeaPage */}
  </Routes>
);

const App = () => {
  const { isAuthenticated, user } = useAuth0();

  return (
    <Router>
      <div className="App">
        <NavBar currentUser={user} />
        <AppRoutes isAuthenticated={isAuthenticated} />
      </div>
    </Router>
  );
};

export default App;