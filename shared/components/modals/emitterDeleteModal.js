
// components/RegisterOperationForm.js
import React from "react";

import {  Box, Modal, Typography,  Button } from '@mui/material';

export default function EmitterDeleteModal ({orchestDisabled,isModalEmitterAd,setIsModalEmitterAd,setBrokeDelete,setFieldValue,values,setClientEmitter,setClientBrokerEmitter}) {

    return (

        <>
                 <Modal open={isModalEmitterAd} onClose={() => setIsModalEmitterAd(false)}>
                            <Box sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    width: 400,
                                    bgcolor: 'background.paper',
                                    boxShadow: 24,
                                    p: 4,
                                    borderRadius: 1
                                  }}>
                                   <Typography variant="h6" gutterBottom>Confirmación  </Typography>
                                   <Typography variant="body1" sx={{ mb: 3 }}>¿Estás seguro de que deseas continuar? </Typography>
                                   <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                   <Button onClick={() => {
                                    setBrokeDelete(false);  // Confirmar
                                    setIsModalEmitterAd(false);
                                    // Aquí podrías llamar a la función que continúa con la lógica

                                      // Identificar índices de facturas creadas (status: true)
                          const indicesCreadas = orchestDisabled
                          .filter(item => item.status === true)
                          .map(item => item.indice);

                        // 1. Agrupar facturas por idCuentaInversionista (solo las no creadas)
                        const facturasPorCuenta = values.facturas.reduce((acc, factura, index) => {
                          // Saltar facturas creadas
                          if (indicesCreadas.includes(index)) return acc;
                          
                          const cuentaId = factura.idCuentaInversionista;
                          if (!acc[cuentaId]) {
                            acc[cuentaId] = [];
                          }
                          acc[cuentaId].push(factura);
                          return acc;
                        }, {});

                        

                        // 2. Para cada grupo de facturas no creadas con misma cuenta, calcular el total a restituir
                        Object.entries(facturasPorCuenta).forEach(([cuentaId, facturas]) => {
                          if (facturas.length > 1) {
                            const totalRestituir = facturas.reduce(
                              (sum, f) => sum + f.gastoMantenimiento + f.presentValueInvestor, 
                              0
                            );
                           

                            // 3. Actualizar montos disponibles para las facturas no creadas de esta cuenta
                            values.facturas.forEach((f, index) => {
                              if (f.idCuentaInversionista === cuentaId && !indicesCreadas.includes(index)) {
                                setFieldValue(`facturas[${index}].montoDisponibleCuenta`, f.montoDisponibleInfo);
                              }
                            });
                          }
                        });
                        setFieldValue('emitter','')
                        setFieldValue('filtroEmitterPagador.payer','')
                        setFieldValue('filtroEmitterPagador','')
                        setFieldValue('nombrePagador','')
                        
                        // 4. Resetear solo las facturas no creadas manteniendo campos del inversionista
                        setFieldValue('facturas', values.facturas.map((f, index) => {
                          // Mantener facturas creadas intactas
                          if (indicesCreadas.includes(index)) {
                            return f;
                          }
                          
                          // Resetear solo facturas no creadas
                          return {
                            ...Object.fromEntries(
                              Object.keys(f)
                                .filter(key => ![
                                  'nombreInversionista', 
                                  'numbercuentaInversionista',
                                  'cuentaInversionista', 
                                  'idCuentaInversionista',
                                  'investorBroker', 
                                  'investorBrokerName',
                                  'montoDisponibleCuenta', 
                                  'montoDisponibleInfo',
                                  'probableDate',
                                  
                                ].includes(key))
                                .map(key => [key, 
                                  typeof f[key] === 'number' ? 0 : 
                                  key.includes('Date') || key.includes('fecha') ? new Date().toISOString().substring(0, 10) : 
                                  ''
                                ])
                            ),
                            // Mantener campos del inversionista
                            nombreInversionista: f.nombreInversionista || '',
                            numbercuentaInversionista: f.numbercuentaInversionista || '',
                            cuentaInversionista: f.cuentaInversionista || '',
                            idCuentaInversionista: f.idCuentaInversionista || '',
                            investorBroker: f.investorBroker || "",
                            investorBrokerName: f.investorBrokerName || "",
                            montoDisponibleCuenta: f.montoDisponibleInfo || 0,
                            montoDisponibleInfo: f.montoDisponibleInfo || 0
                          };
                        }));

                        // 5. Limpiar campos adicionales solo si no hay facturas creadas
                        if (indicesCreadas.length === 0) {
                          setFieldValue('nombrePagador', '');
                          setFieldValue('filtroEmitterPagador.payer', '');
                          setFieldValue('takedBills', []);
                          setFieldValue('filteredPayers', []);
                          setFieldValue('corredorEmisor', 0);
                          setFieldValue('discountTax', 0);
                          setFieldValue('emitter','')
                          setClientEmitter(null);
                          setClientBrokerEmitter(null);
                        }

                                  }}
                                   variant="contained"
                                          color="primary"
                                  >
                                    Confirmar
                                    </Button>
                                  
                                  <Button onClick={() => {
                                    setBrokeDelete(true);  // Cancelar
                                    setIsModalEmitterAd(false);
                                  }}
                                  
                                  variant="contained"
                                  color="primary"
                                  >
                                    Cancelar
                                    </Button>
                                    
                                   </Box>
                                 
                                  </Box>
                                </Modal>
        
        </>
    )
}