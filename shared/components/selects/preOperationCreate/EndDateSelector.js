import React from "react";
import { TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { differenceInDays, startOfDay, isAfter, format,addDays } from "date-fns";
import { PV } from "@formulajs/formulajs";
import {  parseISO } from "date-fns";
const EndDateSelector = ({ factura, values, setFieldValue, touched, errors, index }) => {
  
    const hasError = () => {
        // Error de validación Yup
        if (errors?.facturas?.[index]?.fechaFin) {
            return true;
        }
        
  
    };

    const getErrorMessage = () => {
        if (errors?.facturas?.[index]?.fechaFin) {
            return errors.facturas[index].fechaFin;
        }
        
      
    };

    const handleDateChange = (newValue) => {
        const parsedDate = newValue ? new Date(newValue) : null;
        if (!parsedDate) return;
        
        setFieldValue(`facturas[${index}].fechaFin`, parsedDate);
        console.log("Operation Days:", parsedDate,values.opDate);


        if (values.opDate) {

  // SIMPLE FIX: Ensure both are Date objects
        const parsedOpDate = typeof values.opDate === 'string' 
            ? new Date(values.opDate) // Directly use Date constructor
            : values.opDate;
        
        // Safety check
        if (isNaN(parsedOpDate.getTime())) {
            console.error('Invalid opDate:', values.opDate);
            return;
        }

        const operationDays = differenceInDays(
            startOfDay(parsedDate), 
            startOfDay(parsedOpDate)
        );
        
            
            
            setFieldValue(`facturas[${index}].operationDays`, operationDays);
            
            const presentValueInvestor = operationDays > 0 && factura.valorNominal > 0
                ? Math.round(PV(values.investorTax / 100, operationDays / 365, 0, -factura.valorNominal, 0))
                : factura.valorFuturo;

            const presentValueSF = operationDays > 0 && factura.valorNominal > 0
                ? Math.round(PV(values.discountTax / 100, operationDays / 365, 0, -factura.valorNominal, 0))
                : factura.currentBalance;
            
            const investorProfitValue = Number.isNaN(Number(factura.valorNominal - presentValueInvestor)) 
                ? 0 
                : Number((factura.valorNominal - presentValueInvestor).toFixed(0));
            
            setFieldValue(`facturas[${index}].presentValueInvestor`, presentValueInvestor || 0);
            setFieldValue(`facturas[${index}].gastoMantenimiento`, presentValueInvestor*0.002 || 0);
            setFieldValue(`facturas[${index}].presentValueSF`, presentValueSF || 0);
            setFieldValue(`facturas[${index}].comisionSF`, presentValueInvestor - presentValueSF || 0);
            setFieldValue(`facturas[${index}].investorProfit`, investorProfitValue.toFixed(0) || 0);

            // Actualizar montos disponibles
            const totalPresentValue = values.facturas
                .filter(f => f.idCuentaInversionista === factura.idCuentaInversionista)
                .reduce((sum, f) => sum + (f.presentValueInvestor || 0), 0);

            const montoDisponibleGlobal = factura.montoDisponibleInfo - totalPresentValue;
            
            values.facturas.forEach((f, i) => {
                if (f.idCuentaInversionista === factura.idCuentaInversionista) {
                    setFieldValue(`facturas[${i}].montoDisponibleCuenta`, montoDisponibleGlobal);
                }
            });
        }
    };

    return (
        <DatePicker
            id={`endDatename-${index}`}
            data-testid={`campo-fechaFin-${index}`}
            label="Fecha Fin"
            value={factura.fechaFin}
            onChange={handleDateChange}
            inputFormat="dd/MM/yyyy"
            mask="__/__/____"
            minDate={factura.probableDate ? new Date(factura.probableDate) : null}
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

export default EndDateSelector;