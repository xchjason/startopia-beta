import React, { useState } from "react";
import { TextField, Button, Container, Typography, Box, Slider, Grid, Paper } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";

const Create = () => {
  const { user } = useAuth0();
  const [problem, setProblem] = useState("");
  const [technicalComplexity, setTechnicalComplexity] = useState(50);
  const [marketSize, setMarketSize] = useState(50);
  const [initialFunding, setInitialFunding] = useState(50);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Placeholder for backend API call
    console.log("Generating idea based on:", {
      user_id: user.sub,
      problem,
      technicalComplexity,
      marketSize,
      initialFunding,
    });
    alert("Generating idea (placeholder)");
  };

  const handleGenerateWithAI = () => {
    // Placeholder for AI generation of problem statement
    setProblem("AI-generated problem statement (placeholder)");
    alert("AI generation of problem statement (placeholder)");
  };

  const inputStyles = {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'rgba(255, 255, 255, 0.23)',
      },
      '&:hover fieldset': {
        borderColor: 'rgba(255, 255, 255, 0.5)',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'white',
      },
    },
    '& .MuiInputLabel-root': {
      color: 'rgba(255, 255, 255, 0.7)',
    },
    '& .MuiInputBase-input': {
      color: 'white',
    },
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 8, color: 'white' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Generate a New Idea
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3, bgcolor: 'rgba(255, 255, 255, 0.05)' }}>
              <TextField
                fullWidth
                label="Problem Statement"
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                margin="normal"
                multiline
                rows={4}
                sx={inputStyles}
              />
              <Button onClick={handleGenerateWithAI} variant="outlined" color="primary" sx={{ mt: 1 }}>
                Generate Problem with AI
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3, bgcolor: 'rgba(255, 255, 255, 0.05)' }}>
              <Box mt={2}>
                <Typography gutterBottom sx={{ color: 'white' }}>Technical Complexity</Typography>
                <Slider
                  value={technicalComplexity}
                  onChange={(e, newValue) => setTechnicalComplexity(newValue)}
                  aria-labelledby="technical-complexity-slider"
                  valueLabelDisplay="auto"
                  sx={{ color: 'white' }}
                />
              </Box>
              <Box mt={2}>
                <Typography gutterBottom sx={{ color: 'white' }}>Market Size</Typography>
                <Slider
                  value={marketSize}
                  onChange={(e, newValue) => setMarketSize(newValue)}
                  aria-labelledby="market-size-slider"
                  valueLabelDisplay="auto"
                  sx={{ color: 'white' }}
                />
              </Box>
              <Box mt={2}>
                <Typography gutterBottom sx={{ color: 'white' }}>Initial Funding</Typography>
                <Slider
                  value={initialFunding}
                  onChange={(e, newValue) => setInitialFunding(newValue)}
                  aria-labelledby="initial-funding-slider"
                  valueLabelDisplay="auto"
                  sx={{ color: 'white' }}
                />
              </Box>
            </Paper>
          </Grid>
        </Grid>
        <Box mt={3}>
          <Button type="submit" variant="contained" color="primary">
            Generate Idea
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default Create;