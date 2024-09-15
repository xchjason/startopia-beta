import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend, Label, ResponsiveContainer, ReferenceLine } from 'recharts';
import { FaQuestionCircle } from 'react-icons/fa';

const CompetitionChart = ({ competitors }) => {
  if (!competitors || competitors.length === 0) {
    return <p>No competition data available.</p>;
  }

  const renderScatterPoint = (props) => {
    const { cx, cy, payload } = props;
    return (
      <g>
        <circle cx={cx} cy={cy} r={5} fill={payload.isMainIdea ? "#FFD700" : "#00BFFF"} fillOpacity={0.8} />
        <text x={cx} y={cy - 10} textAnchor="middle" fill="#fff" fontSize={10}>
          {payload.name}
        </text>
      </g>
    );
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip" style={{ backgroundColor: '#333', color: '#fff', padding: '10px', border: '1px solid #555' }}>
          <p>{`${payload[0].payload.name}`}</p>
          <p>{`Vision Completeness: ${payload[0].value}`}</p>
          <p>{`Execution Ability: ${payload[1].value}`}</p>
        </div>
      );
    }
    return null;
  };

  const mainIdea = competitors.find(comp => comp.isMainIdea);
  const otherCompetitors = competitors.filter(comp => !comp.isMainIdea);

  return (
    <div className="w-full h-96 relative">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            type="number" 
            dataKey="VisionCompleteness" 
            name="Vision Completeness" 
            unit="" 
            domain={[0, 10]}
            ticks={[0, 5, 10]}
          >
            <Label value="Vision Completeness" offset={0} position="bottom" />
          </XAxis>
          <YAxis 
            type="number" 
            dataKey="ExecutionAbility" 
            name="Execution Ability" 
            unit="" 
            domain={[0, 10]}
            ticks={[0, 5, 10]}
          >
            <Label value="Execution Ability" angle={-90} position="left" style={{ textAnchor: 'middle' }} />
          </YAxis>
          <ZAxis type="category" dataKey="name" name="Company" />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="top" height={36} iconType="circle" />
          <ReferenceLine x={5} stroke="#666" strokeWidth={2} />
          <ReferenceLine y={5} stroke="#666" strokeWidth={2} />
          <Scatter 
            name="Competitors" 
            data={otherCompetitors} 
            shape={renderScatterPoint}
            fill="#00BFFF"
          />
          {mainIdea && (
            <Scatter 
              name="Main Idea" 
              data={[mainIdea]} 
              shape={renderScatterPoint}
              fill="#FFD700"
            />
          )}
        </ScatterChart>
      </ResponsiveContainer>
      <a 
        href="https://www.gartner.com/en/research/methodologies/magic-quadrants-research" 
        target="_blank" 
        rel="noopener noreferrer"
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 cursor-pointer z-10"
        title="Learn about Magic Quadrant methodology"
      >
        <FaQuestionCircle size={20} />
      </a>
    </div>
  );
};

export default CompetitionChart;