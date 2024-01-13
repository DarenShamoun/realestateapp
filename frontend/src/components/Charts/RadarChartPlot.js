import { RadarChart, Radar, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Legend, Tooltip, ResponsiveContainer } from "recharts";

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

const RadarChartPlot = ({ data, keys, title }) => {
  // Default data if no props are provided
  const defaultData = [
    { property: 'Default Property 1', income: 4000, expenses: 2500 },
    { property: 'Default Property 2', income: 3000, expenses: 2000 },
    { property: 'Default Property 3', income: 2000, expenses: 1000},
    { property: 'Default Property 4', income: 2780, expenses: 3908 },
    { property: 'Default Property 5', income: 1890, expenses: 4800 },
    { property: 'Default Property 6', income: 2390, expenses: 3800 }
  ];

  // Default keys for radar areas
  const defaultKeys = [
    { key: 'income', color: '#82ca9d', fill: '#82ca9d'},
    { key: 'expenses', color: '#8884d8', fill: '#8884d8'}
  ];

  const chartData = data && data.length > 0 ? data : defaultData;
  const chartKeys = keys || defaultKeys;
  const titleText = title || "Radar Chart";

  return (
    <>
      <h1 style={{ paddingLeft: '20px', paddingTop: '10px', color: 'white', fontWeight: 'bold' }}>{titleText}</h1> 
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart width={730} height={400} outerRadius="80%" data={chartData}
          margin={{
            top: 10,
            right: 30,
            left: 30,
            bottom: 40,
          }}>
          <PolarGrid />
          <PolarAngleAxis dataKey="property" />
          <PolarRadiusAxis angle={30} domain={[0, Math.max(...chartData.map(d => Math.max(d.income, d.expenses)))]} />
          {chartKeys.map((key) => (
            <Radar
              key={key.key}
              name={key.key.charAt(0).toUpperCase() + key.key.slice(1)}
              dataKey={key.key}
              stroke={key.color}
              fill={key.fill}
              fillOpacity={0.6}
            />
          ))}
          <Legend />
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>
    </>
  );
};

export default RadarChartPlot;
