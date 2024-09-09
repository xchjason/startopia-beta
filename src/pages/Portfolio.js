import React, { useEffect, useState, useMemo } from 'react';
import { useQuery } from 'convex/react'; // Ensure this path is correct
import { api } from '../convex/_generated/api';
import IdeaCard from '../components/card/IdeaCard';
import { CircularProgress, Box, Typography, Grid } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react'; // Assuming you're using Auth0 for authentication

const Portfolio = () => {
  const { user } = useAuth0(); // Get the user object from Auth0
  const userId = user?.sub; // Assuming the user ID is stored in the 'sub' field

  const ideasQuery = useQuery(api.ideas.getIdeasByUser, { user_id: userId });
  const ideas = useMemo(() => ideasQuery || [], [ideasQuery]);
  const [sortedIdeas, setSortedIdeas] = useState([]);

  useEffect(() => {
    if (ideas) {
      const sorted = [...ideas].sort((a, b) => new Date(b._creationTime) - new Date(a._creationTime));
      setSortedIdeas(sorted);
    }
  }, [ideas]);

  if (!ideas) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3, mt: 8, maxWidth: 'lg', mx: 'auto' }}>
      {sortedIdeas.length === 0 ? (
        <Typography variant="h6" align="center">No saved ideas found.</Typography>
      ) : (
        <Grid container spacing={3} justifyContent="center">
          {sortedIdeas.map((idea) => (
            <Grid item xs={12} sm={6} md={4} key={idea._id}>
              <IdeaCard idea={idea} showSaveButton={false} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Portfolio;
