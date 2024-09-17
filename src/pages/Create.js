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
  CircularProgress,
  Tooltip,
  IconButton
} from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import { useAction, useMutation, useQuery } from "convex/react"; 
import { api } from "../convex/_generated/api";
import CreateCard from "../components/card/CreateCard";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const Create = () => {
  const { user } = useAuth0();
  const [problem, setProblem] = useState("");
  const [technicalComplexity, setTechnicalComplexity] = useState(5);
  const [marketSize, setMarketSize] = useState(5);
  const [initialFunding, setInitialFunding] = useState(5);
  const [ideas, setIdeas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateIdeas = useAction(api.llm.generateIdeas);
  const createIdea = useMutation(api.ideas.createIdea);
  const getIdeasByUser = useQuery(api.ideas.getIdeasByUser, { user_id: user?.sub });

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
          Initial Funding Requirement: ${initialFunding} out of 10
          
          For each idea:
          - keep the title short
          - Keep the description concise 
          - Provide a detailed explanation of the problem 
          - Offer a comprehensive solution`,
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
      // Check if the idea already exists
      const existingIdea = getIdeasByUser?.find(
        (savedIdea) => savedIdea.title === idea.title && savedIdea.description === idea.description
      );

      if (existingIdea) {
        alert(`Idea "${idea.title}" has already been saved!`);
        return;
      }

      await createIdea({
        user_id: user.sub,
        title: idea.title,
        description: idea.description,
        problem: idea.problem,
        solution: idea.solution,
        category: idea.category,
        score_id: idea.score_id || "",
        plan_id: idea.plan_id || "",
        competitors: "", // Add this line to include an empty string for competitors
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
          <Paper elevation={3} sx={{ 
            p: 3, 
            bgcolor: 'rgba(30, 41, 59, 0.8)',
            borderRadius: 2,
            border: '1px solid transparent',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 0 15px rgba(255, 255, 255, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            },
            height: '100%', // Ensure full height
            display: 'flex',
            flexDirection: 'column',
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
              <Tooltip title="Enter a product you'd like to create, a problem you want to solve, a demand you observe, or anything else that inspires you!" arrow>
                <IconButton size="small" sx={{ ml: 1, color: 'rgba(255, 255, 255, 0.7)' }}>
                  <HelpOutlineIcon />
                </IconButton>
              </Tooltip>
            </Box>
            <Box mt={2} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button 
                onClick={handleGenerate} 
                variant="contained" 
                color="primary"
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} /> : "Generate Ideas"}
              </Button>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ 
            p: 3, 
            bgcolor: 'rgba(30, 41, 59, 0.8)',
            borderRadius: 2,
            border: '1px solid transparent',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 0 15px rgba(255, 255, 255, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            },
            height: '100%', // Ensure full height
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
            <Box>
              <Typography gutterBottom sx={{ color: 'white', display: 'flex', alignItems: 'center' }}>
                Technical Complexity
                <Tooltip title="Set desired technological sophistication: 1 (simple) to 10 (groundbreaking)" arrow>
                  <HelpOutlineIcon sx={{ ml: 1, fontSize: 16, color: 'rgba(255, 255, 255, 0.7)' }} />
                </Tooltip>
              </Typography>
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
            <Box>
              <Typography gutterBottom sx={{ color: 'white', display: 'flex', alignItems: 'center' }}>
                Market Size
                <Tooltip title="Set target market size: 1 (niche) to 10 (mass market)" arrow>
                  <HelpOutlineIcon sx={{ ml: 1, fontSize: 16, color: 'rgba(255, 255, 255, 0.7)' }} />
                </Tooltip>
              </Typography>
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
            <Box>
              <Typography gutterBottom sx={{ color: 'white', display: 'flex', alignItems: 'center' }}>
                Initial Funding
                <Tooltip title="Set available capital size: 1 (bootstrap) to 10 (major investment)" arrow>
                  <HelpOutlineIcon sx={{ ml: 1, fontSize: 16, color: 'rgba(255, 255, 255, 0.7)' }} />
                </Tooltip>
              </Typography>
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
      {ideas.length > 0 && (
        <Box mt={4}>
          <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
            Generated Ideas
          </Typography>
          <Grid container spacing={3}>
            {ideas.map((idea, index) => (
              <Grid item xs={12} md={4} key={index}>
                <CreateCard idea={idea} onSave={handleSave} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
};

export default Create;