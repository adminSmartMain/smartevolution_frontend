import { useEffect, useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from "@mui/material";

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    "& fieldset": { borderColor: "#9CCFD0" },
    "&:hover fieldset": { borderColor: "#5EA3A3" },
    "&.Mui-focused fieldset": { borderColor: "#488B8F" },
    "&.Mui-error fieldset": { borderColor: "#d32f2f" },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: "#488B8F" },
};

const initialErrors = {
  reason: "",
  date: "",
  payedAmount: "",
  calculatedDays: "",
};

const MIN_REASON_LENGTH = 50;
const MAX_REASON_LENGTH = 500;
const REQUIRED_REASON_MESSAGE = "El motivo es obligatorio y debe tener al menos 50 caracteres";

const dateOnlyToUtc = (value) => {
  if (!value) return null;

  const [year, month, day] = String(value).slice(0, 10).split("-").map(Number);
  if (!year || !month || !day) return null;

  return Date.UTC(year, month - 1, day);
};

const calculateDaysFromDates = (applicationDate, operationStartDate) => {
  const applicationUtc = dateOnlyToUtc(applicationDate);
  const operationUtc = dateOnlyToUtc(operationStartDate);

  if (applicationUtc === null || operationUtc === null) return null;

  return Math.max(Math.round((applicationUtc - operationUtc) / 86400000), 0);
};

export default function ReceiptActionModal({
  open,
  mode,
  values,
  onChange,
  onClose,
  onSubmit,
}) {
  const isAdjust = mode === "adjust";
  const isReason = mode === "reason";
  const [errors, setErrors] = useState(initialErrors);

  useEffect(() => {
    if (open) {
      setErrors(initialErrors);
    }
  }, [open, mode]);

  const validate = () => {
    if (isReason) return true;

    const nextErrors = { ...initialErrors };
    const reason = String(values?.reason || "").trim();

    if (!reason || reason.length < MIN_REASON_LENGTH) {
      nextErrors.reason = REQUIRED_REASON_MESSAGE;
    } else if (reason.length > MAX_REASON_LENGTH) {
      nextErrors.reason = `El motivo no puede superar ${MAX_REASON_LENGTH} caracteres.`;
    }

    if (isAdjust) {
      if (!values?.date) {
        nextErrors.date = "La fecha de aplicación es obligatoria.";
      }

      if (values?.payedAmount === "" || values?.payedAmount === null || values?.payedAmount === undefined) {
        nextErrors.payedAmount = "El monto aplicado es obligatorio.";
      } else if (Number(values.payedAmount) <= 0) {
        nextErrors.payedAmount = "El monto aplicado debe ser mayor a cero.";
      }

      if (values?.calculatedDays !== "" && values?.calculatedDays !== null && values?.calculatedDays !== undefined) {
        if (Number(values.calculatedDays) < 0) {
          nextErrors.calculatedDays = "Los días cálculo no pueden ser negativos.";
        }
      }
    }

    setErrors(nextErrors);
    return !Object.values(nextErrors).some(Boolean);
  };

  const handleFieldChange = (field, value) => {
    if (errors[field]) {
      setErrors((previous) => ({
        ...previous,
        [field]: "",
      }));
    }

    onChange(field, value);

    if (isAdjust && field === "date") {
      const originalDate = values?.row?.date || "";
      const originalCalculatedDays = values?.row?.calculatedDays ?? "";
      const operationStartDate =
        values?.row?.operationStartDate ||
        values?.row?.operation?.opDate ||
        "";

      const recalculatedDays =
        value === originalDate
          ? originalCalculatedDays
          : calculateDaysFromDates(value, operationStartDate);

      if (recalculatedDays !== null) {
        onChange("calculatedDays", recalculatedDays);
      }
    }
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit();
  };

  return (
    <Dialog
      open={Boolean(open)}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: "14px",
          p: 0.5,
        },
      }}
    >
      <DialogTitle
        sx={{
          color: "#488B8F",
          fontWeight: 700,
          fontSize: "1.25rem",
          pb: 0.5,
        }}
      >
        {isReason ? "Motivo del recaudo" : isAdjust ? "Editar recaudo" : "Anular recaudo"}
      </DialogTitle>

      <DialogContent sx={{ pt: 1.5 }}>
        <Typography sx={{ color: "#555", fontSize: "0.92rem", mb: 2 }}>
          {isReason
            ? "Este recaudo ya fue anulado o ajustado. Aquí puedes consultar el motivo registrado para la trazabilidad."
            : isAdjust
            ? "Ingrese el motivo y los nuevos valores del recaudo. El sistema conservará el recaudo original como ajustado y creará uno nuevo corregido."
            : "Ingrese el motivo de anulación. El recaudo no se elimina físicamente; queda anulado para mantener trazabilidad."}
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Motivo"
            placeholder={isAdjust ? "Ej: Corrección de monto aplicado" : "Ej: Recaudo registrado por error"}
            value={values?.reason || ""}
            onChange={(event) => handleFieldChange("reason", event.target.value)}
            required={!isReason}
            fullWidth
            multiline
            minRows={3}
            InputProps={{ readOnly: isReason }}
            inputProps={{ maxLength: isReason ? undefined : MAX_REASON_LENGTH }}
            error={Boolean(errors.reason)}
            helperText={
              isReason
                ? " "
                : errors.reason || `${String(values?.reason || "").length}/${MAX_REASON_LENGTH} caracteres`
            }
            sx={inputSx}
          />

          {isAdjust && !isReason && (
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
              <TextField
                label="Fecha de aplicación"
                type="date"
                value={values?.date || ""}
                onChange={(event) => handleFieldChange("date", event.target.value)}
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={Boolean(errors.date)}
                helperText={errors.date || " "}
                sx={inputSx}
              />

              <TextField
                label="Monto aplicado"
                type="number"
                value={values?.payedAmount ?? ""}
                onChange={(event) => handleFieldChange("payedAmount", event.target.value)}
                required
                fullWidth
                error={Boolean(errors.payedAmount)}
                helperText={errors.payedAmount || " "}
                sx={inputSx}
              />

              <TextField
                label="Días cálculo"
                type="number"
                value={values?.calculatedDays ?? ""}
                onChange={(event) => handleFieldChange("calculatedDays", event.target.value)}
                fullWidth
                error={Boolean(errors.calculatedDays)}
                helperText={errors.calculatedDays || "Se actualiza automáticamente al cambiar la fecha."}
                sx={inputSx}
              />
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, pt: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderColor: "#9CCFD0",
            color: "#488B8F",
            borderRadius: "8px",
            px: 2.5,
          }}
        >
          {isReason ? "Cerrar" : "Cancelar"}
        </Button>
        {!isReason && (
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              bgcolor: isAdjust ? "#488B8F" : "#c62828",
              borderRadius: "8px",
              px: 2.5,
              "&:hover": { bgcolor: isAdjust ? "#356f73" : "#a31313" },
            }}
          >
            {isAdjust ? "Guardar ajuste" : "Anular recaudo"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
