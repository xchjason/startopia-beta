import React from 'react';
import { ResponsiveContainer, Tooltip } from 'recharts';
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
                  <div className="custom-tooltip bg-white p-2 border border-gray-300 rounded">
                    <p>{`${name}: ${size}%`}</p>
                  </div>
                );
              }
              return null;
            }}
          />
        </Treemap>
      </ResponsiveContainer>
    </div>
  );
};

export default ConsumerSegments;