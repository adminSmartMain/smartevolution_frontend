// components/RegisterOperationForm.js
import React, { useEffect, useState, useContext } from "react";
import { InputAdornment, Box, Modal, Typography, Switch, TextField, Button, Grid, Autocomplete, Accordion, AccordionSummary, AccordionDetails, Tooltip, IconButton } from '@mui/material';
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"; // Icono del dólar
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import esLocale from 'date-fns/locale/es';
import { Formik, Form, FieldArray,formikBag,dirty } from 'formik';
import * as Yup from 'yup';
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

import { Dialog,DialogContent, DialogTitle,DialogActions,CircularProgress} from "@mui/material";
import { CheckCircle, Error } from "@mui/icons-material";
import { differenceInDays, startOfDay } from "date-fns";


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
  console.log(emitters)
  console.log(typeOperation?.data)
  const emisores = emitters;
const router = useRouter();
const [clientWithoutBroker, setClientWithoutBroker] = useState(null);
  const [AccountFromClient,setAccountFromClient]=useState()   
  const [openEmitterBrokerModal,setOpenEmitterBrokerModal]=useState(false)
  const { user, logout } = useContext(authContext);
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

      { applyGm: false,
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
        probableDate: `${new Date()}`,
        investorTax: 0,
        expirationDate:'',
        fechaFin: `${new Date()}`,
        diasOperaciones: 0,
        operationDays: 0,
        comisionSF: 0,
        gastoMantenimiento: 0,
        fechaOperacion: `${new Date()}`,
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
  

 useEffect(() => {
  console.log("Account of investor filtradas actualizadas:",dataAccountFromClient);
  setAccountFromClient(dataAccountFromClient)
}, [dataAccountFromClient]); // Se ejecuta cuando cambia el estado

console.log(AccountFromClient)
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


   console.log(showConfirmationModal)
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
          {({ values, setFieldValue, touched, errors, handleBlur,setTouched ,setFieldTouched,setFieldError,formikBag,dirty}) => {
                // 🔴 Efecto para el mensaje de confirmación al cerrar la ventana
          useEffect(() => {
            const handleBeforeUnload = (e) => {
              if (dirty) {
                e.preventDefault();
                e.returnValue = '';
              }
            };

            window.addEventListener('beforeunload', handleBeforeUnload);
            
            return () => {
              window.removeEventListener('beforeunload', handleBeforeUnload);
            };
          }, [dirty]); // Dependencia del efecto

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
                          console.log('Nuevo valor:', value);
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
                                console.log(factura.fechaFin)
                            
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
                          console.log(newValue);
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
                    <Grid item xs={12} md={6}>
                    <Autocomplete
                      id="emitter-name" // Para CSS/JS si es necesario
                      data-testid="campo-emisor"
                        options={emisores}
                        isOptionEqualToValue={(option, value) => 
                          option?.data?.id === value?.data?.id
                        }
                        getOptionLabel={(option) => option.label || ''}
                        onChange={async (event, newValue) => {
                          // Verificar si newValue es null o undefined (es decir, si se borró o quitó el emisor)
                          if (!newValue) {
                            // 1. Primero agrupamos las facturas por idCuentaInversionista
                            const facturasPorCuenta = values.facturas.reduce((acc, factura) => {
                              const cuentaId = factura.idCuentaInversionista;
                              if (!acc[cuentaId]) {
                                acc[cuentaId] = [];
                              }
                              acc[cuentaId].push(factura);
                              return acc;
                            }, {});
                            console.log('Facturas agrupadas por cuenta:', facturasPorCuenta);
                            // 2. Para cada grupo de facturas con misma cuenta, calculamos el total a restituir
                            Object.entries(facturasPorCuenta).forEach(([cuentaId, facturas]) => {
                              if (facturas.length > 1) { // Solo si hay más de una factura para esta cuenta
                                const totalRestituir = facturas.reduce(
                                  (sum, f) => sum + f.gastoMantenimiento + f.presentValueInvestor , 
                                  0
                                );
                                console.log(totalRestituir)
                          
                                // 3. Actualizamos el monto disponible para todas las facturas de esta cuenta
                                values.facturas.forEach((f, index) => {
                                  if (f.idCuentaInversionista === cuentaId) {
                                    setFieldValue(`facturas[${index}].montoDisponibleCuenta`, 
                                      f.montoDisponibleInfo 
                                    );
                                  }
                                });
                              }
                            });
                          
                            // 4. Resetear todas las facturas manteniendo campos del inversionista
                            setFieldValue('facturas', values.facturas.map(f => ({
                              // Reset general
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
                              // Los montos disponibles ya fueron actualizados en el paso 3
                              montoDisponibleCuenta:  f.montoDisponibleInfo || 0,
                              montoDisponibleInfo: f.montoDisponibleInfo || 0
                            })));
                          
                            // 5. Limpiar campos adicionales
                            setFieldValue('nombrePagador', '');
                            setFieldValue('filtroEmitterPagador.payer', '');
                            setFieldValue('takedBills', []);
                            setFieldValue('filteredPayers',[]);
                            setFieldValue('corredorEmisor',0);
                            setFieldValue('discountTax', 0);
                            console.log(values)
                            return;

                          }


                          if (values.emitter !== newValue) {
                            const brokerByClientFetch = await fetchBrokerByClient(newValue?.data.id);
                            console.log(brokerByClientFetch);
                        
                            const fullName = brokerByClientFetch?.data?.first_name
                              ? `${brokerByClientFetch.data.first_name} ${brokerByClientFetch.data.last_name}`
                              : brokerByClientFetch?.data?.social_reason;
                        
                            console.log('fullName:', fullName);
                            setFieldValue('corredorEmisor', fullName);
                            setFieldValue('filtroEmitterPagador.emitter', newValue?.data.id)
                            
                            const tasaDescuento = await cargarTasaDescuento(newValue?.data.id);
                            console.log(tasaDescuento?.data);
                        
                            // Verificar si tasaDescuento es undefined
                            if (!tasaDescuento) {
                              // Mostrar el mensaje de error usando Toast
                               // Mostrar toast/notificación
                               toast.error("Disculpe, el cliente seleccionado no tiene perfil de riesgo configurado. Por favor, agrege el perfil en el módulo de clientes", {
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
                            console.log(newValue?.data.id);
                            console.log(dataBrokerByClient);
                            console.log(brokerByClientFetch);
                            console.log(brokerByClientFetch?.data?.id);
                            console.log(brokerByClient);
                            setFieldValue('emitterBroker', brokerByClientFetch?.data?.id);

                            console.log(dataBills)


                        
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

                            console.log(payers)
                            console.log(values)
                            console.log(brokerByClientFetch?.data?.id,values.filtroEmitterPagador.payer)
                            if (newValue?.data.id ){
                              
                              console.log('se puede enviar fatura, estàn los dos')
                              // Cargar nuevas facturas si se ha seleccionado un nuevo emisor
                                    if (newValue) {
                                      console.log(newValue);
                                      const facturasEmisor= await cargarFacturas(newValue?.data.id,values.filtroEmitterPagador.payer);
                                      console.log(facturasEmisor)
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
                                        
                                        console.log('Pagadores filtrados:', pagadoresFiltrados);
                                        // Aquí puedes actualizar el estado de los payers disponibles
                                        // setPayersFiltrados(pagadoresFiltrados);
                                        setFieldValue('filteredPayers',pagadoresFiltrados)
                                      }
                                    
                                        }   
                                        }
                            
                          
                          }else {

                            const brokerByClientFetch = await fetchBrokerByClient(newValue?.data.id);
                            console.log(brokerByClientFetch);
                        
                            const fullName = brokerByClientFetch?.data?.first_name
                              ? `${brokerByClientFetch.data.first_name} ${brokerByClientFetch.data.last_name}`
                              : brokerByClientFetch?.data?.social_reason;
                        
                            console.log('fullName:', fullName);
                            setFieldValue('corredorEmisor', fullName);
                            setFieldValue('filtroEmitterPagador.emitter', newValue?.data.id)
                            
                            const tasaDescuento = await cargarTasaDescuento(newValue?.data.id);
                            console.log(tasaDescuento?.data);
                        
                            // Verificar si tasaDescuento es undefined
                            if (!tasaDescuento) {
                              // Mostrar el mensaje de error usando Toast
                               // Mostrar toast/notificación
                               toast.error("Disculpe, el cliente seleccionado no tiene perfil de riesgo configurado. Por favor, agrege el perfil en el módulo de clientes", {
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
                            console.log(newValue?.data.id);
                            console.log(dataBrokerByClient);
                            console.log(brokerByClientFetch);
                            console.log(brokerByClientFetch?.data?.id);
                            console.log(brokerByClient);
                            setFieldValue('emitterBroker', brokerByClientFetch?.data?.id);

                            console.log(dataBills)


                        
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

                            console.log(payers)
                            console.log(values)
                            console.log(brokerByClientFetch?.data?.id,values.filtroEmitterPagador.payer)
                            if (newValue?.data.id ){
                              
                              console.log('se puede enviar fatura, estàn los dos')
                              // Cargar nuevas facturas si se ha seleccionado un nuevo emisor
                                    if (newValue) {
                                      console.log(newValue);
                                      const facturasEmisor= await cargarFacturas(newValue?.data.id,values.filtroEmitterPagador.payer);
                                      console.log(facturasEmisor)
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
                                        
                                        console.log('Pagadores filtrados:', pagadoresFiltrados);
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
                                  </Grid>

                                  {/*Selector de Pagadores*/}
                                  <Grid item xs={12} md={6}>
                                  <Autocomplete
                                              id="payer-name" // Para CSS/JS si es necesario
                                              data-testid="campo-pagador"
                                          options={values?.filteredPayers  || []}
                                          value={payers.find(p => p.id === values.nombrePagador) || null} // Buscar el objeto que coincide con el nombre
                                          isOptionEqualToValue={(option, value) => 
                                            option?.id === value?.id
                                          }
                                          getOptionLabel={(option) => option?.label || ''}
                                          onChange={async (event, newValue) => {
                                            if (!newValue) {
                                              // 1. Primero agrupamos las facturas por idCuentaInversionista
                                              const facturasPorCuenta = values.facturas.reduce((acc, factura) => {
                                                const cuentaId = factura.idCuentaInversionista;
                                                if (!acc[cuentaId]) {
                                                  acc[cuentaId] = [];
                                                }
                                                acc[cuentaId].push(factura);
                                                return acc; 
                                              }, {});
                                              console.log('Facturas agrupadas por cuenta:', facturasPorCuenta);
                                              // 2. Para cada grupo de facturas con misma cuenta, calculamos el total a restituir
                                              Object.entries(facturasPorCuenta).forEach(([cuentaId, facturas]) => {
                                                if (facturas.length > 1) { // Solo si hay más de una factura para esta cuenta
                                                  const totalRestituir = facturas.reduce(
                                                    (sum, f) => sum + f.gastoMantenimiento + f.presentValueInvestor , 
                                                    0
                                                  );
                                                  console.log(totalRestituir)
                                            
                                                  // 3. Actualizamos el monto disponible para todas las facturas de esta cuenta
                                                  values.facturas.forEach((f, index) => {
                                                    if (f.idCuentaInversionista === cuentaId) {
                                                      setFieldValue(`facturas[${index}].montoDisponibleCuenta`, 
                                                        f.montoDisponibleInfo 
                                                      );
                                                    }
                                                  });
                                                }
                                              });
                                            
                                              // 4. Resetear todas las facturas manteniendo campos del inversionista
                                              setFieldValue('facturas', values.facturas.map(f => ({
                                                // Reset general
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
                                                // Los montos disponibles ya fueron actualizados en el paso 3
                                                montoDisponibleCuenta:  f.montoDisponibleInfo || 0,
                                                montoDisponibleInfo: f.montoDisponibleInfo || 0
                                              })));
                                            
                                              // 5. Limpiar campos adicionales
                                              setFieldValue('nombrePagador', '');
                                              setFieldValue('filtroEmitterPagador.payer', '');
                                              setFieldValue('takedBills', []);
                                            
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
                                                
                                                // 4. Resetear facturas manteniendo campos del inversionista
                                                setFieldValue('facturas', values.facturas.map(f => ({
                                                  // Reset general
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
                                                  montoDisponibleInfo: f.montoDisponibleInfo || 0
                                                })));

                                                // 5. Limpiar campos adicionales
                                                setFieldValue('nombrePagador', '');
                                                setFieldValue('filtroEmitterPagador.payer', '');
                                                setFieldValue('takedBills', []);
                                              }
                                                                                      // 1. Actualizar valores del formulario
                                            setFieldValue('nombrePagador', newValue?.id || '');
                                            setFieldValue('filtroEmitterPagador.payer', newValue?.data?.document_number || '');
                                          
                                            // 2. Filtrar facturas si hay pagador seleccionado
                                            if (newValue?.data?.document_number && dataBills?.data) {
                                              const facturasFiltradas = dataBills.data.filter(
                                                factura => 
                                                  factura.payerId === newValue.data.document_number && 
                                                  Number(factura.currentBalance) > 0  // Filtro por saldo positivo
                                              );
                                              
                                              // 3. Asignar al campo takedBills
                                              setFieldValue('takedBills', facturasFiltradas);
                                              
                                              console.log('Facturas válidas (con saldo > 0):', facturasFiltradas);
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

                                    </Grid>
                          {/*Selector de Corredor Emisor */}
                              <Grid item xs={12} md={6}>
                        
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
                                      }}
                                      disabled // Deshabilitar edición manual
                                      error={touched.corredorEmisor && Boolean(errors.corredorEmisor)}
                                      helperText={touched.corredorEmisor && errors.corredorEmisor}
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
                                          Vencimiento: {factura.expirationDate ? formatDate2(factura.expirationDate) : "-- -- ----"}
                                        </Typography>
                                      </Grid>
                                      {/* Botón de eliminar */}
                                      <Grid item xs="auto" sx={{ marginLeft: '790px' }}>
                                      <IconButton onClick={() => {
                                          // 1. Obtener valores clave de la factura a eliminar
                                          const billIdEliminada = factura.billId;
                                          const cuentaInversionistaEliminada = factura.idCuentaInversionista;
                                          const valorFuturoEliminado = factura.valorFuturo || 0;
                                          const presentValueEliminado = factura.presentValueInvestor || 0;
                                          const gastoMantenimientoEliminado = factura.gastoMantenimiento || 0;

                                          // 2. Procesar facturas con mismo billId (si existe)
                                          if (billIdEliminada) {
                                            // Encontrar todas las facturas que comparten el mismo billId
                                            const facturasMismoBillId = values.facturas.filter(
                                              f => f.billId === billIdEliminada 
                                            );
                                            console.log(facturasMismoBillId)

                                            if (facturasMismoBillId.length > 0) {
                                              // Calcular nuevo saldo disponible (sumar el valor futuro eliminado)
                                              const nuevoSaldoDisponible = (factura.saldoDisponible|| 0) + valorFuturoEliminado;
                                              
                                              // Actualizar todas las facturas con el mismo billId
                                              values.facturas.forEach((f, i) => {
                                                if (f.billId === billIdEliminada && i !== index) {
                                                  setFieldValue(`facturas[${i}].saldoDisponible`, nuevoSaldoDisponible);
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
                                            console.log(facturasMismaCuenta )
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
                                            <Grid item xs={12} md={2}>
                                            <Autocomplete
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
                                                  console.log('aqui values', values)
                                                  if (!newValue) {
                                                    // 1. Obtener el billId de la factura que se está deseleccionando
                                                    const billIdDeseleccionada = factura.billId;
                                                    
                                                    // 2. Calcular el valorFuturo que se está liberando
                                                    const valorFuturoLiberado = factura.valorFuturo || 0;
                                                    
                                                  
                                                  
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
                                                      console.log(presentValueTotal)
                                                      console.log(montoDisponibleActualizado)
                                                  
                                                      values.facturas.forEach((f, i) => {
                                                        console.log(f.idCuentaInversionista, factura.idCuentaInversionista)
                                                        if (f.idCuentaInversionista=== factura.idCuentaInversionista) {
                                                          console.log('aaaa',i)
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
                                                
                                                  console.log("Factura seleccionada:", newValue);
                                                
                                                  const selectedFactura = dataBills?.data.find(f => f.billId === newValue.value);
                                                  if (!selectedFactura) return;
                                                
                                                  console.log("Datos de la factura:", selectedFactura);

                                                  function encontrarFacturasDuplicadas(facturas, billId, inversionistaId) {
                                                    // Validaciones iniciales
                                                    if (!Array.isArray(facturas)) return [];
                                                    if (!billId || !inversionistaId) return [];
                                                    
                                                    return facturas.filter(factura => {
                                                      // Verificar que la factura tenga los campos necesarios
                                                      if (!factura.billId || !factura.nombreInversionista) return false;
                                                      
                                                      // Comparar billId con la factura actual
                                                      const mismoBillId = factura.factura=== billId;
                                                      console.log(mismoBillId )
                                                      
                                                      // Comparar inversionista con el seleccionado
                                                      const mismoInversionista = factura.nombreInversionista === inversionistaId;
                                                      
                                                      return mismoBillId && mismoInversionista;
                                                    });
                                                  }
                                                
                                                  const inversionistaSeleccionado = factura.nombreInversionista// ID del inversionista seleccionado
                                                  console.log(inversionistaSeleccionado,newValue.id,factura,values.facturas)
                                                  const facturasDuplicadas = encontrarFacturasDuplicadas(
                                                    values.facturas, 
                                                    newValue.id, // la factura que estás procesando actualmente
                                                    inversionistaSeleccionado
                                                  );

                                                  console.log('Facturas duplicadas:', facturasDuplicadas);
                                                  console.log(`Total encontrado: ${facturasDuplicadas.length}`);
                                                  if(facturasDuplicadas?.length>=1 ){

                                                    console.log('caso facturas iguales un inversionista')
                                                    console.log('no se puede seleccionar inversionista')
                                                    // Mostrar error en el campo
                                                    setFieldTouched(`facturas[${index}].nombreInversionista`, true, false);
                                                    setFieldError(
                                                      `facturas[${index}].nombreInversionista`,
                                                      "No puede asignar inversionista a facturas con mismo Bill ID"
                                                    );
                                                    
                                                    // Mostrar toast/notificación
                                                    toast.error('No puede asignar el mismo inversionista a facturas agrupadas', {
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
                                                      Toast("El código de integración debe coincidir con el de la factura previa", "error");
                                                      setFieldValue(`facturas[${index}].factura`, null);
                                                    } else {

                                                      const facturaActual2 = values?.facturas[index];
                                                      const billIdAnterior = facturaActual2?.billId;
                                                      const valorFuturoAnterior = facturaActual2?.valorFuturo || 0;
                                                      const nombreInversionistaAnterior = facturaActual2?.nombreInversionista;
                                                      console.log(facturaActual2,billIdAnterior,valorFuturoAnterior,nombreInversionistaAnterior)
                                                      console.log(newValue.label)
                                                      if(billIdAnterior  && newValue.label!=billIdAnterior  ){

                                                        console.log('seleccionaste una factura distinta.')
                                                        console.log(values)
                                                        console.log(factura)

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
                                                      console.log(saldoDisponibleFacturaAnterior+valorFuturoAnterior,montoDisponibleFacturaAnterior+presentValueInvestorFacturaAnterior)
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
                                                      console.log(selectedFactura?.reBuyAvailable)
                                                      
                                                      const fractionBill = await cargarFraccionFactura(selectedFactura.id);
                                                      console.log("Fracción de factura:", fractionBill);
                                                      
                                                
                                                      const payerByBillFetch = await fetchPayer(selectedFactura.id);
                                                      console.log(payerByBillFetch);
                                                
                                                      // [MANTENIDO] Cálculo de fechas
                                                      const fechaOperacion = new Date(values?.opDate);
                                                      const expirationDate = new Date(parseISO(selectedFactura.expirationDate));
                                                
                                                      let substractDays = 0;
                                                      if (isValid(fechaOperacion) && isValid(expirationDate)) {
                                                        substractDays = differenceInDays(expirationDate, fechaOperacion);
                                                        console.log("Días de diferencia:", substractDays);
                                                      } else {
                                                        console.error("Error: Una de las fechas no es válida.");
                                                      }
                                                
                                                      // [MANTENIDO] Lógica de fracciones
                                                      const facturaActual = newValue.id;
                                                      let fraccion = fractionBill?.data?.fraction || 1;
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
                                                        
                                                        
                                                        console.log("Facturas con mismo inversionista:", facturasMismoInversionista);
                                                        if( facturasMismoInversionista.length> 1) { // 3. Calcular total de presentValueInvestor
                                                          const totalPresentValue = facturasMismoInversionista.reduce((sum, f) => {
                                                            const pv = f.presentValueInvestor ;
                                                            console.log(`Sumando PV de factura ${f.factura || 'nueva'}:`, pv);
                                                            return sum + pv;
                                                          }, 0);
                                                          
                                                          console.log("Total PresentValue acumulado:", totalPresentValue);
                                                          const totalGm = facturasMismoInversionista.reduce((sum, f) => {
                                                            return sum + (f.gastoMantenimiento);
                                                          }, 0);
                                                          console.log(totalPresentValue)
                                                          // 4. Calcular monto disponible común
                                                          montoDisponibleFinal = 
                                                          factura.montoDisponibleInfo  - totalPresentValue - totalGm-presentValueInvestor
                                                          
                                                          console.log("Monto disponible común:", montoDisponibleFinal);
                                                          
                                                          // 5. Actualizar TODAS las facturas con mismo inversionista
                                                          console.log('a')
                                                          values.facturas.forEach((f, i) => {
                                                            if (f.idCuentaInversionista === factura.idCuentaInversionista) {
                                                              setFieldValue(`facturas[${i}].montoDisponibleCuenta`, montoDisponibleFinal);
                                                              
                                                            }
                                                          });
                                                          console.log('b')
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
                                                          })}else{ console.log('sd')
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
                                                    
                                                        
                                                    
                                                          console.log(values);
                                                       
                                                        
                                                      } else {
                                                        console.log('sd')
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
                                                
                                                    
                                                      console.log(selectedFactura?.reBuyAvailable)
                                                      console.log(values);
                                                     
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
                                                
                                              />
                                              
                                              </Grid>
                                              

                                            {/* Fracción */}
                                            <Grid item xs={12} md={1}>
                                                <TextField
                                                id="Fraction-name" // Para CSS/JS si es necesario
                                                 data-testid="campo-fraccion"
                                                  label="Fracción"
                                                  fullWidth
                                                  type="number"
                                                  name="fraccion"
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
                                                id="currentBalance-name" // Para CSS/JS si es necesario
                                                  data-testid="campo-saldoDisponibleFactura"
                                                  label="Saldo Disponible en factura"
                                                  fullWidth
                                                  value={formatCurrency(values.facturas[index]?.saldoDisponible || 0)}
                                                  disabled
                                                  helperText={
                                                    `Saldo actual factura: ${factura.saldoDisponibleInfo ? formatNumberWithThousandsSeparator(Math.floor(factura.saldoDisponibleInfo)) : 0}`
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
                                                  //console.log("🔍 Comparando opción:", option);
                                                // console.log("🔍 Con el valor seleccionado:", value);
                                                  return option?.account_number === value?.account_number;
                                                }} // Para evitar warnings de MUI

                                                onChange={async (event, newValue) => {
                                                  console.log("Nuevo valor seleccionado:", newValue);
                                                  console.log("values antes:", values);
                                                  if (!newValue) {

                                                                                              // 1. Obtener el accountId de la factura que se está deseleccionando
                                                      const cuentaIdDeseleccionada = factura.idCuentaInversionista;
                                                      
                                                      // 2. Calcular el valor que se está liberando (PV + GM)
                                                      const valorLiberado = (factura.presentValueInvestor || 0) + (factura.gastoMantenimiento || 0);
                                                      console.log(cuentaIdDeseleccionada,valorLiberado )
                                                      
                                                      // 4. Buscar facturas con el mismo inversionista
                                                      const facturasMismoInversionista = values.facturas.filter(
                                                        f => f.idCuentaInversionista === cuentaIdDeseleccionada
                                                      );
                                                    
                                                      // 5. Distribuir el valor liberado a las otras facturas del mismo inversionista
                                                      facturasMismoInversionista.forEach((f, i) => {
                                                        if (factura.idCuentaInversionista === cuentaIdDeseleccionada) {
                                                          // Calcular nuevo monto disponible sumando el valor liberado
                                                          console.log(f)
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
                                                    console.log("ID del inversionista:", newValue?.data.id);
                                                
                                                    // Cargar cuentas y broker del inversionista seleccionado
                                                    const cuentas = await cargarCuentas(newValue?.data.id);
                                                    
                                                    const operations = await cargarOperationFromInvestor(newValue?.data.id);
                                                    console.log(newValue?.data.id, operations)

                                                    const tasaDescuento = await cargarTasaDescuento(newValue?.data.id);
                                                    console.log(tasaDescuento?.data);
                                                
                                                    // Verificar si tasaDescuento es undefined
                                                    //if (!tasaDescuento) {
                                                      // Mostrar el mensaje de error usando Toast
                                                    //  Toast("Disculpe, el cliente seleccionado no tiene perfil de riesgo configurado. Por favor, agrege el perfil en el módulo de clientes", "error");
                                                  //    return; // Detener la ejecución si tasaDescuento es undefined
                                                  //  }
                                                
                                                
                                                    const brokerFromInvestor = await cargarBrokerFromInvestor(newValue?.data.id);
                                                    console.log(dataAccountFromClient);
                                                    console.log("Cuentas:", cuentas);
                                                    console.log("?.data[0]?", cuentas?.data[0]);
                                                    console.log("Broker del inversionista:", brokerFromInvestor);
                                                    console.log(factura);
                                                    console.log(newValue?.data.id)
                                                

                                            
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
                                                        console.log(inversionistaId)
                                                        
                                                        // Comparar inversionista con el seleccionado
                                                        const mismoInversionista = factura.nombreInversionista === inversionistaId;
                                                        
                                                        return mismoBillId && mismoInversionista;
                                                      });
                                                    }
                                                  
                                                    // Uso:
                                                      const inversionistaSeleccionado = newValue?.data?.id; // ID del inversionista seleccionado
                                                      console.log(inversionistaSeleccionado)
                                                      const facturasDuplicadas = encontrarFacturasDuplicadas(
                                                        values.facturas, 
                                                        factura, // la factura que estás procesando actualmente
                                                        inversionistaSeleccionado
                                                      );

                                                      console.log('Facturas duplicadas:', facturasDuplicadas);
                                                      console.log(`Total encontrado: ${facturasDuplicadas.length}`);
                                                      console.log(todasFacturasInversionista.length,facturasMismoBillId.length)

                                                      if(todasFacturasInversionista.length===1){
                                                        if(facturasMismoBillId.length>1 ){
                                                          console.log('a')
                                                          
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
                                                          console.log('b')
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
                                                        console.log('caos inversionistas repetido')
                                                        console.log(facturasDuplicadas.length)
                                                        if(facturasDuplicadas.length>=1 ){

                                                          console.log('caso facturas iguales un inversionista')
                                                          console.log('no se puede seleccionar inversionista')
                                                          // Mostrar error en el campo
                                                          setFieldTouched(`facturas[${index}].nombreInversionista`, true, false);
                                                          setFieldError(
                                                            `facturas[${index}].nombreInversionista`,
                                                            "No puede asignar inversionista a facturas con mismo Bill ID"
                                                          );
                                                          
                                                          // Mostrar toast/notificación
                                                          toast.error('No puede asignar el mismo inversionista a facturas agrupadas', {
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
                                                          console.log('caso inversionista repetido pero facturas distintas')
          
                                                        console.log(cuentas)
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
                                                        console.log('caso inversionista repetido pero facturas distintas')

                                                      console.log(cuentas)
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
                                                    
                                                    console.log(cuentas)
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
                                                                                    </Grid>
                                                                                  

                                              {/* Cuenta de Inversionista */}
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
                                                      // 1. Obtener el accountId de la factura que se está deseleccionando
                                                      const cuentaIdDeseleccionada = factura.idCuentaInversionista;
                                                      
                                                      // 2. Calcular el valor que se está liberando (PV + GM)
                                                      const valorLiberado = (factura.presentValueInvestor || 0) + (factura.gastoMantenimiento || 0);
                                                      console.log(cuentaIdDeseleccionada,valorLiberado )
                                                      
                                                      // 4. Buscar facturas con el mismo inversionista
                                                      const facturasMismoInversionista = values.facturas.filter(
                                                        f => f.idCuentaInversionista === cuentaIdDeseleccionada
                                                      );
                                                    
                                                      // 5. Distribuir el valor liberado a las otras facturas del mismo inversionista
                                                      facturasMismoInversionista.forEach((f, i) => {
                                                        if (factura.idCuentaInversionista === cuentaIdDeseleccionada) {
                                                          // Calcular nuevo monto disponible sumando el valor liberado
                                                          console.log(f)
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
                                                    
                                                    console.log(facturasMismoInversionista,accountId)
                                                    facturasMismoInversionista.push(factura)
                                                    // Caso 1: Solo esta factura usa la cuenta
                                                    if (facturasMismoInversionista.length <= 1) {
                                                      console.log('caso inversionistas diferentes')
                                                      const pVI = parseFloat(factura.presentValueInvestor) || 0;
                                                      const gm = parseFloat(factura.gastoMantenimiento) || 0;
                                                      const nuevoSaldo = accountBalance - (pVI + gm);
                                                      setFieldValue(`facturas[${index}].montoDisponibleCuenta`, nuevoSaldo);
                                                    } 
                                                    // Caso 2: Múltiples facturas comparten la misma cuenta
                                                    else {
                                                      console.log('caso inversionistas iguales',facturasMismoInversionista.length )
                                                      
                                                      const totalPVIGM = facturasMismoInversionista.reduce((sum, f) => {
                                                        const pVI = parseFloat(f.presentValueInvestor)|| 0;
                                                        const gm = parseFloat(f.gastoMantenimiento) || 0;
                                                        return sum + (pVI + gm);
                                                      }, 0);

                                                      const nuevoSaldo = accountBalance - totalPVIGM;
                                                      console.log(nuevoSaldo, accountBalance ,totalPVIGM)
                                                      console.log('caso inversionistas iguales',facturasMismoInversionista)
                                                      console.log(totalPVIGM,accountBalance)
                                                      // Actualizar todas las facturas que comparten esta cuenta
                                                      values.facturas.forEach((f, i) => {
                                                        if (f.idCuentaInversionista === accountId) {
                                                          console.log(i,accountId)
                                                          setFieldValue(`facturas[${i}].montoDisponibleCuenta`, nuevoSaldo);
                                                          setFieldValue(`facturas[${index}].montoDisponibleCuenta`, nuevoSaldo);
                                                        }
                                                      });
                                                    }
                                                    console.log(values)
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

                                                  // Calcular el valor nominal (valorFuturo * porcentajeDescuento)
                                                  const valorNominal = valorFuturoManual * (factura.porcentajeDescuento || 0)/100;

                                                  // Actualizar el valor futuro
                                                  setFieldValue(`facturas[${index}].valorFuturo`, valorFuturoManual);
                                                  setFieldValue(`facturas[${index}].valorFuturoManual`, true);

                                                  // Actualizar el valor nominal
                                                  setFieldValue(`facturas[${index}].valorNominal`, valorNominal);
                                                  setFieldValue(`facturas[${index}].payedAmount`, valorNominal);
                                                  // Actualizar el saldo disponible de la factura actual
                                                  const nuevoSaldoDisponible = saldoDisponibleActual - diferenciaValorFuturo;
                                                  console.log(nuevoSaldoDisponible)
                                                  setFieldValue(`facturas[${index}].saldoDisponible`, nuevoSaldoDisponible);
                                                

                                                  // Actualizar el saldo disponible en todas las facturas con el mismo billId
                                                  values.facturas.forEach((f, i) => {
                                                    if (f.factura === factura.factura && i !== index) {
                                                      const saldoDisponiblePosterior = f.saldoDisponible || 0;
                                                      const nuevoSaldoDisponiblePosterior = saldoDisponiblePosterior - diferenciaValorFuturo;
                                                      setFieldValue(`facturas[${i}].saldoDisponible`, nuevoSaldoDisponiblePosterior, 0);
                                                    }
                                                  });
                                                  

                                                  if (values.opDate) {
                                                    console.log(factura)
                                                    const operationDays = factura.operationDays 
                                                    const presentValueInvestor = operationDays > 0 && valorNominal > 0
                                                    ? Math.round(PV(values.investorTax / 100,  operationDays / 365, 0, valorNominal, 0) * -1)
                                                    : valorFuturoManual;
                                                    // 2. Calcular el total acumulado de presentValueInvestor para el mismo inversionista
                                                    setFieldValue(`facturas[${index}].montoDisponibleCuenta`, factura.montoDisponibleInfo-presentValueInvestor, 0);
                                                    const presentValueInvesTotal = values.facturas
                                                    .filter((f, i) => 
                                                      f.idCuentaInversionista === factura.idCuentaInversionista && 
                                                      i !== index  // Excluir la factura actual del acumulado
                                                    )
                                                    .reduce((sum, f) => sum + (f.presentValueInvestor || 0), 0) 
                                                    + presentValueInvestor;  // Sumar el valor recién calculado
                                                    console.log(presentValueInvesTotal )
                                                    
                                                    const presentValueSF =  operationDays > 0 && valorNominal > 0
                                                      ? Math.round(PV(values.discountTax / 100,  operationDays / 365, 0, valorNominal, 0) * -1)
                                                      : valorFuturoManual;
                                                    console.log("DIAS en fecha FIN", operationDays,presentValueInvestor, presentValueSF)
                                                      // Calcular el presentValueInvestor total de todas las facturas del mismo inversionista
                                                  
                                                    setFieldValue(`facturas[${index}].presentValueInvestor`, presentValueInvestor); // Actualizar el valor
                                                    setFieldValue(`facturas[${index}].presentValueSF`, presentValueSF || 0); // Actualizar el valor

                                                    if(values.facturas[index].applyGm) {
                                                      setFieldValue(`facturas[${index}].gastoMantenimiento`, presentValueInvestor * 0.002);
                                                    } else {
                                                    setFieldValue(`facturas[${index}].gastoMantenimiento`, 0);} 
                                                    
                                                    //setFieldValue(`facturas[${index}].montoDisponibleCuenta`,factura.montoDisponibleInfo - presentValueInvestor || 0); // Actualizar el valor
                                                    // Actualizar el monto disponible en todas las facturas con el mismo nombreInversionista

                                              

                                                  console.log('Total presentValueInvestor para:', factura.montoDisponibleInfo-presentValueInvesTotal);
                                                
                                                    // 1. Encontrar TODAS las facturas con el mismo billId (incluyendo la actual)
                                                    const facturasMismoBillId = values.facturas.filter(item => item.idCuentaInversionista === factura.idCuentaInversionista);
                                                    const facturasMismoInvestor = values.facturas.filter(item => 
                                                      Boolean(item.idCuentaInversionista) && 
                                                      item.idCuentaInversionista === factura.idCuentaInversionista
                                                    );
                                                    console.log(facturasMismoBillId.length)
                                                    console.log(facturasMismoInvestor.length)
                                                    values.facturas.forEach((f, i) => {
                                                      if (f.idCuentaInversionista=== factura.idCuentaInversionista && f.idCuentaInversionista ) {
                                                        console.log('a')
                                                        console.log('PresentValueInvestor actual:', presentValueInvestor);
                                                        console.log('PresentValueInvestor total acumulado:', presentValueInvesTotal);
                                                        console.log(f.montoDisponibleInfo )
                                                        const montoDisponibleActualizado = f.montoDisponibleInfo  - presentValueInvesTotal;
                                                        console.log(montoDisponibleActualizado)
                                                        setFieldValue(`facturas[${i}].montoDisponibleCuenta`, montoDisponibleActualizado, 0);
                                                        console.log(i)
                                                      } else if (f.idCuentaInversionista!== factura.idCuentaInversionista && f.idCuentaInversionista )  {
                                                        console.log('b')
                                                        
                                                    }});      
                                                    console.log(factura.idCuentaInversionista)  
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
                                                  
                                                  console.log("Raw:", rawValue, "Parsed:", parsedValue, "Clamped:", clampedValue);
            
                                                // Validar y establecer el porcentaje de descuento
                                                let value = e.target.value ? Math.min(Math.max(Number(e.target.value), 0), 100) : 0;
                                                console.log(value)
                                                setFieldValue(`facturas[${index}].porcentajeDescuento`, e.target.value);

                                                // Calcular nuevo valor nominal
                                                const valorFuturo = factura.valorFuturo || 0;
                                                const nuevoValorNominal = valorFuturo * ((value / 100));
                                                setFieldValue(`facturas[${index}].valorNominal`, nuevoValorNominal);
                                                setFieldValue(`facturas[${index}].payedAmount`, nuevoValorNominal);
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
                                                const nuevaTasaDescuento = e.target.value;
                                                
                                                // 1. Actualizar la tasa de descuento global
                                                setFieldValue('discountTax', nuevaTasaDescuento);

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

                                                    console.log(`Actualizando factura ${i}:`, presentValueSF);
                                                    
                                                    // 5. Actualizar el presentValueSF para cada factura
                                                    setFieldValue(`facturas[${i}].presentValueSF`, presentValueSF);

                                                    // 6. Recalcular comisionSF si es necesario (diferencia entre presentValueInvestor y presentValueSF)
                                                    if (f.presentValueInvestor) {
                                                      const comisionSF = f.presentValueInvestor - presentValueSF;
                                                      setFieldValue(`facturas[${i}].comisionSF`, comisionSF  || 0);
                                                    }
                                                    console.log(factura.tasaDescuentoPR)
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
                                                // Validaciones adicionales si son necesarias
                                                if (e.target.value < 0) {
                                                  setFieldValue('discountTax', 0);
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
                                                console.log(nuevoValorNominal)
                                                
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
                                              
                                                  console.log("DIAS en fecha FIN", operationDays, newPresentValueInvestor, newPresentValueSF);

                                                  console.log('comisionSF',newPresentValueInvestor-newPresentValueSF)
                                                  
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
                                              InputLabelProps={{ shrink: true,min: 0, max: 100  }}
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
                                                  
                                                  console.log('Fecha seleccionada:', parsedDate);
                                                  setFieldValue(`facturas[${index}].fechaFin`, parsedDate);
      
                                                console.log(startOfDay(newValue), startOfDay(values.opDate));
                                                
                                                // Calcular operationDays si opDate está definido
                                                if (values.opDate) {
                                                  const operationDays = differenceInDays(startOfDay(newValue), startOfDay(values.opDate));
                                                  console.log(operationDays);
                                                  setFieldValue(`facturas[${index}].operationDays`, operationDays);
                                                  
                                                  const presentValueInvestor = operationDays > 0 && factura.valorNominal > 0
                                                    ? Math.round(PV(values.investorTax / 100, operationDays / 365, 0, -factura.valorNominal, 0) )
                                                    : factura.valorFuturo;
                                              
                                                  const presentValueSF = operationDays > 0 && factura.valorNominal > 0
                                                    ? Math.round(PV(values.discountTax / 100, operationDays / 365, 0,-factura.valorNominal, 0) )
                                                    : factura.currentBalance;
                                                  
                                                  console.log("DIAS en fecha FIN", operationDays, presentValueInvestor, presentValueSF);
                                                  setFieldValue(`facturas[${index}].presentValueInvestor`, presentValueInvestor || 0);
                                                  setFieldValue(`facturas[${index}].presentValueSF`, presentValueSF || 0);
                                                  setFieldValue(`facturas[${index}].comisionSF`, presentValueInvestor- presentValueSF || 0);
                                                  console.log(factura.valorNominal- presentValueSF)
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

                                                
                                                console.log(factura.operationDays)
                                                  const nuevosDiasOperacion = parseFloat(e.target.value); // Convertir a número
                                                  setFieldValue(`facturas[${index}].operationDays`, nuevosDiasOperacion); // Actualizar el valor

                                                  const presentValueInvestor = nuevosDiasOperacion > 0 && factura.valorNominal > 0
                                                        ? Math.round(PV(values.investorTax / 100,  nuevosDiasOperacion / 365, 0, factura.valorNominal, 0) * -1)
                                                        : factura.valorFuturo;

                                                const presentValueSF =  nuevosDiasOperacion > 0 && factura.valorNominal > 0
                                                  ? Math.round(PV(values.discountTax / 100,  nuevosDiasOperacion / 365, 0, factura.valorNominal, 0) * -1)
                                                  : factura.currentBalance;
                                                console.log("DIAS", nuevosDiasOperacion,presentValueInvestor, presentValueSF)
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
                                <Button variant="contained" sx={{ marginLeft: 'auto' }} onClick={() => push(
          

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
                                        fechaFin: `${new Date()}`,
                                        diasOperaciones: 0,
                                        operationDays: 0,
                                        comisionSF: 0,
                                        gastoMantenimiento: 0,
                                        fechaOperacion: `${new Date().toISOString().substring(0, 10)}`,
                                        fechaExpiracion: `${new Date().toISOString().substring(0, 10)}`,
                                        opExpiration: `${new Date().toISOString().substring(0, 10)}`,
                                        presentValueInvestor:0,
                                        presentValueSF:0,
                                        montoDisponibleInfo:0,
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
                            <Dialog  open={isModalOpen} PaperProps={{ sx: { borderRadius: "10px", textAlign: "center", p: 3 } }}>
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
                                         onClose={() => setOpenEmitterBrokerModal(false)}
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
                            {/* Debug */}
                          {process.env.NODE_ENV === 'development' && (
                            <div style={{ marginTop: 20 }}>
                              <h4>Errores:</h4>
                              <pre>{JSON.stringify(errors, null, 2)}</pre>
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