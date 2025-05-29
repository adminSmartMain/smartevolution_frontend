
// components/RegisterOperationForm.js
import React from "react";

import {  Box, Modal, Typography, Button } from '@mui/material';

export default function NoEditModal({ openModal,setOpenModal,setEditMode, index, values, setFieldValue, orchestDisabled, setOrchestDisabled, setIsCreatingBill}) {

    return (

        <Modal
            open={openModal}
            onClose={() => setOpenModal(false)}
            aria-labelledby="modal-confirmacion"
            aria-describedby="modal-descripcion"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Box sx={{
              backgroundColor: 'background.paper',
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
              width: 400,
              outline: 'none'
            }}>
              <Typography id="modal-confirmacion" variant="h6" component="h2">
                ¿Está seguro?
              </Typography>
              <Typography id="modal-descripcion" sx={{ mt: 2 }}>
                Al salir del modo creación se borrará la información de esta factura
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
                <Button 
                  variant="outlined" 
                  onClick={() => setOpenModal(false)}
                  sx={{ color: '#5EA3A3', borderColor: '#5EA3A3' }}
                >
                  Cancelar
                </Button>
                <Button 
                  variant="contained" 
                  onClick={() => {
                    // 1. Obtener datos de la factura actual
                    const currentBill = values.facturas[index];
                    const billId = currentBill.billId;
                    const inversionistaId = currentBill.idCuentaInversionista;
                    
                    // Verificar facturas con mismo billId (solo las creadas)
                    const facturasMismoBillId = values.facturas.filter(f => 
                      f.billId === billId && f.is_creada
                    );
                    
                    // Verificar facturas con mismo inversionista (todas)
                    const facturasMismoInversionista = values.facturas.filter(f => 
                      f.idCuentaInversionista === inversionistaId
                    );

                    // Lógica para billId (si aplica)
                    if (billId && facturasMismoBillId.length > 0) {
                      const valorFuturoLiberado = currentBill.valorFuturo || 0;
                      const saldoOriginalInfo = currentBill.saldoDisponibleInfo || 0;
                      console.log(valorFuturoLiberado,saldoOriginalInfo)
                      // Calcular nuevo saldo disponible (sumando el valor futuro liberado)
                      console.log(valorFuturoLiberado,saldoOriginalInfo)
                      //const nuevoSaldoGlobal = saldoOriginalInfo + valorFuturoLiberado;
                      const totalValorFuturo = values.facturas.filter(f => f.billId === billId && f.is_creada).reduce((sum, f) => sum + (f.valorFuturo || 0), 0);
                                                              
                      const nuevoSaldoGlobal = saldoOriginalInfo - (totalValorFuturo - valorFuturoLiberado);
                      // Actualizar saldo para todas las facturas con mismo billId
                      values.facturas.forEach((f, i) => {
                        if (f.billId === billId && f.is_creada) {
                          setFieldValue(`facturas[${i}].saldoDisponible`, nuevoSaldoGlobal);
                          setFieldValue(`facturas[${i}].saldoDisponibleInfo`, saldoOriginalInfo);
                        }
                      });
                    }

                    // Lógica para inversionista (si aplica)
                    if (inversionistaId && facturasMismoInversionista.length > 0) {
                      const presentValueLiberado = currentBill.presentValueInvestor || 0;
                      const gastoMantenimientoLiberado = currentBill.gastoMantenimiento || 0;
                      
                      // Calcular monto disponible actualizado
                      const montoDisponibleActualizado = currentBill.montoDisponibleCuenta + 
                                                      presentValueLiberado + 
                                                      gastoMantenimientoLiberado;
                      console.log(currentBill,presentValueLiberado,montoDisponibleActualizado,gastoMantenimientoLiberado)
                      // Actualizar para todas las facturas del mismo inversionista
                      values.facturas.forEach((f, i) => {
                        if (f.idCuentaInversionista === inversionistaId) {
                          setFieldValue(`facturas[${i}].montoDisponibleCuenta`, montoDisponibleActualizado);
                          setFieldValue(`facturas[${index}].montoDisponibleCuenta`, montoDisponibleActualizado);
                          setFieldValue(`facturas[${index}].montoDisponibleInfo`, currentBill.montoDisponibleInfo);
                          setFieldValue(`facturas[${i}].montoDisponibleInfo`, currentBill.montoDisponibleInfo);
                        }
                      });
                    }
                    
                    // Limpiar los valores de ESTA factura específica
                    setFieldValue(`facturas[${index}]`, {
                      is_creada: false,
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
                      presentValueInvestor: 0,
                      presentValueSF: 0,
                      investorProfit: 0,
                      comisionSF: 0,
                      // Mantener datos del inversionista
                      idCuentaInversionista: currentBill.idCuentaInversionista,
                      numbercuentaInversionista: currentBill.numbercuentaInversionista,
                      cuentaInversionista: currentBill.cuentaInversionista,
                      nombreInversionista: currentBill.nombreInversionista,
                      investorBroker: currentBill.investorBroker,
                      investorBrokerName: currentBill.investorBrokerName,
                      montoDisponibleCuenta: currentBill.montoDisponibleCuenta,
                      montoDisponibleInfo: currentBill.montoDisponibleInfo,
                      gastoMantenimiento: 0,
                      operationDays: 0,
                      expirationDate: "",
                      billCode: ""
                    });
                    
                    // Actualizar estados de creación
                    setFieldValue(`facturas[${index}].is_creada`, false);
                    const otrasCreadas = orchestDisabled.some(item => item.indice !== index && item.status);
                    if (!otrasCreadas) {
                      setIsCreatingBill(false);
                    }
                    
                    setOrchestDisabled(prev => 
                      prev.map(item => 
                        item.indice === index ? { ...item, status: false } : item
                      )

                      
                    );
                    
                    setOpenModal(false);
                        setEditMode(prev => ({ ...prev, [index]: false }));
                  }}
                  sx={{ bgcolor: '#5EA3A3', '&:hover': { bgcolor: '#4a8c8c' } }}
                >
                  Sí, borrar
                </Button>
              </Box>
            </Box>
          </Modal>
    )
}