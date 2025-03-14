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
import AddIcon from "@mui/icons-material/Add";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InfoIcon from '@mui/icons-material/Info';
import { Bills, billById,TypeOperation,CreateOperation, GetOperationById,GetBillFraction,GetRiskProfile, payerByBill,BrokerByClient,AccountsFromClient } from "./queries";
import { useFetch } from "@hooks/useFetch";
import { PV } from "@formulajs/formulajs";
import { addDays, differenceInDays, parseISO, set, isValid } from "date-fns";
import { Toast } from "@components/toast";
export const ManageOperationC = ({
  opId,
  emitters,
  investors,
  payers,
  typeOperation,

}) => {
  console.log(emitters)
  console.log(typeOperation?.data)
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
  
  // get the payer of the bill
  const {
    fetch: fetchPayer,
    loading: loadingPayer,
    error: errorPayer,
    data: dataPayer,
  } = useFetch({ service: payerByBill, init: false });
  const {
        fetch: fetchBrokerByClient,
        loading: loadingBrokerByClient,
        error: errorBrokerByClient,
        data: dataBrokerByClient,
      } = useFetch({ service: BrokerByClient, init: false });

      const {
        fetch: fetchBrokerByClientInvestor,
        loading: loadingBrokerByClientInvestor,
        error: errorBrokerByClientInvestor,
        data: dataBrokerByClientInvestor,
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
      fetch: investorRiskProfileFetch,
      loading: investorLoadingRiskProfile,
      error: investorErrorRiskProfile,
      data: investorDataRiskProfile,
    } = useFetch({ service: GetRiskProfile, init: false });

    const {
        fetch: getBillFractionFetch,
        loading: loadingGetBillFraction,
        error: errorGetBillFraction,
        data: dataGetBillFraction,
      } = useFetch({ service:GetBillFraction, init: false });
    
        const {
          fetch: getOperationByIdFetch,
          loading: loadingGetOperationById,
          error: errorGetOperationById,
          data: dataGetOperationById,
        } = useFetch({ service: GetOperationById, init: false });
  const {
      fetch: createOperationFetch,
      loading: loadingCreateOperation,
      error: errorCreateOperation,
      data: dataCreateOperation,
    } = useFetch({ service: CreateOperation, init: false });
     

    
      // Hooks
      const {
        fetch: fetchTypeIdSelect,
        loading: loadingTypeIdSelect,
        error: errorTypeIdSelect,
        data: dataTypeIdSelect,
      } = useFetch({ service: TypeOperation, init: true });

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
  opId: Yup.number()
    .required('Este campo es obligatorio')
    .typeError('Debe ser un número válido'), // Validación para campo numérico
  opDate: Yup.date().required('Este campo es obligatorio'),
  tipoOperacion: Yup.string()
    .required('Este campo es obligatorio')
    .oneOf(tipoOperaciones, 'Tipo de operación no válido'),
  nombreEmisor: Yup.string().required('Este campo es obligatorio'),
  corredorEmisor: Yup.string().required('Este campo es obligatorio'),
  nombrePagador: Yup.string().required('Este campo es obligatorio'),
  facturas: Yup.array().of(
    Yup.object({
      payedAmount:Yup.number()
      .required('Este campo es obligatorio')
      .typeError('Debe ser un número válido'),
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
  const [] = useState([
    { id: 1, titulo: "Factura 1", contenido: "Detalles de Factura 1" }
  ]);
  const [expanded, setExpanded] = useState(0); // Primer acordeón abierto por defecto

  const handleChange = (index) => (_event, isExpanded) => {
    setExpanded(isExpanded ? index : false);
  };

  const structureValues={}

  const initialValues = {
    opId: getNextOperationNumber(), // Valor por defecto (correlativo)
    opDate: new Date(), // Fecha actual por defecto
    tipoOperacion: 'Compra Titulo', // Valor por defecto
    emitter: '',
    emitterBroker: '',
    opType:'',
    corredorEmisor:'',
    discountTax:0,
    facturas: [

      { applyGm: false,
        amount:0,
        payedAmount:0,
        isRebuy:false,
        billId:'',
        nombreInversionista: '',
        investorProfit: 0,
        numbercuentaInversionista:'',
        cuentaInversionista: '',
        investorBroker: "",
        investorBrokerName:"",
        factura: '',
        fraccion: 1,
        valorFuturo: '',
        valorFuturoManual: false, // Rastrea si el valor futuro ha sido editado manualmente
        fechaEmision: null,
        valorNominal: 0,
        porcentajeDescuento:0,
        probableDate: `${new Date().toISOString().substring(0, 10)}`,
        investorTax: 0,
        nombrePagador: '',
        fechaFin: null,
        diasOperaciones: '',
        operationDays: 0,
        commissionSF: 0,
        gastoMantenimiento: 0,
        fechaOperacion: `${new Date().toISOString().substring(0, 10)}`,
        fechaExpiracion: `${new Date().toISOString().substring(0, 10)}`,
        opExpiration: `${new Date().toISOString().substring(0, 10)}`,
        presentValueInvestor:0,
        presentValueSF:0,
        integrationCode:""
      },
    ],
  };

 

  // Función para transformar cada factura en la estructura esperada por el backend
const transformData = (data) => {
  return data.facturas.map((factura) => ({
    amount: factura.valorFuturo,
    applyGm: factura.gastoMantenimiento > 0,
    bill: factura.factura,
    billFraction: factura.fraccion,
    client: factura.nombreInversionista,
    clientAccount: factura.cuentaInversionista,
    commissionSF: factura.commissionSF,
    DateBill: factura.fechaEmision || new Date().toISOString().substring(0, 10),
    DateExpiration: factura.fechaFin || new Date().toISOString().substring(0, 10),
    discountTax: data.discountTax,
    emitter: data.emitter.value,
    emitterBroker: data.emitterBroker,
    GM: factura.gastoMantenimiento,
    id: "",
    investor: factura.nombreInversionista,
    investorBroker: factura.investorBroker,
    investorProfit: factura.investorProfit,
    investorTax: factura.investorTax,
    opDate: data.opDate.toISOString().substring(0, 10),
    operationDays: factura.operationDays,
    opExpiration: factura.fechaFin || new Date().toISOString().substring(0, 10),
    opId: data.opId,
    opType: data.opType,
    payedAmount: factura.payedAmount,
    payedPercent: 0,
    payer: factura.nombrePagador,
    presentValueInvestor: factura.presentValueInvestor,
    presentValueSF: factura.presentValueSF,
    probableDate: factura.probableDate,
    status: 0,
    billCode: "",
    isReBuy: false,
    massive: false,
    
  }));
};

// **Ejemplo de uso**
const transformedData = transformData(initialValues);


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
  const handleSubmit = (values, { setSubmitting }) => {
    console.log("Datos originales del formulario:", values);
  
    // Transformamos los datos usando la función proporcionada
    const facturasTransformadas = transformData(values);
  
    console.log("Facturas transformadas para el backend:", facturasTransformadas);
  
    setSubmitting(false);
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
    const brokerFromInvestor = await fetchBrokerByClientInvestor(inversionista);
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

const cargarAmountFromOperation= async (opId) => {
  if (!opId) return null; // Retorna null si no hay emisor

  try {
    const operationById = await getOperationByIdFetch(opId);
    return operationById; // 🔹 Devuelve las cuentas obtenidas
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
    if (dataBrokerByClient) {
      console.log("Actualizando brokerByClient:", dataBrokerByClient);
      setBrokerByClient(dataBrokerByClient);
    }
  }, [dataBrokerByClient,brokerByClient]);

  const [brokerByClientInvestor,setBrokerByClientInvestor]=useState()
  useEffect(() => {
    if (dataBrokerByClientInvestor) {
      console.log("Actualizando brokerByClientInvestor:", dataBrokerByClientInvestor);
      setBrokerByClientInvestor(dataBrokerByClientInvestor);
    }
  }, [dataBrokerByClientInvestor,brokerByClientInvestor]);
  






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

const formatDate2 = (dateString) => {
  if (!dateString) return "-- -- ----";

  // Descomponer la fecha manualmente para evitar ajustes de zona horaria
  const [year, month, day] = dateString.split("-");

  return `${day}/${month}/${year}`; // Formato DD/MM/YYYY
};

  
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={esLocale}>
      {/* Para mostrar los toast */}
      <ToastContainer position="top-right" autoClose={5000} />
      <Box sx={{ padding: 3 }}>
        <Typography variant="h4" gutterBottom>
          Registrar Operación
        </Typography>
        <Formik
          initialValues={initialValues}
          
          onSubmit={async (values, actions) => {
            console.log("Formulario enviado:", values);
            const facturasTransformadas = transformData(values);

            console.log("Facturas transformadas para el backend:", facturasTransformadas);
            try {
                // Enviar cada factura al backend
                for (const factura of facturasTransformadas) {
                  await createOperationFetch(factura, factura.opId);
                  console.log(`Factura enviada con opId: ${factura.opId}`);
                }

                console.log("Todas las facturas han sido enviadas correctamente.");
              } catch (error) {
                console.error("Error al enviar las facturas:", error);
              }
            actions.setSubmitting(false); // Asegurar que el botón no se quede bloqueado
          }}
        >
          {/* {({ values, setFieldValue, touched, errors, handleBlur }) => ( */}
          {({ values, setFieldValue, touched, errors, handleBlur }) => (
            <Form>
              <Grid container spacing={2}>
                {/* Primera fila: Número de Operación, Fecha de Operación y Tipo de Operación */}
                <Grid item xs={12} md={1.5}>
                  <TextField
                    label="Número de Operación *"
                    fullWidth
                    type="number"
                    value={opId}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFieldValue('opId', value);
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
                    value={values.fechaOperacion}
                    onChange={(newValue) => setFieldValue('opDate', newValue)}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </Grid>
                <Grid item xs={12} md={2}>
            <Autocomplete
              options={typeOperation?.data || []} // Asegurar que options no sea undefined
              getOptionLabel={(option) => option.description || ''} // Mostrar la descripción
              value={typeOperation?.data.find(item => item.id === values.opType) || null}
              onChange={async (event, newValue) => {
                console.log(newValue);
                setFieldValue('opType', newValue?.id || '');  
              }}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  label="Tipo de Operación *" 
                  fullWidth 
                  error={touched.numeroOperacion && Boolean(errors.numeroOperacion)}
                  helperText={touched.numeroOperacion && errors.numeroOperacion}
                />
              )}
            />
          </Grid>


                {/* Campo de Emisor */}
                <Grid item xs={12} md={4}>
                  <Autocomplete
                    options={emisores}
                    onChange={async (event, newValue) => {
                      if (values.emitter !== newValue) {
                        
                       const brokerByClientFetch= await fetchBrokerByClient(newValue?.data.id)
                        const tasaDescuento = await cargarTasaDescuento(newValue?.data.id)
                        console.log(tasaDescuento)
                        setFieldValue('emitter', newValue);
                        console.log(newValue?.data.id)
                        console.log(dataBrokerByClient)
                        console.log( brokerByClientFetch)
                        console.log( brokerByClientFetch?.data?.id )
                        console.log(brokerByClient )
                        setFieldValue('emitterBroker', brokerByClientFetch?.data?.id );
                        
                        // Limpiar solo el número de factura sin tocar otros valores
                        setFieldValue('facturas', values.facturas.map(factura => ({
                          ...factura,
                          factura: '', // Se limpia solo este campo
                        })));
                        const discountRate = parseFloat(tasaDescuento?.data?.discount_rate) || 0; // Convierte a número o usa 0 si es inválido
                        setFieldValue(`investorTax`, (discountRate* 0.58).toFixed(2));
                        setFieldValue(`discountTax`,discountRate);
                       
                        // Cargar nuevas facturas si se ha seleccionado un nuevo emisor
                        if (newValue) {
                          console.log(newValue)
                          await cargarFacturas(newValue.data.id);
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
                {/*Selector de Corredor Emisor */}
                <Grid item xs={12} md={3}>
              <Autocomplete
                options={brokerByClient ? [brokerByClient] : []} // Asegurar que sea un array válido
                value={brokerByClient || null} // Usar el objeto completo o null
                getOptionLabel={(option) => `${brokerByClient.data.first_name} ${brokerByClient.data.last_name}`} // Mostrar first_name y last_name
                isOptionEqualToValue={(option, value) => option.id === value.id} // Comparación correcta
                onChange={(event, newValue) => setFieldValue('corredorEmisor', newValue)}
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

                {/*Array para cada acordeon de facturas de la operacion */}
                <FieldArray name="facturas">
                  {({ push, remove }) => (
                    <>
                      {values.facturas.map((factura, index) => (
                        <Grid item xs={12} key={index}>
                          {/* Contenedor principal para el botón de eliminar y el acordeón */}
                          <Grid container alignItems="flex-start" spacing={2}>
                            
                            {/* Acordeón */}
                            <Grid item xs>
                              <Accordion
                              key={factura.id} 
                              expanded={expanded === index} 
                              onChange={handleChange(index)}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Grid container alignItems="center" spacing={2}>
                                {/* Número de factura de la cabecera del acordeon */}
                                <Grid item>
                                  <Typography>
                                    {factura.billId|| `Factura ${index + 1}`}
                                  </Typography>
                                </Grid>
                                {/* Fecha de emisión y vencimiento de la cabecera del acordeon*/}
                                <Grid item>
                                <Typography variant="body2" color="textSecondary">
                                  Emisión: {factura.fechaEmision ? formatDate2(factura.fechaEmision) : "-- -- ----"} | 
                                  Vencimiento: {factura.fechaFin ? factura.fechaFin : "-- -- ----"}
                                </Typography>
                              </Grid>
                              </Grid>
                                </AccordionSummary>
                                <AccordionDetails>
                                  <Grid container spacing={3}>
                                    <Grid item xs={12} md={2}>
                                    <Autocomplete
                                          options={(dataBills?.data || [])
                                            .filter((factura) => factura.currentBalance > 0) // Filtrar facturas con balance > 0
                                            .map((factura) => ({
                                              label: String(factura.billId),
                                              value: String(factura.billId),
                                              id: String(factura.id),
                                              integrationCode: factura.integrationCode ? factura.integrationCode : "",
                                            }))
                                          }
                                          value={
                                            values.facturas[index]?.factura
                                              ? String(factura.billId)
                                              : null
                                          }
                                          isOptionEqualToValue={(option, value) => {
                                            return option.value === value;
                                          }}
                                          onChange={async (event, newValue) => {
                                            console.log('aqui values', values)
                                            if (!newValue) {
                                              // Si se borra la selección, limpiar los valores
                                              setFieldValue(`facturas[${index}]`, {
                                                factura: '',
                                                fechaEmision: '',
                                                valorNominal: '',
                                                fechaFin: '',
                                                saldoDisponible: '',
                                                valorFuturo: '',
                                                probableDate: '',
                                                amount: '',
                                                payedAmount: '',
                                                fraccion: '',
                                                porcentajeDescuento: '',
                                                nombrePagador: '',
                                                presentValueInvestor: '',
                                                presentValueSF: '',
                                                investorProfit: '',
                                                commissionSF: '',
                                              });
                                              return;
                                            }

                                            console.log("Factura seleccionada:", newValue);

                                            // Buscar la factura seleccionada
                                            const selectedFactura = dataBills?.data.find(f => f.billId === newValue.value);
                                            if (!selectedFactura) return;

                                            console.log("Datos de la factura:", selectedFactura);

                                            try {
                                              if (
                                                values.integrationCode != selectedFactura?.integrationCode &&
                                                values.integrationCode != ""
                                              ) {
                                                Toast(
                                                  "El código de integración debe coincidir con el de la factura previa",
                                                  "error"
                                                );
                                                setFieldValue(`facturas[${index}].factura`, null);
                                              } else {
                                                // Cargar la fracción de la factura antes de asignar valores
                                                const fractionBill = await cargarFraccionFactura(selectedFactura.id);
                                                console.log("Fracción de factura:", fractionBill);

                                                const payerByBillFetch = await fetchPayer(selectedFactura.id)

                                                console.log(payerByBillFetch)

                                                // Fechas
                                                const fechaOperacion = new Date(values?.opDate);
                                                const expirationDate = new Date(parseISO(selectedFactura.expirationDate));

                                                let substractDays = 0;
                                                if (isValid(fechaOperacion) && isValid(expirationDate)) {
                                                  substractDays = differenceInDays(expirationDate, fechaOperacion);
                                                  setFieldValue(`facturas[${index}].operationDays`, substractDays)
                                                  console.log("Días de diferencia:", substractDays);
                                                } else {
                                                  console.error("Error: Una de las fechas no es válida.");
                                                }

                                                // Verificar si alguna factura anterior tiene la misma factura seleccionada
                                                const facturaActual = newValue.id;
                                                let fraccion = fractionBill?.data?.fraction || 1;
                                                const facturasAnteriores = values.facturas.slice(0, index).filter((f) => f.factura === facturaActual);

                                                // Si hay coincidencias, encontrar la fracción más alta y sumarle 1
                                                if (facturasAnteriores.length > 0) {
                                                  const fraccionMasAlta = Math.max(...facturasAnteriores.map((f) => f.fraccion || 1));
                                                  fraccion = fraccionMasAlta + 1;
                                                }

                                                // Calcular el saldo disponible final
                                                let saldoDisponible = selectedFactura.currentBalance || 0;
                                                console.log(facturasAnteriores)
                                                // Sumar los valores futuros de las facturas anteriores con el mismo billId
                                                const valorFuturoAnteriores = facturasAnteriores.reduce((sum, f) => sum + (f.valorFuturo || 0),selectedFactura.currentBalance);
                                                console.log('valor futruro ',valorFuturoAnteriores)
                                                saldoDisponible -= valorFuturoAnteriores;

                                                // Determinar el valor futuro
                                                let valorFuturoCalculado;

                                                if (facturasAnteriores.length > 0 && saldoDisponible <= 0) {
                                                  // Si ya hay facturas anteriores y el saldo disponible es 0, el valor futuro debe ser 0
                                                  valorFuturoCalculado = 0;
                                                  saldoDisponible=0
                                                } else {
                                                  // Si es la primera vez o hay saldo disponible, asignar el valor futuro como el saldo disponible
                                                  valorFuturoCalculado = selectedFactura.currentBalance;
                                                }
                                                console.log(saldoDisponible,valorFuturoCalculado)
                                                // Buscar el saldoDisponible en facturasAnteriores con el mismo billId que selectedFactura
                                                const saldoDisponibleAnterior = facturasAnteriores.find(
                                                  (f) => f.billId === selectedFactura.billId
                                                )?.saldoDisponible || 0;

                                                // Asignar el valor a una variable
                                                const saldoDisponibleA = saldoDisponibleAnterior;



                                              
                                                const presentValueInvestor = selectedFactura.operationDays > 0 && selectedFactura.payedAmount > 0
                                                  ? Math.round(PV(selectedFactura.investorTax / 100, selectedFactura.operationDays / 365, 0, selectedFactura.payedAmount, 0) * -1)
                                                  : selectedFactura.currentBalance;

                                                const presentValueSF = selectedFactura.operationDays > 0 && selectedFactura.payedAmount > 0
                                                  ? Math.round(PV(selectedFactura.discountTax / 100, selectedFactura.operationDays / 365, 0, selectedFactura.payedAmount, 0) * -1)
                                                  : selectedFactura.currentBalance;

                                                

                                                const commissionSF = presentValueInvestor && presentValueSF
                                                  ? presentValueInvestor - presentValueSF
                                                  : 0; // Si es NaN, asignar 0
                                                
                                                const investorProfit = presentValueInvestor ?? selectedFactura.currentBalance
                                                  ? presentValueInvestor - selectedFactura.currentBalance : 0;

                                                console.log(selectedFactura)
                                                // Asignar todos los valores
                                                setFieldValue(`facturas[${index}]`, {
                                                  billId: selectedFactura.billId,
                                                  operationDays: substractDays,
                                                  factura: newValue.id,
                                                  fechaEmision: selectedFactura.dateBill,
                                                  probableDate: selectedFactura.expirationDate,
                                                  amount: selectedFactura.currentBalance,
                                                  payedAmount: selectedFactura.currentBalance,
                                                  fechaFin: selectedFactura.expirationDate,
                                                  saldoDisponible:saldoDisponibleA,
                                                  fraccion,
                                                  porcentajeDescuento: Math.round((selectedFactura.currentBalance * 100) / selectedFactura.currentBalance),
                                                  nombrePagador: payerByBillFetch.data,
                                                  valorFuturo: valorFuturoCalculado,
                                                  presentValueInvestor,
                                                  presentValueSF,
                                                  commissionSF,
                                                  investorProfit: investorProfit,
                                                  integrationCode: selectedFactura?.integrationCode ? selectedFactura?.integrationCode : "",
                                                  isReBuy: selectedFactura?.data?.bill?.reBuyAvailable ?? false
                                                });
                                                console.log(values)
                                              }
                                            } catch (error) {
                                              console.error("Error al cargar los datos:", error);
                                            }
                                          }}
                                          renderInput={(params) => (
                                            <TextField
                                              {...params}
                                              label="Número de Factura *"
                                              fullWidth
                                            />
                                          )}
                                        />
                                      
                                      <Grid item xs={2} style={{ display: "flex", justifyContent: "flex-end" }}>
                                      <Button variant="contained" color="primary">
                                        <AddIcon />
                                      </Button>
                                    </Grid></Grid>
                                      

                                    {/* Fracción */}
                                    <Grid item xs={12} md={1}>
                                        <TextField
                                          label="Fracción"
                                          fullWidth
                                          type="number"
                                          value={factura.fraccion ?? 1} // Valor por defecto si no existe fracción
                                          onChange={(e) => {
                                            const fraccion = parseFloat(e.target.value) || 1; // Evitar valores inválidos

                                            // Verificar si alguna factura anterior tiene la misma factura seleccionada
                                            const facturaActual = values.facturas[index]?.factura;
                                            if (facturaActual) {
                                              // Buscar todas las facturas anteriores que tengan la misma factura
                                              const facturasAnteriores = values.facturas.slice(0, index).filter((f) => f.factura === facturaActual);

                                              // Si hay coincidencias, encontrar la fracción más alta y sumarle 1
                                              if (facturasAnteriores.length > 0) {
                                                const fraccionMasAlta = Math.max(...facturasAnteriores.map((f) => f.fraccion || 1));
                                                fraccion = fraccionMasAlta + 1;
                                              }
                                            }

                                            // Actualizar el valor de la fracción en el estado
                                            setFieldValue(`facturas[${index}].fraccion`, fraccion);

                                            // Recalcular el valor futuro automáticamente cuando cambia la fracción
                                            const saldoDisponible = factura.saldoDisponible || 0;
                                            const valorFuturoCalculado = Math.floor(saldoDisponible); // Truncar los decimales
                                            console.log(valorFuturoCalculado);
                                          }}
                                          onBlur={handleBlur} // Si tienes alguna lógica de validación, puedes usar onBlur
                                          helperText={touched.facturas?.[index]?.fraccion && errors.facturas?.[index]?.fraccion} // Ayuda para mostrar errores
                                          error={touched.facturas?.[index]?.fraccion && Boolean(errors.facturas?.[index]?.fraccion)} // Mostrar errores si es necesario
                                        />
                                      </Grid>

                                      {/* Saldo Disponible de la factura */}
                                      <Grid item xs={12} md={3}>
                                        <TextField
                                          label="Saldo Disponible en factura"
                                          fullWidth
                                          value={formatCurrency(values.facturas[index]?.saldoDisponible || 0)}
                                          disabled
                                        />
                                      </Grid>
                                       {/* Fecha Probable*/}
                                      <Grid item xs={12} md={1.5}>
                                        <DatePicker
                                          label="Fecha probable"
                                          value={factura.probableDate}
                                          onChange={(newValue) => setFieldValue(`facturas[${index}].probableDate`, newValue)}
                                          renderInput={(params) => <TextField {...params} fullWidth />}
                                        />
                                      </Grid> 
                                      {/* Fecha de Vencimiento */}
                                      {/* <Grid item xs={12} md={2}>
                                        <DatePicker
                                          label="Vencimiento Factura"
                                          value={factura.fechaFin}
                                          onChange={(newValue) => setFieldValue(`facturas[${index}].fechaFin`, newValue)}
                                          renderInput={(params) => <TextField {...params} fullWidth />}
                                        /> */}
                                      {/* </Grid> */} 
                                      {/* Nombre de Inversionista */}
                                      <Grid item xs={12} md={4.5}>
                                      <Autocomplete
                                        options={investors || []} // Usamos investors.data en vez de investors directamente
                                        getOptionLabel={(option) => 
                                          option?.data.first_name && option?.data.last_name 
                                            ? `${option.data.first_name} ${option.data.last_name}` 
                                            : option?.data.social_reason || "Desconocido"
                                        }
                                        isOptionEqualToValue={(option, value) => {
                                          console.log("🔍 Comparando opción:", option);
                                          console.log("🔍 Con el valor seleccionado:", value);
                                          return option?.account_number === value?.account_number;
                                        }} // Para evitar warnings de MUI
                                        onChange={async (event, newValue) => {
                                          console.log("Nuevo valor seleccionado:", newValue);
                                          console.log("values antes:", values);

                                          if (newValue) {
                                            console.log("ID del inversionista:", newValue?.data.id);

                                            // Cargar cuentas y broker del inversionista seleccionado
                                            const cuentas = await cargarCuentas(newValue?.data.id);
                                            const brokerFromInvestor = await cargarBrokerFromInvestor(newValue?.data.id);
                                            console.log(dataAccountFromClient);
                                            console.log("Cuentas:", cuentas);
                                            console.log("?.data[0]?", cuentas?.data[0]);
                                            console.log("Broker del inversionista:", brokerFromInvestor);
                                            console.log(factura);

                                            // Buscar facturas anteriores con el mismo inversionista
                                            const facturasAnteriores = values.facturas.slice(0, index).filter((f) => f.nombreInversionista === newValue?.data.id);

                                            // Obtener el montoDisponibleCuenta de la última factura con el mismo inversionista
                                            const montoDisponibleAnterior = facturasAnteriores.length > 0
                                              ? facturasAnteriores[facturasAnteriores.length - 1].montoDisponibleCuenta
                                              : cuentas?.data[0]?.balance || 0; // Si no hay facturas anteriores, usar el balance de la cuenta

                                            console.log("Monto disponible anterior:", montoDisponibleAnterior);

                                            if (index >= 0 && values.facturas?.[index]) {
                                              // Asignar valores a la factura actual
                                              setFieldValue(`facturas[${index}].numbercuentaInversionista`, cuentas?.data[0]?.account_number || "");
                                              setFieldValue(`facturas[${index}].cuentaInversionista`, cuentas?.data[0]?.id || "");
                                              setFieldValue(`facturas[${index}].montoDisponibleCuenta`, montoDisponibleAnterior || 0);
                                              setFieldValue(`facturas[${index}].nombreInversionista`, newValue?.data.id || "");
                                              setFieldValue(`facturas[${index}].investorBroker`, brokerFromInvestor?.data.id || "");
                                              setFieldValue(
                                                `facturas[${index}].investorBrokerName`,
                                                brokerFromInvestor?.data?.first_name && brokerFromInvestor?.data?.last_name
                                                  ? `${brokerFromInvestor.data.first_name} ${brokerFromInvestor.data.last_name}`
                                                  : brokerFromInvestor?.data?.social_reason || ""
                                              );

                                              console.log("values después de actualización:", values);
                                            } else {
                                              console.error("Índice inválido:", index);
                                            }
                                          }
                                        }}
                                        renderInput={(params) => (
                                          <TextField
                                            {...params}
                                            label="Nombre Inversionista / ID *"
                                            fullWidth
                                          />
                                        )}
                                      />
                                                                            </Grid>

                                      {/* Cuenta de Inversionista */}
                                      <Grid item xs={12} md={3}>

                                        
                                       <TextField
                                         
                                          value={factura.numbercuentaInversionista || 'no hay'} // Mostrar el corredor asignado // Evitar errores de comparación con null// Comparación correcta
                                          label="Cuenta Inversionista *"
                                          fullWidth
                                          onChange={(event, newValue) => {
                                            console.log(values)
                                            console.log(index)
                                            
                                            //setFieldValue(`facturas[${index}].cuentaInversionista`, newValue? AccountFromClient.data[index]?.account_number:0);
                                            // Actualiza el Monto Disponible Cuenta Inversionista con el saldo de la cuenta seleccionada
                                            setFieldValue(`facturas[${index}].montoDisponibleCuenta`, newValue ? AccountFromClient.data[index]?.balance : 0);
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
                                          value={formatCurrency(values.facturas[index]?.montoDisponibleCuenta || 0)}
                                          disabled // Deshabilita la edición manual
                                        />
                                      </Grid>
                                    {/*Selector de Pagadores*/}
                                    <Grid item xs={12} md={6}>
                                    <Autocomplete
                                          options={payers}
                                          value={payers.find(p => p.id === factura.nombrePagador) || null} // Buscar el objeto que coincide con el nombre
                                          isOptionEqualToValue={(option, value) => option.value === value.value} // Comparar por ID
                                          onChange={(event, newValue) => setFieldValue(`facturas[${index}].nombrePagador`, newValue?.id || '')}
                                          renderInput={(params) => (
                                            <TextField
                                              {...params}
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
                                  value={factura.valorFuturo ? formatNumberWithThousandsSeparator(Math.floor(factura.valorFuturo)) : 0} // Usar 0 como valor predeterminado
                                  onChange={(e) => {
                                    // Eliminar caracteres no numéricos para mantener el valor limpio
                                    const rawValue = e.target.value.replace(/[^\d]/g, "");
                                    const valorFuturoManual = parseFloat(rawValue) || 0;

                                    // Obtener el saldo disponible actual de la factura seleccionada
                                    const saldoDisponibleActual = factura.saldoDisponible || 0;

                                    // Calcular el saldo disponible total de la factura original
                                    const saldoDisponibleTotal = dataBills?.data.find((f) => f.billId === factura.factura)?.currentBalance || 0;

                                    // Calcular el valor futuro total de todas las instancias de la misma factura
                                    const valorFuturoTotal = values.facturas
                                      .filter((f) => f.factura === factura.factura)
                                      .reduce((sum, f) => sum + (f.valorFuturo || 0), 0);

                                    // Calcular el nuevo valor futuro total
                                    const nuevoValorFuturoTotal = valorFuturoTotal - (factura.valorFuturo || 0) + valorFuturoManual;


                                    // Calcular la diferencia entre el nuevo valor futuro y el valor anterior
                                    const diferenciaValorFuturo = valorFuturoManual - (factura.valorFuturo || 0);

                                    // Actualizar el valor futuro
                                    setFieldValue(`facturas[${index}].valorFuturo`, valorFuturoManual);
                                    setFieldValue(`facturas[${index}].valorFuturoManual`, true);

                                    // Actualizar el saldo disponible de la factura actual
                                    const nuevoSaldoDisponible = saldoDisponibleActual - diferenciaValorFuturo;
                                    console.log(nuevoSaldoDisponible)
                                    setFieldValue(`facturas[${index}].saldoDisponible`, nuevoSaldoDisponible);

                                    // Actualizar el saldo disponible en todas las facturas con el mismo billId
                                    values.facturas.forEach((f, i) => {
                                      if (f.factura === factura.factura && i !== index) {
                                        const saldoDisponiblePosterior = f.saldoDisponible || 0;
                                        const nuevoSaldoDisponiblePosterior = saldoDisponiblePosterior - diferenciaValorFuturo;
                                        setFieldValue(`facturas[${i}].saldoDisponible`, Math.max(nuevoSaldoDisponiblePosterior, 0));
                                      }
                                    });
                                  }}
                                  onFocus={(e) => {
                                    // Al hacer foco, removemos el formato para permitir la edición del valor numérico
                                    e.target.value = factura.valorFuturo ? factura.valorFuturo.toString() : "";
                                  }}
                                  onBlur={(e) => {
                                    // Al perder el foco, aplicar el formato de separadores de miles y asegurarse que sea un número entero
                                    const rawValue = e.target.value.replace(/[^\d]/g, "");
                                    const valorFuturoManual = parseFloat(rawValue) || 0;
                                    setFieldValue(`facturas[${index}].valorFuturo`, valorFuturoManual);
                                  }}
                                  placeholder={`Sugerido: ${factura.saldoDisponible && factura.fraccion ? formatNumberWithThousandsSeparator(Math.floor((factura.saldoDisponible || 0) / (factura.fraccion || 1))) : ""}`} // Aseguramos que el placeholder muestre el valor formateado como número entero
                                  helperText={
                                    !factura.valorFuturoManual
                                      ? `Valor sugerido: ${factura.saldoDisponible && factura.fraccion ? formatNumberWithThousandsSeparator(Math.floor((factura.saldoDisponible || 0) / (factura.fraccion || 1))) : ""}`
                                      : "Valor ingresado manualmente"
                                  }
                                  error={touched.facturas?.[index]?.valorFuturo && Boolean(errors.facturas?.[index]?.valorFuturo)}
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
                                        value={Math.round(factura.porcentajeDescuento) ?? 0}
                                        onChange={(e) => {
                                          let value = e.target.value ? Math.min(Math.max(Number(e.target.value), 0), 100) : 0;
                                          setFieldValue(`facturas[${index}].porcentajeDescuento`, value);

                                          // Recalcular el valor nominal con el nuevo % de descuento
                                          const valorFuturo = factura.valorFuturo || 0;
                                          const nuevoValorNominal = calcularValorNominal(valorFuturo, value);
                                          setFieldValue(`facturas[${index}].valorNominal`, nuevoValorNominal);
                                          setFieldValue(`facturas[${index}].valorNominalManual`, false); // Marcar como automático
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
                                        value={values.discountTax}
                                        onChange={(e) => setFieldValue(`facturas[${index}].tasaInversionista`, e.target.value)}
                                      />
                                    </Grid>

                                    {/* Campo de valor nominal */}
                                    <Grid item xs={12} md={3}>
                                    <TextField
  label="Valor Nominal"
  fullWidth
  value={factura.valorNominal ? formatNumberWithThousandsSeparator(Math.floor(factura.valorNominal)) : 0} // Valor predeterminado 0
  onChange={(e) => {
    // Eliminar caracteres no numéricos para mantener el valor limpio
    const rawValue = e.target.value.replace(/[^\d]/g, ""); // Permitir borrar completamente
    let nuevoValorNominal = parseFloat(rawValue) || 0; // Si rawValue está vacío, será 0
    const valorFuturo = factura.valorFuturo || 0;

    // Obtener el saldo disponible actual de la factura seleccionada
    const montoDisponibleCuentaActual = factura.montoDisponibleCuenta || 0;

    // Calcular el valor nominal total de todas las instancias de la misma factura
    const valorNominalTotal = values.facturas
      .filter((f) => f.factura === factura.factura)
      .reduce((sum, f) => sum + (f.valorNominal || 0), 0);

    // Calcular el nuevo monto disponible uniforme para todas las facturas con el mismo billId
    const nuevoMontoDisponibleCuenta = montoDisponibleCuentaActual - (nuevoValorNominal - (factura.valorNominal || 0));

    // Actualizar el valor nominal
    setFieldValue(`facturas[${index}].valorNominal`, nuevoValorNominal);
    setFieldValue(`facturas[${index}].valorNominalManual`, true); // Marcar como editado manualmente

    // Actualizar el monto disponible en todas las facturas con el mismo billId
    values.facturas.forEach((f, i) => {
      if (f.factura === factura.factura) {
        setFieldValue(`facturas[${i}].montoDisponibleCuenta`, nuevoMontoDisponibleCuenta);
      }
    });

    // Recalcular el % de descuento con el nuevo valor nominal
    const nuevoPorcentajeDescuento = calcularPorcentajeDescuento(valorFuturo, nuevoValorNominal);
    setFieldValue(`facturas[${index}].porcentajeDescuento`, nuevoPorcentajeDescuento);
  }}
  onFocus={(e) => {
    // Al hacer foco, eliminamos el formato para permitir la edición del valor numérico
    e.target.value = factura.valorNominal ? factura.valorNominal.toString() : "";
  }}
  onBlur={(e) => {
    // Al perder el foco, aplicar el formato de separadores de miles y asegurarse que sea un número entero
    const rawValue = e.target.value.replace(/[^\d]/g, ""); // Permitir borrar completamente
    const valorNominal = parseFloat(rawValue) || 0;
    setFieldValue(`facturas[${index}].valorNominal`, valorNominal);
  }}
  placeholder={`Sugerido: ${factura.valorFuturo && factura.porcentajeDescuento !== undefined ? formatNumberWithThousandsSeparator(Math.floor(factura.valorFuturo * (1 - (factura.porcentajeDescuento / 100)))) : ""}`} // Aquí se calcula el valor nominal sugerido
  helperText={
    !factura.valorNominalManual
      ? `Valor sugerido: ${factura.valorFuturo && factura.porcentajeDescuento !== undefined ? formatNumberWithThousandsSeparator(Math.floor(factura.valorFuturo * (1 - (factura.porcentajeDescuento / 100)))) : ""}`
      : "Valor ingresado manualmente"
  }
  InputProps={{
    startAdornment: (
      <InputAdornment position="start">
        <AttachMoneyIcon style={{ color: 'rgb(94, 163, 163)', fontSize: '1.2rem' }} />
      </InputAdornment>
    ),
  }}
  error={touched.facturas?.[index]?.valorNominal && Boolean(errors.facturas?.[index]?.valorNominal)}
/>
                                    </Grid>
                                    <Grid item xs={12} md={1.5}>
                                      <TextField
                                        label="Tasa Inversionista"
                                        fullWidth
                                        type="number"
                                        value={values.investorTax}
                                        onChange={(e) => setFieldValue(`facturas[${index}].investorTax`, e.target.value)}
                                        InputLabelProps={{ shrink: true }}
                                      />
                                    </Grid>
                                    <Grid item xs={12} md={1.5}>
                                      <DatePicker
                                        label="Fecha Fin"
                                        value={factura.fechaFin}
                                        onChange={(newValue) => setFieldValue(`facturas[${index}].fechaFin`, newValue)}
                                        renderInput={(params) => <TextField {...params} fullWidth />}
                                      />
                                    </Grid>
                                    <Grid item xs={12} md={1}>
                                      <TextField
                                        label="Días Operación"
                                        fullWidth
                                        type="number"
                                        value={factura.operationDays}
                                        onChange={(e) => setFieldValue(`facturas[${index}].operationDays`,factura.operationDays)}
                                      />
                                    </Grid>
                                    {/* Campo Utilidad Inversión*/ }
                                    <Grid item xs={12} md={3}>
                                      <TextField
                                        label="Utilidad Inversión"
                                        fullWidth
                                        value={formatCurrency(factura.investorProfit)} // Formato moneda
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
                                        value={formatCurrency(factura.presentValueInvestor)} // Formato moneda
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
                                        value={formatCurrency(factura.presentValueSF)} // Formato moneda
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
                                        value={formatCurrency(factura.commissionSF)} // Formato moneda
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
                                        value={factura.investorBrokerName || ''} // Mostrar el corredor asignado
                                        disabled // Bloquear edición
                                        InputProps={{
                                          inputComponent: "input", // Asegura que se muestre correctamente
                                        }}
                                      />
                                    </Grid>
                                    {/* Gasto de Mantenimiento */}
                                    <Grid item xs={12} md={4}>
                                  <div className="flex flex-row gap-2 items-center p-2 border rounded-lg shadow-md">
                                    <label className="text-lg font-medium flex-shrink-0">
                                      Gasto de Mantenimiento (GM)
                                    </label>
                                    <Switch
                                      checked={factura.applyGm || false} // Manejo seguro del estado
                                      onChange={(event) => {
                                        const isChecked = event.target.checked;
                                        setFieldValue(`facturas[${index}].applyGm`, isChecked);
                                        setFieldValue(`facturas[${index}].gastoMantenimiento`, isChecked ? factura.presentValueInvestor * 0.002 : 0);
                                      }}
                                    />
                                    <TextField
                                      type="text"
                                      placeholder="$ 0,00"
                                      value={factura.gastoMantenimiento ?? ""} // Mostrar el valor real almacenado
                                      onChange={(e) => setFieldValue(`facturas[${index}].gastoMantenimiento`, e.target.value)}
                                      disabled={!factura.applyGm} // Deshabilita si el switch está apagado
                                      thousandSeparator="."
                                      decimalSeparator=","
                                      decimalScale={0}
                                      allowNegative={false}
                                      fullWidth
                                      variant="outlined"
                                      className={`flex-1 ${factura.applyGm ? "bg-white" : "bg-gray-200 text-gray-500"}`}
                                    />
                                  </div>
                                </Grid>

                                  </Grid>
                                </AccordionDetails>
                              </Accordion>
                            </Grid>
                            {/* Botón de eliminar */}
                            <Grid item xs="auto">
                              <IconButton onClick={() => remove(index)}>
                                <DeleteIcon />
                              </IconButton>
                            </Grid>
                          </Grid>
                        </Grid>
                      ))}
                      <Grid item xs={12}>
                        <Button variant="contained" onClick={() => push(
   

      { applyGm: false,
        amount:0,
        payedAmount:0,
        nombreInversionista: '',
        investorProfit: 0,
        cuentaInversionista: '',
        factura: '',
        fraccion: 1,
        valorFuturo: '',
        valorFuturoManual: false, // Rastrea si el valor futuro ha sido editado manualmente
        fechaEmision: null,
        valorNominal: 0,
        porcentajeDescuento:0,
        probableDate: `${new Date().toISOString().substring(0, 10)}`,
        investorTax: 0,
        nombrePagador: '',
        fechaFin: null,
        diasOperaciones: '',
        operationDays: 0,
        comisionSF: 0,
        gastoMantenimiento: 0,
        fechaOperacion: `${new Date().toISOString().substring(0, 10)}`,
        fechaExpiracion: `${new Date().toISOString().substring(0, 10)}`,
        opExpiration: `${new Date().toISOString().substring(0, 10)}`,
        presentValueInvestor:0,
        presentValueSF:0,
      },
   )}>
                          Agregar Factura
                        </Button>
                      </Grid>
                    </>
                  )}
                </FieldArray>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" color="primary">
                    Registrar Operación
                  </Button>
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
