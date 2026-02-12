import React, { useState } from "react";
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

function FinancialSituationModal({
  open,
  onClose,
  data1,
  selectedPeriod,
  onDownload,
}) {
  const [activeStep, setActiveStep] = useState(0);

  const handleClose = () => {
    setActiveStep(0);
    onClose?.();
  };

  const next = () =>
    setActiveStep((s) => Math.min(s + 1, steps.length - 1));
  const back = () => setActiveStep((s) => Math.max(s - 1, 0));

  // maqueta de validación (como tus pantallas verde/rojo)
  const isBalancedMock = true; // solo demo (en revisión)

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
          <IconButton size="small" onClick={onDownload}>
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
              {activeStep === 4 ? (
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
                  <span style={{ color: "#111827" }}>
                    {steps[activeStep].title}
                  </span>
                </Typography>
              )}
            </Box>

            {/* main scroll area */}
            <Box sx={{ flex: 1, overflow: "auto", p: 3 }}>
              {activeStep === 0 && <DocumentsStepMock />}
              {activeStep === 1 && <FinancialSituationActivosStep data1={data1} />}
              {activeStep === 2 && <FinancialSituationPasivosStep data1={data1} />}
              {activeStep === 3 && <FinancialSituationPatrimonioStep data1={data1} />}
              {activeStep === 4 && <ReviewStepMock />}
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
                disabled={activeStep === 0}
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

  const periods =
    data1?.data?.financialProfiles?.map((p) => p.dateRanges) ?? [
      "Ene - Dic 2022",
      "Ene - Dic 2023",
      "Ene - Dic 2024",
    ];

  const labelCol = "320px";
  const partCol = "90px";
  const varCol = "90px";
  const colsPerPeriod = 2;
  const actionsCol = "90px";
  const gridCols = `${labelCol} ${periods
    .map(() => `${partCol} ${varCol}`)
    .join(" ")} ${actionsCol}`;

  const handleOpen = (period) => {
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
            periods={periods}
            colsPerPeriod={colsPerPeriod}
            onEditPeriod={handleOpen}
            onFullscreenPeriod={handleOpen} // si quieres que fullscreen también abra el modal
          />

          <SectionTitle title="Activos" />
          <RowMock gridCols={gridCols} label="Caja e inversiones totales" />
          <RowMock gridCols={gridCols} label="Cartera Clientes" />
          <RowMock gridCols={gridCols} label="Cuentas por cobrar neta" isTotal />

          <Divider sx={{ my: 2 }} />

          <SectionTitle title="Pasivos" />
          <RowMock gridCols={gridCols} label="Obligaciones Financieras CP" />
          <RowMock gridCols={gridCols} label="Proveedores" />
          <RowMock gridCols={gridCols} label="Pasivo Corriente" isTotal />

          <Divider sx={{ my: 2 }} />

          <SectionTitle title="Patrimonio" />
          <RowMock gridCols={gridCols} label="Capital Pagado" />
          <RowMock gridCols={gridCols} label="Utilidades Retenidas" />
          <RowMock gridCols={gridCols} label="Total Patrimonio" isTotal />
        </Box>
      </Box>

      <FinancialSituationModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        data1={data1}
        selectedPeriod={selectedPeriod}
        onDownload={() => console.log("download period:", selectedPeriod)}
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
}) {
  const firstPeriod = periods?.[periods.length - 1] || ""; // "actual" por defecto (último)

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
              }}
            >
              <IconButton
                size="small"
                sx={{ padding: "2px" }}
                onClick={() => onEditPeriod?.(p)}
              >
                <EditIcon fontSize="inherit" />
              </IconButton>

              {p}
            </Box>
          </Box>
        ))}

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <IconButton size="small" onClick={() => onFullscreenPeriod?.(firstPeriod)}>
            <FullscreenIcon fontSize="small" />
          </IconButton>
          <IconButton size="small">
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

function SectionTitle({ title }) {
  return (
    <Box sx={{ padding: "10px 12px 6px 12px" }}>
      <InputTitles>{title}</InputTitles>
    </Box>
  );
}

function RowMock({ gridCols, label, isTotal }) {
  const cell = {
    padding: "8px 12px",
    borderTop: "1px solid #EFEFF4",
    fontSize: 13,
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

      {/* mock 3 periodos */}
      <Box sx={{ ...cell, textAlign: "right" }}>10%</Box>
      <Box sx={{ ...cell, textAlign: "right" }}>+34%</Box>

      <Box sx={{ ...cell, textAlign: "right" }}>50%</Box>
      <Box sx={{ ...cell, textAlign: "right" }}>+9,999%</Box>

      <Box sx={{ ...cell, textAlign: "right" }}>0%</Box>
      <Box sx={{ ...cell, textAlign: "right" }}>-100%</Box>

      <Box sx={cell} />
    </Box>
  );
}

// =======================================================
// 4) PASOS (MAQUETA) — separados (Activos / Pasivos / Patrimonio)
// =======================================================

function FinancialSituationActivosStep({ data1 }) {
  // aquí luego irá tu layout real de activos
  return (
    <Box>
      <InputTitles marginBottom={1}>Activos</InputTitles>
      <Typography sx={{ fontSize: 13, color: "#6B7280", mb: 2 }}>
        (Maqueta) Aquí va el formulario/tabla de Activos para el periodo seleccionado.
      </Typography>

      {/* Puedes reutilizar la maqueta de tabla si quieres */}
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
              <Typography sx={{ fontSize: 12, fontWeight: 900 }}>
                Fecha Inicio
              </Typography>
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