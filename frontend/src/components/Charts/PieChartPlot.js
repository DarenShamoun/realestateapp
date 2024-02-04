import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip" style={{ backgroundColor: '#6B7280', padding: '10px', border: '1px solid #ccc' }}>
        <p className="label">{label}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} style={{ color: entry.color }}>
            {`${entry.name}: $${entry.value?.toFixed(2)}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const renderCustomizedLabel = ({
  cx, cy, midAngle, innerRadius, outerRadius, percent, payload
}) => {
  const RADIAN = Math.PI / 180;
  const radius = 25 + innerRadius + (outerRadius - innerRadius);
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <>
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`$${payload.value.toFixed(0)}`}
      </text>
      <text x={x} y={y - 20} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    </>
  );
};

const PieChartPlot = ({ data, title }) => {
  const colors = ["#82ca9d", "#FA8072"];

  const defaultData = [
    { name: "Rent Paid", value: 20000 },
    { name: "Remaining Rent", value: 5000 }
  ];

  // Calculate the sum of values in the data
  const dataSum = data?.reduce((acc, item) => acc + item.value, 0);

  // Use default data if the original data is empty or sums to zero
  const chartData = data && data.length > 0 && dataSum > 0 ? data : defaultData;

  return (
    <>
      <h1 style={{ paddingLeft: '20px', paddingTop: '10px', color: 'white', fontWeight: 'bold' }}>{title}</h1> 
      <ResponsiveContainer width="100%" height="100%">
        <PieChart width={400} height={300} margin={{
            top: 10,
            right: 30,
            left: 30,
            bottom: 40,
          }}>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={85}
            fill="#8884d8"
            label={renderCustomizedLabel}
            >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Legend />
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </>
  );
}

export default PieChartPlot;
