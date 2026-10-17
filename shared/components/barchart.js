import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Box, Typography } from "@mui/material";
import InsertChartOutlinedIcon from "@mui/icons-material/InsertChartOutlined";

function intToString(value) {
  if (typeof value !== "number" || !isFinite(value)) return "—";

  const suffixes = ["", "K", "M", "B", "T"];
  const absValue = Math.abs(value);

  if (absValue < 1000) return value.toString();

  const suffixIndex = Math.min(
    suffixes.length - 1,
    Math.floor(Math.log10(absValue) / 3)
  );
  const shortValue = value / Math.pow(1000, suffixIndex);

  return `${shortValue.toFixed(Math.abs(shortValue) >= 10 ? 0 : 1)}${suffixes[suffixIndex]}`;
}

function intToStringTooltip(value) {
  return `${value}`;
}

const renderCustomBarLabel = ({ x, y, width, value }) => {
  const labelColor = value >= 0 ? "#4E8A72" : "#C46C6C";
  const labelYOffset = value >= 0 ? -8 : 14;

  return (
    <text
      style={{
        fontSize: "11px",
        fontWeight: 600,
        fill: labelColor,
        textAnchor: "middle",
        fontFamily: "Montserrat",
      }}
      x={x + width / 2}
      y={y + labelYOffset}
    >
      {intToString(value)}
    </text>
  );
};

const EmptyChart = () => (
  <Box
    sx={{
      height: "100%",
      minHeight: 210,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 0.75,
      px: 2,
      textAlign: "center",
      border: "1px dashed #D9E2E4",
      borderRadius: 1.5,
      bgcolor: "#FCFDFD",
    }}
  >
    <InsertChartOutlinedIcon sx={{ fontSize: 30, color: "#AAB7BA" }} />
    <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#708186" }}>
      Sin datos para graficar
    </Typography>
    <Typography sx={{ fontSize: 10.5, color: "#9AA7AA", maxWidth: 220 }}>
      Los comparativos aparecerán cuando existan periodos financieros con información.
    </Typography>
  </Box>
);

export default function BarChartComponent({ data }) {
  const source = Array.isArray(data) ? data : [];
  const validData = source
    .filter((item) => item && item.name !== undefined && item.name !== null && item.name !== "")
    .map((item) => ({
      name: item.name,
      value: Number.isFinite(Number(item.value)) ? Number(item.value) : 0,
    }));

  const hasMeaningfulPeriod = validData.some((item) => {
    const name = String(item.name || "").trim().toLowerCase();
    return name && name !== "n/a" && name !== "no data" && name !== "undefined";
  });

  if (!validData.length || !hasMeaningfulPeriod) {
    return <EmptyChart />;
  }

  const maxVal = Math.max(...validData.map((item) => item.value));
  const minVal = Math.min(...validData.map((item) => item.value));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={validData}
        margin={{ top: 24, left: 4, right: 10, bottom: 12 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#E7ECEE" vertical={false} />
        <YAxis
          axisLine={false}
          tickLine={false}
          tickFormatter={intToString}
          domain={["auto", "auto"]}
          width={38}
          tick={{
            fontSize: 10.5,
            fontFamily: "Montserrat",
            fontWeight: 600,
            fill: "#7C8A8E",
          }}
        />
        <XAxis
          dataKey="name"
          axisLine={false}
          tickLine={false}
          tick={{
            fontSize: 10.5,
            fontFamily: "Montserrat",
            fontWeight: 600,
            fill: "#4A5B60",
          }}
        />
        <Tooltip
          formatter={intToStringTooltip}
          cursor={{ fill: "rgba(72, 139, 143, 0.06)" }}
          contentStyle={{
            fontFamily: "Montserrat",
            fontSize: 11,
            backgroundColor: "#FFFFFF",
            border: "1px solid #DDE5E6",
            borderRadius: 8,
            boxShadow: "0 6px 16px rgba(34, 61, 66, .08)",
          }}
        />
        <Bar dataKey="value" radius={[5, 5, 0, 0]} label={renderCustomBarLabel}>
          {validData.map((entry) => {
            const adjustedMaxVal = maxVal > 0 ? maxVal : 1;
            const adjustedMinVal = minVal < 0 ? minVal : -1;

            const positiveOpacity = entry.value >= 0
              ? 0.6 + (entry.value / adjustedMaxVal) * 0.4
              : 0;
            const negativeOpacity = entry.value < 0
              ? 0.6 + (Math.abs(entry.value) / Math.abs(adjustedMinVal)) * 0.4
              : 0;

            const finalPositiveOpacity = Math.min(1, Math.max(0.6, positiveOpacity));
            const finalNegativeOpacity = Math.min(1, Math.max(0.6, negativeOpacity));

            const fillColor =
              entry.value > 0
                ? `rgba(72, 139, 143, ${finalPositiveOpacity})`
                : entry.value < 0
                ? `rgba(196, 108, 108, ${finalNegativeOpacity})`
                : "rgba(188, 202, 205, 0.75)";

            return <Cell key={`cell-${entry.name}`} fill={fillColor} />;
          })}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
