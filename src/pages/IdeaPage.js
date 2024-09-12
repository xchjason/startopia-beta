import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useAction } from 'convex/react';
import { api } from '../convex/_generated/api';
import ExpandableSection from '../components/idea/ExpandableSection';
import IdeaDetails from '../components/idea/IdeaDetails';
import ScoreChart from '../components/idea/ScoreChart';

const IdeaPage = () => {
  const { id } = useParams();
  const [evaluationExpanded, setEvaluationExpanded] = useState(false);
  const [planExpanded, setPlanExpanded] = useState(false);

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
    setEvaluationExpanded(true);
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
    setPlanExpanded(true);
  };

  if (!id) {
    return <p className="text-center mt-20 text-white">No idea selected</p>;
  }

  if (idea === undefined) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (idea === null) {
    return <p className="text-center mt-20 text-white">Idea not found</p>;
  }

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
      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
      onClick={evaluateIdea}
    >
      Evaluate Idea
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
      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
      onClick={generatePlan}
    >
      Generate Plan
    </button>
  );

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <IdeaDetails idea={idea} />
        <div>
          <ExpandableSection
            title="Evaluation"
            content={evaluationContent}
            isExpanded={evaluationExpanded}
            onToggle={() => setEvaluationExpanded(!evaluationExpanded)}
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