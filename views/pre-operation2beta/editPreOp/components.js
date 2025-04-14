// components/RegisterOperationForm.js
import React, { useEffect, useState,useMemo } from "react";
import { InputAdornment, Box, Modal, Typography, Switch, TextField, Button, Grid, Autocomplete, Accordion, AccordionSummary, AccordionDetails, Tooltip, IconButton } from '@mui/material';
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"; // Icono del dólar
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import esLocale from 'date-fns/locale/es';
import { Formik, Form, FieldArray } from 'formik';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import { Dialog,DialogContent, DialogTitle,DialogActions,CircularProgress} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InfoIcon from '@mui/icons-material/Info';
import { Bills, GetBillFraction,GetRiskProfile, payerByBill,BrokerByClient,AccountsFromClient,UpdateOperation  } from "./queries";
import { useFetch } from "@hooks/useFetch";
import { PV } from "@formulajs/formulajs";
import { CheckCircle, Error } from "@mui/icons-material";
import { addDays, differenceInDays, parseISO, set, isValid } from "date-fns";
export const ManageOperationC = ({
  opId,
  emitters,
  investors,
  dataDetails,
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
users,
 

}) => {
  console.log(success)
  console.log('data details',dataDetails)
  console.log(investors)
  const emisores = emitters;
 console.log(payers)
  const tipoOperaciones = ['Compra Titulo', 'Lorem Ipsum', 'Lorem Ipsum'];
  console.log(users)

  // Encontrar el usuario que coincide con dataDetails.user_id
const usuarioEncontrado = users?.data?.find(user => user.id === dataDetails?.data?.user_created_at);

const usuarioEncontradoEdit = users?.data?.find(user => user.id === dataDetails?.data?.user_updated_at);
console.log(usuarioEncontrado,usuarioEncontradoEdit)
console.log(dataDetails?.data?.created_at, dataDetails?.data?.updated_at);

const createdAt = new Date(dataDetails?.data?.created_at);
const updatedAt = dataDetails?.data?.updated_at ? new Date(dataDetails?.data?.updated_at) : null;

const opcionesFormato = {
  dateStyle: 'short',
  timeStyle: 'medium'
};

const zonaHoraria = Intl.DateTimeFormat().resolvedOptions().timeZone;

const createdAtLocal = createdAt.toLocaleString(undefined, opcionesFormato);
const updatedAtLocal = updatedAt ? updatedAt.toLocaleString(undefined, opcionesFormato) : null;

const tooltipText = `
🕒 Creado el: ${createdAtLocal} (${zonaHoraria})
🛠️ Última actualización: ${updatedAtLocal ? `${updatedAtLocal} (${zonaHoraria})` : 'No ha sido actualizado'}
`;
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
  // get the payer of the bill
    const {
      fetch: fetchPayer,
      loading: loadingPayer,
      error: errorPayer,
      data: dataPayer,
    } = useFetch({ service: payerByBill, init: false });
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



  const initialValues = {
    amount: 0,
    applyGm: false,
    bill: "",
    billFraction: 0,
    client: "",
    clientAccount: "",
    commissionSF: 0,
    filtroEmitterPagador:{emitter:"",payer:""},
    takedBills:"",
    filteredPayers:"",
    DateBill: `${new Date().toISOString().substring(0, 10)}`,
    DateExpiration: `${new Date().toISOString().substring(0, 10)}`,
    discountTax: 0,
    emitter: "",
    emitterBroker: "",
    cuentaInversionista: '',
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


    

  

  const [isRecompra, setIsRecompra] = useState(false); // Estado para el aviso de Recompra
  const [facturasFiltradas, setFacturasFiltradas] = useState([]); // Facturas filtradas por emisor
  const [cuentasFiltradas, setCuentasFiltradas] = useState([]); // Cuentas filtradas por inversionista
  const [initialPayer, setInitialPayer] = useState(null);
  const [initialPayerBills, setInitialPayerBills] = useState(null);
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


  // Función para convertir una cadena ISO a fecha local
  const parseDateToLocal = (dateString) => {
    if (!dateString) return null; // Manejar casos donde dateString sea null o undefined
  
    // Crear un objeto Date a partir de la cadena ISO
    const date = new Date(dateString);
  
    // Ajustar la fecha a la zona horaria local sin restar el offset
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
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

  
  const cargarFacturas = async (emisor, pagadorId = null) => {
    if (!emisor) {
      setFacturasFiltradas([]);
      return [];
    }
  
    const facturas  = fetchBills(emisor);

 
    
   //S setFacturasFiltradas(filtradas);
    return facturas; // Retorna directamente el array filtrado
  };
  

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

const [filteredPayers, setFilteredPayers] = useState([]);
const [filteredPayersBills, setFilteredPayerBills] = useState([]);
const [filteredAcountsInvestor, setAcountsInvestor] = useState([]);

// Efecto para cargar pagadores filtrados
useEffect(() => {
  console.log('Emitter ID:', dataDetails?.data?.emitter?.id);
  console.log('Payers disponibles:', payers);
 // 1. Establecer el pagador inicial inmediatamente si existe en dataDetails
 if (dataDetails?.data?.payer) {
  const payerFromDetails = {
    id: dataDetails.data.payer.id,
    data: {
      document_number: dataDetails.data.payer.document_number,
      social_reason: dataDetails.data.payer.social_reason,
      first_name: dataDetails.data.payer.first_name,
      last_name: dataDetails.data.payer.last_name
    }
  };
  setInitialPayer(payerFromDetails);

}
  const loadFilteredPayers = async () => {
    const emitterId = dataDetails?.data?.emitter?.id;
    
    if (!emitterId) {
      console.log('No hay emitter ID - limpiando filteredPayers');
      setFilteredPayers([]);
      return;
    }

    try {
      console.log('Cargando facturas para emitter:', emitterId);
      const facturasEmisor = await cargarFacturas(emitterId);
      console.log('Facturas recibidas:', facturasEmisor);

      if (!facturasEmisor?.data?.length) {
        console.log('No hay facturas válidas');
        setFilteredPayers([]);
        return;
      }

      const facturasConSaldo = facturasEmisor.data.filter(
        f => Number(f.currentBalance) > 0
      );
      console.log('Facturas con saldo:', facturasConSaldo);

      const payerIdsUnicos = [...new Set(
        facturasConSaldo.map(f => f.payerId).filter(Boolean)
      )];
      console.log('IDs de pagadores únicos:', payerIdsUnicos);

      const pagadoresFiltrados = payers?.filter(p => 
        p?.data?.document_number && 
        payerIdsUnicos.includes(p.data.document_number)
      ) || [];
      console.log('Pagadores filtrados:', pagadoresFiltrados);

      setFilteredPayers(pagadoresFiltrados);
      
    } catch (error) {
      console.error('Error en loadFilteredPayers:', error);
      setFilteredPayers([]);
    }
  };

  loadFilteredPayers();
}, [dataDetails?.data?.emitter?.id, payers]); // Dependencias específicas

// Combinar el pagador inicial con los filtrados
const allPayers = useMemo(() => {
  if (!initialPayer) return filteredPayers;
  // Evitar duplicados
  const existsInFiltered = filteredPayers.some(p => 
    p.data.document_number === initialPayer.data.document_number
  );
  return existsInFiltered ? filteredPayers : [initialPayer, ...filteredPayers];
}, [initialPayer, filteredPayers]);


// Combinar el pagador inicial con los filtrados

// Efecto para cargar bills con pagadores filtrados
useEffect(() => {
  console.log('Emitter ID:', dataDetails?.data?.emitter?.id);
  console.log('Payers disponibles:', payers);
 // 1. Establecer el pagador inicial inmediatamente si existe en dataDetails
 if (dataDetails?.data?.bill) {
  const payerFromDetails = {
    id: dataDetails.data.bill.id,
    data: {
      billId: dataDetails.data.bill.billId,
      
    }
  };
  setInitialPayer(payerFromDetails);

}
  const loadBillsByPayers = async () => {
    const emitterId = dataDetails?.data?.emitter?.id;
    const document_numberPayer = dataDetails?.data?.payer?.document_number;
    console.log(document_numberPayer)
    if (!emitterId) {
      console.log('No hay emitter ID - limpiando filteredPayers');
      setFilteredPayerBills([]);
      return;
    }

    try {
      console.log('Cargando facturas para emitter:', emitterId);
      const facturasEmisor = await cargarFacturas(emitterId);
      console.log('Facturas recibidas:', facturasEmisor);

      if (!facturasEmisor?.data?.length) {
        console.log('No hay facturas válidas version pagador');
        setFilteredPayerBills([]);
        return;
      }
      
      const facturasFiltradas = facturasEmisor.data.filter(
        factura => 
          factura.payerId === document_numberPayer && 
          Number(factura.currentBalance) > 0  // Filtro por saldo positivo
      );
      console.log('filtradas por pagador',facturasFiltradas)
      setFilteredPayerBills(facturasFiltradas);
     
      
    } catch (error) {
      console.error('Error en loadFilteredPayers:', error);
      setFilteredPayerBills([]);
    }
  };

  loadBillsByPayers();
}, [dataDetails?.data?.emitter?.id]); // Dependencias específicas


// Efecto para cargar bills con pagadores filtrados
useEffect(() => {
  console.log('Emitter ID:', dataDetails?.data?.emitter?.id);
  console.log('Payers disponibles:', payers);
 // 1. Establecer el pagador inicial inmediatamente si existe en dataDetails
 if (dataDetails?.data?.bill) {
  const payerFromDetails = {
    id: dataDetails.data.bill.id,
    data: {
      billId: dataDetails.data.bill.billId,
      
    }
  };
  setInitialPayer(payerFromDetails);

}
  const loadAccountByInvestor = async () => {
    const emitterId = dataDetails?.data?.investor?.id;
    const document_numberPayer = dataDetails?.data?.payer?.document_number;
    console.log(document_numberPayer)
    if (!emitterId) {
      console.log('No hay emitter ID - limpiando filteredPayers');
      setAcountsInvestor([]);
      return;
    }

    try {
      console.log('Cargando cuentas por inversor:', emitterId);
      const facturasEmisor = await cargarCuentas(emitterId);
      console.log('cuentas recibidas:', facturasEmisor);

      if (!facturasEmisor?.data?.length) {
        console.log('No hay facturas válidas version pagador');
        setAcountsInvestor([]);
        return;
      }
      
     
      setAcountsInvestor(facturasEmisor);
     
      
    } catch (error) {
      console.error('Error en loadCuentasByInvestor:', error);
      setAcountsInvestor([]);
    }
  };

  loadAccountByInvestor();
}, [dataDetails?.data?.investor?.id]); // Dependencias específicas

console.log(initialValues2)
const mapDataDetailsToInitialValues = (dataDetails) => {
  if (!dataDetails?.data) return initialValues;

  return {
    amount: dataDetails.data.amount || 0,
    applyGm: dataDetails.data.applyGm || false,
    billBack:dataDetails.data.bill?.id|| "",
    bill: dataDetails.data.bill?.billId || "",
    billFraction: dataDetails.data.billFraction || 0,
    client: dataDetails.data.clientAccount?.account_number || "",
    clientId:dataDetails.data.investor?.id || "",
    clientAccount: dataDetails.data.clientAccount?.id || "",
    accountsInvestorArray:filteredAcountsInvestor,
    commissionSF: dataDetails.data.commissionSF || 0,
    filtroEmitterPagador: {
      emitter: dataDetails.data.emitter?.id || "",
      payer: dataDetails.data.payer?.document_number || ""
    },
    emitterBrokerInfo: {
      emitterBrokerid: dataDetails.data.emitterBroker?.id || "",
      emitterBrokerName: dataDetails?.data?.emitterBroker?.social_reason || 
      `${dataDetails?.data?.emitterBroker?.first_name || ''} ${dataDetails?.data?.emitterBroker?.last_name || ''}`.trim() || 
      ""
    },
    investorBrokerInfo: {
      investorBrokerid: dataDetails.data.investorBroker?.id || "",
      investorBrokerName: dataDetails?.data?.investorBroker?.social_reason || 
      `${dataDetails?.data?.investorBroker?.first_name || ''} ${dataDetails?.data?.investorBroker?.last_name || ''}`.trim() || 
      ""
    },
    investorAccountInfo: {
      investorAccountid: dataDetails.data.clientAccount?.id || "",
      investorAccountMonto: dataDetails.data.clientAccount?.balance || ""
    },
    montoDisponibleCuenta:dataDetails.data.clientAccount?.balance,
    saldoDisponible:dataDetails.data.bill?.currentBalance-dataDetails.data?.amount,
    montoDisponibleInfo:dataDetails.data.clientAccount?.balance,
    billsComplete:dataDetails.data.bill,
    takedBills: filteredPayersBills,
    filteredPayers: "",
    DateBill: dataDetails.data.DateBill || new Date().toISOString().substring(0, 10),
    DateExpiration: dataDetails.data.DateExpiration || new Date().toISOString().substring(0, 10),
    discountTax: dataDetails.data.discountTax || 0,
    emitter: dataDetails.data.emitter?.id || "",
    emitterBroker: dataDetails.data.emitterBroker?.id || "",
    cuentaInversionista: dataDetails.data.investor?.id || '',
    GM: dataDetails.data.GM || 0,
    id: dataDetails.data.id || "",
    investor: dataDetails.data.investor?.id || "",
    investorInfo:dataDetails.data.investor,
    investorBroker: dataDetails.data.investorBroker?.id || "",
    investorProfit: dataDetails.data.investorProfit || 0,
    investorTax: dataDetails.data.investorTax || 0,
    opDate: dataDetails.data.opDate || new Date().toISOString().substring(0, 10),
    operationDays: dataDetails.data.operationDays || 0,
    opExpiration: dataDetails.data.opExpiration || new Date().toISOString().substring(0, 10),
    opId: dataDetails.data.opId || null,
    opType: dataDetails.data.opType?.id || "",
    opTypeInfo: dataDetails.data.opType,
    payedAmount: dataDetails.data.payedAmount || 0,
    payedPercent: dataDetails.data.payedPercent || 0,
    payer: dataDetails.data.payer?.id || "",
    arrayPayers:allPayers,
    presentValueInvestor: dataDetails.data.presentValueInvestor || 0,
    presentValueSF: dataDetails.data.presentValueSF || 0,
    probableDate: dataDetails.data.probableDate || new Date().toISOString().substring(0, 10),
    status: dataDetails.data.status || 0,
    billCode: dataDetails.data.bill?.billId || "",
    isReBuy: dataDetails.data.isRebuy || false,
    massive: false,
    integrationCode: dataDetails.data.bill?.integrationCode || ""
  };
};

const initialValues2 = mapDataDetailsToInitialValues(dataDetails);
console.log(initialValues2)

console.log(filteredAcountsInvestor)

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
const handleSubmit = async (values, actions) => {
  try {
    await onFormSubmit(values, actions);
  } catch (error) {
    // Esto evita que el error se propague a React
    console.error("Error en handleSubmit:", getErrorMessage(error));
    actions.setSubmitting(false);
  }
};

const renderNombreUsuario = (usuario) => (
  <Box component="span" sx={{ color: 'text.primary', fontWeight: 500 }}>
    {usuario?.social_reason || `${usuario?.first_name} ${usuario?.last_name}`}
  </Box>
);
  return (
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={esLocale}>
              {/* Para mostrar los toast */}
              <ToastContainer position="top-right" autoClose={5000} />
<Box sx={{ padding: 9, backgroundColor: 'white', borderRadius: 1, boxShadow: 1 }}>
                  
<Box
  sx={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 3,
    paddingBottom: 2,
    borderBottom: '1px solid #e0e0e0',
  }}
>
  <Typography variant="h4" gutterBottom>
    Editar Operación
  </Typography>

  <Box sx={{ display: 'flex', alignItems: 'center' }}>
    {usuarioEncontrado || usuarioEncontradoEdit ? (
      <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
        {usuarioEncontrado?.id === usuarioEncontradoEdit?.id ? (
          <>Creado y editado por: {renderNombreUsuario(usuarioEncontrado)}</>
        ) : (
          <>
            {usuarioEncontrado && <>Creado por: {renderNombreUsuario(usuarioEncontrado)}</>}
            {usuarioEncontrado && usuarioEncontradoEdit && <br />}
            {usuarioEncontradoEdit && <>Editado por: {renderNombreUsuario(usuarioEncontradoEdit)}</>}
          </>
        )}
      </Typography>
    ) : (
      <Typography variant="subtitle1" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
        Sin información de autoría
      </Typography>
    )}

    {/* Tooltip pegado al texto */}
    {(usuarioEncontrado || usuarioEncontradoEdit) && (
      <Tooltip
        title={<span style={{ whiteSpace: 'pre-line' }}>{tooltipText}</span>}
        arrow
        placement="top"
        PopperProps={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 4], // un poco de separación vertical
              },
            },
          ],
        }}
      >
        <IconButton size="small" sx={{ ml: 0.5 }}>
          <InfoIcon fontSize="small" color="action" />
        </IconButton>
      </Tooltip>
    )}
  </Box>
</Box>

                          <Formik 
                          initialValues={initialValues2}
                          validationSchema={validationSchema}
                          onSubmit={handleConfirm}
                          enableReinitialize={true} >
                            {/* {({ values, setFieldValue, touched, errors, handleBlur }) => ( */}
                            {({ values, setFieldValue, touched, errors, handleBlur,setTouched ,setFieldTouched,setFieldError}) => (
                              <Form>
                              <Grid container spacing={2}>
                              <Grid item xs={12} md={3}>
         
                                <Box
                                  sx={{
                                    width: '100%',
                                    height: '52px', // Altura estándar de un TextField de Material-UI
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '4px', // Bordes redondeados como un TextField
                                    backgroundColor: dataDetails?.data?.isRebuy ? 'warning.light' : 'success.light',
                                    color: 'common.white',
                                    fontWeight: 'bold',
                                    border: '1px solid',
                                    borderColor: dataDetails?.data?.isRebuy ? 'warning.main' : 'success.main',
                                  }}
                                >
                                  {dataDetails?.data?.isRebuy ? 'Recompra' : 'No recompra'}
                                </Box>
                              </Grid>
                                {/* Primera fila: Número de Operación, Fecha de Operación y Tipo de Operación */}
                                <Grid item xs={12} md={2}>
                                  
                                          <TextField
                                            label="Número de Operación *"
                                            fullWidth
                                            type="number"
                                            value={values?.opId}
                                            name="opId"
                                            InputLabelProps={{
                                              shrink: true, // Esto fuerza al label a permanecer arriba
                                            }}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setFieldValue('opId', value);
                                              setIsRecompra(checkRecompra(value)); // Verifica si es recompra
                                            }}
                                            onBlur={handleBlur}
                                            error={touched.opId && Boolean(errors.opId)}
                                            helperText={touched.opId && errors.opId}
                                            inputProps={{ min: 0 }} // Asegura que no se ingresen números negativos
                                            disabled
                                          />
                                          {/* Aviso de Recompra */}
                                          {isRecompra && (
                                            <Typography variant="body2" color="warning.main" sx={{ mt: 0.5 }}>
                                              Operación de Recompra
                                            </Typography>
                                          )}
                                        </Grid>
                                        <Grid item xs={12} md={2}>
                                          <DatePicker
                                            label="Fecha de Operación *"
                                            value={dataDetails?.data?.opDate}
                                            name="opDate"
                                            onChange={(newValue) => setFieldValue('opDate',  parseDateToLocal(newValue))}
                                            renderInput={(params) => <TextField {...params} fullWidth />}
                                          />
                                        </Grid>
                                        <Grid item xs={12} md={5}>
                                        <Autocomplete
                                              options={typeOperation?.data || []}
                                              getOptionLabel={(option) => option.description || ''}
                                              value={typeOperation?.data?.find(op => op.description === values?.opTypeInfo?.description) || null}
                                              onChange={async (event, newValue) => {
                                                console.log(newValue);
                                                setFieldValue('opType', newValue?.id || '');  
                                              }}
                                              isOptionEqualToValue={(option, value) => option.id === value?.id}
                                              renderInput={(params) => (
                                                <TextField 
                                                  {...params} 
                                                  label="Tipo de Operación *" 
                                                  name="opType"
                                                  fullWidth 
                                                  error={touched.opType && Boolean(errors.opType)}
                                                  helperText={touched.opType && errors.opType}
                                                />
                                              )}
                                            />
                                  </Grid>
                        
               
                                            <Grid item xs={12} md={4}>
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
                                                  // Limpiar campos
                                                  setFieldValue('emitter', null);
                                                  setFieldValue('corredorEmisor', '');
                                                  setFieldValue('emitterBroker', null);
                                                  setFieldValue('investorTax', null);
                                                  setFieldValue('discountTax', null);
                                                  setFieldValue('filteredPayers', '');
                                                  setFieldValue('nombrePagador', '');
                                                  return;
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
                                                      f => Number(f.currentBalance) > 0
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
                                              </Grid>
                              
                                              {/* Selector de Pagadores */}
                                                <Grid item xs={12} md={4}>
                                                  <Autocomplete
                                                    options={Array.isArray( values?.arrayPayers) ?  values?.arrayPayers : []}
                                                    value={
                                                      Array.isArray( values?.arrayPayers) 
                                                        ? values?.arrayPayers.find(payer => 
                                                            payer?.data?.document_number === (values?.filtroEmitterPagador?.payer || values?.filtroEmitterPagador?.payer)
                                                          ) || null
                                                        : null
                                                    }
                                                    isOptionEqualToValue={(option, value) => 
                                                      option?.data?.document_number === value?.data?.document_number
                                                    }
                                                    getOptionLabel={(option) => {
                                                      if (!option?.data) return 'Sin nombre';
                                                      return option.data.social_reason || 
                                                        `${option.data.first_name || ''} ${option.data.last_name || ''}`.trim();
                                                    }}
                                                    onChange={async (event, newValue) => {
                                                      setFieldValue('nombrePagador', newValue?.id || '');
                                                      setFieldValue('filtroEmitterPagador.payer', newValue?.data?.document_number || '');
                                                    
                                                      if (newValue?.data?.document_number && Array.isArray(dataBills?.data)) {
                                                        const facturasFiltradas = dataBills.data.filter(factura => 
                                                          factura.payerId === newValue.data.document_number && 
                                                          Number(factura.currentBalance) > 0
                                                        );
                                                        setFieldValue('takedBills', facturasFiltradas);
                                                      } else {
                                                        setFieldValue('takedBills', []);
                                                      }
                                                    }}
                                                    renderInput={(params) => (
                                                      <TextField
                                                        {...params}
                                                        label="Nombre Pagador *"
                                                        fullWidth
                                                        name="nombrePagador"
                                                        InputProps={{
                                                          ...params.InputProps,
                                                          endAdornment: (
                                                            <>
                                                              {!values?.arrayPayers ? <CircularProgress size={20} /> : null}
                                                              {params.InputProps.endAdornment}
                                                            </>
                                                          )
                                                        }}
                                                        error={touched.nombrePagador && Boolean(errors.nombrePagador)}
                                                        helperText={touched.nombrePagador && errors.nombrePagador}
                                                      />
                                                    )}
                                                  />
                                                </Grid>
                                              {/*Selector de Corredor Emisor */}
                                              <Grid item xs={12} md={4}>
                                              
                                          <TextField
                                            label="Corredor Emisor *"
                                            fullWidth
                                            name="corredorEmisor"
                                            value={
                                              dataDetails?.data?.emitterBroker?.social_reason || 
                                              `${dataDetails?.data?.emitterBroker?.first_name || ''} ${dataDetails?.data?.emitterBroker?.last_name || ''}`.trim() || 
                                              ""
                                            }
                                            onChange={(event) => {
                                              setFieldValue('corredorEmisor', event.target.value); // Actualiza el valor
                                              setFieldTouched('corredorEmisor', true); // Marca el campo como "touched"
                                            }}
                                            disabled // Deshabilitar edición manual
                                            error={touched.corredorEmisor && Boolean(errors.corredorEmisor)}
                                            helperText={touched.corredorEmisor && errors.corredorEmisor}
                                          />
                              
                                          </Grid>

                                      {/* Factura */}
                                      
                              <Grid item xs={12}>
                                                {/* Contenedor principal para el botón de eliminar y el acordeón */}
                                <Grid container alignItems="flex-start" spacing={2}>
                                  
                                  {/* Acordeón */}
                                  <Grid item xs>
                                  
                                    
                                    
                                    <Grid container spacing={3}>
                                    <Grid item xs={12} md={2}>
                                    <Autocomplete
                                      options={(values?.takedBills || []).map(factura => ({
                                        label: `${factura.billId}`,
                                        value: factura.billId, // Usamos billId como valor clave
                                        rawData: factura
                                      }))}
                                      getOptionLabel={(option) => (typeof option === 'string' ? option : option?.label) || ''}
                                      isOptionEqualToValue={(option, value) => {
                                        // Comparación robusta que maneja ambos casos:
                                        // - Cuando value es el objeto completo (selección nueva)
                                        // - Cuando es solo el billId (valor inicial)
                                        return option?.value === (value?.value || value);
                                      }}
                                      value={
                                        // Primero intenta encontrar en options
                                        (values?.takedBills || [])
                                          .find(f => f.billId === values?.bill)
                                          ? {
                                              label: `${values?.bill}`,
                                              value: values?.bill,
                                              rawData: (values?.takedBills || []).find(f => f.billId === values?.bill)
                                            }
                                          : null
                                      }
                                      onChange={async (event, newValue) => {
                                        console.log("Nuevo valor seleccionado:", newValue); // Debug
                                        if (!newValue) {
                                          await Promise.all([
                                            setFieldValue('bill', ''),
                                            setFieldValue('billCode', ''),
                                            setFieldValue('integrationCode', ''),
                                            setFieldValue('isReBuy', false),
                                            setFieldValue('DateBill', new Date().toISOString().substring(0, 10)),
                                            setFieldValue('DateExpiration', new Date().toISOString().substring(0, 10))
                                          ]);
                                          return;
                                        }

                                        const selectedFactura = newValue.rawData;
                                        console.log("Datos completos de la factura:", selectedFactura); // Debug
                                        
                                        try {
                                          if (values.integrationCode && values.integrationCode !== selectedFactura?.integrationCode) {
                                            toast.error("El código de integración debe coincidir con el de la factura previa");
                                            return;
                                          }
                                          const billId = newValue?.value || null;
                                          setFieldValue('bill', billId);
                                          // Actualización atómica de todos los campos
                                          const fractionBill = await cargarFraccionFactura(selectedFactura.id);
                                          console.log(fractionBill)
                                          let fraccion = fractionBill?.data?.fraction || 1;
                                          await Promise.all([
                                            setFieldValue('billFraction', fraccion ),
                                            
                                            setFieldValue('billBack', selectedFactura.id),
                                            setFieldValue('billsComplete', selectedFactura),
                                            setFieldValue('billCode', selectedFactura.billId),
                                            setFieldValue('integrationCode', selectedFactura.integrationCode || ""),
                                            setFieldValue('isReBuy', selectedFactura.reBuyAvailable || false),
                                            setFieldValue('DateBill', selectedFactura.dateBill),
                                            setFieldValue('DateExpiration', selectedFactura.expirationDate),
                                            
                                            // Actualizaciones financieras
                                            (async () => {
                                              const valorFuturoCalculado = selectedFactura.currentBalance;
                                              const presentValueInvestor = Math.round(
                                                PV(values.investorTax / 100, values.operationDays / 365, 0, valorFuturoCalculado, 0) * -1
                                              );
                                              const presentValueSF = Math.round(
                                                PV(values.discountTax / 100, values.operationDays / 365, 0, valorFuturoCalculado, 0) * -1
                                              );
                                              
                                              await Promise.all([
                                                setFieldValue('amount', selectedFactura.currentBalance),
                                                setFieldValue('payedAmount', selectedFactura.currentBalance),
                                                setFieldValue('presentValueInvestor', presentValueInvestor),
                                                setFieldValue('presentValueSF', presentValueSF),
                                                setFieldValue('saldoDisponible',0),
                                                setFieldValue('montoDisponibleCuenta',values?.investorAccountInfo?.investorAccountMonto- presentValueInvestor-values?.GM),
                                                setFieldValue('commissionSF', presentValueInvestor - presentValueSF),
                                                setFieldValue('investorProfit', selectedFactura.currentBalance- presentValueInvestor )
                                              ]);

                                              const gmValue = presentValueInvestor* 0.002;
                                              setFieldValue('GM', gmValue)
                                            })()
                                          ]);
                                          console.log(values)

                                          // Actualización del pagador (si aplica)
                                          if (selectedFactura.payerId && values.arrayPayers) {
                                            const payerInfo = values.arrayPayers.find(p => 
                                              p?.data?.document_number === selectedFactura.payerId
                                            );
                                            if (payerInfo) {
                                              await Promise.all([
                                                setFieldValue('filtroEmitterPagador.payer', selectedFactura.payerId),
                                                setFieldValue('payer', payerInfo.id)
                                              ]);
                                            }
                                          }

                                        } catch (error) {
                                          console.error("Error detallado:", error);
                                          toast.error(`Error al cargar los datos: ${error.message}`);
                                        }
                                      }}
                                      
                                      renderInput={(params) => (
                                        <TextField 
                                          {...params} 
                                          label="Número de Factura *" 
                                          fullWidth
                                          InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                              <>
                                                {!values?.takedBills ? <CircularProgress size={20} /> : null}
                                                {params.InputProps.endAdornment}
                                              </>
                                            )
                                          }}
                                          error={touched.bill && Boolean(errors.bill)}
                                          helperText={touched.bill && errors.bill}
                                        />
                                      )}
                                      noOptionsText="No hay facturas disponibles"
                                    />
                                    </Grid>

                                        <Grid item xs={12} md={1}>
                                          <TextField
                                            label="Fracción"
                                            fullWidth
                                            type="number"
                                            value={values?.billFraction || 1}  // Valor por defecto si no existe fracción
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
                                              value={formatCurrency(values?.saldoDisponible || 0)}
                                              disabled
                                              helperText={
                                                `Saldo actual factura: ${values?.billsComplete?.currentBalance ? formatNumberWithThousandsSeparator(Math.floor(values?.billsComplete?.currentBalance )) : 0}`
                                              }
                                            />
                                        </Grid>
                                        {/* Fecha Probable*/}
                                      <Grid item xs={12} md={1.5}>
                                        <DatePicker
                                          label="Fecha probable"
                                          value={values?.billsComplete?.dateBill}
                                         
                                          renderInput={(params) => <TextField {...params} fullWidth />}
                                        />
                                      </Grid> 

                                      <Grid item xs={12} md={4.5}>
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
                                              
                                              if (newValue) {
                                                try {
                                                  // Cargar datos relacionados con el inversionista
                                                  const [cuentas, brokerFromInvestor] = await Promise.all([
                                                    cargarCuentas(newValue.data.id),
                                                    cargarBrokerFromInvestor(newValue.data.id)
                                                  ]);

                                                setFieldValue('accountsInvestorArray', cuentas);
                                                  console.log("Datos cargados:", {
                                                    cuentas,
                                                    brokerFromInvestor
                                                  });

                                                  // Actualizar valores del formulario
                                                  setFieldValue('investor', newValue.data.id);
                                                  setFieldValue('investorInfo', newValue.data);
                                                  setFieldValue('cuentaInversionista', cuentas?.data || []);
                                                  
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
                                                  console.error("Error al cargar datos del inversionista:", error);
                                                  toast.error("Error al cargar información del inversionista");
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
                                                error={touched.investor && Boolean(errors.investor)}
                                                helperText={touched.investor && errors.investor}
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
                                        </Grid>

                                                                        {/* Cuenta de Inversionista */}
                                        <Grid item xs={12} md={3}>
                                          <Autocomplete
                                          options={values?.accountsInvestorArray?.data || []}
                                          getOptionLabel={(option) => 
                                            option?.account_number || 
                                            option?.number || 
                                            option?.id || 
                                            'Sin número de cuenta'
                                          }
                                          value={
                                            // Opción 1: Buscar en el array de cuentas
                                            values?.accountsInvestorArray?.data?.find(account => 
                                              String(account?.id) === String(values?.clientAccount)
                                            ) ?? null
                                          }
                                          isOptionEqualToValue={(option, value) => 
                                            String(option?.id) === String(value?.id)
                                          }
                                            onChange={(event, newValue) => {
                                              // Actualizar campos relacionados con la cuenta
                                              console.log(newValue)
                                              setFieldValue('clientAccount', newValue?.id );
                                              
                                              setFieldValue('montoDisponibleCuenta',newValue?.balance -values?.presentValueInvestor -values?.GM)
                                              
                                              // Actualizar monto disponible
                                              const nuevoSaldo = newValue?.balance || 0;
                                            
                                              setFieldValue('montoDisponibleInfo', nuevoSaldo);
                                            }}
                                            renderInput={(params) => (
                                              <TextField
                                                {...params}
                                                label="Cuenta Inversionista*"
                                                fullWidth
                                                variant="outlined"
                                                error={touched.investorAccountInfo?.investorAccountid && Boolean(errors.investorAccountInfo?.investorAccountid)}
                                                helperText={touched.investorAccountInfo?.investorAccountid && errors.investorAccountInfo?.investorAccountid}
                                                InputProps={{
                                                  ...params.InputProps,
                                                  endAdornment: (
                                                    <>
                                                      {!values?.accountsInvestorArray?.data && <CircularProgress size={20} />}
                                                      {params.InputProps.endAdornment}
                                                    </>
                                                  )
                                                }}
                                              />
                                            )}
                                            noOptionsText="No hay cuentas disponibles"
                                            disabled={!values.investor} // Deshabilitar si no hay inversionista seleccionado
                                          />
                                        </Grid>

                                        {/* Monto disponible en cuenta inversionista */}                                    
                                        <Grid item xs={12} md={3}>
                                          <TextField
                                            label="Monto Disponible Cuenta Inversionista"
                                            fullWidth
                                            value={formatCurrency(values?.montoDisponibleCuenta || 0)}
                                            disabled
                                            InputProps={{
                                              endAdornment: (
                                                <InputAdornment position="end">
                                                  <Tooltip title={`Saldo actual: ${formatCurrency(values?.montoDisponibleInfo || 0)}`}>
                                                    <InfoIcon color="action" fontSize="small" />
                                                  </Tooltip>
                                                </InputAdornment>
                                              )
                                            }}
                                            helperText={
                                              `Monto Disponible Inversionista: ${values?.montoDisponibleInfo ? formatNumberWithThousandsSeparator(Math.floor(values?.montoDisponibleInfo)) : 0}`
                                            }
                                          />
                                        </Grid>
                                                                      
                                                                            {/* Valor Futuro */}
                                        <Grid item xs={12} md={3} style={{ position: 'relative' }}>
                                          <TextField
                                            label="Valor Futuro"
                                            fullWidth
                                            name="amount"
                                            type="text"
                                            value={values?.amount ? formatNumberWithThousandsSeparator(Math.floor(values.amount)) : ""}
                                            onChange={(e) => {
                                              // Eliminar caracteres no numéricos
                                              const rawValue = e.target.value.replace(/[^\d]/g, "");
                                              const numericValue = rawValue ? parseInt(rawValue, 10) : 0;

                                              // Actualizar el valor
                                              setFieldValue('amount', numericValue);
                                              setFieldValue('payedAmount', numericValue); // Asumimos que payedAmount es igual al amount
                                              setFieldValue('saldoDisponible',values?.billsComplete?.currentBalance -numericValue)
                                              setFieldValue('payedPercent',100)
                                              const operationDays = values.operationDays 
                                              const presentValueInvestor = operationDays > 0 && numericValue > 0
                                              ? Math.round(PV(values?.investorTax / 100,  operationDays / 365, 0, numericValue, 0) * -1)
                                              : numericValue;
                                              const presentValueSF =  operationDays > 0 && numericValue > 0
                                              ? Math.round(PV(values?.discountTax / 100,  operationDays / 365, 0, numericValue, 0) * -1)
                                              : numericValue;
                                              // Si hay un porcentaje de descuento, calcular el valor nominal
                                              if (values?.discountTax) {
                                                console.log(values?.montoDisponibleInfo-presentValueInvestor-values?.GM)
                                                setFieldValue('presentValueInvestor', presentValueInvestor);
                                                setFieldValue('presentValueSF', presentValueSF);
                                                setFieldValue('montoDisponibleCuenta',values?.montoDisponibleInfo-presentValueInvestor-values?.GM)
                                              
                                                const gmValue = (presentValueInvestor || 0) * 0.002 ;
                                                setFieldValue('GM', gmValue);}
                                            }}
                                            onFocus={(e) => {
                                              // Mostrar valor sin formato al enfocar
                                              e.target.value = values?.amount?.toString() || "";
                                            }}
                                            onBlur={(e) => {
                                              // Aplicar formato al perder el foco
                                              const rawValue = e.target.value.replace(/[^\d]/g, "");
                                              const numericValue = rawValue ? parseInt(rawValue, 10) : 0;
                                              setFieldValue('amount', numericValue);
                                            }}
                                            placeholder={
                                              values?.billFraction && values.billsComplete?.total 
                                                ? `Sugerido: ${formatNumberWithThousandsSeparator(
                                                    Math.floor(values.billsComplete.total / values.billFraction)
                                                  )}` 
                                                : ""
                                            }
                                            InputProps={{
                                              startAdornment: (
                                                <InputAdornment position="start">
                                                  <AttachMoneyIcon style={{ color: 'rgb(94, 163, 163)', fontSize: '1.2rem' }} />
                                                </InputAdornment>
                                              ),
                                              endAdornment: (
                                                <Tooltip 
                                                  title="Valor total de la operación sin incluir descuentos ni comisiones"
                                                  placement="top-end"
                                                  arrow
                                                >
                                                  <IconButton size="small" edge="end">
                                                    <InfoIcon style={{ fontSize: '1rem', color: 'rgb(94, 163, 163)' }} />
                                                  </IconButton>
                                                </Tooltip>
                                              )
                                            }}
                                            error={touched.amount && Boolean(errors.amount)}
                                            helperText={touched.amount && errors.amount}
                                          />
                                        </Grid>
                                                                          {/* Campo de porcentaje de descuento */}
                                        <Grid item xs={12} md={1} style={{ position: 'relative' }}>
                                          <TextField
                                            label="% Descuento"
                                            fullWidth
                                            name="discountTax"
                                            type="number"
                                            value={values?.payedPercent ?? 0}
                                            sx={{ width: '100px' }} 
                                            onChange={(e) => {
                                              // Validar y establecer el porcentaje de descuento (0-100)
                                              const discountValue = Math.min(Math.max(Number(e.target.value) || 0, 0), 100);
                                              setFieldValue('payedPercent', Math.min(Math.max(Number(e.target.value) || 0, 0), 100));

                                              // Calcular valores derivados si amount está definido
                                              if (values.amount) {
                                                // Calcular valor con descuento
                                                const discountedValue = values.amount * (discountValue / 100);
                                                
                                                // Actualizar valores relacionados
                                                setFieldValue('payedAmount', discountedValue);
                                                
                                                
                                                // Calcular comisión si hay días de operación
                                                if (values.operationDays) {
                                                  const presentValueInvestor = Math.round(
                                                    PV(values.investorTax / 100, values.operationDays / 365, 0, -discountedValue, 0) 
                                                  );
                                                  const presentValueSF = Math.round(
                                                    PV(values.discountTax / 100, values.operationDays / 365, 0, -discountedValue, 0) 
                                                  );
                                                  
                                                  setFieldValue('presentValueInvestor', presentValueInvestor);
                                                  setFieldValue('presentValueSF', presentValueSF);
                                                  setFieldValue('commissionSF', presentValueInvestor - presentValueSF);
                                                  const gmValue = (presentValueInvestor || 0) * 0.002 ;
                                                  setFieldValue('GM', gmValue);
                                                }
                                              }
                                            }}
                                            inputProps={{ 
                                              min: 0, 
                                              max: 100,
                                              step: 0.01 // Permite decimales
                                            }}
                                            InputProps={{
                                              endAdornment: (
                                                <InputAdornment position="end">%</InputAdornment>
                                              ),
                                              
                                            }}
                                            error={touched.discountTax && Boolean(errors.discountTax)}
                                            helperText={touched.discountTax && errors.discountTax}
                                          />
                                          
                                          {/* Tooltip integrado */}
                                          <Tooltip 
                                            title="Porcentaje de descuento aplicado al valor total de la operación"
                                            placement="top-end"
                                            arrow
                                          >
                                            <IconButton
                                              size="small"
                                              style={{
                                                position: 'absolute',
                                                top: '50%', 
                                                right: 30, // Ajustado para no solapar con el %
                                                transform: 'translateY(-50%)',
                                                padding: 0.8,
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
                                        value={ values?.discountTax ?? 0}
                                        onChange={(e) => {
                                      const nuevaTasaDescuento = e.target.value;
                                      
                                      // 1. Actualizar la tasa de descuento global
                                      setFieldValue('discountTax', nuevaTasaDescuento);

                                      // 2. Solo proceder si hay fecha de operación
                                      if (values.opDate) {
                                        // 3. Recorrer todas las facturas para actualizar sus presentValueSF
                                        
                                          const operationDays = values?.operationDays || 0;
                                          const valorNominal = values?.payedAmount || 0;
                                          
                                          // 4. Calcular nuevo presentValueSF para cada factura
                                          const presentValueSF = operationDays > 0 && valorNominal > 0
                                            ? Math.round(PV(nuevaTasaDescuento / 100, operationDays / 365, 0, -valorNominal, 0) )
                                            : f.valorFuturo || 0;

                                         
                                          
                                          // 5. Actualizar el presentValueSF para cada factura
                                          setFieldValue(`presentValueSF`, presentValueSF);

                                          // 6. Recalcular comisionSF si es necesario (diferencia entre presentValueInvestor y presentValueSF)
                                          if (values?.presentValueInvestor) {
                                            const comisionSF = values?.presentValueInvestor - presentValueSF;
                                            setFieldValue(`comisionSF`, comisionSF);
                                          }
                                        
                                      }
                                    }}
                                      />
                                    </Grid>

                                                                          {/* Campo de valor nominal */}
                                      <Grid item xs={12} md={3}>
                                        <TextField
                                          label="Valor Nominal"
                                          fullWidth
                                          name="payedAmount"
                                          value={values?.payedAmount ? formatNumberWithThousandsSeparator(Math.floor(values.payedAmount)) : ""}
                                          onChange={(e) => {
                                            // Manejo del valor nominal
                                            const rawValue = e.target.value.replace(/[^\d]/g, "");
                                            let numericValue = parseFloat(rawValue) || 0;
                                            
                                            // Validar que no exceda el monto total (amount)
                                            if (values.amount && numericValue > values.amount) {
                                              numericValue = values.amount;
                                              toast.warning("El valor nominal no puede exceder el monto total");
                                            }

                                            // Actualizar valor nominal
                                            setFieldValue('payedAmount', numericValue);

                                            if (values.amount && values.amount > 0) {
                                              const discountPercentage = (numericValue / values.amount) * 100;
                                              const rounded = Math.round(discountPercentage * 100) / 100; // Redondea a 2 decimales
                                              setFieldValue('payedPercent', Math.min(Math.max(rounded, 0), 100));
                                            }

                                            // Recalcular valores financieros si hay operación activa
                                            if (values.opDate && values.operationDays) {
                                              const presentValueInvestor = Math.round(
                                                PV(values.investorTax / 100, values.operationDays / 365, 0, -numericValue, 0) 
                                              );
                                              
                                              const presentValueSF = Math.round(
                                                PV(values.discountTax / 100, values.operationDays / 365, 0, -numericValue, 0) 
                                              );
                                              
                                              // Actualizar valores calculados
                                              setFieldValue('presentValueInvestor', presentValueInvestor);
                                              setFieldValue('presentValueSF', presentValueSF);
                                              setFieldValue('commissionSF', presentValueInvestor - presentValueSF);
                                              setFieldValue('investorProfit', numericValue - presentValueSF);
                                              setFieldValue('montoDisponibleCuenta',values?.montoDisponibleInfo-presentValueInvestor-values?.GM)
                                              const gmValue = (presentValueInvestor || 0) * 0.002 ;
                                              setFieldValue('GM', gmValue);
                                            }
                                          }}
                                          onFocus={(e) => {
                                            // Mostrar valor sin formato al enfocar
                                            e.target.value = values?.payedAmount?.toString() || "";
                                          }}
                                          onBlur={(e) => {
                                            // Aplicar formato al perder el foco
                                            const rawValue = e.target.value.replace(/[^\d]/g, "");
                                            const numericValue = rawValue ? parseInt(rawValue, 10) : 0;
                                            setFieldValue('payedAmount', numericValue);
                                          }}
                                          InputProps={{
                                            startAdornment: (
                                              <InputAdornment position="start">
                                                <AttachMoneyIcon style={{ color: 'rgb(94, 163, 163)', fontSize: '1.2rem' }} />
                                              </InputAdornment>
                                            ),
                                          }}
                                          error={touched.payedAmount && Boolean(errors.payedAmount)}
                                          helperText={touched.payedAmount && errors.payedAmount}
                                        />
                                      </Grid>

                                                                        {/* Tasa Inversionista */}
                                      <Grid item xs={12} md={2}>
                                        <TextField
                                          label="Tasa Inversionista (%)"
                                          fullWidth
                                          name="investorTax"
                                          type="number"
                                          value={values?.investorTax ?? 0}
                                          onChange={(e) => {
                                            const newInvestorTax = parseFloat(e.target.value) || 0;
                                            const currentDiscountTax = values.discountTax || 0;

                                            // Validate that investor tax doesn't exceed discount tax
                                            const validatedTax = Math.min(newInvestorTax, currentDiscountTax);
                                            setFieldValue('investorTax', validatedTax);

                                            // Recalculate financial values if operation data exists
                                            if (values.opDate && values.operationDays && values.payedAmount) {
                                              const presentValueInvestor = Math.round(
                                                PV(validatedTax / 100, values.operationDays / 365, 0, -values.payedAmount, 0) 
                                              );
                                              
                                              const presentValueSF = values.presentValueSF || 0;
                                              
                                              setFieldValue('presentValueInvestor', presentValueInvestor);
                                              setFieldValue('commissionSF', presentValueInvestor - presentValueSF);
                                              setFieldValue('montoDisponibleCuenta',values?.montoDisponibleInfo-presentValueInvestor-values?.GM)
                                              const gmValue = (presentValueInvestor || 0) * 0.002 ;
                                              setFieldValue('GM', gmValue);
                                            }
                                          }}
                                          inputProps={{
                                            min: 0,
                                            max: values?.discountTax || 100,
                                            step: 0.01
                                          }}
                                          InputProps={{
                                            endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                          }}
                                          error={touched.investorTax && Boolean(errors.investorTax)}
                                          helperText={touched.investorTax && errors.investorTax}
                                        />
                                      </Grid>
                                      <Grid item xs={12} md={2}>
                                        <DatePicker
                                          label="Fecha Fin"
                                          value={values?.opExpiration ? new Date(values.opExpiration) : null}
                                          onChange={(newValue) => {
                                            if (!newValue) return;

                                            const expirationDate = parseDateToLocal(newValue);
                                            setFieldValue('opExpiration', expirationDate);

                                            // Calculate operation days if opDate exists
                                            if (values.opDate) {
                                              const startDate = new Date(values.opDate);
                                              const endDate = new Date(expirationDate);
                                              
                                              // Ensure we don't get negative days
                                              const operationDays = Math.max(0, differenceInDays(endDate, startDate));
                                              setFieldValue('operationDays', operationDays);

                                              // Recalculate financial values if payedAmount exists
                                              if (values.payedAmount) {
                                                const presentValueInvestor = Math.round(
                                                  PV(values.investorTax / 100, operationDays / 365, 0, -values.payedAmount, 0) 
                                                );
                                                
                                                const presentValueSF = Math.round(
                                                  PV(values.discountTax / 100, operationDays / 365, 0, -values.payedAmount, 0)
                                                );
                                                
                                                setFieldValue('presentValueInvestor', presentValueInvestor);
                                                setFieldValue('presentValueSF', presentValueSF);
                                                setFieldValue('commissionSF', presentValueInvestor - presentValueSF);
                                                setFieldValue('investorProfit', values.payedAmount - presentValueSF);
                                                setFieldValue('montoDisponibleCuenta',values?.montoDisponibleInfo-presentValueInvestor-values?.GM)
                                              }
                                            }
                                          }}
                                          minDate={values?.opDate ? new Date(values.opDate) : null}
                                          renderInput={(params) => (
                                            <TextField 
                                              {...params} 
                                              fullWidth
                                              error={touched.opExpiration && Boolean(errors.opExpiration)}
                                              helperText={touched.opExpiration && errors.opExpiration}
                                            />
                                          )}
                                        />
                                      </Grid>
                                                                        <Grid item xs={12} md={2}>
                                    <TextField
                                      label="Días Operación"
                                      fullWidth
                                      type="number"
                                      value={values?.operationDays || 0}
                                      disabled 
                                      onChange={(e) => {
  
                                          disabled 
                                          console.log(factura.operationDays)
                                            const nuevosDiasOperacion = parseFloat(e.target.value); // Convertir a número
                                            setFieldValue(`operationDays`, nuevosDiasOperacion); // Actualizar el valor
  
                                            const presentValueInvestor = nuevosDiasOperacion > 0 && factura.valorNominal > 0
                                                  ? Math.round(PV(values.investorTax / 100,  nuevosDiasOperacion / 365, 0, factura.valorNominal, 0) * -1)
                                                  : factura.valorFuturo;
  
                                          const presentValueSF =  nuevosDiasOperacion > 0 && factura.valorNominal > 0
                                            ? Math.round(PV(values.discountTax / 100,  nuevosDiasOperacion / 365, 0, factura.valorNominal, 0) * -1)
                                            : factura.currentBalance;
                                          console.log("DIAS", nuevosDiasOperacion,presentValueInvestor, presentValueSF)
                                          setFieldValue(`presentValueInvestor`, presentValueInvestor); // Actualizar el valor
                                          setFieldValue(`presentValueSF`, presentValueSF); // Actualizar el valor
                                          }}
                                    />
                                  </Grid>
                                  {/* Campo Utilidad Inversión*/ }
                                  <Grid item xs={12} md={3}>
                                    <TextField
                                      label="Utilidad Inversión"
                                      fullWidth
                                      value={formatCurrency(values?.investorProfit )} // Formato moneda
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
                                      value={formatCurrency(values?.presentValueInvestor )} // Formato moneda
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
                                      value={formatCurrency(values?.presentValueSF )} // Formato moneda
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
                                      value={formatCurrency(values?.commissionSF)} // Formato moneda
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
                                      value={
                                        values?.investorBrokerInfo?.investorBrokerName|| 
                                        'No asignado'
                                      }
                                      disabled
                                      InputProps={{
                                        inputComponent: "input",
                                      }}
                                      />
                                      </Grid>

                                     
                                        
                                        {/* Gasto de Mantenimiento */}
                                     <Grid item xs={12} md={8}>
                                     <Box 
                                          sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            height: '55%',
                                            width:'891px',
                                            gap: 1,
                                            p: 1,
                                            border: '1px solid',
                                            borderColor: 'rgba(0, 0, 0, 0.23)',
                                            borderRadius: 1,
                                            boxShadow: 0,
                                            
                                          }}
                                        > 
                           
                                          <Typography 
                                               variant="subtitle1" 
                                               sx={{ 
                                                 fontWeight: 'medium',
                                                 minWidth: { sm: '180px' },
                                                 color: 'text.secondary'
                                               }}
                                             >
                                               Gasto de Mantenimiento (GM)
                                             </Typography>
                                          <Switch
                                            checked={values?.applyGm || false}
                                            onChange={(event) => {
                                              const isChecked = event.target.checked;
                                              const gmValue = isChecked ? (values?.presentValueInvestor || 0) * 0.002 : 0;
                                              
                                              // Update GM values
                                              setFieldValue('applyGm', isChecked);
                                              setFieldValue('GM', gmValue);
                                              
                                              // Update available amount if needed
                                              if (values?.montoDisponibleInfo) {
                                                const difference = isChecked ? -gmValue : gmValue;
                                                const newAvailableAmount = (values.montoDisponibleInfo) + difference;
                                                setFieldValue('montoDisponibleCuenta', newAvailableAmount);
                                              }
                                            }}
                                          />
                                          <TextField
                                            type="text"
                                            placeholder="$ 0,00"
                                            size="small" 
                                            value={values?.GM ? formatCurrency(values.GM) : "0"}
                                            onChange={(e) => {
                                              const rawValue = e.target.value.replace(/[^\d]/g, "");
                                              const newValue = parseFloat(rawValue) || 0;
                                              
                                              // Update GM value
                                              setFieldValue('GM', newValue);
                                              
                                              // Calculate difference with previous value
                                              const previousValue = values.GM || 0;
                                              const difference = newValue - previousValue;
                                              
                                              // Update available amount if needed
                                              if (values?.montoDisponibleInfo) {
                                                const newAvailableAmount = (values.montoDisponibleInfo) - previousValue;
                                                setFieldValue('montoDisponibleCuenta', newAvailableAmount);
                                              }
                                            }}
                                            disabled={!values?.applyGm}
                                            fullWidth
                                            variant="outlined"
                                            className={`flex-1 ${values?.applyGm ? "bg-white" : "bg-gray-200 text-gray-500"}`}
                                            InputProps={{
                                              startAdornment: (
                                                <InputAdornment position="start">$</InputAdornment>
                                              ),
                                            }}
                                          />
                                     
                                        </Box></Grid> 
                                 
                                                                  
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
                        ¿Estás seguro de editar esta operación?
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
                      onClick={async () => {
                        setShowConfirmationModal(false);
                        try {
                          await handleSubmit(values, actionsFormik);
                        } catch (e) {
                          console.error("Error al confirmar:", getErrorMessage(e));
                        }
                      }}
                    >
                        Confirmar
                      </Button>
                    </DialogActions>
                  </Dialog>
              
                                            {/* MODAL DE PROCESO */}
                  <Dialog open={isModalOpen} PaperProps={{ sx: { borderRadius: "10px", textAlign: "center", p: 3 } }}>
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
             {/* Debug */}
            {process.env.NODE_ENV === 'development' && (
              <div style={{ marginTop: 20 }}>
                <h4>Errores:</h4>
                <pre>{JSON.stringify(errors, null, 2)}</pre>
              </div>
            )}
                </Form>
          )}
        </Formik>
      </Box>
    </LocalizationProvider>
  );
};
