// components/RegisterOperationForm.js
import React, { useEffect, useState } from "react";
import { InputAdornment, Box, Modal, Typography, Switch, TextField, Button, Grid, Autocomplete, Accordion, AccordionSummary, AccordionDetails, Tooltip, IconButton } from '@mui/material';
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"; // Icono del dólar
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import esLocale from 'date-fns/locale/es';
import { Formik, Form, FieldArray } from 'formik';
import * as Yup from 'yup';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InfoIcon from '@mui/icons-material/Info';
import { Bills, GetBillFraction,GetRiskProfile, payerByBill,BrokerByClient,AccountsFromClient,UpdateOperation  } from "./queries";
import { useFetch } from "@hooks/useFetch";
import { PV } from "@formulajs/formulajs";
import { addDays, differenceInDays, parseISO, set, isValid } from "date-fns";
export const ManageOperationC = ({
  opId,
  emitters,
  investors,
  dataDetails

}) => {
  console.log('data details',dataDetails)
  const emisores = emitters;
  const tipoOperaciones = ['Compra Titulo', 'Lorem Ipsum', 'Lorem Ipsum'];
  
  // Simulación de correlativo (luego se obtendrá del backend)
  const getNextOperationNumber = () => opId; // Ejemplo: siempre empieza en 1001
  
  const {
      fetch: fetchBills,
      loading: loadingBills,
      error: errorBills,
      data: dataBills,
    } = useFetch({ service: Bills, init: false });
  

  const {
        fetch: fetchBrokerByClient,
        loading: loadingBrokerByClient,
        error: errorBrokerByClient,
        data: dataBrokerByClient,
      } = useFetch({ service: BrokerByClient, init: false });
  
    const {
          fetch: fetchAccountFromClient,
          loading: loadingAccountFromClient,
          error: errorAccountFromClient,
          data: dataAccountFromClient,
    } = useFetch({ service: AccountsFromClient, init: false });
      
    const {
      fetch: riskProfileFetch,
      loading: loadingRiskProfile,
      error: errorRiskProfile,
      data: dataRiskProfile,
    } = useFetch({ service: GetRiskProfile, init: false });
  
 
    const {
        fetch: getBillFractionFetch,
        loading: loadingGetBillFraction,
        error: errorGetBillFraction,
        data: dataGetBillFraction,
      } = useFetch({ service:GetBillFraction, init: false });
    
       
    const {
      fetch: updateOperationFetch,
      loading: loadingUpdateOperation,
      error: errorUpdateOperation,
      data: dataUpdateOperation,
    } = useFetch({ service: UpdateOperation, init: false });
  
  // Formatear monto como moneda colombiana
const formatCurrency = (value) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
  }).format(value);

// Función para formatear el número con separadores de miles
const formatNumberWithThousandsSeparator = (value) => {
  return value
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Agrega separadores de miles
};

const validationSchema = Yup.object({
  numeroOperacion: Yup.number()
    .required('Este campo es obligatorio')
    .typeError('Debe ser un número válido'), // Validación para campo numérico
  fechaOperacion: Yup.date().required('Este campo es obligatorio'),
  tipoOperacion: Yup.string()
    .required('Este campo es obligatorio')
    .oneOf(tipoOperaciones, 'Tipo de operación no válido'),
  nombreEmisor: Yup.string().required('Este campo es obligatorio'),
  corredorEmisor: Yup.string().required('Este campo es obligatorio'),
  nombrePagador: Yup.string().required('Este campo es obligatorio'),
  facturas: Yup.array().of(
    Yup.object({
      nombreInversionista: Yup.string().required('Este campo es obligatorio'),
      cuentaInversionista: Yup.string().required('Este campo es obligatorio'),
      factura: Yup.string().required('Este campo es obligatorio'),
      fraccion: Yup.number().required('Este campo es obligatorio'),
      valorFuturo: Yup.number()
        .required('Este campo es obligatorio')
        .typeError('Debe ser un número válido'),
      porcentajeDescuento: Yup.number()
        .required('Este campo es obligatorio')
        .min(0, 'El descuento no puede ser menor a 0%')
        .max(100, 'El descuento no puede ser mayor a 100%'),
      fechaEmision: Yup.date().required('Este campo es obligatorio'),
      valorNominal: Yup.number().required('Este campo es obligatorio'),
      tasaInversionista: Yup.number().required('Este campo es obligatorio'),
      fechaFin: Yup.date().required('Este campo es obligatorio'),
      diasOperaciones: Yup.date().required('Este campo es obligatorio'),
      comisionSF: Yup.number().required('Este campo es obligatorio'),
      gastoMantenimiento: Yup.number().required('Este campo es obligatorio'),
    })
  ),
});

  const initialValues = {
    amount: 0,
    applyGm: false,
    bill: "",
    billFraction: 0,
    client: "",
    clientAccount: "",
    commissionSF: 0,
    DateBill: `${new Date().toISOString().substring(0, 10)}`,
    DateExpiration: `${new Date().toISOString().substring(0, 10)}`,
    discountTax: 0,
    emitter: "",
    emitterBroker: "",
    GM: 0,
    id: "",
    investor: "",
    investorBroker: "",
    investorProfit: 0,
    investorTax: 0,
    opDate: `${new Date().toISOString().substring(0, 10)}`,
    operationDays: 0,
    opExpiration: `${new Date().toISOString().substring(0, 10)}`,
    opId: null,
    opType: "",
    payedAmount: 0,
    payedPercent: 0,
    payer: "",
    presentValueInvestor: 0,
    presentValueSF: 0,
    probableDate: `${new Date().toISOString().substring(0, 10)}`,
    status: 0,
    billCode: "",
    isReBuy: false,
    massive: false,
    integrationCode:""
  };


    

  const [openModal, setOpenModal] = useState(false);

  // Función para abrir la modal
  const handleOpenModal = () => {
    console.log("Abriendo modal...");
    setOpenModal(true);
  };

  // Función para cerrar la modal
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // Función para confirmar la operación
  const handleConfirm = (values) => {
    console.log("Operación registrada:", values);
    handleCloseModal();
    // Aquí puedes agregar más lógica para guardar la operación, etc.
  };

  // Función de envío del formulario
  const handleSubmit = (values) => {
    // Validar que todos los campos obligatorios estén completos
    const isFormValid = Object.keys(values).every((key) => {
      if (Array.isArray(values[key])) {
        return values[key].every((item) => Object.keys(item).every((subKey) => item[subKey] !== ''));
      }
      return values[key] !== '';
    });

    if (isFormValid) {
      // Si el formulario es válido, abre la modal
      handleOpenModal();
    } else {
      alert("Por favor, complete todos los campos obligatorios.");
      
    }
    
  };


  const [isRecompra, setIsRecompra] = useState(false); // Estado para el aviso de Recompra
  const [facturasFiltradas, setFacturasFiltradas] = useState([]); // Facturas filtradas por emisor
  const [cuentasFiltradas, setCuentasFiltradas] = useState([]); // Cuentas filtradas por inversionista

// Función para cargar cuentas cuando se selecciona un inversionista
const cargarCuentas = async (inversionista) => {
  if (!inversionista) return null; // Retorna null si no hay inversionista

  try {
    const cuentas = await fetchAccountFromClient(inversionista);
    return cuentas; // 🔹 Devuelve las cuentas obtenidas
  } catch (error) {
    console.error("Error al cargar cuentas:", error);
    return null; // Retorna null en caso de error
  }
};

const cargarBrokerFromInvestor= async (inversionista) => {
  if (!inversionista) return null; // Retorna null si no hay inversionista

  try {
    const brokerFromInvestor = await fetchBrokerByClient(inversionista);
    return brokerFromInvestor; // 🔹 Devuelve las cuentas obtenidas
  } catch (error) {
    console.error("Error al cargar brokerFromInvestor:", error);
    return null; // Retorna null en caso de error
  }
};



const cargarTasaDescuento= async (emisor) => {
  if (!emisor) return null; // Retorna null si no hay emisor

  try {
    const tasaDescuento = await riskProfileFetch(emisor);
    return tasaDescuento; // 🔹 Devuelve las cuentas obtenidas
  } catch (error) {
    console.error("Error al cargar tasaDescuento:", error);
    return null; // Retorna null en caso de error
  }
};





const cargarFraccionFactura= async (factura) => {
  if (!factura) return null; // Retorna null si no hay emisor

  try {
    const tasaInversionista = await getBillFractionFetch(factura);
    return  tasaInversionista; // 🔹 Devuelve las cuentas obtenidas
  } catch (error) {
    console.error("Error al cargar brokerFromInvestor:", error);
    return null; // Retorna null en caso de error
  }
};
  // Función para verificar si es una recompra
  const checkRecompra = (numeroOperacion) => {
    // Simulación: Si el número de operación es par, es una recompra
    return numeroOperacion % 2 === 0;
  };

  // Función para cargar facturas desde el backend
  const cargarFacturas = async (emisor) => {
    if (emisor) {
      const { facturas } = await fetchBills(emisor);
      setFacturasFiltradas(dataBills); // Aquí filtramos las facturas
    } else {
      setFacturasFiltradas([]); // Si no hay emisor, no mostramos facturas
    }
  };
  useEffect(() => {
    console.log("Facturas filtradas actualizadas:", facturasFiltradas);
  }, [facturasFiltradas]); // Se ejecuta cuando cambia el estado
  console.log(dataBills)
  

  const [brokerByClient,setBrokerByClient]=useState()

  useEffect(() => {
    console.log("Data broker filtradas actualizadas:", dataBrokerByClient);
    setBrokerByClient(dataBrokerByClient)
  }, [dataBrokerByClient]); // Se ejecuta cuando cambia el estado
 
 console.log(brokerByClient)






 const [AccountFromClient,setAccountFromClient]=useState()
 useEffect(() => {
  console.log("Account of investor filtradas actualizadas:",dataAccountFromClient);
  setAccountFromClient(dataAccountFromClient)
}, [dataAccountFromClient]); // Se ejecuta cuando cambia el estado

console.log(AccountFromClient)
  // Función para calcular el valor nominal basado en el valor futuro y el porcentaje de descuento
  const calcularValorNominal = (valorFuturo, porcentajeDescuento) => {
    return valorFuturo * (1 - porcentajeDescuento / 100);
  };

// Función para calcular el porcentaje de descuento basado en el valor futuro y el valor nominal
const calcularPorcentajeDescuento = (valorFuturo, valorNominal) => {
  if (valorFuturo === 0) return 0;
  return ((1 - valorNominal / valorFuturo) * 100).toFixed(2);
};

//Formatear la fecha en la cabecera del acordeon. 
const formatDate = (date) => {
  if (!date) return "N/A";
  const options = { day: "2-digit", month: "short", year: "numeric" };
  return new Date(date).toLocaleDateString("es-ES", options);
};
  
useEffect(() => {
  if (dataDetails?.data?.emitter?.id) {
    cargarFacturas(dataDetails.data.emitter.id);
  }
}, [dataDetails?.data?.emitter?.id]); // Se ejecuta solo cuando el ID del emisor cambia






  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={esLocale}>
      {/* Para mostrar los toast */}
      <ToastContainer position="top-right" autoClose={5000} />
      <Box sx={{ padding: 3 }}>
        <Typography variant="h4" gutterBottom>
          Editar Operación
        </Typography>
        <Formik 
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}>
          {/* {({ values, setFieldValue, touched, errors, handleBlur }) => ( */}
          {({ values, setFieldValue, touched, errors, handleBlur }) => (
            <Form onSubmit={handleSubmit}>
             <Grid container spacing={2}>
               {/* Primera fila: Número de Operación, Fecha de Operación y Tipo de Operación */}
               <Grid item xs={12} md={1.5}>
                  <TextField
                    label="Número de Operación *"
                    fullWidth
                    type="number"
                    value={dataDetails?.data?.opId}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFieldValue('numeroOperacion', value);
                      setIsRecompra(checkRecompra(value)); // Verifica si es recompra
                    }}
                    onBlur={handleBlur}
                    error={touched.numeroOperacion && Boolean(errors.numeroOperacion)}
                    helperText={touched.numeroOperacion && errors.numeroOperacion}
                    inputProps={{ min: 0 }} // Asegura que no se ingresen números negativos
                  />
                  {/* Aviso de Recompra */}
                  {isRecompra && (
                    <Typography variant="body2" color="warning.main" sx={{ mt: 0.5 }}>
                      Operación de Recompra
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} md={1.5}>
                  <DatePicker
                    label="Fecha de Operación *"
                    value={dataDetails?.data?.opDate}
                    onChange={(newValue) => setFieldValue('fechaOperacion', newValue)}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </Grid>
                <Grid item xs={12} md={2}>
            <Autocomplete
              options={tipoOperaciones}
              value={tipoOperaciones.find(option => option === dataDetails?.data?.opType?.description) || null} // Asegura que el valor seleccionado esté en la lista
             
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Tipo de Operación *"
                  fullWidth
                  error={touched.tipoOperacion && Boolean(errors.tipoOperacion)}
                  helperText={touched.tipoOperacion && errors.tipoOperacion}
                />
              )}
              onChange={(event, newValue) => setFieldValue("tipoOperacion", newValue?.value || "")}
              onBlur={handleBlur}
            />
          </Grid>


                {/* Campo de Emisor */}
                <Grid item xs={12} md={4}>
                  <Autocomplete
                    options={emisores}
                    value={
                      (dataDetails?.data?.emitter?.first_name && dataDetails?.data?.emitter?.document_number)
                        ? `${dataDetails.data.emitter.first_name} - ${dataDetails.data.emitter.document_number}`
                        : (dataDetails?.data?.emitter?.social_reason && dataDetails?.data?.emitter?.document_number)
                        ? `${dataDetails.data.emitter.social_reason} - ${dataDetails.data.emitter.document_number}`
                        : null
                    }
                     // Manejo de valores nulos correctamente
                    onChange={async (event, newValue) => {
                      if (newValue && values.nombreEmisor !== newValue) {
                        try {
                          await fetchBrokerByClient(newValue.data.id);
                          const tasaDescuento = await cargarTasaDescuento(newValue.data.id);

                          console.log(tasaDescuento);
                          setFieldValue("nombreEmisor", newValue);
                          setFieldValue("corredorEmisor", dataDetails.data.emitterBroker.first_name || "");

                          // Limpiar solo el número de factura sin afectar otros valores
                          setFieldValue(
                            "facturas",
                            values.facturas.map((factura) => ({
                              ...factura,
                              factura: "", // Se limpia solo este campo
                            }))
                          );

                          const discountRate = parseFloat(tasaDescuento?.data?.discount_rate) || 0;
                          setFieldValue("tasaInversionista", (discountRate * 0.58).toFixed(2));
                          setFieldValue("tasaDescuento", discountRate);

                          console.log(values);

                          // Cargar nuevas facturas
                          await cargarFacturas(newValue.data.id);
                        } catch (error) {
                          console.error("Error al cargar datos del emisor:", error);
                        }
                      }

                     
                    }}
                   
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Nombre Emisor *"
                        fullWidth
                        error={touched.nombreEmisor && Boolean(errors.nombreEmisor)}
                        helperText={touched.nombreEmisor && errors.nombreEmisor}
                      />
                    )}
                  />
                </Grid>


               {/* Selector de Corredor Emisor */}
                <Grid item xs={12} md={3}>
                  <Autocomplete
                    options={brokerByClient ? [brokerByClient] : []} // Asegurar que sea un array válido
                    value={brokerByClient || null}  // Tomar en cuenta valores de edición desde dataDetails
                    getOptionLabel={(option) =>
                      option?.data?.first_name && option?.data?.last_name
                        ? `${option.data.first_name} ${option.data.last_name}`
                        : ""
                    } // Mostrar first_name y last_name si están disponibles
                   
                    onChange={(event, newValue) => setFieldValue("corredorEmisor", newValue)}
                    disabled // Deshabilitar selección manual
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Corredor Emisor *"
                        fullWidth
                        name="corredorEmisor"
                        error={touched.corredorEmisor && Boolean(errors.corredorEmisor)}
                        helperText={touched.corredorEmisor && errors.corredorEmisor}
                      />
                    )}
                  />
                </Grid>


                {/* Factura */}
                
                 <Grid item xs={12}>
                          {/* Contenedor principal para el botón de eliminar y el acordeón */}
                          <Grid container alignItems="flex-start" spacing={2}>
                            
                            {/* Acordeón */}
                            <Grid item xs>
                            
                                <Grid container alignItems="center" spacing={2}>
                                {/* Número de factura de la cabecera del acordeon */}
                                <Grid item>
                                  <Typography>
                                    {dataDetails?.data?.bill?.billId }
                                  </Typography>
                                </Grid>
                                {/* Fecha de emisión y vencimiento de la cabecera del acordeon*/}
                                <Grid item>
                                  <Typography variant="body2" color="textSecondary">
                                    Emisión: {dataDetails?.data?.bill?.dateBill ? formatDate(dataDetails?.data?.bill?.dateBill ) : "-- -- ----"} | 
                                    Vencimiento: {dataDetails?.data?.bill?.dateBill ? formatDate(dataDetails?.data?.bill?.dateBill ) : "-- -- ----"}
                                  </Typography>
                                </Grid>
                                
                              </Grid>
                          
                              <Grid container spacing={3}>
                                    <Grid item xs={12} md={2}>
                                      <Autocomplete
                                          options={(dataBills?.data || []).map(factura => ({
                                            label: `${factura.billId} - ${factura.billValue}`,
                                            value: factura.billId,
                                          }))}
                                          getOptionLabel={(option) => option.label}
                                          isOptionEqualToValue={(option, value) => option.value === value.value}
                                          value={
                                            dataBills?.data
                                              ?.map(f => ({ label: `${f.billId} - ${f.billValue}`, value: f.billId }))
                                              .find(opt => opt.value === dataDetails?.data?.bill?.billId) || null
                                          }
                                          onChange={async (event, newValue) => {
                                            if (newValue) {
                                              const selectedFactura = dataBills?.data.find(f => f.billId === newValue.value);
                                              if (selectedFactura) {
                                                const fractionBill = await cargarFraccionFactura(selectedFactura.id);
                                                console.log(fractionBill?.data?.billValue);
                                              }
                                            }
                                          }}
                                          renderInput={(params) => (
                                            <TextField {...params} label="Número de Factura *" fullWidth />
                                          )}
                                        />


                                    </Grid>

                                        <Grid item xs={12} md={1}>
                                          <TextField
                                            label="Fracción"
                                            fullWidth
                                            type="number"
                                            value={dataDetails?.data?.billFraction || 1}  // Valor por defecto si no existe fracción
                                            onChange={(e) => {
                                              let fraccion = parseFloat(e.target.value);
                                              if (isNaN(fraccion) || fraccion <= 0) fraccion = 1;  // Evitar valores inválidos o negativos

                                              // Obtener el saldo disponible de la factura
                                              const saldoDisponible = dataDetails?.data?.bill?.billValue || 0;
                                              
                                              // Calcular el valor futuro sin decimales
                                              const valorFuturoCalculado = Math.floor(saldoDisponible / fraccion);

                                              
                                            }}
                                            onBlur={handleBlur}  // Si tienes validación adicional, puedes manejarla aquí
                                          />
                                        </Grid>

                                        <Grid item xs={12} md={3}>
                                            <TextField
                                              label="Saldo Disponible en factura"
                                              fullWidth
                                              value={formatCurrency(dataDetails?.data?.bill?.total || 0)}
                                              disabled
                                            />
                                        </Grid>
                                        {/* Fecha Probable*/}
                                      <Grid item xs={12} md={1.5}>
                                        <DatePicker
                                          label="Fecha probable"
                                          value={dataDetails?.data?.bill?.dateBill}
                                         
                                          renderInput={(params) => <TextField {...params} fullWidth />}
                                        />
                                      </Grid> 

                                      <Grid item xs={12} md={4.5}>
                                        <Autocomplete
                                            options={investors || []} // Acceder a investors.data para evitar errores
                                            value={
                                              investors?.data?.find(
                                                (inv) => inv.id === dataDetails?.data?.investor?.id
                                              ) || null
                                            } // Seleccionar correctamente el valor
                                            getOptionLabel={(option) =>
                                              option?.data?.first_name && option?.data?.last_name
                                                ? `${option.data.first_name} ${option.data.last_name}`
                                                : option?.data?.social_reason || "Desconocido"
                                            }
                                            isOptionEqualToValue={(option, value) => option?.id === value?.id} // Comparación correcta
                                            onChange={async (event, newValue) => {
                                              console.log("Nuevo valor seleccionado:", newValue);
                                              
                                              if (newValue) {
                                                console.log("ID del inversionista:", newValue?.data?.id);

                                                try {
                                                  const cuentas = await cargarCuentas(newValue?.data?.id);
                                                  const brokerFromInvestor = await cargarBrokerFromInvestor(newValue?.data?.id);

                                                  console.log("Cuentas:", cuentas);
                                                  console.log("Broker del inversionista:", brokerFromInvestor);
                                                } catch (error) {
                                                  console.error("Error al cargar datos del inversionista:", error);
                                                }
                                              }
                                            }}
                                            renderInput={(params) => (
                                              <TextField {...params} label="Nombre Inversionista / ID *" fullWidth />
                                            )}
                                          />

  
                                        </Grid>


                                        {/* Cuenta de Inversionista */}
                                  <Grid item xs={12} md={3}>

                                    
                                    <TextField
                                      
                                      value={dataDetails?.data?.investor?.id || 'no hay'} // Mostrar el corredor asignado // Evitar errores de comparación con null// Comparación correcta
                                      label="Cuenta Inversionista *"
                                      fullWidth
                                      onChange={(event, newValue) => {
                                        console.log(values)
                                        
                                        
                                        //setFieldValue(`facturas[${index}].cuentaInversionista`, newValue? AccountFromClient.data[index]?.account_number:0);
                                        // Actualiza el Monto Disponible Cuenta Inversionista con el saldo de la cuenta seleccionada
                                        
                                      }}
                                      disabled // Deshabilitar selección manual
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          label="Cuenta Inversionista*"
                                          fullWidth
                                          name="cuentaInversionista"
                                        
                                          
                                        />
                                      )}
                                    />
                                  </Grid>

                                  {/*Monto disponible en cuenta inversionista */}                                    
                                <Grid item xs={12} md={3}>
                                  <TextField
                                    label="Monto Disponible Cuenta Inversionista"
                                    fullWidth
                                    value={formatCurrency(dataDetails?.data?.investorProfit|| 0)}
                                    disabled // Deshabilita la edición manual
                                  />
                                </Grid>


                                {/*Selector de Pagadores*/}
                                    <Grid item xs={12} md={6}>
                                      <Autocomplete
                                        options={emisores}
                                        onChange={(event, newValue) => setFieldValue('nombrePagador', newValue)}
                                        renderInput={(params) => (
                                          <TextField {...params}
                                          label="Nombre Pagador *" 
                                          fullWidth
                                          error={touched.nombrePagador && Boolean(errors.nombrePagador)}
                                            helperText={touched.nombrePagador && errors.nombrePagador}
                                          />
                                        )}
                                        
                                      />
                                    </Grid>
                                    {/* Valor Futuro */}
                                    <Grid item xs={12} md={3} style={{ position: 'relative' }}>
                                      <TextField
                                        label="Valor Futuro"
                                        fullWidth
                                        type="text" // Usamos tipo "text" para manejar el formato
                                        value={dataDetails?.data?.presentValueSF ? formatNumberWithThousandsSeparator(Math.floor(dataDetails?.data?.presentValueSF)) : ""} // Aplicamos el formato solo en la visualización, usando Math.floor para eliminar decimales
                                        onChange={(e) => {
                                          // Eliminar caracteres no numéricos para mantener el valor limpio
                                          const rawValue = e.target.value.replace(/[^\d]/g, ""); 
                                          const valorFuturoManual = parseFloat(rawValue) || 0;

                                         
                                          // Si el valor nominal no ha sido editado manualmente, actualizamos el valor nominal
                                          if (!factura.valorNominalManual) {
                                            const nuevoValorNominal = calcularValorNominal(valorFuturoManual, dataDetails?.data?.discountTax|| 0);
                                            setFieldValue(`facturas[${index}].valorNominal`, nuevoValorNominal);
                                          }
                                        }}
                                        onFocus={(e) => {
                                          // Al hacer foco, removemos el formato para permitir la edición del valor numérico
                                          e.target.value = dataDetails?.data?.presentValueSF ? dataDetails?.data?.presentValueSF.toString() : "";
                                        }}
                                        onBlur={(e) => {
                                          // Al perder el foco, aplicar el formato de separadores de miles y asegurarse que sea un número entero
                                          const rawValue = e.target.value.replace(/[^\d]/g, "");
                                          const valorFuturoManual = parseFloat(rawValue) || 0;
                                          setFieldValue(`facturas[${index}].valorFuturo`, valorFuturoManual);
                                        }}
                                        placeholder={`Sugerido: ${dataDetails?.data?.bill?.total && dataDetails?.data?.billFraction ? formatNumberWithThousandsSeparator(Math.floor((dataDetails?.data?.bill?.total || 0) / (dataDetails?.data?.billFraction || 1))) : ""}`} // Aseguramos que el placeholder muestre el valor formateado como número entero
                                        
                                        onBlur={handleBlur}
                                        
                                        InputProps={{
                                          startAdornment: (
                                            <InputAdornment position="start">
                                              <AttachMoneyIcon style={{ color: 'rgb(94, 163, 163)', fontSize: '1.2rem' }} />
                                            </InputAdornment>
                                          ),
                                        }}
                                      />
                                      {/** Ícono Infotip con Tooltip */}
                                      <Tooltip 
                                        title="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer turpis eros, elementum et egestas sit amet, ullamcorper non purus.
                                        Donec id tincidunt mauris, non consequat dolor. Duis semper elementum rutrum. In hac habitasse platea dictumst. Pellentesque et felis interdum, efficitur nulla ut, vestibulum risus."
                                        placement="top-end" // Cambiar la posición para que esté a la derecha, alineado con el campo
                                        enterDelay={200} // Retardo para aparecer rápidamente
                                        leaveDelay={200} // Retardo para desaparecer rápidamente
                                        arrow
                                        PopperProps={{
                                          modifiers: [
                                            {
                                              name: 'offset',
                                              options: {
                                                offset: [0, 5], // Ajusta el desplazamiento del tooltip
                                              },
                                            },
                                          ],
                                        }}
                                      >
                                        <IconButton
                                          size="small"
                                          style={{
                                            position: 'absolute', // Alineado dentro del contenedor
                                            top: '50%', 
                                            right: 2, // Colocado a la derecha del campo
                                            transform: 'translateY(-50%)', // Centrado verticalmente en el campo
                                            padding: 0.8,
                                            marginLeft: 8,
                                          }}
                                        >
                                          <InfoIcon style={{ fontSize: '1rem', color: 'rgb(94, 163, 163)' }} />
                                        </IconButton>
                                      </Tooltip>
                                    
                                      
                                    </Grid>
                                    {/* Campo de porcentaje de descuento */}
                                    <Grid item xs={12} md={1} style={{ position: 'relative' }}>
                                      <TextField
                                        label="% Descuento"
                                        fullWidth
                                        type="number"
                                        value={ dataDetails?.data?.bill?.discountTax ?? 0}
                                        onChange={(e) => {
                                          let value = e.target.value ? Math.min(Math.max(Number(e.target.value), 0), 100) : 0;
                                          

                                          // Recalcular el valor nominal con el nuevo % de descuento
                                          const valorFuturo = dataDetail?.data?.presentValueSF || 0;
                                          const nuevoValorNominal = calcularValorNominal(valorFuturo, value);
                                         
                                        }}
                                        inputProps={{ min: 0, max: 100 }}
                                      />                                   
                                    {/** Ícono Infotip con Tooltip */}
                                      <Tooltip 
                                        title="Este campo se utiliza para aplicar un descuento sobre el valor futuro de la factura."
                                        placement="top-end" // Cambiar la posición para que esté a la derecha, alineado con el campo
                                        enterDelay={200} // Retardo para aparecer rápidamente
                                        leaveDelay={200} // Retardo para desaparecer rápidamente
                                        arrow
                                        PopperProps={{
                                          modifiers: [
                                            {
                                              name: 'offset',
                                              options: {
                                                offset: [0, 5], // Ajusta el desplazamiento del tooltip
                                              },
                                            },
                                          ],
                                        }}
                                      >
                                        <IconButton
                                          size="small"
                                          style={{
                                            position: 'absolute', // Alineado dentro del contenedor
                                            top: '50%', 
                                            right: 2, // Colocado a la derecha del campo
                                            transform: 'translateY(-50%)', // Centrado verticalmente en el campo
                                            padding: 0.8,
                                            marginLeft: 8,
                                          }}
                                        >
                                          <InfoIcon style={{ fontSize: '1rem', color: 'rgb(94, 163, 163)' }} />
                                        </IconButton>
                                      </Tooltip>
                                    

                                   
                                  </Grid>

                                  {/*Tasa Descuento */}
                                  <Grid item xs={12} md={2}>
                                      <TextField
                                        label="Tasa Descuento"
                                        fullWidth
                                        type="number"
                                        value={ dataDetails?.data?.bill?.discountTax ?? 0}
                                        
                                      />
                                    </Grid>

                                    {/* Campo de valor nominal */}
                                    <Grid item xs={12} md={3}>
                                      <TextField
                                        label="Valor Nominal"
                                        fullWidth
                                        value={dataDetails?.data?.payedAmount ? formatNumberWithThousandsSeparator(Math.floor(dataDetails?.data?.payedAmount)) : ""}
                                        
                                      
                                       
                                       
                                        
                                      />
                                    </Grid>

                                    <Grid item xs={12} md={1.5}>
                                    <TextField
                                      label="Tasa Inversionista"
                                      fullWidth
                                      type="number"
                                      value={dataDetails?.data?.investorTax || 0}
                                     
                                    />
                                  </Grid>
                                  <Grid item xs={12} md={1.5}>
                                    <DatePicker
                                      label="Fecha Fin"
                                      value={dataDetails?.data?.bill?.dateBill}
                                     
                                      renderInput={(params) => <TextField {...params} fullWidth />}
                                    />
                                  </Grid>
                                  <Grid item xs={12} md={1}>
                                    <TextField
                                      label="Días Operación"
                                      fullWidth
                                      type="number"
                                      value={dataDetails?.data?.commissionSF || 0}
                                      
                                    />
                                  </Grid>
                                  {/* Campo Utilidad Inversión*/ }
                                  <Grid item xs={12} md={3}>
                                    <TextField
                                      label="Utilidad Inversión"
                                      fullWidth
                                      value={formatCurrency(dataDetails?.data?.investorProfit )} // Formato moneda
                                      disabled // Bloquear edición
                                      InputProps={{
                                        inputComponent: "input", // Asegura que se muestre correctamente
                                      }}
                                    />
                                  </Grid>
                                  {/* Valor Presente Inversión*/ }
                                  <Grid item xs={12} md={4}>
                                    <TextField
                                      label="Valor Presente Inversión"
                                      fullWidth
                                      value={formatCurrency(dataDetails?.data?.bill?.commissionSF )} // Formato moneda
                                      disabled // Bloquear edición
                                      InputProps={{
                                        inputComponent: "input", // Asegura que se muestre correctamente
                                      }}
                                    />
                                  </Grid>
                                  {/* Valor Presente SF*/ }
                                  <Grid item xs={12} md={4}>
                                    <TextField
                                      label="Valor Presente SF"
                                      fullWidth
                                      value={formatCurrency(dataDetails?.data?.presentValueInvestor )} // Formato moneda
                                      disabled // Bloquear edición
                                      InputProps={{
                                        inputComponent: "input", // Asegura que se muestre correctamente
                                      }}
                                    />
                                  </Grid>
                                  {/* Comisión SF*/ }
                                  <Grid item xs={12} md={4}>
                                    <TextField
                                      label="Comisión SF"
                                      fullWidth
                                      value={formatCurrency(dataDetails?.data?.commissionSF)} // Formato moneda
                                      disabled // Bloquear edición
                                      InputProps={{
                                        inputComponent: "input", // Asegura que se muestre correctamente
                                      }}
                                    />
                                  </Grid>
                                  {/*Selector de Corredor Inversionista */}
                                  <Grid item xs={12} md={4}>
                                    <TextField
                                      label="Corredor Inversionista *"
                                      fullWidth
                                      value={dataDetails?.data?.investorBroker?.first_name|| ''} // Mostrar el corredor asignado
                                      disabled // Bloquear edición
                                      InputProps={{
                                        inputComponent: "input", // Asegura que se muestre correctamente
                                      }}
                                    />
                                  </Grid>
                                  {/* Gasto de Mantenimiento */}
                                  <Grid item xs={12} md={4}>
                                    <div className="flex flex-row gap-2 items-center p-2 border rounded-lg shadow-md">
                                      <label className="text-lg font-medium flex-shrink-0">Gasto de Mantenimiento (GM)</label>
                                      <Switch
                                        checked={dataDetails?.data?.bill?.state || false} // Se gestiona el estado activo de la factura
                                        
                                      />
                                      <TextField
                                        type="text"
                                        placeholder="$ 0,00"
                                        value={dataDetails?.data?.applyGm || ""}
                                        onChange={(e) => setFieldValue(`facturas[${index}].gastoMantenimiento`, e.target.value)}
                                        disabled={!dataDetails?.data?.bill?.state } // Deshabilita el campo si no está activo
                                        fullWidth
                                        variant="outlined"
                                        className={`flex-1 ${dataDetails?.data?.bill?.state  ? "bg-white" : "bg-gray-200 text-gray-500"}`}
                                      />
                                    </div>
                                  </Grid>
                                
                             
                            </Grid>
                            
                            
                          </Grid>
                        </Grid>
                     




            
                      
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" color="primary">
                   Editar Operación
                  </Button>
                </Grid>

                 </Grid>
                
             </Grid>
               
              
             {/* Modal de Confirmación */}
              <Modal open={openModal} onClose={handleCloseModal}>
                <Box sx={{ 
                  position: 'absolute', 
                  top: '50%', 
                  left: '50%', 
                  transform: 'translate(-50%, -50%)', 
                  backgroundColor: 'white', 
                  padding: 4, 
                  borderRadius: 2 
                }}>
                  <Typography variant="h6" mb={2}>¿Estás seguro de registrar la operación?</Typography>
                  <Button variant="outlined" onClick={handleCloseModal}>Cancelar</Button>
                  <Button variant="contained" color="primary" onClick={() => handleConfirm(values)}>Confirmar</Button>
                </Box>
              </Modal>
                </Form>
          )}
        </Formik>
      </Box>
    </LocalizationProvider>
  );
};
