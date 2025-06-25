import React from 'react';


import { TextField } from '@mui/material';

import { toast } from "react-toastify";

import { PV } from "@formulajs/formulajs";
import { parseISO } from "date-fns";

import { differenceInDays } from "date-fns";


import ErrorIcon from '@mui/icons-material/Error'; // o cualquier otro ícono de error

export default function BillManualSelector({values, setFieldValue, errors, touched, index, factura, dataBills, setBillExists, debouncedCheckBill}) {

return (
<>
<TextField
        id="codigoFactura"
        label="Código Factura *"
        fullWidth
        value={values?.facturas[index]?.billId || ''}
        error={touched?.facturas?.[index]?.billId && Boolean(errors?.facturas?.[index]?.billId)}
        helperText={touched?.facturas?.[index]?.billId && errors?.facturas?.[index]?.billId}
        InputProps={{
             inputProps: {
      maxLength: 25  // Límite HTML nativo como respaldo
    },
        disableUnderline: true,
        sx: { marginTop: "0px" }
        }}



        onChange={async (event) => {
            
        const newValue = event.target.value
        const handleBillChange = async (event, index) => {
        const newValue = event.target.value;

        // Actualización local inmediata
        const updatedFacturas = [...values.facturas];
        updatedFacturas[index] = { ...updatedFacturas[index], billId: newValue };
        console.log(updatedFacturas)
        setFieldValue(`facturas[${index}].is_creada`, true);
        setFieldValue(`facturas[${index}]`, updatedFacturas[index]);

        // Validación con debounce (solo si tiene longitud válida)
        if (newValue.length > 3) { // Ajusta este mínimo según necesites
        debouncedCheckBill(newValue, (exists) => {
        setBillExists(exists);
        if (exists) {
        toast.error(`La actura ${newValue} ya existe`);
        // Opcional: Limpiar los campos si la factura existe
        setFieldValue(`facturas[${index}].billId`, '');
        setFieldValue(`facturas[${index}].billCode`, '');
        setFieldValue(`facturas[${index}].factura`, '');
        }
        });
        }
        };
        handleBillChange(event, index)
        // Primero actualiza el valor en el formulario para que el usuario pueda escribir
        setFieldValue(`facturas[${index}].billId`, newValue);
        setFieldValue(`facturas[${index}].billCode`, newValue);
        setFieldValue(`facturas[${index}].factura`, newValue);


        /////////
        if (!newValue) {

        // 1. Obtener el billId de la factura que se está deseleccionando
        const billIdDeseleccionada = factura.billId;


        if(values?.facturas[index].is_creada===true){
        return

        }else {
        setFieldValue(`facturas[${index}].is_creada`,false)
        }
        // 4. Buscar todas las facturas que comparten el mismo billId (incluyendo la actual)
        const facturasCompartidas = values?.facturas.filter(
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
        values?.facturas.forEach((f, i) => {
        if (f.billId === billIdDeseleccionada) {
        setFieldValue(`facturas[${i}].saldoDisponible`, nuevoSaldoGlobal);
        setFieldValue(`facturas[${i}].saldoDisponibleInfo`, saldoOriginal);
        }
        });

        // 9. Recalcular los montos disponibles para el inversionista (si aplica)
        if (factura.idCuentaInversionista) {
        const presentValueTotal = values?.facturas
        .filter(f => 
        f.idCuentaInversionista === factura.idCuentaInversionista  

        )
        .reduce((sum, f) => sum + f.presentValueInvestor , 0);

        const montoDisponibleActualizado = factura.montoDisponibleCuenta+ factura.presentValueInvestor+factura.gastoMantenimiento ;


        values?.facturas.forEach((f, i) => {

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
        setFieldValue(`facturas[${index}]`, {
        is_creada:true,
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
        presentValueSF: 0,
        investorProfit: 0,
        comisionSF: 0,
        fechaFin:factura.fechaFin,
        idCuentaInversionista:factura.idCuentaInversionista,
        numbercuentaInversionista: factura.numbercuentaInversionista,
        cuentaInversionista: factura.cuentaInversionista,
        nombreInversionista: factura.nombreInversionista,
        investorBroker: factura.investorBroker,
        investorBrokerName: factura.investorBrokerName,
        montoDisponibleCuenta:factura.montoDisponibleCuenta+factura.presentValueInvestor+factura.gastoMantenimiento,
        montoDisponibleInfo: factura.montoDisponibleInfo,
        gastoMantenimiento: 0,
        operationDays: 0,
        expirationDate: "",
        billCode:"",
         applyGm:factura.applyGm,
        });
        return;


        }
        ///////////////////////////////////////////////////////////////////////////////////////////////////


        const selectedFactura = values?.facturas.find(f => f.billId === newValue);

        if (!selectedFactura) return;




        function encontrarFacturasMismoBillIdYInversionista(facturas, billId, inversionistaId) {
        // Validaciones iniciales


        if (!Array.isArray(facturas)) {
        console.warn('El parámetro facturas no es un array');
        return [];
        }

        if (!billId || !inversionistaId) {
        console.warn(billId ? 'Falta inversionistaId' : 'Falta billId');
        return [];
        }

        return facturas.filter(factura => {
        if (!factura?.billId || !factura?.nombreInversionista) return false;

        const esMismoBillId = String(factura.billId) === String(billId);
        const esMismoInversionista = String(factura.nombreInversionista) === String(inversionistaId);



        return esMismoBillId && esMismoInversionista;
        });
        }



        const inversionistaSeleccionado = factura.nombreInversionista// ID del inversionista seleccionado

        const facturasDuplicadas = encontrarFacturasMismoBillIdYInversionista(
        values?.facturas, 
        newValue, // la factura que estás procesando actualmente
        inversionistaSeleccionado
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

        /////////////////////////////////////////////////////////////////
        try {



        const facturaActual2 = values?.facturas[index-1];

        const billIdAnterior = facturaActual2?.billId;
        const valorFuturoAnterior = facturaActual2?.valorFuturo || 0;
        const nombreInversionistaAnterior = facturaActual2?.nombreInversionista;

        if(billIdAnterior  && newValue!=billIdAnterior  ){







        const presentValueInvestorFacturaAnterior=facturaActual2?.presentValueInvestor
        const montoDisponibleFacturaAnterior=facturaActual2?.montoDisponibleCuenta
        const saldoDisponibleFacturaAnterior=facturaActual2?.saldoDisponible

        const saldoDisponibleNuevo= saldoDisponibleFacturaAnterior+valorFuturoAnterior   
        const montoDisponibleNuevo =montoDisponibleFacturaAnterior+presentValueInvestorFacturaAnterior

        // 3. Actualizar todas las facturas con el mismo billId (excepto la actual)
        values?.facturas.forEach((f, i) => {
        if (f.billId === billIdAnterior && i !== index) {
        // Actualizar saldo disponible
        setFieldValue(`facturas[${i}].saldoDisponible`, saldoDisponibleNuevo);

        setFieldValue(`facturas[${i}].montoDisponibleCuenta`, montoDisponibleNuevo);

        }
        });


        setFieldValue(`facturas[${index}]`, {
        is_creada:true,
        billCode: selectedFactura.billId,
        billId: selectedFactura.billId,
        idCuentaInversionista: factura.idCuentaInversionista,
        factura: newValue.id || newValue,
        fechaEmision: selectedFactura.dateBill,
        probableDate: selectedFactura.probableDate,
        amount: selectedFactura.saldoDisponibleInfo,
        payedAmount: selectedFactura.saldoDisponibleInfo,
        numbercuentaInversionista: factura.numbercuentaInversionista,
        cuentaInversionista: factura.cuentaInversionista,
        nombreInversionista: factura.nombreInversionista,
        investorBroker: factura.investorBroker,
        investorBrokerName: factura.investorBrokerName,
        saldoDisponible: 0,
        saldoDisponibleInfo: selectedFactura.saldoDisponibleInfo,
        montoDisponibleCuenta:montoDisponibleFinal, // Usamos el valor calculado
        fraccion: fraccion,
        fechaFin: factura.fechaFin,
        valorNominal: valorNominalFactura,
        porcentajeDescuento: Math.round((selectedFactura.saldoDisponibleInfo * 100) / selectedFactura.saldoDisponibleInfo) || 0,
        expirationDate: selectedFactura.expirationDate,
        valorFuturo: valorFuturoCalculado,
        presentValueInvestor:valorFuturoCalculado,
      applyGm:factura.applyGm,
        presentValueSF:valorFuturoCalculado|| 0,
        comisionSF,
        investorProfit: investorProfit,
        integrationCode: selectedFactura?.integrationCode ? selectedFactura?.integrationCode : "",
        isReBuy: selectedFactura?.reBuyAvailable ?? 0,
        gastoMantenimiento:valorFuturoCalculado*0.002,
        operationDays: 0,
        investorTax: values?.investorTax,
        montoDisponibleInfo: factura.montoDisponibleInfo
        });


        } 




        // [MANTENIDO] Cálculo de fechas mejorado
        const fechaOperacion = new Date(values?.opDate);
        const parseDate = (dateStr) => {
        // Intenta varios formatos comunes
        const parsed = new Date(dateStr);
        if (!isNaN(parsed.getTime())) return parsed;

        // Si falla, intenta con parseISO
        try {
        const isoParsed = parseISO(dateStr);
        return !isNaN(isoParsed.getTime()) ? isoParsed : new Date(NaN);
        } catch {
        return new Date(NaN);
        }
        };

        const expirationDate = selectedFactura?.expirationDate 
        ? parseDate(selectedFactura.expirationDate)
        : new Date(NaN); // Marcamos explícitamente como inválido si no hay fecha



        let substractDays = 0;
        if (!isNaN(fechaOperacion.getTime()) && !isNaN(expirationDate.getTime())) {
        substractDays = differenceInDays(expirationDate, fechaOperacion);

        } else {
        console.error("Error: Una de las fechas no es válida.", {
        opDate: values?.opDate,
        expirationDate: selectedFactura?.expirationDate,
        parsedOperacion: fechaOperacion,
        parsedExpiration: expirationDate
        });
        }

                                                    
        // [MANTENIDO] Lógica de fracciones
        const facturaActual = selectedFactura
        let fraccion = selectedFactura.fraccion+ 1 || 1;
        const facturasAnteriores = values?.facturas
        .slice(0, index)
        .filter((f) => {
        // Validación para evitar errores si f es null/undefined
        if (!f || !f.billId) return false;

        // Comparación segura convirtiendo a string
        return String(f.billId) === String(facturaActual?.billId);
        });


        if (facturasAnteriores.length > 0) {
        const fraccionMasAlta = Math.max(...facturasAnteriores.map((f) => f.fraccion || 1));
        fraccion = fraccionMasAlta + 1;
        }

        // [MANTENIDO] Cálculo de saldo disponible
        let saldoDisponible = selectedFactura.saldoDisponibleInfo|| 0;
        const valorFuturoAnteriores = facturasAnteriores.reduce((sum, f) => sum + (f.valorFuturo || 0), selectedFactura.saldoDisponibleInfo);
        saldoDisponible -= valorFuturoAnteriores;

        // [MANTENIDO] Determinar valor futuro
        let valorFuturoCalculado;
        if (facturasAnteriores.length > 0 && saldoDisponible <= 0) {
        valorFuturoCalculado = 0;
        saldoDisponible = 0;
        } else {
        valorFuturoCalculado = selectedFactura.saldoDisponibleInfo;    ;
        }

        // [MANTENIDO] Saldo disponible anterior
        const saldoDisponibleAnterior = facturasAnteriores.find(
        (f) => f.billId === selectedFactura.billId
        )?.saldoDisponible || 0;
        const saldoDisponibleA = saldoDisponibleAnterior;


        // [MANTENIDO] Cálculo de valores presentes
        const presentValueInvestor = factura.operationDays > 0 && factura.valorFuturo > 0
        ? Math.round(PV(factura.investorTax / 100, factura.operationDays / 365, 0, factura.valorFuturo, 0) * -1)
        : selectedFactura?.presentValueInvestor;

        const presentValueSF = factura.operationDays > 0 && factura.valorFuturo > 0
        ? Math.round(PV(values?.discountTax / 100, factura.operationDays / 365, 0, factura.valorFuturo, 0) * -1)
        : selectedFactura.presentValueInvestor;

        // [MANTENIDO] Cálculo de comisiones
        const comisionSF = presentValueInvestor && presentValueSF
        ? presentValueInvestor - presentValueSF
        : 0;

        const investorProfit = presentValueInvestor ?? selectedFactura.saldoDisponibleInfo

        ? presentValueInvestor - selectedFactura.saldoDisponibleInfo
        : 0;

        // [MANTENIDO] Cálculo de valor nominal
        let valorNominalFactura;
        if (facturasAnteriores.length > 0 && saldoDisponible <= 0) {
        valorNominalFactura = 0;
        } else {
        valorNominalFactura = selectedFactura.saldoDisponibleInfo* Math.round((selectedFactura.saldoDisponibleInfo * 100) / selectedFactura.saldoDisponibleInfo) / 100;
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

            values?.facturas.forEach((f, i) => {
                if (f.idCuentaInversionista === factura.idCuentaInversionista) {
                setFieldValue(`facturas[${i}].montoDisponibleCuenta`, montoDisponibleFinal);
                
                }
            });

            setFieldValue(`facturas[${index}]`, {
                is_creada:true,
                billCode: selectedFactura.billId,
                billId: selectedFactura.billId,
                idCuentaInversionista: factura.idCuentaInversionista,
                factura: newValue.id|| newValue,
                fechaEmision: selectedFactura.fechaEmision||selectedFactura.dateBill,
                probableDate: selectedFactura.probableDate,
                amount: selectedFactura.saldoDisponibleInfo,
                payedAmount: selectedFactura.saldoDisponibleInfo,
                numbercuentaInversionista: factura.numbercuentaInversionista,
                cuentaInversionista: factura.cuentaInversionista,
                nombreInversionista: factura.nombreInversionista,
                investorBroker: factura.investorBroker,
                investorBrokerName: factura.investorBrokerName,
                saldoDisponible: selectedFactura.saldoDisponibleInfo,
                saldoDisponibleInfo: selectedFactura.saldoDisponibleInfo,
                montoDisponibleCuenta:montoDisponibleFinal,
                fraccion: fraccion,
                fechaFin: factura.fechaFin,
                valorNominal: valorNominalFactura,
                porcentajeDescuento: Math.round((selectedFactura.saldoDisponibleInfo * 100) / selectedFactura.saldoDisponibleInfo) || 0,
                expirationDate: selectedFactura.expirationDate,
                valorFuturo: valorFuturoCalculado,
                presentValueInvestor:valorFuturoCalculado,
                presentValueSF:valorFuturoCalculado|| 0,
                comisionSF,
                 applyGm:factura.applyGm,
                investorProfit: investorProfit,
                integrationCode: selectedFactura?.integrationCode ? selectedFactura?.integrationCode : "",
                isReBuy: selectedFactura?.reBuyAvailable ?? 0,
                gastoMantenimiento:valorFuturoCalculado*0.002|| 0,
                operationDays: 0,
                investorTax: values?.investorTax,
                montoDisponibleInfo: factura.montoDisponibleInfo
            })}
            
            
            else{ 
                // Caso sin inversionista: cálculo individual
                const montoDisponibleFinal = 
                factura.montoDisponibleInfo - presentValueInvestor
                // [MANTENIDO] Asignación final de valores
            setFieldValue(`facturas[${index}]`, {
                is_creada:true,
                billCode: selectedFactura.billId,
                 applyGm:factura.applyGm,
                billId: selectedFactura.billId,
                idCuentaInversionista: factura.idCuentaInversionista,
                factura: newValue.id || newValue,
                fechaEmision: selectedFactura.fechaEmision|| selectedFactura.dateBill,
                probableDate: selectedFactura.probableDate,
                amount: selectedFactura.saldoDisponibleInfo,
                payedAmount: selectedFactura.saldoDisponibleInfo,
                numbercuentaInversionista: factura.numbercuentaInversionista,
                cuentaInversionista: factura.cuentaInversionista,
                nombreInversionista: factura.nombreInversionista,
                investorBroker: factura.investorBroker,
                investorBrokerName: factura.investorBrokerName,
                saldoDisponible: saldoDisponibleA,
                saldoDisponibleInfo: selectedFactura.saldoDisponibleInfo,
                montoDisponibleCuenta:montoDisponibleFinal, // Usamos el valor calculado
                fraccion: fraccion,
                fechaFin: factura.fechaFin,
                valorNominal: valorNominalFactura,
                porcentajeDescuento: Math.round((selectedFactura.saldoDisponibleInfo * 100) / selectedFactura.saldoDisponibleInfo)|| 0,
                expirationDate: selectedFactura.expirationDate,
                valorFuturo: valorFuturoCalculado,
                presentValueInvestor:valorFuturoCalculado,
                presentValueSF:valorFuturoCalculado|| 0,
                comisionSF,
                investorProfit: investorProfit,
                integrationCode: selectedFactura?.integrationCode ? selectedFactura?.integrationCode : "",
                isReBuy: selectedFactura?.reBuyAvailable ?? 0,
                  gastoMantenimiento:valorFuturoCalculado*0.002|| 0,
                operationDays: 0,
                investorTax: values?.investorTax,
                montoDisponibleInfo: factura.montoDisponibleInfo
            });
            }

            


        } else {

        // Caso sin inversionista: cálculo individual
        const montoDisponibleFinal = 
        factura.montoDisponibleInfo - presentValueInvestor

        // [MANTENIDO] Asignación final de valores
        setFieldValue(`facturas[${index}]`, {
        is_creada:true,
        applyGm:factura.applyGm,
        billCode: selectedFactura.billId,
        billId: selectedFactura.billId,
        idCuentaInversionista: factura.idCuentaInversionista,
        factura: newValue.id || newValue,
        fechaEmision: selectedFactura.fechaEmision|| selectedFactura.dateBill,
        probableDate: selectedFactura.probableDate,
        amount: selectedFactura.saldoDisponibleInfo,
        payedAmount: selectedFactura.saldoDisponibleInfo,
        numbercuentaInversionista: factura.numbercuentaInversionista,
        cuentaInversionista: factura.cuentaInversionista,
        nombreInversionista: factura.nombreInversionista,
        investorBroker: factura.investorBroker,
        investorBrokerName: factura.investorBrokerName,
        saldoDisponible:saldoDisponibleA,
        saldoDisponibleInfo:  selectedFactura.saldoDisponibleInfo,
        montoDisponibleCuenta:0, // Usamos el valor calculado
        fraccion: fraccion,
        fechaFin: factura.fechaFin,
        valorNominal: valorNominalFactura,
        porcentajeDescuento: Math.round((selectedFactura.saldoDisponibleInfo * 100) / selectedFactura.saldoDisponibleInfo)|| 0,
        expirationDate: selectedFactura.expirationDate,
        valorFuturo: valorFuturoCalculado,
        presentValueInvestor:valorFuturoCalculado,
        presentValueSF:valorFuturoCalculado|| 0,
        comisionSF,
        investorProfit: investorProfit,
        integrationCode: selectedFactura?.integrationCode ? selectedFactura?.integrationCode : "",
        isReBuy: selectedFactura?.reBuyAvailable ?? 0,
         gastoMantenimiento:valorFuturoCalculado*0.002|| 0,
        operationDays: 0,
        investorTax: values?.investorTax,
        montoDisponibleInfo: selectedFactura?.montoDisponibleCuenta
        });
        }




        } catch (error) {
        console.error("Error al cargar los datos:", error);
        }
        }}


        />
</>
    
    
        )

}

