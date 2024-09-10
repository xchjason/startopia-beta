import React from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from '../components/LoginButton';
import LogoutButton from '../components/LogoutButton';
import { Box, Typography, Container } from '@mui/material';
import { useLocation } from 'react-router-dom';

export default function LoginPage() {
  const { isAuthenticated } = useAuth0();
  const location = useLocation();

  const showLoginMessage = location.state && location.state.from;

  return (
    <Container maxWidth="sm">
      <Box sx={{ 
        marginTop: 8, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center' 
      }}>
        {showLoginMessage && !isAuthenticated && (
          <Typography variant="h6" sx={{ mb: 2, color: 'text.secondary' }}>
            Please log in to view the page
          </Typography>
        )}
        <Box sx={{ mt: 2 }}>
          {isAuthenticated ? <LogoutButton /> : <LoginButton />}
        </Box>
      </Box>
    </Container>
  );
}