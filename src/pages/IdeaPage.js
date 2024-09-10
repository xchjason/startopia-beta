import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Container, Typography, Button, Card, CardContent, Grid, Box, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const mockIdea = {
  title: "AI-Powered Personal Fitness Coach",
  description: "A mobile app that uses AI to create personalized workout plans and provide real-time feedback.",
  problem: "Many people struggle to create effective workout routines and maintain proper form during exercises.",
  solution: "Our app uses computer vision and machine learning to analyze user movements and provide instant feedback, along with personalized workout plans.",
  category: "Health & Fitness"
};

const IdeaPage = () => {
  const [scores, setScores] = useState(null);
  const [plans, setPlans] = useState(null);

  const evaluateIdea = () => {
    const mockScores = {
      innovation: 8,
      market_fit: 7,
      feasibility: 9,
      scalability: 8,
      profitability: 7,
    };
    setScores(mockScores);
  };

  const generatePlan = () => {
    const mockPlans = {
      tech: "Develop a mobile app using React Native, integrate TensorFlow for AI capabilities, and use Firebase for backend services.",
      talent: "Hire a senior full-stack developer, a machine learning engineer, and a UX designer. Consider partnering with fitness professionals for content.",
      finance: "Seek seed funding of $500,000 from angel investors. Estimate $200,000 for initial development and $300,000 for marketing and operations.",
      legal: "Register the company as an LLC, file for relevant patents on AI algorithms, and ensure compliance with data protection regulations."
    };
    setPlans(mockPlans);
  };

  const chartData = scores ? {
    labels: Object.keys(scores),
    datasets: [{
      label: 'Scores',
      data: Object.values(scores),
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
    }]
  } : null;

  const overallScore = scores ? 
    Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length : 
    null;

  return (
    <Container maxWidth="md" style={{ marginTop: '64px' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {mockIdea.title}
      </Typography>
      <Typography variant="body1" paragraph>
        <strong>Description:</strong> {mockIdea.description}
      </Typography>
      <Typography variant="body1" paragraph>
        <strong>Problem:</strong> {mockIdea.problem}
      </Typography>
      <Typography variant="body1" paragraph>
        <strong>Solution:</strong> {mockIdea.solution}
      </Typography>
      <Typography variant="body1" paragraph>
        <strong>Category:</strong> {mockIdea.category}
      </Typography>

      <Box my={4}>
        <Typography variant="h5" component="h2" gutterBottom>
          Evaluation
        </Typography>
        <Button variant="contained" color="primary" onClick={evaluateIdea}>
          Evaluate Idea
        </Button>
        {scores && (
          <>
            <Box my={2} style={{ width: '100%', height: '300px' }}>
              <Bar data={chartData} />
            </Box>
            <Typography variant="body1" paragraph>
              <strong>Overall Score:</strong> {overallScore.toFixed(2)}
            </Typography>
            {Object.entries(scores).map(([criterion, score]) => (
              <Accordion key={criterion}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>{criterion}: {score}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>Explanation for {criterion} score...</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </>
        )}
      </Box>

      <Box my={4}>
        <Typography variant="h5" component="h2" gutterBottom>
          Plan
        </Typography>
        <Button variant="contained" color="primary" onClick={generatePlan}>
          Generate Plan
        </Button>
        {plans && (
          <Grid container spacing={2} my={2}>
            {Object.entries(plans).map(([aspect, plan]) => (
              <Grid item xs={12} key={aspect}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" component="h3">
                      {aspect}
                    </Typography>
                    <Typography variant="body1">
                      {plan}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default IdeaPage;
