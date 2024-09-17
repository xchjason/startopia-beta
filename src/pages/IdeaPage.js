import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useAction } from 'convex/react';
import { api } from '../convex/_generated/api';
import ExpandableSection from '../components/idea/ExpandableSection';
import IdeaDetails from '../components/idea/IdeaDetails';
import ScoreChart from '../components/idea/ScoreChart';
import CompetitionChart from '../components/idea/CompetitionChart';
import RiskMatrix from '../components/idea/RiskMatrix';
import ConsumerSegments from '../components/idea/ConsumerSegments';
import { CircularProgress } from '@mui/material';

const IdeaPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [editedIdea, setEditedIdea] = useState(null);
  const [evaluationExpanded, setEvaluationExpanded] = useState(false);
  const [planExpanded, setPlanExpanded] = useState(false);
  const [competitionExpanded, setCompetitionExpanded] = useState(false);
  const [isGeneratingEvaluation, setIsGeneratingEvaluation] = useState(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [isGeneratingCompetitors, setIsGeneratingCompetitors] = useState(false);
  const [riskExpanded, setRiskExpanded] = useState(false);
  const [isGeneratingRisks, setIsGeneratingRisks] = useState(false);
  const [consumerExpanded, setConsumerExpanded] = useState(false);
  const [isGeneratingConsumers, setIsGeneratingConsumers] = useState(false);
  const deleteIdeaMutation = useMutation(api.ideas.deleteIdea);

  const idea = useQuery(api.ideas.getIdeaById, { ideaId: id });
  const evaluation = useQuery(api.ideas.getEvaluation, { ideaId: id });
  const plan = useQuery(api.ideas.getPlan, { ideaId: id });
  const competitors = useQuery(api.ideas.getCompetitors, { ideaId: id });
  const risks = useQuery(api.ideas.getRisks, { ideaId: id });
  const consumers = useQuery(api.ideas.getConsumers, { ideaId: id });

  const updateIdeaMutation = useMutation(api.ideas.updateIdea);
  const resetIdeaMutation = useMutation(api.ideas.resetIdea);

  const evaluateIdeaAction = useAction(api.llm.evaluateIdea);
  const generatePlanAction = useAction(api.llm.generatePlan);
  const generateCompetitorsAction = useAction(api.llm.generateCompetitors);
  const createScoreMutation = useMutation(api.ideas.createScore);
  const createPlanMutation = useMutation(api.ideas.createPlan);
  const updateCompetitorsMutation = useMutation(api.ideas.updateCompetitors);
  const generateRiskAssessmentAction = useAction(api.llm.generateRiskAssessment);
  const updateRisksMutation = useMutation(api.ideas.updateRisks);
  const generateConsumerSegmentsAction = useAction(api.llm.generateConsumerSegments);
  const updateConsumersMutation = useMutation(api.ideas.updateConsumers);

  useEffect(() => {
    if (idea) {
      setEditedIdea(idea);
    }
  }, [idea]);

  const handleEditToggle = () => {
    setEditMode(!editMode);
    if (!editMode) {
      setEditedIdea(idea);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedIdea(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!editedIdea) return;
    await updateIdeaMutation({
      ideaId: id,
      user_id: editedIdea.user_id,
      title: editedIdea.title,
      category: editedIdea.category,
      description: editedIdea.description,
      problem: editedIdea.problem,
      solution: editedIdea.solution,
    });
    setEditMode(false);
  };

  const handleReset = async () => {
    if (!editedIdea) return;
    if (window.confirm("Are you sure you want to reset this idea? This will save the idea details but delete all previously generated content such as Evaluation and Plan. This action cannot be undone.")) {
      await resetIdeaMutation({
        ideaId: id,
        user_id: editedIdea.user_id,
      });
      setEditMode(false);
      // Refresh the page to reflect the changes
      navigate(0);
    }
  };

  const handleCancel = () => {
    setEditedIdea(idea);
    setEditMode(false);
  };

  const evaluateIdea = async () => {
    if (!idea) return;
    setIsGeneratingEvaluation(true);
    try {
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
      setEvaluationExpanded(true);
    } catch (error) {
      console.error("Error generating evaluation:", error);
    } finally {
      setIsGeneratingEvaluation(false);
    }
  };

  const generatePlan = async () => {
    if (!idea) return;
    setIsGeneratingPlan(true);
    try {
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
      setPlanExpanded(true);
    } catch (error) {
      console.error("Error generating plan:", error);
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const generateCompetitors = async () => {
    if (!idea) return;
    setIsGeneratingCompetitors(true);
    try {
      const generatedCompetitors = await generateCompetitorsAction({
        title: idea.title,
        category: idea.category,
        description: idea.description,
        problem: idea.problem,
        solution: idea.solution,
      });
      await updateCompetitorsMutation({
        ideaId: id,
        competitors: generatedCompetitors,
      });
      setCompetitionExpanded(true);
    } catch (error) {
      console.error("Error generating competitors:", error);
    } finally {
      setIsGeneratingCompetitors(false);
    }
  };

  const generateRiskAssessment = async () => {
    if (!idea) return;
    setIsGeneratingRisks(true);
    try {
      const generatedRisks = await generateRiskAssessmentAction({
        title: idea.title,
        category: idea.category,
        description: idea.description,
        problem: idea.problem,
        solution: idea.solution,
      });
      await updateRisksMutation({
        ideaId: id,
        risks: generatedRisks,
      });
      setRiskExpanded(true);
    } catch (error) {
      console.error("Error generating risk assessment:", error);
    } finally {
      setIsGeneratingRisks(false);
    }
  };

  const generateConsumerSegments = async () => {
    if (!idea) return;
    setIsGeneratingConsumers(true);
    try {
      const generatedConsumers = await generateConsumerSegmentsAction({
        title: idea.title,
        category: idea.category,
        description: idea.description,
        problem: idea.problem,
        solution: idea.solution,
      });
      await updateConsumersMutation({
        ideaId: id,
        consumers: generatedConsumers,
      });
      setConsumerExpanded(true);
    } catch (error) {
      console.error("Error generating consumer segments:", error);
    } finally {
      setIsGeneratingConsumers(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this idea? This action cannot be undone.")) {
      try {
        await deleteIdeaMutation({ ideaId: id });
        navigate('/portfolio'); // Redirect to the portfolio page after deletion
      } catch (error) {
        console.error("Error deleting idea:", error);
        alert("Failed to delete the idea. Please try again.");
      }
    }
  };

  const evaluationContent = evaluation ? (
    <div>
      <div className="mb-4 flex items-center space-x-4">
        <h3 className="text-2xl font-bold text-white">Overall Score:</h3>
        <p className="text-3xl font-bold text-blue-400">{evaluation.overall_score}</p>
      </div>
      <ScoreChart scores={evaluation.criteria_scores} />
    </div>
  ) : (
    <button
      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 disabled:bg-gray-400 flex items-center justify-center"
      onClick={evaluateIdea}
      disabled={isGeneratingEvaluation}
    >
      {isGeneratingEvaluation ? (
        <CircularProgress size={24} color="inherit" />
      ) : (
        'Evaluate Idea'
      )}
    </button>
  );

  const planContent = plan ? (
    <div>
      <div className="flex space-x-4 mb-4">
        {Object.entries(plan)
          .filter(([key]) => !['_id', 'idea_id', '_creationTime'].includes(key))
          .slice(0, 4)
          .map(([aspect, planDetails], index) => {
            const colors = ['bg-green-600', 'bg-blue-600', 'bg-purple-600', 'bg-red-500'];
            return (
              <button
                key={aspect}
                className={`${colors[index]} w-1/4 p-2 rounded-lg text-white font-semibold hover:opacity-80 transition-opacity duration-200`}
                onClick={() => setPlanExpanded(planExpanded === aspect ? false : aspect)}
              >
                {aspect}
              </button>
            );
          })}
      </div>
      {planExpanded && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2 text-white">{planExpanded}</h3>
          <p className="text-gray-300">{plan[planExpanded]}</p>
        </div>
      )}
    </div>
  ) : (
    <button
      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 disabled:bg-gray-400 flex items-center justify-center"
      onClick={generatePlan}
      disabled={isGeneratingPlan}
    >
      {isGeneratingPlan ? (
        <CircularProgress size={24} color="inherit" />
      ) : (
        'Generate Plan'
      )}
    </button>
  );

  const competitionContent = competitors && competitors.length > 0 ? (
    <CompetitionChart competitors={competitors} />
  ) : (
    <button
      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 disabled:bg-gray-400 flex items-center justify-center"
      onClick={generateCompetitors}
      disabled={isGeneratingCompetitors}
    >
      {isGeneratingCompetitors ? (
        <CircularProgress size={24} color="inherit" />
      ) : (
        'Generate Competitors'
      )}
    </button>
  );

  const riskContent = risks ? (
    <RiskMatrix risks={risks} title={`Risk Assessment Matrix`} />
  ) : (
    <button
      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 disabled:bg-gray-400 flex items-center justify-center"
      onClick={generateRiskAssessment}
      disabled={isGeneratingRisks}
    >
      {isGeneratingRisks ? (
        <CircularProgress size={24} color="inherit" />
      ) : (
        'Generate Risk Assessment'
      )}
    </button>
  );

  const consumerContent = consumers ? (
    <ConsumerSegments segments={consumers} />
  ) : (
    <button
      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 disabled:bg-gray-400 flex items-center justify-center"
      onClick={generateConsumerSegments}
      disabled={isGeneratingConsumers}
    >
      {isGeneratingConsumers ? (
        <CircularProgress size={24} color="inherit" />
      ) : (
        'Generate Target Customers'
      )}
    </button>
  );

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          {editMode ? (
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg h-fit">
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                <input
                  id="title"
                  className="w-full bg-gray-700 text-white p-2 rounded"
                  name="title"
                  value={editedIdea.title}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <textarea
                  id="description"
                  className="w-full bg-gray-700 text-white p-2 rounded"
                  name="description"
                  value={editedIdea.description}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="problem" className="block text-sm font-medium text-gray-300 mb-1">Problem</label>
                <textarea
                  id="problem"
                  className="w-full bg-gray-700 text-white p-2 rounded"
                  name="problem"
                  value={editedIdea.problem}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="solution" className="block text-sm font-medium text-gray-300 mb-1">Solution</label>
                <textarea
                  id="solution"
                  className="w-full bg-gray-700 text-white p-2 rounded"
                  name="solution"
                  value={editedIdea.solution}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                <input
                  id="category"
                  className="w-full bg-gray-700 text-white p-2 rounded"
                  name="category"
                  value={editedIdea.category}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  className="px-4 py-2 bg-green-600 text-white rounded"
                  onClick={handleSave}
                >
                  Save
                </button>
                <button
                  className="px-4 py-2 bg-yellow-600 text-white rounded"
                  onClick={handleReset}
                >
                  Reset
                </button>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="relative">
              <IdeaDetails idea={idea} />
              <div className="absolute bottom-2 right-2 space-x-2">
                <button
                  className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm rounded transition-colors duration-200"
                  onClick={handleEditToggle}
                >
                  Edit
                </button>
                <button
                  className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm rounded transition-colors duration-200"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
        <div>
          <ExpandableSection
            title="Evaluation"
            content={evaluationContent}
            isExpanded={evaluationExpanded}
            onToggle={() => setEvaluationExpanded(!evaluationExpanded)}
          />
          <ExpandableSection
            title="Market"
            content={consumerContent}
            isExpanded={consumerExpanded}
            onToggle={() => setConsumerExpanded(!consumerExpanded)}
          />
          <ExpandableSection
            title="Competition"
            content={competitionContent}
            isExpanded={competitionExpanded}
            onToggle={() => setCompetitionExpanded(!competitionExpanded)}
          />
          <ExpandableSection
            title="Risk"
            content={riskContent}
            isExpanded={riskExpanded}
            onToggle={() => setRiskExpanded(!riskExpanded)}
          />
          <ExpandableSection
            title="Plan"
            content={planContent}
            isExpanded={planExpanded}
            onToggle={() => setPlanExpanded(!planExpanded)}
          />
        </div>
      </div>
    </div>
  );
};

export default IdeaPage;