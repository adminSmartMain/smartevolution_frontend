import React, { useMemo, useState } from "react";
import {
  Box,
  Divider,
  IconButton,
  Dialog,
  DialogContent,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  Button,
  Skeleton,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import InputTitles from "@styles/inputTitles";
import scrollSx from "@styles/scroll";

import EditIcon from "@mui/icons-material/Edit";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import DownloadIcon from "@mui/icons-material/Download";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";

// =======================================================
// 1) MODAL GRANDE + STEPPER (MUI)
// =======================================================

const steps = [
  { label: "Paso 1", title: "Periodo y documentos" },
  { label: "Paso 2", title: "Activos" },
  { label: "Paso 3", title: "Pasivos" },
  { label: "Paso 4", title: "Patrimonio" },
  { label: "Paso 5", title: "Revisión" },
];

const Connector = styled(StepConnector)(() => ({
  "& .MuiStepConnector-line": {
    borderLeftWidth: 2,
    minHeight: 34,
    borderColor: "#D1D5DB",
  },
}));

const StepIconRoot = styled("div")(({ ownerState }) => ({
  width: 32,
  height: 32,
  borderRadius: "50%",
  display: "grid",
  placeItems: "center",
  fontWeight: 800,
  fontSize: 13,
  color: ownerState.active || ownerState.completed ? "#FFFFFF" : "#6B7280",
  backgroundColor:
    ownerState.active || ownerState.completed ? "#0F766E" : "#FFFFFF",
  border:
    ownerState.active || ownerState.completed
      ? "2px solid #0F766E"
      : "2px solid #9CA3AF",
}));

function StepIcon(props) {
  const { active, completed, icon } = props;
  return (
    <StepIconRoot ownerState={{ active, completed }}>
      {completed ? <CheckIcon sx={{ fontSize: 18 }} /> : icon}
    </StepIconRoot>
  );
}

function EmptyState({ title = "Sin información", subtitle }) {
  return (
    <Box
      sx={{
        border: "1px dashed #D1D5DB",
        borderRadius: "12px",
        p: 3,
        backgroundColor: "#FFFFFF",
      }}
    >
      <Typography sx={{ fontSize: 16, fontWeight: 900, color: "#111827" }}>
        {title}
      </Typography>
      {subtitle ? (
        <Typography sx={{ fontSize: 13, color: "#6B7280", mt: 0.5 }}>
          {subtitle}
        </Typography>
      ) : null}
    </Box>
  );
}

function StepContentSkeleton() {
  return (
    <Box sx={{ maxWidth: 980 }}>
      <Skeleton variant="text" height={28} width={220} />
      <Skeleton variant="text" height={20} width={520} />

      <Box sx={{ mt: 2 }}>
        <Skeleton variant="rounded" height={54} width="100%" />
      </Box>

      <Box sx={{ mt: 2 }}>
        <Skeleton variant="rounded" height={54} width="100%" />
      </Box>

      <Box sx={{ mt: 2 }}>
        <Skeleton variant="rounded" height={180} width="100%" />
      </Box>
    </Box>
  );
}

function FinancialSituationModal({
  open,
  onClose,
  data1,
  selectedPeriod,
  onDownload,
  isLoading,
  hasFinancialData,
}) {
  const [activeStep, setActiveStep] = useState(0);

  const handleClose = () => {
    setActiveStep(0);
    onClose?.();
  };

  const next = () => setActiveStep((s) => Math.min(s + 1, steps.length - 1));
  const back = () => setActiveStep((s) => Math.max(s - 1, 0));

  // maqueta de validación (como tus pantallas verde/rojo)
  const isBalancedMock = true; // solo demo (en revisión)

  // Header message: si está cargando o no hay data, no muestres el badge de balance
  const canShowBalanceBadge = activeStep === 4 && hasFinancialData && !isLoading;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="xl"
      PaperProps={{
        sx: {
          borderRadius: "14px",
          overflow: "hidden",
          height: "86vh",
        },
      }}
    >
      {/* Header superior */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 3,
          py: 2,
          borderBottom: "1px solid #E5E7EB",
          backgroundColor: "#FFFFFF",
        }}
      >
        <Box>
          <Typography sx={{ fontSize: 18, fontWeight: 900, color: "#0F766E" }}>
            Editar Situación Financiera {selectedPeriod || ""}
          </Typography>
          <Typography sx={{ fontSize: 12, color: "#6B7280", mt: 0.3 }}>
            El periodo está preseleccionado. Solo se edita una columna a la vez.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            size="small"
            onClick={onDownload}
            disabled={isLoading || !hasFinancialData}
          >
            <DownloadIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={handleClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      <DialogContent sx={{ p: 0, backgroundColor: "#FFFFFF", height: "100%" }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "320px 1fr",
            height: "100%",
          }}
        >
          {/* LEFT: Stepper panel */}
          <Box
            sx={{
              backgroundColor: "#F3F4F6",
              p: 2,
              borderRight: "1px solid #E5E7EB",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {/* logo (maqueta) */}
            <Box
              sx={{
                height: 120,
                borderRadius: "12px",
                backgroundColor: "#E5E7EB",
                display: "grid",
                placeItems: "center",
                color: "#374151",
                fontWeight: 800,
              }}
            >
              SMART EVOLUTION
            </Box>

            <Box sx={{ backgroundColor: "#FFFFFF", borderRadius: "12px", p: 2 }}>
              <Stepper
                activeStep={activeStep}
                orientation="vertical"
                connector={<Connector />}
              >
                {steps.map((s, idx) => (
                  <Step key={`${s.title}-${idx}`}>
                    <StepLabel
                      StepIconComponent={StepIcon}
                      onClick={() => setActiveStep(idx)}
                      sx={{
                        cursor: "pointer",
                        "& .MuiStepLabel-label": { mt: 0.3 },
                      }}
                    >
                      <Box sx={{ lineHeight: 1.1 }}>
                        <Typography
                          sx={{ fontSize: 12, color: "#6B7280", fontWeight: 800 }}
                        >
                          {s.label}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: 14,
                            fontWeight: 900,
                            color: activeStep === idx ? "#111827" : "#374151",
                          }}
                        >
                          {s.title}
                        </Typography>
                        {activeStep === idx && (
                          <Typography
                            sx={{
                              fontSize: 12,
                              color: "#2563EB",
                              fontWeight: 700,
                            }}
                          >
                            En Progreso
                          </Typography>
                        )}
                      </Box>
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>
          </Box>

          {/* RIGHT: Content */}
          <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
            {/* content header */}
            <Box sx={{ px: 3, py: 2, borderBottom: "1px solid #E5E7EB" }}>
              {canShowBalanceBadge ? (
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 1.2,
                    backgroundColor: isBalancedMock ? "#D1FAE5" : "#FEE2E2",
                    borderRadius: "10px",
                    px: 2,
                    py: 1,
                    fontWeight: 900,
                  }}
                >
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      display: "grid",
                      placeItems: "center",
                      backgroundColor: isBalancedMock ? "#166534" : "#DC2626",
                      color: "#FFFFFF",
                      fontWeight: 900,
                    }}
                  >
                    {isBalancedMock ? "✓" : "×"}
                  </Box>
                  <Typography sx={{ fontSize: 13, fontWeight: 900 }}>
                    Activo = Pasivo + Patrimonio —{" "}
                    {isBalancedMock ? "¡Balance Cuadrado!" : "¡Balance No Cuadra!"}
                  </Typography>
                </Box>
              ) : (
                <Typography sx={{ fontSize: 13, color: "#6B7280", fontWeight: 800 }}>
                  Editando:{" "}
                  <span style={{ color: "#111827" }}>{steps[activeStep].title}</span>
                </Typography>
              )}
            </Box>

            {/* main scroll area */}
            <Box sx={{ flex: 1, overflow: "auto", p: 3 }}>
              {isLoading ? (
                <StepContentSkeleton />
              ) : !hasFinancialData ? (
                <EmptyState
                  title="Este usuario no tiene información financiera"
                  subtitle="Cuando cargue o exista información, podrás editar activos, pasivos y patrimonio por periodo."
                />
              ) : (
                <>
                  {activeStep === 0 && <DocumentsStepMock />}
                  {activeStep === 1 && <FinancialSituationActivosStep data1={data1} />}
                  {activeStep === 2 && <FinancialSituationPasivosStep data1={data1} />}
                  {activeStep === 3 && (
                    <FinancialSituationPatrimonioStep data1={data1} />
                  )}
                  {activeStep === 4 && <ReviewStepMock />}
                </>
              )}
            </Box>

            {/* footer actions */}
            <Box
              sx={{
                px: 3,
                py: 2,
                borderTop: "1px solid #E5E7EB",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
              }}
            >
              <Button
                onClick={back}
                disabled={activeStep === 0 || isLoading || !hasFinancialData}
                sx={{
                  textTransform: "none",
                  fontWeight: 900,
                  color: "#0F766E",
                }}
              >
                Atrás
              </Button>

              <Button
                variant="contained"
                disabled={isLoading || !hasFinancialData}
                sx={{
                  textTransform: "none",
                  fontWeight: 900,
                  px: 6,
                  borderRadius: "10px",
                  backgroundColor: "#BDBDBD",
                  "&:hover": { backgroundColor: "#9CA3AF" },
                }}
              >
                Guardar
              </Button>

              <Button
                onClick={next}
                disabled={isLoading || !hasFinancialData}
                sx={{
                  textTransform: "none",
                  fontWeight: 900,
                  px: 5,
                  borderRadius: "10px",
                  border: "2px solid #0F766E",
                  color: "#0F766E",
                }}
              >
                {activeStep === steps.length - 1 ? "Finalizar" : "Siguiente"}
              </Button>
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

// =======================================================
// 2) TU VISTA PADRE: TABLA + HEADER STICKY (ABRE MODAL)
// =======================================================

export const FinancialSituationComponent = ({ data1 }) => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("");

  // ✅ criterio simple de loading/empty
  // - Loading: data1 todavía no está (undefined/null)
  // - Empty: ya llegó pero no trae perfiles
  const isLoading = data1 == null; // ajusta si tienes un flag real (ej: data1Loading)
  const profiles = data1?.data?.financialProfiles;
  const hasFinancialData = Array.isArray(profiles) && profiles.length > 0;

  const periods = useMemo(() => {
    if (!hasFinancialData) return [];
    return profiles.map((p) => p.dateRanges).filter(Boolean);
  }, [hasFinancialData, profiles]);

  // Layout tabla
  const labelCol = "320px";
  const partCol = "90px";
  const varCol = "90px";
  const colsPerPeriod = 2;
  const actionsCol = "90px";

  // Si no hay periodos, mantenemos una grilla mínima para que el header no se rompa
  const safePeriods = periods.length ? periods : ["—"];

  const gridCols = `${labelCol} ${safePeriods
    .map(() => `${partCol} ${varCol}`)
    .join(" ")} ${actionsCol}`;

  const handleOpen = (period) => {
    if (!hasFinancialData || isLoading) return; // 👈 evita abrir si no hay data
    setSelectedPeriod(period);
    setOpenModal(true);
  };

  return (
    <>
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
        <Box
          sx={{
            backgroundColor: "white",
            borderRadius: "12px",
            border: "1px solid #E6E6EA",
            overflowX: "auto",
          }}
        >
          <HeaderSticky
            gridCols={gridCols}
            periods={safePeriods}
            colsPerPeriod={colsPerPeriod}
            onEditPeriod={handleOpen}
            onFullscreenPeriod={handleOpen}
            isLoading={isLoading}
            hasFinancialData={hasFinancialData}
          />

          {isLoading ? (
            <TableSkeleton gridCols={gridCols} />
          ) : !hasFinancialData ? (
            <Box sx={{ p: 2 }}>
              <EmptyState
                title="No hay información financiera para mostrar"
                subtitle="Cuando el usuario tenga datos, aquí verás activos, pasivos y patrimonio por periodo."
              />
            </Box>
          ) : (
            <>
              <SectionTitle title="Activos" />
              <RowMock gridCols={gridCols} label="Caja e inversiones totales" periodsCount={periods.length} />
              <RowMock gridCols={gridCols} label="Cartera Clientes" periodsCount={periods.length} />
              <RowMock gridCols={gridCols} label="Cuentas por cobrar neta" isTotal periodsCount={periods.length} />

              <Divider sx={{ my: 2 }} />

              <SectionTitle title="Pasivos" />
              <RowMock gridCols={gridCols} label="Obligaciones Financieras CP" periodsCount={periods.length} />
              <RowMock gridCols={gridCols} label="Proveedores" periodsCount={periods.length} />
              <RowMock gridCols={gridCols} label="Pasivo Corriente" isTotal periodsCount={periods.length} />

              <Divider sx={{ my: 2 }} />

              <SectionTitle title="Patrimonio" />
              <RowMock gridCols={gridCols} label="Capital Pagado" periodsCount={periods.length} />
              <RowMock gridCols={gridCols} label="Utilidades Retenidas" periodsCount={periods.length} />
              <RowMock gridCols={gridCols} label="Total Patrimonio" isTotal periodsCount={periods.length} />
            </>
          )}
        </Box>
      </Box>

      <FinancialSituationModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        data1={data1}
        selectedPeriod={selectedPeriod}
        onDownload={() => console.log("download period:", selectedPeriod)}
        isLoading={isLoading}
        hasFinancialData={hasFinancialData}
      />
    </>
  );
};

// =======================================================
// 3) HEADER STICKY (EDIT ABRE MODAL GRANDE)
// =======================================================

function HeaderSticky({
  gridCols,
  periods,
  colsPerPeriod,
  onEditPeriod,
  onFullscreenPeriod,
  isLoading,
  hasFinancialData,
}) {
  const firstPeriod = periods?.[periods.length - 1] || "";

  const disableActions = isLoading || !hasFinancialData;

  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 30,
        backgroundColor: "white",
        borderBottom: "1px solid #EFEFF4",
      }}
    >
      {/* FILA 1 */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: gridCols,
          alignItems: "center",
          padding: "10px 12px",
          gap: 1,
        }}
      >
        <Box />

        {periods.map((p) => (
          <Box
            key={p}
            sx={{
              gridColumn: `span ${colsPerPeriod}`,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                border: "1px solid #E6E6EA",
                borderRadius: "8px",
                padding: "6px 10px",
                fontSize: 12,
                fontWeight: 800,
                color: "#147A7E",
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                backgroundColor: "white",
                opacity: disableActions ? 0.6 : 1,
              }}
            >
              <IconButton
                size="small"
                sx={{ padding: "2px" }}
                onClick={() => onEditPeriod?.(p)}
                disabled={disableActions}
              >
                <EditIcon fontSize="inherit" />
              </IconButton>

              {isLoading ? <Skeleton width={90} height={18} /> : p}
            </Box>
          </Box>
        ))}

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <IconButton
            size="small"
            onClick={() => onFullscreenPeriod?.(firstPeriod)}
            disabled={disableActions}
          >
            <FullscreenIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" disabled={disableActions}>
            <DownloadIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* FILA 2 */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: gridCols,
          padding: "0 12px 10px 12px",
          color: "#6B7280",
          fontWeight: 800,
          fontSize: 12,
        }}
      >
        <Box />
        {periods.map((p) => (
          <Box key={p} sx={{ display: "contents" }}>
            <Box sx={{ textAlign: "right" }}>Part</Box>
            <Box sx={{ textAlign: "right" }}>Var</Box>
          </Box>
        ))}
        <Box />
      </Box>
    </Box>
  );
}

function TableSkeleton({ gridCols }) {
  return (
    <Box>
      <Box sx={{ p: "10px 12px 6px 12px" }}>
        <Skeleton variant="text" width={120} height={26} />
      </Box>
      {[...Array(6)].map((_, i) => (
        <Box
          key={i}
          sx={{
            display: "grid",
            gridTemplateColumns: gridCols,
            alignItems: "center",
            backgroundColor: "white",
          }}
        >
          <Box sx={{ padding: "8px 12px", borderTop: "1px solid #EFEFF4" }}>
            <Skeleton variant="text" width={240} height={22} />
          </Box>
          {/* Simula 3 periodos (Part/Var x3) + actions */}
          <Box sx={{ padding: "8px 12px", borderTop: "1px solid #EFEFF4" }}>
            <Skeleton variant="text" width={40} height={22} />
          </Box>
          <Box sx={{ padding: "8px 12px", borderTop: "1px solid #EFEFF4" }}>
            <Skeleton variant="text" width={50} height={22} />
          </Box>
          <Box sx={{ padding: "8px 12px", borderTop: "1px solid #EFEFF4" }}>
            <Skeleton variant="text" width={40} height={22} />
          </Box>
          <Box sx={{ padding: "8px 12px", borderTop: "1px solid #EFEFF4" }}>
            <Skeleton variant="text" width={50} height={22} />
          </Box>
          <Box sx={{ padding: "8px 12px", borderTop: "1px solid #EFEFF4" }}>
            <Skeleton variant="text" width={40} height={22} />
          </Box>
          <Box sx={{ padding: "8px 12px", borderTop: "1px solid #EFEFF4" }}>
            <Skeleton variant="text" width={50} height={22} />
          </Box>
          <Box sx={{ padding: "8px 12px", borderTop: "1px solid #EFEFF4" }}>
            <Skeleton variant="circular" width={18} height={18} />
          </Box>
        </Box>
      ))}
    </Box>
  );
}

function SectionTitle({ title }) {
  return (
    <Box sx={{ padding: "10px 12px 6px 12px" }}>
      <InputTitles>{title}</InputTitles>
    </Box>
  );
}

function RowMock({ gridCols, label, isTotal, periodsCount = 3 }) {
  const cell = {
    padding: "8px 12px",
    borderTop: "1px solid #EFEFF4",
    fontSize: 13,
  };

  // Para no “hardcodear” 3 periodos: renderiza N periodos (Part/Var)
  const renderPeriodCells = () => {
    // Si periodsCount viene 0 por error, caemos a 1
    const n = Math.max(1, periodsCount);
    return Array.from({ length: n }).flatMap((_, idx) => [
      <Box key={`part-${idx}`} sx={{ ...cell, textAlign: "right" }}>
        10%
      </Box>,
      <Box key={`var-${idx}`} sx={{ ...cell, textAlign: "right" }}>
        +34%
      </Box>,
    ]);
  };

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: gridCols,
        alignItems: "center",
        backgroundColor: isTotal ? "#FAFAFC" : "white",
      }}
    >
      <Box sx={{ ...cell, fontWeight: isTotal ? 800 : 600 }}>{label}</Box>

      {renderPeriodCells()}

      <Box sx={cell} />
    </Box>
  );
}

// =======================================================
// 4) PASOS (MAQUETA) — separados (Activos / Pasivos / Patrimonio)
// =======================================================

function FinancialSituationActivosStep({ data1 }) {
  return (
    <Box>
      <InputTitles marginBottom={1}>Activos</InputTitles>
      <Typography sx={{ fontSize: 13, color: "#6B7280", mb: 2 }}>
        (Maqueta) Aquí va el formulario/tabla de Activos para el periodo seleccionado.
      </Typography>

      <MiniTableMock />
    </Box>
  );
}

function FinancialSituationPasivosStep({ data1 }) {
  return (
    <Box>
      <InputTitles marginBottom={1}>Pasivos</InputTitles>
      <Typography sx={{ fontSize: 13, color: "#6B7280", mb: 2 }}>
        (Maqueta) Aquí va el formulario/tabla de Pasivos para el periodo seleccionado.
      </Typography>
      <MiniTableMock />
    </Box>
  );
}

function FinancialSituationPatrimonioStep({ data1 }) {
  return (
    <Box>
      <InputTitles marginBottom={1}>Patrimonio</InputTitles>
      <Typography sx={{ fontSize: 13, color: "#6B7280", mb: 2 }}>
        (Maqueta) Aquí va el formulario/tabla de Patrimonio para el periodo seleccionado.
      </Typography>
      <MiniTableMock />
    </Box>
  );
}

function MiniTableMock() {
  return (
    <Box
      sx={{
        border: "1px solid #E5E7EB",
        borderRadius: "12px",
        overflow: "hidden",
        backgroundColor: "#FFFFFF",
      }}
    >
      {["Cuenta A", "Cuenta B", "Cuenta C", "Total"].map((t, i) => (
        <Box
          key={t}
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 140px 140px",
            gap: 2,
            alignItems: "center",
            px: 2,
            py: 1.2,
            borderTop: i === 0 ? "none" : "1px solid #F1F5F9",
            backgroundColor: t === "Total" ? "#F9FAFB" : "#FFFFFF",
          }}
        >
          <Typography sx={{ fontSize: 13, fontWeight: t === "Total" ? 900 : 700 }}>
            {t}
          </Typography>

          <Box
            sx={{
              height: 34,
              borderRadius: "10px",
              border: "1px solid #E5E7EB",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: 1.5,
              fontWeight: 800,
              color: "#111827",
            }}
          >
            $0
          </Box>

          <Box
            sx={{
              height: 34,
              borderRadius: "10px",
              border: "1px solid #E5E7EB",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: 1.5,
              fontWeight: 800,
              color: "#111827",
            }}
          >
            0%
          </Box>
        </Box>
      ))}
    </Box>
  );
}

// =======================================================
// 5) MAQUETAS DE CONTENIDO (Paso 1 y Paso 5)
// =======================================================

function DocumentsStepMock() {
  return (
    <Box sx={{ maxWidth: 980 }}>
      <Box sx={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 3 }}>
        <Box>
          <InputTitles marginBottom={1}>Año de Balance</InputTitles>
          <Box
            sx={{
              border: "1px solid #E5E7EB",
              borderRadius: "10px",
              height: 38,
              display: "flex",
              alignItems: "center",
              px: 1.5,
              fontWeight: 800,
            }}
          >
            2024
          </Box>
        </Box>

        <Box
          sx={{
            border: "1px solid #E5E7EB",
            borderRadius: "12px",
            padding: 2,
          }}
        >
          <InputTitles marginBottom={1}>Rango de Muestra</InputTitles>
          <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap", mt: 1 }}>
            {["Anual", "Rango de Fecha", "Semestral", "Trimestral"].map((t) => (
              <Box key={t} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    border: "2px solid #111827",
                  }}
                />
                <Typography sx={{ fontSize: 12, fontWeight: 800 }}>{t}</Typography>
              </Box>
            ))}
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 2,
              mt: 2,
            }}
          >
            <Box>
              <Typography sx={{ fontSize: 12, fontWeight: 900 }}>Fecha Inicio</Typography>
              <Box
                sx={{
                  border: "1px solid #E5E7EB",
                  borderRadius: "10px",
                  height: 38,
                  display: "flex",
                  alignItems: "center",
                  px: 1.5,
                  mt: 0.5,
                  fontWeight: 800,
                }}
              >
                01-01-2024
              </Box>
            </Box>
            <Box>
              <Typography sx={{ fontSize: 12, fontWeight: 900 }}>Fecha Fin</Typography>
              <Box
                sx={{
                  border: "1px solid #E5E7EB",
                  borderRadius: "10px",
                  height: 38,
                  display: "flex",
                  alignItems: "center",
                  px: 1.5,
                  mt: 0.5,
                  fontWeight: 800,
                }}
              >
                30-12-2024
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box sx={{ mt: 3 }}>
        <InputTitles marginBottom={1}>Documentación Legal y contable</InputTitles>

        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          {[
            "Balance",
            "Estado de Flujo de Efectivo",
            "Dictamen de Estados Financieros",
            "Informe de Gestión",
            "Certificado de Composición Accionaria",
            "Declaración de Renta",
          ].map((t) => (
            <Box
              key={t}
              sx={{
                border: "1px solid #E5E7EB",
                borderRadius: "12px",
                p: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography sx={{ fontSize: 13, fontWeight: 900 }}>{t}</Typography>
              <Box
                sx={{
                  width: 110,
                  height: 32,
                  borderRadius: "10px",
                  backgroundColor: "#D1D5DB",
                }}
              />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

function ReviewStepMock() {
  return (
    <Box sx={{ maxWidth: 980 }}>
      <Typography sx={{ fontWeight: 900, fontSize: 16, mb: 1 }}>
        Revisión final
      </Typography>
      <Typography sx={{ fontSize: 13, color: "#6B7280" }}>
        (Maqueta) Aquí iría la validación completa y el resumen final antes de guardar.
      </Typography>
    </Box>
  );
}