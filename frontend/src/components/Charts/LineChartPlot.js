import React from 'react';
import { LineChart, XAxis, YAxis, Line, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip" style={{ backgroundColor: '#6B7280', padding: '10px', border: '1px solid #ccc' }}>
        <p className="label">{`${label}`}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} style={{ color: entry.color }}>
            {`${entry.name}: $${entry.value.toFixed(2)}`}
          </p>
        ))}
      </div>
    );
  }

  return null;
};

const yAxisTickFormatter = (value) => `$${value.toFixed(0)}`;

const LineChartPlot = ({ data, lineKeys, xAxisKey, title }) => {
  const defaultData = [
    {
      month: 'Jan',
      paid: 5000,
      organic: 4230
    },
    {
      month: 'Feb',
      paid: 7800,
      organic: 2900
    },
    {
      month: 'Mar',
      paid: 4700,
      organic: 2400
    },
    {
      month: 'Apr',
      paid: 9000,
      organic: 2600
    },
    {
      month: 'May',
      paid: 7000,
      organic: 3210
    }
  ];

  const defaultLineKeys = [
    { name: "Income", stroke: "#8884d8" },
    { name: "Expenses", stroke: "#82ca9d" }
  ];

  const chartData = data && data.length > 0 ? data : defaultData;
  const keys = lineKeys || defaultLineKeys;
  const xKey = xAxisKey || "monthYear";
  const titleText = title || "Line Chart";

  return (
    <>
      <h1 style={{ paddingLeft: '20px', paddingTop: '10px', color: 'white', fontWeight: 'bold' }}>{titleText}</h1> 
      <ResponsiveContainer width="90%" height="90%" >
        <LineChart
          data={chartData}
          margin={{
            top: 20,
            right: 5,
            left: 30,
            bottom: 5,
          }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} stroke="white" />
          <YAxis stroke="white" tickFormatter={yAxisTickFormatter} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {keys.map(key => (
            <Line key={key.name} type="monotone" dataKey={key.name} stroke={key.stroke} strokeWidth={2} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </>
  );
};

export default LineChartPlot;
