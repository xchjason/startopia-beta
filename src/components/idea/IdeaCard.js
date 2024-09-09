import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Collapse,
  Box,
  Button
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';

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

const IdeaCard = ({ idea, onSave }) => {
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card sx={{ 
      bgcolor: 'rgba(255, 255, 255, 0.05)', 
      color: 'white',
      borderRadius: 2,
      '&:hover': {
        boxShadow: '0 0 10px rgba(255, 255, 255, 0.2)',
      }
    }}>
      <CardContent>
        <Typography variant="h6" component="div" sx={{ mb: 2 }}>
          {idea.title}
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          {idea.description}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button size="small" onClick={() => onSave(idea)} sx={{ color: 'primary.main' }}>
            Save Idea
          </Button>
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon sx={{ color: 'white' }} />
          </ExpandMore>
        </Box>
      </CardContent>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>Problem:</Typography>
          <Typography paragraph sx={{ pl: 2 }}>
            {idea.problem}
          </Typography>
          <Typography paragraph>Solution:</Typography>
          <Typography paragraph sx={{ pl: 2 }}>
            {idea.solution}
          </Typography>
          <Typography>Category: {idea.category}</Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default IdeaCard;