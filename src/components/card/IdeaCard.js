import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Collapse,
  Box,
  Button,
  CircularProgress
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import { Link } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

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

  const evaluation = useQuery(api.ideas.getEvaluation, { ideaId: idea._id });

  const getScoreColor = (score) => {
    if (score < 7) return '#ef4444'; // Red for poor scores
    if (score < 8) return '#f97316'; // Orange for mediocre scores
    return '#22c55e'; // Green for good scores
  };

  return (
    <Link to={`/idea/${idea._id}`} style={{ textDecoration: 'none' }}>
      <div className="group relative mx-auto w-full max-w-sm overflow-hidden rounded-lg transition-all duration-300 hover:scale-[1.01]">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <Card sx={{
        bgcolor: 'rgba(30, 41, 59, 0.8)',
        color: 'white',
        borderRadius: 2,
        position: 'relative',
        zIndex: 10,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        border: '1px solid transparent',
        margin: '1px',
        height: expanded ? 'auto' : '260px', // Fixed height when not expanded
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          boxShadow: '0 0 15px rgba(255, 255, 255, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }
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
              <Typography variant="h6" component="div" sx={{ mb: 2, color: 'white', cursor: 'pointer' }}>
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
                    cursor: 'pointer',
                  }}
                >
                  {expanded ? idea.description : truncateDescription(idea.description)}
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
                  cursor: 'pointer',
                }}
              >
                {idea.description}
              </Typography>
            )}
            {evaluation && (
              <Box sx={{ position: 'relative', display: 'inline-flex', mt: 2 }}>
                <CircularProgress
                  variant="determinate"
                  value={evaluation.overall_score * 10}
                  size={60}
                  thickness={4}
                  sx={{
                    color: getScoreColor(evaluation.overall_score),
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    borderRadius: '50%',
                  }}
                />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{ fontWeight: 'bold', color: 'white', lineHeight: 1 }}
                  >
                    {evaluation.overall_score.toFixed(1)}
                  </Typography>
                </Box>
              </Box>
            )}
          </div>
          {(showSaveButton || showExpandOption) && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
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
      </Card>
    </div>
    </Link>
  );
};

export default IdeaCard;