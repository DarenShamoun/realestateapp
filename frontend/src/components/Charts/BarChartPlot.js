import { BarChart, XAxis, YAxis, Bar, Tooltip, Legend, ResponsiveContainer } from "recharts";

const BarChartPlot = ({ data }) => {
  const chartData = data && data.length > 0 ? data : [
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

  return (
    <>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart width={730} height={250} data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Payment" fill="#82ca9d" />
          <Bar dataKey="Balance" fill="#FA8072" />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
}

export default BarChartPlot;
  