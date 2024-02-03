import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

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

const AreaChartPlot = ({ data, areaKeys, xAxisKey, title }) => {
  const defaultData = [
    {
      "year": "2016",
      "expenses": 4000,
      "profit": 2400
    },
    {
      "year": "2017",
      "expenses": 3000,
      "profit": 1398
    },
    {
      "year": "2018",
      "expenses": 2000,
      "profit": 9800
    },
    {
      "year": "2019",
      "expenses": 2780,
      "profit": 3908
    },
    {
      "year": "2020",
      "expenses": 1890,
      "profit": 4800
    },
    {
      "year": "2021",
      "expenses": 2390,
      "profit": 3800
    },
    {
      "year": "2022",
      "expenses": 3490,
      "profit": 4300
    }
  ];

  const chartData = data && data.length > 0 ? data : defaultData;
  const defaultAreaKeys = [
    { name: "profit", color: "#82ca9d", fill: "#82ca9d" },
    { name: "expenses", color: "#8884d8", fill: "#8884d8" }
  ];

  const keys = areaKeys || defaultAreaKeys;
  const xKey = xAxisKey || "year";
  const titleText = title || "Area Chart";

  return (
    <>
      <h1 style={{ paddingLeft: '20px', paddingTop: '10px', color: 'white', fontWeight: 'bold' }}>{titleText}</h1>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart width={730} height={250} data={chartData}
          margin={{ top: 30, right: 40, left: 30, bottom: 40 }}>
          <defs>
            {keys.map((key, index) => (
              <linearGradient key={index} id={`color${key.name}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={key.color} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={key.color} stopOpacity={0}/>
              </linearGradient>
            ))}
          </defs>
          <XAxis dataKey={xKey} stroke="white" />
          <YAxis stroke="white" tickFormatter={yAxisTickFormatter} />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {keys.map(key => (
            <Area 
              key={key.name} 
              type="monotone" 
              dataKey={key.name} 
              stroke={key.color} 
              fillOpacity={0.4}
              fill={`url(#color${key.name})`} 
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </>
  );
}

export default AreaChartPlot;
