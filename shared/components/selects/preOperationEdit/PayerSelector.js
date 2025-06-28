// components/RegisterOperationForm.js
import React from "react";

import { TextField, Autocomplete} from '@mui/material';

import {
  Box,
  Button,
  CircularProgress,
  Fade,
  IconButton,
  Typography,
} from "@mui/material";

export default function PayerSelector( {errors,dataBills,showAllPayers,payers,values,setFieldValue,setClientPagador,setIsSelectedPayer,touched,orchestDisabled}) {

    return (
 <Autocomplete
                    options={Array.isArray(values?.arrayPayers) ? values?.arrayPayers : []}
                    value={
                      Array.isArray(values?.arrayPayers)
                        ? values?.arrayPayers.find(payer =>
                          payer?.data?.document_number === (values?.filtroEmitterPagador?.payer || values?.filtroEmitterPagador?.payer)
                        ) || null
                        : null
                    }
                    isOptionEqualToValue={(option, value) =>
                      option?.data?.document_number === value?.data?.document_number
                    }
                    getOptionLabel={(option) => {
                      if (!option?.data) return 'Sin nombre';
                      return option.data.social_reason ||
                        `${option.data.first_name || ''} ${option.data.last_name || ''}`.trim();
                    }}
                    onChange={async (event, newValue) => {


                        if (!newValue) {

                    const confirmChange = window.confirm(
                        "¿Está seguro de cambiar de pagador? Esto reseteará las facturas no creadas."
                        );
                        
                        if (!confirmChange) return;
                        setClientPagador(null);
                        setIsSelectedPayer(false);
                        
                 
                       

                        

                        setFieldValue('facturas', '');
                        setFieldValue('nombrePagador', '');
                        setFieldValue('filtroEmitterPagador.payer', '');
                        setFieldValue('takedBills', []);
                        setFieldValue('amount',0)
                        setFieldValue('payedAmount',0)
                        setFieldValue('billFraction',1)
                        setFieldValue('montoDisponibleCuenta', values?.montoDisponibleInfo)
                        setFieldValue('presentValueInvestor',0)
                        setFieldValue('presentValueSF',0)
                        setFieldValue('commissionSF',0)
                        setFieldValue('investorProfit',0)
                        setFieldValue('GM',0)
                        return;
                    }
                      setFieldValue('nombrePagador', newValue?.id || '');
                      setFieldValue('filtroEmitterPagador.payer', newValue?.data?.document_number || '');

                      if (newValue?.data?.document_number && Array.isArray(dataBills?.data)) {
                        const facturasFiltradas = dataBills.data.filter(factura =>
                          factura.payerId === newValue.data.document_number &&
                          Number(factura.currentBalance) >= 0
                        );
                        setFieldValue('takedBills', facturasFiltradas);
                      } else {
                        setFieldValue('takedBills', []);
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Nombre Pagador *"
                        fullWidth
                        name="nombrePagador"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {!values?.arrayPayers ? <CircularProgress size={20} /> : null}
                              {params.InputProps.endAdornment}
                            </>
                          )
                        }}
                        error={touched.nombrePagador && Boolean(errors.nombrePagador)}
                        helperText={touched.nombrePagador && errors.nombrePagador}
                      />
                    )}
                  />
    )
}

