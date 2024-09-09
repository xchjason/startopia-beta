import React from 'react';
import { styled } from '@mui/material/styles';
import { Card } from '@mui/material';

const StyledCard = styled(Card)(({ theme }) => ({
  bgcolor: 'rgba(30, 41, 59, 0.8)',
  color: 'white',
  borderRadius: theme.shape.borderRadius * 2,
  position: 'relative',
  zIndex: 10,
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  border: '1px solid transparent',
  margin: '1px',
  '&:hover': {
    boxShadow: '0 0 15px rgba(255, 255, 255, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  }
}));

const HoverCard = ({ children, ...props }) => {
  return (
    <div className="group relative mx-auto w-full max-w-sm overflow-hidden rounded-lg transition-all duration-300 hover:scale-[1.01]">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <StyledCard {...props}>
        {children}
      </StyledCard>
    </div>
  );
};

export default HoverCard;