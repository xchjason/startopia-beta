import React, { useState } from "react";
import { TextField, Button, Container, Typography, Box, Slider, Grid, Paper, Card, CardContent, CardActions } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";

const Create = () => {
  const { user } = useAuth0();
  const [problem, setProblem] = useState("");
  const [technicalComplexity, setTechnicalComplexity] = useState(50);
  const [marketSize, setMarketSize] = useState(50);
  const [initialFunding, setInitialFunding] = useState(50);
  const [solutions, setSolutions] = useState([]);

  const handlePreview = () => {
    // Placeholder for AI-generated solutions
    const dummySolutions = [
      {
        id: 1,
        title: "AI-Powered Recycling Assistant",
        description: "An app that uses computer vision to help users properly sort their recyclables.",
        category: "Environmental Technology",
      },
      {
        id: 2,
        title: "Personalized Nutrition Planner",
        description: "A platform that creates custom meal plans based on individual health data and goals.",
        category: "Health Tech",
      },
      {
        id: 3,
        title: "Virtual Reality Language Immersion",
        description: "A VR application that provides immersive language learning experiences in virtual environments.",
        category: "EdTech",
      },
    ];
    setSolutions(dummySolutions);
  };

  const handleSave = (solution) => {
    // Placeholder for saving the idea to the database
    console.log("Saving idea:", solution);
    alert(`Idea "${solution.title}" saved successfully!`);
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
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, bgcolor: 'rgba(255, 255, 255, 0.05)' }}>
            <TextField
              fullWidth
              label="Idea Statement"
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              margin="normal"
              multiline
              rows={4}
              sx={inputStyles}
            />
            <Button onClick={() => setProblem("AI-generated idea statement (placeholder)")} variant="outlined" color="primary" sx={{ mt: 1 }}>
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
        <Button onClick={handlePreview} variant="contained" color="primary">
          Preview Solutions
        </Button>
      </Box>
      {solutions.length > 0 && (
        <Box mt={4}>
          <Typography variant="h5" gutterBottom>
            Generated Solutions
          </Typography>
          <Grid container spacing={3}>
            {solutions.map((solution) => (
              <Grid item xs={12} md={4} key={solution.id}>
                <Card sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}>
                  <CardContent>
                    <Typography variant="h6" component="div">
                      {solution.title}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {solution.description}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Category: {solution.category}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={() => handleSave(solution)} sx={{ color: 'white' }}>
                      Save Idea
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
};

export default Create;