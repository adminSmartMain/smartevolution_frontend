// components/RegisterOperationForm.js
import React from "react";

import { InputAdornment, TextField } from '@mui/material';
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"; // Icono del dólar

import { PV } from "@formulajs/formulajs";


export default function ValorNominalSelector({calcularPorcentajeDescuento,factura, index, setFieldValue, values, errors, touched,formatNumberWithThousandsSeparator}) {

return(
    <>
     <TextField
            id="payedAmountname" // Para CSS/JS si es necesario
            data-testid="campo-payedAmount"
            label="Valor Nominal"
            fullWidth
            name="valorNominal"
            value={factura.valorNominal ? formatNumberWithThousandsSeparator(factura.valorNominal) : 0} // Valor predeterminado 0
            onChange={(e) => {
            // Manejo del valor nominal
            const rawValue = e.target.value.replace(/[^\d]/g, "");
            let nuevoValorNominal = parseFloat(rawValue) || 0;
            const valorFuturo = factura.valorFuturo || 0;


            if (nuevoValorNominal > valorFuturo) {
            nuevoValorNominal = valorFuturo;
            }

            // Actualizar valor nominal
            setFieldValue(`facturas[${index}].valorNominal`, nuevoValorNominal);
            setFieldValue(`facturas[${index}].payedAmount`, nuevoValorNominal);
            setFieldValue(`facturas[${index}].valorNominalManual`, true);

            // Cálculo de investorProfit
            const presentValueInvestor = factura.presentValueSF || 0;
            const nuevoInvestorProfit =  nuevoValorNominal -presentValueInvestor;
            setFieldValue(`facturas[${index}].investorProfit`, Number(nuevoInvestorProfit).toFixed(0));

            // Cálculo porcentaje descuento
            const nuevoPorcentajeDescuento = calcularPorcentajeDescuento(valorFuturo, nuevoValorNominal);
            setFieldValue(`facturas[${index}].porcentajeDescuento`, nuevoPorcentajeDescuento);

            // Recalcular valores si hay fecha de operación
            if (values.opDate) {
            const operationDays = factura.operationDays;

            // Cálculo de presentValueInvestor y presentValueSF
            const newPresentValueInvestor = operationDays > 0 && nuevoValorNominal > 0
            ? Math.round(PV(values.investorTax / 100, operationDays / 365, 0, -nuevoValorNominal, 0) )
            : nuevoValorNominal;

            const newPresentValueSF = operationDays > 0 && nuevoValorNominal > 0
            ? Math.round(PV(values.discountTax / 100, operationDays / 365, 0, -nuevoValorNominal, 0) )
            : nuevoValorNominal;



            // Actualizar valores calculados
            setFieldValue(`facturas[${index}].presentValueInvestor`, newPresentValueInvestor);
            if(values.facturas[index].applyGm) {
            setFieldValue(`facturas[${index}].gastoMantenimiento`, presentValueInvestor * 0.002);
            } else {
            setFieldValue(`facturas[${index}].gastoMantenimiento`, 0);} 
            setFieldValue(`facturas[${index}].presentValueSF`, newPresentValueSF);
            setFieldValue(`facturas[${index}].comisionSF`, newPresentValueInvestor-newPresentValueSF || 0);
            setFieldValue(`facturas[${index}].investorProfit`,Number(nuevoValorNominal- newPresentValueSF).toFixed(0));
            // Lógica para montoDisponibleCuenta compartido entre facturas con mismo inversionista
            if (factura.idCuentaInversionista) {
            // 1. Obtener todas las facturas con mismo inversionista (incluyendo la actual)
            const facturasMismoInversionista = values.facturas
                .map((f, i) => i === index ? {
                ...f,
                presentValueInvestor: newPresentValueInvestor,
                gastoMantenimiento: factura.gastoMantenimiento || 0
                } : f)
                .filter(f => f.idCuentaInversionista === factura.idCuentaInversionista);

            // 2. Calcular total de presentValueInvestor y gastoMantenimiento
            const totalPV = facturasMismoInversionista.reduce((sum, f) => sum + f.presentValueInvestor, 0);
            const totalGM = facturasMismoInversionista.reduce((sum, f) => sum + (f.gastoMantenimiento || 0), 0);

            // 3. Calcular monto disponible común
            const montoDisponibleComun = factura.montoDisponibleInfo - totalPV - totalGM;

            // 4. Actualizar todas las facturas con mismo inversionista
            values.facturas.forEach((f, i) => {
                if (f.idCuentaInversionista === factura.idCuentaInversionista) {
                setFieldValue(`facturas[${i}].montoDisponibleCuenta`, montoDisponibleComun);
                }
            });
            } else {
            // Caso sin inversionista: cálculo individual
            const montoIndividual = factura.montoDisponibleInfo - newPresentValueInvestor - (factura.gastoMantenimiento || 0);
            setFieldValue(`facturas[${index}].montoDisponibleCuenta`, montoIndividual);
            }
            }
            }}                                      onFocus={(e) => {
            // Al hacer foco, eliminamos el formato para permitir la edición del valor numérico
            e.target.value = factura.valorNominal ? factura.valorNominal.toString() : "";
            }}
            onBlur={(e) => {
            // Al perder el foco, aplicar el formato de separadores de miles y asegurarse que sea un número entero
            const rawValue = e.target.value.replace(/[^\d]/g, ""); // Permitir borrar completamente
            const valorNominal = parseFloat(rawValue) || 0;
            setFieldValue(`facturas[${index}].valorNominal`, valorNominal);
            setFieldValue(`facturas[${index}].payedAmount`, valorNominal);
            }}
            placeholder={`Sugerido: ${factura.valorFuturo && factura.porcentajeDescuento !== undefined ? formatNumberWithThousandsSeparator(Math.floor(factura.valorFuturo * (1 - (factura.porcentajeDescuento / 100)))) : ""}`} // Aquí se calcula el valor nominal sugerido

            helperText={
            !factura.valorNominalManual
            ? `Sugerido: ${factura.valorFuturo && factura.porcentajeDescuento !== undefined ? formatNumberWithThousandsSeparator(Math.floor(factura.valorFuturo * (1 - (factura.porcentajeDescuento / 100)))) : ""}`
            : "Valor ingresado manualmente"
            } //QUITAR
            InputProps={{
            startAdornment: (
            <InputAdornment position="start">
            <AttachMoneyIcon style={{ color: 'rgb(94, 163, 163)', fontSize: '1.2rem' }} />
            </InputAdornment>
            ),
            }}

            error={touched.facturas?.[index]?.valorNominal && Boolean(errors.facturas?.[index]?.valorNominal)}
            />
    </>
)


}