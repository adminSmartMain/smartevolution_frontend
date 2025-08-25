// components/RegisterOperationForm.js
import React from "react";
import { TextField, Autocomplete, Box } from '@mui/material';

export default function PayerSelector({ 
  errors, 
  dataBills, 
  showAllPayers, 
  payers, 
  values, 
  setFieldValue, 
  setClientPagador, 
  setIsSelectedPayer, 
  touched, 
  orchestDisabled 
}) {

  // Función para encontrar el pagador seleccionado considerando ambas listas
  const findSelectedPayer = () => {
    const selectedPayerDocument = values?.filtroEmitterPagador?.payer;
    if (!selectedPayerDocument) return null;

    // Primero busca en la lista actual (dependiendo de showAllPayers)
    const currentOptions = showAllPayers ? payers : values?.arrayPayers || [];
    const foundInCurrent = currentOptions.find(
      payer => payer?.data?.document_number === selectedPayerDocument
    );

    if (foundInCurrent) return foundInCurrent;

    // Si no está en la lista actual y estamos en modo filtrado, busca en la lista completa
    if (!showAllPayers) {
      return payers.find(
        payer => payer?.data?.document_number === selectedPayerDocument
      ) || null;
    }

    return null;
  };

  const selectedPayer = findSelectedPayer();

  return (
    <Autocomplete
      options={showAllPayers ? payers : values?.arrayPayers || []}
      value={selectedPayer}
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
          setFieldValue('amount', 0);
          setFieldValue('payedAmount', 0);
          setFieldValue('billFraction', 1);
          setFieldValue('montoDisponibleCuenta', values?.montoDisponibleInfo);
          setFieldValue('presentValueInvestor', 0);
          setFieldValue('presentValueSF', 0);
          setFieldValue('commissionSF', 0);
          setFieldValue('investorProfit', 0);
          setFieldValue('GM', 0);
          return;
        }

        console.log(newValue);
        setFieldValue('payerId', newValue?.id || '');
        setFieldValue('payerName', newValue?.value || '');
        setFieldValue('filtroEmitterPagador.payer', newValue?.data?.document_number || '');
        setClientPagador(newValue?.data?.document_number || '');
        setIsSelectedPayer(true);

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
          name="payerName"
          InputProps={{
            ...params.InputProps,
          }}
          error={touched.payerName && Boolean(errors.payerName)}
          helperText={touched.payerName && errors.payerName}
        />
      )}
    />
  );
}