// components/RegisterOperationForm.js
import React from "react";

import {  Box, Typography, Switch, TextField } from '@mui/material';


export default function GastoMantenimiento({values,factura,setFieldValue,formatCurrency,parseFloat,index}){

    return (
            <Box 
                sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: 'center',
                        gap: 0,
                        p: 1,
                        border: '1px solid',
                        borderColor: 'rgba(0, 0, 0, 0.23)',
                        borderRadius: 2,
                        boxShadow: 0,
                        bgcolor: 'background.paper',
                   
                        }}
                            >
                              
                                GM
                                
                                <Switch
                                checked={factura.applyGm || false}
                                onChange={(event) => {
                                    const isChecked = event.target.checked;
                                    const valorGm = factura.presentValueInvestor * 0.002;
                                    const diferencia = isChecked ? valorGm : -valorGm;

                                    // Actualizar estado del GM para esta factura
                                    setFieldValue(`facturas[${index}].applyGm`, isChecked);
                                    setFieldValue(`facturas[${index}].gastoMantenimiento`, isChecked ? valorGm : 0);

                                    // Calcular nuevo monto disponible SOLO para facturas con el mismo idCuentaInversionista
                                    const currentAccountId = factura.idCuentaInversionista;
                                    const montoActual = values.facturas.find(f => f.idCuentaInversionista === currentAccountId)?.montoDisponibleCuenta || factura.montoDisponibleInfo;
                                    const nuevoMonto = montoActual - diferencia;

                                    // Actualizar solo las facturas de la misma cuenta
                                    values.facturas.forEach((f, i) => {
                                    if (f.idCuentaInversionista === currentAccountId) {
                                        setFieldValue(`facturas[${i}].montoDisponibleCuenta`, nuevoMonto);
                                    }
                                    });
                                }}
                                sx={{
                                    '& .MuiSwitch-switchBase.Mui-checked': {
                                    color: '#488B8F', // Color cuando está activado
                                    },
                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                    backgroundColor: '#488B8F', // Color del track cuando está activado
                                    },
                                }}
                                />
                                <TextField
                                type="text"
                                placeholder="$ 0,00"
                                id="gastoMantenimientoname" // Para CSS/JS si es necesario
                                data-testid="campo-gastoMantenimiento"
                                value={formatCurrency(factura.gastoMantenimiento) ?? 0}
                                onChange={(e) => {
                                    const nuevoValor = parseFloat(e.target.value) || 0;
                                    const diferencia = nuevoValor - (factura.gastoMantenimiento || 0);

                                    // Actualizar valor de GM para esta factura
                                    setFieldValue(`facturas[${index}].gastoMantenimiento`, nuevoValor);

                                    // Calcular nuevo monto disponible SOLO para facturas con el mismo idCuentaInversionista
                                    const currentAccountId = factura.idCuentaInversionista;
                                    const montoActual = values.facturas.find(f => f.idCuentaInversionista === currentAccountId)?.montoDisponibleCuenta || factura.montoDisponibleInfo;
                                    const nuevoMonto = montoActual - diferencia;

                                    // Actualizar solo las facturas de la misma cuenta
                                    values.facturas.forEach((f, i) => {
                                    if (f.idCuentaInversionista === currentAccountId) {
                                        setFieldValue(`facturas[${i}].montoDisponibleCuenta`, nuevoMonto);
                                    }
                                    });
                                }}
                                disabled
                                size="small"  // <-- Esto reduce la altura
                                
                                thousandSeparator="."
                                decimalSeparator=","
                                decimalScale={0}
                                allowNegative={false}
                                fullWidth
                                variant="outlined"
                                className={`flex-1 ${factura.applyGm ? "bg-white" : "bg-gray-200 text-gray-500"}`}
                                />
                            </Box>
    )

}