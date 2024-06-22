import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function intToString(value) {
  var suffixes = ["", "K", "M", "B", "T"];
  var suffixNum = Math.floor(("" + value).length / 3);
  var shortValue = parseFloat(
    (suffixNum != 0 ? value / Math.pow(1000, suffixNum) : value).toPrecision(2)
  );
  if (shortValue % 1 != 0) {
    shortValue = shortValue.toFixed(1);
  }
  return shortValue + suffixes[suffixNum];
}

const renderCustomBarLabel = ({ x, y, width, value }) => {
  return (
    <text
      style={{
        fontSize: "0.7vw",
        fontWeight: "bold",
        fill: "#fff",
        textAnchor: "middle",
        fontFamily: "Montserrat",
      }}
      x={x + width / 2}
      y={y + 30}
      fill="#666"
      textAnchor="middle"
      dy={-6}
    >
      {value > 100000 ? intToString(value) : value}
    </text>
  );
};

export default function BarChartComponent({ data }) {
  return (
    <ResponsiveContainer width="98%" height="70%">
      <BarChart data={data} margin={{ top: 0, left: 0, right: 15, bottom: 0 }}>
        <CartesianGrid
          stroke="#C7C7C7"
          strokeDasharray="4 4"
          vertical={false}
        />
        <Bar
          dataKey="value"
          fill="#488B8FCC"
          label={renderCustomBarLabel}
          radius={[4, 4, 0, 0]}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{
            fontSize: "0.7vw",
            fontFamily: "Montserrat",
            fontWeight: "bold",
            color: "#7C828A",
          }}
          tickCount={5}
          tickFormatter={(value) =>
            value > 100000 ? intToString(value) : value
          }
        />
        <XAxis
          dataKey="name"
          axisLine={false}
          tickLine={false}
          tick={{
            fontSize: "0.7vw",
            fontFamily: "Montserrat",
            fontWeight: "bold",
            color: "#4A4546",
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
