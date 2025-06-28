// components/RegisterOperationForm.js
import React from "react";
import { toast } from "react-toastify";
import { Autocomplete, Box, Button } from "@mui/material";
import ErrorIcon from '@mui/icons-material/Error'; // o cualquier otro ícono de error
// components/RegisterOperationForm.js

import { TextField } from '@mui/material';
import { el } from "date-fns/locale";



export default function EmitterSelector({setClientPagador, orchestDisabled, setIsSelectedPayer,setPendingClear, setIsModalEmitterAd, errors, emitterSaved, payers, setFieldTouched, setFieldValue, setEmitterSaved, touched, values, emisores, brokeDelete, isCreatingBill, fetchBrokerByClient, cargarTasaDescuento, setOpenEmitterBrokerModal, setClientEmitter, setClientBrokerEmitter, cargarFacturas }) {

  return (
    <>
  <Autocomplete
                     options={emisores}
                     isOptionEqualToValue={(option, value) =>
                       option?.data?.id === value?.data?.id
                     }
                     getOptionLabel={(option) =>
                       option?.data?.social_reason ||
                       `${option?.data?.first_name} ${option?.data?.last_name}` ||
                       ''
                     }
                     value={emisores.find(emisor =>
                       emisor?.data?.id === (values?.emitter?.data?.id || values?.emitter)
                     ) || null}
                     onChange={async (event, newValue) => {
                       if (!newValue) {
                         console.log('caso borrar')
                         // Limpiar campos
                         setFieldValue('emitter', '');
                         setFieldValue('corredorEmisor', '');
                         setFieldValue('filtroEmitterPagador.payer', '');
                         setFieldValue('emitterBroker', '');
                         setFieldValue('investorTax', '');
                         setFieldValue('discountTax', 0);
                          setFieldValue('takedBills', []);
                          setFieldValue('filteredPayers', []);
                         setFieldValue('filteredPayers', '');
                         setFieldValue('nombrePagador', '');
                         return;
                       }

                       
            console.log(tasaDescuento)
           
            // setFieldValue(`investorTax`, (discountRate * 0.58).toFixed(2));

            setFieldValue(`discountTax`, discountRate);

            // Verificar si tasaDescuento es undefined
            if (!tasaDescuento) {
              // Mostrar el mensaje de error usando Toast
              // Mostrar toast/notificación


              toast(
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <ErrorIcon style={{ marginRight: '10px', color: '#d32f2f' }} />
                  <span>Disculpe, el cliente seleccionado no tiene perfil de riesgo configurado. Por favor, agrege el perfil en el módulo de clientes</span>
                </div>,
                {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                }
              );

              return; // Detener la ejecución si tasaDescuento es undefined
            }


            // VALIDACIÓN DEL CORREDOR CON MODAL
            if (!brokerByClientFetch) {
              // Abre el modal en lugar del toast
              setClientWithoutBroker(newValue?.data.id);
              setOpenEmitterBrokerModal(true); // Abre el modal
              return; // Detiene la ejecución
            }


 
                       // Guardar solo el ID o el objeto completo consistentemente
                       // Opción 1: Guardar solo el ID
                       setFieldValue('emitter', newValue.data.id);
 
                       // Opción 2: O guardar el objeto completo (elige una)
                       // setFieldValue('emitter', newValue);
 
                       const brokerByClientFetch = await fetchBrokerByClient(newValue?.data.id);
                       const fullName = brokerByClientFetch?.data?.social_reason ||
                         `${brokerByClientFetch?.data?.first_name || ''} ${brokerByClientFetch?.data?.last_name || ''}`.trim();
 
                       setFieldValue('corredorEmisor', fullName);
                       setFieldValue('filtroEmitterPagador.emitter', newValue?.data.id);
 
                       const tasaDescuento = await cargarTasaDescuento(newValue?.data.id);
 
                       if (!tasaDescuento) {
                         toast("No se ha encontrado un perfil de riesgo para el cliente", "error");
                         return;
                       }
 
                       setFieldValue('emitterBroker', brokerByClientFetch?.data?.id);
                       const discountRate = parseFloat(tasaDescuento?.data?.discount_rate) || 0;
                       setFieldValue('investorTax', 0);
                       setFieldValue('discountTax', discountRate);
                       setFieldTouched('corredorEmisor', true);
 
                       if (newValue?.data.id) {
                         const facturasEmisor = await cargarFacturas(newValue?.data.id, values.filtroEmitterPagador.payer);
 
                         if (facturasEmisor?.data) {
                           const facturasConSaldo = facturasEmisor.data.filter(
                             f => Number(f.currentBalance) >= 0
                           );
 
                           const payerIdsUnicos = [...new Set(
                             facturasConSaldo.map(f => f.payerId).filter(Boolean)
                           )];
 
                           const pagadoresFiltrados = payers.filter(p =>
                             p?.data?.document_number &&
                             payerIdsUnicos.includes(p.data.document_number)
                           );
 
                           setFieldValue('arrayPayers', pagadoresFiltrados);
                         }
                       }
                     }}
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
                
    </>

  )
}
