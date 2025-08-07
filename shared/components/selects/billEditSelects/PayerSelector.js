import React from "react";
import { Autocomplete, TextField } from '@mui/material';

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
  // Función para encontrar el pagador actual basado en payerId
  const getCurrentPayer = () => {
    if (!values.payerId) return null;
    
    // Buscar en payers (lista completa)
    const foundInPayers = payers.find(p => 
      p?.data?.id === values.payerId || 
      p?.data?.document_number === values.payerId
    );
    
    if (foundInPayers) return foundInPayers;
    
    // Si no se encuentra en payers, buscar en arrayPayers
    if (Array.isArray(values.arrayPayers)) {
      return values.arrayPayers.find(p => 
        p?.data?.id === values.payerId || 
        p?.data?.document_number === values.payerId
      ) || null;
    }
    
    return null;
  };

  const handlePayerChange = async (event, newValue) => {
    if (!newValue) {
      const confirmChange = window.confirm(
        "¿Está seguro de cambiar de pagador? Esto reseteará las facturas no creadas."
      );
      
      if (!confirmChange) return;
      
      setClientPagador(null);
      setIsSelectedPayer(false);
      
      // Resetear campos relacionados
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

    // Actualizar valores del formulario
    setFieldValue('payerId', newValue?.data?.id || newValue?.data?.document_number || '');
    setFieldValue('payerName', 
      newValue?.data?.social_reason || 
      `${newValue?.data?.first_name || ''} ${newValue?.data?.last_name || ''}`.trim()
    );
    setFieldValue('filtroEmitterPagador.payer', newValue?.data?.document_number || '');

    // Filtrar facturas si hay dataBills
    if (newValue?.data?.document_number && Array.isArray(dataBills?.data)) {
      const facturasFiltradas = dataBills.data.filter(factura =>
        factura.payerId === newValue.data.document_number &&
        Number(factura.currentBalance) >= 0
      );
      setFieldValue('takedBills', facturasFiltradas);
    } else {
      setFieldValue('takedBills', []);
    }
  };

  const getOptionLabel = (option) => {
    if (!option?.data) return 'Sin nombre';
    return option.data.social_reason ||
      `${option.data.first_name || ''} ${option.data.last_name || ''}`.trim();
  };

  const isOptionEqualToValue = (option, value) => {
    return (
      option?.data?.id === value?.data?.id ||
      option?.data?.document_number === value?.data?.document_number
    );
  };

  return (
    <Autocomplete
      options={showAllPayers ? payers : values?.arrayPayers || []}
      value={getCurrentPayer()}
      isOptionEqualToValue={isOptionEqualToValue}
      getOptionLabel={getOptionLabel}
      onChange={handlePayerChange}
      disabled={orchestDisabled}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Nombre Pagador *"
          fullWidth
          name="payerName"
          error={touched.payerName && Boolean(errors.payerName)}
          helperText={touched.payerName && errors.payerName}
        />
      )}
    />
  );
}