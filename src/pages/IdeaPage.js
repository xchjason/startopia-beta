import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Container, Typography, Button, Card, CardContent, Grid, Box, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useQuery, useMutation, useAction } from 'convex/react';
import { api } from '../convex/_generated/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const IdeaPage = () => {
  const { id } = useParams(); // Extract ideaId from URL
  const [scores, setScores] = useState(null);
  const [plans, setPlans] = useState(null);

  const idea = useQuery(api.ideas.getIdeaById, { ideaId: id });
  const evaluateIdeaAction = useAction(api.llm.evaluateIdea);
  const generatePlanAction = useAction(api.llm.generatePlan);
  const createScoreMutation = useMutation(api.ideas.createScore);
  const createPlanMutation = useMutation(api.ideas.createPlan);

  const evaluateIdea = async () => {
    if (!idea) return;

    const evaluation = await evaluateIdeaAction({
      idea_id: id,
      title: idea.title,
      description: idea.description,
      problem: idea.problem,
      solution: idea.solution,
      category: idea.category,
    });

    setScores(evaluation.evaluation.criteria_scores);
    await createScoreMutation({
      idea_id: id,
      evaluation: evaluation.evaluation,
    });
  };

  const generatePlan = async () => {
    if (!idea) return;

    const generatedPlan = await generatePlanAction({
      idea_id: id,
      title: idea.title,
      description: idea.description,
      problem: idea.problem,
      solution: idea.solution,
      category: idea.category,
    });

    // Remove idea_id from the plan before setting state
    const { idea_id, ...planDetails } = generatedPlan;
    setPlans(planDetails);
    
    // Adjust the structure to match the createPlan mutation expectations
    await createPlanMutation({
      idea_id: id,
      plan: planDetails,
    });
  };

  // Remove chartData and overallScore calculations

  if (!id) {
    return <Typography>No idea selected</Typography>;
  }

  if (idea === undefined) {
    return <Typography>Loading...</Typography>;
  }

  if (idea === null) {
    return <Typography>Idea not found</Typography>;
  }

  return (
    <Container maxWidth="md" style={{ marginTop: '64px' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {idea.title}
      </Typography>
      <Typography variant="body1" paragraph>
        <strong>Description:</strong> {idea.description}
      </Typography>
      <Typography variant="body1" paragraph>
        <strong>Problem:</strong> {idea.problem}
      </Typography>
      <Typography variant="body1" paragraph>
        <strong>Solution:</strong> {idea.solution}
      </Typography>
      <Typography variant="body1" paragraph>
        <strong>Category:</strong> {idea.category}
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
            {Object.entries(scores).map(([criterion, score]) => (
              <Accordion key={criterion}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>{criterion}: {score}</Typography>
                </AccordionSummary>
                {/* Remove AccordionDetails with placeholder text */}
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
            {Object.entries(plans).filter(([key]) => key !== 'idea_id').map(([aspect, plan]) => (
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
