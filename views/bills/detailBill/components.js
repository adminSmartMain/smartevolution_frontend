import { useEffect, useState, useMemo } from "react";
import { ToastContainer, toast } from "react-toastify";
import { 
  Box, 
  Button, 
  Grid,
  Typography,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,Tooltip,
} from "@mui/material";
import { useRouter } from "next/router";
import { useFetch } from "@hooks/useFetch";
import { debounce } from 'lodash';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import esLocale from 'date-fns/locale/es';
import { Formik, Form } from 'formik';
import Axios from "axios";
import authContext from "@context/authContext";
import "react-toastify/dist/ReactToastify.css";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PreviewIcon from '@mui/icons-material/Preview';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import Image from 'next/image';
import "react-toastify/dist/ReactToastify.css";

import {
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,Skeleton,
} from '@mui/material';

import {
  TableFooter,
  TablePagination,

} from '@mui/material';
import {
  FirstPage,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage
} from '@mui/icons-material';

import "react-toastify/dist/ReactToastify.css";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import { Bills, GetRiskProfile, BrokerByClient, AccountsFromClient,getTypeBill } from "./queries";
import { parseISO } from "date-fns";
import InfoIcon from '@mui/icons-material/Info';

import EmitterSelector from "@components/selects/billDetailSelects/EmitterSelector";
import PayerSelector from "@components/selects/billDetailSelects/PayerSelector";
import BillManualSelector from "@components/selects/billDetailSelects/BillManualSelector";

import SaldoDisponibleSelector from "@components/selects/billDetailSelects/SaldoDisponibleSelector";
import TypeBillSelector from "@components/selects/billDetailSelects/TypeBillSelector";
import SubTotalSelector from "@components/selects/billDetailSelects/SubTotalSelector";
import TotalSelector from "@components/selects/billDetailSelects/TotalSelector";
import RetFteSelector from "@components/selects/billDetailSelects/RetFteSelector";
import RetIcaSelector from "@components/selects/billDetailSelects/RetIcaSelector";
import RetIvaSelector from "@components/selects/billDetailSelects/RetIvaSelector";
import IvaSelector from "@components/selects/billDetailSelects/IvaSelector";
import OtrasRetSelector from "@components/selects/billDetailSelects/OtrasRetSelector";
import CurrentOwnerSelector from "@components/selects/billDetailSelects/CurrentOwnerSelector";
import CufeSelector from  "@components/selects/billDetailSelects/CufeSelector";


// Politica de zona horaria y formato centralizada para toda la aplicación
const APP_TIMEZONE = "America/Bogota";
const APP_LOCALE = "es-CO";
const TZ_OFFSET_SUFFIX = "-05:00";

const normalizeIsoDate = (iso) => {
  if (!iso) return null;
// Si la cadena ya tiene un indicador de zona horaria, la dejamos como está. Si no, asumimos que es hora local y le agregamos el sufijo de zona horaria de Colombia.
  return (iso.includes('Z') || iso.includes('-')) ? iso : `${iso}${TZ_OFFSET_SUFFIX}`;
};

const FilePreviewModal = ({ open, onClose, file, fileUrl }) => {
  const renderPreviewContent = () => {
    if (!file && !fileUrl) return null;

    // Si hay una URL (archivo ya subido)
    if (fileUrl) {
      if (fileUrl.includes('.pdf')) {
        return (
          <iframe 
            src={fileUrl} 
            width="100%" 
            height="500px" 
            style={{ border: 'none' }}
            title="Vista previa del PDF"
          />
        );
      } else {
        return (
          <Image
            src={fileUrl}
            alt="Vista previa del documento"
            width={600}
            height={800}
            style={{ width: '100%', height: 'auto', maxHeight: '500px', objectFit: 'contain' }}
          />
        );
      }
    }

    // Si hay un archivo local (aún no subido)
    if (file.type.includes('pdf')) {
      const fileObjectUrl = URL.createObjectURL(file);
      return (
        <iframe 
          src={fileObjectUrl} 
          width="100%" 
          height="500px" 
          style={{ border: 'none' }}
          title="Vista previa del PDF"
        />
      );
    } else {
      const fileObjectUrl = URL.createObjectURL(file);
      return (
        <Image
          src={fileObjectUrl}
          alt="Vista previa del documento"
          width={600}
          height={800}
          style={{ width: '100%', height: 'auto', maxHeight: '500px', objectFit: 'contain' }}
          onLoad={() => URL.revokeObjectURL(fileObjectUrl)}
        />
      );
    }
  };

  return (
   <>
   </>
  );
};

// Estilo para input oculto
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

// Estilo para el modal
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  maxWidth: '800px',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  maxHeight: '90vh',
  overflowY: 'auto'
};

function TablePaginationActions(props) {
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div style={{ flexShrink: 0, marginLeft: '20px' }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        <FirstPage />
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        <KeyboardArrowRight />
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        <LastPage />
      </IconButton>
    </div>
  );
}
//comentario de prueba
const BillCreationComponent = ({
  opId,
  emitters,
  payers,
onFormSubmit,
  isFinished,
  validationSchema2,
users,
bill,
id,


}) => {

  const [clientWithoutBroker, setClientWithoutBroker] = useState(null);
  const [orchestDisabled, setOrchestDisabled] = useState([{ indice: 0, status: false }])
  const emisores = emitters;
  const [openEmitterBrokerModal, setOpenEmitterBrokerModal] = useState(false)
  const [clientPagador, setClientPagador] = useState(null);
  const [isSelectedPayer, setIsSelectedPayer] = useState(false)
    // Estados para el archivo y previsualización
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [openPreview, setOpenPreview] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [showAllPayers, setShowAllPayers] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [previewUrl, setPreviewUrl] = useState(null);
  const usuarioEncontrado = users?.data?.find(user => user.id ===  bill?.user_created_at);
  const usuarioEncontradoEdit = users?.data?.find(user => user.id === bill?.user_updated_at);


const router = useRouter();
useEffect(() => {
  if (router.query.tab !== undefined) {
    const tabParam = Number(router.query.tab);

    if (!isNaN(tabParam)) {
      setActiveTab(tabParam);   // ← AQUÍ SE CAMBIA LA TAB ACTIVA
    }
  }
}, [router.query.tab]);

const opcionesFormato = {
  dateStyle: 'long',
  timeStyle: 'short',
  timeZone: APP_TIMEZONE 
};

const createdAt = new Date(normalizeIsoDate(bill?.created_at));
const updatedAt = bill?.updated_at ? new Date(normalizeIsoDate(bill?.updated_at)) : null;

const createdAtLocal = !isNaN(createdAt) ? createdAt.toLocaleString(APP_LOCALE, opcionesFormato) : 'Fecha inválida';
const updatedAtLocal = (updatedAt && !isNaN(updatedAt)) ? updatedAt.toLocaleString(APP_LOCALE, opcionesFormato) : null;

// El texto del tooltip debe ser coherente con el Backend
const tooltipText = `
🕒 Creado el: ${createdAtLocal} (Hora Colombia)
🛠️ Última actualización: ${updatedAtLocal ? `${updatedAtLocal}` : 'No ha sido actualizado'}
`;
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

console.log(bill?.events);


// 🇨🇴 Config fija


const BOGOTA_OFFSET_MIN = -5 * 60; // UTC-5

/**
 * Convierte "YYYY-MM-DDTHH:mm:ss" (sin zona) en un Date válido,
 * interpretándolo SIEMPRE como hora de Bogotá.
 *
 * Ej: "2026-01-23T16:17:53" => Date que representa ese instante,
 * pero calculado como si 16:17:53 fuese en America/Bogota.
 */
function normalizeEventISO(iso) {
  if (!iso) return null;
  const s = String(iso).trim();

  // solo fecha YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return `${s}T00:00:00${TZ_OFFSET_SUFFIX}`;

  // ya trae zona (Z o +hh:mm o -hh:mm)
  if (/[zZ]$/.test(s) || /[+-]\d{2}:\d{2}$/.test(s)) return s;

  // trae hora pero sin zona (YYYY-MM-DDTHH:mm:ss)
  if (/^\d{4}-\d{2}-\d{2}[T\s]\d{2}:\d{2}/.test(s)) {
    // si viene con espacio lo pasamos a T
    const fixed = s.replace(" ", "T");
    return `${fixed}${TZ_OFFSET_SUFFIX}`;
  }

  return s;
}

/**
 * Convierte ISO (con o sin zona) en Date válido.
 * Si no trae zona, se interpreta SIEMPRE como hora de Bogotá.
 */
function parseBogotaISO(iso) {
  const n = normalizeEventISO(iso);
  if (!n) return null;
  const d = new Date(n);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Timestamp (ms) para ordenar */
function toTs(iso) {
  const d = parseBogotaISO(iso);
  return d ? d.getTime() : null;
}

/** dd/mm/yyyy hh:mm AM/PM (fijo) en zona Colombia */
function formatEventDate(iso) {
  const d = parseBogotaISO(iso);
  if (!d) return "";

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: APP_TIMEZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).formatToParts(d);

  const get = (type) => parts.find((p) => p.type === type)?.value ?? "";
  const dd = get("day");
  const mm = get("month");
  const yyyy = get("year");
  const hh = get("hour");
  const min = get("minute");
  const ampm = get("dayPeriod");

  return `${dd}/${mm}/${yyyy} ${hh}:${min} ${ampm}`;
}


// -----------------------
// Uso en tu mapeo
// -----------------------
const eventos =
  Array.from(
    new Map(
      (bill?.events || [])
        .map((item) => {
          // ✅ SOLO DIAN
          const texto = (item.dianDescription ?? "").trim();

          const fechaTs = toTs(item.date);

          return {
            codigo: item.code || "",
            fechaTs, // ✅ para ordenar
            fecha: formatEventDate(item.date), // ✅ Colombia dd/mm/yyyy hh:mm AM/PM
            evento: texto, // ✅ puede ser "" a propósito
          };
        })
        // ✅ NO filtrar por evento; queremos que los nuevos salgan vacíos
        .filter((e) => e.codigo && e.fechaTs)
        // ✅ de-dup: si evento está vacío, igual lo mantenemos único por code+fecha
        .map((e) => [
          `${e.codigo}|${e.fechaTs}|${(e.evento || "").toLowerCase().replace(/\s+/g, " ").trim()}`,
          e,
        ])
    ).values()
  ).sort((a, b) => a.fechaTs - b.fechaTs) || [];


const emptyRows = !eventos || eventos.length === 0;

 const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const {
    fetch: fetchBills,
    loading: loadingBills,
    error: errorBills,
    data: dataBills,
  } = useFetch({ service: Bills, init: false });

  const renderNombreUsuario = (usuario) => (
    
  <Box component="span" sx={{ color: 'text.primary', fontWeight: 500 }}>
  {usuario?.social_reason || 
   `${usuario?.first_name || ''} ${usuario?.last_name || ''}`.trim()}
</Box>
  );
    const {
      fetch: fetchTypeBill,
      loading: loadingTypeBill,
      error: errorTypeBill,
      data: dataTypeBill,
    } = useFetch({ service: getTypeBill, init: true });

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




  // Función para formatear el número con separadores de miles
  const formatNumberWithThousandsSeparator = (value) => {
    if (value === undefined || value === null) return '';
    
    // Convert to string and split into integer and decimal parts
    const [integerPart, decimalPart] = value.toString().split('.');
    
    // Format only the integer part with commas
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    
    // Combine with decimal part if it exists
    return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
};

 

  const [initialPayer, setInitialPayer] = useState(null);

  function handleOnChange(event) {
    const data = new FormData(event.currentTarget)
    const values = Array.from(data.values())
    const changedFields = values.filter(value => value.length);
   
    
  }

  const cargarTasaDescuento = async (emisor) => {
    if (!emisor) return null; // Retorna null si no hay emisor

    try {
      const tasaDescuento = await riskProfileFetch(emisor);
      return tasaDescuento; // 🔹 Devuelve las cuentas obtenidas
    } catch (error) {
      console.error("Error al cargar tasaDescuento:", error);
      return null; // Retorna null en caso de error
    }
  };


// Usamos nuestra función normalizadora para que la fecha base sea la correcta
const parseDateToLocal = (dateString) => {
  const normalized = normalizeIsoDate(dateString);
  if (!normalized) return null;

  const date = new Date(normalized);
  if (isNaN(date.getTime())) return null;
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

  const cargarFacturas = async (emisor, pagadorId = null) => {
    if (!emisor) {
      setFacturasFiltradas([]);
      return [];
    }

    const facturas = fetchBills(emisor);

    //S setFacturasFiltradas(filtradas);
    return facturas; // Retorna directamente el array filtrado
  };


  const [brokerByClient, setBrokerByClient] = useState()

  useEffect(() => {

    setBrokerByClient(dataBrokerByClient)
  }, [dataBrokerByClient]); // Se ejecuta cuando cambia el estado

  const [AccountFromClient, setAccountFromClient] = useState()
  useEffect(() => {

    setAccountFromClient(dataAccountFromClient)
  }, [dataAccountFromClient]); // Se ejecuta cuando cambia el estado



  const [filteredPayers, setFilteredPayers] = useState([]);
  const [filteredPayersBills, setFilteredPayerBills] = useState([]);
  const [filteredAcountsInvestor, setAcountsInvestor] = useState([]);



  // Combinar el pagador inicial con los filtrados




const handleConfirm = async (values, actions) => {
  try {
    await onFormSubmit(values, actions);
  } catch (error) {
    console.error('Error al enviar el formulario:', error);
    toast.error('Error al enviar el formulario');
    actions.setSubmitting(false);
  }
};




 // Efecto para cargar pagadores filtrados
   useEffect(() => {
   
     // 1. Establecer el pagador inicial inmediatamente si existe en dataDetails
     if (bill?.payer) {
       const payerFromDetails = {
         id:  bill.payerId,
         data: {
           document_number: bill.payer.document_number,
           social_reason: bill.payer.social_reason,
           first_name: bill.payer.first_name,
           last_name: bill.payer.last_name
         }
       };
       setInitialPayer(payerFromDetails);
 
     }
     const loadFilteredPayers = async () => {
       const emitterId = bill?.emitterId;
 
       if (!emitterId) {
  
         setFilteredPayers([]);
         return;
       }
 
       try {
        
         const facturasEmisor = await cargarFacturas(emitterId);
         
 
         if (!facturasEmisor?.data?.length) {
        
           setFilteredPayers([]);
           return;
         }
 
         const facturasConSaldo = facturasEmisor.data.filter(
           f => Number(f.currentBalance) >= 0
         );
         
 
         const payerIdsUnicos = [...new Set(
           facturasConSaldo.map(f => f.payerId).filter(Boolean)
         )];
 
 
         const pagadoresFiltrados = payers?.filter(p =>
           p?.data?.document_number &&
           payerIdsUnicos.includes(p.data.document_number)
         ) || [];
 
         setFilteredPayers(pagadoresFiltrados);
 
       } catch (error) {
         console.error('Error en loadFilteredPayers:', error);
         setFilteredPayers([]);
       }
     };
 
     loadFilteredPayers();
   }, [ bill?.emitterId, payers]); // Dependencias específicas
 
   // Combinar el pagador inicial con los filtrados
   const allPayers = useMemo(() => {
     if (!initialPayer) return filteredPayers;
     // Evitar duplicados
     const existsInFiltered = filteredPayers.some(p =>
       p.data.document_number === initialPayer.data.document_number
     );
     return existsInFiltered ? filteredPayers : [initialPayer, ...filteredPayers];
   }, [initialPayer, filteredPayers]);
 

const parseBackendDate = (dateString) => {
  if (!dateString) return null;
  // Parseamos la fecha ISO del backend
  const date = parseISO(dateString);
  // Ajustamos por zona horaria
  return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
};


console.log(bill)
 
  const initialValues2 = {
    emitter:  bill?.emitterName,
    cufe:bill?.cufe,
    currentOwnerName:bill?.currentOwnerName,
    currentOwnerid:bill?.currentOwnerId,
    nombrePagador:  bill?.payerName,
    filtroEmitterPagador: { emitter: "", payer: "" },
    currentBalance: bill?.currentBalance,
    filteredPayers: "",
    billId: bill?.billId,
    factura: bill?.billId,
    emitterId:bill?.emitterId,
    payerName:bill?.payerName,
    payerId:bill?.payerId,
    DateBill: parseBackendDate(bill?.dateBill),
    datePayment:parseBackendDate(bill?.datePayment),
    expirationDate:  parseBackendDate(bill?.expirationDate),
    typeBill:bill?.typeBill,
    file:  bill?.file,
    ret_fte:bill?.ret_fte,
    ret_ica:bill?.ret_ica,
    ret_iva:bill?.ret_iva,
    subTotal:bill?.billValue,
    iva:bill?.iva,
    total:bill?.total,
    other_ret:bill?.other_ret,
    arrayPayers:allPayers,

  };

const handleClosePreview = () => {
  // Liberar recursos si es un objeto URL creado con URL.createObjectURL
  if (file && previewUrl) {
    URL.revokeObjectURL(previewUrl);
  }
  setOpenPreview(false);
  setPreviewUrl(null);
};

console.log(!dataBills)

// Modifica la función handleOpenPreview para manejar XML
const handleOpenPreview = async () => {
  try {
    if (file) {
      // Si es un archivo recién subido
      if (file.name.endsWith('.xml') || file.type.includes('xml')) {
        toast.warning('La previsualización no está disponible para archivos XML');
        return;
      }
      
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setOpenPreview(true);
    } else if (bill?.file_content) {
      // Si el contenido es XML
      if (bill?.file_content_type?.includes('xml')) {
        toast.warning('La previsualización no está disponible para archivos XML');
        return;
      }

      // 1. Crear el Blob desde base64 (solo para PDF o imágenes)
      const byteCharacters = atob(bill.file_content);
      const byteArrays = [];
      
      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);
        
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }
      
      const blob = new Blob(byteArrays, { type: bill.file_content_type });
      
      // 2. Crear URL del Blob
      const url = URL.createObjectURL(blob);
      
      // 3. Verificar si el Blob es válido
      const blobIsValid = await verifyBlob(blob);
      
      if (!blobIsValid) {
        throw new Error("El archivo está corrupto o incompleto");
      }
      
      setPreviewUrl(url);
      setOpenPreview(true);
    }
  } catch (error) {
    console.error("Error en previsualización:", error);
    toast.error("No se pudo cargar la previsualización: " + error.message);
  }
};



// Función para verificar el Blob
const verifyBlob = async (blob) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onloadend = () => {
      // Verificamos que los primeros bytes sean un PDF válido
      const arr = new Uint8Array(reader.result).subarray(0, 4);
      const header = Array.from(arr).map(b => b.toString(16)).join('');
      resolve(header === '25504446'); // '%PDF' en hexadecimal
    };
    
    reader.onerror = () => resolve(false);
    reader.readAsArrayBuffer(blob.slice(0, 4)); // Solo leemos los primeros bytes
  });
};
  return (
  <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={esLocale}>
    {/* Para mostrar los toast */}
    <ToastContainer position="top-right" autoClose={5000} />

    <Box sx={{ padding: 5, backgroundColor: 'white', borderRadius: 1, boxShadow: 1 }}>
      {/* Sistema de Tabs */}
      <Box sx={{ width: '100%', mb: 3 }}>
         <Tabs 
  value={activeTab} 
  onChange={(event, newValue) => setActiveTab(newValue)}
  sx={{
    '& .MuiTabs-indicator': {
      backgroundColor: '#5EA3A3', // Color del indicador
    },
    '& .MuiTab-root': {
      color: '#5EA3A3', // Color del texto cuando no está seleccionado
    },
    '& .Mui-selected': {
      color: '#5EA3A3 !important', // Color del texto cuando está seleccionado
    },
  }}
>
<Tab 
    label="Detalle de Factura" 
    sx={{
      fontFamily: '"Montserrat", "icomoon", sans-serif', // Ejemplo de fuente

      fontSize: '1.5rem', // Tamaño de fuente
      textTransform: 'none', // Evita mayúsculas
      color: '#5EA3A3',
      '&.Mui-selected': {
        color: '#488B8F',
      }
    }}
  />
  <Tab 
    label="Historial de Eventos" 
    sx={{
      fontFamily: '"Montserrat", "icomoon", sans-serif',

      fontSize: '1.5rem',
      textTransform: 'none',
      color: '#5EA3A3',
      '&.Mui-selected': {
        color: '#488B8F',
      }
    }}
  />
</Tabs>
      </Box>

      {activeTab === 0 ? (
        // Contenido de la primera pestaña (detalle de factura)
        <>
         <Box
  sx={{
    display: 'flex',
    flexDirection: { xs: 'column', sm: 'row' },
    justifyContent: 'space-between',
    alignItems: { xs: 'flex-start', sm: 'center' },
    gap: { xs: 1, sm: 2 },
    marginBottom: 2
  }}
>
  {/* Título y Badge en misma línea en móviles */}
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    flexWrap: 'wrap',
    gap: 1,
    marginBottom: { xs: 1, sm: 0 }
  }}>
    <Typography
      letterSpacing={0}
      fontSize={{ xs: '1.5rem', sm: '1.7rem' }}
      fontWeight="regular"
      color="#5EA3A3"
      sx={{ marginRight: 1 }}
    >
      Ver Factura
    </Typography>
    
    {/* Badge "Autogestión" */}
    {bill.integrationCode && (
      <Box
        sx={{
          backgroundColor: "#488B8F",
          color: "white",
          borderRadius: "12px",
          padding: "2px 8px",
          fontSize: "0.7rem",
          fontWeight: "bold",
          alignSelf: 'center',
        }}
      >
        Autogestión
      </Box>
    )}
  </Box>

  {/* Información de autoría - Se mueve debajo en móviles */}
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    gap: 1,
    flexWrap: 'wrap',
    justifyContent: { xs: 'flex-start', sm: 'flex-end' },
    width: { xs: '100%', sm: 'auto' }
  }}>
    {usuarioEncontrado || usuarioEncontradoEdit ? (
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'flex-start', sm: 'center' },
        gap: { xs: 0.5, sm: 1 }
      }}>
        <Typography variant="subtitle1" sx={{ color: 'text.secondary', textAlign: { xs: 'left', sm: 'right' } }}>
          {usuarioEncontrado?.id === usuarioEncontradoEdit?.id ? (
            <>Creado y editado por: {renderNombreUsuario(usuarioEncontrado)}</>
          ) : (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 0, sm: 1 }
            }}>
              {usuarioEncontrado && (
                <Box component="span">
                  Creado por: {renderNombreUsuario(usuarioEncontrado)}
                </Box>
              )}
              {usuarioEncontrado && usuarioEncontradoEdit && (
                <Box component="span" sx={{ display: { xs: 'none', sm: 'block' } }}>
                  •
                </Box>
              )}
              {usuarioEncontradoEdit && (
                <Box component="span">
                  Editado por: {renderNombreUsuario(usuarioEncontradoEdit)}
                </Box>
              )}
            </Box>
          )}
        </Typography>

        {/* Tooltip (icono de información) */}
        <Tooltip
          title={<span style={{ whiteSpace: 'pre-line' }}>{tooltipText}</span>}
          arrow
          placement="top"
        >
          <IconButton size="small" sx={{ ml: { xs: 0, sm: 0.5 } }}>
            <InfoIcon fontSize="small" color="action" />
          </IconButton>
        </Tooltip>
      </Box>
    ) : (
      <Typography variant="subtitle1" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
        Sin información de autoría
      </Typography>
    )}
  </Box>
</Box>

          <Formik
            initialValues={initialValues2}
            validationSchema={validationSchema2}
            onSubmit={handleConfirm}
            enableReinitialize={true}
          >
            {({ values, setFieldValue, touched, errors, handleBlur, setTouched, setFieldTouched, setFieldError, isValid, isSubmitting }) => {
              return(
                <Form translate="no" onChange={handleOnChange}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={2}>
                      <TypeBillSelector 
                        errors={errors}
                        setFieldTouched={setFieldTouched}
                        setFieldValue={setFieldValue}
                        touched={touched}
                        values={values}
                        dataTypeBill={dataTypeBill}
                        integrationCode={bill?.integrationCode}
                      />
                    </Grid>

                    <Grid item xs={12} md={2}>
                      <BillManualSelector
                        values={values}
                        setFieldValue={setFieldValue}
                        touched={touched}
                        orchestDisabled={orchestDisabled}
                        dataBills={dataBills}
                        setFieldTouched={setFieldTouched}
                        setFieldError={setFieldError}
                        integrationCode={bill?.integrationCode}
                        debouncedCheckBill={debouncedCheckBill}
                      />
                    </Grid>
                    <Grid item xs={12} md={5}>
                      <CufeSelector
                         values={values}
                          setFieldValue={setFieldValue}
                          errors={errors}
                          integrationCode={bill?.Cufe}
                          formatNumberWithThousandsSeparator={formatNumberWithThousandsSeparator}
                          parseFloat={parseFloat}
                        />
                    </Grid>
                    
                    <Grid item xs={12} md={3}>
                      <SaldoDisponibleSelector
                        values={values}
                        setFieldValue={setFieldValue}
                        formatNumberWithThousandsSeparator={formatNumberWithThousandsSeparator}
                        parseFloat={parseFloat}
                      />
                    </Grid>

                    <Grid item xs={12} md={2}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ display: 'flex', gap: '10px', flex: 1 }}>
                          <DatePicker
                            label="Emisión"
                            maxDate={new Date()}
                            value={values.DateBill ? values.DateBill : null}
                            onChange={(newValue) => {
                              if (newValue) {
                                const formattedDate = newValue ? new Date(newValue) : null;
                                if (!formattedDate) return;
                                setFieldValue('DateBill', formattedDate);
                              } else {
                                setFieldValue('DateBill', null);
                              }
                            }}
                            inputFormat="dd/MM/yyyy"
                            mask="__/__/____"
                            disabled
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                size="small"
                                fullWidth
                                sx={{
                                  '& .MuiInputBase-root': {
                                    height: '56px'
                                  }
                                }}
                                error={touched.DateBill && Boolean(errors.DateBill)}
                                helperText={touched.DateBill && errors.DateBill}
                                onKeyDown={(e) => {
                                  if (!/[0-9/]/.test(e.key) && 
                                      !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
                                      e.preventDefault();
                                  }
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                }}
                              />
                            )}
                            PopperProps={{
                              onClick: (e) => e.stopPropagation()
                            }}
                          />
                        </div>
                      </div>
                    </Grid>

                    <Grid item xs={12} md={2}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ display: 'flex', gap: '10px', flex: 1 }}>
                          <DatePicker
                            label="Vencimiento"
                            value={values.expirationDate ? values.expirationDate : null}
                            min={parseISO(values.DateBill)}
                            onChange={(newValue) => {
                              if (newValue) {
                                const formattedDate = newValue ? new Date(newValue) : null;
                                if (!formattedDate) return;
                                setFieldValue('expirationDate', formattedDate);
                              } else {
                                setFieldValue('expirationDate', null);
                              }
                            }}
                            inputFormat="dd/MM/yyyy"
                            disabled
                            mask="__/__/____"
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                size="small"
                                fullWidth
                                sx={{
                                  '& .MuiInputBase-root': {
                                    height: '56px'
                                  }
                                }}
                                error={errors.expirationDate && Boolean(errors.expirationDate)}
                                helperText={touched.expirationDate && errors.expirationDate}
                                onKeyDown={(e) => e.stopPropagation()}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                }}
                              />
                            )}
                            PopperProps={{
                              onClick: (e) => e.stopPropagation()
                            }}
                          />
                        </div>
                      </div>
                    </Grid>

                    <Grid item xs={12} md={2}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ display: 'flex', gap: '10px', flex: 1 }}>
                          <DatePicker
                            label="Fecha de pago"
                            value={values.datePayment ? values.datePayment : null}
                            onChange={(newValue) => {
                              if (newValue) {
                                const formattedDate = newValue ? new Date(newValue) : null;
                                if (!formattedDate) return;
                                setFieldValue('datePayment', formattedDate);
                              } else {
                                setFieldValue('datePayment', null);
                              }
                            }}
                            inputFormat="dd/MM/yyyy"
                            mask="__/__/____"
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                size="small"
                                fullWidth
                                disabled
                                sx={{
                                  '& .MuiInputBase-root': {
                                    height: '56px'
                                  }
                                }}
                                error={errors.datePayment && Boolean(errors.datePayment)}
                                helperText={touched.datePayment && errors.datePayment}
                                onKeyDown={(e) => e.stopPropagation()}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                }}
                              />
                            )}
                            PopperProps={{
                              onClick: (e) => e.stopPropagation()
                            }}
                          />
                        </div>
                      </div>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <EmitterSelector
                        errors={errors}
                        payers={payers}
                        setFieldTouched={setFieldTouched}
                        setFieldValue={setFieldValue}
                        setFieldError={setFieldError}
                        touched={touched}
                        values={values}
                        emisores={emisores}
                        fetchBrokerByClient={fetchBrokerByClient}
                        cargarFacturas={cargarFacturas}
                        cargarTasaDescuento={cargarTasaDescuento}
                        setClientWithoutBroker={setClientWithoutBroker}
                        setOpenEmitterBrokerModal={setOpenEmitterBrokerModal}
                        integrationCode={bill?.integrationCode}
                      />
                    </Grid>

                    {/* Segunda fila */}
                    <Grid container item xs={12} spacing={2}>

                      <Grid item xs={12} md={4}>
                      <CurrentOwnerSelector
                        errors={errors}
                        payers={payers}
                        setFieldTouched={setFieldTouched}
                        setFieldValue={setFieldValue}
                        setFieldError={setFieldError}
                        touched={touched}
                        values={values}
                        emisores={emisores}
                        fetchBrokerByClient={fetchBrokerByClient}
                        cargarFacturas={cargarFacturas}
                        cargarTasaDescuento={cargarTasaDescuento}
                        setClientWithoutBroker={setClientWithoutBroker}
                        setOpenEmitterBrokerModal={setOpenEmitterBrokerModal}
                        integrationCode={bill?.integrationCode}
                      />
                    </Grid>
                      <Grid item xs={12} md={4}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                          <div style={{ flex: 1 }}>
                            <PayerSelector
                              errors={errors}
                              dataBills={dataBills}
                              showAllPayers={showAllPayers}
                              payers={payers}
                              values={values}
                              setFieldValue={setFieldValue}
                              touched={touched}
                              setClientPagador={setClientPagador}
                              setIsSelectedPayer={setIsSelectedPayer}
                              integrationCode={bill?.integrationCode}
                            />
                          </div>
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
                                window.open(`${window.location.origin}/customers?modify=${clientPagador}`, '_blank');
                              }}
                              sx={{
                                marginTop: '15px',
                                height: '20px',
                                width: '20px',
                                color: '#488F88',
                                '&:hover': {
                                  color: '#3a726c',
                                  backgroundColor: 'rgba(72, 143, 136, 0.1)'
                                }
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                          )}
                        </div>    
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <SubTotalSelector
                          values={values}
                          setFieldValue={setFieldValue}
                          errors={errors}
                          integrationCode={bill?.integrationCode}
                          formatNumberWithThousandsSeparator={formatNumberWithThousandsSeparator}
                          parseFloat={parseFloat}
                        />
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <IvaSelector
                          values={values}
                          setFieldValue={setFieldValue}
                          integrationCode={bill?.integrationCode}
                          formatNumberWithThousandsSeparator={formatNumberWithThousandsSeparator}
                          parseFloat={parseFloat}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TotalSelector
                          values={values}
                          setFieldValue={setFieldValue}
                          formatNumberWithThousandsSeparator={formatNumberWithThousandsSeparator}
                          parseFloat={parseFloat}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <RetIvaSelector
                          values={values }
                          setFieldValue={setFieldValue}
                          formatNumberWithThousandsSeparator={formatNumberWithThousandsSeparator}
                          parseFloat={parseFloat}
                        />
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <RetIcaSelector
                          values={values}
                          setFieldValue={setFieldValue}
                          integrationCode={bill?.integrationCode}
                          formatNumberWithThousandsSeparator={formatNumberWithThousandsSeparator}
                          parseFloat={parseFloat}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <RetFteSelector
                          values={values}
                          setFieldValue={setFieldValue}
                          integrationCode={bill?.integrationCode}
                          formatNumberWithThousandsSeparator={formatNumberWithThousandsSeparator}
                          parseFloat={parseFloat}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <OtrasRetSelector
                          values={values}
                          setFieldValue={setFieldValue}
                          formatNumberWithThousandsSeparator={formatNumberWithThousandsSeparator}
                          parseFloat={parseFloat}
                        />
                      </Grid>
<Grid item xs={12} md={8} sx={{ 
  marginTop: '16px', 
  backgroundColor: 'grey.100', 
  p: 2, 
  borderRadius: 5,
  display: 'flex',
  flexDirection: 'column',
  gap: 2
}}>
  {/* Contenedor principal con diseño responsive */}
  <Box 
    display="flex" 
    flexDirection={{ xs: 'column', sm: 'row' }} 
    alignItems={{ xs: 'stretch', sm: 'center' }}
    gap={{ xs: 2, sm: 2 }}
    flexWrap="wrap"
  >
    {/* Botón de previsualización */}
    <Button
      variant="outlined"
      startIcon={<PreviewIcon />}
      onClick={() => {
        // Verificar si es XML antes de abrir
        const fileName = file?.name || values.file?.split('/').pop() || '';
        if (fileName.endsWith('.xml') || 
            file?.type?.includes('xml') || 
            bill?.file_content_type?.includes('xml')) {
          toast.warning('La previsualización no está disponible para archivos XML');
        } else {
          handleOpenPreview();
        }
      }}
      disabled={!file && !values.file}
      sx={{
        backgroundColor: (file || values.file) ? 'background.paper' : 'grey.300',
        color: (file || values.file) ? 'text.primary' : 'text.disabled',
        flexShrink: 0,
        width: { xs: '100%', sm: 'auto' },
        minWidth: { xs: '100%', sm: '140px' },
        '&:hover': {
          backgroundColor: (file || values.file) ? 'action.hover' : 'grey.300'
        }
      }}
    >
      Previsualizar
    </Button>

    {/* Información del archivo */}
    {(file || values.file) && (
      <Box 
        sx={{ 
          flexGrow: 1, 
          width: { xs: '100%', sm: 'auto' },
          minWidth: { xs: '100%', sm: '200px', md: '300px' }
        }}
      >
        <Typography 
          variant="body2" 
          sx={{ 
            wordBreak: 'break-word',
            backgroundColor: 'white',
            p: 1.5,
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'divider',
            textAlign: { xs: 'center', sm: 'left' }
          }}
        >
          <Box component="span" sx={{ fontWeight: 'bold', display: 'block', mb: 0.5 }}>
            Archivo seleccionado:
          </Box>
          {file?.name || values.file?.split('/').pop()}
          {file?.size && (
            <Box component="span" sx={{ display: 'block', mt: 0.5, color: 'text.secondary', fontSize: '0.8rem' }}>
              Tamaño: {formatFileSize(file.size)}
            </Box>
          )}
        </Typography>
      </Box>
    )}
  </Box>
  
  {/* Mensaje de error */}
  {errors.file && (
    <Typography 
      variant="body2"
      sx={{ 
        color: 'error.main',
        textAlign: 'center',
        backgroundColor: 'error.light',
        p: 1,
        borderRadius: 1
      }}
    >
      {'El archivo es obligatorio'}
    </Typography>
  )}
</Grid>
<Dialog 
  open={openPreview} 
  onClose={handleClosePreview} 
  maxWidth="md" 
  fullWidth
  sx={{ '& .MuiDialog-paper': { overflow: 'hidden' } }}
>
  <DialogTitle>Previsualización del archivo</DialogTitle>
  <DialogContent sx={{ p: 0, height: '80vh', display: 'flex', justifyContent: 'center' }}>
    {!previewUrl ? (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <Typography color="error">No se pudo cargar el archivo</Typography>
      </Box>
    ) : (
      <>
        {bill?.file_content_type === 'application/pdf' && (
          <iframe
            key={`pdf-${previewUrl}`} // Forzar recreación al cambiar URL
            src={`${previewUrl}#view=fitH`}
            width="100%"
            height="100%"
            style={{ border: 'none' }}
            title="Vista previa del PDF"
            loading="lazy"
            onError={(e) => {
              console.error("Error en iframe:", e);
              toast.error("No se pudo cargar el PDF");
            }}
          />
        )}
        
        {bill?.file_content_type?.includes('image/') && (
          <img
            key={`img-${previewUrl}`} // Forzar recreación al cambiar URL
            src={previewUrl}
            alt="Vista previa"
            style={{ 
              maxWidth: '100%', 
              maxHeight: '100%', 
              objectFit: 'contain',
              display: 'block'
            }}
            onError={(e) => {
              console.error("Error en imagen:", e);
              toast.error("No se pudo cargar la imagen");
            }}
          />
        )}
      </>
    )}
  </DialogContent>
  <DialogActions>
    <Button onClick={handleClosePreview}>Cerrar</Button>
    {previewUrl && (
      <Button
        onClick={() => {
          const fileName = bill?.file?.split('/').pop() || 
                         `documento.${bill?.file_content_type?.split('/')[1] || 'pdf'}`;
          
          const link = document.createElement('a');
          link.href = previewUrl;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
          }, 100);
        }}
        color="primary"
      >
        Descargar
      </Button>
    )}
  </DialogActions>
</Dialog>
                            
                            
                    </Grid>
                  </Grid>

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
        </>
      ) : (
        // Contenido de la segunda pestaña (tabla de eventos)
        <Box sx={{ mt: 2 }}>
   {bill?.billId ? (
  <Typography
    sx={{ ml: 1 }}
    letterSpacing={0}
    fontSize="1.7rem"
    fontWeight="regular"
    mb={2}
    color="#000"
  >
    {bill.billId}
  </Typography>
) : (
  <Typography
    sx={{ ml: 1 }}
    letterSpacing={0}
    fontSize="1.4rem"
    fontWeight="regular"
    mb={2}
    color="gray"
    fontStyle="italic"
  >
    Sin ID de factura
  </Typography>
)}


    <TableContainer component={Paper} sx={{ borderRadius: 2, p: 1 }}>
      
      {/* --------------------------- LOADING SKELETON --------------------------- */}
      {!dataBills && (
        <Box sx={{ p: 2 }}>
          <Skeleton variant="rectangular" height={40} sx={{ mb: 2 }} />

          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} variant="rectangular" height={35} sx={{ mb: 1 }} />
          ))}

          <Skeleton variant="rectangular" height={35} sx={{ mt: 2 }} />
        </Box>
      )}

      {/* --------------------------- TABLA FINAL --------------------------- */}
      {dataBills && (
        <Table aria-label="tabla de eventos">
          <TableHead>
            <TableRow>
              <TableCell><strong>Código</strong></TableCell>
              <TableCell><strong>Fecha y Hora</strong></TableCell>
              <TableCell><strong>Evento</strong></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {/* SIN EVENTOS */}
            {eventos?.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                  <Typography color="gray" fontWeight="bold">
                    No se encontraron eventos registrados
                  </Typography>
                </TableCell>
              </TableRow>
            )}

            {/* CON EVENTOS */}
            {eventos?.length > 0 &&
              eventos
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((e, index) => (
                  <TableRow key={index}>
                    <TableCell>{e?.codigo}</TableCell>
                    <TableCell>{e?.fecha}</TableCell>
                    <TableCell>{e?.evento}</TableCell>
                  </TableRow>
                ))}
          </TableBody>

          {/* PAGINACIÓN */}
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[15]}
                colSpan={3}
                count={eventos?.length || 0}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  native: true,
                  disabled: true, // dropdown deshabilitado
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Eventos por página:"
                labelDisplayedRows={({ from, to, count }) =>
                  `${count === 0 ? 0 : from}-${count === 0 ? 0 : to} de ${count}`
                }
              />
            </TableRow>
          </TableFooter>
        </Table>
      )}

    </TableContainer>
  </Box>
)}

      {/* Modales y otros componentes que necesites */}
      <FilePreviewModal 
        open={openPreview} 
        onClose={handleClosePreview} 
        file={file}
        fileUrl={fileUrl}
      />
    </Box>
  </LocalizationProvider>
);
};

export default BillCreationComponent