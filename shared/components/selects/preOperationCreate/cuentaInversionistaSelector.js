
// components/RegisterOperationForm.js
import React from "react";

import {TextField, Autocomplete } from '@mui/material';


export default function CuentaInversionistaSelector ({index,factura,values,setFieldValue,parseFloat,touched,errors}){

    return (
            <>
                    <Autocomplete
                    id="investorAccountname" // Para CSS/JS si es necesario
                    data-testid="campo-investorAccount"
                    options={factura.cuentasDelInversionistaSelected || []}
                    getOptionLabel={(option) => option?.account_number || option?.number || option?.id || ''}
                    value={
                    (factura.cuentasDelInversionistaSelected || []).find(
                    account => account?.id === factura.idCuentaInversionista
                    ) || null
                    }
                    onChange={(event, newValue) => {
                    // 1. Actualizar los campos básicos de la cuenta
                    const accountId = newValue?.id || '';
                    const accountNumber = newValue?.account_number || newValue?.number || '';
                    const accountBalance = newValue?.balance || 0;




                    if (!newValue) {
                    if(values.facturas[index].is_creada===true){

                       // 1. Obtener el accountId de la factura que se está deseleccionando
                    const cuentaIdDeseleccionada = factura.idCuentaInversionista;

                    // 2. Calcular el valor que se está liberando (PV + GM)
                    const valorLiberado = (factura.presentValueInvestor || 0) + (factura.gastoMantenimiento || 0);


                    // 4. Buscar facturas con el mismo inversionista
                    const facturasMismoInversionista = values.facturas.filter(
                    f => f.idCuentaInversionista === cuentaIdDeseleccionada
                    );

                    // 5. Distribuir el valor liberado a las otras facturas del mismo inversionista
                    facturasMismoInversionista.forEach((f, i) => {
                    if (factura.idCuentaInversionista === cuentaIdDeseleccionada) {
                    // Calcular nuevo monto disponible sumando el valor liberado

                    const nuevoMontoDisponible = (f.montoDisponibleCuenta || 0) + valorLiberado;

                    setFieldValue(`facturas[${i}].montoDisponibleCuenta`, nuevoMontoDisponible);
                    }
                    });
                    // 3. Limpiar los valores de esta factura (manteniendo los datos del inversionista)
                    setFieldValue(`facturas[${index}]`, {
                    billId: factura.billId,
                    factura: factura.factura,
                    fechaEmision: factura.fechaEmision,
                    valorNominal: factura.valorNominal,
                    saldoDisponible: factura.saldoDisponible,
                    saldoDisponibleInfo: factura.saldoDisponibleInfo,
                    valorFuturo: factura.valorFuturo,
                    amount: factura.amount,
                    payedAmount: factura.payedAmount,
                    fraccion: factura.fraccion,
                    porcentajeDescuento: factura.porcentajeDescuento,
                    nombrePagador: values.nombrePagador,
                    presentValueInvestor: factura.presentValueInvestor,
                    presentValueSF: factura.presentValueSF,
                    investorProfit: factura.investorProfit || 0,
                    comisionSF: factura.comisionSF || 0,
                    numbercuentaInversionista: '',
                    cuentaInversionista: '',
                    cuentasDelInversionistaSelected:factura.cuentasDelInversionistaSelected,
                    nombreInversionista: factura.nombreInversionista,
                    investorBroker: factura.investorBroker,
                    investorBrokerName: factura.investorBrokerName,
                    montoDisponibleCuenta: -factura.presentValueInvestor - factura.gastoMantenimiento,
                    montoDisponibleInfo: 0,
                    gastoMantenimiento: factura.gastoMantenimiento,
                    operationDays: factura.operationDays,
                    idCuentaInversionista: '',
                    numbercuentaInversionista: '',
                    cuentaInversionista: factura.cuentaInversionista,
                    is_creada:true,
                    probableDate:factura.probableDate,
                    fechaFin:factura.fechaFin
                    });

                    return

                    }
                    
                    else {
                    setFieldValue(`facturas[${index}].is_creada`,false)
                    }
                    // 1. Obtener el accountId de la factura que se está deseleccionando
                    const cuentaIdDeseleccionada = factura.idCuentaInversionista;

                    // 2. Calcular el valor que se está liberando (PV + GM)
                    const valorLiberado = (factura.presentValueInvestor || 0) + (factura.gastoMantenimiento || 0);


                    // 4. Buscar facturas con el mismo inversionista
                    const facturasMismoInversionista = values.facturas.filter(
                    f => f.idCuentaInversionista === cuentaIdDeseleccionada
                    );

                    // 5. Distribuir el valor liberado a las otras facturas del mismo inversionista
                    facturasMismoInversionista.forEach((f, i) => {
                    if (factura.idCuentaInversionista === cuentaIdDeseleccionada) {
                    // Calcular nuevo monto disponible sumando el valor liberado

                    const nuevoMontoDisponible = (f.montoDisponibleCuenta || 0) + valorLiberado;

                    setFieldValue(`facturas[${i}].montoDisponibleCuenta`, nuevoMontoDisponible);
                    }
                    });
                    // 3. Limpiar los valores de esta factura (manteniendo los datos del inversionista)
                    setFieldValue(`facturas[${index}]`, {
                    billId: factura.billId,
                    factura: factura.factura,
                    fechaEmision: factura.fechaEmision,
                    valorNominal: factura.valorNominal,
                    saldoDisponible: factura.saldoDisponible,
                    saldoDisponibleInfo: factura.saldoDisponibleInfo,
                    valorFuturo: factura.valorFuturo,
                    amount: factura.amount,
                    payedAmount: factura.payedAmount,
                    fraccion: factura.fraccion,
                    porcentajeDescuento: factura.porcentajeDescuento,
                    nombrePagador: values.nombrePagador,
                    presentValueInvestor: factura.presentValueInvestor,
                    presentValueSF: factura.presentValueSF,
                    investorProfit: factura.investorProfit || 0,
                    comisionSF: factura.comisionSF || 0,
                    numbercuentaInversionista: '',
                    cuentaInversionista: '',
                    cuentasDelInversionistaSelected:factura.cuentasDelInversionistaSelected,
                    nombreInversionista: factura.nombreInversionista,
                    investorBroker: factura.investorBroker,
                    investorBrokerName: factura.investorBrokerName,
                    montoDisponibleCuenta: -factura.presentValueInvestor - factura.gastoMantenimiento,
                    montoDisponibleInfo: 0,
                    gastoMantenimiento: factura.gastoMantenimiento,
                    operationDays: factura.operationDays,
                    idCuentaInversionista: '',
                    numbercuentaInversionista: '',
                    cuentaInversionista: factura.cuentaInversionista,
                    probableDate:factura.probableDate,
                    fechaFin:factura.fechaFin,
                    });

                    return;
                    }
                    setFieldValue(`facturas[${index}].idCuentaInversionista`, accountId);
                    setFieldValue(`facturas[${index}].numbercuentaInversionista`, accountNumber);

                    setFieldValue(`facturas[${index}].montoDisponibleInfo`, accountBalance);

                    // 2. Calcular el nuevo saldo disponible
                    const facturasMismoInversionista = values.facturas.filter(
                    f => f.idCuentaInversionista === accountId
                    );


                    facturasMismoInversionista.push(factura)
                    // Caso 1: Solo esta factura usa la cuenta
                    if (facturasMismoInversionista.length <= 1) {

                    const pVI = parseFloat(factura.presentValueInvestor) || 0;
                    const gm = parseFloat(factura.gastoMantenimiento) || 0;
                    const nuevoSaldo = accountBalance - (pVI + gm);
                    setFieldValue(`facturas[${index}].montoDisponibleCuenta`, nuevoSaldo);
                    } 
                    // Caso 2: Múltiples facturas comparten la misma cuenta
                    else {


                    const totalPVIGM = facturasMismoInversionista.reduce((sum, f) => {
                    const pVI = parseFloat(f.presentValueInvestor)|| 0;
                    const gm = parseFloat(f.gastoMantenimiento) || 0;
                    return sum + (pVI + gm);
                    }, 0);

                    const nuevoSaldo = accountBalance - totalPVIGM;

                    // Actualizar todas las facturas que comparten esta cuenta
                    values.facturas.forEach((f, i) => {
                    if (f.idCuentaInversionista === accountId) {

                    setFieldValue(`facturas[${i}].montoDisponibleCuenta`, nuevoSaldo);
                    setFieldValue(`facturas[${index}].montoDisponibleCuenta`, nuevoSaldo);
                    }
                    });
                    }

                    }}
                    renderInput={(params) => (
                    <TextField
                    {...params}
                    label="Cuenta Inversionista*"
                    fullWidth
                    variant="outlined"
                    error={touched.facturas?.[index]?.numbercuentaInversionista && 
                    Boolean(errors.facturas?.[index]?.numbercuentaInversionista)}
                    helperText={touched.facturas?.[index]?.numbercuentaInversionista && 
                    errors.facturas?.[index]?.numbercuentaInversionista}
                    />
                    )}
                    isOptionEqualToValue={(option, value) => option.id === value?.id}
                    noOptionsText="No hay cuentas disponibles"
                    disabled={!factura.cuentasDelInversionistaSelected || factura.cuentasDelInversionistaSelected.length === 0}
                    />
                </>
        
    )

}