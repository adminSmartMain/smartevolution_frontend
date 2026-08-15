import React, { useMemo, useState } from "react";
import { Box, Tabs, Tab, Typography, Divider } from "@mui/material";

// Si ya tienes estos estilos en tu proyecto, usa los tuyos:
import InputTitles from "@styles/inputTitles";
import scrollSx from "@styles/scroll";

/**
 * ========= Helpers de formato =========
 */
const currency = new Intl.NumberFormat("en-EN", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

const percent0 = new Intl.NumberFormat("en-EN", {
  style: "percent",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const fmtMoney = (n) => currency.format(Number(n || 0));
const fmtPart = (n) => percent0.format(Number(n || 0) / 100);

/**
 * Var (%) = (nuevo - viejo) / viejo
 * Si viejo == 0 => si nuevo==0 => 0, si no => 1 (100%) (o maneja como quieras)
 */
const calcVar = (current, prev) => {
  const c = Number(current || 0);
  const p = Number(prev || 0);
  if (p === 0) return c === 0 ? 0 : 1;
  return (c - p) / p;
};

const fmtVar = (v) => percent0.format(v);

/**
 * ========= Componente: Tabla por bloque =========
 * Layout:
 *  - Col 1: Nombre
 *  - Año 2022: Valor + Part
 *  - Año 2023: Valor + Part + Var (la var va alineada al grupo 2023 en el screenshot)
 *  - Año 2024: Valor + Part + Var (si quieres otro var también, pero aquí lo dejamos solo a la derecha)
 *
 * Para que se parezca al screenshot, hacemos:
 *  - 2022: Valor + Part
 *  - 2023: Valor + Part + Var (Var comparando 2023 vs 2022)
 *  - 2024: Valor + Part + Var (Var comparando 2024 vs 2023)
 *
 * Si tú solo quieres Var 2024 vs 2023, deja el de 2023 vacío.
 */
function BlockTable({ title, rows, y2022, y2023, y2024 }) {
  const headerCellSx = {
    fontSize: "0.75vw",
    fontWeight: 700,
    color: "#666",
    textAlign: "right",
    whiteSpace: "nowrap",
  };

  const nameSx = {
    fontSize: "0.8vw",
    fontWeight: 500,
    color: "#333",
  };

  const valueSx = {
    fontSize: "0.8vw",
    fontWeight: 400,
    color: "#333",
    textAlign: "right",
    whiteSpace: "nowrap",
  };

  const partSx = (color) => ({
    fontSize: "0.75vw",
    fontWeight: 600,
    color: color,
    textAlign: "right",
    whiteSpace: "nowrap",
  });

  const varSx = (v) => ({
    fontSize: "0.75vw",
    fontWeight: 700,
    textAlign: "right",
    whiteSpace: "nowrap",
    color: v >= 0 ? "#1B8E4B" : "#D14343", // verde/rojo
  });

  return (
    <Box sx={{ backgroundColor: "#fff", borderRadius: "8px", p: 2, mb: 2 }}>
      {/* Título del bloque (Ventas/Gastos/Ingresos) */}
      <Typography
        sx={{
          fontSize: "0.95vw",
          fontWeight: 700,
          color: "#0E7C7B",
          mb: 1,
        }}
      >
        {title}
      </Typography>

      {/* Header de columnas */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "260px 1fr 90px 1fr 90px 90px 1fr 90px 90px",
          columnGap: 2,
          alignItems: "center",
          px: 1,
        }}
      >
        <Box /> {/* nombre */}
        <Typography sx={headerCellSx}>{y2022}</Typography>
        <Typography sx={headerCellSx}>Part</Typography>

        <Typography sx={headerCellSx}>{y2023}</Typography>
        <Typography sx={headerCellSx}>Part</Typography>
        <Typography sx={headerCellSx}>Var</Typography>

        <Typography sx={headerCellSx}>{y2024}</Typography>
        <Typography sx={headerCellSx}>Part</Typography>
        <Typography sx={headerCellSx}>Var</Typography>
      </Box>

      <Divider sx={{ my: 1, opacity: 0.7 }} />

      {/* Filas */}
      {rows.map((r, idx) => {
        const v22 = r.values?.[y2022]?.value ?? 0;
        const p22 = r.values?.[y2022]?.part ?? 0;

        const v23 = r.values?.[y2023]?.value ?? 0;
        const p23 = r.values?.[y2023]?.part ?? 0;

        const v24 = r.values?.[y2024]?.value ?? 0;
        const p24 = r.values?.[y2024]?.part ?? 0;

        const var23 = calcVar(v23, v22);
        const var24 = calcVar(v24, v23);

        // líneas separadoras como el screenshot (más marcadas en totales)
        const isTotal = Boolean(r.isTotal);

        return (
          <Box key={`${r.name}-${idx}`}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns:
                  "260px 1fr 90px 1fr 90px 90px 1fr 90px 90px",
                columnGap: 2,
                alignItems: "center",
                px: 1,
                py: 0.8,
              }}
            >
              <Typography sx={{ ...nameSx, fontWeight: isTotal ? 800 : 500 }}>
                {r.name}
              </Typography>

              {/* 2022 */}
              <Typography sx={{ ...valueSx, fontWeight: isTotal ? 800 : 400 }}>
                {fmtMoney(v22)}
              </Typography>
              <Typography sx={partSx("#1B8E4B")}>{fmtPart(p22)}</Typography>

              {/* 2023 */}
              <Typography sx={{ ...valueSx, fontWeight: isTotal ? 800 : 400 }}>
                {fmtMoney(v23)}
              </Typography>
              <Typography sx={partSx("#1B8E4B")}>{fmtPart(p23)}</Typography>
              <Typography sx={varSx(var23)}>{fmtVar(var23)}</Typography>

              {/* 2024 */}
              <Typography sx={{ ...valueSx, fontWeight: isTotal ? 800 : 400 }}>
                {fmtMoney(v24)}
              </Typography>
              <Typography sx={partSx("#1B8E4B")}>{fmtPart(p24)}</Typography>
              <Typography sx={varSx(var24)}>{fmtVar(var24)}</Typography>
            </Box>

            {isTotal ? (
              <Divider sx={{ my: 1, opacity: 0.9 }} />
            ) : (
              <Divider sx={{ opacity: 0.25 }} />
            )}
          </Box>
        );
      })}
    </Box>
  );
}

/**
 * ========= Componente principal =========
 */
export const StateResultsComponent = () => {
  // Tabs (maqueta)
  const tabs = useMemo(
    () => [
      { label: "Ene – Dic 2022", key: "2022" },
      { label: "Ene – Dic 2023", key: "2023" },
      { label: "Ene – Dic 2024", key: "2024" },
    ],
    []
  );

  const [tab, setTab] = useState(2); // por defecto 2024

  // Años que pintamos en columnas (siempre 2022-2024 como screenshot)
  const y2022 = "2022";
  const y2023 = "2023";
  const y2024 = "2024";

  // ======= DATA FALSA (solo maqueta) =======
  const fake = useMemo(() => {
    return {
      ventas: [
        {
          name: "Ventas Brutas",
          values: {
            2022: { value: 10000, part: 10 },
            2023: { value: 50000000, part: 50 },
            2024: { value: 5000, part: 0 },
          },
        },
        {
          name: "Dtos y Devoluciones",
          values: {
            2022: { value: 10000, part: 10 },
            2023: { value: 35000000, part: 35 },
            2024: { value: 30000, part: 0 },
          },
        },
        {
          name: "Otras cuentas por cobrar",
          values: {
            2022: { value: 10000, part: 10 },
            2023: { value: 4000000, part: 4 },
            2024: { value: 20000, part: 0 },
          },
        },
        {
          name: "Ventas Netas",
          isTotal: true,
          values: {
            2022: { value: 30000, part: 30 },
            2023: { value: 51000000, part: 50 },
            2024: { value: 51999, part: 0 },
          },
        },
        {
          name: "Costos de Ventas",
          values: {
            2022: { value: 10000, part: 10 },
            2023: { value: 4500000, part: 0 },
            2024: { value: 4500000, part: 1 },
          },
        },
        {
          name: "Utilidad Bruta",
          isTotal: true,
          values: {
            2022: { value: 10000, part: 10 },
            2023: { value: 101007500, part: 100 },
            2024: { value: 344956067, part: 100 },
          },
        },
      ],
      gastos: [
        {
          name: "Gastos administración y ventas",
          values: {
            2022: { value: 10000, part: 10 },
            2023: { value: 40000, part: 0 },
            2024: { value: 5000, part: 0 },
          },
        },
        {
          name: "Dep y Amortización",
          values: {
            2022: { value: 10000, part: 10 },
            2023: { value: 400000, part: 0 },
            2024: { value: 30000, part: 0 },
          },
        },
        {
          name: "Total Utilidad Operativa",
          isTotal: true,
          values: {
            2022: { value: 80000, part: 80 },
            2023: { value: 722500, part: 100 },
            2024: { value: 344956067, part: 100 },
          },
        },
      ],
      ingresos: [
        {
          name: "Ingresos Financieros",
          values: {
            2022: { value: 10000, part: 10 },
            2023: { value: 40000, part: 0 },
            2024: { value: 5000, part: 0 },
          },
        },
        {
          name: "Otros Ingresos",
          values: {
            2022: { value: 10000, part: 10 },
            2023: { value: 400000, part: 0 },
            2024: { value: 30000, part: 0 },
          },
        },
        {
          name: "Gastos Financieros",
          values: {
            2022: { value: 10000, part: 10 },
            2023: { value: 120000, part: 0 },
            2024: { value: 1999, part: 0 },
          },
        },
        {
          name: "Otros Egresos",
          values: {
            2022: { value: 10000, part: 10 },
            2023: { value: 4000000, part: 0 },
            2024: { value: 20000, part: 0 },
          },
        },
        {
          name: "Utilidad Neta antes de Imp.",
          isTotal: true,
          values: {
            2022: { value: 40000, part: 40 },
            2023: { value: 0, part: 0 },
            2024: { value: 0, part: 0 },
          },
        },
      ],
    };
  }, []);

  // Nota: tab solo es visual por ahora (maqueta). Si quieres, filtramos/ocultamos columnas según tab.
  return (
    <Box
      sx={{
        ...scrollSx,
        width: "100%",
        backgroundColor: "#F3F3F5",
        borderRadius: "8px",
        padding: "14px 16px 22px 16px",
        paddingRight: "42px",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        <Typography
          sx={{
            fontSize: "1.2vw",
            fontWeight: 800,
            color: "#0E7C7B",
            flex: 1,
          }}
        >
          Resultados
        </Typography>

        {/* Tabs tipo “chips” como la foto */}
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{
            minHeight: "auto",
            "& .MuiTabs-indicator": { display: "none" },
          }}
        >
          {tabs.map((t) => (
            <Tab
              key={t.key}
              label={t.label}
              sx={{
                textTransform: "none",
                minHeight: "auto",
                px: 2,
                py: 0.8,
                borderRadius: "6px",
                mx: 0.5,
                fontSize: "0.8vw",
                fontWeight: 700,
                color: tab === tabs.findIndex((x) => x.key === t.key) ? "#fff" : "#0E7C7B",
                backgroundColor:
                  tab === tabs.findIndex((x) => x.key === t.key) ? "#0E7C7B" : "transparent",
                border: "1px solid #0E7C7B",
              }}
            />
          ))}
        </Tabs>
      </Box>

      {/* Bloques */}
      <BlockTable title="Ventas" rows={fake.ventas} y2022={y2022} y2023={y2023} y2024={y2024} />
      <BlockTable title="Gastos" rows={fake.gastos} y2022={y2022} y2023={y2023} y2024={y2024} />
      <BlockTable title="Ingresos" rows={fake.ingresos} y2022={y2022} y2023={y2023} y2024={y2024} />
    </Box>
  );
};