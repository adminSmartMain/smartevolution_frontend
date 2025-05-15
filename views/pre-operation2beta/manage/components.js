// components/RegisterOperationForm.js
import React, { useEffect, useState, useContext } from "react";
import { useCallback } from 'react';
import { debounce } from 'lodash';
import { InputAdornment, Box, Modal, Typography, Switch, TextField, Button, Grid, Autocomplete, Accordion, AccordionSummary, AccordionDetails, Tooltip, IconButton } from '@mui/material';
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"; // Icono del dólar
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import esLocale from 'date-fns/locale/es';
import { Formik, Form, FieldArray,formikBag,dirty } from 'formik';
import * as Yup from 'yup';
import Axios from "axios";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from "@mui/icons-material/Add";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InfoIcon from '@mui/icons-material/Info';
import {  getOperationsByInvestor,Bills, billById,TypeOperation,CreateOperation, GetOperationById,GetBillFraction,GetRiskProfile, payerByBill,BrokerByClient,AccountsFromClient ,getOperationsVersionTwo} from "./queries";
import { useFetch } from "@hooks/useFetch";
import { PV } from "@formulajs/formulajs";
import { addDays, parseISO, set, isValid } from "date-fns";
import authContext from "@context/authContext";
import { useRouter } from 'next/router';
import { Toast } from "@components/toast";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import EditIcon from '@mui/icons-material/Edit';
import { Dialog,DialogContent, DialogTitle,DialogActions,CircularProgress} from "@mui/material";
import { CheckCircle, Error } from "@mui/icons-material";
import { differenceInDays, startOfDay } from "date-fns";

import CheckIcon from '@mui/icons-material/Check';
import ErrorIcon from '@mui/icons-material/Error'; // o cualquier otro ícono de error
export const ManageOperationC = ({
  opId,
  emitters,
  investors,
  payers,
  typeOperation,
  onFormSubmit,
  loading,
  success,
  isModalOpen,
  validationSchema,
  showConfirmationModal,
  handleConfirm,
  setShowConfirmationModal,
actionsFormik,
operations,

}) => {
  
  const emisores = emitters;
const router = useRouter();
const [clientWithoutBroker, setClientWithoutBroker] = useState(null);
const [clientEmitter,setClientEmitter] = useState(null);
const [clientPagador,setClientPagador] = useState(null);
const [clientBrokerEmitter,setClientBrokerEmitter]= useState(null);
const [clientInvestor,setClientInvestor]= useState(null);
  const [AccountFromClient,setAccountFromClient]=useState()   
  const [openEmitterBrokerModal,setOpenEmitterBrokerModal]=useState(false)
  const { user, logout } = useContext(authContext);
  const [disabled,setDisabled] =useState(false)
  const [showAllPayers, setShowAllPayers] = useState(false);
  const [orchestDisabled,setOrchestDisabled]=useState([{indice:0,status:false}])
  const [editMode, setEditMode] = useState({});
  const [isSelectedPayer,setIsSelectedPayer]=useState(false)
  const [isModalEmitterAd,setIsModalEmitterAd]=useState(false)
  const [brokeDelete,setBrokeDelete]=useState(true)
  const [isCreatingBill,setIsCreatingBill]=useState(false)
  const [emitterSaved,setEmitterSaved]=useState(false)
  const [pendingClear, setPendingClear] = useState(false);
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
     
    const {
      fetch: getOperationByInvestorFetch,
      loading: loadingGetOperationByInvestor,
      error: errorGetOperationByInvestor,
      data: dataGetOperationByInvestor,
    } = useFetch({ service:   getOperationsByInvestor, init: false });
    
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


  const [] = useState([
    { id: 1, titulo: "Factura 1", contenido: "Detalles de Factura 1" }
  ]);
  const [expanded, setExpanded] = useState(0); // Primer acordeón abierto por defecto

  const handleChange = (index) => (_event, isExpanded) => {
    setExpanded(isExpanded ? index : false);
  };

  // Función para convertir una cadena ISO a fecha local
const parseDateToLocal = (dateString) => {
  if (!dateString) return null; // Manejar casos donde dateString sea null o undefined

  // Crear un objeto Date a partir de la cadena ISO
  const date = new Date(dateString);

  // Ajustar la fecha a la zona horaria local sin restar el offset
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};


  const initialValues = {
    opId: opId,
    opDate: new Date(), // Fecha actual por defecto
   // opType: 'Compra Titulo', // Valor por defecto
    emitter: '',
    emitterBroker: '',
    opType:'4ba7b2ef-07b1-47bd-8239-e3ce16ea2e94',
    corredorEmisor:'',
    discountTax:0,
    nombrePagador:'',
    filtroEmitterPagador:{emitter:"",payer:""},
    takedBills:"",
    filteredPayers:"",
    facturas: [

      { is_creada:false,
        applyGm: false,
        amount:0,
        payedAmount:0,
        isRebuy:false,
        billId:'',
        nombreInversionista: '',
        investorProfit: 0,
        numbercuentaInversionista:'',
        cuentaInversionista: '',
        idCuentaInversionista:'',
        investorBroker: "",
        investorBrokerName:"",
        tasaInversionistaPR:0,
        tasaDescuentoPR:0,
        factura: '',
        fraccion: 1,
        valorFuturo: '',
        valorFuturoManual: false, // Rastrea si el valor futuro ha sido editado manualmente
        fechaEmision: null,
        valorNominal: 0,
        porcentajeDescuento:0,
        probableDate: `${new Date().toISOString().substring(0, 10)}`,
        investorTax: 0,
        expirationDate:'',
        fechaFin: `${new Date()}`,
        diasOperaciones: 0,
        operationDays: 0,
        comisionSF: 0,
        gastoMantenimiento: 0,
        fechaOperacion: `${new Date().toISOString().substring(0, 10)}`,
        fechaExpiracion: `${new Date().toISOString().substring(0, 10)}`,
        opExpiration: '',
        presentValueInvestor:0,
        presentValueSF:0,
        integrationCode:"",
        saldoDisponibleInfo:0,
        montoDisponibleInfo:0,
      },
    ],
  };

 


  
  const [facturasFiltradas, setFacturasFiltradas] = useState([]); // Facturas filtradas por emisor

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


const cargarOperationFromInvestor = async (investor) => {
  if (!investor) return null; // Retorna null si no hay inversionista

  try {
    // Parámetros para la consulta
    const params = {
      investor: investor, // Inversionista proporcionado
      status: 0, // Estado de la operación
    };

    // Realizar la consulta a la API
    const response = await getOperationByInvestorFetch(params);

    // Verificar si la respuesta es válida y es un array
    if (!Array.isArray(response.data)) {
      console.error("La respuesta no es un array:", response.data);
      return null;
    }

    // Extraer y sumar 'presentValueInvestor' y 'GM' de cada objeto
    const total = response.data.reduce((sum, operation) => {
      const presentValueInvestor = parseFloat(operation.presentValueInvestor) || 0;
      const gm = parseFloat(operation.GM) || 0;
      return sum + presentValueInvestor + gm;
    }, 0);

    // Devuelve la suma total
    return total;
  } catch (error) {
    console.error("Error al cargar las operaciones del inversionista:", error);
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
  
  const cargarFacturas = async (emisor, pagadorId = null) => {
    if (!emisor) {
      setFacturasFiltradas([]);
      return [];
    }
  
    const facturas  = fetchBills(emisor);

 
    
   //S setFacturasFiltradas(filtradas);
    return facturas; // Retorna directamente el array filtrado
  };


  useEffect(() => {
 
  }, [facturasFiltradas]); // Se ejecuta cuando cambia el estado

  

  const [brokerByClient,setBrokerByClient]=useState()
  useEffect(() => {
    if (dataBrokerByClient) {
      
      setBrokerByClient(dataBrokerByClient);
    }
  }, [dataBrokerByClient,brokerByClient]);

  const [brokerByClientInvestor,setBrokerByClientInvestor]=useState()
  useEffect(() => {
    if (dataBrokerByClientInvestor) {

      setBrokerByClientInvestor(dataBrokerByClientInvestor);
    }
  }, [dataBrokerByClientInvestor,brokerByClientInvestor]);
  

 useEffect(() => {

  setAccountFromClient(dataAccountFromClient)
}, [dataAccountFromClient]); // Se ejecuta cuando cambia el estado


  // Función para calcular el valor nominal basado en el valor futuro y el porcentaje de descuento


// Función para calcular el porcentaje de descuento basado en el valor futuro y el valor nominal
const calcularPorcentajeDescuento = (valorFuturo, valorNominal) => {
  if (valorFuturo === 0) return 0;
  return ((valorNominal / valorFuturo) * 100).toFixed(2);
};

//Formatear la fecha en la cabecera del acordeon. 
const formatDate = (date) => {
  if (!date) return "N/A";
  const options = { day: "2-digit", month: "short", year: "numeric" };
  return new Date(date).toLocaleDateString("es-ES", options);
};

const formatDate2 = (dateString) => {
  if (!dateString) return "-- -- ----";

    let dateObj;

      // Si dateString es un objeto Date, convertirlo a cadena
      if (dateString instanceof Date) {
        const year = dateString.getFullYear();
        const month = String(dateString.getMonth() + 1).padStart(2, "0"); // Meses van de 0 a 11
        const day = String(dateString.getDate()).padStart(2, "0");
        dateObj = { year, month, day };
      }
      // Si dateString es una cadena en formato "YYYY-MM-DD"
      else if (typeof dateString === "string" && dateString.includes("-")) {
        const [year, month, day] = dateString.split("-");
        dateObj = { year, month, day };
      }
      // Si el formato no es válido
      else {
        return "-- -- ----";
      }

      return `${dateObj.day}/${dateObj.month}/${dateObj.year}`; // Formato DD/MM/YYYY
    };



      // Función para cerrar la modal


  // Función para confirmar la operación
  
    const handleSubmit = async (values, actions) => {
     
      try {
        await onFormSubmit(values, actions); // 🔥 Ejecuta el submit del padre
      } finally {
        actions.setSubmitting(false);
      }
    };

    

const renderNombreUsuario = (usuario) => (
  <Box component="span" sx={{ color: 'text.primary', fontWeight: 500 }}>
    {usuario?.name}
  </Box>
);
// Fuera del componente, o usando useMemo para optimizar
const debouncedCheckBill = debounce(async (billNumber, callback) => {
  try {
    const response = await Axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/bill/${billNumber}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access-token")}`,
        },
        timeout: 10000,
      }
    );
    
    callback(response.data.count > 0);
  } catch (error) {
    if (error.response?.status !== 404) {
      console.error('Error verificando factura:', error);
    }
    callback(false);
  }
}, 500); // Espera 500ms después de la última escritura

// Dentro de tu componente
const [billExists, setBillExists] = useState(false);


  
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={esLocale}>
      {/* Para mostrar los toast */}
      <ToastContainer position="top-right" autoClose={5000} />
      <Box sx={{ padding: 5, backgroundColor: 'white', borderRadius: 1, boxShadow: 1 }}>
        
         <Box sx={{ 
                                        display: "flex", 
                                        justifyContent: "space-between", 
                                        alignItems: "center", 
                                        marginBottom: 3,
                                        paddingBottom: 2,
                                        borderBottom: '1px solid #e0e0e0'
                                      }}> <Typography variant="h4" gutterBottom>
                                      Registrar Operación
                                    </Typography>
                                    {user ? (
  <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
    Creado por: {renderNombreUsuario(user)}
  </Typography>
) : (
  <Typography variant="subtitle1" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
    Sin información de autoría
  </Typography>
)}

                                    </Box>
       
        
        <Formik
          initialValues={initialValues}
          validationSchema= {validationSchema}
          onSubmit={handleConfirm}
          
        >
          {/* {({ values, setFieldValue, touched, errors, handleBlur }) => ( */}
          {({ values, setFieldValue, touched, errors, handleBlur,setTouched ,setFieldTouched,setFieldError,formikBag,dirty, isSubmitting }) => {


            // 🔴 Debug: muestra el estado de dirty en consola
            useEffect(() => {

            }, [dirty]);

         // 🔴 Efecto para beforeunload
         useEffect(() => {
          const handleBeforeUnload = (e) => {
            if (dirty && !isSubmitting) {
              e.preventDefault();
              e.returnValue = '¿Estás seguro que deseas salir? Los cambios no guardados se perderán.';
              return e.returnValue;
            }
          };

          window.addEventListener('beforeunload', handleBeforeUnload);
          return () => window.removeEventListener('beforeunload', handleBeforeUnload);
        }, [dirty, isSubmitting]);

          return (
            <Form>
              <Grid container spacing={2}>
                {/* Primera fila: Número de Operación, Fecha de Operación y Tipo de Operación */}
                
                    <Grid item xs={12} md={2}>
                      <TextField
                         id="noOp-name" // Para CSS/JS si es necesario
                        data-testid="numero-operacion"
                        label="Número de Operación *"
                        fullWidth
                        type="number"
                        value={values.opId}
                        name="opId"
                        onChange={async (e) => {
                          const value = e.target.value;
                     

                          setFieldValue('opId', value); // Actualiza el valor en el formulario
                          
                          
                        }}
                        onBlur={handleBlur}
                        error={touched.opId && Boolean(errors.opId)}
                        helperText={touched.opId && errors.opId}
                        inputProps={{ min: 0 }} // Asegura que no se ingresen números negativos
                      />
                          
                        </Grid>
                        <Grid item xs={12} md={2}>
                          <DatePicker
                          id="opDate-name" // Para CSS/JS si es necesario
                            data-testid="fecha-operacion"
                            label="Fecha de Operación *"
                            value={values.opDate}
                            name="opDate"
                            onChange={(newValue) => {
                              const parsedDate = newValue ? new Date(newValue) : null;
                                  if (!parsedDate) return;

                                  setFieldValue('opDate', parsedDate);
                            
                              values.facturas.forEach((factura, index) => {
                                if (!factura.fechaFin) return;
                                
                            
                                // 1. Calcula operationDays (como ya lo hacías)
                                const operationDays = Math.max(0, differenceInDays(
                                  startOfDay(parseDateToLocal(factura.fechaFin)),
                                  startOfDay(parsedDate)
                                ));
                                setFieldValue(`facturas[${index}].operationDays`, operationDays);
                            
                                // 2. Recalcula los valores presentes y comisiones SOLO si hay días y valor futuro
                                if (operationDays > 0 && factura.valorFuturo > 0) {
                                  const presentValueInvestor = Math.round(
                                    PV(factura.investorTax / 100, operationDays / 365, 0, factura.valorFuturo, 0) * -1
                                  );
                                  const presentValueSF = Math.round(
                                    PV(values.discountTax / 100, operationDays / 365, 0, factura.valorFuturo, 0) * -1
                                  );
                            
                                  setFieldValue(`facturas[${index}].presentValueInvestor`, presentValueInvestor || 0);
                                  setFieldValue(`facturas[${index}].presentValueSF`, presentValueSF  || 0);
                                  setFieldValue(`facturas[${index}].comisionSF`, presentValueInvestor - presentValueSF  || 0);
                                  setFieldValue(`facturas[${index}].investorProfit`, presentValueInvestor - factura.valorNominal  || 0);
                                } else {
                                  // Resetea a valores por defecto si no hay días o valor futuro
                                  setFieldValue(`facturas[${index}].presentValueInvestor`, factura.currentBalance  || 0);
                                  setFieldValue(`facturas[${index}].presentValueSF`, factura.currentBalance  || 0);
                                  setFieldValue(`facturas[${index}].comisionSF`, 0);
                                  setFieldValue(`facturas[${index}].investorProfit`, 0);
                                }
                              });
                            }}
                            inputFormat="dd/MM/yyyy"
                            mask="__/__/____"
                            disableMaskedInput={false}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                fullWidth
                                error={!!errors.opDate}
                                helperText={errors.opDate}
                                onKeyDown={(e) => {
                                  // Permite solo números y barras
                                  if (!/[0-9/]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete') {
                                    e.preventDefault();
                                  }
                                }}
                              />
                            )}
                            PopperProps={{
                              placement: 'bottom-start',
                            }}
                          />
                        </Grid>
                          <Grid item xs={12} md={2}>
                          <Autocomplete
                        id="typeOp-name" // Para CSS/JS si es necesario
                        data-testid="campo-typeOp"
                        options={typeOperation?.data || []} // Asegurar que options no sea undefined
                        getOptionLabel={(option) => option.description || ''} // Mostrar la descripción
                        value={
                          typeOperation?.data.find(item => item.id === values.opType) || 
                          typeOperation?.data.find(item => item.id === values.opType) || // Fallback si no se encuentra por ID
                          null
                        }
                        onChange={async (event, newValue) => {
                          
                          setFieldValue('opType', newValue?.id);  
                          setFieldTouched('opType', true);
                        }}
                        renderInput={(params) => (
                          <TextField 
                            {...params} 
                            label="Tipo de Operación *" 
                            name="opType"
                            fullWidth 
                            //error={touched.opType && Boolean(errors.opType)}
                            helperText={touched.opType && errors.opType}
                          />
                        )}
                      />
                    </Grid>


                    {/* Campo de Emisor */}
                    <Grid item xs={12} md={6} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <div style={{ flex: 1 }}> {/* Este div ocupa el espacio restante */}
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
                            if (brokeDelete && isCreatingBill)  {
                             
                              // 1. Prevenir el borrado automático
                              event.preventDefault();
                              event.stopPropagation();
                              
                              // 2. Opcional: Mostrar feedback al usuario
                              toast.info("No se puede borrar el emisor mientras existan facturas creadas");
                              
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
                        
                       


                        if (isCreatingBill == true) {
              
                          // 1. Abrir el modal de confirmación
                          setIsModalEmitterAd(true);
                          setPendingClear(true); // Marcamos que hay un borrado pendiente
                          return; // Salimos temprano para esperar la decisión del usuario
                        }

                        // Si no está en modo creación o el modal fue confirmado (brokeDelete false)
                        if (( !brokeDelete)) {
                          setIsSelectedPayer(false);
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
                          setFieldValue('emitter', '');
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
                              montoDisponibleInfo: f.montoDisponibleInfo || 0
                            };
                          }));

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
                         
                          // Si brokeDelete es true, mantenemos el emisor original
                          setFieldValue('emitter', emitterSaved);
                        }
                      }

                          if (values.emitter !== newValue) {
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


                        
                            // Si tasaDescuento no es undefined, continuar con el flujo normal
                            setFieldValue('emitter', newValue);
                            setClientEmitter( newValue)
                      
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

                            if (newValue?.data.id ){
                              // Cargar nuevas facturas si se ha seleccionado un nuevo emisor
                                    if (newValue) {
                                      
                                      const facturasEmisor= await cargarFacturas(newValue?.data.id,values.filtroEmitterPagador.payer);
                                    
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
                                        setFieldValue('filteredPayers',pagadoresFiltrados)
                                      }
                                    
                                        }   
                                        }
                            
                          
                          }else {

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
                               toast(<div style={{ display: 'flex', alignItems: 'center' }}>
                                <ErrorIcon style={{ marginRight: '10px', color: '#d32f2f' }} />
                                <span>Disculpe, el cliente seleccionado no tiene perfil de riesgo configurado. Por favor, agrege el perfil en el módulo de clientes</span>
                              </div>, {
                                position: "bottom-right",
                                autoClose: 5000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true
                              });
                            
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
                            setClientEmitter( newValue)
                 
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

              
                            if (newValue?.data.id ){
                              
                    
                              // Cargar nuevas facturas si se ha seleccionado un nuevo emisor
                                    if (newValue) {
                                   
                                      const facturasEmisor= await cargarFacturas(newValue?.data.id,values.filtroEmitterPagador.payer);
                                     
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
                                        setFieldValue('filteredPayers',pagadoresFiltrados)
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
                                          error={touched.emitter && Boolean(errors.emitter)}
                                          helperText={touched.emitter&& errors.emitter}
                                        />
                                      )}
                                    />
                                  </div>
                                  {clientEmitter && (
                                    <IconButton
                                    onClick={() => {
                                      window.open(`${window.location.origin}/customers?modify=${clientEmitter.data.id}`, '_blank');
                                    }}
                                    sx={{ 
                                      marginTop: '15px',
                                      height: '20px',
                                      width: '20px',
                                      color: '#488F88', // Aquí sí funciona
                                      '&:hover': {
                                        color: '#3a726c', // Color más oscuro para hover
                                        backgroundColor: 'rgba(72, 143, 136, 0.1)' // Fondo sutil al hacer hover
                                      }
                                    }}
                                  >
                                    <EditIcon />
                                  </IconButton>
                                 )}
                                  
                                    
                                  </Grid>

                                  {/*Selector de Pagadores*/}
                                  <Grid item xs={12} md={6}>
                                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                    <div style={{ flex: 1 }}> {/* Este div ocupa el espacio restante */}
                                      <Autocomplete
                                              id="payer-name" // Para CSS/JS si es necesario
                                              data-testid="campo-pagador"
                                              options={showAllPayers ? payers : values?.filteredPayers || []}
                                          value={payers.find(p => p.id === values.nombrePagador) || null} // Buscar el objeto que coincide con el nombre
                                          isOptionEqualToValue={(option, value) => 
                                            option?.id === value?.id
                                          }
                                          getOptionLabel={(option) => option?.label || ''}
                                          onChange={async (event, newValue) => {
                                            const indicesEnModoCreacion = orchestDisabled
                                                .filter(item => item.status === true)
                                                .map(item => item.indice);

                                            setIsSelectedPayer(true)
                                           if (!newValue) {
                                              setClientPagador(null);
                                              setIsSelectedPayer(false);
                                              
                                              // 1. Identificar facturas no creadas por cuenta de inversionista
                                              const facturasPorCuenta = values.facturas.reduce((acc, factura, idx) => {
                                                const esCreada = orchestDisabled.find(item => item.indice === idx)?.status === true || factura.is_creada;
                                                if (esCreada) return acc;
                                                
                                                const cuentaId = factura.idCuentaInversionista;
                                                if (!acc[cuentaId]) {
                                                  acc[cuentaId] = [];
                                                }
                                                acc[cuentaId].push({ factura, index: idx });
                                                return acc;
                                              }, {});

                                              // 2. Calcular totales por cuenta para facturas no creadas
                                              Object.entries(facturasPorCuenta).forEach(([cuentaId, facturasConIdx]) => {
                                                if (facturasConIdx.length > 1) {
                                                  const totalRestituir = facturasConIdx.reduce(
                                                    (sum, { factura }) => sum + factura.gastoMantenimiento + factura.presentValueInvestor, 
                                                    0
                                                  );
                                                  
                                                  // Actualizar montos disponibles manteniendo posiciones
                                                  facturasConIdx.forEach(({ index }) => {
                                                    setFieldValue(
                                                      `facturas[${index}].montoDisponibleCuenta`, 
                                                      values.facturas[index].montoDisponibleInfo
                                                    );
                                                  });
                                                }
                                              });

                                              // 3. Resetear solo facturas no creadas manteniendo posición y orden
                                              const nuevasFacturas = values.facturas.map((f, index) => {
                                                const esCreada = orchestDisabled.find(item => item.indice === index)?.status === true || f.is_creada;
                                                
                                                if (esCreada) {
                                                  return f; // Mantener factura creada intacta en su posición
                                                }
                                                
                                                // Resetear factura no creada manteniendo posición
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
                                                        'montoDisponibleInfo'
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
                                                  is_creada: false
                                                };
                                              });

                                              setFieldValue('facturas', nuevasFacturas);
                                              setFieldValue('nombrePagador', '');
                                              setFieldValue('filtroEmitterPagador.payer', '');
                                              setFieldValue('takedBills', []);
                                              
                                              return;
                                            }

                                            // Caso 2: Cambio de pagador
                                            if (values.nombrePagador && newValue.id !== values.nombrePagador) {
                                              const confirmChange = window.confirm(
                                                "¿Está seguro de cambiar de pagador? Esto reseteará las facturas no creadas."
                                              );
                                              
                                              if (!confirmChange) return;
                                              
                                              // 1. Resetear solo facturas no creadas manteniendo posición y orden
                                              const nuevasFacturas = values.facturas.map((f, index) => {
                                                const esCreada = orchestDisabled.find(item => item.indice === index)?.status === true || f.is_creada;
                                                
                                                if (esCreada) {
                                                  return f; // Mantener factura creada intacta en su posición
                                                }
                                                
                                                // Resetear factura no creada manteniendo posición
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
                                                        'montoDisponibleInfo'
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
                                                  is_creada: false
                                                };
                                              });

                                              // 2. Agregar factura vacía si no hay ninguna
                                              if (nuevasFacturas.length === 0) {
                                                nuevasFacturas.push({
                                                  fechaEmision: new Date().toISOString().substring(0, 10),
                                                  expirationDate: '',
                                                  valorFuturo: 0,
                                                  presentValueInvestor: 0,
                                                  gastoMantenimiento: 0,
                                                  is_creada: false,
                                                  ...(values.facturas[0] ? {
                                                    nombreInversionista: values.facturas[0].nombreInversionista || '',
                                                    numbercuentaInversionista: values.facturas[0].numbercuentaInversionista || '',
                                                    cuentaInversionista: values.facturas[0].cuentaInversionista || '',
                                                    idCuentaInversionista: values.facturas[0].idCuentaInversionista || '',
                                                    investorBroker: values.facturas[0].investorBroker || "",
                                                    investorBrokerName: values.facturas[0].investorBrokerName || "",
                                                    montoDisponibleCuenta: values.facturas[0].montoDisponibleInfo || 0,
                                                    montoDisponibleInfo: values.facturas[0].montoDisponibleInfo || 0
                                                  } : {})
                                                });
                                              }

                                              setFieldValue('facturas', nuevasFacturas);
                                              
                                              // 3. Establecer nuevo pagador
                                              setFieldValue('nombrePagador', newValue.id);
                                              setClientPagador(newValue.id);
                                              setFieldValue('filtroEmitterPagador.payer', newValue.data?.document_number || '');
                                              
                                              // 4. Cargar facturas del nuevo pagador
                                              if (newValue.data?.document_number && dataBills?.data) {
                                                const filteredBills = showAllPayers 
                                                  ? dataBills.data.filter(f => Number(f.currentBalance) > 0)
                                                  : dataBills.data.filter(f => 
                                                      f.payerId === newValue.data.document_number && 
                                                      Number(f.currentBalance) > 0
                                                    );
                                                
                                                setFieldValue('takedBills', filteredBills);
                                              } else {
                                                setFieldValue('takedBills', []);
                                              }
                                              
                                              return;
                                            }
                                              // Limpiar cuando:
                                              // 1. Se selecciona un pagador diferente al actual
                                              // 2. Se borra manualmente (newValue === null)
                                              const shouldReset = !newValue || (values.nombrePagador && newValue.id !== values.nombrePagador);
                                              
                                              if (shouldReset) {
                                                // 1. Agrupar facturas por idCuentaInversionista
                                                const facturasPorCuenta = values.facturas.reduce((acc, factura) => {
                                                  const cuentaId = factura.idCuentaInversionista;
                                                  if (!acc[cuentaId]) {
                                                    acc[cuentaId] = [];
                                                  }
                                                  acc[cuentaId].push(factura);
                                                  return acc;
                                                }, {});

                                                // 2. Calcular total a restituir para cuentas con múltiples facturas
                                                Object.entries(facturasPorCuenta).forEach(([cuentaId, facturas]) => {
                                                  if (facturas.length > 1) {
                                                    const totalRestituir = facturas.reduce(
                                                      (sum, f) => sum + f.gastoMantenimiento + f.presentValueInvestor, 
                                                      0
                                                    );
                                                    
                                                    // 3. Actualizar montos disponibles
                                                    values.facturas.forEach((f, index) => {
                                                      if (f.idCuentaInversionista === cuentaId) {
                                                        setFieldValue(`facturas[${index}].montoDisponibleCuenta`, 
                                                          f.montoDisponibleInfo
                                                        );
                                                      }
                                                    });
                                                  }
                                                });
                                                
                                                // 4. Resetear solo facturas que NO están en modo creación
                                                setFieldValue('facturas', values.facturas.map((f, index) => {
                                                  if (indicesEnModoCreacion.includes(index)) {
                                                    // Mantener factura sin cambios si está en modo creación
                                                    return f;
                                                  }
                                                  
                                                  // Resetear factura si NO está en modo creación
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
                                                          'montoDisponibleInfo'
                                                        ].includes(key))
                                                        .map(key => [key, 
                                                          typeof f[key] === 'number' ? 0 : 
                                                          key.includes('Date') || key.includes('fecha') ? new Date().toISOString().substring(0, 10) : 
                                                          ''
                                                        ])
                                                    ),
                                                    nombreInversionista: f.nombreInversionista || '',
                                                    numbercuentaInversionista: f.numbercuentaInversionista || '',
                                                    cuentaInversionista: f.cuentaInversionista || '',
                                                    idCuentaInversionista: f.idCuentaInversionista || '',
                                                    investorBroker: f.investorBroker || "",
                                                    investorBrokerName: f.investorBrokerName || "",
                                                    montoDisponibleCuenta: f.montoDisponibleInfo || 0,
                                                    montoDisponibleInfo: f.montoDisponibleInfo || 0
                                                  };
                                                }));

                                                // 5. Limpiar campos adicionales
                                                setFieldValue('nombrePagador', '');
                                                setFieldValue('filtroEmitterPagador.payer', '');
                                                setFieldValue('takedBills', []);
                                                return;
                                              }
                                                                                      // 1. Actualizar valores del formulario
                                            setFieldValue('nombrePagador', newValue?.id || '');
                                            setClientPagador(newValue?.id)
                                            setFieldValue('filtroEmitterPagador.payer', newValue?.data?.document_number || '');
                                          
                                            // 2. Filtrar facturas si hay pagador seleccionado
                                            if (newValue?.data?.document_number && dataBills?.data) {
                                              if (showAllPayers) {
                                                // Modo sin filtro - tomar todas las facturas con saldo positivo
                                                const todasFacturasValidas = dataBills.data.filter(
                                                  factura => Number(factura.currentBalance) > 0
                                                );
                                                setFieldValue('takedBills', todasFacturasValidas);
                                            
                                              } else {
                                                // Modo filtrado - lógica original (solo facturas del pagador seleccionado)
                                                const facturasFiltradas = dataBills.data.filter(
                                                  factura => 
                                                    factura.payerId === newValue.data.document_number && 
                                                    Number(factura.currentBalance) > 0
                                                );
                                                setFieldValue('takedBills', facturasFiltradas);
                                             
                                              }
                                            } else {
                                              setFieldValue('takedBills', []); // Limpiar si no hay pagador
                                            }
                                          }}
                                          renderInput={(params) => (
                                            <TextField
                                              {...params}
                                              label="Nombre Pagador *"
                                              fullWidth
                                              name="nombrePagador"
                                              error={touched.nombrePagador && Boolean(errors.nombrePagador)}
                                              helperText={touched.nombrePagador && errors.nombrePagador}
                                            />
                                          )}
                                        />
                                       
                                         </div>

                                       
                                       {/* Botón para alternar entre todos los payers y los filtrados */}
                                       <Tooltip title={showAllPayers ? "Mostrar solo pagadores filtrados" : "Mostrar todos los pagadores"}>
                                            <IconButton
                                              size="small"
                                              onClick={() => setShowAllPayers(!showAllPayers)}
                                              color={showAllPayers ? "primary" : "default"}
                                              style={{ marginTop: '8px' }}
                                            >
                                              {showAllPayers ? <FilterAltOffIcon /> : <FilterAltIcon />}
                                            </IconButton>
                                          </Tooltip>
                                          {clientPagador && (
                                     <IconButton
                                     color="primary"
                                     onClick={() => {
                                      window.open(`${window.location.origin}/customers?modify=${clientPagador }`, '_blank');
                                     }}
                                     
                                     sx={{ 
                                      marginTop: '15px',
                                      height: '20px',
                                      width: '20px',
                                      color: '#488F88', // Aquí sí funciona
                                      '&:hover': {
                                        color: '#3a726c', // Color más oscuro para hover
                                        backgroundColor: 'rgba(72, 143, 136, 0.1)' // Fondo sutil al hacer hover
                                      }
                                    }}
                                   >
                                     <EditIcon />
                                   </IconButton>
                                 )}
                                        </div>
                                    </Grid>

                          {/*Selector de Corredor Emisor */}
                          <Grid item xs={12} md={6}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                        <div style={{ flex: 1 }}> {/* Este div ocupa el espacio restante */}
                              <TextField
                                id="brokerEmitter-name" // Para CSS/JS si es necesario
                                data-testid="corredor-emisor"
                                label="Corredor Emisor *"
                                fullWidth
                                name="corredorEmisor"
                                value={values.corredorEmisor || ""} // Usar el valor del campo
                                onChange={(event) => {
                                  setFieldValue('corredorEmisor', event.target.value); // Actualiza el valor
                                  setFieldTouched('corredorEmisor', true); // Marca el campo como "touched"
                                  setClientBrokerEmitter(event.target.value)
                                }}
                                disabled // Deshabilitar edición manual
                                error={touched.corredorEmisor && Boolean(errors.corredorEmisor)}
                                helperText={touched.corredorEmisor && errors.corredorEmisor}
                              />
                              </div>
                              {clientBrokerEmitter && (
                                    <IconButton
                                      color="primary"
                                      onClick={() => {
                                        window.open(`${window.location.origin}/brokers?modify=${clientBrokerEmitter}`, '_blank');
                                      }}
                                      sx={{ 
                                        marginTop: '15px',
                                        height: '20px',
                                        width: '20px',
                                        color: '#488F88', // Aquí sí funciona
                                        '&:hover': {
                                          color: '#3a726c', // Color más oscuro para hover
                                          backgroundColor: 'rgba(72, 143, 136, 0.1)' // Fondo sutil al hacer hover
                                        }
                                      }}
                                    >
                                      <EditIcon />
                                    </IconButton>
                                  )}
                                  </div>
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
                                      sx={{
                                        border: factura.is_creada ? '2px solid #488F88' : 'none',
                                        transition: 'border 0.3s ease',
                                        '&:hover': {
                                          border: factura.is_creada ? '2px solidrgb(29, 89, 83)' : 'none'
                                        }
                                      }}
                                      expanded={expanded === index} 
                                      onChange={handleChange(index)}>
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        <Grid container alignItems="center" spacing={1} style={{ width: '100%' }}>
                                        {/* Número de factura de la cabecera del acordeon */}
                                        <Grid item xs={10} container alignItems="center" wrap="nowrap" spacing={1}>
                                        <Grid item>
                                          <Typography>
                                            {factura.billId|| `Factura ${index + 1}`}
                                          </Typography>
                                        </Grid>
                                        {/* Fecha de emisión y vencimiento de la cabecera del acordeon*/}
                                        <Grid item>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                              {editMode[index] ? (
                                                // Modo edición - DatePickers
                                                <div style={{ display: 'flex', gap: '8px', flex: 1 }}>
                                                  
                                                  <DatePicker
                                                  label="Emisión"
                                                  value={factura.fechaEmision ? parseISO(factura.fechaEmision) : null}
                                                  onChange={(newValue) => {
                                                    if (newValue) {
                                                      const formattedDate = newValue.toISOString().substring(0, 10);
                                                      setFieldValue(`facturas[${index}].fechaEmision`, formattedDate);
                                                      
                                                      if (factura.billId) {
                                                        values.facturas.forEach((f, i) => {
                                                          if (f.billId === factura.billId && i !== index) {
                                                            setFieldValue(`facturas[${i}].fechaEmision`, formattedDate);
                                                          }
                                                        });
                                                      }
                                                    }
                                                  }}
                                                  inputFormat="dd/MM/yyyy"
                                                  mask="__/__/____"
                                                  renderInput={(params) => (
                                                    <TextField 
                                                      {...params}
                                                      size="small"
                                                      fullWidth
                                                      onKeyDown={(e) => e.stopPropagation()}
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        e.preventDefault(); // Agregado para mayor seguridad
                                                      }}
                                                    />
                                                  )}
                                                  PopperProps={{
                                                    onClick: (e) => {
                                                      e.stopPropagation(); // Previene la propagación en el calendario
                                                    }
                                                  }}
                                                />

                                                <DatePicker
                                                  label="Vencimiento"
                                                  value={factura.expirationDate ? parseISO(factura.expirationDate) : null}
                                                  onChange={(newValue) => {
                                                    if (newValue) {
                                                      const formattedDate = newValue.toISOString().substring(0, 10);
                                                      setFieldValue(`facturas[${index}].expirationDate`, formattedDate);
                                                      
                                                      if (factura.billId) {
                                                        values.facturas.forEach((f, i) => {
                                                          if (f.billId === factura.billId && i !== index) {
                                                            setFieldValue(`facturas[${i}].expirationDate`, formattedDate);
                                                          }
                                                        });
                                                      }
                                                    }
                                                  }}
                                                  inputFormat="dd/MM/yyyy"
                                                  mask="__/__/____"
                                                  renderInput={(params) => (
                                                    <TextField 
                                                      {...params}
                                                      size="small"
                                                      fullWidth
                                                      onKeyDown={(e) => e.stopPropagation()}
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        e.preventDefault();
                                                      }}
                                                    />
                                                  )}
                                                  PopperProps={{
                                                    onClick: (e) => {
                                                      e.stopPropagation();
                                                    }
                                                  }}
                                                  onClick={(e) => e.stopPropagation()}
                                                />
                                                </div>
                                              ) : (
                                                // Modo visualización - Texto
                                                <Typography variant="body2" color="textSecondary" style={{ flex: 1 }}>
                                                  Emisión: {factura.fechaEmision ? formatDate2(factura.fechaEmision) : "-- -- ----"} | 
                                                  Vencimiento: {factura.expirationDate ? formatDate2(factura.expirationDate) : "-- -- ----"}
                                                </Typography>
                                              )}
                                              
                                              {/* Botón para alternar modos */}
                                              <IconButton 
                                                size="small"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setEditMode(prev => ({ ...prev, [index]: !prev[index] }));
                                                }}
                                                disabled={!orchestDisabled.find(item => item.indice === index)?.status}
                                              >
                                                {editMode[index] ? <CheckIcon fontSize="small" /> : <EditIcon fontSize="small" />}
                                              </IconButton>
                                            </div>
                                          </Grid>
                                                                              </Grid>
                                      {/* Botón de eliminar */}
                                      <Grid item xs={2} container justifyContent="flex-end">
                                        
                                      {factura.is_creada && (
                                          <Box
                                            sx={{
                                              width: '70px',
                                              height: '30px',
                                              display: 'flex',
                                              alignItems: 'center',
                                              justifyContent: 'center',
                                              borderRadius: '4px',
                                              backgroundColor: '#488F8F', // Color fijo como solicitaste
                                              color: 'common.white',
                                              fontWeight: 'bold',
                                              border: '1px solid',
                                              borderColor: '#488F8F', // Mismo color para el borde
                                              marginLeft: '8px', // Espaciado opcional para separarlo de otros elementos
                                            }}
                                          >
                                            <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                                            Nuevo
                                            </Typography>
                                          </Box>
                                        )}
                                        
                                      <IconButton onClick={() => {
                                          // 1. Obtener valores clave de la factura a eliminar
                                          const billIdEliminada = factura.billId;
                                          const cuentaInversionistaEliminada = factura.idCuentaInversionista;
                                          const valorFuturoEliminado = factura.valorFuturo || 0;
                                          const presentValueEliminado = factura.presentValueInvestor || 0;
                                          const gastoMantenimientoEliminado = factura.gastoMantenimiento || 0;
                                          const facturaCreada=orchestDisabled.filter(facturaSelect =>facturaSelect.indice=== index)
                                          const cantidadCreadas = orchestDisabled.filter(item => item.status === true).length;
                                          let n_created=cantidadCreadas



                                            
                                        // Fracción de la factura que se va a eliminar
                                        const fraccionEliminada = factura.fraccion || 0;

                                          if (billIdEliminada && facturaCreada){
                                            setOrchestDisabled(prevState => 
                                              prevState.map(item => 
                                                item.indice === index 
                                                  ? {...item, status: false}  // Actualiza solo este elemento
                                                  : item                     // Mantiene los demás igual
                                              )
                                            );
                          
                                           
                                            n_created-=1
                                         
                                           
                                          }
                                          if (n_created==0){
                                            setIsCreatingBill(false)
                                          }
                                          // 2. Procesar facturas con mismo billId (si existe)
                                          if (billIdEliminada ) {
                                            // Encontrar todas las facturas que comparten el mismo billId
                                            const facturasMismoBillId = values.facturas.filter(
                                              f => f.billId === billIdEliminada 
                                            );
                                        

                                            if (facturasMismoBillId.length > 0) {
                                              // Calcular nuevo saldo disponible (sumar el valor futuro eliminado)
                                              const nuevoSaldoDisponible = (factura.saldoDisponible|| 0) + valorFuturoEliminado;
                                              
                                              // Actualizar todas las facturas con el mismo billId
                                              values.facturas.forEach((f, i) => {
                                                if (f.billId === billIdEliminada && i !== index) {
                                                  setFieldValue(`facturas[${i}].saldoDisponible`, nuevoSaldoDisponible);
                                                  // Reordenar fracciones si es necesario
                                                if (f.fraccion > fraccionEliminada) {
                                                  // Disminuir en 1 las fracciones mayores a la eliminada
                                                  setFieldValue(`facturas[${i}].fraccion`, f.fraccion - 1);
                                                }
                                                }
                                              });
                                            }
                                          }

                                          // 3. Procesar facturas con mismo idCuentaInversionista (si existe)
                                          if (cuentaInversionistaEliminada) {
                                            // Encontrar todas las facturas que comparten la misma cuenta
                                            const facturasMismaCuenta = values.facturas.filter(
                                              f => f.idCuentaInversionista === cuentaInversionistaEliminada && f !== factura
                                            );
                                         
                                            if (facturasMismaCuenta.length > 0) {
                                              // Calcular nuevo monto disponible (sumar PV y GM eliminados)
                                              const montoLiberado = presentValueEliminado + gastoMantenimientoEliminado;
                                              const nuevoMontoDisponible = (factura.montoDisponibleCuenta || 0) + montoLiberado;
                                              
                                              // Actualizar todas las facturas con la misma cuenta
                                              values.facturas.forEach((f, i) => {
                                                if (f.idCuentaInversionista === cuentaInversionistaEliminada && i !== index) {
                                                  setFieldValue(`facturas[${i}].montoDisponibleCuenta`, nuevoMontoDisponible);
                                                }
                                              });
                                            }
                                          }

                                          // 4. Finalmente eliminar la factura
                                          remove(index);
                                        }}>
                                          <DeleteIcon />
                                        </IconButton>
                                    </Grid>
                                      </Grid>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                          <Grid container spacing={3}>
                                            <Grid item xs={12} md={1.9}>


                                            {(orchestDisabled.find(item => item.indice === index)?.status) ? (
                                              <Box>

                                                  <TextField
                                                    id="codigoFactura"
                                                    label="Código Factura *"
                                                    fullWidth
                                                    value={values.facturas[index]?.billId || ''}
                                                    error={touched.facturas?.[index]?.billId && Boolean(errors.facturas?.[index]?.billId)}
                                                    helperText={touched.facturas?.[index]?.billId && errors.facturas?.[index]?.billId}
                                                    InputProps={{
                                                      disableUnderline: true,
                                                      sx: { marginTop: "0px" }
                                                    }}
                                                  
                                               
                                                  
                                                    onChange={async (event) => {
                                                    const newValue = event.target.value
                                                    const handleBillChange = async (event, index) => {
                                                      const newValue = event.target.value;
                                                      
                                                      // Actualización local inmediata
                                                      const updatedFacturas = [...values.facturas];
                                                      updatedFacturas[index] = { ...updatedFacturas[index], billId: newValue };
                                                      console.log(updatedFacturas)
                                                      setFieldValue(`facturas[${index}].is_creada`, true);
                                                      setFieldValue(`facturas[${index}]`, updatedFacturas[index]);
                                                      
                                                      // Validación con debounce (solo si tiene longitud válida)
                                                      if (newValue.length > 3) { // Ajusta este mínimo según necesites
                                                        debouncedCheckBill(newValue, (exists) => {
                                                          setBillExists(exists);
                                                          if (exists) {
                                                            toast.error(`La factura ${newValue} ya existe`);
                                                          }
                                                        });
                                                      }
                                                    };
                                                    handleBillChange(event, index)
                                                    // Primero actualiza el valor en el formulario para que el usuario pueda escribir
                                                    setFieldValue(`facturas[${index}].billId`, newValue);
                                                    setFieldValue(`facturas[${index}].billCode`, newValue);
                                                    setFieldValue(`facturas[${index}].factura`, newValue);
                                                   

                                                    /////////
                                                    if (!newValue) {
                                              
                                                      // 1. Obtener el billId de la factura que se está deseleccionando
                                                      const billIdDeseleccionada = factura.billId;
                                                      
                                                   
                                                      if(values.facturas[index].is_creada===true){
                                                        return
                            
                                                      }else {
                                                        setFieldValue(`facturas[${index}].is_creada`,false)
                                                      }
                                                      // 4. Buscar todas las facturas que comparten el mismo billId (incluyendo la actual)
                                                      const facturasCompartidas = values.facturas.filter(
                                                        f => f.billId === billIdDeseleccionada
                                                      );
                                                    
                                                      // 5. Calcular el saldoDisponible original de la factura
                                                      const facturaOriginal = dataBills?.data.find(f => f.billId === billIdDeseleccionada);
                                                      const saldoOriginal = facturaOriginal?.currentBalance || 0;
                                                    
                                                      // 6. Calcular el valorFuturo total actual de todas las facturas compartidas (excluyendo la que se deselecciona)
                                                      const valorFuturoActual = facturasCompartidas
                                                        .filter((f, i) => i !== index) // Excluir la factura que se está deseleccionando
                                                        .reduce((sum, f) => sum + (f.valorFuturo), 0);
                                                    
                                                      // 7. Calcular el nuevo saldoDisponible global para esta factura
                                                      const nuevoSaldoGlobal = saldoOriginal - valorFuturoActual;
                                                    
                                                      // 8. Actualizar el saldoDisponible en TODAS las facturas compartidas
                                                      values.facturas.forEach((f, i) => {
                                                        if (f.billId === billIdDeseleccionada) {
                                                          setFieldValue(`facturas[${i}].saldoDisponible`, nuevoSaldoGlobal);
                                                          setFieldValue(`facturas[${i}].saldoDisponibleInfo`, saldoOriginal);
                                                        }
                                                      });
                                                    
                                                      // 9. Recalcular los montos disponibles para el inversionista (si aplica)
                                                      if (factura.idCuentaInversionista) {
                                                        const presentValueTotal = values.facturas
                                                          .filter(f => 
                                                            f.idCuentaInversionista === factura.idCuentaInversionista  
                                                            
                                                          )
                                                          .reduce((sum, f) => sum + f.presentValueInvestor , 0);
                                                          
                                                        const montoDisponibleActualizado = factura.montoDisponibleCuenta+ factura.presentValueInvestor+factura.gastoMantenimiento ;
                                                   
                                                    
                                                        values.facturas.forEach((f, i) => {
                                                         
                                                          if (f.idCuentaInversionista=== factura.idCuentaInversionista) {
                                                        
                                                            setFieldValue(`facturas[${i}].montoDisponibleCuenta`, 
                                                              montoDisponibleActualizado
                                                            );
                                                            
                                                          }
                                                        
                                                        });
  
                                                        setFieldValue(`facturas[${index}].montoDisponibleCuenta`, 
                                                          montoDisponibleActualizado
                                                      );
                                                      }
                                                      setFieldValue(`facturas[${index}].saldoDisponible`, 
                                                        0
                                                    );
  
                                                      // 3. Limpiar los valores de esta factura (manteniendo los datos del inversionista)
                                                      setFieldValue(`facturas[${index}]`, {
                                                        is_creada:true,
                                                        billId: '',
                                                        factura: '',
                                                        fechaEmision: '',
                                                        valorNominal: 0,
                                                        saldoDisponible: 0,
                                                        valorFuturo: 0,
                                                        amount: 0,
                                                        payedAmount: 0,
                                                        fraccion: 1,
                                                        porcentajeDescuento: 0,
                                                        nombrePagador: '',
                                                        presentValueInvestor: 0,
                                                        presentValueSF: 0,
                                                        investorProfit: 0,
                                                        comisionSF: 0,
                                                        fechaFin:factura.fechaFin,
                                                        idCuentaInversionista:factura.idCuentaInversionista,
                                                        numbercuentaInversionista: factura.numbercuentaInversionista,
                                                        cuentaInversionista: factura.cuentaInversionista,
                                                        nombreInversionista: factura.nombreInversionista,
                                                        investorBroker: factura.investorBroker,
                                                        investorBrokerName: factura.investorBrokerName,
                                                        montoDisponibleCuenta:factura.montoDisponibleCuenta+factura.presentValueInvestor+factura.gastoMantenimiento,
                                                        montoDisponibleInfo: factura.montoDisponibleInfo,
                                                        gastoMantenimiento: 0,
                                                        operationDays: 0,
                                                        expirationDate: "",
                                                        billCode:""
                                                      });
                                                      return;
  
                                                      
                                                    }
                                                  ///////////////////////////////////////////////////////////////////////////////////////////////////
                                                  
                                                  
                                                    const selectedFactura = values.facturas.find(f => f.billId === newValue);
                                                 
                                                    if (!selectedFactura) return;
                                                  
                                                   
                                                  

                                                    function encontrarFacturasMismoBillIdYInversionista(facturas, billId, inversionistaId) {
                                                      // Validaciones iniciales
                                                      
                                                      
                                                      if (!Array.isArray(facturas)) {
                                                        console.warn('El parámetro facturas no es un array');
                                                        return [];
                                                      }
                                                      
                                                      if (!billId || !inversionistaId) {
                                                        console.warn(billId ? 'Falta inversionistaId' : 'Falta billId');
                                                        return [];
                                                      }
                                                    
                                                      return facturas.filter(factura => {
                                                        if (!factura?.billId || !factura?.nombreInversionista) return false;
                                                        
                                                        const esMismoBillId = String(factura.billId) === String(billId);
                                                        const esMismoInversionista = String(factura.nombreInversionista) === String(inversionistaId);
                                                        
                                                    
                                                        
                                                        return esMismoBillId && esMismoInversionista;
                                                      });
                                                    }



                                                    const inversionistaSeleccionado = factura.nombreInversionista// ID del inversionista seleccionado
                                                   
                                                    const facturasDuplicadas = encontrarFacturasMismoBillIdYInversionista(
                                                      values.facturas, 
                                                      newValue, // la factura que estás procesando actualmente
                                                      inversionistaSeleccionado
                                                    );
  
                                                   
                                                    if(facturasDuplicadas?.length>=1 ){
  
                                                     
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
                                                        position: "top-right",
                                                        autoClose: 5000,
                                                        hideProgressBar: false,
                                                        closeOnClick: true,
                                                        pauseOnHover: true,
                                                        draggable: true
                                                      });
                                                
                                                      
                                                      return;
  
  
                                                    }
                                                    
                                                  /////////////////////////////////////////////////////////////////
                                                    try {
                                                      
                                                       
  
                                                        const facturaActual2 = values?.facturas[index-1];
                                                        
                                                        const billIdAnterior = facturaActual2?.billId;
                                                        const valorFuturoAnterior = facturaActual2?.valorFuturo || 0;
                                                        const nombreInversionistaAnterior = facturaActual2?.nombreInversionista;
                                                       
                                                        if(billIdAnterior  && newValue!=billIdAnterior  ){
  
                                                       
  
                                                         
  
                                                          
                                                          
                                                        const presentValueInvestorFacturaAnterior=facturaActual2?.presentValueInvestor
                                                        const montoDisponibleFacturaAnterior=facturaActual2?.montoDisponibleCuenta
                                                        const saldoDisponibleFacturaAnterior=facturaActual2?.saldoDisponible

                                                        const saldoDisponibleNuevo= saldoDisponibleFacturaAnterior+valorFuturoAnterior   
                                                        const montoDisponibleNuevo =montoDisponibleFacturaAnterior+presentValueInvestorFacturaAnterior
  
                                                          // 3. Actualizar todas las facturas con el mismo billId (excepto la actual)
                                                    values.facturas.forEach((f, i) => {
                                                      if (f.billId === billIdAnterior && i !== index) {
                                                        // Actualizar saldo disponible
                                                        setFieldValue(`facturas[${i}].saldoDisponible`, saldoDisponibleNuevo);
                                                        
                                                        setFieldValue(`facturas[${i}].montoDisponibleCuenta`, montoDisponibleNuevo);
                                                        
                                                      }
                                                    });
  
  
                                                    setFieldValue(`facturas[${index}]`, {
                                                      is_creada:true,
                                                      billCode: selectedFactura.billId,
                                                      billId: selectedFactura.billId,
                                                      idCuentaInversionista: factura.idCuentaInversionista,
                                                      factura: newValue.id || newValue,
                                                      fechaEmision: selectedFactura.dateBill,
                                                      probableDate: selectedFactura.probableDate,
                                                      amount: selectedFactura.saldoDisponibleInfo,
                                                      payedAmount: selectedFactura.saldoDisponibleInfo,
                                                      numbercuentaInversionista: factura.numbercuentaInversionista,
                                                      cuentaInversionista: factura.cuentaInversionista,
                                                      nombreInversionista: factura.nombreInversionista,
                                                      investorBroker: factura.investorBroker,
                                                      investorBrokerName: factura.investorBrokerName,
                                                      saldoDisponible: 0,
                                                      saldoDisponibleInfo: selectedFactura.saldoDisponibleInfo,
                                                      montoDisponibleCuenta:montoDisponibleFinal, // Usamos el valor calculado
                                                      fraccion: fraccion,
                                                      fechaFin: factura.fechaFin,
                                                      valorNominal: valorNominalFactura,
                                                      porcentajeDescuento: Math.round((selectedFactura.saldoDisponibleInfo * 100) / selectedFactura.saldoDisponibleInfo) || 0,
                                                      expirationDate: selectedFactura.expirationDate,
                                                      valorFuturo: valorFuturoCalculado,
                                                      presentValueInvestor:valorFuturoCalculado,
                                                      presentValueSF:valorFuturoCalculado|| 0,
                                                      comisionSF,
                                                      investorProfit: investorProfit,
                                                      integrationCode: selectedFactura?.integrationCode ? selectedFactura?.integrationCode : "",
                                                      isReBuy: selectedFactura?.reBuyAvailable ?? 0,
                                                      gastoMantenimiento: 0,
                                                      operationDays: 0,
                                                      investorTax: values.investorTax,
                                                      montoDisponibleInfo: factura.montoDisponibleInfo
                                                    });
                                                    
                                                          
                                                        } 
                                                      
                                                        
                                                        
                                                  
                                                        // [MANTENIDO] Cálculo de fechas mejorado
                                                        const fechaOperacion = new Date(values?.opDate);
                                                        const parseDate = (dateStr) => {
                                                          // Intenta varios formatos comunes
                                                          const parsed = new Date(dateStr);
                                                          if (!isNaN(parsed.getTime())) return parsed;
                                                          
                                                          // Si falla, intenta con parseISO
                                                          try {
                                                            const isoParsed = parseISO(dateStr);
                                                            return !isNaN(isoParsed.getTime()) ? isoParsed : new Date(NaN);
                                                          } catch {
                                                            return new Date(NaN);
                                                          }
                                                        };

                                                        const expirationDate = selectedFactura?.expirationDate 
                                                          ? parseDate(selectedFactura.expirationDate)
                                                          : new Date(NaN); // Marcamos explícitamente como inválido si no hay fecha

                                                    

                                                        let substractDays = 0;
                                                        if (!isNaN(fechaOperacion.getTime()) && !isNaN(expirationDate.getTime())) {
                                                          substractDays = differenceInDays(expirationDate, fechaOperacion);
                                         
                                                        } else {
                                                          console.error("Error: Una de las fechas no es válida.", {
                                                            opDate: values?.opDate,
                                                            expirationDate: selectedFactura?.expirationDate,
                                                            parsedOperacion: fechaOperacion,
                                                            parsedExpiration: expirationDate
                                                          });
                                                        }
                                                        
                                                                                                                
                                                        // [MANTENIDO] Lógica de fracciones
                                                        const facturaActual = selectedFactura
                                                        let fraccion = selectedFactura.fraccion+ 1 || 1;
                                                        const facturasAnteriores = values.facturas
                                                        .slice(0, index)
                                                        .filter((f) => {
                                                          // Validación para evitar errores si f es null/undefined
                                                          if (!f || !f.billId) return false;
                                                          
                                                          // Comparación segura convirtiendo a string
                                                          return String(f.billId) === String(facturaActual?.billId);
                                                        });
                                                      
                                                     
                                                        if (facturasAnteriores.length > 0) {
                                                          const fraccionMasAlta = Math.max(...facturasAnteriores.map((f) => f.fraccion || 1));
                                                          fraccion = fraccionMasAlta + 1;
                                                        }
                                                  
                                                        // [MANTENIDO] Cálculo de saldo disponible
                                                        let saldoDisponible = selectedFactura.saldoDisponibleInfo|| 0;
                                                        const valorFuturoAnteriores = facturasAnteriores.reduce((sum, f) => sum + (f.valorFuturo || 0), selectedFactura.saldoDisponibleInfo);
                                                        saldoDisponible -= valorFuturoAnteriores;
                                                  
                                                        // [MANTENIDO] Determinar valor futuro
                                                        let valorFuturoCalculado;
                                                        if (facturasAnteriores.length > 0 && saldoDisponible <= 0) {
                                                          valorFuturoCalculado = 0;
                                                          saldoDisponible = 0;
                                                        } else {
                                                          valorFuturoCalculado = selectedFactura.saldoDisponibleInfo;    ;
                                                        }
                                                  
                                                        // [MANTENIDO] Saldo disponible anterior
                                                        const saldoDisponibleAnterior = facturasAnteriores.find(
                                                          (f) => f.billId === selectedFactura.billId
                                                        )?.saldoDisponible || 0;
                                                        const saldoDisponibleA = saldoDisponibleAnterior;
                                            
                                                  
                                                        // [MANTENIDO] Cálculo de valores presentes
                                                        const presentValueInvestor = factura.operationDays > 0 && factura.valorFuturo > 0
                                                          ? Math.round(PV(factura.investorTax / 100, factura.operationDays / 365, 0, factura.valorFuturo, 0) * -1)
                                                          : selectedFactura?.presentValueInvestor;
                                                  
                                                        const presentValueSF = factura.operationDays > 0 && factura.valorFuturo > 0
                                                          ? Math.round(PV(values.discountTax / 100, factura.operationDays / 365, 0, factura.valorFuturo, 0) * -1)
                                                          : selectedFactura.presentValueInvestor;
                                                  
                                                        // [MANTENIDO] Cálculo de comisiones
                                                        const comisionSF = presentValueInvestor && presentValueSF
                                                          ? presentValueInvestor - presentValueSF
                                                          : 0;
                                                  
                                                        const investorProfit = presentValueInvestor ?? selectedFactura.saldoDisponibleInfo

                                                          ? presentValueInvestor - selectedFactura.saldoDisponibleInfo
                                                          : 0;
                                                  
                                                        // [MANTENIDO] Cálculo de valor nominal
                                                        let valorNominalFactura;
                                                        if (facturasAnteriores.length > 0 && saldoDisponible <= 0) {
                                                          valorNominalFactura = 0;
                                                        } else {
                                                          valorNominalFactura = selectedFactura.saldoDisponibleInfo* Math.round((selectedFactura.saldoDisponibleInfo * 100) / selectedFactura.saldoDisponibleInfo) / 100;
                                                        }
                                                        
                                                        // [SOLUCIÓN] Cálculo del monto disponible CONSISTENTE entre facturas con mismo inversionista
                                                        let montoDisponibleFinal = 0;


                                                        if (factura.idCuentaInversionista) {
                                                      
                                                          // 2. Filtrar facturas con mismo inversionista (incluyendo la actual modificada)
                                                          const facturasMismoInversionista = values?.facturas.filter(
                                                            f => f.idCuentaInversionista === factura.idCuentaInversionista
                                                          );
                                                          
                                                          
                                                         
                                                                        if( facturasMismoInversionista.length> 1) { // 3. Calcular total de presentValueInvestor
                                                                          const totalPresentValue = facturasMismoInversionista.reduce((sum, f) => {
                                                                            const pv = f.presentValueInvestor ;
                                                                           
                                                                            return sum + pv;
                                                                          }, 0);
                                                                          
                                                                          
                                                                          const totalGm = facturasMismoInversionista.reduce((sum, f) => {
                                                                            return sum + (f.gastoMantenimiento);
                                                                          }, 0);
                                                                         
                                                                          // 4. Calcular monto disponible común
                                                                          montoDisponibleFinal = 
                                                                          factura.montoDisponibleInfo  - totalPresentValue - totalGm-presentValueInvestor
                                                                          
                                                                          
                                                                          
                                                                          // 5. Actualizar TODAS las facturas con mismo inversionista
                                                              
                                                                          values.facturas.forEach((f, i) => {
                                                                            if (f.idCuentaInversionista === factura.idCuentaInversionista) {
                                                                              setFieldValue(`facturas[${i}].montoDisponibleCuenta`, montoDisponibleFinal);
                                                                              
                                                                            }
                                                                          });
                                                                      
                                                                          setFieldValue(`facturas[${index}]`, {
                                                                            is_creada:true,
                                                                            billCode: selectedFactura.billId,
                                                                            billId: selectedFactura.billId,
                                                                            idCuentaInversionista: factura.idCuentaInversionista,
                                                                            factura: newValue.id|| newValue,
                                                                            fechaEmision: selectedFactura.fechaEmision||selectedFactura.dateBill,
                                                                            probableDate: selectedFactura.probableDate,
                                                                            amount: selectedFactura.saldoDisponibleInfo,
                                                                            payedAmount: selectedFactura.saldoDisponibleInfo,
                                                                            numbercuentaInversionista: factura.numbercuentaInversionista,
                                                                            cuentaInversionista: factura.cuentaInversionista,
                                                                            nombreInversionista: factura.nombreInversionista,
                                                                            investorBroker: factura.investorBroker,
                                                                            investorBrokerName: factura.investorBrokerName,
                                                                            saldoDisponible: selectedFactura.saldoDisponibleInfo,
                                                                            saldoDisponibleInfo: selectedFactura.saldoDisponibleInfo,
                                                                            montoDisponibleCuenta:montoDisponibleFinal,
                                                                            fraccion: fraccion,
                                                                            fechaFin: factura.fechaFin,
                                                                            valorNominal: valorNominalFactura,
                                                                            porcentajeDescuento: Math.round((selectedFactura.saldoDisponibleInfo * 100) / selectedFactura.saldoDisponibleInfo) || 0,
                                                                            expirationDate: selectedFactura.expirationDate,
                                                                            valorFuturo: valorFuturoCalculado,
                                                                            presentValueInvestor:valorFuturoCalculado,
                                                                            presentValueSF:valorFuturoCalculado|| 0,
                                                                            comisionSF,
                                                                            investorProfit: investorProfit,
                                                                            integrationCode: selectedFactura?.integrationCode ? selectedFactura?.integrationCode : "",
                                                                            isReBuy: selectedFactura?.reBuyAvailable ?? 0,
                                                                            gastoMantenimiento: 0,
                                                                            operationDays: 0,
                                                                            investorTax: values.investorTax,
                                                                            montoDisponibleInfo: factura.montoDisponibleInfo
                                                                          })}
                                                                          
                                                                          
                                                                          else{ 
                                                                            // Caso sin inversionista: cálculo individual
                                                                            const montoDisponibleFinal = 
                                                                              factura.montoDisponibleInfo - presentValueInvestor
                                                                              // [MANTENIDO] Asignación final de valores
                                                                          setFieldValue(`facturas[${index}]`, {
                                                                            is_creada:true,
                                                                            billCode: selectedFactura.billId,
                                                                            
                                                                            billId: selectedFactura.billId,
                                                                            idCuentaInversionista: factura.idCuentaInversionista,
                                                                            factura: newValue.id || newValue,
                                                                            fechaEmision: selectedFactura.dateBill,
                                                                            probableDate: selectedFactura.probableDate,
                                                                            amount: selectedFactura.saldoDisponibleInfo,
                                                                            payedAmount: selectedFactura.saldoDisponibleInfo,
                                                                            numbercuentaInversionista: factura.numbercuentaInversionista,
                                                                            cuentaInversionista: factura.cuentaInversionista,
                                                                            nombreInversionista: factura.nombreInversionista,
                                                                            investorBroker: factura.investorBroker,
                                                                            investorBrokerName: factura.investorBrokerName,
                                                                            saldoDisponible: saldoDisponibleA,
                                                                            saldoDisponibleInfo: selectedFactura.saldoDisponibleInfo,
                                                                            montoDisponibleCuenta:montoDisponibleFinal, // Usamos el valor calculado
                                                                            fraccion: fraccion,
                                                                            fechaFin: factura.fechaFin,
                                                                            valorNominal: valorNominalFactura,
                                                                            porcentajeDescuento: Math.round((selectedFactura.saldoDisponibleInfo * 100) / selectedFactura.saldoDisponibleInfo)|| 0,
                                                                            expirationDate: selectedFactura.expirationDate,
                                                                            valorFuturo: valorFuturoCalculado,
                                                                            presentValueInvestor:valorFuturoCalculado,
                                                                            presentValueSF:valorFuturoCalculado|| 0,
                                                                            comisionSF,
                                                                            investorProfit: investorProfit,
                                                                            integrationCode: selectedFactura?.integrationCode ? selectedFactura?.integrationCode : "",
                                                                            isReBuy: selectedFactura?.reBuyAvailable ?? 0,
                                                                            gastoMantenimiento: 0,
                                                                            operationDays: 0,
                                                                            investorTax: values.investorTax,
                                                                            montoDisponibleInfo: factura.montoDisponibleInfo
                                                                          });
                                                                          }
                                                                    
                                                                        
                                                                    
                                                                       
                                                         } else {
                                                        
                                                          // Caso sin inversionista: cálculo individual
                                                          const montoDisponibleFinal = 
                                                            factura.montoDisponibleInfo - presentValueInvestor
                                                        
                                                            // [MANTENIDO] Asignación final de valores
                                                        setFieldValue(`facturas[${index}]`, {
                                                          is_creada:true,
                                                          billCode: selectedFactura.billId,
                                                          billId: selectedFactura.billId,
                                                          idCuentaInversionista: factura.idCuentaInversionista,
                                                          factura: newValue.id || newValue,
                                                          fechaEmision: selectedFactura.fechaEmision,
                                                          probableDate: selectedFactura.probableDate,
                                                          amount: selectedFactura.saldoDisponibleInfo,
                                                          payedAmount: selectedFactura.saldoDisponibleInfo,
                                                          numbercuentaInversionista: factura.numbercuentaInversionista,
                                                          cuentaInversionista: factura.cuentaInversionista,
                                                          nombreInversionista: factura.nombreInversionista,
                                                          investorBroker: factura.investorBroker,
                                                          investorBrokerName: factura.investorBrokerName,
                                                          saldoDisponible:saldoDisponibleA,
                                                          saldoDisponibleInfo:  selectedFactura.saldoDisponibleInfo,
                                                          montoDisponibleCuenta:0, // Usamos el valor calculado
                                                          fraccion: fraccion,
                                                          fechaFin: factura.fechaFin,
                                                          valorNominal: valorNominalFactura,
                                                          porcentajeDescuento: Math.round((selectedFactura.saldoDisponibleInfo * 100) / selectedFactura.saldoDisponibleInfo)|| 0,
                                                          expirationDate: selectedFactura.expirationDate,
                                                          valorFuturo: valorFuturoCalculado,
                                                          presentValueInvestor:valorFuturoCalculado,
                                                          presentValueSF:valorFuturoCalculado|| 0,
                                                          comisionSF,
                                                          investorProfit: investorProfit,
                                                          integrationCode: selectedFactura?.integrationCode ? selectedFactura?.integrationCode : "",
                                                          isReBuy: selectedFactura?.reBuyAvailable ?? 0,
                                                          gastoMantenimiento: 0,
                                                          operationDays: 0,
                                                          investorTax: values.investorTax,
                                                          montoDisponibleInfo: selectedFactura?.montoDisponibleCuenta
                                                        });
                                                        }
                                                  
                                               
                                                       
                                                      
                                                    } catch (error) {
                                                      console.error("Error al cargar los datos:", error);
                                                    }
                                                  }}
                                                 
                                                  
                                                />
                                              </Box>
                                                
                                              ) : (
                                                <div><Autocomplete
                                                id="bill-name" // Para CSS/JS si es necesario
                                                data-testid="campo-factura"
                                                  options={(values?.takedBills || [])
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
                                         
                                                    if (!newValue) {
                                                      // 1. Obtener el billId de la factura que se está deseleccionando
                                                      const billIdDeseleccionada = factura.billId;
                                                      
                                                      // 2. Calcular el valorFuturo que se está liberando
                                                      const valorFuturoLiberado = factura.valorFuturo || 0;
                                                      if(values.facturas[index].is_creada===true){
                                                        return
                            
                                                      }else {
                                                        setFieldValue(`facturas[${index}].is_creada`,false)
                                                      }
                                                    
                                                    
                                                      // 4. Buscar todas las facturas que comparten el mismo billId (incluyendo la actual)
                                                      const facturasCompartidas = values.facturas.filter(
                                                        f => f.billId === billIdDeseleccionada
                                                      );
                                                    
                                                      // 5. Calcular el saldoDisponible original de la factura
                                                      const facturaOriginal = dataBills?.data.find(f => f.billId === billIdDeseleccionada);
                                                      const saldoOriginal = facturaOriginal?.currentBalance || 0;
                                                    
                                                      // 6. Calcular el valorFuturo total actual de todas las facturas compartidas (excluyendo la que se deselecciona)
                                                      const valorFuturoActual = facturasCompartidas
                                                        .filter((f, i) => i !== index) // Excluir la factura que se está deseleccionando
                                                        .reduce((sum, f) => sum + (f.valorFuturo), 0);
                                                    
                                                      // 7. Calcular el nuevo saldoDisponible global para esta factura
                                                      const nuevoSaldoGlobal = saldoOriginal - valorFuturoActual;
                                                    
                                                      // 8. Actualizar el saldoDisponible en TODAS las facturas compartidas
                                                      values.facturas.forEach((f, i) => {
                                                        if (f.billId === billIdDeseleccionada) {
                                                          setFieldValue(`facturas[${i}].saldoDisponible`, nuevoSaldoGlobal);
                                                          setFieldValue(`facturas[${i}].saldoDisponibleInfo`, saldoOriginal);
                                                        }
                                                      });
                                                    
                                                      // 9. Recalcular los montos disponibles para el inversionista (si aplica)
                                                      if (factura.idCuentaInversionista) {
                                                        const presentValueTotal = values.facturas
                                                          .filter(f => 
                                                            f.idCuentaInversionista === factura.idCuentaInversionista  
                                                            
                                                          )
                                                          .reduce((sum, f) => sum + f.presentValueInvestor , 0);
                                                          
                                                        const montoDisponibleActualizado = factura.montoDisponibleCuenta+ factura.presentValueInvestor+factura.gastoMantenimiento ;
                                                  
                                                    
                                                        values.facturas.forEach((f, i) => {
                                                   
                                                          if (f.idCuentaInversionista=== factura.idCuentaInversionista) {
                                                           
                                                            setFieldValue(`facturas[${i}].montoDisponibleCuenta`, 
                                                              montoDisponibleActualizado
                                                            );
                                                            
                                                          }
                                                        
                                                        });
  
                                                        setFieldValue(`facturas[${index}].montoDisponibleCuenta`, 
                                                          montoDisponibleActualizado
                                                      );
                                                      }
                                                      setFieldValue(`facturas[${index}].saldoDisponible`, 
                                                        0
                                                    );
  
                                                      // 3. Limpiar los valores de esta factura (manteniendo los datos del inversionista)
                                                      setFieldValue(`facturas[${index}]`, {
                                                        billId: '',
                                                        factura: '',
                                                        fechaEmision: '',
                                                        valorNominal: 0,
                                                        saldoDisponible: 0,
                                                        valorFuturo: 0,
                                                        amount: 0,
                                                        payedAmount: 0,
                                                        fraccion: 1,
                                                        porcentajeDescuento: 0,
                                                        nombrePagador: '',
                                                        presentValueInvestor: 0,
                                                        presentValueSF: 0,
                                                        investorProfit: 0,
                                                        comisionSF: 0,
                                                        fechaFin:factura.fechaFin,
                                                        idCuentaInversionista:factura.idCuentaInversionista,
                                                        numbercuentaInversionista: factura.numbercuentaInversionista,
                                                        cuentaInversionista: factura.cuentaInversionista,
                                                        nombreInversionista: factura.nombreInversionista,
                                                        investorBroker: factura.investorBroker,
                                                        investorBrokerName: factura.investorBrokerName,
                                                        montoDisponibleCuenta:factura.montoDisponibleCuenta+factura.presentValueInvestor+factura.gastoMantenimiento,
                                                        montoDisponibleInfo: factura.montoDisponibleInfo,
                                                        gastoMantenimiento: 0,
                                                        operationDays: 0,
                                                        expirationDate: "",
                                                      });
                                                      return;
  
                                                      
                                                    }
                                            
                                                  
                                                    const selectedFactura = dataBills?.data.find(f => f.billId === newValue.value);
                                                    if (!selectedFactura) return;
                                      
  
                                                    function encontrarFacturasDuplicadas(facturas, billId, inversionistaId) {
                                                      // Validaciones iniciales
                                                      if (!Array.isArray(facturas)) return [];
                                                      if (!billId || !inversionistaId) return [];
                                                      
                                                      return facturas.filter(factura => {
                                                        // Verificar que la factura tenga los campos necesarios
                                                        if (!factura.billId || !factura.nombreInversionista) return false;
                                                        
                                                        // Comparar billId con la factura actual
                                                        const mismoBillId = factura.factura=== billId;
                                                      
                                                        
                                                        // Comparar inversionista con el seleccionado
                                                        const mismoInversionista = factura.nombreInversionista === inversionistaId;
                                                        
                                                        return mismoBillId && mismoInversionista;
                                                      });
                                                    }
                                                  
                                                    const inversionistaSeleccionado = factura.nombreInversionista// ID del inversionista seleccionado
                                                    
                                                    const facturasDuplicadas = encontrarFacturasDuplicadas(
                                                      values.facturas, 
                                                      newValue.id, // la factura que estás procesando actualmente
                                                      inversionistaSeleccionado
                                                    );
  
                                                    
                                                    if(facturasDuplicadas?.length>=1 ){
  
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
                                                        position: "top-right",
                                                        autoClose: 5000,
                                                        hideProgressBar: false,
                                                        closeOnClick: true,
                                                        pauseOnHover: true,
                                                        draggable: true
                                                      });
                                                
                                                      
                                                      return;
  
  
                                                    }
                                                    
                                                  
                                                    try {
                                                      
                                                        if (values.integrationCode != selectedFactura?.integrationCode && values.integrationCode != "") {
                                                       toast(<div style={{ display: 'flex', alignItems: 'center' }}>
                                                        <ErrorIcon style={{ marginRight: '10px', color: '#d32f2f' }} />
                                                        <span>El código de integración debe coincidir con el de la factura previa</span>
                                                      </div>);
                                                        setFieldValue(`facturas[${index}].factura`, null);
                                                      } else {
  
                                                        const facturaActual2 = values?.facturas[index];
                                                        const billIdAnterior = facturaActual2?.billId;
                                                        const valorFuturoAnterior = facturaActual2?.valorFuturo || 0;
                                                        const nombreInversionistaAnterior = facturaActual2?.nombreInversionista;
                                                      
                                                        if(billIdAnterior  && newValue.label!=billIdAnterior  ){
  
                                                         
  
                                                          // 1. Crear lista temporal que incluye la factura actual con sus nuevos valores
                                                          const facturasTemporales = values.facturas.map((f, i) => 
                                                            i === index ? {
                                                              ...f,
                                                              billId: factura.billId,
                                                              saldoDisponible: factura.saldoDisponible,
                                                              presentValueInvestor: presentValueInvestor,
                                                              montoDisponibleInfo: factura.montoDisponibleInfo
                                                            } : f
                                                          );
  
                                                          
                                                          
                                                        const presentValueInvestorFacturaAnterior=facturaActual2?.presentValueInvestor
                                                        const montoDisponibleFacturaAnterior=facturaActual2?.montoDisponibleCuenta
                                                        const saldoDisponibleFacturaAnterior=facturaActual2?.saldoDisponible

                                                        const saldoDisponibleNuevo= saldoDisponibleFacturaAnterior+valorFuturoAnterior   
                                                        const montoDisponibleNuevo =montoDisponibleFacturaAnterior+presentValueInvestorFacturaAnterior
  
                                                          // 3. Actualizar todas las facturas con el mismo billId (excepto la actual)
                                                    values.facturas.forEach((f, i) => {
                                                      if (f.billId === billIdAnterior && i !== index) {
                                                        // Actualizar saldo disponible
                                                        setFieldValue(`facturas[${i}].saldoDisponible`, saldoDisponibleNuevo);
                                                        
                                                        setFieldValue(`facturas[${i}].montoDisponibleCuenta`, montoDisponibleNuevo);
                                                        
                                                      }
                                                    });
  
  
                                                    setFieldValue(`facturas[${index}]`, {
                                                      billId: selectedFactura.billId,
                                                      idCuentaInversionista: factura.idCuentaInversionista,
                                                      factura: newValue.id,
                                                      fechaEmision: selectedFactura.dateBill,
                                                      probableDate: selectedFactura.expirationDate,
                                                      amount: selectedFactura.currentBalance,
                                                      payedAmount: selectedFactura.currentBalance,
                                                      numbercuentaInversionista: factura.numbercuentaInversionista,
                                                      cuentaInversionista: factura.cuentaInversionista,
                                                      nombreInversionista: factura.nombreInversionista,
                                                      investorBroker: factura.investorBroker,
                                                      investorBrokerName: factura.investorBrokerName,
                                                      saldoDisponible: saldoDisponibleA,
                                                      saldoDisponibleInfo: selectedFactura.currentBalance,
                                                      montoDisponibleCuenta:montoDisponibleFinal, // Usamos el valor calculado
                                                      fraccion: fraccion,
                                                      fechaFin: factura.fechaFin,
                                                      valorNominal: valorNominalFactura,
                                                      porcentajeDescuento: Math.round((selectedFactura.currentBalance * 100) / selectedFactura.currentBalance),
                                                      expirationDate: selectedFactura.expirationDate,
                                                      valorFuturo: valorFuturoCalculado,
                                                      presentValueInvestor:valorFuturoCalculado,
                                                      presentValueSF:valorFuturoCalculado|| 0,
                                                      comisionSF,
                                                      investorProfit: investorProfit,
                                                      integrationCode: selectedFactura?.integrationCode ? selectedFactura?.integrationCode : "",
                                                      isReBuy: selectedFactura?.reBuyAvailable ?? 0,
                                                      gastoMantenimiento: 0,
                                                      operationDays: 0,
                                                      investorTax: values.investorTax,
                                                      montoDisponibleInfo: factura.montoDisponibleInfo
                                                    });
                                                    
                                                          
                                                        } 
                                       
                                                        
                                                        const fractionBill = await cargarFraccionFactura(selectedFactura.id);
                                              
                                                        
                                                  
                                                        
                                                      
                                                  
                                                        // [MANTENIDO] Cálculo de fechas
                                                        const fechaOperacion = new Date(values?.opDate);
                                                        const expirationDate = new Date(parseISO(selectedFactura.expirationDate));
                                                  
                                                        let substractDays = 0;
                                                        if (isValid(fechaOperacion) && isValid(expirationDate)) {
                                                          substractDays = differenceInDays(expirationDate, fechaOperacion);
                                                       
                                                        } else {
                                                          console.error("Error: Una de las fechas no es válida.");
                                                        }
                                                  
                                                        // [MANTENIDO] Lógica de fracciones
                                                        const facturaActual = newValue.id;
                                                        let fraccion = fractionBill?.data?.fraction+ 1 || 1;
                                                        const facturasAnteriores = values.facturas.slice(0, index).filter((f) => f.factura === facturaActual);
                                                  
                                                        if (facturasAnteriores.length > 0) {
                                                          const fraccionMasAlta = Math.max(...facturasAnteriores.map((f) => f.fraccion || 1));
                                                          fraccion = fraccionMasAlta + 1;
                                                        }
                                                  
                                                        // [MANTENIDO] Cálculo de saldo disponible
                                                        let saldoDisponible = selectedFactura.currentBalance || 0;
                                                        const valorFuturoAnteriores = facturasAnteriores.reduce((sum, f) => sum + (f.valorFuturo || 0), selectedFactura.currentBalance);
                                                        saldoDisponible -= valorFuturoAnteriores;
                                                  
                                                        // [MANTENIDO] Determinar valor futuro
                                                        let valorFuturoCalculado;
                                                        if (facturasAnteriores.length > 0 && saldoDisponible <= 0) {
                                                          valorFuturoCalculado = 0;
                                                          saldoDisponible = 0;
                                                        } else {
                                                          valorFuturoCalculado = selectedFactura.currentBalance;
                                                        }
                                                  
                                                        // [MANTENIDO] Saldo disponible anterior
                                                        const saldoDisponibleAnterior = facturasAnteriores.find(
                                                          (f) => f.billId === selectedFactura.billId
                                                        )?.saldoDisponible || 0;
                                                        
                                                        const saldoDisponibleA = saldoDisponibleAnterior;
                                                  
                                                        // [MANTENIDO] Cálculo de valores presentes
                                                        const presentValueInvestor = factura.operationDays > 0 && factura.valorFuturo > 0
                                                          ? Math.round(PV(factura.investorTax / 100, factura.operationDays / 365, 0, factura.valorFuturo, 0) * -1)
                                                          : selectedFactura.currentBalance;
                                                  
                                                        const presentValueSF = factura.operationDays > 0 && factura.valorFuturo > 0
                                                          ? Math.round(PV(values.discountTax / 100, factura.operationDays / 365, 0, factura.valorFuturo, 0) * -1)
                                                          : selectedFactura.currentBalance;
                                                  
                                                        // [MANTENIDO] Cálculo de comisiones
                                                        const comisionSF = presentValueInvestor && presentValueSF
                                                          ? presentValueInvestor - presentValueSF
                                                          : 0;
                                                  
                                                        const investorProfit = presentValueInvestor ?? selectedFactura.currentBalance
                                                          ? presentValueInvestor - selectedFactura.currentBalance : 0;
                                                  
                                                        // [MANTENIDO] Cálculo de valor nominal
                                                        let valorNominalFactura;
                                                        if (facturasAnteriores.length > 0 && saldoDisponible <= 0) {
                                                          valorNominalFactura = 0;
                                                        } else {
                                                          valorNominalFactura = selectedFactura.currentBalance * Math.round((selectedFactura.currentBalance * 100) / selectedFactura.currentBalance) / 100;
                                                        }
                                                        
                                                        // [SOLUCIÓN] Cálculo del monto disponible CONSISTENTE entre facturas con mismo inversionista
                                                        let montoDisponibleFinal = 0;
                                                        if (factura.idCuentaInversionista) {
                                                      
                                                          // 2. Filtrar facturas con mismo inversionista (incluyendo la actual modificada)
                                                          const facturasMismoInversionista = values?.facturas.filter(
                                                            f => f.idCuentaInversionista === factura.idCuentaInversionista
                                                          );
                                                          
                                                          
                                                          if( facturasMismoInversionista.length> 1) { // 3. Calcular total de presentValueInvestor
                                                            const totalPresentValue = facturasMismoInversionista.reduce((sum, f) => {
                                                              const pv = f.presentValueInvestor ;
                                                             
                                                              return sum + pv;
                                                            }, 0);
                                                            
                                                           
                                                            const totalGm = facturasMismoInversionista.reduce((sum, f) => {
                                                              return sum + (f.gastoMantenimiento);
                                                            }, 0);
                                                           
                                                            // 4. Calcular monto disponible común
                                                            montoDisponibleFinal = 
                                                            factura.montoDisponibleInfo  - totalPresentValue - totalGm-presentValueInvestor
                                                            
                                                            
                                                            
                                                            // 5. Actualizar TODAS las facturas con mismo inversionista
                                                         
                                                            values.facturas.forEach((f, i) => {
                                                              if (f.idCuentaInversionista === factura.idCuentaInversionista) {
                                                                setFieldValue(`facturas[${i}].montoDisponibleCuenta`, montoDisponibleFinal);
                                                                
                                                              }
                                                            });
                                                            
                                                            setFieldValue(`facturas[${index}]`, {
                                                              billId: selectedFactura.billId,
                                                              idCuentaInversionista: factura.idCuentaInversionista,
                                                              factura: newValue.id,
                                                              fechaEmision: selectedFactura.dateBill,
                                                              probableDate: selectedFactura.expirationDate,
                                                              amount: selectedFactura.currentBalance,
                                                              payedAmount: selectedFactura.currentBalance,
                                                              numbercuentaInversionista: factura.numbercuentaInversionista,
                                                              cuentaInversionista: factura.cuentaInversionista,
                                                              nombreInversionista: factura.nombreInversionista,
                                                              investorBroker: factura.investorBroker,
                                                              investorBrokerName: factura.investorBrokerName,
                                                              saldoDisponible: saldoDisponibleA,
                                                              saldoDisponibleInfo: selectedFactura.currentBalance,
                                                              montoDisponibleCuenta:montoDisponibleFinal,
                                                              fraccion: fraccion,
                                                              fechaFin: factura.fechaFin,
                                                              valorNominal: valorNominalFactura,
                                                              porcentajeDescuento: Math.round((selectedFactura.currentBalance * 100) / selectedFactura.currentBalance),
                                                              expirationDate: selectedFactura.expirationDate,
                                                              valorFuturo: valorFuturoCalculado,
                                                              presentValueInvestor:valorFuturoCalculado,
                                                              presentValueSF:valorFuturoCalculado|| 0,
                                                              comisionSF,
                                                              investorProfit: investorProfit,
                                                              integrationCode: selectedFactura?.integrationCode ? selectedFactura?.integrationCode : "",
                                                              isReBuy: selectedFactura?.reBuyAvailable ?? 0,
                                                              gastoMantenimiento: 0,
                                                              operationDays: 0,
                                                              investorTax: values.investorTax,
                                                              montoDisponibleInfo: factura.montoDisponibleInfo
                                                            })}else{
                                                              // Caso sin inversionista: cálculo individual
                                                              const montoDisponibleFinal = 
                                                                factura.montoDisponibleInfo - presentValueInvestor
                                                                // [MANTENIDO] Asignación final de valores
                                                            setFieldValue(`facturas[${index}]`, {
                                                              billId: selectedFactura.billId,
                                                              idCuentaInversionista: factura.idCuentaInversionista,
                                                              factura: newValue.id,
                                                              fechaEmision: selectedFactura.dateBill,
                                                              probableDate: selectedFactura.expirationDate,
                                                              amount: selectedFactura.currentBalance,
                                                              payedAmount: selectedFactura.currentBalance,
                                                              numbercuentaInversionista: factura.numbercuentaInversionista,
                                                              cuentaInversionista: factura.cuentaInversionista,
                                                              nombreInversionista: factura.nombreInversionista,
                                                              investorBroker: factura.investorBroker,
                                                              investorBrokerName: factura.investorBrokerName,
                                                              saldoDisponible: saldoDisponibleA,
                                                              saldoDisponibleInfo: selectedFactura.currentBalance,
                                                              montoDisponibleCuenta:montoDisponibleFinal, // Usamos el valor calculado
                                                              fraccion: fraccion,
                                                              fechaFin: factura.fechaFin,
                                                              valorNominal: valorNominalFactura,
                                                              porcentajeDescuento: Math.round((selectedFactura.currentBalance * 100) / selectedFactura.currentBalance),
                                                              expirationDate: selectedFactura.expirationDate,
                                                              valorFuturo: valorFuturoCalculado,
                                                              presentValueInvestor:valorFuturoCalculado,
                                                              presentValueSF:valorFuturoCalculado|| 0,
                                                              comisionSF,
                                                              investorProfit: investorProfit,
                                                              integrationCode: selectedFactura?.integrationCode ? selectedFactura?.integrationCode : "",
                                                              isReBuy: selectedFactura?.reBuyAvailable ?? 0,
                                                              gastoMantenimiento: 0,
                                                              operationDays: 0,
                                                              investorTax: values.investorTax,
                                                              montoDisponibleInfo: factura.montoDisponibleInfo
                                                            });
                                                            }
                                                      
                                                          
                                                      
                                                       
                                                         
                                                          
                                                        } else {
                                                         
                                                          // Caso sin inversionista: cálculo individual
                                                          const montoDisponibleFinal = 
                                                            factura.montoDisponibleInfo - presentValueInvestor
                                                            // [MANTENIDO] Asignación final de valores
                                                        setFieldValue(`facturas[${index}]`, {
                                                          billId: selectedFactura.billId,
                                                          idCuentaInversionista: factura.idCuentaInversionista,
                                                          factura: newValue.id,
                                                          fechaEmision: selectedFactura.dateBill,
                                                          probableDate: selectedFactura.expirationDate,
                                                          amount: selectedFactura.currentBalance,
                                                          payedAmount: selectedFactura.currentBalance,
                                                          numbercuentaInversionista: factura.numbercuentaInversionista,
                                                          cuentaInversionista: factura.cuentaInversionista,
                                                          nombreInversionista: factura.nombreInversionista,
                                                          investorBroker: factura.investorBroker,
                                                          investorBrokerName: factura.investorBrokerName,
                                                          saldoDisponible: saldoDisponibleA,
                                                          saldoDisponibleInfo: selectedFactura.currentBalance,
                                                          montoDisponibleCuenta:montoDisponibleFinal, // Usamos el valor calculado
                                                          fraccion: fraccion,
                                                          fechaFin: factura.fechaFin,
                                                          valorNominal: valorNominalFactura,
                                                          porcentajeDescuento: Math.round((selectedFactura.currentBalance * 100) / selectedFactura.currentBalance),
                                                          expirationDate: selectedFactura.expirationDate,
                                                          valorFuturo: valorFuturoCalculado,
                                                          presentValueInvestor:valorFuturoCalculado,
                                                          presentValueSF:valorFuturoCalculado|| 0,
                                                          comisionSF,
                                                          investorProfit: investorProfit,
                                                          integrationCode: selectedFactura?.integrationCode ? selectedFactura?.integrationCode : "",
                                                          isReBuy: selectedFactura?.reBuyAvailable ?? 0,
                                                          gastoMantenimiento: 0,
                                                          operationDays: 0,
                                                          investorTax: values.investorTax,
                                                          montoDisponibleInfo: factura.montoDisponibleInfo
                                                        });
                                                        }
                                                  
                                                      
                                                  
                                                       
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
                                                      name="billId"
                                                      error={touched.facturas?.[index]?.billId && Boolean(errors.facturas?.[index]?.billId)}
                                                      helperText={
                                                        ` ${factura.isReBuy ? "Disponible Recompra" : "No disponible Recompra"}`
                                                      }
                                                    />
                                                  )}
                                                  
                                                /></div>
                                              )}
                                            
                                           
                                         </Grid>
                                              
                                         <Box
                                            sx={{
                                              color: (orchestDisabled.find(item => item.indice === index))?.status ? "#ffffff" : "#5EA3A3",
                                              backgroundColor: (orchestDisabled.find(item => item.indice === index))?.status ? "#5EA3A3" : "transparent",
                                              border: "1.4px solid #5EA3A3",
                                              width: "25px",
                                              display: "flex",
                                              alignItems: "center",
                                              justifyContent: "center",
                                              borderRadius: "5px",
                                              
                                              height: "25px",
                                              marginTop: "40px",
                                              marginLeft:"20px",
                                              cursor: (orchestDisabled.find(item => item.indice === index))?.status || isSelectedPayer ? "default" : "pointer",
                                              '&:hover': {
                                                backgroundColor: !(orchestDisabled.find(item => item.indice === index)?.status) && !isSelectedPayer ? "#f0f0f0" : undefined,
                                              }
                                            }}
                                            onClick={() => {
                                              if (!isSelectedPayer) {
                                                toast(<div style={{ display: 'flex', alignItems: 'center' }}>
                                                  <ErrorIcon style={{ marginRight: '10px', color: '#d32f2f' }} />
                                                  <span>Debe seleccionar un pagador antes de crear facturas</span>
                                                </div>);
                                              } else {
                                                const isCurrentlyActive = (orchestDisabled.find(item => item.indice === index))?.status;
                                                
                                                // Cambiar el estado contrario al actual
                                                setFieldValue(`facturas[${index}].is_creada`, !isCurrentlyActive);
                                                
                                                if (!isCurrentlyActive) {
                                                  setIsCreatingBill(true);
                                                } else {
                                                  // Verificar si hay otras facturas creadas para decidir si cambiar isCreatingBill
                                                  const otrasCreadas = orchestDisabled.some(item => item.indice !== index && item.status);
                                                  if (!otrasCreadas) {
                                                    setIsCreatingBill(false);
                                                  }
                                                }
                                                
                                                setOrchestDisabled(prev => 
                                                  prev.map(item => 
                                                    item.indice === index 
                                                      ? { ...item, status: !item.status } 
                                                      : item
                                                  )
                                                );
                                              }
                                            }}
                                          >
                                            {(orchestDisabled.find(item => item.indice === index))?.status ? (
                                              <i 
                                                className="fa-solid fa-xmark" 
                                                style={{ opacity: isSelectedPayer ? 0.5 : 1, pointerEvents: isSelectedPayer ? "none" : "auto" }}
                                              ></i>
                                            ) : (
                                              <i 
                                                className="fa-solid fa-plus" 
                                                style={{ opacity: isSelectedPayer ? 0.5 : 1, pointerEvents: isSelectedPayer ? "none" : "auto" }}
                                              ></i>
                                            )}
                                          </Box>
                                            {/* Fracción */}
                                            <Grid item xs={12} md={0.7}>
                                                <TextField
                                                id="Fraction-name" // Para CSS/JS si es necesario
                                                 data-testid="campo-fraccion"
                                                  label="Fracción"
                                                  fullWidth
                                                  type="number"
                                                  name="fraccion"
                                                  value={factura.fraccion  ?? 1} // Valor por defecto si no existe fracción
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
                                                    
                                                  }}
                                                  onBlur={handleBlur} // Si tienes alguna lógica de validación, puedes usar onBlur
                                                  helperText={touched.facturas?.[index]?.fraccion && errors.facturas?.[index]?.fraccion} // Ayuda para mostrar errores
                                                  error={touched.facturas?.[index]?.fraccion && Boolean(errors.facturas?.[index]?.fraccion)} // Mostrar errores si es necesario
                                                />
                                              </Grid>

                                              {/* Saldo Disponible de la factura */}
                                              <Grid item xs={12} md={3}>
                                              <TextField
                                                      id={`currentBalance-${index}`}
                                                      data-testid="campo-saldoDisponibleFactura"
                                                      label="Saldo Disponible en factura"
                                                      fullWidth
                                                      type='text'
                                                      value={
                                                        orchestDisabled.find(item => item.indice === index)?.status 
                                                          ? values.facturas[index]?.saldoDisponible || ''
                                                          : formatNumberWithThousandsSeparator(values.facturas[index]?.saldoDisponible || 0)
                                                      }
                                                      disabled={!orchestDisabled.find(item => item.indice === index)?.status}
                                                      onChange={(e) => {
                                                        const rawValue = e.target.value.replace(/[^\d]/g, "");
                                                        const cleanValue = rawValue === 0 ? '' : rawValue.replace(/^0+/, '');
                                                        const numericValue = parseFloat(cleanValue) || 0;
                                                      
                                                        // Primero actualizamos el valor actual como lo hacías antes
                                                        if (orchestDisabled.find(item => item.indice === index)?.status) {
                                                          setFieldValue(`facturas[${index}].saldoDisponible`, cleanValue);
                                                          setFieldValue(`facturas[${index}].saldoDisponibleInfo`, numericValue);
                                                        } else {
                                                          setFieldValue(`facturas[${index}].saldoDisponible`, numericValue);
                                                        }
                                                      
                                                        // Lógica adicional para reiniciar valores en facturas con mismo billId
                                                        const currentBillId = values.facturas[index]?.billId;
                                                        if (currentBillId) {
                                                          values.facturas.forEach((factura, i) => {
                                                            if (i !== index && factura.billId === currentBillId) {
                                                              setFieldValue(`facturas[${i}].saldoDisponible`, cleanValue);
                                                              setFieldValue(`facturas[${i}].saldoDisponibleInfo`, numericValue);
                                                              setFieldValue(`facturas[${i}].valorFuturo`, 0);
                                                              setFieldValue(`facturas[${i}].presentValueInvestor`, 0);
                                                              setFieldValue(`facturas[${i}].presentValueSF`, 0);
                                                            }
                                                          });
                                                        }
                                                      }}
                                                      onBlur={(e) => {
                                                        const rawValue = e.target.value.replace(/[^\d]/g, "");
                                                        const numericValue = parseFloat(rawValue) || 0;
                                                        
                                                        // Asegurar que al salir siempre tenga un valor numérico válido
                                                        setFieldValue(`facturas[${index}].saldoDisponible`, numericValue);
                                                        
                                                        if (orchestDisabled.find(item => item.indice === index)?.status) {
                                                          setFieldValue(`facturas[${index}].saldoDisponibleInfo`, numericValue);
                                                        }
                                                        
                                                        // Si el campo quedó vacío, restaurar el 0
                                                        if (e.target.value === '') {
                                                          setFieldValue(`facturas[${index}].saldoDisponible`, 0);
                                                          if (orchestDisabled.find(item => item.indice === index)?.status) {
                                                            setFieldValue(`facturas[${index}].saldoDisponibleInfo`, 0);
                                                          }
                                                        }
                                                      }}
                                                      inputProps={{
                                                        min: 0,
                                                        type: orchestDisabled.find(item => item.indice === index)?.status ? 'number' : 'text',
                                                      }}
                                                      helperText={
                                                        `Saldo actual factura: ${formatNumberWithThousandsSeparator(
                                                          orchestDisabled.find(item => item.indice === index)?.status
                                                            ? values.facturas[index]?.saldoDisponibleInfo || 0
                                                            : factura.saldoDisponibleInfo || 0
                                                        )}`
                                                      }
                                                    />
                                                </Grid>
                                              {/* Fecha Probable*/}
                                              <Grid item xs={12} md={1.5}>
                                              <DatePicker
                                                id="probDate-name"
                                                data-testid="campo-fechaProbable"
                                                label="Fecha probable"
                                                value={factura.probableDate}
                                                onChange={(newValue) => setFieldValue(`facturas[${index}].probableDate`, newValue)}
                                                inputFormat="dd/MM/yyyy" // Formato de visualización
                                                mask="__/__/____" // Máscara de entrada (guiones bajos son placeholders)
                                                renderInput={(params) => (
                                                  <TextField 
                                                    {...params} 
                                                    fullWidth
                                                    onKeyDown={(e) => e.stopPropagation()} // Evita conflicto con atajos de teclado
                                                  />
                                                )}
                                                disableMaskedInput={false} // Habilita la máscara de entrada
                                                allowSameDateSelection // Permite seleccionar la fecha actual
                                                openTo="day" // Comienza la selección por el día (opcional)
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
                                              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                              <div style={{ flex: 1 }}> {/* Este div ocupa el espacio restante */}
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
                                                      investorProfit:  factura.investorProfit,
                                                      comisionSF:  factura.comisionSF  || 0,
                                                      numbercuentaInversionista: '',
                                                      cuentaInversionista:[],
                                                      nombreInversionista: '',
                                                      investorBroker: '',
                                                      investorBrokerName: '',
                                                      montoDisponibleCuenta: 0, // Restablecer al máximo
                                                      montoDisponibleInfo: 0,
                                                      gastoMantenimiento: factura.gastoMantenimiento,
                                                      operationDays: factura.operationDays,
                                                      tasaInversionistaPR: 0,
                                                    });

                                                  

                                            }
                                                  if (newValue) {
                                                  
                                                
                                                    // Cargar cuentas y broker del inversionista seleccionado
                                                    const cuentas = await cargarCuentas(newValue?.data.id);
                                                    
                                                    setClientInvestor(newValue?.data.id)
                                                   

                                                    const tasaDescuento = await cargarTasaDescuento(newValue?.data.id);
                                                    console.log(tasaDescuento)
                                                    const discountRate = parseFloat(tasaDescuento?.data?.discount_rate) || 0; // Convierte a número o usa 0 si es inválido
                                                      // setFieldValue(`investorTax`, (discountRate * 0.58).toFixed(2));
                                                    
                                                    setFieldValue(`discountTax`, discountRate);
                                                
                                                    // Verificar si tasaDescuento es undefined
                                                    //if (!tasaDescuento) {
                                                      // Mostrar el mensaje de error usando Toast
                                                    //  Toast("Disculpe, el cliente seleccionado no tiene perfil de riesgo configurado. Por favor, agrege el perfil en el módulo de clientes", "error");
                                                  //    return; // Detener la ejecución si tasaDescuento es undefined
                                                  //  }
                                                
                                                
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
                                                          
                                                          
                                                          setFieldValue(`facturas[${index}].cuentaInversionista`, cuentas?.data || []);
                                                          setFieldValue(`facturas[${index}].nombreInversionista`, newValue?.data.id || "");
                                                            setFieldValue(`facturas[${index}].investorBroker`, brokerFromInvestor?.data.id || "");
                                                            setFieldValue( `facturas[${index}].tasaInversionistaPR`,tasaDescuento?.data?.discount_rate_investor
                                                              ||0)
                                                          setFieldValue( `facturas[${index}].tasaDescuentoPR`,tasaDescuento?.data?.discount_rate
                                                                ||0)
                                                          setFieldValue( `facturas[${index}].tasaDescuentoPR`,tasaDescuento?.data?.discount_rate  ||0)
                                                            setFieldValue(
                                                              `facturas[${index}].investorBrokerName`,
                                                              brokerFromInvestor?.data?.first_name && brokerFromInvestor?.data?.last_name
                                                                ? `${brokerFromInvestor.data.first_name} ${brokerFromInvestor.data.last_name}`
                                                                : brokerFromInvestor?.data?.social_reason || ""
                                                            );

                                                        }else if (facturasMismoBillId.length===1 ){
                                                          
                                                          setFieldValue(`facturas[${index}].cuentaInversionista`, cuentas?.data || []);
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
                                                        
                                                        setFieldValue(`facturas[${index}].cuentaInversionista`, cuentas?.data || []);
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
                                                      
                                                      setFieldValue(`facturas[${index}].cuentaInversionista`, cuentas?.data || []);
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
                                                    
                                                   
                                                      setFieldValue(`facturas[${index}].cuentaInversionista`, cuentas?.data || []);
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
 {/*  {clientInvestor && (
                                          <IconButton
                                            color="primary"
                                            onClick={() => {
                                              window.open(`${window.location.origin}/customers?modify=${clientInvestor}`, '_blank');
                                            }}
                                            style={{ 
                                              marginTop: '0px',
                                              height: '56px', // Para coincidir con la altura del TextField
                                              width: '56px'
                                            }}
                                          >
                                            <EditIcon />
                                          </IconButton>
                                        )}
 */}
                                             
                                          </div>
                                        </div>
                                        </Grid>
                                                                                  

                                             
                                              <Grid item xs={12} md={3}>

                                                
                                              <Autocomplete
                                                    id="investorAccountname" // Para CSS/JS si es necesario
                                                  data-testid="campo-investorAccount"
                                                  options={factura.cuentaInversionista || []}
                                                  getOptionLabel={(option) => option?.account_number || option?.number || option?.id || ''}
                                                  value={
                                                    (factura.cuentaInversionista || []).find(
                                                      account => account?.id === factura.idCuentaInversionista
                                                    ) || null
                                                  }
                                                  onChange={(event, newValue) => {
                                                    // 1. Actualizar los campos básicos de la cuenta
                                                    const accountId = newValue?.id || '';
                                                    const accountNumber = newValue?.account_number || newValue?.number || '';
                                                    const accountBalance = newValue?.balance || 0;




                                                    if (!newValue) {
                                                      if(values.facturas[index].is_creada===true){

                                                        console.log(values.facturas[index].is_creada)
                                                        return
                            
                                                      }else {
                                                        setFieldValue(`facturas[${index}].is_creada`,false)
                                                      }
                                                      // 1. Obtener el accountId de la factura que se está deseleccionando
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
                                                      billId: factura.billId,
                                                      factura: factura.factura,
                                                      fechaEmision: factura.fechaEmision,
                                                      valorNominal: factura.valorNominal,
                                                      saldoDisponible: factura.saldoDisponible,
                                                      saldoDisponibleInfo: factura.saldoDisponibleInfo,
                                                      valorFuturo: factura.valorFuturo,
                                                      amount: factura.amount,
                                                      payedAmount: factura.payedAmount,
                                                      fraccion: factura.fraccion,
                                                      porcentajeDescuento: factura.porcentajeDescuento,
                                                      nombrePagador: values.nombrePagador,
                                                      presentValueInvestor: factura.presentValueInvestor,
                                                      presentValueSF: factura.presentValueSF,
                                                      investorProfit: factura.investorProfit,
                                                      comisionSF: factura.comisionSF || 0,
                                                      numbercuentaInversionista: '',
                                                      cuentaInversionista: '',
                                                      nombreInversionista: factura.nombreInversionista,
                                                      investorBroker: factura.investorBroker,
                                                      investorBrokerName: factura.investorBrokerName,
                                                      montoDisponibleCuenta: -factura.presentValueInvestor - factura.gastoMantenimiento,
                                                      montoDisponibleInfo: 0,
                                                      gastoMantenimiento: factura.gastoMantenimiento,
                                                      operationDays: factura.operationDays,
                                                      idCuentaInversionista: '',
                                                      numbercuentaInversionista: '',
                                                      cuentaInversionista: factura.cuentaInversionista,
                                                    });
                                                  
                                                      return;
                                                    }
                                                    setFieldValue(`facturas[${index}].idCuentaInversionista`, accountId);
                                                    setFieldValue(`facturas[${index}].numbercuentaInversionista`, accountNumber);
                                                  
                                                    setFieldValue(`facturas[${index}].montoDisponibleInfo`, accountBalance);

                                                    // 2. Calcular el nuevo saldo disponible
                                                    const facturasMismoInversionista = values.facturas.filter(
                                                      f => f.idCuentaInversionista === accountId
                                                    );
                                                    
                                                   
                                                    facturasMismoInversionista.push(factura)
                                                    // Caso 1: Solo esta factura usa la cuenta
                                                    if (facturasMismoInversionista.length <= 1) {
                                                    
                                                      const pVI = parseFloat(factura.presentValueInvestor) || 0;
                                                      const gm = parseFloat(factura.gastoMantenimiento) || 0;
                                                      const nuevoSaldo = accountBalance - (pVI + gm);
                                                      setFieldValue(`facturas[${index}].montoDisponibleCuenta`, nuevoSaldo);
                                                    } 
                                                    // Caso 2: Múltiples facturas comparten la misma cuenta
                                                    else {
                                                     
                                                      
                                                      const totalPVIGM = facturasMismoInversionista.reduce((sum, f) => {
                                                        const pVI = parseFloat(f.presentValueInvestor)|| 0;
                                                        const gm = parseFloat(f.gastoMantenimiento) || 0;
                                                        return sum + (pVI + gm);
                                                      }, 0);

                                                      const nuevoSaldo = accountBalance - totalPVIGM;
                                                    
                                                      // Actualizar todas las facturas que comparten esta cuenta
                                                      values.facturas.forEach((f, i) => {
                                                        if (f.idCuentaInversionista === accountId) {
                                                          
                                                          setFieldValue(`facturas[${i}].montoDisponibleCuenta`, nuevoSaldo);
                                                          setFieldValue(`facturas[${index}].montoDisponibleCuenta`, nuevoSaldo);
                                                        }
                                                      });
                                                    }
                                                   
                                                  }}
                                                  renderInput={(params) => (
                                                    <TextField
                                                      {...params}
                                                      label="Cuenta Inversionista*"
                                                      fullWidth
                                                      variant="outlined"
                                                      error={touched.facturas?.[index]?.cuentaInversionista && 
                                                            Boolean(errors.facturas?.[index]?.cuentaInversionista)}
                                                      helperText={touched.facturas?.[index]?.cuentaInversionista && 
                                                                errors.facturas?.[index]?.cuentaInversionista}
                                                    />
                                                  )}
                                                  isOptionEqualToValue={(option, value) => option.id === value?.id}
                                                  noOptionsText="No hay cuentas disponibles"
                                                  disabled={!factura.cuentaInversionista || factura.cuentaInversionista.length === 0}
                                                />
                                                                                      </Grid>
                                              {/*Monto disponible en cuenta inversionista */}                                    
                                              <Grid item xs={12} md={3}>
                                                <TextField
                                                   id="investorBalancename" // Para CSS/JS si es necesario
                                                  data-testid="campo-investorBalance"
                                                  label="Monto de Inversionista"
                                                  fullWidth
                                                  value={formatCurrency(values.facturas[index]?.montoDisponibleCuenta || 0)}
                                                  disabled // Deshabilita la edición manual
                                                  helperText={
                                                    `Monto Disponible Inversionista: ${values.facturas[index]?.montoDisponibleInfo ? formatNumberWithThousandsSeparator(Math.floor(values.facturas[index]?.montoDisponibleInfo)) : 0}`
                                                  }
                                                />
                                              </Grid>
                                            
                                            {/* Valor Futuro */}
                                            <Grid item xs={12} md={3} style={{ position: 'relative' }}>
                                            <TextField
                                               id="amountname" // Para CSS/JS si es necesario
                                                  data-testid="campo-valorFuturo"
                                                label="Valor Futuro"
                                                fullWidth
                                                type="text" // Usamos tipo "text" para manejar el formato
                                                value={factura.valorFuturo ? formatNumberWithThousandsSeparator(factura.valorFuturo) : 0} // Usar 0 como valor predeterminado
                                                onChange={(e) => {
                                                  // Eliminar caracteres no numéricos para mantener el valor limpio
                                                  const rawValue = e.target.value.replace(/[^\d]/g, "");
                                                  const valorFuturoManual = parseFloat(rawValue) || 0;
  
                                                  if (valorFuturoManual > factura.saldoDisponibleInfo) {
                                                    valorFuturoManual =factura.saldoDisponibleInfo-1;
                                                  }
                                                
                                                  // Obtener el saldo disponible actual de la factura seleccionada
                                                  const saldoDisponibleActual = factura.saldoDisponible || 0;

                                                  // Calcular el saldo disponible total de la factura original
                                                  const saldoDisponibleTotal = dataBills?.data.find((f) => f.billId === factura.factura)?.currentBalance || 0;

                                                  // Calcular el valor futuro total de todas las instancias de la misma factura
                                                  const valorFuturoTotal = values.facturas
                                                    .filter((f) => f.factura === factura.factura)
                                                    .reduce((sum, f) => sum + (f.valorFuturo || 0), 0);

                                                

                                                  // Calcular la diferencia entre el nuevo valor futuro y el valor anterior
                                                  const diferenciaValorFuturo = valorFuturoManual - (factura.valorFuturo || 0);
                                               

                                                  // Calcular el valor nominal (valorFuturo * porcentajeDescuento)
                                                  const valorNominal = valorFuturoManual * (factura.porcentajeDescuento || 0)/100;

                                                  // Actualizar el valor futuro
                                                  setFieldValue(`facturas[${index}].valorFuturo`, valorFuturoManual);
                                                  setFieldValue(`facturas[${index}].valorFuturoManual`, true);

                                                  // Actualizar el valor nominal
                                                  setFieldValue(`facturas[${index}].valorNominal`, valorNominal);
                                                  setFieldValue(`facturas[${index}].payedAmount`, valorNominal);
                                                  // Actualizar el saldo disponible de la factura actual
                                                  const nuevoSaldoDisponible = saldoDisponibleActual - diferenciaValorFuturo || 0;
                                                  
                                                  setFieldValue(`facturas[${index}].saldoDisponible`, nuevoSaldoDisponible);
                                                
                                                  {/* // Actualizar el saldo disponible en todas las facturas con el mismo billId
                                                  values.facturas.forEach((f, i) => {
                                                    if (f.factura === factura.factura && i !== index) {
                                                      const saldoDisponiblePosterior = f.saldoDisponible || 0;
                                                      const nuevoSaldoDisponiblePosterior = saldoDisponiblePosterior - diferenciaValorFuturo;
                                                      setFieldValue(`facturas[${i}].saldoDisponible`, nuevoSaldoDisponiblePosterior, 0);
                                                    }
                                                  });*/}
                                                  
                                                 // Actualizar saldo disponible en facturas con mismo billId (versión para facturas creadas)
                                                    values.facturas.forEach((f, i) => {
                                                      // 1. Validar que sea una factura con el mismo billId pero diferente índice
                                                      if (f.billId === factura.billId && i !== index) {
                                                       
                                                        // 2. Calcular nuevo saldo con protección contra valores inválidos
                                                        const saldoActual = f.saldoDisponible || 0;
                                                        const diferencia = diferenciaValorFuturo || 0;
                                                        const nuevoSaldo = saldoActual - diferencia;
                                                     
                                                        // 3. Asegurar que el saldo no sea negativo
                                                        const saldoFinal =nuevoSaldo;
                                                        
                                                        // 4. Actualizar solo si hay cambio real
                                                        if (saldoActual !== saldoFinal) {
                                                          
                                                          
                                                          setFieldValue(`facturas[${i}].saldoDisponible`, saldoFinal);
                                                          
                                                         
                                                        }
                                                      }
                                                    });
                                                   
                                                    if (values.opDate) {
                                                  
                                                    const operationDays = factura.operationDays 
                                                    const presentValueInvestor = operationDays > 0 && valorNominal > 0
                                                    ? Math.round(PV(values.investorTax / 100,  operationDays / 365, 0, valorNominal, 0) * -1)
                                                    : valorFuturoManual;

                                                    const nuevoInvestorProfit =  valorNominal -presentValueInvestor;
                                                   setFieldValue(`facturas[${index}].investorProfit`, nuevoInvestorProfit);
                                                    // 2. Calcular el total acumulado de presentValueInvestor para el mismo inversionista
                                                    setFieldValue(`facturas[${index}].montoDisponibleCuenta`, factura.montoDisponibleInfo-presentValueInvestor, 0);
                                                    const presentValueInvesTotal = values.facturas
                                                    .filter((f, i) => 
                                                      f.idCuentaInversionista === factura.idCuentaInversionista && 
                                                      i !== index  // Excluir la factura actual del acumulado
                                                    )
                                                    .reduce((sum, f) => sum + (f.presentValueInvestor || 0), 0) 
                                                    + presentValueInvestor;  // Sumar el valor recién calculado
                                                    
                                                    
                                                    const presentValueSF =  operationDays > 0 && valorNominal > 0
                                                      ? Math.round(PV(values.discountTax / 100,  operationDays / 365, 0, valorNominal, 0) * -1)
                                                      : valorFuturoManual;
                                                   
                                                      // Calcular el presentValueInvestor total de todas las facturas del mismo inversionista
                                                  
                                                    setFieldValue(`facturas[${index}].presentValueInvestor`, presentValueInvestor); // Actualizar el valor
                                                    setFieldValue(`facturas[${index}].presentValueSF`, presentValueSF || 0); // Actualizar el valor

                                                    if(values.facturas[index].applyGm) {
                                                      setFieldValue(`facturas[${index}].gastoMantenimiento`, presentValueInvestor * 0.002);
                                                    } else {
                                                    setFieldValue(`facturas[${index}].gastoMantenimiento`, 0);} 
                                                    
                                                    //setFieldValue(`facturas[${index}].montoDisponibleCuenta`,factura.montoDisponibleInfo - presentValueInvestor || 0); // Actualizar el valor
                                                    // Actualizar el monto disponible en todas las facturas con el mismo nombreInversionista

                                              

                                                 
                                                
                                                    // 1. Encontrar TODAS las facturas con el mismo billId (incluyendo la actual)
                                                    const facturasMismoBillId = values.facturas.filter(item => item.idCuentaInversionista === factura.idCuentaInversionista);
                                                    const facturasMismoInvestor = values.facturas.filter(item => 
                                                      Boolean(item.idCuentaInversionista) && 
                                                      item.idCuentaInversionista === factura.idCuentaInversionista
                                                    );
                                                    

                                                   
                                                    values.facturas.forEach((f, i) => {
                                                      if (f.idCuentaInversionista=== factura.idCuentaInversionista && f.idCuentaInversionista ) {
                                                       
                                                        const montoDisponibleActualizado = f.montoDisponibleInfo  - presentValueInvesTotal;
                                                        
                                                        setFieldValue(`facturas[${i}].montoDisponibleCuenta`, montoDisponibleActualizado, 0);
                                                     
                                                      } else if (f.idCuentaInversionista!== factura.idCuentaInversionista && f.idCuentaInversionista )  {
                                                        
                                                        
                                                    }});      
                                                    
                                                    
                                                    
                                          
                                                          }

                                                    

                                                  
                                                    
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
                                                  min: 0,
                                                  startAdornment: (
                                                    <InputAdornment position="start">
                                                      <AttachMoneyIcon style={{ color: 'rgb(94, 163, 163)', fontSize: '1.2rem' }} />
                                                    </InputAdornment>
                                                  ),
                                                }}
                                              />
                                                                                                                            {/** Ícono Infotip con Tooltip */}
                                              <Tooltip 
                                                title="El Valor Futuro: (1) Resta de tu Saldo Disponible, (2) Define tu Valor Nominal (cupo), y (3) Nunca puede superar tu Saldo Disponible."
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
                                              id="payedPercentname" // Para CSS/JS si es necesario
                                              data-testid="campo-payedPercent"
                                              label="% Descuento"
                                              fullWidth
                                              type="number"
                                              name="porcentajeDescuento"
                                              value={Math.round(factura.porcentajeDescuento) ?? 0}
                                              onChange={(e) => {

                                                // Validar y establecer el porcentaje de descuento
                                                  const rawValue = e.target.value;
                                                  const parsedValue = Number(rawValue);
                                                  const clampedValue = Math.min(Math.max(parsedValue, 0), 100) || 0; // Maneja NaN (si rawValue es "")
                                                  
                                             
            
                                                // Validar y establecer el porcentaje de descuento
                                                let value = e.target.value ? Math.min(Math.max(Number(e.target.value), 0), 100) : 0;
                                          
                                                setFieldValue(`facturas[${index}].porcentajeDescuento`, e.target.value);

                                                // Calcular nuevo valor nominal
                                                const valorFuturo = factura.valorFuturo || 0;
                                                const nuevoValorNominal = valorFuturo * ((value / 100));
                                               setFieldValue(`facturas[${index}].valorNominal`, Number(nuevoValorNominal.toFixed(2)));
                                                setFieldValue(`facturas[${index}].valorNominal`, Number(nuevoValorNominal.toFixed(2)));
                                                setFieldValue(`facturas[${index}].valorNominalManual`, false);
                                                
                                                // Recalcular valores presentes si hay fecha de operación
                                                if (values.opDate && factura.operationDays) {
                                                  // Calcular nuevos valores presentes
                                                  const presentValueInvestor = factura.operationDays > 0 && nuevoValorNominal > 0
                                                    ? Math.round(PV(values.investorTax / 100, factura.operationDays / 365, 0, nuevoValorNominal, 0) * -1)
                                                    : valorFuturo;

                                                  const presentValueSF = factura.operationDays > 0 && nuevoValorNominal > 0
                                                    ? Math.round(PV(values.discountTax / 100, factura.operationDays / 365, 0,nuevoValorNominal, 0) * -1)
                                                    : valorFuturo;

                                                  // Actualizar valores en la factura actual
                                                  setFieldValue(`facturas[${index}].presentValueInvestor`, presentValueInvestor);
                                                  setFieldValue(`facturas[${index}].presentValueSF`, presentValueSF);
                                                  setFieldValue(`facturas[${index}].comisionSF`, presentValueInvestor + presentValueSF || 0 );

                                                  // Calcular totales globales
                                                  const totalPresentValue = values.facturas.reduce((sum, f) => {
                                                    const pv = f.id === factura.id ? presentValueInvestor : (f.presentValueInvestor || 0);
                                                    return sum + pv;
                                                  }, 0);

                                                  const totalGastos = values.facturas.reduce((sum, f) => sum + (f.gastoMantenimiento || 0), 0);

                                                  // Calcular monto disponible global
                                                  const montoDisponibleGlobal = factura.montoDisponibleInfo - totalPresentValue - totalGastos;

                                                  // Actualizar TODAS las facturas con el mismo monto disponible
                                                  values.facturas.forEach((f, i) => {
                                                    setFieldValue(`facturas[${i}].montoDisponibleCuenta`, montoDisponibleGlobal);
                                                  });
                                                }
                                              }}
                                              inputProps={{ min: 0, max: 100 }}
                                              error={touched.facturas?.[index]?.porcentajeDescuento && Boolean(errors.facturas?.[index]?.porcentajeDescuento)}
                                              helperText={touched.facturas?.[index]?.porcentajeDescuento && errors.facturas?.[index]?.porcentajeDescuento}
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
                                             id="discountTaxname" // Para CSS/JS si es necesario
                                              data-testid="campo-discountTax"
                                              label="Tasa Descuento"
                                              fullWidth
                                              type="number"
                                              InputLabelProps={{ shrink: true }}
                                              value={values.discountTax}
                                              onChange={(e) => {
                                               
                                                const nuevaTasaDescuento = parseFloat(e.target.value) || 0;
                                                  const nuevoInvestorTax = parseFloat(factura.investorTax) || 0;

                                                  // 2. Validar relación entre tasas
                                                  if (nuevoInvestorTax > nuevaTasaDescuento) {
                                                    console.log(nuevoInvestorTax)
                                                    // Caso inválido: ajustar ambos valores al mayor (investorTax)
                                                    setFieldValue('discountTax', nuevoInvestorTax);
                                                    setFieldValue('investorTax', nuevoInvestorTax);
                                                    
                                                    // Mostrar feedback al usuario (puedes reemplazar por un Snackbar/toast)
                                                    setTimeout(() => {
                                                      alert("La tasa de descuento no puede ser menor que la tasa del inversionista. Ambos valores se ajustaron a " + nuevoInvestorTax + "%");
                                                    }, 100);
                                                  } else {
                                                    // Caso válido: actualizar normalmente
                                                    setFieldValue('discountTax', nuevaTasaDescuento);
                                                    
                                                    // Bonus: Actualizar automáticamente investorTax si es cero
                                                    if (nuevoInvestorTax === 0) {
                                                      setFieldValue('investorTax', nuevaTasaDescuento);
                                                    }
                                                  }
                                                

                                                // 2. Solo proceder si hay fecha de operación
                                                if (values.opDate) {
                                                  // 3. Recorrer todas las facturas para actualizar sus presentValueSF
                                                  values.facturas.forEach((f, i) => {
                                                    const operationDays = f.operationDays || 0;
                                                    const valorNominal = f.valorNominal || 0;
                                                    
                                                    // 4. Calcular nuevo presentValueSF para cada factura
                                                    const presentValueSF = operationDays > 0 && valorNominal > 0
                                                      ? Math.round(PV(nuevaTasaDescuento / 100, operationDays / 365, 0, -valorNominal, 0) )
                                                      : f.valorFuturo || 0;

                                                  
                                                    
                                                    // 5. Actualizar el presentValueSF para cada factura
                                                    setFieldValue(`facturas[${i}].presentValueSF`, presentValueSF);

                                                    // 6. Recalcular comisionSF si es necesario (diferencia entre presentValueInvestor y presentValueSF)
                                                    if (f.presentValueInvestor) {
                                                      const comisionSF = f.presentValueInvestor - presentValueSF;
                                                      setFieldValue(`facturas[${i}].comisionSF`, comisionSF  || 0);
                                                    }
                                                    
                                                  });
                                                }
                                              }}
                                              helperText={
                                                !factura.valorNominalManual
                                                  ? `Tasa Descuento sugerida: ${factura.tasaDescuentoPR || 0}%` 
                                                  : values.investorTax > values.discountTax
                                                    ? "La tasa inversionista no puede ser mayor que la tasa de descuento."
                                                    : "Valor ingresado manualmente"
                                              }
                                              onBlur={(e) => {
                                                // Validación adicional al salir del campo
                                                const finalValue = parseFloat(e.target.value) || 0;
                                                if (finalValue < parseFloat(factura.investorTax)) {
                                                  setFieldError('discountTax', 'Debe ser ≥ Tasa Inversionista');
                                                } else {
                                                  setFieldError('discountTax', 0);
                                                }
                                              }}
                                            />
                                            
                                   
                                            </Grid>

                                            {/* Campo de valor nominal */}
                                            <Grid item xs={12} md={3}>
                                            <TextField
                                             id="payedAmountname" // Para CSS/JS si es necesario
                                              data-testid="campo-payedAmount"
                                              label="Valor Nominal"
                                              fullWidth
                                              name="valorNominal"
                                              value={factura.valorNominal ? formatNumberWithThousandsSeparator(factura.valorNominal) : 0} // Valor predeterminado 0
                                              onChange={(e) => {
                                                // Manejo del valor nominal
                                                const rawValue = e.target.value.replace(/[^\d]/g, "");
                                                let nuevoValorNominal = parseFloat(rawValue) || 0;
                                                const valorFuturo = factura.valorFuturo || 0;
                                               
                                                
                                                if (nuevoValorNominal > valorFuturo) {
                                                  nuevoValorNominal = valorFuturo;
                                                }
                                              
                                                // Actualizar valor nominal
                                                setFieldValue(`facturas[${index}].valorNominal`, nuevoValorNominal);
                                                setFieldValue(`facturas[${index}].payedAmount`, nuevoValorNominal);
                                                setFieldValue(`facturas[${index}].valorNominalManual`, true);
                                              
                                                // Cálculo de investorProfit
                                                const presentValueInvestor = factura.presentValueSF || 0;
                                                const nuevoInvestorProfit =  nuevoValorNominal -presentValueInvestor;
                                                setFieldValue(`facturas[${index}].investorProfit`, nuevoInvestorProfit);
                                              
                                                // Cálculo porcentaje descuento
                                                const nuevoPorcentajeDescuento = calcularPorcentajeDescuento(valorFuturo, nuevoValorNominal);
                                                setFieldValue(`facturas[${index}].porcentajeDescuento`, nuevoPorcentajeDescuento);
                                              
                                                // Recalcular valores si hay fecha de operación
                                                if (values.opDate) {
                                                  const operationDays = factura.operationDays;
                                                  
                                                  // Cálculo de presentValueInvestor y presentValueSF
                                                  const newPresentValueInvestor = operationDays > 0 && nuevoValorNominal > 0
                                                    ? Math.round(PV(values.investorTax / 100, operationDays / 365, 0, -nuevoValorNominal, 0) )
                                                    : nuevoValorNominal;
                                              
                                                  const newPresentValueSF = operationDays > 0 && nuevoValorNominal > 0
                                                    ? Math.round(PV(values.discountTax / 100, operationDays / 365, 0, -nuevoValorNominal, 0) )
                                                    : nuevoValorNominal;
                                              
                                                  
                                                  
                                                  // Actualizar valores calculados
                                                  setFieldValue(`facturas[${index}].presentValueInvestor`, newPresentValueInvestor);
                                                  if(values.facturas[index].applyGm) {
                                                    setFieldValue(`facturas[${index}].gastoMantenimiento`, presentValueInvestor * 0.002);
                                                  } else {
                                                  setFieldValue(`facturas[${index}].gastoMantenimiento`, 0);} 
                                                  setFieldValue(`facturas[${index}].presentValueSF`, newPresentValueSF);
                                                  setFieldValue(`facturas[${index}].comisionSF`, newPresentValueInvestor-newPresentValueSF || 0);
                                                  setFieldValue(`facturas[${index}].investorProfit`,nuevoValorNominal- newPresentValueSF);
                                                  // Lógica para montoDisponibleCuenta compartido entre facturas con mismo inversionista
                                                  if (factura.idCuentaInversionista) {
                                                    // 1. Obtener todas las facturas con mismo inversionista (incluyendo la actual)
                                                    const facturasMismoInversionista = values.facturas
                                                      .map((f, i) => i === index ? {
                                                        ...f,
                                                        presentValueInvestor: newPresentValueInvestor,
                                                        gastoMantenimiento: factura.gastoMantenimiento || 0
                                                      } : f)
                                                      .filter(f => f.idCuentaInversionista === factura.idCuentaInversionista);
                                              
                                                    // 2. Calcular total de presentValueInvestor y gastoMantenimiento
                                                    const totalPV = facturasMismoInversionista.reduce((sum, f) => sum + f.presentValueInvestor, 0);
                                                    const totalGM = facturasMismoInversionista.reduce((sum, f) => sum + (f.gastoMantenimiento || 0), 0);
                                              
                                                    // 3. Calcular monto disponible común
                                                    const montoDisponibleComun = factura.montoDisponibleInfo - totalPV - totalGM;
                                              
                                                    // 4. Actualizar todas las facturas con mismo inversionista
                                                    values.facturas.forEach((f, i) => {
                                                      if (f.idCuentaInversionista === factura.idCuentaInversionista) {
                                                        setFieldValue(`facturas[${i}].montoDisponibleCuenta`, montoDisponibleComun);
                                                      }
                                                    });
                                                  } else {
                                                    // Caso sin inversionista: cálculo individual
                                                    const montoIndividual = factura.montoDisponibleInfo - newPresentValueInvestor - (factura.gastoMantenimiento || 0);
                                                    setFieldValue(`facturas[${index}].montoDisponibleCuenta`, montoIndividual);
                                                  }
                                                }
                                              }}                                      onFocus={(e) => {
                                                // Al hacer foco, eliminamos el formato para permitir la edición del valor numérico
                                                e.target.value = factura.valorNominal ? factura.valorNominal.toString() : "";
                                              }}
                                              onBlur={(e) => {
                                                // Al perder el foco, aplicar el formato de separadores de miles y asegurarse que sea un número entero
                                                const rawValue = e.target.value.replace(/[^\d]/g, ""); // Permitir borrar completamente
                                                const valorNominal = parseFloat(rawValue) || 0;
                                                setFieldValue(`facturas[${index}].valorNominal`, valorNominal);
                                                setFieldValue(`facturas[${index}].payedAmount`, valorNominal);
                                              }}
                                              placeholder={`Sugerido: ${factura.valorFuturo && factura.porcentajeDescuento !== undefined ? formatNumberWithThousandsSeparator(Math.floor(factura.valorFuturo * (1 - (factura.porcentajeDescuento / 100)))) : ""}`} // Aquí se calcula el valor nominal sugerido
                                              
                                              helperText={
                                                !factura.valorNominalManual
                                                  ? `Valor sugerido: ${factura.valorFuturo && factura.porcentajeDescuento !== undefined ? formatNumberWithThousandsSeparator(Math.floor(factura.valorFuturo * (1 - (factura.porcentajeDescuento / 100)))) : ""}`
                                                  : "Valor ingresado manualmente"
                                              } //QUITAR
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
                                            <Box sx={{ position: 'relative' }}> 

                                            <TextField
                                             id="investorTaxname" // Para CSS/JS si es necesario
                                              data-testid="campo-investorTax"
                                              label="Tasa Inversionista"
                                              fullWidth
                                              type="number"
                                              name="investorTax"
                                              value={factura.investorTax || 0 }
                                              onChange={(e) => {
                                                const nuevoInvestorTax = parseFloat(e.target.value); // Convertir a número
                                                const discountTax = values.discountTax || 0; // Obtener el valor de discountTax

                                                // Validar que la tasa inversionista no sea mayor que la tasa de descuento
                                                if (nuevoInvestorTax > discountTax) {
                                                  setFieldValue(`investorTax`, discountTax); // Ajustar al valor de discountTax
                                                  setFieldValue(`facturas[${index}].investorTax`, discountTax); // Ajustar al valor de discountTax
                                                } else {
                                                  setFieldValue(`investorTax`, nuevoInvestorTax); // Mantener el valor ingresado
                                                  setFieldValue(`facturas[${index}].investorTax`, nuevoInvestorTax); // Mantener el valor ingresado
                                                }
                                                const operationDays = factura.operationDays 

                                                const presentValueInvestor = operationDays > 0 && factura.valorNominal > 0
                                                    ? Math.round(PV( nuevoInvestorTax / 100,  operationDays / 365, 0, -factura.valorNominal, 0) )
                                                    : factura.valorFuturo;
          
                                                const nuevoInvestorProfit =  factura.valorNominal -presentValueInvestor;     
                                            setFieldValue(`facturas[${index}].presentValueInvestor`, presentValueInvestor); // Actualizar el valor
                                            setFieldValue(`facturas[${index}].comisionSF`, presentValueInvestor-factura.presentValueSF || 0); // Actualizar el valor
                                            setFieldValue(`facturas[${index}].investorProfit`, nuevoInvestorProfit || 0);
                                            // [SOLUCIÓN GLOBAL] Restar todos los presentValueInvestor al montoDisponibleCuenta
                                            const totalPresentValue = values.facturas
                                            .filter((f, i) => 
                                              f.idCuentaInversionista === factura.idCuentaInversionista && 
                                              i !== index  // Excluir la factura actual del acumulado
                                            )
                                            .reduce((sum, f) => sum + (f.presentValueInvestor || 0), 0) 
                                            + presentValueInvestor;  // Sumar el valor recién calculado

                                                  // Calcular el nuevo monto disponible global
                                                  const nuevoMontoGlobal = factura.montoDisponibleInfo - totalPresentValue;

                                                  const currentAccountId = factura.idCuentaInversionista;

                                                  // Actualizar solo las facturas con la misma cuentaInversionista
                                                  values.facturas.forEach((f, i) => {
                                                    if (f.idCuentaInversionista === currentAccountId) {
                                                      setFieldValue(`facturas[${i}].montoDisponibleCuenta`, nuevoMontoGlobal);
                                                    }
                                                  });
                                                                        
                                                  
                                              }}
                                              inputProps={{ min: 0, max: 100 }}
                                              error={values.investorTax > values.discountTax} // Mostrar error si es mayor
                                              helperText={
                                                !factura.valorNominalManual
                                                  ? `Tasa inversionista sugerida: ${factura.tasaInversionistaPR || 0}%` 
                                                  : values.investorTax > values.discountTax
                                                    ? "La tasa inversionista no puede ser mayor que la tasa de descuento."
                                                    : "Valor ingresado manualmente"
                                              }
                                            />
                                             <Tooltip 
                                      title="Por defecto, este valor se establece en 0%. Si lo necesitas, puedes modificarlo manualmente en este formulario según las condiciones actuales del mercado.
                                    Cambiar este valor solo afectará la operación actual, no se actualizará en el perfil de riesgo del cliente."
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
                                                    top: '40%', 
                                                    right: 2, // Colocado a la derecha del campo
                                                    transform: 'translateY(-100%)', // Centrado verticalmente en el campo
                                                    padding: 0.8,
                                                    marginLeft: 1,
                                                  }}
                                                >
                                                  <InfoIcon style={{ fontSize: '1rem', color: 'rgb(94, 163, 163)' }} />
                                                </IconButton>
                                              </Tooltip>
                                            </Box>
                                           

                                            </Grid>
                                            <Grid item xs={12} md={2}>
                                            <DatePicker
                                                id="endDatename"
                                                data-testid="campo-fechaFin"
                                                label="Fecha Fin"
                                                value={factura.fechaFin}
                                                inputFormat="dd/MM/yyyy"
                                                mask="__/__/____"
                                                disableMaskedInput={false}
                                                onChange={(newValue) => {
                                                  // Tu lógica existente de onChange aquí...
                                                  const parsedDate = newValue ? new Date(newValue) : null;
                                                  if (!parsedDate) return;
                                                  
                                                
                                                  setFieldValue(`facturas[${index}].fechaFin`, parsedDate);
      
                                                
                                                // Calcular operationDays si opDate está definido
                                                if (values.opDate) {
                                                  const operationDays = differenceInDays(startOfDay(newValue), startOfDay(values.opDate));
                                                  
                                                  setFieldValue(`facturas[${index}].operationDays`, operationDays);
                                                  
                                                  const presentValueInvestor = operationDays > 0 && factura.valorNominal > 0
                                                    ? Math.round(PV(values.investorTax / 100, operationDays / 365, 0, -factura.valorNominal, 0) )
                                                    : factura.valorFuturo;
                                              
                                                  const presentValueSF = operationDays > 0 && factura.valorNominal > 0
                                                    ? Math.round(PV(values.discountTax / 100, operationDays / 365, 0,-factura.valorNominal, 0) )
                                                    : factura.currentBalance;
                                                  
                                                  
                                                  setFieldValue(`facturas[${index}].presentValueInvestor`, presentValueInvestor || 0);
                                                  setFieldValue(`facturas[${index}].presentValueSF`, presentValueSF || 0);
                                                  setFieldValue(`facturas[${index}].comisionSF`, presentValueInvestor- presentValueSF || 0);
                                                
                                                  setFieldValue(`facturas[${index}].investorProfit`,factura.valorNominal- presentValueSF || 0);



                                                  const totalPresentValue = values.facturas
                                                  .filter((f, i) => 
                                                    f.idCuentaInversionista === factura.idCuentaInversionista && 
                                                    i !== index  // Excluir la factura actual del acumulado
                                                  )
                                                  .reduce((sum, f) => sum + (f.presentValueInvestor || 0), 0) 
                                                  + presentValueInvestor;  // Sumar el valor recién calculado
            

                                                    const totalGastos = values.facturas.reduce((sum, f) => sum + (f.gastoMantenimiento || 0), 0);
                                                    
                                                    const montoDisponibleGlobal = factura.montoDisponibleInfo - totalPresentValue - totalGastos;
                                                    
                                                  // Obtener el ID de la cuenta de inversión actual
                                                    const currentAccountId = factura.idCuentaInversionista;

                                                    // Actualizar solo las facturas con la misma cuentaInversionista
                                                    values.facturas.forEach((f, i) => {
                                                      if (f.idCuentaInversionista=== currentAccountId) {
                                                        setFieldValue(`facturas[${i}].montoDisponibleCuenta`, montoDisponibleGlobal);
                                                      }
                                                    });
                                                  }
                                              }}
                                              renderInput={(params) => (
                                                <TextField
                                                  {...params}
                                                  fullWidth
                                                  onKeyDown={(e) => {
                                                    // Permite solo números, barras y teclas de control
                                                    if (!/[0-9/]/.test(e.key) && 
                                                        !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                                                      e.preventDefault();
                                                    }
                                                  }}
                                                />
                                              )}
                                              OpenPickerButtonProps={{
                                                'aria-label': 'Seleccionar fecha',
                                              }}
                                              componentsProps={{
                                                actionBar: {
                                                  actions: ['clear', 'accept'],
                                                },
                                              }}
                                              
                                            />
                  
                                            </Grid>
                                                  <Grid item xs={12} md={2}>
                                              <TextField
                                              id="endDatename" // Para CSS/JS si es necesario
                                              data-testid="campo-fechaFin"
                                                label="Días Operación"
                                                fullWidth
                                                type="number"
                                                value={factura.operationDays || 0} // Si es undefined o null, se muestra vacío
                                                onChange={(e) => {

                                                
                                             
                                                  const nuevosDiasOperacion = parseFloat(e.target.value); // Convertir a número
                                                  setFieldValue(`facturas[${index}].operationDays`, nuevosDiasOperacion); // Actualizar el valor

                                                  const presentValueInvestor = nuevosDiasOperacion > 0 && factura.valorNominal > 0
                                                        ? Math.round(PV(values.investorTax / 100,  nuevosDiasOperacion / 365, 0, factura.valorNominal, 0) * -1)
                                                        : factura.valorFuturo;

                                                const presentValueSF =  nuevosDiasOperacion > 0 && factura.valorNominal > 0
                                                  ? Math.round(PV(values.discountTax / 100,  nuevosDiasOperacion / 365, 0, factura.valorNominal, 0) * -1)
                                                  : factura.currentBalance;
                                               
                                                setFieldValue(`facturas[${index}].presentValueInvestor`, presentValueInvestor); // Actualizar el valor
                                                setFieldValue(`facturas[${index}].presentValueSF`, presentValueSF); // Actualizar el valor
                                                }}
                                                InputLabelProps={{ shrink: true }} // Asegura que el label no se superponga al valor
                                              disabled
                                              />
                                            </Grid>
                                            {/* Campo Utilidad Inversión*/ }
                                            <Grid item xs={12} md={3.5}>
                                              <TextField
                                               id="InvestorProfitname" // Para CSS/JS si es necesario
                                              data-testid="campo-InvestorProfit"
                                                label="Utilidad Inversión"
                                                fullWidth
                                                value={formatCurrency(factura.investorProfit) || 0} // Formato moneda
                                                disabled // Bloquear edición
                                                InputProps={{
                                                  inputComponent: "input", // Asegura que se muestre correctamente
                                                }}
                                              />
                                            </Grid>
                                            {/* Valor Presente Inversión*/ }
                                            <Grid item xs={12} md={4}>
                                              <TextField
                                              id="presentValueInvestorname" // Para CSS/JS si es necesario
                                              data-testid="campo-presentValueInvestor"
                                                label="Valor Presente Inversión"
                                                fullWidth
                                                value={formatCurrency(factura.presentValueInvestor) || 0} // Formato moneda
                                                disabled // Bloquear edición
                                                InputProps={{
                                                  inputComponent: "input", // Asegura que se muestre correctamente
                                                }}
                                              />
                                            </Grid>
                                            {/* Valor Presente SF*/ }
                                            <Grid item xs={12} md={4}>
                                              <TextField
                                              id="presentValueSFname" // Para CSS/JS si es necesario
                                              data-testid="campo-presentValueSF"
                                                label="Valor Presente Mesa"
                                                fullWidth
                                                value={formatCurrency(factura.presentValueSF) || 0} // Formato moneda
                                                disabled // Bloquear edición
                                                InputProps={{
                                                  inputComponent: "input", // Asegura que se muestre correctamente
                                                }}
                                              />
                                            </Grid>
                                            {/* Comisión SF*/ }
                                            <Grid item xs={12} md={4}>
                                              <TextField
                                              id="comisionSFname" // Para CSS/JS si es necesario
                                              data-testid="campo-comisionSF"
                                                label="Comisión Mesa"
                                                fullWidth
                                                value={formatCurrency(factura.comisionSF) || 0} // Formato moneda
                                                disabled // Bloquear edición
                                                name="comisionSF"
                                                InputProps={{
                                                  inputComponent: "input", // Asegura que se muestre correctamente
                                                }}
                                              />
                                            </Grid>
                                            {/*Selector de Corredor Inversionista */}
                                            
                                            <Grid item xs={12} md={4}>
                                              <TextField
                                              id="investorBrokername" // Para CSS/JS si es necesario
                                              data-testid="campo-investorBroker"
                                                label="Corredor Inversionista *"
                                                fullWidth
                                                value={factura.investorBrokerName || ''} // Mostrar el corredor asignado
                                                disabled // Bloquear edición
                                                name="investorBrokerName"
                                                InputProps={{
                                                  inputComponent: "input", // Asegura que se muestre correctamente
                                                }}
                                                InputLabelProps={{ shrink: true,min: 0, max: 100  }}
                                                helperText={touched.facturas?.[index]?.investorBrokerName && errors.facturas?.[index]?.investorBrokerName} // Ayuda para mostrar errores
                                                error={touched.facturas?.[index]?.investorBrokerName && Boolean(errors.facturas?.[index]?.investorBrokerName)}
                                              />
                                            </Grid>
                                            {/* Gasto de Mantenimiento */}
                                          <Grid item xs={12} md={4}>
                                          <Box 
                                                sx={{
                                                  display: 'flex',
                                                  alignItems: 'center',
                                                  height: '69%',
                                                  width:'913px',
                                                  gap: 1,
                                                  p: 1,
                                                  border: '1px solid',
                                                  borderColor: 'rgba(0, 0, 0, 0.23)',
                                                  borderRadius: 1,
                                                  boxShadow: 0,
                                                  bgcolor: 'background.paper'
                                                }}
                                              >
                                              <Typography variant="body1" sx={{ whiteSpace: 'nowrap' }}>
                                                Gasto de Mantenimiento (GM)
                                                </Typography>
                                              <Switch
                                                checked={factura.applyGm || false}
                                                onChange={(event) => {
                                                  const isChecked = event.target.checked;
                                                  const valorGm = factura.presentValueInvestor * 0.002;
                                                  const diferencia = isChecked ? valorGm : -valorGm;

                                                  // Actualizar estado del GM para esta factura
                                                  setFieldValue(`facturas[${index}].applyGm`, isChecked);
                                                  setFieldValue(`facturas[${index}].gastoMantenimiento`, isChecked ? valorGm : 0);

                                                  // Calcular nuevo monto disponible SOLO para facturas con el mismo idCuentaInversionista
                                                  const currentAccountId = factura.idCuentaInversionista;
                                                  const montoActual = values.facturas.find(f => f.idCuentaInversionista === currentAccountId)?.montoDisponibleCuenta || factura.montoDisponibleInfo;
                                                  const nuevoMonto = montoActual - diferencia;

                                                  // Actualizar solo las facturas de la misma cuenta
                                                  values.facturas.forEach((f, i) => {
                                                    if (f.idCuentaInversionista === currentAccountId) {
                                                      setFieldValue(`facturas[${i}].montoDisponibleCuenta`, nuevoMonto);
                                                    }
                                                  });
                                                }}
                                                sx={{
                                                  '& .MuiSwitch-switchBase.Mui-checked': {
                                                    color: '#488B8F', // Color cuando está activado
                                                  },
                                                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                    backgroundColor: '#488B8F', // Color del track cuando está activado
                                                  },
                                                }}
                                              />
                                              <TextField
                                                type="text"
                                                placeholder="$ 0,00"
                                                id="gastoMantenimientoname" // Para CSS/JS si es necesario
                                              data-testid="campo-gastoMantenimiento"
                                                value={formatCurrency(factura.gastoMantenimiento) ?? 0}
                                                onChange={(e) => {
                                                  const nuevoValor = parseFloat(e.target.value) || 0;
                                                  const diferencia = nuevoValor - (factura.gastoMantenimiento || 0);

                                                  // Actualizar valor de GM para esta factura
                                                  setFieldValue(`facturas[${index}].gastoMantenimiento`, nuevoValor);

                                                  // Calcular nuevo monto disponible SOLO para facturas con el mismo idCuentaInversionista
                                                  const currentAccountId = factura.idCuentaInversionista;
                                                  const montoActual = values.facturas.find(f => f.idCuentaInversionista === currentAccountId)?.montoDisponibleCuenta || factura.montoDisponibleInfo;
                                                  const nuevoMonto = montoActual - diferencia;

                                                  // Actualizar solo las facturas de la misma cuenta
                                                  values.facturas.forEach((f, i) => {
                                                    if (f.idCuentaInversionista === currentAccountId) {
                                                      setFieldValue(`facturas[${i}].montoDisponibleCuenta`, nuevoMonto);
                                                    }
                                                  });
                                                }}
                                                disabled={!factura.applyGm}
                                                size="small"  // <-- Esto reduce la altura
                                                
                                                thousandSeparator="."
                                                decimalSeparator=","
                                                decimalScale={0}
                                                allowNegative={false}
                                                fullWidth
                                                variant="outlined"
                                                className={`flex-1 ${factura.applyGm ? "bg-white" : "bg-gray-200 text-gray-500"}`}
                                              />
                                            </Box>
                                          </Grid>

                                          
                                            
                                          </Grid>
                                    
                                        </AccordionDetails>
                                      </Accordion>
                                    </Grid>
                                  
                                  </Grid>
                                </Grid>
                              ))}
                              <Grid item xs={12}>
                              <Button 
                                  variant="contained" 
                                  sx={{ marginLeft: 'auto' }} 
                                  onClick={() => {
                                    // Calcular el nuevo índice basado en los existentes
                                    const nuevosIndices = orchestDisabled.map(item => item.indice);
                                    const nuevoIndice = nuevosIndices.length > 0 ? Math.max(...nuevosIndices) + 1 : 0;
                                    
                                    // Agregar el nuevo elemento a orchestDisabled
                                    setOrchestDisabled(prev => [
                                      ...prev,
                                      { indice: nuevoIndice, status:false }
                                    ]);
                                    
                                    // Agregar la nueva factura
                                    push({
                                      is_creada:false,
                                      applyGm: false,
                                      amount: 0,
                                      payedAmount: 0,
                                      nombreInversionista: '',
                                      investorProfit: 0,
                                      cuentaInversionista: '',
                                      factura: '',
                                      fraccion: 1,
                                      valorFuturo: '',
                                      valorFuturoManual: false,
                                      fechaEmision: null,
                                      valorNominal: 0,
                                      porcentajeDescuento: 0,
                                      probableDate: `${new Date().toISOString().substring(0, 10)}`,
                                      investorTax: 0,
                                      nombrePagador: '',
                                      fechaFin: `${new Date()}`,
                                      diasOperaciones: 0,
                                      operationDays: 0,
                                      comisionSF: 0,
                                      gastoMantenimiento: 0,
                                      fechaOperacion: `${new Date().toISOString().substring(0, 10)}`,
                                      fechaExpiracion: `${new Date().toISOString().substring(0, 10)}`,
                                      opExpiration: `${new Date().toISOString().substring(0, 10)}`,
                                      presentValueInvestor: 0,
                                      presentValueSF: 0,
                                      montoDisponibleInfo: 0,
                                    });
                                  }}
                                >
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
                                {/* Modal de Confirmación usando Dialog */}
                  <Dialog 
                    open={showConfirmationModal} 
                    onClose={() => setShowConfirmationModal(false)}
                    PaperProps={{
                      sx: {
                        borderRadius: 2,
                        padding: 3,
                        minWidth: 400
                      }
                    }}
                  >
                    <DialogTitle>Confirmar Operación</DialogTitle>
                    <DialogContent>
                      <Typography variant="body1" mb={3}>
                        ¿Estás seguro de registrar esta operación?
                      </Typography>
                    </DialogContent>
                    <DialogActions>
                      <Button 
                        variant="outlined" 
                        onClick={() => setShowConfirmationModal(false)}
                      >
                        Cancelar
                      </Button>
                      <Button 
                        variant="contained" 
                        color="primary"
                        onClick={() => {
                          setShowConfirmationModal(false);
                          handleSubmit(values,actionsFormik); // Usar formik.values o manejar según tu implementación
                        }}
                      >
                        Confirmar
                      </Button>
                    </DialogActions>
                  </Dialog>

                          {/* MODAL DE PROCESO */}
                            <Dialog  open={false} PaperProps={{ sx: { borderRadius: "10px", textAlign: "center", p: 3 } }}>
                              <DialogContent>
                                {success === null ? (
                                  <>
                                    <CircularProgress size={80} sx={{ color: "#1976D2", mb: 2 }} />
                                    <Typography variant="h6">Procesando...</Typography>
                                  </>
                                ) : success ? (
                                  <>
                                    <CheckCircle sx={{ fontSize: 80, color: "green", mb: 2 }} />
                                    <Typography variant="h5" color="success.main">¡Registro Exitoso!</Typography>
                                  </>
                                ) : (
                                  <>
                                    <Error sx={{ fontSize: 80, color: "red", mb: 2 }} />
                                    <Typography variant="h5" color="error.main">Error al Registrar</Typography>
                                  </>
                                )}
                              </DialogContent>
                            </Dialog>

                            <Modal open={openEmitterBrokerModal}   onClose={() => setOpenEmitterBrokerModal(false)}>
                                  <Box sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    width: 400,
                                    bgcolor: 'background.paper',
                                    boxShadow: 24,
                                    p: 4,
                                    borderRadius: 1
                                  }}>
                                    <Typography variant="h6" gutterBottom>
                                      Corredor no asignado
                                    </Typography>
                                    <Typography variant="body1" sx={{ mb: 3 }}>
                                      El emisor seleccionado no tiene un corredor asignado. Debe asignar un corredor antes de continuar con el registro.
                                    </Typography>
                                    
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                      <Button 
                                          onClick={() => setOpenEmitterBrokerModal(false)}
                                        variant="outlined"
                                        color="secondary"
                                      >
                                        Cancelar
                                      </Button>
                                      <Button 
                                          onClick={() => {
                                            window.open(`${window.location.origin}/customers?modify=${clientWithoutBroker}`, '_blank');
                                            setOpenEmitterBrokerModal(false);
                                          }}
                                          variant="contained"
                                          color="primary"
                                        >
                                          Asignar Corredor
                                          </Button>
                                    </Box>
                                  </Box>
                                </Modal>

                                <Modal open={isModalEmitterAd} onClose={() => setIsModalEmitterAd(false)}>
                            <Box sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    width: 400,
                                    bgcolor: 'background.paper',
                                    boxShadow: 24,
                                    p: 4,
                                    borderRadius: 1
                                  }}>
                                   <Typography variant="h6" gutterBottom>Confirmación  </Typography>
                                   <Typography variant="body1" sx={{ mb: 3 }}>¿Estás seguro de que deseas continuar? </Typography>
                                   <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                   <Button onClick={() => {
                                    setBrokeDelete(false);  // Confirmar
                                    setIsModalEmitterAd(false);
                                    // Aquí podrías llamar a la función que continúa con la lógica

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
                        setFieldValue('emitter','')
                        setFieldValue('filtroEmitterPagador.payer','')
                        setFieldValue('filtroEmitterPagador','')
                        setFieldValue('nombrePagador','')
                        
                        // 4. Resetear solo las facturas no creadas manteniendo campos del inversionista
                        setFieldValue('facturas', values.facturas.map((f, index) => {
                          // Mantener facturas creadas intactas
                          if (indicesCreadas.includes(index)) {
                            return f;
                          }
                          
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
                            montoDisponibleInfo: f.montoDisponibleInfo || 0
                          };
                        }));

                        // 5. Limpiar campos adicionales solo si no hay facturas creadas
                        if (indicesCreadas.length === 0) {
                          setFieldValue('nombrePagador', '');
                          setFieldValue('filtroEmitterPagador.payer', '');
                          setFieldValue('takedBills', []);
                          setFieldValue('filteredPayers', []);
                          setFieldValue('corredorEmisor', 0);
                          setFieldValue('discountTax', 0);
                          setFieldValue('emitter','')
                          setClientEmitter(null);
                          setClientBrokerEmitter(null);
                        }

                                  }}
                                   variant="contained"
                                          color="primary"
                                  >
                                    Confirmar
                                    </Button>
                                  
                                  <Button onClick={() => {
                                    setBrokeDelete(true);  // Cancelar
                                    setIsModalEmitterAd(false);
                                  }}
                                  
                                  variant="contained"
                                  color="primary"
                                  >
                                    Cancelar
                                    </Button>
                                    
                                   </Box>
                                 
                                  </Box>
                                </Modal>
                            {/* Debug */}
                          {process.env.NODE_ENV === 'development' && (
                            <div style={{ marginTop: 20 }}>
                              <h4>Errores:</h4>
                              <pre>{JSON.stringify(errors, null, 2)}</pre>
                              <pre>{JSON.stringify(values, null, 2)}</pre>
                            </div>
                          )}
                              </Form>
                        
                      );
                      }}
                        

                        
                      </Formik>

                      
                        
                    
                      <ToastContainer
                      position="top-right"
                      autoClose={5000}
                      hideProgressBar={false}
                      newestOnTop={false}
                      closeOnClick
                      rtl={false}
                      pauseOnFocusLoss
                      draggable
                      pauseOnHover
                    />
                    </Box>
                  </LocalizationProvider>
                );
              };
export default ManageOperationC;   