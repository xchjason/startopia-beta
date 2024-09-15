import React, { useState } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend, Label, ResponsiveContainer, ReferenceLine } from 'recharts';
import { FaQuestionCircle } from 'react-icons/fa';

const CompetitionChart = ({ competitors }) => {
  const [showTooltip, setShowTooltip] = useState(false);

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
        <div className="custom-tooltip" style={{ 
          backgroundColor: '#1A202C', 
          color: '#E2E8F0', 
          padding: '12px', 
          borderRadius: '8px',
          minWidth: '200px',
          maxWidth: '300px',
          whiteSpace: 'normal',
          wordBreak: 'break-word',
          overflowWrap: 'break-word'
        }}>
          <p style={{ fontWeight: 'bold', fontSize: '16px', margin: '0 0 8px 0' }}>{`${payload[0].payload.name}`}</p>
          <p style={{ margin: '0 0 8px 0' }}><strong>Vision Completeness:</strong> {payload[0].value}</p>
          <p style={{ margin: '0 0 8px 0' }}><strong>Execution Ability:</strong> {payload[1].value}</p>
        </div>
      );
    }
    return null;
  };

  const mainIdea = competitors.find(comp => comp.isMainIdea);
  const otherCompetitors = competitors.filter(comp => !comp.isMainIdea);

  return (
    <div className="w-full h-96 relative">
      <h2 className="text-center text-xl font-bold mb-1">Gartner Magic Quadrant</h2>
      <ResponsiveContainer width="100%" height="95%">
        <ScatterChart
          margin={{
            top: 5,
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
      <div className="absolute top-2 right-2 z-10">
        <a 
          href="https://www.gartner.com/en/research/methodologies/magic-quadrants-research" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-300 hover:text-gray-100 cursor-pointer"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <FaQuestionCircle size={20} />
        </a>
        {showTooltip && (
          <div 
            className="absolute right-0 mt-1 p-1 rounded-lg shadow-lg"
            style={{
              backgroundColor: '#1A202C',
              color: '#E2E8F0',
              width: '120px',
              fontSize: '11px',
              whiteSpace: 'normal',
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              textAlign: 'center'
            }}
          >
            Click to learn more
          </div>
        )}
      </div>
    </div>
  );
};

export default CompetitionChart;