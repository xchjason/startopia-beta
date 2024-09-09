import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Slider,
  Grid,
  Paper,
  CircularProgress
} from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import { useAction, useMutation } from "convex/react"; 
import { api } from "../convex/_generated/api";
import IdeaCard from "../components/card/IdeaCard";

const Create = () => {
  const { user } = useAuth0();
  const [problem, setProblem] = useState("");
  const [technicalComplexity, setTechnicalComplexity] = useState(5);
  const [marketSize, setMarketSize] = useState(5);
  const [initialFunding, setInitialFunding] = useState(5);
  const [ideas, setIdeas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateIdeas = useAction(api.llm.generateIdeas);
  const createIdea = useMutation(api.ideas.createIdea); // Use useMutation for createIdea

  const handleGenerate = async () => {
    if (!problem) {
      alert("Please enter an idea statement.");
      return;
    }

    setIsLoading(true);
    try {
      const generatedIdeas = await generateIdeas({
        prompt: `Generate 3 startup ideas based on the following problem statement and criteria:
          Problem: ${problem}
          Technical Complexity: ${technicalComplexity} out of 10
          Market Size: ${marketSize} out of 10
          Initial Funding Requirement: ${initialFunding} out of 10`,
        user_id: user.sub
      });

      setIdeas(generatedIdeas);
    } catch (error) {
      console.error("Error generating ideas:", error);
      if (error.message.includes("Expected 3 ideas")) {
        alert("The AI didn't generate the expected number of ideas. Please try again.");
      } else if (error.message.includes("Zod")) {
        alert("The generated ideas did not match the expected format. Please try again or contact support if the issue persists.");
      } else {
        alert("An error occurred while generating ideas. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (idea) => {
    try {
      await createIdea({
        user_id: user.sub,
        title: idea.title,
        description: idea.description,
        problem: idea.problem,
        solution: idea.solution,
        category: idea.category,
        score_id: idea.score_id || "",
        plan_id: idea.plan_id || ""
      });
      alert(`Idea "${idea.title}" saved successfully!`);
    } catch (error) {
      console.error("Error saving idea:", error);
      alert("An error occurred while saving the idea. Please try again.");
    }
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
      <Typography 
        variant="h5" 
        component="h1" 
        gutterBottom 
        sx={{ textAlign: 'center', mb: 4 }}
      >
        Create
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
                marks
                min={0}
                max={10}
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
                marks
                min={0}
                max={10}
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
                marks
                min={0}
                max={10}
                sx={{ color: 'white' }}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
      <Box mt={3} sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button 
          onClick={handleGenerate} 
          variant="contained" 
          color="primary"
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : "Generate Ideas"}
        </Button>
      </Box>
      {ideas.length > 0 && (
        <Box mt={4}>
          <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
            Generated Ideas
          </Typography>
          <Grid container spacing={3}>
            {ideas.map((idea, index) => (
              <Grid item xs={12} md={4} key={index}>
                <IdeaCard idea={idea} onSave={handleSave} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
};

export default Create;