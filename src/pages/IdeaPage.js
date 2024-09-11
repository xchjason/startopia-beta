import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Button, Card, CardContent, Grid, Box, CircularProgress } from '@mui/material';
import { useQuery, useMutation, useAction } from 'convex/react';
import { api } from '../convex/_generated/api';

const IdeaPage = () => {
  const { id } = useParams();

  const idea = useQuery(api.ideas.getIdeaById, { ideaId: id });
  const evaluation = useQuery(api.ideas.getEvaluation, { ideaId: id });
  const plan = useQuery(api.ideas.getPlan, { ideaId: id });

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

    const { idea_id, ...planDetails } = generatedPlan;
    
    await createPlanMutation({
      idea_id: id,
      plan: planDetails,
    });
  };

  if (!id) {
    return <Typography>No idea selected</Typography>;
  }

  if (idea === undefined) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
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
        {evaluation ? (
          <Box mt={2}>
            <Typography>
              <strong>Overall Score:</strong> {evaluation.overall_score}
            </Typography>
            {Object.entries(evaluation.criteria_scores).map(([criterion, data]) => (
              <Box key={criterion} mt={2}>
                <Typography variant="h6">
                  {criterion.charAt(0).toUpperCase() + criterion.slice(1).replace('_', ' ')}
                </Typography>
                <Typography>
                  <strong>Score:</strong> {data.score || data}
                </Typography>
                {data.explanation && (
                  <Typography>
                    <strong>Explanation:</strong> {data.explanation}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        ) : (
          <Button variant="contained" color="primary" onClick={evaluateIdea}>
            Evaluate Idea
          </Button>
        )}
      </Box>

      <Box my={4}>
        <Typography variant="h5" component="h2" gutterBottom>
          Plan
        </Typography>
        {plan ? (
          <Box my={2}>
            {Object.entries(plan)
              .filter(([key]) => !['_id', 'idea_id', '_creationTime'].includes(key))
              .map(([aspect, planDetails]) => (
                <Box key={aspect} mb={2}>
                  <Typography variant="h6" component="h3">
                    {aspect}
                  </Typography>
                  <Typography variant="body1">
                    {planDetails}
                  </Typography>
                </Box>
              ))}
          </Box>
        ) : (
          <Button variant="contained" color="primary" onClick={generatePlan}>
            Generate Plan
          </Button>
        )}
      </Box>
    </Container>
  );
};

export default IdeaPage;
