import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useQuery } from "convex/react";
import { api } from "./convex/_generated/api";
import LoginPage from "./pages/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import { NavBar } from "./components/navbar/NavBar";
import Create from "./pages/Create";
import Portfolio from "./pages/Portfolio";
import IdeaPage from "./pages/IdeaPage";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth0();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

const ProtectedIdeaRoute = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth0();
  const location = useLocation();
  const { id } = useParams();

  const idea = useQuery(api.ideas.getIdeaById, { ideaId: id });

  if (isLoading || idea === undefined) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (idea === null) {
    return <Navigate to="/portfolio" replace />;
  }

  if (idea.user_id !== user.sub) {
    return <Navigate to="/portfolio" replace />;
  }

  return children;
};

const AppRoutes = ({ isAuthenticated }) => (
  <Routes>
    <Route
      path="/"
      element={isAuthenticated ? <Navigate to="/portfolio" /> : <Home />}
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
    <Route
      path="/create"
      element={
        <ProtectedRoute>
          <Create />
        </ProtectedRoute>
      }
    />
    <Route
      path="/portfolio"
      element={
        <ProtectedRoute>
          <Portfolio />
        </ProtectedRoute>
      }
    />
    <Route
      path="/idea/:id"
      element={
        <ProtectedIdeaRoute>
          <IdeaPage />
        </ProtectedIdeaRoute>
      }
    />
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