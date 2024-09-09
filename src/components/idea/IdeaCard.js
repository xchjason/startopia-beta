import React, { useState } from 'react';
import {
  CardContent,
  Typography,
  IconButton,
  Collapse,
  Box,
  Button
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import HoverCard from '../card/HoverCard';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const IdeaCard = ({ 
  idea, 
  onSave, 
  showSaveButton = true, 
  showExpandOption = true,
  expanded: controlledExpanded,
  onExpandChange
}) => {
  const [internalExpanded, setInternalExpanded] = useState(false);
  
  const isControlled = controlledExpanded !== undefined;
  const expanded = isControlled ? controlledExpanded : internalExpanded;

  const handleExpandClick = () => {
    if (isControlled) {
      onExpandChange(!expanded);
    } else {
      setInternalExpanded(!internalExpanded);
    }
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  const truncateDescription = (text) => truncateText(text, 180);
  const truncateTitle = (text) => truncateText(text, 55);

  const isDescriptionTruncated = idea.description.length > 180;
  const isTitleTruncated = idea.title.length > 55;

  return (
    <HoverCard sx={{
      height: expanded ? 'auto' : '273px',
      display: 'flex',
      flexDirection: 'column',
    }}>
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
              <Typography variant="h6" component="div" sx={{ mb: 2, color: 'white', cursor: 'pointer' }}>
                {truncateTitle(idea.title)}
              </Typography>
            </Tooltip>
          ) : (
            <Typography variant="h6" component="div" sx={{ mb: 2, color: 'white' }}>
              {idea.title}
            </Typography>
          )}
          {isDescriptionTruncated && !expanded ? (
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
                  cursor: 'pointer',
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
        {(showSaveButton || showExpandOption) && (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mt: 'auto',
            minHeight: '48px' // Set a minimum height to prevent movement
          }}>
            {showSaveButton && (
              <Button 
                size="small" 
                onClick={() => onSave(idea)} 
                sx={{ 
                  color: 'rgb(99 102 241)', 
                  border: '1px solid rgb(99 102 241)',
                  borderRadius: '4px',
                  padding: '4px 10px',
                  transition: 'border-color 0.3s ease',
                  '&:hover': { 
                    borderColor: 'rgb(129 140 248)',
                    backgroundColor: 'transparent',
                  } 
                }}
              >
                Save Idea
              </Button>
            )}
            {showExpandOption && (
              <ExpandMore
                expand={expanded}
                onClick={handleExpandClick}
                aria-expanded={expanded}
                aria-label="show more"
                sx={{ 
                  mt: '-8px', // Adjust the value as needed to position the icon up
                  // ... other styles ...
                }}
              >
                <ExpandMoreIcon sx={{ color: 'white' }} />
              </ExpandMore>
            )}
          </Box>
        )}
      </CardContent>
      {showExpandOption && (
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography paragraph color="white">Problem:</Typography>
            <Typography paragraph sx={{ pl: 2, color: 'rgb(148 163 184)' }}>
              {idea.problem}
            </Typography>
            <Typography paragraph color="white">Solution:</Typography>
            <Typography paragraph sx={{ pl: 2, color: 'rgb(148 163 184)' }}>
              {idea.solution}
            </Typography>
            <Typography paragraph color="white">Category:</Typography>
            <Typography paragraph sx={{ pl: 2, color: 'rgb(148 163 184)' }}>
              {idea.category}
            </Typography>
          </CardContent>
        </Collapse>
      )}
    </HoverCard>
  );
};

export default IdeaCard;