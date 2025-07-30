
// components/RegisterOperationForm.js
import React from "react";

import { Box, Typography, Grid, IconButton } from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import { set } from "date-fns";


export default function DeleteButton({f,factura, index, values, setFieldValue, remove, orchestDisabled, setOrchestDisabled, setIsCreatingBill, setHasShownIntegrationModal}) {
return (   <Grid item xs={2} container justifyContent="flex-end">
        {factura.is_creada && (
            <Box
                sx={{
                    width: '70px',
                    height: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '4px',
                    backgroundColor: '#488F8F', // Color fijo como solicitaste
                    color: 'common.white',
                    fontWeight: 'bold',
                    border: '1px solid',
                    borderColor: '#488F8F', // Mismo color para el borde
                    marginLeft: '8px', // Espaciado opcional para separarlo de otros elementos
                }}
            >
                <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                    Nuevo
                </Typography>
            </Box>
        )}
        <div style={{marginTop:7}}>
            <Typography>{ f ? 'Nuevo' :''}</Typography>
        </div>
           
        <IconButton onClick={() => {
            // 1. Obtener valores clave de la factura a eliminar
            const billIdEliminada = factura.billId;
            const cuentaInversionistaEliminada = factura.idCuentaInversionista;
            const valorFuturoEliminado = factura.valorFuturo || 0;
            const presentValueEliminado = factura.presentValueInvestor || 0;
            const gastoMantenimientoEliminado = factura.gastoMantenimiento || 0;
            const facturaCreada = orchestDisabled.filter(facturaSelect => facturaSelect.indice === index)
            const cantidadCreadas = orchestDisabled.filter(item => item.status === true).length;
            let n_created = cantidadCreadas
            // Fracción de la factura que se va a eliminar
            const fraccionEliminada = factura.fraccion || 0;
            if (billIdEliminada && facturaCreada) {
                setOrchestDisabled(prevState =>
                    prevState.map(item =>
                        item.indice === index
                            ? { ...item, status: false }  // Actualiza solo este elemento
                            : item                     // Mantiene los demás igual
                    )
                );
                n_created -= 1
            }
            if (n_created == 0) {
                setIsCreatingBill(false)
            }
            // 2. Procesar facturas con mismo billId (si existe)
            if (billIdEliminada) {
                // Encontrar todas las facturas que comparten el mismo billId
                const facturasMismoBillId = values.facturas.filter(
                    f => f.billId === billIdEliminada
                );
                if (facturasMismoBillId.length > 0) {
                    // Calcular nuevo saldo disponible (sumar el valor futuro eliminado)
                    const nuevoSaldoDisponible = (factura.saldoDisponible || 0) + valorFuturoEliminado;

                    // Actualizar todas las facturas con el mismo billId
                    values.facturas.forEach((f, i) => {
                        if (f.billId === billIdEliminada && i !== index) {
                            setFieldValue(`facturas[${i}].saldoDisponible`, nuevoSaldoDisponible);
                            // Reordenar fracciones si es necesario
                            if (f.fraccion > fraccionEliminada) {
                                // Disminuir en 1 las fracciones mayores a la eliminada
                                setFieldValue(`facturas[${i}].fraccion`, f.fraccion - 1);
                            }
                        }
                    });
                }
            }

            // 3. Procesar facturas con mismo idCuentaInversionista (si existe)
            if (cuentaInversionistaEliminada) {
                // Encontrar todas las facturas que comparten la misma cuenta
                const facturasMismaCuenta = values.facturas.filter(
                    f => f.idCuentaInversionista === cuentaInversionistaEliminada && f !== factura
                );

                if (facturasMismaCuenta.length > 0) {
                    // Calcular nuevo monto disponible (sumar PV y GM eliminados)
                    const montoLiberado = presentValueEliminado + gastoMantenimientoEliminado;
                    const nuevoMontoDisponible = (factura.montoDisponibleCuenta || 0) + montoLiberado;

                    // Actualizar todas las facturas con la misma cuenta
                    values.facturas.forEach((f, i) => {
                        if (f.idCuentaInversionista === cuentaInversionistaEliminada && i !== index) {
                            setFieldValue(`facturas[${i}].montoDisponibleCuenta`, nuevoMontoDisponible);
                        }
                    });
                }
            }
            // 4. Finalmente eliminar la factura
            remove(index);
            console.log(values.facturas.length-1)

            if( values.facturas.length-1 == 0){
                  setHasShownIntegrationModal(false)
                  setFieldValue('takedBills',values.takedBillsBeforeFilterIntegration)
            }
        }}>
            <DeleteIcon />
        </IconButton>
    </Grid>)

   
}