import { ResponsiveRadar } from '@nivo/radar';

const ScoreChart = ({ scores }) => {
  const data = Object.entries(scores)
    .filter(([name]) => !name.endsWith('_explanation'))
    .map(([name, value]) => ({
      criteria: name,
      score: value,
      explanation: scores[`${name}_explanation`] || 'No explanation provided.',
    }));

  return (
    <div style={{ height: 400 }}>
      <ResponsiveRadar
        data={data}
        keys={['score']}
        indexBy="criteria"
        maxValue={10}
        margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
        curve="linearClosed"
        borderWidth={2}
        borderColor={{ from: 'color' }}
        gridLevels={5}
        gridShape="circular"
        gridLabelOffset={36}
        enableDots={true}
        dotSize={10}
        dotColor={{ theme: 'background' }}
        dotBorderWidth={2}
        dotBorderColor={{ from: 'color' }}
        enableDotLabel={true}
        dotLabel="value"
        dotLabelYOffset={-12}
        colors={{ scheme: 'nivo' }}
        fillOpacity={0.25}
        blendMode="multiply"
        animate={true}
        isInteractive={true}
        tooltip={({ indexValue, data }) => (
          <div className="bg-dark-800 p-2 rounded shadow max-w-xs">
            <p className="font-semibold">{indexValue}</p>
            <p>Score: {data.score}</p>
            <p className="text-sm">{data.explanation}</p>
          </div>
        )}
        theme={{
          background: '#1a202c',
          textColor: '#cbd5e0',
          grid: {
            line: {
              stroke: '#2d3748',
            },
          },
          tooltip: {
            container: {
              background: '#2d3748',
              color: '#e2e8f0',
            },
          },
        }}
      />
    </div>
  );
};