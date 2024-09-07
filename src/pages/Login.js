import React from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from '../components/LoginButton';
import LogoutButton from '../components/LogoutButton';

export default function LoginPage() {
  const { isAuthenticated } = useAuth0();

  return (
    <div>
      {isAuthenticated ? <LogoutButton /> : <LoginButton />}
    </div>
  );
}