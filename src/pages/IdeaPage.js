import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useAction } from 'convex/react';
import { api } from '../convex/_generated/api';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const ExpandableSection = ({ title, content, isExpanded, onToggle }) => (
  <div className="mb-4">
    <button
      className="w-full flex justify-between items-center p-4 bg-dark-800 hover:bg-dark-700 transition-colors duration-200 rounded-lg"
      onClick={onToggle}
    >
      <h2 className="text-xl font-semibold">{title}</h2>
      {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
    </button>
    {isExpanded && (
      <div className="mt-2 p-4 bg-dark-900 rounded-lg">
        {content}
      </div>
    )}
  </div>
);

const ScoreChart = ({ scores }) => {
  const data = Object.entries(scores)
    .filter(([name]) => !name.endsWith('_explanation'))
    .map(([name, value]) => ({
      name,
      score: value,
      explanation: scores[`${name}_explanation`],
    }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-dark-800 p-2 rounded shadow max-w-xs">
          <p className="font-semibold">{label}</p>
          <p>Score: {payload[0].value}</p>
          <p className="text-sm">{payload[0].payload.explanation}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        layout="vertical"
        data={data}
        margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
      >
        <XAxis type="number" domain={[0, 10]} />
        <YAxis dataKey="name" type="category" width={100} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="score" fill="#4299e1" barSize={10} />
      </BarChart>
    </ResponsiveContainer>
  );
};

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
    return <p className="text-center mt-20">No idea selected</p>;
  }

  if (idea === undefined) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (idea === null) {
    return <p className="text-center mt-20">Idea not found</p>;
  }

  const evaluationContent = evaluation ? (
    <div>
      <div className="mb-4 text-center">
        <h3 className="text-2xl font-bold">Overall Score</h3>
        <p className="text-4xl font-bold text-blue-400">{evaluation.overall_score}</p>
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
      {Object.entries(plan)
        .filter(([key]) => !['_id', 'idea_id', '_creationTime'].includes(key))
        .map(([aspect, planDetails]) => (
          <div key={aspect} className="mb-4">
            <h3 className="text-lg font-semibold mb-1">{aspect}</h3>
            <p>{planDetails}</p>
          </div>
        ))}
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
        <div className="bg-dark-800 p-6 rounded-lg shadow-lg h-fit">
          <h1 className="text-3xl font-bold mb-4">{idea.title}</h1>
          <div className="space-y-4">
            <p><strong className="text-blue-400">Description:</strong> {idea.description}</p>
            <p><strong className="text-blue-400">Problem:</strong> {idea.problem}</p>
            <p><strong className="text-blue-400">Solution:</strong> {idea.solution}</p>
            <p><strong className="text-blue-400">Category:</strong> {idea.category}</p>
          </div>
        </div>
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