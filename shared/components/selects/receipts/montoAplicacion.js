import React, { useState, useEffect, useRef } from 'react';
import BaseField from "@styles/fields/BaseFieldReceipts";
import { IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { toast } from 'react-toastify';
import { Tooltip, ClickAwayListener } from "@mui/material";

const AdaptiveTooltip = ({ title, placement = '', children }) => {
  const [open, setOpen] = useState(false);

  const handleTooltipOpen = () => {
    setOpen(true);
  };

  const handleTooltipClose = () => {
    setOpen(false);
  };

  return (
    <ClickAwayListener onClickAway={handleTooltipClose}>
      <Tooltip
        title={title}
        placement={placement}
        arrow
        open={open}
        onClose={handleTooltipClose}
        disableFocusListener
        disableHoverListener
        disableTouchListener
      >
        <div onClick={handleTooltipOpen} style={{ display: 'inline-block' }}>
          {children}
        </div>
      </Tooltip>
    </ClickAwayListener>
  );
};

const PayedAmountField = ({ formik, presentValueInvestor }) => {
  // Función para formatear números con separadores de miles
  const formatNumberWithThousandsSeparator = (value) => {
    if (value === undefined || value === null || value === 0) return '0';
    
    const numericValue = typeof value === 'string' 
      ? value.replace(/[^\d]/g, '') 
      : value.toString().replace(/[^\d]/g, '');
    
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };
    
  const [inputValue, setInputValue] = useState(
    formik.values.payedAmount ? formatNumberWithThousandsSeparator(formik.values.payedAmount) : "0"
  );
  const [isFocused, setIsFocused] = useState(false);
  const [isDirty, setIsDirty] = useState(false); // Para saber si hay cambios no guardados
  const inputRef = useRef(null);

  // Sincronizar con el valor de formik cuando cambie (solo si no estamos enfocados y no hay cambios sucios)
  useEffect(() => {
    if (!isFocused && !isDirty) {
      const formattedValue = formik.values.payedAmount && formik.values.payedAmount !== 0 
        ? formatNumberWithThousandsSeparator(formik.values.payedAmount) 
        : "0";
      setInputValue(formattedValue);
    }
  }, [formik.values.payedAmount, isFocused, isDirty]);

  const handleChange = (e) => {
    let value = e.target.value;
    
    // Permitir solo números y punto (para separador de miles)
    value = value.replace(/[^\d.]/g, '');
    
    if (value === "0" || value === "") {
      setInputValue("");
      setIsDirty(true); // Marcamos que hay cambios no guardados
      return;
    }
    
    setInputValue(value);
    setIsDirty(true); // Marcamos que hay cambios no guardados
  };

  const processValue = () => {
    let rawValue = inputValue;
    
    if (inputValue === "") {
      rawValue = "0";
    }
    
    // Eliminar separadores de miles para obtener el valor numérico
    const numericValue = parseInt(rawValue.replace(/\./g, '')) || 0;
    
    // Validación: no puede ser menor que los intereses adicionales
    const additionalInterests = Number(formik.values.additionalInterests) || 0;
    
    if (numericValue < additionalInterests) {
      toast.error("El monto de aplicación no puede ser menor a los intereses adicionales");
      // Restaurar el valor anterior
      const previousValue = formik.values.payedAmount || 0;
      setInputValue(formatNumberWithThousandsSeparator(previousValue));
      setIsDirty(false); // Limpiamos el estado de cambios
      return;
    }
    
    // Actualizar el valor en formik
    formik.setFieldValue("payedAmount", numericValue);
    
    // Formatear el valor para mostrarlo con separadores de miles
    setInputValue(numericValue === 0 ? "0" : formatNumberWithThousandsSeparator(numericValue));
    setIsDirty(false); // Limpiamos el estado de cambios después de guardar
  };

  const handleBlur = () => {
    setIsFocused(false);
    // NO procesamos el valor al hacer blur, mantenemos el texto como está
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      processValue(); // Solo procesamos con Enter
      e.target.blur();
    } else if (e.key === 'Escape') {
      // Cancelar cambios: restaurar al valor guardado
      const previousValue = formik.values.payedAmount || 0;
      setInputValue(formatNumberWithThousandsSeparator(previousValue));
      setIsDirty(false);
      e.target.blur();
    }
  };

  const handleFocus = (e) => {
    setIsFocused(true);
    // Mostrar el valor sin formato al enfocar
    if (inputValue === "0") {
      setInputValue("");
    } else {
      const rawValue = inputValue.replace(/\./g, '');
      setInputValue(rawValue);
    }
  };

  return (
    <BaseField
      fullWidth
      InputProps={{
        startAdornment: (
          <i
            style={{
              color: "#5EA3A3",
              marginRight: "0.7vw",
              fontSize: "1.1vw",
            }}
            className="far fa-dollar-sign"
          ></i>
        ),
        endAdornment: (
          <AdaptiveTooltip
            title="Debe ser el monto registrado en el banco"
            placement="top-end"
            arrow
          >
            <IconButton edge="end" size="small" aria-label="Información">
              <InfoIcon style={{ fontSize: "1rem", color: "rgb(94, 163, 163)" }} />
            </IconButton>
          </AdaptiveTooltip>
        ),
      }}
      id="payedAmount"
      name="payedAmount"
      label="Monto Aplicación"
      value={inputValue}
      onChange={handleChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
      onKeyDown={handleKeyDown}
      inputRef={inputRef}
      error={formik.touched.payedAmount && Boolean(formik.errors.payedAmount)}
      helperText={formik.touched.payedAmount && formik.errors.payedAmount}
    />
  );
};

export default PayedAmountField;