import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip" style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc' }}>
        <p>{`${payload[0].name}: $${payload[0].value.toFixed(2)}`}</p>
      </div>
    );
  }
  return null;
};

const PieChartPlot = ({ data }) => {
  const colors = ["#82ca9d", "#FA8072"];

  const defaultData = [
    { name: "Rent Paid", value: 20000 },
    { name: "Remaining Rent", value: 5000 }
  ];

  const chartData = data && data.length > 0 ? data : defaultData;

  return (
    <>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart width={730} height={250}>
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
