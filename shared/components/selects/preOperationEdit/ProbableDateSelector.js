import React from "react";
import { TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { isAfter, isSameDay, parseISO } from "date-fns";

const ProbableDateSelector = ({ values,  errors, setFieldValue}) => {
    // Función para determinar si hay error
    const hasError = () => {
        // Error de Yup validation
        if (errors?.probableDate) {
            return true;
        }
        
      
    };

    // Función para obtener el mensaje de error
    const getErrorMessage = () => {
        if (errors?.probableDate) {
            return errors.probableDate;
        }
        
      
    };
    const handleDateChange = (newValue) => {
       
        const parsedDate = newValue ? new Date(newValue) : null;
       
        if (!parsedDate) return;
        
        setFieldValue(`probableDate`, parsedDate);
   


      
    };



    return (
        <DatePicker
            id={`probDate-name`}
            data-testid={`campo-fechaProbable`}
            label="Fecha probable"
            value={values?.probableDate}
             onChange={handleDateChange}
            inputFormat="dd/MM/yyyy"
            mask="__/__/____"
            minDate={values.opDate ?values.opDate : null} // Permite seleccionar la misma fecha
            renderInput={(params) => (
                <TextField
                    {...params}
                    fullWidth
                    errors={hasError()}
                    helperText={getErrorMessage()}
                    onKeyDown={(e) => {
                        if (!/[0-9/]/.test(e.key) && 
                            !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
                            e.preventDefault();
                        }
                    }}
                />
            )}
            OpenPickerButtonProps={{
                'aria-label': 'Seleccionar fecha',
            }}
            componentsProps={{
                actionBar: {
                    actions: ['clear', 'accept'],
                },
            }}
        />
    );
};

export default ProbableDateSelector;