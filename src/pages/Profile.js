import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import LogoutButton from "../components/LogoutButton";

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    isAuthenticated && (
      <div className="container mx-auto max-w-2xl mt-20 p-6 bg-black shadow-lg rounded-lg text-white">
        <h2 className="text-2xl font-bold mb-6 text-gray-100 text-center">Profile</h2>
        <div className="mb-6 flex flex-col items-center">
          {user.picture ? (
            <img
              src={user.picture}
              alt="Profile"
              className="w-24 h-24 rounded-full mb-4"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-dark-700 flex items-center justify-center mb-4">
              <span className="text-3xl">{user.email[0].toUpperCase()}</span>
            </div>
          )}
          <p className="text-lg font-semibold text-gray-200">{user.name}</p>
        </div>
        <div className="mt-6 flex justify-center">
          <LogoutButton />
        </div>
      </div>
    )
  );
};

export default Profile;