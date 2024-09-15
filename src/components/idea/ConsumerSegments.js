import React from 'react';
import { ResponsiveContainer, Tooltip, LabelList } from 'recharts';
import { Treemap } from 'recharts/lib/chart/Treemap';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const ConsumerSegments = ({ segments }) => {
  const data = segments.map((segment, index) => ({
    name: segment.name,
    size: segment.percentage,
    fill: COLORS[index % COLORS.length],
  }));

  return (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <Treemap
          data={data}
          dataKey="size"
          aspectRatio={4 / 3}
          stroke="#fff"
          fill="#8884d8"
        >
          <Tooltip
            content={({ payload }) => {
              if (payload && payload.length > 0) {
                const { name, size } = payload[0].payload;
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
                      <strong>Percentage:</strong> {size}%
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <LabelList dataKey="name" position="inside" fill="#fff" />
        </Treemap>
      </ResponsiveContainer>
    </div>
  );
};

export default ConsumerSegments;