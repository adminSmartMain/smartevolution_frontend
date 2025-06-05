// components/RegisterOperationForm.js
import React from "react";

import { TextField, Autocomplete} from '@mui/material';

import { toast } from "react-toastify";
import { differenceInDays, startOfDay, addDays } from "date-fns";
import ErrorIcon from '@mui/icons-material/Error';

export default function InvestorSelector({setFieldTouched,setFieldError,errors, touched, setFieldValue, values, index, factura, investors, cargarCuentas, cargarTasaDescuento, cargarBrokerFromInvestor, setClientInvestor}) {

    return (

                    <Autocomplete
                    id="investor-name" // Para CSS/JS si es necesario
                    data-testid="campo-inversor"
                    options={investors || []} // Usamos investors.data en vez de investors directamente
                    getOptionLabel={(option) => 
                        option?.data?.first_name && option?.data?.last_name 
                        ? `${option.data.first_name} ${option.data.last_name}` 
                        : option?.data?.social_reason || "Desconocido"
                    }
                    isOptionEqualToValue={(option, value) => {

                        return option?.account_number === value?.account_number;
                    }} // Para evitar warnings de MUI

                    onChange={async (event, newValue) => {

                        

                        if (!newValue) {

                        if(values.facturas[index].is_creada===true){
                            return

                        }else {
                            setFieldValue(`facturas[${index}].is_creada`,false)
                        }                                   // 1. Obtener el accountId de la factura que se está deseleccionando
                            const cuentaIdDeseleccionada = factura.idCuentaInversionista;
                            
                            // 2. Calcular el valor que se está liberando (PV + GM)
                            const valorLiberado = (factura.presentValueInvestor || 0) + (factura.gastoMantenimiento || 0);
                            
                            
                            // 4. Buscar facturas con el mismo inversionista
                            const facturasMismoInversionista = values.facturas.filter(
                            f => f.idCuentaInversionista === cuentaIdDeseleccionada
                            );
                        
                            // 5. Distribuir el valor liberado a las otras facturas del mismo inversionista
                            facturasMismoInversionista.forEach((f, i) => {
                            if (factura.idCuentaInversionista === cuentaIdDeseleccionada) {
                                // Calcular nuevo monto disponible sumando el valor liberado
                            
                                const nuevoMontoDisponible = (f.montoDisponibleCuenta || 0) + valorLiberado;
                                
                                setFieldValue(`facturas[${i}].montoDisponibleCuenta`, nuevoMontoDisponible);
                            }
                            });

                        // 3. Limpiar los valores de esta factura (manteniendo los datos del inversionista)
                        setFieldValue(`facturas[${index}]`, {
                            billId:  factura.billId,
                            factura:  factura.factura,
                            fechaEmision:  factura.fechaEmision,
                            valorNominal: factura.valorNominal,
                            saldoDisponible: factura.saldoDisponible,
                            valorFuturo:  factura.valorFuturo,
                            amount:  factura.amount,
                            payedAmount: factura.payedAmount,
                            fraccion: factura.fraccion,
                            porcentajeDescuento: factura.porcentajeDescuento,
                            nombrePagador:  values.nombrePagador,
                            presentValueInvestor: factura.presentValueInvestor,
                            presentValueSF:  factura.presentValueSF,
                             probableDate:  factura.probableDate,
                            investorProfit: factura.investorProfit || 0,
                            comisionSF:  factura.comisionSF  || 0,
                            fechaFin:`${addDays(new Date(),1)}`,
                            numbercuentaInversionista: '',
                            cuentaInversionista:[],
                            cuentasDelInversionistaSelected:[],
                            nombreInversionista: '',
                            investorBroker: '',
                            expirationDate: factura.expirationDate,
                            investorBrokerName: '',
                            montoDisponibleCuenta: 0, // Restablecer al máximo
                            montoDisponibleInfo: 0,
                            gastoMantenimiento: factura.gastoMantenimiento,
                            operationDays: factura.operationDays,
                            tasaInversionistaPR: 0,
                        });

                        

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




                        const todasFacturasInversionista = values.facturas
                        .map((f, i) => {
                            // Asignación segura del nuevo valor
                            const nuevoInversionista = newValue?.data?.id || null;
                            return i === index ? {...f, nombreInversionista: nuevoInversionista} : f;
                        })
                        .filter(f => {
                            const inversionistaActual = newValue?.data?.id;
                            return (
                            inversionistaActual && // Tiene valor truthy
                            f.nombreInversionista && // Factura tiene inversionista
                            f.nombreInversionista === inversionistaActual // Coincidencia exacta
                            );
                        });
                        const facturasMismoBillId = values.facturas.filter(item => 
                            item.billId && // Verifica que billId no sea null, undefined o vacío
                            factura.billId && // Verifica que factura.billId no sea null, undefined o vacío
                            item.billId === factura.billId // Comparación estricta
                        );
                            

                        function encontrarFacturasDuplicadas(facturas, facturaActual, inversionistaId) {
                            // Validaciones iniciales
                            if (!Array.isArray(facturas)) return [];
                            if (!facturaActual?.billId || !inversionistaId) return [];
                            
                            return facturas.filter(factura => {
                            // Verificar que la factura tenga los campos necesarios
                            if (!factura.billId || !factura.nombreInversionista) return false;
                            
                            // Comparar billId con la factura actual
                            const mismoBillId = factura.billId === facturaActual.billId;
                            
                            
                            // Comparar inversionista con el seleccionado
                            const mismoInversionista = factura.nombreInversionista === inversionistaId;
                            
                            return mismoBillId && mismoInversionista;
                            });
                        }
                        
                        // Uso:
                            const inversionistaSeleccionado = newValue?.data?.id; // ID del inversionista seleccionado
                        
                            const facturasDuplicadas = encontrarFacturasDuplicadas(
                            values.facturas, 
                            factura, // la factura que estás procesando actualmente
                            inversionistaSeleccionado
                            );

                            if(todasFacturasInversionista.length===1){
                            if(facturasMismoBillId.length>1 ){
                               
                                
                               // setFieldValue(`facturas[${index}].cuentaInversionista`, cuentas?.data || []);
                                setFieldValue(`facturas[${index}].cuentasDelInversionistaSelected`, cuentas?.data || []);
                                
                                setFieldValue(`facturas[${index}].nombreInversionista`, newValue?.data.id || "");
                                setFieldValue(`facturas[${index}].investorBroker`, brokerFromInvestor?.data.id || "");
                                setFieldValue( `facturas[${index}].tasaInversionistaPR`,tasaDescuento?.data?.discount_rate_investor
                                    ||0)
                                
                                setFieldValue(
                                    `facturas[${index}].investorBrokerName`,
                                    brokerFromInvestor?.data?.first_name && brokerFromInvestor?.data?.last_name
                                    ? `${brokerFromInvestor.data.first_name} ${brokerFromInvestor.data.last_name}`
                                    : brokerFromInvestor?.data?.social_reason || ""
                                );

                            }else if (facturasMismoBillId.length===1 ){
                                
                              //  setFieldValue(`facturas[${index}].cuentaInversionista`, cuentas?.data || []);
                                setFieldValue(`facturas[${index}].cuentasDelInversionistaSelected`, cuentas?.data || []);
                                setFieldValue(`facturas[${index}].nombreInversionista`, newValue?.data.id || "");
                                setFieldValue(`facturas[${index}].investorBroker`, brokerFromInvestor?.data.id || "");
                                setFieldValue( `facturas[${index}].tasaInversionistaPR`,tasaDescuento?.data?.discount_rate_investor
                                    ||0)
                                
                                setFieldValue(
                                    `facturas[${index}].investorBrokerName`,
                                    brokerFromInvestor?.data?.first_name && brokerFromInvestor?.data?.last_name
                                    ? `${brokerFromInvestor.data.first_name} ${brokerFromInvestor.data.last_name}`
                                    : brokerFromInvestor?.data?.social_reason || ""
                                );

                            }
                            }else if(todasFacturasInversionista.length>1){
                        
                            if(facturasDuplicadas.length>=1 ){

                                // Mostrar error en el campo
                                setFieldTouched(`facturas[${index}].nombreInversionista`, true, false);
                                setFieldError(
                                `facturas[${index}].nombreInversionista`,
                                "No puede asignar inversionista a facturas con mismo Bill ID"
                                );
                                
                                // Mostrar toast/notificación
                                toast(<div style={{ display: 'flex', alignItems: 'center' }}>
                                <ErrorIcon style={{ marginRight: '10px', color: '#d32f2f' }} />
                                <span>No puede asignar el mismo inversionista a facturas agrupadas</span>
                                </div>, {
                                position: "bottom-right",
                                autoClose: 5000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true
                                });
                        
                                // Revertir cualquier cambio
                                setFieldValue(`facturas[${index}].nombreInversionista`, '');
                                return;


                            }else if (facturasDuplicadas.length===0 ){
                            
                           // setFieldValue(`facturas[${index}].cuentaInversionista`, cuentas?.data || []);
                            setFieldValue(`facturas[${index}].cuentasDelInversionistaSelected`, cuentas?.data || []);
                            setFieldValue(`facturas[${index}].nombreInversionista`, newValue?.data.id || "");
                            setFieldValue(`facturas[${index}].investorBroker`, brokerFromInvestor?.data.id || "");
                            setFieldValue( `facturas[${index}].tasaInversionistaPR`,tasaDescuento?.data?.discount_rate_investor
                                ||0)
                            setFieldValue( `facturas[${index}].tasaDescuentoPR`,tasaDescuento?.data?.discount_rate  ||0)
                            setFieldValue(
                                `facturas[${index}].investorBrokerName`,
                                brokerFromInvestor?.data?.first_name && brokerFromInvestor?.data?.last_name
                                ? `${brokerFromInvestor.data.first_name} ${brokerFromInvestor.data.last_name}`
                                : brokerFromInvestor?.data?.social_reason || ""
                            );

                            }

                            }else if (facturasDuplicadas.length===0 ){
                            
                           // setFieldValue(`facturas[${index}].cuentaInversionista`, cuentas?.data || []);
                            setFieldValue(`facturas[${index}].cuentasDelInversionistaSelected`, cuentas?.data || []);
                            setFieldValue(`facturas[${index}].nombreInversionista`, newValue?.data.id || "");
                            setFieldValue(`facturas[${index}].investorBroker`, brokerFromInvestor?.data.id || "");
                            setFieldValue( `facturas[${index}].tasaInversionistaPR`,tasaDescuento?.data?.discount_rate_investor
                            ||0)
                            setFieldValue( `facturas[${index}].tasaDescuentoPR`,tasaDescuento?.data?.discount_rate  ||0)
                            setFieldValue(
                            `facturas[${index}].investorBrokerName`,
                            brokerFromInvestor?.data?.first_name && brokerFromInvestor?.data?.last_name
                                ? `${brokerFromInvestor.data.first_name} ${brokerFromInvestor.data.last_name}`
                                : brokerFromInvestor?.data?.social_reason || ""
                            );

                            } else  { 
                        }
                        
                        
                           // setFieldValue(`facturas[${index}].cuentaInversionista`, cuentas?.data || []);
                            setFieldValue(`facturas[${index}].cuentasDelInversionistaSelected`, cuentas?.data || []);
                            setFieldValue(`facturas[${index}].nombreInversionista`, newValue?.data.id || "");
                            setFieldValue(`facturas[${index}].investorBroker`, brokerFromInvestor?.data.id || "");
                            setFieldValue( `facturas[${index}].tasaInversionistaPR`,tasaDescuento?.data?.discount_rate_investor
                            ||0)
                            setFieldValue( `facturas[${index}].tasaDescuentoPR`,tasaDescuento?.data?.discount_rate  ||0)
                            setFieldValue(
                            `facturas[${index}].investorBrokerName`,
                            brokerFromInvestor?.data?.first_name && brokerFromInvestor?.data?.last_name
                                ? `${brokerFromInvestor.data.first_name} ${brokerFromInvestor.data.last_name}`
                                : brokerFromInvestor?.data?.social_reason || ""
                            );
                    } catch (error) {
                        console.error('Error al cargar cuentas:', error);
                        toast.error('No se encontraron cuentas disponibles para este inversionista');
                        

                    }
                        
                        }
                    }}


                    renderInput={(params) => (
                        <TextField
                        {...params}
                        label="Nombre Inversionista / ID *"
                        fullWidth
                        name="nombreInversionista" 
                        helperText={touched.facturas?.[index]?.nombreInversionista && errors.facturas?.[index]?.nombreInversionista} // Ayuda para mostrar errores
                        error={touched.facturas?.[index]?.nombreInversionista && Boolean(errors.facturas?.[index]?.nombreInversionista)}
                        />
                    )}
                    />
    )
}