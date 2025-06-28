import React from "react";
import { TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { differenceInDays, startOfDay } from "date-fns";
import { PV } from "@formulajs/formulajs";

const EndDateSelector = ({ values, setFieldValue, errors }) => {
    const hasError = () => !!errors?.opExpiration;
    const getErrorMessage = () => errors?.opExpiration || '';

    const handleDateChange = async (newValue) => {
        // Validación inicial
        if (typeof newValue === 'string' && isNaN(new Date(newValue).getTime())) {
            setFieldValue('opExpiration', null);
            return;
        }

        const parsedDate = newValue ? new Date(newValue) : null;
        if (!parsedDate) return;
        
    

        if (values.opDate) {
            const parsedOpDate = typeof values.opDate === 'string' 
                ? new Date(values.opDate)
                : values.opDate;
            
                if (!isNaN(parsedOpDate.getTime())) {
                const days = differenceInDays(
                    startOfDay(parsedDate),
                    startOfDay(parsedOpDate)
                );
                await setFieldValue('operationDays', Number(days), false);
    }

            const operationDays = differenceInDays(
                startOfDay(parsedDate), 
                startOfDay(parsedOpDate)
                
            );
            

            // Cálculos condicionales más robustos
            const payedAmount = Number(values.payedAmount) || 0;
            const investorTax = Number(values.investorTax) || 0;
            const discountTax = Number(values.discountTax) || 0;

            const presentValueInvestor = operationDays > 0 && payedAmount > 0
                ? Math.round(PV(investorTax / 100, operationDays / 365, 0, -payedAmount, 0))
                : payedAmount;

            const presentValueSF = operationDays > 0 && payedAmount > 0
                ? Math.round(PV(discountTax / 100, operationDays / 365, 0, -payedAmount, 0))
                : payedAmount;
            
            const investorProfitValue = Math.max(0, payedAmount - presentValueInvestor);
            
            // Actualización atómica de todos los campos
            console.log(values)

            
            setFieldValue('presentValueInvestor', presentValueInvestor);
            setFieldValue('GM', Math.round(presentValueInvestor * 0.002));
            setFieldValue('presentValueSF', presentValueSF);
            setFieldValue('commissionSF', Math.round(presentValueInvestor - presentValueSF));
            setFieldValue('investorProfit', Math.round(investorProfitValue));
            setFieldValue('investorBrokerName',values.investorBrokerInfo.investorBrokerName)
                 setFieldValue('operationDays', Number(operationDays));
                 setFieldValue('opExpiration', parsedDate);
        }
            
            
    };

    return (
        <DatePicker
            id="endDatename"
            data-testid="campo-fechaFin"
            label="Fecha Fin"
            value={values?.opExpiration}
            onChange={handleDateChange}
            inputFormat="dd/MM/yyyy"
            mask="__/__/____"
            minDate={values.probableDate || null}
            renderInput={(params) => (
                <TextField
                    {...params}
                    fullWidth
                    error={hasError()}
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

export default EndDateSelector;