import React from 'react';
import { ResponsiveHeatMap } from '@nivo/heatmap';

const RiskMatrix = ({ risks, title }) => {
  // Transform risks data into the format expected by Nivo
  const data = Array(3).fill().map((_, i) => ({
    id: 3 - i, // Reverse the order for correct y-axis representation
    data: Array(3).fill().map((_, j) => ({
      x: j + 1,
      y: '', // Default value
    }))
  }));

  // Populate data with actual risks
  risks.forEach(risk => {
    const row = data.find(d => d.id === risk.likelihood);
    if (row) {
      const cell = row.data.find(d => d.x === risk.impact);
      if (cell) {
        cell.y = risk.factor; // Display the factor name instead of 1
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
        },
        text: {
          fill: "#666666", // Change tick labels to slightly darker gray
          fontSize: 14 // Increase tick label font size
        }
      },
      legend: {
        text: {
          fill: "#666666", // Change legend labels to slightly darker gray
          fontSize: 16 // Increase legend label font size
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

  const splitLabel = (label, maxLength = 17) => {
    if (typeof label !== 'string' || label.length <= maxLength) return label;
    const words = label.split(' ');
    let lines = [];
    let currentLine = '';

    words.forEach(word => {
      if ((currentLine + word).length > maxLength) {
        lines.push(currentLine.trim());
        currentLine = word + ' ';
      } else {
        currentLine += word + ' ';
      }
    });
    lines.push(currentLine.trim());
    return lines;
  };

  return (
    <div style={{ height: '500px', width: '100%' }}>
      <h2 className="text-xl font-bold text-center text-white mb-4">{title}</h2>
      <ResponsiveHeatMap
        data={data}
        margin={{ top: 20, right: 60, bottom: 90, left: 60 }} // Reduced top margin
        valueFormat=">-.2s"
        axisTop={null} // Remove the top axis configuration
        axisBottom={{
          tickSize: 0, // Remove tick size
          tickPadding: 5,
          tickRotation: 0,
          format: d => {
            switch (d) {
              case 1: return 'Low';
              case 2: return 'Medium';
              case 3: return 'High';
              default: return '';
            }
          },
          legend: 'Impact',
          legendPosition: 'middle',
          legendOffset: 40 // Adjust offset as needed
        }}
        axisLeft={{
          tickSize: 0, // Remove tick size
          tickPadding: 20, // Adjust padding to move labels up
          tickRotation: -90, // Rotate labels by 90 degrees
          format: d => {
            switch (d) {
              case 1: return 'Low';
              case 2: return 'Medium';
              case 3: return 'High';
              default: return '';
            }
          },
          legend: 'Likelihood',
          legendPosition: 'middle',
          legendOffset: -50 // Move legend (and labels) to the right
        }}
        colors={(cell) => {
          if (cell.data.y !== '') {
            const risk = cell.data.risk;
            const score = risk.impact * risk.likelihood;
            if (score > 6) return "#ff6666";
            if (score > 3) return "#ffcc66";
            return "#66cc66";
          }
          return '#1A202C'; // Changed to match tooltip background color
        }}
        emptyColor="#1A202C" // Changed to match tooltip background color
        borderColor="#2D3748" // Changed to a more subtle color
        borderWidth={1}
        enableLabels={true}
        label={(cell) => {
          const labels = splitLabel(cell.data.y);
          return Array.isArray(labels) ? (
            <tspan>
              {labels.map((line, i) => (
                <tspan 
                  key={i} 
                  x="0" 
                  dy={i === 0 ? -20 : 20} // Further increase line spacing
                  style={{ fontSize: 16 }} // Increase font size
                >
                  {line}
                </tspan>
              ))}
            </tspan>
          ) : (
            <tspan style={{ fontSize: 16 }}>{labels}</tspan> // Increase font size
          );
        }}
        labelTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
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
            <div style={{ 
              background: '#1A202C', 
              padding: '12px', 
              borderRadius: '8px', 
              color: '#E2E8F0',
              minWidth: '200px',
              maxWidth: '300px',
              whiteSpace: 'normal',
              wordBreak: 'break-word',
              overflowWrap: 'break-word'
            }}>
              <p style={{ fontWeight: 'bold', fontSize: '16px', margin: '0 0 8px 0' }}>
                {cell.data.risk.factor}
              </p>
              <p style={{ fontSize: '14px', margin: '0' }}>
                <strong>Mitigation:</strong> {cell.data.risk.mitigation}
              </p>
            </div>
          ) : null
        )}
      />
    </div>
  );
};

export default RiskMatrix;