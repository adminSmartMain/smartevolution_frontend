import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Divider,
  IconButton,
  Skeleton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

import InputTitles from "@styles/inputTitles";
import scrollSx from "@styles/scroll";
import { groups } from "@views/financialProfile/newFinancialStatement/libs/groups";

const formatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

const fmtMoney = (value) => formatter.format(Number(value || 0));
const fmtPercent = (value) =>
  Number.isFinite(value)
    ? `${value.toLocaleString("es-CO", { maximumFractionDigits: 1 })}%`
    : "—";

const variation = (current, previous) => {
  const curr = Number(current || 0);
  const prev = Number(previous || 0);
  if (!prev) return curr === 0 ? 0 : null;
  return ((curr - prev) / Math.abs(prev)) * 100;
};

const participation = (profile, value) => {
  // Mantiene el contrato de la vista financiera anterior: el análisis vertical
  // de activos, pasivos y patrimonio se expresa sobre el total de activos.
  const denominator = Number(profile?.assets?.total_assets || 0);
  if (!denominator) return null;
  return (Number(value || 0) / Math.abs(denominator)) * 100;
};

const flattenRows = (groupKey) =>
  groups[groupKey].subgroups.flatMap((subgroup) => [
    ...(subgroup.keys || []).map((item) => ({ ...item, isTotal: false })),
    ...(subgroup.total || []).map((item) => ({ ...item, isTotal: true })),
  ]);

const sections = [
  { key: "assets", title: "Activos", rows: flattenRows("assets") },
  { key: "passives", title: "Pasivos", rows: flattenRows("passives") },
  { key: "patrimony", title: "Patrimonio", rows: flattenRows("patrimony") },
];

const documentFields = [
  ["balance", "Balance"],
  ["stateOfCashflow", "Estado de flujo de efectivo"],
  ["financialStatementAudit", "Dictamen de estados financieros"],
  ["managementReport", "Informe de gestión"],
  ["certificateOfStockOwnership", "Certificado de composición accionaria"],
  ["rentDeclaration", "Declaración de renta"],
];

function EmptyState({ title, subtitle }) {
  return (
    <Box sx={{ p: 3, bgcolor: "#fff", border: "1px dashed #D7E0E2", borderRadius: 2 }}>
      <Typography sx={{ fontSize: 13, fontWeight: 650, color: "#53686D" }}>{title}</Typography>
      {subtitle ? (
        <Typography sx={{ fontSize: 11, color: "#8A999D", mt: 0.4 }}>{subtitle}</Typography>
      ) : null}
    </Box>
  );
}

function FinancialRows({ profiles, section }) {
  const periodWidth = 330;
  const gridTemplateColumns = `250px ${profiles
    .map(() => `${periodWidth - 180}px 82px 82px`)
    .join(" ")} 46px`;

  return (
    <>
      <Box sx={{ px: 1.5, pt: 1.25, pb: 0.7 }}>
        <InputTitles>{section.title}</InputTitles>
      </Box>

      {section.rows.map((row) => (
        <React.Fragment key={`${section.key}-${row.key}`}>
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
                color: row.isTotal ? "#405D62" : "#5C6D72",
                fontWeight: row.isTotal ? 700 : 500,
              }}
            >
              {row.title}
            </Typography>

            {profiles.map((profile, index) => {
              const value = Number(profile?.[section.key]?.[row.key] || 0);
              const previous = profiles[index + 1];
              const previousValue = Number(previous?.[section.key]?.[row.key] || 0);
              const part = participation(profile, value);
              const varValue = previous ? variation(value, previousValue) : null;

              return (
                <React.Fragment key={`${profile.id}-${section.key}-${row.key}`}>
                  <Typography sx={{ fontSize: 11.5, color: "#536268", textAlign: "right", whiteSpace: "nowrap" }}>
                    {fmtMoney(value)}
                  </Typography>
                  <Typography sx={{ fontSize: 11, color: "#468E92", textAlign: "right" }}>
                    {fmtPercent(part)}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 11,
                      textAlign: "right",
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
            <Box />
          </Box>
          <Divider sx={{ opacity: row.isTotal ? 0.8 : 0.35 }} />
        </React.Fragment>
      ))}
    </>
  );
}

function PeriodHeader({ profiles, onOpen }) {
  const periodWidth = 330;
  const gridTemplateColumns = `250px ${profiles
    .map(() => `${periodWidth - 180}px 82px 82px`)
    .join(" ")} 46px`;

  return (
    <Box sx={{ position: "sticky", top: 0, zIndex: 5, bgcolor: "#fff", borderBottom: "1px solid #E8EDEE" }}>
      <Box sx={{ display: "grid", gridTemplateColumns, columnGap: 1, alignItems: "center", px: 1, py: 1 }}>
        <Typography sx={{ px: 1, fontSize: 11, fontWeight: 600, color: "#87969A" }}>Concepto</Typography>
        {profiles.map((profile) => (
          <React.Fragment key={`period-${profile.id}`}>
            <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 0.6 }}>
              <Typography sx={{ fontSize: 11, fontWeight: 650, color: "#3F777B", whiteSpace: "nowrap" }}>
                {profile.dateRanges || profile.period || "Periodo"}
              </Typography>
              <IconButton size="small" onClick={() => onOpen(profile)} sx={{ p: 0.25 }}>
                <VisibilityOutlinedIcon sx={{ fontSize: 14 }} />
              </IconButton>
            </Box>
            <Typography sx={{ fontSize: 10.5, color: "#87969A", textAlign: "right" }}>Part.</Typography>
            <Typography sx={{ fontSize: 10.5, color: "#87969A", textAlign: "right" }}>Var.</Typography>
          </React.Fragment>
        ))}
        <Box />
      </Box>
    </Box>
  );
}

function FieldValue({ label, value }) {
  return (
    <Box>
      <Typography sx={{ fontSize: 10, color: "#8A999D", mb: 0.3 }}>{label}</Typography>
      <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#52666B" }}>{value || "—"}</Typography>
    </Box>
  );
}

function PeriodDetailDialog({ profile, onClose }) {
  if (!profile) return null;

  const totalAssets = Number(profile?.assets?.total_assets || 0);
  const totalLiabilities = Number(profile?.passives?.total_passives || 0);
  const totalEquity = Number(profile?.patrimony?.total_patrimony || 0);
  const difference = totalAssets - (totalLiabilities + totalEquity);
  const balanced = Math.abs(difference) < 1;

  return (
    <Dialog open={Boolean(profile)} onClose={onClose} fullWidth maxWidth="md">
      <Box sx={{ px: 2.5, py: 1.8, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #E8EDEE" }}>
        <Box>
          <Typography sx={{ fontSize: 15, fontWeight: 650, color: "#3F777B" }}>
            Detalle del periodo {profile.dateRanges || profile.period || ""}
          </Typography>
          <Typography sx={{ fontSize: 10.5, color: "#8A999D", mt: 0.25 }}>
            Información existente en el perfil financiero actual.
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small"><CloseIcon fontSize="small" /></IconButton>
      </Box>

      <DialogContent sx={{ p: 2.5 }}>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" }, gap: 2 }}>
          <FieldValue label="Año" value={profile.period} />
          <FieldValue label="Fecha inicio" value={profile.periodStartDate} />
          <FieldValue label="Fecha fin" value={profile.periodEndDate} />
        </Box>

        <Box sx={{ mt: 2.5, p: 1.5, bgcolor: balanced ? "#F2F8F5" : "#FFF7F7", borderRadius: 2, border: `1px solid ${balanced ? "#D8EADF" : "#F0DDDD"}` }}>
          <Typography sx={{ fontSize: 11.5, fontWeight: 650, color: balanced ? "#4E8A72" : "#B86767" }}>
            {balanced ? "Balance cuadrado" : "Balance con diferencia"}
          </Typography>
          <Typography sx={{ fontSize: 10.5, color: "#78898D", mt: 0.3 }}>
            Activos {fmtMoney(totalAssets)} · Pasivos + Patrimonio {fmtMoney(totalLiabilities + totalEquity)}
            {!balanced ? ` · Diferencia ${fmtMoney(difference)}` : ""}
          </Typography>
        </Box>

        <Typography sx={{ mt: 2.5, mb: 1, fontSize: 12, fontWeight: 650, color: "#52666B" }}>
          Documentación legal y contable
        </Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1 }}>
          {documentFields.map(([key, label]) => {
            const url = profile?.[key];
            return (
              <Box key={key} sx={{ p: 1.2, border: "1px solid #E8EDEE", borderRadius: 1.5, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
                <Typography sx={{ fontSize: 10.8, color: "#607378" }}>{label}</Typography>
                {url ? (
                  <Button component="a" href={url} target="_blank" rel="noreferrer" size="small" sx={{ minWidth: 0, fontSize: 10.5, textTransform: "none", color: "#3F858A" }}>
                    Ver archivo
                  </Button>
                ) : (
                  <Typography sx={{ fontSize: 10, color: "#A0ABAE" }}>No cargado</Typography>
                )}
              </Box>
            );
          })}
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export const FinancialSituationComponent = ({ data1, loading = false }) => {
  const [selectedProfile, setSelectedProfile] = useState(null);

  const profiles = useMemo(() => {
    const rows = data1?.data?.financialProfiles;
    return Array.isArray(rows) ? rows : [];
  }, [data1]);

  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        <Skeleton height={30} width="30%" />
        <Skeleton variant="rounded" height={420} />
      </Box>
    );
  }

  return (
    <>
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
        <Box sx={{ mb: 1.4 }}>
          <Typography sx={{ fontSize: 14, fontWeight: 650, color: "#3F777B" }}>
            Estado de situación financiera
          </Typography>
          <Typography sx={{ fontSize: 11, color: "#8A999D", mt: 0.2 }}>
            Valores registrados por periodo, participación dentro de cada grupo y variación frente al periodo anterior.
          </Typography>
        </Box>

        {!profiles.length ? (
          <EmptyState
            title="No hay información financiera para mostrar"
            subtitle="Cuando exista un perfil financiero, aquí se mostrarán activos, pasivos y patrimonio."
          />
        ) : (
          <Box sx={{ bgcolor: "#fff", borderRadius: 2, border: "1px solid #E6ECEE", overflowX: "auto", WebkitOverflowScrolling: "touch", maxWidth: "100%" }}>
            <Box sx={{ minWidth: 250 + profiles.length * 330 + 46 }}>
              <PeriodHeader profiles={profiles} onOpen={setSelectedProfile} />
              {sections.map((section, index) => (
                <Box key={section.key}>
                  {index > 0 ? <Divider sx={{ my: 1 }} /> : null}
                  <FinancialRows profiles={profiles} section={section} />
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>

      <PeriodDetailDialog profile={selectedProfile} onClose={() => setSelectedProfile(null)} />
    </>
  );
};
