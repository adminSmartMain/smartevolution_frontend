// components/RegisterOperationForm.js
import React from "react";
import { toast } from "react-toastify";
import { Autocomplete, Box, Button } from "@mui/material";
import ErrorIcon from '@mui/icons-material/Error'; // o cualquier otro ícono de error
// components/RegisterOperationForm.js

import { TextField } from '@mui/material';
import { el } from "date-fns/locale";
import { Toast } from "@components/toast";



export default function EmitterSelector({setClientPagador, orchestDisabled, setIsSelectedPayer,setPendingClear, setIsModalEmitterAd, errors, emitterSaved, payers, setFieldTouched, setFieldValue, setEmitterSaved, touched, values, emisores, brokeDelete, isCreatingBill, fetchBrokerByClient, cargarTasaDescuento, setOpenEmitterBrokerModal, setClientEmitter, setClientBrokerEmitter, cargarFacturas }) {

  return (
    <>

      <Autocomplete
        id="emitter-name" // Para CSS/JS si es necesario
        data-testid="campo-emisor"
        options={emisores}
        isOptionEqualToValue={(option, value) =>
          option?.data?.id === value?.data?.id
        }
        getOptionLabel={(option) => option.label || ''}
        value={values.emitter}
        onInputChange={(event, newInputValue, reason) => {
          if (reason === 'clear') {
            if (brokeDelete && isCreatingBill) {

              // 1. Prevenir el borrado automático
              event.preventDefault();
              event.stopPropagation();

              // 2. Opcional: Mostrar feedback al usuario
             Toast("No se puede borrar el emisor mientras existan facturas creadas");

              // 3. Forzar el valor actual
              return values.emitter;
            }
          }
          return newInputValue; // Comportamiento normal para otros casos
        }}

        onChange={async (event, newValue) => {
          // Verificar si newValue es null o undefined (es decir, si se borró o quitó el emisor)
          setEmitterSaved(newValue);

          if (!newValue) {
            console.log(`caso borrar emisor`)
            
            if (isCreatingBill == true) {

              // 1. Abrir el modal de confirmación
              setIsModalEmitterAd(true);
              setPendingClear(true); // Marcamos que hay un borrado pendiente
              return; // Salimos temprano para esperar la decisión del usuario
            }
            console.log(brokeDelete)
            // Si no está en modo creación o el modal fue confirmado (brokeDelete false)
            if ((!brokeDelete)) {
              console.log(brokeDelete)
              setIsSelectedPayer(false);
              setFieldValue('emitter', '');
            setFieldValue('nombrePagador', '');
            setFieldValue('filtroEmitterPagador.payer', '');
            setFieldValue('takedBills', []);
            setFieldValue('filteredPayers', []);
            setFieldValue('corredorEmisor', '');
              // Find all created invoices (is_creada === true)
              const createdInvoices = values.facturas.filter(factura => factura.is_creada === true);

              if (createdInvoices.length > 0) {
                // Case 1: There are created invoices - do nothing (return)
                setFieldValue(`facturas[${idx}].is_creada`, false);
              } else {
                // Case 2: No created invoices - set is_creada to false for all invoices
                values.facturas.forEach((_, idx) => {
                  setFieldValue(`facturas[${idx}].is_creada`, false);
                  
                });
              }

              setFieldValue('nombrePagador', '');
           
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

              // 4. Resetear solo las facturas no creadas manteniendo campos del inversionista
              setFieldValue('facturas', values.facturas.map((f, index) => {
                // Mantener facturas creadas intactas
                if (indicesCreadas.includes(index)) {
                  return f;
                }
                setClientPagador(null);
                setIsSelectedPayer(false);


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
                  montoDisponibleInfo: f.montoDisponibleInfo || 0,
                  fechaFin: f.fechaFin ,
                  operationDays: f.operationDays || 1,
                  diasOperaciones: f. diasOperaciones || 1,
                };


              }


              )
              );

              // 5. Limpiar campos adicionales solo si no hay facturas creadas
              if (indicesCreadas.length === 0) {
                setFieldValue('nombrePagador', '');
                setFieldValue('filtroEmitterPagador.payer', '');
                setFieldValue('takedBills', []);
                setFieldValue('filteredPayers', []);
                setFieldValue('corredorEmisor', 0);
                setFieldValue('discountTax', 0);
                setClientEmitter(null);
                setClientBrokerEmitter(null);
              }


              return;
            } else {
              console.log(`caso borrar emisor con break delete`)
              // Si brokeDelete es true, mantenemos el emisor original
              console.log(emitterSaved)
              setFieldValue('emitter', emitterSaved);
            }
          }



         if (newValue && values.emitter?.data?.id !== newValue?.data?.id) {
            console.log(`caso diferente emisor del seleccionado`)
            const brokerByClientFetch = await fetchBrokerByClient(newValue?.data.id);


            const fullName = brokerByClientFetch?.data?.first_name
              ? `${brokerByClientFetch.data.first_name} ${brokerByClientFetch.data.last_name}`
              : brokerByClientFetch?.data?.social_reason;

            setFieldValue('filtroEmitterPagador.payer', '');
            setFieldValue('takedBills', []);
            setFieldValue('filteredPayers', []);
            setFieldValue('corredorEmisor', fullName);
            setClientBrokerEmitter(brokerByClientFetch?.data?.id)
            setFieldValue('filtroEmitterPagador.emitter', newValue?.data.id)
            setFieldValue('nombrePagador', '');
            

            const tasaDescuento = await cargarTasaDescuento(newValue?.data.id);
            console.log(tasaDescuento)
            const discountRate = parseFloat(tasaDescuento?.data?.discount_rate) || 0; // Convierte a número o usa 0 si es inválido
            // setFieldValue(`investorTax`, (discountRate * 0.58).toFixed(2));

            setFieldValue(`discountTax`, discountRate);

            // Verificar si tasaDescuento es undefined
            if (!tasaDescuento) {
              // Mostrar el mensaje de error usando Toast
              // Mostrar toast/notificación


              Toast(
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  
                  <span>Disculpe, el cliente seleccionado no tiene perfil de riesgo configurado. Por favor, agrege el perfil en el módulo de clientes</span>
                </div>,
                'warning'
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



            // Si tasaDescuento no es undefined, continuar con el flujo normal
            setFieldValue('emitter', newValue);
            setClientEmitter(newValue)

            setFieldValue('emitterBroker', brokerByClientFetch?.data?.id);
            setClientBrokerEmitter(brokerByClientFetch?.data?.id)




            // Limpiar solo el número de factura sin tocar otros valores
            setFieldValue('facturas', values.facturas.map(factura => ({
              ...factura,
              factura: '', // Se limpia solo este campo
            })));

            // const discountRate = parseFloat(tasaDescuento?.data?.discount_rate) || 0; // Convierte a número o usa 0 si es inválido
            // setFieldValue(`investorTax`, (discountRate * 0.58).toFixed(2));
            setFieldValue(`investorTax`, 0);
            //   setFieldValue(`discountTax`, discountRate);
            setFieldTouched('corredorEmisor', true);

            if (newValue?.data.id) {
              // Cargar nuevas facturas si se ha seleccionado un nuevo emisor
              if (newValue) {

                const facturasEmisor = await cargarFacturas(newValue?.data.id, values.filtroEmitterPagador.payer);

                // Filtrar pagadores con facturas que tienen saldo > 0
                if (facturasEmisor?.data) {
                  const facturasConSaldo = facturasEmisor.data.filter(
                    f => Number(f.currentBalance) > 0
                  );

                  const payerIdsUnicos = [...new Set(
                    facturasConSaldo.map(f => f.payerId).filter(Boolean)
                  )];

                  const pagadoresFiltrados = payers.filter(p =>
                    p?.data?.document_number &&
                    payerIdsUnicos.includes(p.data.document_number)
                  );


                  // Aquí puedes actualizar el estado de los payers disponibles
                  // setPayersFiltrados(pagadoresFiltrados);
                  setFieldValue('filteredPayers', pagadoresFiltrados)
                }

              }
            }


          } else if (newValue && values.emitter?.data?.id === newValue?.data?.id) {
            console.log(`caso diferente emisor del seleccionado fallido`)
            const brokerByClientFetch = await fetchBrokerByClient(newValue?.data.id);


            const fullName = brokerByClientFetch?.data?.first_name
              ? `${brokerByClientFetch.data.first_name} ${brokerByClientFetch.data.last_name}`
              : brokerByClientFetch?.data?.social_reason;


            setFieldValue('corredorEmisor', fullName);
            setClientBrokerEmitter(brokerByClientFetch?.data?.id)
            setFieldValue('filtroEmitterPagador.emitter', newValue?.data.id)

            const tasaDescuento = await cargarTasaDescuento(newValue?.data.id);


            // Verificar si tasaDescuento es undefined
            if (!tasaDescuento) {
              // Mostrar el mensaje de error usando Toast
              // Mostrar toast/notificación
              Toast(<div style={{ display: 'flex', alignItems: 'center' }}>
                <ErrorIcon style={{ marginRight: '10px', color: '#d32f2f' }} />
                <span>Disculpe, el cliente seleccionado no tiene perfil de riesgo configurado. Por favor, agrege el perfil en el módulo de clientes</span>
              </div>, 'warning');

              return; // Detener la ejecución si tasaDescuento es undefined
            }


            // VALIDACIÓN DEL CORREDOR CON MODAL
            if (!brokerByClientFetch) {
              // Abre el modal en lugar del toast
              setClientWithoutBroker(newValue?.data.id);
              setOpenEmitterBrokerModal(true); // Abre el modal
              return; // Detiene la ejecución
            }



            // Si tasaDescuento no es undefined, continuar con el flujo normal
            setFieldValue('emitter', newValue);
            setClientEmitter(newValue)

            setFieldValue('emitterBroker', brokerByClientFetch?.data?.id);
            setClientBrokerEmitter(brokerByClientFetch?.data?.id)




            // Limpiar solo el número de factura sin tocar otros valores
            setFieldValue('facturas', values.facturas.map(factura => ({
              ...factura,
              factura: '', // Se limpia solo este campo
            })));

            const discountRate = parseFloat(tasaDescuento?.data?.discount_rate) || 0; // Convierte a número o usa 0 si es inválido
            // setFieldValue(`investorTax`, (discountRate * 0.58).toFixed(2));
            setFieldValue(`investorTax`, 0);
            setFieldValue(`discountTax`, discountRate);
            setFieldTouched('corredorEmisor', true);


            if (newValue?.data.id) {


              // Cargar nuevas facturas si se ha seleccionado un nuevo emisor
              if (newValue) {

                const facturasEmisor = await cargarFacturas(newValue?.data.id, values.filtroEmitterPagador.payer);

                // Filtrar pagadores con facturas que tienen saldo > 0
                if (facturasEmisor?.data) {
                  const facturasConSaldo = facturasEmisor.data.filter(
                    f => Number(f.currentBalance) > 0
                  );

                  const payerIdsUnicos = [...new Set(
                    facturasConSaldo.map(f => f.payerId).filter(Boolean)
                  )];

                  const pagadoresFiltrados = payers.filter(p =>
                    p?.data?.document_number &&
                    payerIdsUnicos.includes(p.data.document_number)
                  );


                  // Aquí puedes actualizar el estado de los payers disponibles
                  // setPayersFiltrados(pagadoresFiltrados);
                  setFieldValue('filteredPayers', pagadoresFiltrados)
                }

              }
            }



          }
        }}

        renderInput={(params) => (
          <TextField
            {...params}
            label="Nombre Emisor *"
            name="emitter"
            fullWidth
            error={touched.emitter && Boolean(errors?.emitter)}
            helperText={touched.emitter && errors?.emitter}
          />
        )}
      />
    </>

  )
}