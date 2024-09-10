import React from 'react';
import {
  Card,
  CardContent,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import { Link } from 'react-router-dom';

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: 'rgba(30, 41, 59, 0.8)',
  color: 'white',
  borderRadius: theme.shape.borderRadius,
  position: 'relative',
  zIndex: 10,
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  border: '1px solid transparent',
  margin: '1px',
  height: '240px',
  display: 'flex',
  flexDirection: 'column',
  cursor: 'pointer',
  '&:hover': {
    boxShadow: '0 0 15px rgba(255, 255, 255, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    transform: 'scale(1.01)',
  }
}));

const IdeaCard = ({ idea }) => {
  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  const truncateDescription = (text) => truncateText(text, 180);
  const truncateTitle = (text) => truncateText(text, 55);

  const isDescriptionTruncated = idea.description.length > 180;
  const isTitleTruncated = idea.title.length > 55;

  return (
    <Link to={`/idea/${idea._id}`} style={{ textDecoration: 'none' }}>
      <StyledCard>
        <CardContent sx={{ 
          p: 4, 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            {isTitleTruncated ? (
              <Tooltip title={idea.title} arrow placement="top">
                <Typography variant="h6" component="div" sx={{ mb: 2, color: 'white' }}>
                  {truncateTitle(idea.title)}
                </Typography>
              </Tooltip>
            ) : (
              <Typography variant="h6" component="div" sx={{ mb: 2, color: 'white' }}>
                {idea.title}
              </Typography>
            )}
            {isDescriptionTruncated ? (
              <Tooltip title={idea.description} arrow placement="top">
                <Typography 
                  variant="body2" 
                  sx={{ 
                    mb: 2, 
                    color: 'rgb(148 163 184)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {truncateDescription(idea.description)}
                </Typography>
              </Tooltip>
            ) : (
              <Typography 
                variant="body2" 
                sx={{ 
                  mb: 2, 
                  color: 'rgb(148 163 184)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 4,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {idea.description}
              </Typography>
            )}
          </div>
        </CardContent>
      </StyledCard>
    </Link>
  );
};

export default IdeaCard;