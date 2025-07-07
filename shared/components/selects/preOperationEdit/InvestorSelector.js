// components/RegisterOperationForm.js
import React from "react";
import { Dialog, DialogContent, DialogTitle, DialogActions, CircularProgress } from "@mui/material";
import { TextField, Autocomplete} from '@mui/material';

import { toast } from "react-toastify";
import { differenceInDays, startOfDay, addDays } from "date-fns";
import ErrorIcon from '@mui/icons-material/Error';

export default function InvestorSelector({setFieldTouched,setFieldError,errors, touched, setFieldValue, values, index, factura, investors, cargarCuentas, cargarTasaDescuento, cargarBrokerFromInvestor, setClientInvestor}) {

    return (

                   <Autocomplete
                                           options={investors || []}
                                           value={
                                             investors?.find(inv =>
                                               inv?.data?.id === values?.investor ||
                                               inv?.data?.document_number === values?.investorInfo?.document_number
                                             ) || null
                                           }
                                           getOptionLabel={(option) => {
                                             if (!option?.data) return "Desconocido";
                                             return option.data.social_reason ||
                                               `${option.data.first_name || ''} ${option.data.last_name || ''}`.trim() ||
                                               option.data.document_number ||
                                               "Desconocido";
                                           }}
                                           isOptionEqualToValue={(option, value) =>
                                             option?.data?.id === value?.data?.id
                                           }
                                           onChange={async (event, newValue) => {
                                             console.log("Nuevo inversionista seleccionado:", newValue);
                                             if (!newValue) {


                                                setFieldValue('cuentaInversionista', []);
                                                setFieldValue('cuentasDelInversionistaSelected', []);
                                                setFieldValue('numbercuentaInversionista', '');
                                                setFieldValue('nombreInversionista','');
                                                setFieldValue('investorBroker','')
                                                setFieldValue('investorBrokerName','')
                                                setFieldValue('billFraction',1)
                                                setFieldValue('montoDisponibleCuenta', 0)
                                                setFieldValue('montoDisponibleInfo',0)
                                                setFieldValue('applyGm',false)
                                                setFieldValue('investorTax',0)
                                                setFieldValue('GM',0)
                                                setFieldValue('client','')
                                                setFieldValue('accountsInvestorArray',[])
                                                }


                                             if (newValue) {
                                               try {

                                                   // Cargar cuentas del inversionista
                                                    const cuentas = await cargarCuentas(newValue?.data.id);
                                                    
                                                    if (!cuentas?.data?.length) {
                                                    throw new Error('No hay cuentas disponibles');
                                                    }
                                                    
                                                    // Actualizar valores...
                                                        // Cargar cuentas y broker del inversionista seleccionado
                                                    // const cuentas = await cargarCuentas(newValue?.data.id);
                                                    
                                                    setClientInvestor(newValue?.data.id)
                                                    
                                                    const tasaDescuento = await cargarTasaDescuento(newValue?.data.id);
                            
                            
                                                    // Verificar si tasaDescuento es undefined
                                                    if (!tasaDescuento) {
                                                        // Mostrar el mensaje de error usando Toast
                                                      toast("Disculpe, el cliente seleccionado no tiene perfil de riesgo configurado. Por favor, agrege el perfil en el módulo de clientes", "error");
                                                        return; // Detener la ejecución si tasaDescuento es undefined
                                                      }
                                             
                                                const brokerFromInvestor = await cargarBrokerFromInvestor(newValue?.data.id);
                                                 setFieldValue('accountsInvestorArray', cuentas);
                                                 console.log("Datos cargados:", {
                                                   cuentas,
                                                   brokerFromInvestor
                                                 });
                                                 const valorGm = values.presentValueInvestor * 0.002;
                                                 console.log(tasaDescuento?.data?.gmf )
                                                 // Actualizar valores del formulario
                                                 setFieldValue('investor', newValue.data.id);
                                                 setFieldValue('investorInfo', newValue.data);
                                                 setFieldValue('cuentaInversionista', cuentas?.data || []);
                                                setFieldValue(`applyGm`, tasaDescuento?.data?.gmf|| false);
                                                setFieldValue(`GM`,  tasaDescuento?.data?.gmf ? valorGm : 0);
                                                 // Actualizar información del broker
                                                 if (brokerFromInvestor?.data) {
                                                   setFieldValue('investorBroker', brokerFromInvestor.data.id);
                                                   setFieldValue('investorBrokerInfo', {
                                                     investorBrokerid: brokerFromInvestor.data.id,
                                                     investorBrokerName: brokerFromInvestor.data.social_reason ||
                                                       `${brokerFromInvestor.data.first_name || ''} ${brokerFromInvestor.data.last_name || ''}`.trim()
                                                   });
                                                 }
                 
                                               } catch (error) {
                                                 console.error('Error al cargar cuentas:', error);
                                                                         toast.error('No se encontraron cuentas disponibles para este inversionista');
                                               }
                                             } else {
                                               // Limpiar campos si se deselecciona
                                               setFieldValue('investor', '');
                                               setFieldValue('investorInfo', null);
                                               setFieldValue('cuentaInversionista', []);
                                               setFieldValue('investorBroker', '');
                                               setFieldValue('investorBrokerInfo', {
                                                 investorBrokerid: '',
                                                 investorBrokerName: ''
                                               });
                                             }
                                           }}
                                           renderInput={(params) => (
                                             <TextField
                                               {...params}
                                               label="Nombre Inversionista / ID *"
                                               fullWidth
                                               name="investor"
                                               error={touched?.investor && Boolean(errors.investor)}
                                               helperText={touched?.investor && errors.investor}
                                               InputProps={{
                                                 ...params.InputProps,
                                                 endAdornment: (
                                                   <>
                                                     {!investors ? <CircularProgress size={20} /> : null}
                                                     {params.InputProps.endAdornment}
                                                   </>
                                                 )
                                               }}
                                             />
                                           )}
                                           noOptionsText="No hay inversionistas disponibles"
                                         />
    )
}