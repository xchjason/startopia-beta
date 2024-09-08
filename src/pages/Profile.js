import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import LogoutButton from "../components/LogoutButton";

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    isAuthenticated && (
      <div>
        <h2>Profile</h2>
        <p>Username: {user.name}</p>
        <p>Email: {user.email}</p>
        <LogoutButton />
      </div>
    )
  );
};

export default Profile;
