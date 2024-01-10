import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

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

const PieChartPlot = ({ data, pieKeys, title }) => {
  const colors = ["#82ca9d", "#FA8072"];

  const defaultData = [
    { name: "Rent Paid", value: 20000 },
    { name: "Remaining Rent", value: 5000 }
  ];

  const defaultPieKeys = [
    { name: "Payment", color: "#82ca9d" },
    { name: "Balance", color: "#FA8072" }
  ];

  const chartData = data && data.length > 0 ? data : defaultData;
  const keys = pieKeys || defaultPieKeys;

  return (
    <>
      <h1 style={{ paddingLeft: '20px', paddingTop: '10px', color: 'white', fontWeight: 'bold' }}>{title}</h1> 
      <ResponsiveContainer width="100%" height="100%">
        <PieChart width={730} height={250} margin={{
            top: 30,
            right: 30,
            left: 10,
            bottom: 40,
          }}>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label
            >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </>
  );
}

export default PieChartPlot;
