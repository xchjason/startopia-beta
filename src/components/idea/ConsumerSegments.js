import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const ConsumerSegments = ({ segments }) => {
  const data = segments.map((segment) => ({
    name: segment.name,
    value: segment.percentage,
  }));

  return (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius="80%"
            label={({ name }) => `${name}`}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            content={({ payload }) => {
              if (payload && payload.length > 0) {
                const { name, value } = payload[0];
                return (
                  <div style={{
                    minWidth: '200px',
                    maxWidth: '300px',
                    padding: '12px',
                    backgroundColor: '#1A202C',
                    color: '#E2E8F0',
                    borderRadius: '8px',
                    whiteSpace: 'normal',
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word'
                  }}>
                    <p style={{
                      fontWeight: 'bold',
                      fontSize: '16px',
                      margin: '0 0 8px 0'
                    }}>{name}</p>
                    <p style={{ margin: '0' }}>
                      <strong>Percentage:</strong> {value}%
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ConsumerSegments;