import React, { useState, useEffect } from 'react';
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { TextField } from "@mui/material";

const DatePickerWithManualInput = ({ formik, data }) => {
  const [inputValue, setInputValue] = useState('');

  // Inicializar con el valor de formik o data.opDate
  useEffect(() => {
    if (formik.values.date) {
      const [year, month, day] = formik.values.date.split('-');
      setInputValue(`${day}/${month}/${year}`);
    } else if (data?.opDate) {
      const [year, month, day] = data.opDate.split('-');
      setInputValue(`${day}/${month}/${year}`);
      formik.setFieldValue("date", data.opDate);
    }
  }, [formik.values.date, data?.opDate]);

  // Manejar cambio desde el DatePicker (selección de calendario)
  const handleDatePickerChange = (date) => {
    if (date instanceof Date && !isNaN(date.getTime())) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      
      const displayDate = `${day}/${month}/${year}`;
      const storageDate = `${year}-${month}-${day}`;
      
      setInputValue(displayDate);
      formik.setFieldValue('date', storageDate);
    }
  };

  // Manejar escritura manual y ENTER
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      validateAndSaveInput(inputValue);
      e.preventDefault();
    }
  };

  // Manejar blur (cuando pierde el foco)
  const handleBlur = () => {
    validateAndSaveInput(inputValue);
  };

  // Validar y guardar el input manual
  const validateAndSaveInput = (value) => {
    if (!value.trim()) {
      formik.setFieldValue('date', '');
      return;
    }

    // Validar formato DD/MM/YYYY
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
      formik.setFieldError('date', 'Formato inválido. Use DD/MM/YYYY');
      return;
    }

    const [day, month, year] = value.split('/').map(Number);
    const dateObj = new Date(year, month - 1, day);

    // Validar fecha
    if (
      dateObj.getFullYear() !== year ||
      dateObj.getMonth() !== month - 1 ||
      dateObj.getDate() !== day
    ) {
      formik.setFieldError('date', 'Fecha inválida');
      return;
    }

    // Validar fecha mínima
    const minDate = data?.opDate ? new Date(data.opDate) : null;
    if (minDate && dateObj < minDate) {
      formik.setFieldError('date', `No puede ser anterior al ${minDate.toLocaleDateString('es-ES')}`);
      return;
    }

    // Guardar en formato YYYY-MM-DD
    const storageDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    formik.setFieldValue('date', storageDate);
    formik.setFieldError('date', '');
  };

  // Manejar cambio manual en el input
  const handleInputChange = (e) => {
    let value = e.target.value;
    
    // Permitir solo números y slash
    value = value.replace(/[^\d/]/g, '');
    
    // Aplicar máscara DD/MM/YYYY automáticamente
    if (value.length === 2 && !value.includes('/')) {
      value += '/';
    } else if (value.length === 5 && value.split('/').length === 2) {
      value += '/';
    }
    
    // Limitar a 10 caracteres
    if (value.length > 10) {
      value = value.substring(0, 10);
    }
    
    setInputValue(value);
  };

  const hasError = formik.touched.date && Boolean(formik.errors.date);

  return (
    <DesktopDatePicker
      label="Fecha de aplicación"
      inputFormat="DD/MM/YYYY"
      value={formik.values.date ? new Date(formik.values.date) : null}
      onChange={handleDatePickerChange}
      minDate={data?.opDate ? new Date(data.opDate) : null}
      renderInput={(params) => (
        <TextField
          {...params}
          id="date"
          placeholder="DD/MM/YYYY"
          name="date"
          label="Fecha de aplicación"
          fullWidth
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onKeyPress={handleKeyPress}
          error={hasError}
          helperText={hasError ? formik.errors.date : ''}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': hasError ? {
                borderColor: '#E6643180',
                borderWidth: '1.4px'
              } : {}
            }
          }}
        />
      )}
    />
  );
};

export default DatePickerWithManualInput;