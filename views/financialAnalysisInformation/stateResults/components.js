import React, { useMemo } from "react";
import { Box, Typography, Divider, Skeleton } from "@mui/material";

import scrollSx from "@styles/scroll";
import { groups } from "@views/financialProfile/newFinancialStatement/libs/groups";

const money = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

const fmtMoney = (value) => money.format(Number(value || 0));
const fmtPercent = (value) =>
  Number.isFinite(value) ? `${value.toLocaleString("es-CO", { maximumFractionDigits: 1 })}%` : "—";

const variation = (current, previous) => {
  const curr = Number(current || 0);
  const prev = Number(previous || 0);
  if (!prev) return curr === 0 ? 0 : null;
  return ((curr - prev) / Math.abs(prev)) * 100;
};

const participation = (profile, value) => {
  const grossSales = Number(profile?.stateOfResult?.gross_sale || 0);
  if (!grossSales) return null;
  return (Number(value || 0) / Math.abs(grossSales)) * 100;
};

const stateGroups = groups.stateOfResult.subgroups;

const buildRows = (subgroups) =>
  subgroups.flatMap((subgroup) => [
    ...(subgroup.keys || []).map((item) => ({ ...item, isTotal: false })),
    ...(subgroup.total || []).map((item) => ({ ...item, isTotal: true })),
  ]);

const sections = [
  { title: "Ventas", rows: buildRows(stateGroups.slice(0, 2)) },
  { title: "Gastos", rows: buildRows(stateGroups.slice(2, 3)) },
  { title: "Ingresos y resultado", rows: buildRows(stateGroups.slice(3)) },
];

function EmptyState() {
  return (
    <Box sx={{ p: 3, border: "1px dashed #D7E0E2", borderRadius: 2, bgcolor: "#fff" }}>
      <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#53686D" }}>
        No hay estados financieros registrados para este cliente.
      </Typography>
    </Box>
  );
}

function BlockTable({ title, rows, profiles }) {
  const periodWidth = 330;
  const gridTemplateColumns = `250px ${profiles
    .map(() => `${periodWidth - 180}px 82px 82px`)
    .join(" ")}`;

  const headerSx = {
    fontSize: 11,
    fontWeight: 600,
    color: "#73858A",
    textAlign: "right",
    whiteSpace: "nowrap",
  };

  const cellSx = {
    px: 1,
    py: 0.85,
    fontSize: 11.5,
    color: "#536268",
    textAlign: "right",
    whiteSpace: "nowrap",
  };

  return (
    <Box sx={{ bgcolor: "#fff", border: "1px solid #E6ECEE", borderRadius: 2, mb: 2, overflow: "hidden" }}>
      <Typography sx={{ px: 1.5, pt: 1.3, pb: 0.8, fontSize: 13, fontWeight: 650, color: "#3F777B" }}>
        {title}
      </Typography>

      <Box sx={{ overflowX: "auto", WebkitOverflowScrolling: "touch", maxWidth: "100%" }}>
        <Box sx={{ minWidth: 250 + profiles.length * periodWidth }}>
          <Box sx={{ display: "grid", gridTemplateColumns, columnGap: 1, px: 1, alignItems: "end" }}>
            <Box />
            {profiles.map((profile) => (
              <React.Fragment key={`header-${profile.id}`}>
                <Typography sx={{ ...headerSx, color: "#4C686D", fontWeight: 700 }}>
                  {profile.dateRanges || profile.period || "Periodo"}
                </Typography>
                <Typography sx={headerSx}>Part.</Typography>
                <Typography sx={headerSx}>Var.</Typography>
              </React.Fragment>
            ))}
          </Box>
          <Divider sx={{ mt: 0.8 }} />

          {rows.map((row) => (
            <Box key={row.key}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns,
                  columnGap: 1,
                  alignItems: "center",
                  px: 1,
                  bgcolor: row.isTotal ? "#FAFCFC" : "#fff",
                }}
              >
                <Typography
                  sx={{
                    px: 1,
                    py: 0.85,
                    fontSize: 11.5,
                    fontWeight: row.isTotal ? 700 : 500,
                    color: row.isTotal ? "#405D62" : "#5C6D72",
                  }}
                >
                  {row.title}
                </Typography>

                {profiles.map((profile, index) => {
                  const value = Number(profile?.stateOfResult?.[row.key] || 0);
                  const previous = profiles[index + 1];
                  const previousValue = Number(previous?.stateOfResult?.[row.key] || 0);
                  const part = participation(profile, value);
                  const varValue = previous ? variation(value, previousValue) : null;

                  return (
                    <React.Fragment key={`${profile.id}-${row.key}`}>
                      <Typography sx={{ ...cellSx, fontWeight: row.isTotal ? 700 : 500 }}>
                        {fmtMoney(value)}
                      </Typography>
                      <Typography sx={{ ...cellSx, color: "#468E92" }}>{fmtPercent(part)}</Typography>
                      <Typography
                        sx={{
                          ...cellSx,
                          color:
                            varValue == null
                              ? "#9AA8AB"
                              : varValue >= 0
                              ? "#4E8A72"
                              : "#C46C6C",
                        }}
                      >
                        {fmtPercent(varValue)}
                      </Typography>
                    </React.Fragment>
                  );
                })}
              </Box>
              <Divider sx={{ opacity: row.isTotal ? 0.8 : 0.35 }} />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export const StateResultsComponent = ({ financialProfileData, loading = false }) => {
  const profiles = useMemo(() => {
    const rows = financialProfileData?.data?.financialProfiles;
    return Array.isArray(rows) ? rows : [];
  }, [financialProfileData]);

  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        <Skeleton height={36} width="30%" />
        <Skeleton variant="rounded" height={340} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        ...scrollSx,
        width: "100%",
        bgcolor: "#F7F9F9",
        borderRadius: 2,
        p: { xs: 1.25, md: 1.75 },
        boxSizing: "border-box",
      }}
    >
      <Box sx={{ mb: 1.5 }}>
        <Typography sx={{ fontSize: 14, fontWeight: 650, color: "#3F777B" }}>
          Estado de resultados
        </Typography>
        <Typography sx={{ fontSize: 11, color: "#8A999D", mt: 0.2 }}>
          Valores, participación sobre ventas brutas y variación frente al periodo anterior.
        </Typography>
      </Box>

      {!profiles.length ? (
        <EmptyState />
      ) : (
        sections.map((section) => (
          <BlockTable key={section.title} title={section.title} rows={section.rows} profiles={profiles} />
        ))
      )}
    </Box>
  );
};
