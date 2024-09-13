import React from 'react';
import ReactApexChart from 'react-apexcharts';

const ScoreChart = ({ scores }) => {
  const categories = Object.entries(scores)
    .filter(([name]) => !name.endsWith('_explanation'))
    .map(([name]) => name);

  const seriesData = Object.entries(scores)
    .filter(([name]) => !name.endsWith('_explanation'))
    .map(([name, value]) => value);

  const explanations = Object.entries(scores)
    .filter(([name]) => name.endsWith('_explanation'))
    .reduce((acc, [name, value]) => {
      const key = name.replace('_explanation', '');
      acc[key] = value;
      return acc;
    }, {});

  const options = {
    chart: {
      type: 'radar',
      background: 'transparent',
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      categories: categories,
      labels: {
        style: {
          colors: '#FFFFFF',
          fontSize: '14px', // Increased font size
        },
      },
    },
    yaxis: {
      min: 0,
      max: 10,
      tickAmount: 0,
      labels: {
        formatter: function(val, i) {
          if (i % 2 === 0) {
            return val.toFixed(0);
          } else {
            return '';
          }
        },
        style: {
          colors: 'transparent',
          fontSize: '1px',
        },
      },
    },
    plotOptions: {
      radar: {
        size: 140,
        polygons: {
          strokeColor: '#4A5568', // Less prominent grid lines
          fill: {
            colors: ['#1f2937', '#111827'],
          },
          connectorColors: '#4A5568', // Subtle connector lines
        },
      },
    },
    stroke: {
      width: 2,
      colors: ['#4299e1'], // Keeping the line color blue
    },
    fill: {
      opacity: 0.5,
    },
    markers: {
      size: 4,
      colors: ['#FFFF00'], // Changed to yellow
      strokeColor: '#FFFF00', // Changed to yellow
      strokeWidth: 2,
    },
    tooltip: {
      theme: 'dark',
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        const category = w.globals.labels[dataPointIndex];
        const score = series[seriesIndex][dataPointIndex];
        const explanation = explanations[category];
        return (
          '<div style="min-width: 200px; max-width: 300px; padding: 12px; background-color: #1A202C; color: #E2E8F0; border-radius: 8px; white-space: normal; word-break: break-word; overflow-wrap: break-word;">' +
          '<p style="font-weight: bold; font-size: 16px; margin: 0 0 8px 0;">' +
          category +
          '</p>' +
          '<p style="margin: 0 0 8px 0;"><strong>Score:</strong> ' +
          score +
          '</p>' +
          '<p style="font-size: 14px; margin: 0;">' +
          explanation +
          '</p>' +
          '</div>'
        );
      },
    },
  };

  const series = [
    {
      name: 'Score',
      data: seriesData,
    },
  ];

  return <ReactApexChart options={options} series={series} type="radar" height={350} />;
};

export default ScoreChart;