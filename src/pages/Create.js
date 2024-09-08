import React, { useState } from "react";
import { TextField, Button, Container, Typography, Box, MenuItem, Select, Slider } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";

const Create = () => {
  const { user } = useAuth0();
  const [title, setTitle] = useState("");
  const [problem, setProblem] = useState("");
  const [solution, setSolution] = useState("");
  const [category, setCategory] = useState("");
  const [targetMarket, setTargetMarket] = useState("");
  const [usp, setUsp] = useState("");
  const [innovationLevel, setInnovationLevel] = useState(50);
  const [marketSize, setMarketSize] = useState(50);
  const [technicalComplexity, setTechnicalComplexity] = useState(50);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Placeholder for backend API call
    console.log("Submitting idea:", {
      user_id: user.sub,
      title,
      problem,
      solution,
      category,
      targetMarket,
      usp,
      innovationLevel,
      marketSize,
      technicalComplexity,
    });
    alert("Idea submitted (placeholder)");
  };

  const handleGenerateWithAI = (fieldSetter) => {
    // Placeholder for AI generation
    fieldSetter("Generated content from AI (placeholder)");
    alert("AI generation (placeholder)");
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8, color: 'white' }}>
      <Box mt={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Generate a New Idea
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="normal"
            InputLabelProps={{ style: { color: 'white' } }}
            InputProps={{ style: { color: 'white' } }}
          />
          <TextField
            fullWidth
            label="Problem Statement"
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            margin="normal"
            multiline
            rows={4}
            InputLabelProps={{ style: { color: 'white' } }}
            InputProps={{ style: { color: 'white' } }}
          />
          <Button onClick={() => handleGenerateWithAI(setProblem)} variant="outlined" color="primary">
            Generate with AI
          </Button>
          <TextField
            fullWidth
            label="Solution Overview"
            value={solution}
            onChange={(e) => setSolution(e.target.value)}
            margin="normal"
            multiline
            rows={4}
            InputLabelProps={{ style: { color: 'white' } }}
            InputProps={{ style: { color: 'white' } }}
          />
          <Button onClick={() => handleGenerateWithAI(setSolution)} variant="outlined" color="primary">
            Generate with AI
          </Button>
          <Select
            fullWidth
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            displayEmpty
            margin="normal"
            sx={{ color: 'white', '.MuiSelect-icon': { color: 'white' } }}
          >
            <MenuItem value="" disabled>
              Select Category
            </MenuItem>
            <MenuItem value="SaaS">SaaS</MenuItem>
            <MenuItem value="E-commerce">E-commerce</MenuItem>
            <MenuItem value="FinTech">FinTech</MenuItem>
            <MenuItem value="HealthTech">HealthTech</MenuItem>
          </Select>
          <TextField
            fullWidth
            label="Target Market"
            value={targetMarket}
            onChange={(e) => setTargetMarket(e.target.value)}
            margin="normal"
            InputLabelProps={{ style: { color: 'white' } }}
            InputProps={{ style: { color: 'white' } }}
          />
          <TextField
            fullWidth
            label="Unique Selling Proposition (USP)"
            value={usp}
            onChange={(e) => setUsp(e.target.value)}
            margin="normal"
            multiline
            rows={4}
            InputLabelProps={{ style: { color: 'white' } }}
            InputProps={{ style: { color: 'white' } }}
          />
          <Button onClick={() => handleGenerateWithAI(setUsp)} variant="outlined" color="primary">
            Generate with AI
          </Button>
          <Box mt={2}>
            <Typography gutterBottom>Innovation Level</Typography>
            <Slider
              value={innovationLevel}
              onChange={(e, newValue) => setInnovationLevel(newValue)}
              aria-labelledby="innovation-level-slider"
              valueLabelDisplay="auto"
              sx={{ color: 'white' }}
            />
          </Box>
          <Box mt={2}>
            <Typography gutterBottom>Market Size</Typography>
            <Slider
              value={marketSize}
              onChange={(e, newValue) => setMarketSize(newValue)}
              aria-labelledby="market-size-slider"
              valueLabelDisplay="auto"
              sx={{ color: 'white' }}
            />
          </Box>
          <Box mt={2}>
            <Typography gutterBottom>Technical Complexity</Typography>
            <Slider
              value={technicalComplexity}
              onChange={(e, newValue) => setTechnicalComplexity(newValue)}
              aria-labelledby="technical-complexity-slider"
              valueLabelDisplay="auto"
              sx={{ color: 'white' }}
            />
          </Box>
          <Box mt={2}>
            <Button type="submit" variant="contained" color="primary">
              Generate Complete Idea
            </Button>
          </Box>
          <Box mt={2}>
            <Button variant="contained" color="secondary" onClick={() => alert("Save as draft (placeholder)")}>
              Save as Draft
            </Button>
          </Box>
          <Box mt={2}>
            <Button variant="contained" color="success" onClick={() => alert("Submit for evaluation (placeholder)")}>
              Submit for Evaluation
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default Create;