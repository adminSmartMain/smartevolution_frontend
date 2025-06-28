// components/RegisterOperationForm.js
import React from "react";

import { TextField,  Autocomplete} from '@mui/material';

import { toast } from "react-toastify";

import { PV } from "@formulajs/formulajs";
import { parseISO,  isValid } from "date-fns";

import { differenceInDays } from "date-fns";
import {
  
  CircularProgress,
 
} from "@mui/material";

import ErrorIcon from '@mui/icons-material/Error'; // o cualquier otro ícono de error

export default function BillSelector ({values, setFieldValue, dataDetails,errors, touched, index, factura, dataBills, setFieldTouched, setFieldError, cargarFraccionFactura}) {

    return (
        <>
         <Autocomplete
                          options={(values?.takedBills || []).map(factura => ({
                            label: `${factura.billId}`,
                            value: factura.billId, // Usamos billId como valor clave
                            rawData: factura
                          }))}
                          getOptionLabel={(option) => (typeof option === 'string' ? option : option?.label) || ''}
                          isOptionEqualToValue={(option, value) => {
                            // Comparación robusta que maneja ambos casos:
                            // - Cuando value es el objeto completo (selección nueva)
                            // - Cuando es solo el billId (valor inicial)
                            return option?.value === (value?.value || value);
                          }}
                          value={
                            // Primero intenta encontrar en options
                            (values?.takedBills || [])
                              .find(f => f.billId === values?.bill)
                              ? {
                                label: `${values?.bill}`,
                                value: values?.bill,
                                rawData: (values?.takedBills || []).find(f => f.billId === values?.bill)
                              }
                              : null
                          }
                          onChange={async (event, newValue) => {
                            console.log("Nuevo valor seleccionado:", newValue); // Debug
                            if (!newValue) {
                              await Promise.all([
                                setFieldValue('bill', ''),
                                setFieldValue('billCode', ''),
                                setFieldValue('integrationCode', ''),
                                setFieldValue('isReBuy', false),
                                setFieldValue('amount',0),
                                setFieldValue('payedAmount',0),
                                setFieldValue('billFraction',1),
                                setFieldValue('montoDisponibleCuenta', values?.montoDisponibleInfo),
                                setFieldValue('presentValueInvestor',0),
                                setFieldValue('presentValueSF',0),
                                setFieldValue('commissionSF',0),
                                setFieldValue('investorProfit',0),
                                setFieldValue('saldoDisponible','0'),
                                setFieldValue('saldoDisponibleInfo','0'),
                                setFieldValue('GM',0),
                                setFieldValue('DateBill',''),
                                setFieldValue('DateExpiration',''),
                                setFieldValue('investorBrokerName', values.investorBrokerInfo.investorBrokerName)
                              ]);
                              return;
                            }

                            const selectedFactura = newValue.rawData;
                            console.log("Datos completos de la factura:", selectedFactura); // Debug

                            try {
                              if (values.integrationCode && values.integrationCode !== selectedFactura?.integrationCode) {
                                toast.error("El código de integración debe coincidir con el de la factura previa");
                                return;
                              }
                              const billId = newValue?.value || null;
                              setFieldValue('bill', billId);
                              // Actualización atómica de todos los campos
                              const fractionBill = await cargarFraccionFactura(selectedFactura.id);
                              console.log(fractionBill)
                              let fraccion = fractionBill?.data?.fraction || 1;
                              await Promise.all([
                                setFieldValue('billFraction', fraccion),
                                setFieldValue('bill',selectedFactura.billId),
                                setFieldValue('billBack', selectedFactura.id),
                                setFieldValue('billsComplete', selectedFactura),
                                setFieldValue('billCode', selectedFactura.billId),
                                setFieldValue('integrationCode', selectedFactura.integrationCode || ""),
                                setFieldValue('isReBuy', selectedFactura.reBuyAvailable || false),
                                setFieldValue('DateBill', selectedFactura.dateBill),
                                setFieldValue('DateExpiration', selectedFactura.expirationDate),

                                // Actualizaciones financieras
                                (async () => {
                                  const valorFuturoCalculado = selectedFactura.currentBalance;
                                  const presentValueInvestor = Math.round(
                                    PV(values.investorTax / 100, values.operationDays / 365, 0, valorFuturoCalculado, 0) * -1
                                  );
                                  const presentValueSF = Math.round(
                                    PV(values.discountTax / 100, values.operationDays / 365, 0, valorFuturoCalculado, 0) * -1
                                  );

                                  await Promise.all([
                                    setFieldValue('amount', selectedFactura.currentBalance),
                                    setFieldValue('payedAmount', selectedFactura.currentBalance),
                                    setFieldValue('presentValueInvestor', presentValueInvestor),
                                    setFieldValue('presentValueSF', presentValueSF),
                                    setFieldValue('saldoDisponible',Math.round( 0)),
                                    setFieldValue('saldoDisponibleInfo',Math.round( selectedFactura.currentBalance)),
                                    setFieldValue('montoDisponibleCuenta', values?.investorAccountInfo?.investorAccountMonto - presentValueInvestor - values?.GM),
                                    setFieldValue('commissionSF', presentValueInvestor - presentValueSF),
                                    setFieldValue('investorProfit', selectedFactura.currentBalance - presentValueInvestor),
                                    setFieldValue('investorBrokerName',values.investorBrokerInfo.investorBrokerName)
                                  ]);

                                  const gmValue = presentValueInvestor * 0.002;
                                  setFieldValue('GM', gmValue)
                                })()
                              ]);
                              console.log(values)

                              // Actualización del pagador (si aplica)
                              if (selectedFactura.payerId && values.arrayPayers) {
                                const payerInfo = values.arrayPayers.find(p =>
                                  p?.data?.document_number === selectedFactura.payerId
                                );
                                if (payerInfo) {
                                  await Promise.all([
                                    setFieldValue('filtroEmitterPagador.payer', selectedFactura.payerId),
                                    setFieldValue('payer', payerInfo.id)
                                  ]);
                                }
                              }

                            } catch (error) {
                              console.error("Error detallado:", error);
                              toast.error(`Error al cargar los datos: ${error.message}`);
                            }
                          }}

                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Número de Factura *"
                              fullWidth
                              InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                  <>
                                    {!values?.takedBills ? <CircularProgress size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                  </>
                                )
                              }}
                              error={touched.bill && Boolean(errors.bill)}
                              helperText={
                                ` ${dataDetails?.data?.isRebuy ? "Disponible Recompra" : "No disponible Recompra"}`
                              }
                            />
                          )}
                          noOptionsText="No hay facturas disponibles"
                        /> 
        </>
 
    )
       


}
