import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend, Label, ResponsiveContainer, ReferenceLine } from 'recharts';

const CompetitionChart = ({ competitors }) => {
  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart
          margin={{
            top: 20,
            right: 20,
            bottom: 20, // Increased bottom margin
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
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Legend verticalAlign="top" height={36} /> {/* Moved legend to the top */}
          <ReferenceLine x={5} stroke="#666" strokeWidth={2} />
          <ReferenceLine y={5} stroke="#666" strokeWidth={2} />
          <Scatter 
            name="Competitors" 
            data={competitors.filter(comp => !comp.isMainIdea)} 
            fill="#00BFFF"
            fillOpacity={0.8}
          />
          <Scatter
            name="Our Idea"
            data={competitors.filter(comp => comp.isMainIdea)}
            fill="#FFD700"
            fillOpacity={0.8}
            shape="star"
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CompetitionChart;