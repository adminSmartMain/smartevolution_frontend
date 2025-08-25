import React from "react";
import { toast } from "react-toastify";
import { Autocomplete, TextField, Box } from "@mui/material";
import ErrorIcon from '@mui/icons-material/Error';

export default function EmitterSelector({
  errors,
  setFieldTouched,
  setFieldValue,
  touched,
  values,
  emisores,
  cargarFacturas,
  cargarTasaDescuento,
  fetchBrokerByClient,
  setClientWithoutBroker,
  setOpenEmitterBrokerModal,payers,
  integrationCode
}) {
  const handleEmitterChange = async (event, newValue) => {
    try {
      if (!newValue) {
        resetEmitterFields();
        return;
      }

      // Load discount rate first to validate risk profile
      const tasaDescuento = await cargarTasaDescuento(newValue?.data?.id);
      if (!tasaDescuento) {
        showRiskProfileError();
        return;
      }

      // Validate broker configuration
      const brokerByClientFetch = await fetchBrokerByClient(newValue?.data?.id);
      if (!brokerByClientFetch) {
        setClientWithoutBroker(newValue.data.id);
        setOpenEmitterBrokerModal(true);
        return;
      }

      // Update form values
      setFieldValue('emitterId', newValue.data.id);
      setFieldValue('emitter', newValue.data.social_reason || 
        `${newValue.data.first_name || ''} ${newValue.data.last_name || ''}`.trim());
      
      // Load invoices for the selected emitter
      await loadEmitterInvoices(newValue.data.id);

    } catch (error) {
      console.error("Error in emitter selection:", error);
      toast.error("Ocurrió un error al procesar el emisor seleccionado");
    }
  };

  const resetEmitterFields = () => {
    const fieldsToReset = [
      'emitter',
      'emitterId',
      'filtroEmitterPagador.payer',
      'arrayPayers',
      'takedBills'
    ];
    fieldsToReset.forEach(field => setFieldValue(field, field.includes('.') ? '' : []));
  };

  const showRiskProfileError = () => {
    toast(
      <Box display="flex" alignItems="center">
        <ErrorIcon style={{ marginRight: '10px', color: '#d32f2f' }} />
        <span>
          Disculpe, el cliente seleccionado no tiene perfil de riesgo configurado. 
          Por favor, agregue el perfil en el módulo de clientes
        </span>
      </Box>,
      {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      }
    );
  };

  const loadEmitterInvoices = async (emitterId) => {
    const facturasEmisor = await cargarFacturas(emitterId, values.filtroEmitterPagador.payer);
    
    if (facturasEmisor?.data) {
      const facturasConSaldo = facturasEmisor.data.filter(
        f => Number(f.currentBalance) >= 0
      );
      
      const payerIdsUnicos = [...new Set(
        facturasConSaldo.map(f => f.payerId).filter(Boolean))
      ];
     
      const pagadoresFiltrados = payers.filter(p =>
        p?.data?.document_number &&
        payerIdsUnicos.includes(p.data.document_number)
      );
       console.log(pagadoresFiltrados)
      setFieldValue('arrayPayers', pagadoresFiltrados);
    }
  };

  const getOptionLabel = (option) => {
    return option?.data?.social_reason ||
      `${option?.data?.first_name || ''} ${option?.data?.last_name || ''}`.trim() ||
      '';
  };

  const isOptionEqualToValue = (option, value) => {
    return option?.data?.id === value?.data?.id;
  };

  const getCurrentValue = () => {
    if (!values.emitterId) return null;
    return emisores.find(emisor => 
      emisor?.data?.document_number === values.emitterId
    ) || null;
  };
  console.log(integrationCode,integrationCode != "")
  return (
    <Autocomplete
      id="emitter-name"
      data-testid="campo-emisor" 
      options={emisores}
      isOptionEqualToValue={isOptionEqualToValue}
      getOptionLabel={getOptionLabel}
      value={getCurrentValue()}
      onChange={handleEmitterChange}
      disabled
      renderInput={(params) => (
        <TextField
          {...params}
          label="Nombre Emisor *"
          name="emitter"
          fullWidth
          error={touched.emitter && Boolean(errors.emitter)}
          helperText={touched.emitter && errors.emitter}
        />
      )}
    />
  );
}