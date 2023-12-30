import React from 'react';
import { BarChart, XAxis, YAxis, Bar, Tooltip, Legend, ResponsiveContainer } from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip" style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc' }}>
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

const BarChartPlot = ({ data, barKeys, xAxisKey }) => {
  const defaultData = [
    {
        name: "Jan",
        Payment: 4000,
        Balance: 2400
    },
    {
        name: "Feb",
        Payment: 5000,
        Balance: 1500
    },
    {
        name: "Mar",
        Payment: 6000,
        Balance: 3000
    },
    {
        name: "Apr",
        Payment: 6500,
        Balance: 4500
    },
    {
        name: "May",
        Payment: 7000,
        Balance: 2200
    },
    {
        name: "Jun",
        Payment: 8000,
        Balance: 3500
    },
    {
        name: "Jul",
        Payment: 7400,
        Balance: 5500
    },
  ];


  const defaultBarKeys = [
    { name: "Payment", color: "#82ca9d" },
    { name: "Balance", color: "#FA8072" }
  ];

  const chartData = data && data.length > 0 ? data : defaultData;
  const keys = barKeys || defaultBarKeys;

  return (
    <>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart width={730} height={250} data={chartData}>
          <XAxis dataKey={xAxisKey || "name"} />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {keys.map(key => (
            <Bar key={key.name} dataKey={key.name} fill={key.color} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </>
  );
}

export default BarChartPlot;
