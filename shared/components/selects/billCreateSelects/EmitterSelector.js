import React from "react";
import { toast } from "react-toastify";
import { Autocomplete, TextField, Box, Button } from "@mui/material";
import ErrorIcon from '@mui/icons-material/Error';

export default function EmitterSelector({
  errors,
  payers,
  setFieldTouched,
  setFieldValue,
  touched,
  values,
  emisores,
  cargarFacturas,
  cargarTasaDescuento,
  fetchBrokerByClient,
  setClientWithoutBroker,
  setOpenEmitterBrokerModal
}) {

  const handleEmitterChange = async (event, newValue) => {
    try {

      if (!newValue) {
      
        resetEmitterFields();
        return;
      }
setFieldValue('billdId', values.factura);
            setFieldValue('factura',values.factura);
        // Restore typeBill after operations
    setFieldValue('typeBill', values.typeBill);


      console.log(newValue.data.id)
      // Load discount rate first to validate risk profile
      const tasaDescuento = await cargarTasaDescuento(newValue?.data.id);
      console.log(tasaDescuento)
      if (!tasaDescuento) {
        console.log('c')
        showRiskProfileError();
        return;
      }

      // Validate broker configuration
      const brokerByClientFetch = await fetchBrokerByClient(newValue?.data.id);
      console.log(brokerByClientFetch)
      console.log('a')
      if (!brokerByClientFetch) {
            console.log('d')
        setClientWithoutBroker(newValue.data.id);
        setOpenEmitterBrokerModal(true);
        return;
      }

      console.log(newValue)
   
      // Load invoices for the selected emitter
      if (newValue) {
            console.log('h')
        await loadEmitterInvoices(newValue.data.id);
          
          setFieldValue('emitterName', newValue.label);
         setFieldValue('emitter', newValue.data.id);
      }

    } catch (error) {
      console.error("Error in emitter selection:", error);
      toast.error("Ocurrió un error al procesar el emisor seleccionado");
    }
  };

  const resetEmitterFields = () => {
    const fieldsToReset = [
      'emitter',
      'corredorEmisor',
      'filtroEmitterPagador.payer',
      'emitterBroker',
      'investorTax',
      'discountTax',
      'takedBills',
      'filteredPayers',
      'nombrePagador',
      'typeBill',
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
      setFieldValue('billdId', values.factura);
            setFieldValue('factura',values.factura);
    }
  };

  const getOptionLabel = (option) => {
    return option?.data?.social_reason ||
      `${option?.data?.first_name} ${option?.data?.last_name}` ||
      '';
  };

  const isOptionEqualToValue = (option, value) => {
    return option?.data?.id === value?.data?.id;
  };

  const getCurrentValue = () => {
    return emisores.find(emisor =>
      emisor?.data?.id === (values?.emitter?.data?.id || values?.emitter)
    ) || null;
  };

  return (
    <Autocomplete
    id="emitter-name" // Para CSS/JS si es necesario
        data-testid="campo-emisor" 
      options={emisores}
      isOptionEqualToValue={isOptionEqualToValue}
      getOptionLabel={getOptionLabel}
      value={getCurrentValue()}
      onChange={handleEmitterChange}
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