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

function intToString(value) {
  // Verificar que el valor sea un número válido
  if (typeof value !== "number" || !isFinite(value)) {
    return "Invalid input"; // Manejo de errores para valores no válidos
  }

  const suffixes = ["", "K", "M", "B", "T"];
  const absValue = Math.abs(value);

  if (absValue < 1000) {
    // Si el valor es menor que 1000, no usar sufijo
    return value.toString();
  }

  const suffixIndex = Math.floor(Math.log10(absValue) / 3); // Determinar el índice del sufijo
  const shortValue = value / Math.pow(1000, suffixIndex);

  return `${shortValue.toFixed(shortValue >= 10 ? 0 : 1)}${suffixes[suffixIndex]}`;
}



function intToStringTooltip(value) {
  //const suffixes = ["", "K", "M", "B", "T"];
  const suffixNum = Math.floor(("" + Math.abs(value)).length / 3);
  //const shortValue = parseFloat(
   // (suffixNum !== 0 ? value / Math.pow(1000, suffixNum) : value).toPrecision(2)
 // );
  return `${value}`;
}

const renderCustomBarLabel = ({ x, y, width, value }) => {
  const labelColor = value >= 0 ? "#2ECC71" : "#E74C3C"; // Positivo: verde, Negativo: rojo
  const labelYOffset = value >= 0 ? -10 : 15; // Positivo encima, negativo debajo
  return (
    <text
      style={{
        fontSize: "0.85vw",
        fontWeight: "bold",
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

export default function BarChartComponent({ data }) {
  const maxVal = Math.max(...data.map((d) => d.value));
  const minVal = Math.min(...data.map((d) => d.value));

  return (
    <ResponsiveContainer width="100%" height="70%">
      <BarChart
        data={data}
        margin={{ top: 20, left: 20, right: 20, bottom: 20 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#E0E0E0"
          vertical={false}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tickFormatter={(value) => intToString(value)}
          domain={["auto", "auto"]}
          tick={{
            fontSize: "0.85vw",
            fontFamily: "Montserrat",
            fontWeight: "bold",
            fill: "#7C828A",
          }}
        />
        <XAxis
          dataKey="name"
          axisLine={false}
          tickLine={false}
          tick={{
            fontSize: "0.85vw",
            fontFamily: "Montserrat",
            fontWeight: "bold",
            fill: "#4A4546",
          }}
        />
        <Tooltip
          formatter={(value) =>  intToStringTooltip(value)}
          cursor={{ fill: "rgba(200, 200, 200, 0.3)" }}
          contentStyle={{
            fontFamily: "Montserrat",
            fontSize: "0.85vw",
            backgroundColor: "#FFFFFF",
            border: "1px solid #DDDDDD",
          }}
        />
        <Bar
  dataKey="value"
  radius={[6, 6, 0, 0]}
  label={renderCustomBarLabel}
>
  {data.map((entry) => {
    // Aseguramos valores de maxVal y minVal
    const adjustedMaxVal = maxVal > 0 ? maxVal : 1; // Evitar divisiones por 0 o valores negativos
    const adjustedMinVal = minVal < 0 ? minVal : -1;

    // Calcula la opacidad para valores positivos y negativos
    const positiveOpacity = entry.value >= 0 
      ? 0.6 + (entry.value / adjustedMaxVal) * 0.4
      : 0;
    const negativeOpacity = entry.value < 0
      ? 0.6 + (Math.abs(entry.value) / Math.abs(adjustedMinVal)) * 0.4
      : 0;

    // Garantizar que la opacidad siempre esté en el rango 0.6 - 1
    const finalPositiveOpacity = Math.min(1, Math.max(0.6, positiveOpacity));
    const finalNegativeOpacity = Math.min(1, Math.max(0.6, negativeOpacity));

    // Asigna colores claros por defecto si los valores son demasiado pequeños
    const fillColor =
      entry.value > 0
        ? `rgba(72, 139, 143, ${finalPositiveOpacity})` // Verde para valores positivos
        : entry.value < 0
        ? `rgba(218, 68, 83, ${finalNegativeOpacity})` // Rojo para valores negativos
        : "rgba(200, 200, 200, 0.8)"; // Gris claro para valores exactamente 0

    return <Cell key={`cell-${entry.name}`} fill={fillColor} />;
  })}
</Bar>

      </BarChart>
    </ResponsiveContainer>
  );
}
