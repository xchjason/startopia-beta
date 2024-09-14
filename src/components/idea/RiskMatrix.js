import React from 'react';
import { ResponsiveHeatMap } from '@nivo/heatmap';

const RiskMatrix = ({ risks, title }) => {
  // Transform risks data into the format expected by Nivo
  const data = Array(5).fill().map((_, i) => ({
    id: 5 - i, // Reverse the order for correct y-axis representation
    data: Array(5).fill().map((_, j) => ({
      x: j + 1,
      y: 0, // Default value
    }))
  }));

  // Populate data with actual risks
  risks.forEach(risk => {
    const row = data.find(d => d.id === risk.likelihood);
    if (row) {
      const cell = row.data.find(d => d.x === risk.impact);
      if (cell) {
        cell.y = 1; // Mark as filled
        cell.risk = risk; // Store the entire risk object for tooltip
      }
    }
  });

  const theme = {
    textColor: "#ffffff",
    fontSize: 12,
    axis: {
      domain: {
        line: {
          stroke: "#777777",
          strokeWidth: 1
        }
      },
      ticks: {
        line: {
          stroke: "#777777",
          strokeWidth: 1
        }
      }
    },
    grid: {
      line: {
        stroke: "#444444",
        strokeWidth: 1
      }
    }
  };

  return (
    <div style={{ height: '500px', width: '100%' }}>
      <h2 className="text-xl font-bold text-center text-white mb-4">{title}</h2>
      <ResponsiveHeatMap
        data={data}
        margin={{ top: 60, right: 60, bottom: 60, left: 60 }}
        valueFormat=">-.2s"
        axisTop={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Impact',
          legendPosition: 'middle',
          legendOffset: -40
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Likelihood',
          legendPosition: 'middle',
          legendOffset: -40
        }}
        colors={(cell) => {
          if (cell.data.y === 0) return '#444444';
          const risk = cell.data.risk;
          const score = risk.impact * risk.likelihood;
          if (score > 15) return "#ff6666";
          if (score > 8) return "#ffcc66";
          return "#66cc66";
        }}
        emptyColor="#444444"
        borderColor="#000000"
        borderWidth={1}
        enableLabels={true}
        labelTextColor="#000000"
        legends={[]}
        annotations={risks.map(risk => ({
          type: 'rect',
          match: { id: risk.likelihood, value: risk.impact },
          noteComponent: ({ x, y }) => (
            <g transform={`translate(${x},${y})`}>
              <text
                x={0}
                y={0}
                textAnchor="middle"
                dominantBaseline="middle"
                style={{ fontSize: 10, fill: '#000000' }}
              >
                {risk.factor}
              </text>
            </g>
          ),
        }))}
        theme={theme}
        tooltip={({ cell }) => (
          cell.data.risk ? (
            <div style={{ background: '#333', padding: '12px', borderRadius: '4px', color: 'white' }}>
              <strong>{cell.data.risk.factor}</strong>
              <br />
              Impact: {cell.data.risk.impact}
              <br />
              Likelihood: {cell.data.risk.likelihood}
              <br />
              Mitigation: {cell.data.risk.mitigation}
            </div>
          ) : null
        )}
      />
    </div>
  );
};

export default RiskMatrix;