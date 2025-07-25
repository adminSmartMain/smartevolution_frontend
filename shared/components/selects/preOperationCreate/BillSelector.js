// components/RegisterOperationForm.js
import React from "react";

import { TextField,  Autocomplete} from '@mui/material';

import { toast } from "react-toastify";

import { PV } from "@formulajs/formulajs";
import { parseISO,  isValid } from "date-fns";

import { differenceInDays } from "date-fns";


import ErrorIcon from '@mui/icons-material/Error'; // o cualquier otro ícono de error

export default function BillSelector ({values, setFieldValue, errors, touched, index, factura, dataBills, setFieldTouched, setFieldError, cargarFraccionFactura}) {

    return (
        <>
        <Autocomplete
                id="bill-name" // Para CSS/JS si es necesario
                data-testid="campo-factura"
                options={(values?.takedBills || [])
                .filter((factura) => factura.currentBalance > 0) // Filtrar facturas con balance > 0
                .map((factura) => ({
                label: String(factura.billId),
                value: String(factura.billId),
                id: String(factura.id),
                integrationCode: factura.integrationCode ? factura.integrationCode : "",
                }))
                }
                value={
                values.facturas[index]?.factura
                ? String(factura.billId)
                : null
                }
                isOptionEqualToValue={(option, value) => {
                return option.value === value;
                }}
                onChange={async (event, newValue) => {

                if (!newValue) {
                // 1. Obtener el billId de la factura que se está deseleccionando
                const billIdDeseleccionada = factura.billId;

                // 2. Calcular el valorFuturo que se está liberando
                const valorFuturoLiberado = factura.valorFuturo || 0;
                if(values.facturas[index].is_creada===true){
                return

                }else {
                setFieldValue(`facturas[${index}].is_creada`,false)
                }


                // 4. Buscar todas las facturas que comparten el mismo billId (incluyendo la actual)
                const facturasCompartidas = values.facturas.filter(
                f => f.billId === billIdDeseleccionada
                );

                // 5. Calcular el saldoDisponible original de la factura
                const facturaOriginal = dataBills?.data.find(f => f.billId === billIdDeseleccionada);
                const saldoOriginal = facturaOriginal?.currentBalance || 0;

                // 6. Calcular el valorFuturo total actual de todas las facturas compartidas (excluyendo la que se deselecciona)
                const valorFuturoActual = facturasCompartidas
                .filter((f, i) => i !== index) // Excluir la factura que se está deseleccionando
                .reduce((sum, f) => sum + (f.valorFuturo), 0);

                // 7. Calcular el nuevo saldoDisponible global para esta factura
                const nuevoSaldoGlobal = saldoOriginal - valorFuturoActual;

                // 8. Actualizar el saldoDisponible en TODAS las facturas compartidas
                values.facturas.forEach((f, i) => {
                if (f.billId === billIdDeseleccionada) {
                setFieldValue(`facturas[${i}].saldoDisponible`, nuevoSaldoGlobal);
                setFieldValue(`facturas[${i}].saldoDisponibleInfo`, saldoOriginal);
                }
                });

                // 9. Recalcular los montos disponibles para el inversionista (si aplica)
                if (factura.idCuentaInversionista) {
                const presentValueTotal = values.facturas
                .filter(f => 
                f.idCuentaInversionista === factura.idCuentaInversionista  

                )
                .reduce((sum, f) => sum + f.presentValueInvestor , 0);

                const montoDisponibleActualizado = factura.montoDisponibleCuenta+ factura.presentValueInvestor+factura.gastoMantenimiento ;


                values.facturas.forEach((f, i) => {

                if (f.idCuentaInversionista=== factura.idCuentaInversionista) {

                setFieldValue(`facturas[${i}].montoDisponibleCuenta`, 
                montoDisponibleActualizado
                );

                }

                });

                setFieldValue(`facturas[${index}].montoDisponibleCuenta`, 
                montoDisponibleActualizado
                );
                }
                setFieldValue(`facturas[${index}].saldoDisponible`, 
                0
                );

                // 3. Limpiar los valores de esta factura (manteniendo los datos del inversionista)
                setFieldValue('discountTax',0)
                setFieldValue(`facturas[${index}]`, {
                billId: '',
                factura: '',
                fechaEmision: '',
                valorNominal: 0,
                saldoDisponible: 0,
                valorFuturo: 0,
                amount: 0,
                payedAmount: 0,
                fraccion: 1,
                porcentajeDescuento: 0,
                nombrePagador: '',
                presentValueInvestor: 0,
                probableDate: factura.probableDate,
                presentValueSF: 0,
                investorProfit: 0,
                comisionSF: 0,
                fechaFin:factura.fechaFin,
                
                idCuentaInversionista:factura.idCuentaInversionista,
                numbercuentaInversionista: factura.numbercuentaInversionista,
                cuentaInversionista: factura.cuentaInversionista,
                nombreInversionista: factura.nombreInversionista,
                cuentasDelInversionistaSelected:factura.cuentasDelInversionistaSelected,
                investorBroker: factura.investorBroker,
                investorBrokerName: factura.investorBrokerName,
                montoDisponibleCuenta:factura.montoDisponibleCuenta+factura.presentValueInvestor+factura.gastoMantenimiento,
                montoDisponibleInfo: factura.montoDisponibleInfo,
                gastoMantenimiento: 0,
                 diasOperaciones: 1,
                operationDays: 1,
                expirationDate: "",
                });
                return;


                }


                const selectedFactura = dataBills?.data.find(f => f.billId === newValue.value);
                if (!selectedFactura) return;


               function encontrarFacturasDuplicadas(facturas, billId, inversionistaId, currentIndex) {
                  // Validaciones iniciales
                  if (!Array.isArray(facturas)) return [];
                  if (!billId || !inversionistaId) return [];

                  return facturas.filter((factura, index) => {
                      // Excluir la factura actual de la comparación (para evitar que se compare consigo misma)
                      if (index === currentIndex) return false;

                      // Verificar que la factura tenga los campos necesarios
                      if (!factura.billId || !factura.nombreInversionista) return false;

                      // Comparar billId con otras facturas (excluyendo la actual)
                      const mismoBillId = factura.billId === billId;

                      // Comparar inversionista con el seleccionado
                      const mismoInversionista = factura.nombreInversionista === inversionistaId;

                      return mismoBillId && mismoInversionista;
                  });
              }


              

                const inversionistaSeleccionado = factura.nombreInversionista// ID del inversionista seleccionado

                const facturasDuplicadas = encontrarFacturasDuplicadas(
                values.facturas, 
                newValue.id, // la factura que estás procesando actualmente
                inversionistaSeleccionado,index
                );


                if(facturasDuplicadas?.length>=1 ){

                // Mostrar error en el campo
                setFieldTouched(`facturas[${index}].nombreInversionista`, true, false);
                setFieldError(
                `facturas[${index}].nombreInversionista`,
                "No puede asignar inversionista a facturas con mismo Bill ID"
                );

                // Mostrar toast/notificación
                toast(<div style={{ display: 'flex', alignItems: 'center' }}>
                <ErrorIcon style={{ marginRight: '10px', color: '#d32f2f' }} />
                <span>No puede asignar el mismo inversionista a facturas agrupadas</span>
                </div>, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
                });


                return;


                }


                try {
                  
 // 1. Buscar TODAS las facturas con integrationCode válido
    const facturasConCodigo = values.facturas.filter(f => 
        f.integrationCode?.trim() && f.integrationCode !== "no-code"
    );

    // 2. Validación principal
    if (
        // Caso 1: Factura nueva tiene código pero no coincide con las existentes
        (selectedFactura.integrationCode?.trim() && 
         selectedFactura.integrationCode !== "no-code" &&
         facturasConCodigo.length > 0 &&
         !facturasConCodigo.every(f => f.integrationCode === selectedFactura.integrationCode))
        ||
        // Caso 2: Factura nueva no tiene código pero existen facturas con código
        (!selectedFactura.integrationCode?.trim() && 
         facturasConCodigo.length > 0)
    ) {
        // Mostrar error
        toast.error(facturasConCodigo.length > 0 
            ? `El código debe coincidir con "${facturasConCodigo[0].integrationCode}"`
            : "No se permiten facturas sin código cuando otras lo tienen"
        );
        setFieldValue(`facturas[${index}].factura`, null);
        return;
    } 
   
                     else {
                console.log('b')
                const facturaActual2 = values?.facturas[index];
                const billIdAnterior = facturaActual2?.billId;
                const valorFuturoAnterior = facturaActual2?.valorFuturo || 0;
                const nombreInversionistaAnterior = facturaActual2?.nombreInversionista;

                if(billIdAnterior  && newValue.label!=billIdAnterior  ){



                // 1. Crear lista temporal que incluye la factura actual con sus nuevos valores
                const facturasTemporales = values.facturas.map((f, i) => 
                i === index ? {
                ...f,
                billId: factura.billId,
                saldoDisponible: factura.saldoDisponible,
                presentValueInvestor: presentValueInvestor,
                montoDisponibleInfo: factura.montoDisponibleInfo
                } : f
                );



                const presentValueInvestorFacturaAnterior=facturaActual2?.presentValueInvestor
                const montoDisponibleFacturaAnterior=facturaActual2?.montoDisponibleCuenta
                const saldoDisponibleFacturaAnterior=facturaActual2?.saldoDisponible

                const saldoDisponibleNuevo= saldoDisponibleFacturaAnterior+valorFuturoAnterior   
                const montoDisponibleNuevo =montoDisponibleFacturaAnterior+presentValueInvestorFacturaAnterior

                // 3. Actualizar todas las facturas con el mismo billId (excepto la actual)
                values.facturas.forEach((f, i) => {
                if (f.billId === billIdAnterior && i !== index) {
                // Actualizar saldo disponible
                setFieldValue(`facturas[${i}].saldoDisponible`, saldoDisponibleNuevo);

                setFieldValue(`facturas[${i}].montoDisponibleCuenta`, montoDisponibleNuevo);

                }
                });


                setFieldValue(`facturas[${index}]`, {
                billId: selectedFactura.billId,
                idCuentaInversionista: factura.idCuentaInversionista,
                factura: newValue.id,
                fechaEmision: selectedFactura.dateBill,
               probableDate: factura.probableDate,
                amount: selectedFactura.currentBalance,
                payedAmount: selectedFactura.currentBalance,
                numbercuentaInversionista: factura.numbercuentaInversionista,
                cuentaInversionista: factura.cuentaInversionista,
                nombreInversionista: factura.nombreInversionista,
                investorBroker: factura.investorBroker,
                investorBrokerName: factura.investorBrokerName,
                saldoDisponible: saldoDisponibleA,
                saldoDisponibleInfo: selectedFactura.currentBalance,
                montoDisponibleCuenta:montoDisponibleFinal, // Usamos el valor calculado
                fraccion: fraccion,
                fechaFin: factura.fechaFin,
                valorNominal: valorNominalFactura || 0,
                porcentajeDescuento: Math.round((selectedFactura.currentBalance * 100) / selectedFactura.currentBalance) || 0,
                expirationDate: selectedFactura.expirationDate,
                valorFuturo: valorFuturoCalculado || 0,
                presentValueInvestor:valorFuturoCalculado,
                presentValueSF:valorFuturoCalculado|| 0,
                comisionSF,
                investorProfit: investorProfit,
                integrationCode: selectedFactura?.integrationCode ? selectedFactura?.integrationCode : "",
                isReBuy: selectedFactura?.reBuyAvailable ?? 0,
                 gastoMantenimiento:factura.applyGm ? valorFuturoCalculado*0.002 : 0,
                  diasOperaciones: 1,
                operationDays: 1,
                investorTax: values.investorTax,
                montoDisponibleInfo: factura.montoDisponibleInfo,
                cuentasDelInversionistaSelected:factura.cuentasDelInversionistaSelected,
                 applyGm:factura.applyGm,
                });


                } 


                const fractionBill = await cargarFraccionFactura(selectedFactura.id);






                // [MANTENIDO] Cálculo de fechas
                const fechaOperacion = new Date(values?.opDate);
                const expirationDate = new Date(parseISO(selectedFactura.expirationDate));

                let substractDays = 0;
                if (isValid(fechaOperacion) && isValid(expirationDate)) {
                substractDays = differenceInDays(expirationDate, fechaOperacion);

                } else {
                console.error("Error: Una de las fechas no es válida.");
                }

                // [MANTENIDO] Lógica de fracciones
                const facturaActual = newValue.id;
                let fraccion = fractionBill?.data?.fraction || 1;
                const facturasAnteriores = values.facturas.slice(0, index).filter((f) => f.factura === facturaActual);

                if (facturasAnteriores.length > 0) {
                const fraccionMasAlta = Math.max(...facturasAnteriores.map((f) => f.fraccion || 1));
                fraccion = fraccionMasAlta + 1;
                }

                // [MANTENIDO] Cálculo de saldo disponible
                let saldoDisponible = selectedFactura.currentBalance || 0;
                const valorFuturoAnteriores = facturasAnteriores.reduce((sum, f) => sum + (f.valorFuturo || 0), selectedFactura.currentBalance);
                saldoDisponible -= valorFuturoAnteriores;

                // [MANTENIDO] Determinar valor futuro
                let valorFuturoCalculado;
                if (facturasAnteriores.length > 0 && saldoDisponible <= 0) {
                valorFuturoCalculado = 0;
                saldoDisponible = 0;
                } else {
                valorFuturoCalculado = selectedFactura.currentBalance;
                }

                // [MANTENIDO] Saldo disponible anterior
                const saldoDisponibleAnterior = facturasAnteriores.find(
                (f) => f.billId === selectedFactura.billId
                )?.saldoDisponible || 0;

                const saldoDisponibleA = saldoDisponibleAnterior;

                // [MANTENIDO] Cálculo de valores presentes
                const presentValueInvestor = factura.operationDays > 0 && factura.valorFuturo > 0
                ? Math.round(PV(factura.investorTax / 100, factura.operationDays / 365, 0, factura.valorFuturo, 0) * -1)
                : selectedFactura.currentBalance;

                const presentValueSF = factura.operationDays > 0 && factura.valorFuturo > 0
                ? Math.round(PV(values.discountTax / 100, factura.operationDays / 365, 0, factura.valorFuturo, 0) * -1)
                : selectedFactura.currentBalance;

                // [MANTENIDO] Cálculo de comisiones
                const comisionSF = presentValueInvestor && presentValueSF
                ? presentValueInvestor - presentValueSF
                : 0;

                const investorProfit = presentValueInvestor ?? selectedFactura.currentBalance
                ? presentValueInvestor - selectedFactura.currentBalance : 0;

                // [MANTENIDO] Cálculo de valor nominal
                let valorNominalFactura;
                if (facturasAnteriores.length > 0 && saldoDisponible <= 0) {
                valorNominalFactura = 0;
                } else {
                valorNominalFactura = selectedFactura.currentBalance * Math.round((selectedFactura.currentBalance * 100) / selectedFactura.currentBalance) / 100;
                }

                // [SOLUCIÓN] Cálculo del monto disponible CONSISTENTE entre facturas con mismo inversionista
                let montoDisponibleFinal = 0;
                if (factura.idCuentaInversionista) {

                // 2. Filtrar facturas con mismo inversionista (incluyendo la actual modificada)
                const facturasMismoInversionista = values?.facturas.filter(
                f => f.idCuentaInversionista === factura.idCuentaInversionista
                );


                if( facturasMismoInversionista.length> 1) { // 3. Calcular total de presentValueInvestor
                const totalPresentValue = facturasMismoInversionista.reduce((sum, f) => {
                const pv = f.presentValueInvestor ;

                return sum + pv;
                }, 0);


                const totalGm = facturasMismoInversionista.reduce((sum, f) => {
                return sum + (f.gastoMantenimiento);
                }, 0);

                // 4. Calcular monto disponible común
                montoDisponibleFinal = 
                factura.montoDisponibleInfo  - totalPresentValue - totalGm-presentValueInvestor



                // 5. Actualizar TODAS las facturas con mismo inversionista

                values.facturas.forEach((f, i) => {
                if (f.idCuentaInversionista === factura.idCuentaInversionista) {
                setFieldValue(`facturas[${i}].montoDisponibleCuenta`, montoDisponibleFinal);

                }
                });

                setFieldValue(`facturas[${index}]`, {
                billId: selectedFactura.billId,
                idCuentaInversionista: factura.idCuentaInversionista,
                factura: newValue.id,
                fechaEmision: selectedFactura.dateBill,
                probableDate: factura.probableDate,
                amount: selectedFactura.currentBalance,
                payedAmount: selectedFactura.currentBalance,
                numbercuentaInversionista: factura.numbercuentaInversionista,
                cuentaInversionista: factura.cuentaInversionista,
                nombreInversionista: factura.nombreInversionista,
                investorBroker: factura.investorBroker,
                investorBrokerName: factura.investorBrokerName,
                saldoDisponible: Math.round( saldoDisponibleA),
                saldoDisponibleInfo: Math.round(selectedFactura.currentBalance),
                montoDisponibleCuenta:montoDisponibleFinal,
                fraccion: fraccion,
                fechaFin: factura.fechaFin,
                valorNominal:Math.round( valorNominalFactura) || 0,
                porcentajeDescuento: Math.round((selectedFactura.currentBalance * 100) / selectedFactura.currentBalance)|| 0,
                expirationDate: selectedFactura.expirationDate,
                valorFuturo:  Math.round(valorFuturoCalculado)|| 0,
                presentValueInvestor:Math.round(valorFuturoCalculado)|| 0,
                presentValueSF:Math.round(valorFuturoCalculado|| 0),
                comisionSF,
                investorProfit: investorProfit,
                integrationCode: selectedFactura?.integrationCode ? selectedFactura?.integrationCode : "",
                isReBuy: selectedFactura?.reBuyAvailable ?? 0,
                  gastoMantenimiento:factura.applyGm ? valorFuturoCalculado*0.002 : 0,
                  diasOperaciones: 1,
                operationDays: 1,
                investorTax: values.investorTax,
                montoDisponibleInfo: factura.montoDisponibleInfo,
                cuentasDelInversionistaSelected:factura.cuentasDelInversionistaSelected,
                })}else{
                // Caso sin inversionista: cálculo individual
                const montoDisponibleFinal = 
                factura.montoDisponibleInfo - presentValueInvestor
                // [MANTENIDO] Asignación final de valores
                setFieldValue(`facturas[${index}]`, {
                billId: selectedFactura.billId,
                idCuentaInversionista: factura.idCuentaInversionista,
                factura: newValue.id,
                fechaEmision: selectedFactura.dateBill,
                probableDate: factura.probableDate,
                amount: selectedFactura.currentBalance,
                payedAmount: selectedFactura.currentBalance,
                numbercuentaInversionista: factura.numbercuentaInversionista,
                cuentaInversionista: factura.cuentaInversionista,
                nombreInversionista: factura.nombreInversionista,
                investorBroker: factura.investorBroker,
                investorBrokerName: factura.investorBrokerName,
                saldoDisponible: Math.round( saldoDisponibleA),
                saldoDisponibleInfo: Math.round(selectedFactura.currentBalance),
                montoDisponibleCuenta:montoDisponibleFinal, // Usamos el valor calculado
                fraccion: fraccion,
                fechaFin: factura.fechaFin,
                valorNominal: Math.round(valorNominalFactura)|| 0,
                porcentajeDescuento: Math.round((selectedFactura.currentBalance * 100) / selectedFactura.currentBalance)|| 0,
                expirationDate: selectedFactura.expirationDate,
                valorFuturo: Math.round(valorFuturoCalculado),
                presentValueInvestor:Math.round(valorFuturoCalculado),
                presentValueSF:Math.round(valorFuturoCalculado|| 0),
                comisionSF,
                investorProfit: investorProfit,
                integrationCode: selectedFactura?.integrationCode ? selectedFactura?.integrationCode : "",
                isReBuy: selectedFactura?.reBuyAvailable ?? 0,
                 gastoMantenimiento: factura.applyGm ? valorFuturoCalculado*0.002 : 0,
                 diasOperaciones: 1,
                operationDays: 1,
                investorTax: values.investorTax,
                montoDisponibleInfo: factura.montoDisponibleInfo,
                cuentasDelInversionistaSelected:factura.cuentasDelInversionistaSelected,
                 applyGm:factura.applyGm,
                });
                }






                } else {

                // Caso sin inversionista: cálculo individual
                const montoDisponibleFinal = 
                factura.montoDisponibleInfo - presentValueInvestor
                // [MANTENIDO] Asignación final de valores
                setFieldValue(`facturas[${index}]`, {
                billId: selectedFactura.billId,
                idCuentaInversionista: factura.idCuentaInversionista,
                factura: newValue.id,
                fechaEmision: selectedFactura.dateBill,
                probableDate: factura.probableDate,
                amount: selectedFactura.currentBalance,
                payedAmount: selectedFactura.currentBalance,
                numbercuentaInversionista: factura.numbercuentaInversionista,
                cuentaInversionista: factura.cuentaInversionista,
                nombreInversionista: factura.nombreInversionista,
                investorBroker: factura.investorBroker,
                investorBrokerName: factura.investorBrokerName,
                saldoDisponible:Math.round( saldoDisponibleA),
                saldoDisponibleInfo:Math.round( selectedFactura.currentBalance),
                montoDisponibleCuenta:montoDisponibleFinal, // Usamos el valor calculado
                fraccion: fraccion,
                fechaFin: factura.fechaFin,
                valorNominal: Math.round(valorNominalFactura)|| 0,
                porcentajeDescuento: Math.round((selectedFactura.currentBalance * 100) / selectedFactura.currentBalance),
                expirationDate: selectedFactura.expirationDate,
                valorFuturo: Math.round(valorFuturoCalculado),
                presentValueInvestor:Math.round(valorFuturoCalculado),
                presentValueSF:Math.round(valorFuturoCalculado|| 0),
                comisionSF,
                investorProfit: investorProfit,
                integrationCode: selectedFactura?.integrationCode ? selectedFactura?.integrationCode : "",
                isReBuy: selectedFactura?.reBuyAvailable ?? 0,
                 gastoMantenimiento:factura.applyGm ? valorFuturoCalculado*0.002 : 0,
                  diasOperaciones: 1,
                operationDays: 1,
                investorTax: values.investorTax,
                montoDisponibleInfo: factura.montoDisponibleInfo,
                cuentasDelInversionistaSelected:factura.cuentasDelInversionistaSelected,
                 applyGm:factura.applyGm,
                });
                }




                }
                } catch (error) {
                console.error("Error al cargar los datos:", error);
                }
                }}
                renderInput={(params) => (
                <TextField
                {...params}
                label="Número de Factura *"
                fullWidth
                name="billId"
                error={touched.facturas?.[index]?.billId && Boolean(errors?.facturas?.[index]?.billId)}
                helperText={
                ` ${factura.isReBuy ? "Disponible Recompra" : "No disponible Recompra"}`
                }
                />
                )}

             /> 
        </>
 
    )
       


}
