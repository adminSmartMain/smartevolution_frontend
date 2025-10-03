import { useEffect,useState,useContext } from "react";
import { ToastContainer } from "react-toastify";
import { useRouter } from "next/router";
import { Box, Typography,Fade,Button } from "@mui/material";
import { Toast } from "@components/toast";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import AccountSelect from "@components/selects/accountSelect";
import BillsByOperationSelect from "@components/selects/billByOperationSelect";
import ClientSelect from "@components/selects/customerSelect";
import OperationSelect from "@components/selects/operationBySelect";
import ReceiptStatusSelect from "@components/selects/receiptStatusSelect";
import TypeReceiptSelect from "@components/selects/typeReceiptSelect";
import BackButton from "@styles/buttons/BackButton";
import MuiButton from "@styles/buttons/button";
import MuiTextField from "@styles/fields";
import BaseField from "@styles/fields/BaseFieldReceipts";
import HelperText from "@styles/helperText";
import InputTitles from "@styles/inputTitles";
import scrollSx from "@styles/scroll";
import dayjs from "dayjs";
import InfoIcon from '@mui/icons-material/Info';
import { Dialog,DialogContent, CircularProgress,Grid,TextField,Divider,Tooltip, ClickAwayListener, IconButton} from "@mui/material";
import { CheckCircle, Error } from "@mui/icons-material";
import ModalConfirmation from "@components/modals/receiptBillModals/modalConfirmation";
import {typeReceipt, GetReceiptList,Clients,Users} from "./queries";
import ProcessModal from "@components/modals/receiptBillModals/processModal"
import authContext from "@context/authContext";
import { toast } from "react-toastify";
import { DatePicker } from '@mui/x-date-pickers';
import { differenceInDays, startOfDay, isAfter, format,addDays } from "date-fns";
import { useFetch } from "@hooks/useFetch";
import {
  Tabs,
  Tab,

} from '@mui/material';
import CustomTooltip from "@styles/customTooltip";
import CustomDataGrid from "@styles/tables";
import moment from "moment";
import ValueFormat from "@formats/ValueFormat";

export const ReceiptC = ({ formik, 
                            data, 
                            pendingAmount,
                            presentValueInvestor,
                            loading,
                            success,
                            isModalOpen,
                            setIsModalOpen,
                            showConfirmationModal,
                            setShowConfirmationModal }) => {
  
  const [valueD, setValue] = useState(dayjs("2014-08-18T21:11:54"));
  const [valueDate, setValueDate] = useState(dayjs("2014-08-18T21:11:54"));
   const { user, logout } = useContext(authContext);

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [activeTab, setActiveTab] = useState(0);
  const {
    fetch: fetchReceipt,
    loading: loadingReceipt,
    error: errorReceipt,
    data: dataReceipt,
  } = useFetch({ service: typeReceipt, init: true });



const {
  fetch: fetchGetReceiptList,
  loading: loadingGetReceiptList,
  error: errorGetReceiptList,
  data: dataGetReceiptList,
} = useFetch({
  service: (args) => GetReceiptList({ 
    page, 
    opId:data?.[0].operation.opId || "", 
    ...args 
  }),
  init: false, // No ejecutar inmediatamente
});


useEffect(() => {
  if (user) {
    formik.setFieldValue('user_created_at',user?.id)
  }
}, [user]);

// Ejecutar cuando data.opId esté disponible
useEffect(() => {
  if (data?.[0].operation.opId) {
    fetchGetReceiptList();
  }
}, [data?.[0].operation.opId]);

const dataCount = dataGetReceiptList?.count || 0;



  const {
    fetch: fetchClients,
    loading: loadingClients,
    error: errorClients,
    data: dataClients,
  } = useFetch({ service: Clients, init: true });

  const {
    fetch: fetchUsers,
    loading: loadingUsers,
    error: errorUsers,
    data: dataUsers,
  } = useFetch({ service: Users, init: true });

// Crear un mapa de clientes para búsqueda rápida
const clientsMap = {};
if (dataClients?.data) {
  dataClients.data.forEach(client => {
    clientsMap[client.id] = client;
  });
}
console.log(data)


const usersMap = {};
if (dataUsers?.data) {  // Asumiendo que dataUsers tiene una propiedad data con el array de usuarios
  dataUsers.data.forEach(user => {
    usersMap[user.id] = user;
  });
}

const receipt = dataGetReceiptList?.results?.map((receipt) => {
  // Obtener el inversionista de la operación
  const investorId = receipt.account?.client;
  let investorName = 'N/A';
  
  // Buscar el nombre del inversionista en el mapa de clientes
  if (investorId && clientsMap[investorId]) {
    const investor = clientsMap[investorId];
    investorName = investor.social_reason || 
                  `${investor.first_name || ''} ${investor.last_name || ''}`.trim() ||
                  investor.document_number ||
                  'N/A';
  }


    // Obtener el usuario que creó el recaudo
  const userId = receipt.user_created_at;
  let userName = 'N/A';data
  
  // Buscar el nombre del usuario en el mapa de usuarios
  if (userId && usersMap[userId]) {
    const user = usersMap[userId];
    userName = `${user.first_name || ''} ${user.last_name || ''}`.trim() ||
               user.email ||
               'N/A';
  }
  return {
    id: receipt.id,
    dId: receipt.dId,
    date: receipt.date,
    created_at: receipt.created_at,
    typeReceipt: receipt.typeReceipt?.description || 'N/A',
    statusReceipt: receipt.receiptStatus?.description || 'N/A',
    operation: receipt.operation?.opId || 'N/A',
    investor: investorName, // ← Aquí agregamos el nombre del inversionista
    payedAmount: receipt.payedAmount || 0,
    realDays: receipt.realDays || 0,
    additionalDays: receipt.additionalDays || 0,
    calculatedDays: receipt.calculatedDays || 0,
    additionalInterests: receipt.additionalInterests || 0,
    additionalInterestsSM: receipt.additionalInterestsSM || 0,
    investorInterests: receipt.investorInterests || 0,
    remaining: receipt.remaining || 0,
    tableInterests: receipt.tableInterests || 0,
    tableRemaining: receipt.tableRemaining || 0,
    presentValueInvestor: receipt.presentValueInvestor || 0,
    user_created_at_id:userName,
  };
}) || [];
const columns = [
 {
  field: "typeReceipt",
  headerName: "TIPO / ESTADO",
  width: 180,
  renderCell: (params) => {
    const type = params.row.typeReceipt || '';
    const status = params.row.statusReceipt || '';

    return (
      <CustomTooltip
        title={`${type} / ${status}`}
        placement="bottom-start"
        TransitionComponent={Fade}
      >
        <Box display="flex" flexDirection="column">
          <Typography
            fontSize="0.85rem"
            fontWeight="bold"
            color="#5eaea3" // Azul tipo "link"
            lineHeight={1.2}
          >
            {type}
          </Typography>
          <Typography
            fontSize="0.8rem"
            color="#333" // Gris oscuro
            lineHeight={1.2}
          >
            {status}
          </Typography>
        </Box>
      </CustomTooltip>
    );
  },
}
,
  {
    field: "date",
    headerName: "APLICADO EN",
    width: 120,
    renderCell: (params) => {
      return (
        <InputTitles>
          {params.value ? moment(params.value).format("DD/MM/YYYY") : "N/A"}
        </InputTitles>
      );
    },
  },
  {
    field: "payedAmount",
    headerName: "MONTO APLICADO",
    width: 140,
    renderCell: (params) => {
      return (
        <InputTitles>
          <ValueFormat prefix="$ " value={params.value} thousandSeparator />
        </InputTitles>
      );
    },
  },
  {
    field: "investor",
    headerName: "INVERSIONISTA",
    width: 200,
    renderCell: (params) => {
      return (
        <CustomTooltip
          title={params.value}
          placement="bottom-start"
        >
          <InputTitles noWrap>
            {params.value || "N/A"}
          </InputTitles>
        </CustomTooltip>
      );
    },
  },
  {
    field: "presentValueInvestor",
    headerName: "VALOR PRESENTE",
    width: 150,
    renderCell: (params) => {
      return (
        <InputTitles>
          <ValueFormat prefix="$ " value={params.value} thousandSeparator />
        </InputTitles>
      );
    },
  },
  {
    field: "realDays",
    headerName: "DÍAS R.",
    width: 80,
    renderCell: (params) => {
      return (
        <CustomTooltip title={params.value}>
          <InputTitles>{params.value || 0}</InputTitles>
        </CustomTooltip>
      );
    },
  },
  {
    field: "additionalDays",
    headerName: "DÍAS +",
    width: 80,
    renderCell: (params) => {
      return (
        <CustomTooltip title={params.value}>
          <InputTitles>{params.value || 0}</InputTitles>
        </CustomTooltip>
      );
    },
  },
  {
    field: "calculatedDays",
    headerName: "DÍAS CALC",
    width: 90,
    renderCell: (params) => {
      return (
        <CustomTooltip title={params.value}>
          <InputTitles>{params.value || 0}</InputTitles>
        </CustomTooltip>
      );
    },
  },
  {
    field: "additionalInterests",
    headerName: "INTERESES +",
    width: 120,
    renderCell: (params) => {
      return (
        <CustomTooltip title={<ValueFormat prefix="$ " value={params.value} />}>
          <InputTitles>
            <ValueFormat prefix="$ " value={params.value} thousandSeparator />
          </InputTitles>
        </CustomTooltip>
      );
    },
  },
  {
    field: "additionalInterestsSM",
    headerName: "INTERESES + S M",
    width: 140,
    renderCell: (params) => {
      return (
        <CustomTooltip title={<ValueFormat prefix="$ " value={params.value} />}>
          <InputTitles>
            <ValueFormat prefix="$ " value={params.value} thousandSeparator />
          </InputTitles>
        </CustomTooltip>
      );
    },
  },
  {
    field: "investorInterests",
    headerName: "INTERESES INVERSOR",
    width: 140,
    renderCell: (params) => {
      return (
        <CustomTooltip title={<ValueFormat prefix="$ " value={params.value} />}>
          <InputTitles>
            <ValueFormat prefix="$ " value={params.value} thousandSeparator />
          </InputTitles>
        </CustomTooltip>
      );
    },
  },
  {
    field: "remaining",
    headerName: "REMANENTE",
    width: 120,
    renderCell: (params) => {
      return (
        <CustomTooltip title={<ValueFormat prefix="$ " value={params.value} />}>
          <InputTitles>
            <ValueFormat prefix="$ " value={params.value} thousandSeparator />
          </InputTitles>
        </CustomTooltip>
      );
    },
  },
  {
    field: "tableInterests",
    headerName: "INTERÉS MESA",
    width: 120,
    renderCell: (params) => {
      return (
        <CustomTooltip title={<ValueFormat prefix="$ " value={params.value} />}>
          <InputTitles>
            <ValueFormat prefix="$ " value={params.value} thousandSeparator />
          </InputTitles>
        </CustomTooltip>
      );
    },
  },
  {
    field: "tableRemaining",
    headerName: "REMANENTE MESA",
    width: 140,
    renderCell: (params) => {
      return (
        <CustomTooltip title={<ValueFormat prefix="$ " value={params.value} />}>
          <InputTitles>
            <ValueFormat prefix="$ " value={params.value} thousandSeparator />
          </InputTitles>
        </CustomTooltip>
      );
    },
  },
  {
    field: "created_at",
    headerName: "CREADO EN",
    width: 180,
    renderCell: (params) => {
    

      
      return (
        
          <InputTitles noWrap>
           {params.value ? moment(params.value).format("DD/MM/YYYY") : "N/A"}
          </InputTitles>
  
      );
    },
  },
  {
    field: "user_created_at_id",
    headerName: "REGISTRADO POR",
    width: 180,
    renderCell: (params) => {
      const registeredBy = params.value;

      
      return (
        
          <InputTitles noWrap>
            {registeredBy}
          </InputTitles>
  
      );
    },
  },

    
  
  
 // {
  //  field: "dId",
   // headerName: "ID",
    //width: 100,
    //renderCell: (params) => (
      //<CustomTooltip title={params.value}>
        //<InputTitles>{params.value}</InputTitles>
      //</CustomTooltip>
   // ),
  //},
  //{
    //field: "operation",
    //headerName: "OPERACIÓN",
    //width: 100,
    //renderCell: (params) => (
      //<CustomTooltip title={params.value}>
        //<InputTitles>{params.value}</InputTitles>
      //</CustomTooltip>
   // ),
  //},
];


 const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
   //tooltip adaptativo a moviles/escritorio

   const AdaptiveTooltip = ({ title, placement = '', children }) => {
  const [open, setOpen] = useState(false);

  const handleTooltipOpen = () => {
    setOpen(true);
  };

  const handleTooltipClose = () => {
    setOpen(false);
  };

  return (
    <ClickAwayListener onClickAway={handleTooltipClose}>
      
        <Tooltip
          title={title}
          placement={placement}
          arrow
          open={open}
          onClose={handleTooltipClose}
          disableFocusListener
          disableHoverListener
          disableTouchListener
        >
          <div onClick={handleTooltipOpen} style={{ display: 'inline-block' }}>
            {children}
          </div>
        </Tooltip>

    </ClickAwayListener>
  );
};

//fin codigo tooltip adaptativo


  const handleChange = (newValue) => {
    setValue(newValue);
  };
  const handleChange2 = (newValue) => {
    setValueDate(newValue);
  };
  const renderNombreUsuario = (usuario) => (
    <Box component="span" sx={{ color: 'text.primary', fontWeight: 500 }}>
      {usuario?.name}
    </Box>
  );

    const handleSubmitWithConfirmation = () => {
    if (formik.values.payedAmount <= 0) {
      Toast("Debe ingresar un valor a pagar", "error");
      return;
    }

    if (formik.values.receiptStatus === "") {
      Toast("Debe seleccionar un tipo de recaudo", "error");
      return;
    }

    setShowConfirmationModal(true);
  };

    const formatNumberWithThousandsSeparator = (value) => {
    if (value === undefined || value === null) return '';
    
    // Convert to string and split into integer and decimal parts
    const [integerPart, decimalPart] = value.toString().split('.');
    
    // Format only the integer part with commas
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    
    // Combine with decimal part if it exists
    return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
};

  const [typeID, setTypeID] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(-1);
  
    useEffect(() => {
      if (dataReceipt) {
        const typesID = dataReceipt?.data?.map((type) => ({
          label: type.description,
          value: type.id
        }));
        setTypeID(typesID);
        
        // Encontrar índice del valor actual
        if (formik.values.typeReceipt) {
          const index = typesID?.findIndex(option => option.value === formik.values.typeReceipt);
          setSelectedIndex(index);
        }
      }
    }, [dataReceipt, formik.values.typeReceipt]);


// O con switch (forma correcta)
const getColorByType = (typeId) => {
  switch(typeId) {
    case '3d461dea-0545-4a92-a847-31b8327bf033':
    case 'edd99cf7-6f47-4c82-a4fd-f13b4c60a0c0':
      return '#ff9100ff';
    case '62b0ca1e-f999-4a76-a07f-be1fe4f38cfb':
    case 'ed85d2bc-1a4b-45ae-b2fd-f931527d9f7f':
      return '#c70d0dff';
    case 'db1d1fa4-e467-4fde-9aee-bbf4008d688b':
    case 'd40e91b1-fb6c-4c61-9da8-78d4f258181d':
      return '#4CAF50';
    default:
      return '#607D8B';
  }
};


const formatDateToDDMMYYYY = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  
  // Usar métodos UTC para evitar problemas de zona horaria
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = date.getUTCFullYear();
  
  return `${day}/${month}/${year}`;
};



  return (
    <>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ padding: 5, backgroundColor: 'white', borderRadius: 1, boxShadow: 1 }}>
        <Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    flexWrap: 'wrap',
    gap: { xs: 0.5, sm: 2 },
    marginBottom: { xs: 0.5, sm: 0.5 },
    justifyContent: { xs: 'center', sm: 'flex-start' }
}}>
    <Typography
        letterSpacing={0}
        fontSize={{ xs: "1.4rem", sm: "1.7rem" }}
        fontWeight="regular"
        marginBottom="0"
        color="#5EA3A3"
        sx={{ 
            marginRight: { xs: 0.5, sm: 1 },
        }}
    >
        Factura: {data?.[0].operation.bill?.billId} Op: {data?.[0].operation.opId}
    </Typography>


</Box>
             <Box sx={{ width: '100%', mb: 3 }}>
         <Tabs 
  value={activeTab} 
  onChange={(event, newValue) => setActiveTab(newValue)}
  sx={{
    '& .MuiTabs-indicator': {
      backgroundColor: '#5EA3A3', // Color del indicador
    },
    '& .MuiTab-root': {
      color: '#cccccc', // Color del texto cuando no está seleccionado
    },
    '& .Mui-selected': {
      color: '#5EA3A3 !important', // Color del texto cuando está seleccionado
    },
  }}
>
<Tab 
    label="Ver Recaudo" 
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
    label="Historial de Recaudos" 
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

          <>
           <form onSubmit={formik.onSubmit}>

  

                 <Grid container justifyContent="space-between" alignItems="center">
                    {/* Título - Ocupa toda la fila en móviles, 6/12 en pantallas más grandes */}
                    <Grid item xs={12} md={6}>
                      <Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    flexWrap: 'wrap',
    gap: { xs: 0.5, sm: 2 },
    marginBottom: { xs: 0.5, sm: 0.5 },
    justifyContent: { xs: 'center', sm: 'flex-start' }
}}>

    {formik.values.typeReceipt && (
        <Box
            sx={{
                backgroundColor: getColorByType(formik.values.typeReceipt),
                color: "white",
                borderRadius: "12px",
                padding: { xs: "3px 8px", sm: "2px 8px" },
                fontSize: { xs: "0.8rem", sm: "1rem" },
                fontWeight: "bold",
                marginBottom: { xs: "0.2rem", sm: "0.1rem" },
                alignSelf: 'center',
                flexShrink: 0, // Evita que se reduzca
                whiteSpace: 'nowrap' // Evita salto de línea
            }}
        >
            {typeID?.find(option => option.value === formik.values.typeReceipt)?.label || 'Tipo de Recaudo'}
        </Box>
    )}
</Box>
                     
                    </Grid>
                    
                    {/* Información del usuario - Ocupa toda la fila en móviles, 6/12 en pantallas más grandes */}
                    <Grid item xs={12} md={6} sx={{ 
                      textAlign: { xs: 'left', md: 'right' },
                      marginTop: { xs: '0.2rem', md: 0 },
                      marginBottom: { xs: '1rem', md: 0 }
                    }}>
                      {user ? (
                        <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
                          Creado por: {renderNombreUsuario(user)}
                        </Typography>
                      ) : (
                        <Typography variant="subtitle1" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                          Sin información de autoría
                        </Typography>
                      )}
                    </Grid>
                  </Grid>
         
 
      {/* Primera fila con 4 campos */}
     <Grid container rowSpacing={2}  alignItems="stretch" justifyContent="space-between" mt={1}>
        <Grid item xs={12} md={2}>
<DesktopDatePicker
  label="Date desktop"
  inputFormat="DD/MM/YYYY"
  value={valueD}
  minDate={data?.opDate ? new Date(data.opDate) : null}
  onChange={(newValue) => {
    setValue(newValue);
    // Validación inmediata al cambiar la fecha
    if (newValue && data?.opDate && new Date(newValue) < new Date(data.opDate)) {
      formik.setFieldError('date', "la fecha de aplicacion no puede ser menor a la fecha de inicio");
      formik.setFieldTouched('date', true, false); // Marcar como touched
    } else {
      formik.setFieldError('date', ''); // Limpiar error si es válido
    }
    formik.setFieldValue('date', newValue);
  }}
  renderInput={(params) => (
    <TextField
      id="date"
      placeholder="Ingresa la fecha"
      name="date"
      type="date"
      label="Fecha de aplicación"
      fullWidth
      value={formik.values.date}
      onChange={formik.handleChange}
      error={formik.touched.date && Boolean(formik.errors.date)}
      helperText={formik.touched.date && formik.errors.date}
    disabled
      onBlur={() => {
        if (formik.values.date < data?.opDate) {
          toast("la fecha de aplicacion no puede ser menor a la fecha de inicio");
          formik.setFieldError('date',"la fecha de aplicacion no puede ser menor a la fecha de inicio");
          formik.setFieldValue('date',data.opDate)
        }
      }}
    />
  )}
/>
<HelperText>
  {formik.touched.date && formik.errors.date}
</HelperText>
        </Grid>

        <Grid item xs={12} md={2}>
          <ReceiptStatusSelect
            formik={formik}
            disabled={true}
          />
        </Grid>

    
 
<Grid item xs={12} md={4}>
<BaseField
  fullWidth
      disabled
  InputProps={{
    startAdornment: (
      <i
        style={{
          color: "#5EA3A3",
          marginRight: "0.7vw",
          fontSize: "1.1vw",
        }}
        className="far fa-dollar-sign"
      ></i>
    ),
    endAdornment: (
      <AdaptiveTooltip
        title="Debe ser el monto registrado en el banco"
        placement="top-end"
        arrow
      >
        <IconButton edge="end" size="small" aria-label="Información">
          <InfoIcon style={{ fontSize: "1rem", color: "rgb(94, 163, 163)" }} />
        </IconButton>
      </AdaptiveTooltip>
    ),
  }}
  id="payedAmount"
  name="payedAmount"
  label="Monto Aplicación"
 
  thousandSeparator="."
  decimalSeparator=","
  decimalScale={0}
  allowNegative={false}
  isMasked
  error={formik.touched.payedAmount && Boolean(formik.errors.payedAmount)}
     value={formik.values.payedAmount ?? 0} // Nullish coalescing
  onChangeMasked={(values) => {
    // Convertir cualquier valor falsy a 0
    const newValue = values.floatValue ? Number(values.floatValue) : 0;
    formik.setFieldValue("payedAmount", newValue);
  }}
  onBlur={() => {
    // Validación segura
    const payedAmount = Number(formik.values.payedAmount) || 0;
    const additionalInterests = Number(formik.values.additionalInterests) || 0;
    
    if (payedAmount < additionalInterests) {
      toast("El monto de aplicación no puede ser menor a los intereses adicionales");
       formik.setFieldValue("payedAmount",0);
    }
  }}
/>

</Grid>

  


  


      </Grid>



   
  


                    {/* Contenedores de datos operacion y recuados */}
<Grid container spacing={2}>
 <Grid container spacing={2} mt={5} ml={2.5}>
  <Box sx={{ width: '100%' }}>
    <Typography
      letterSpacing={0}
      fontSize="1.5rem"
      fontWeight="regular"
      color="#5EA3A3"
      sx={{ mb: 0.5 }}  // Reduje el marginBottom a 0.5 (4px)
    >
      Datos de la Operación

    </Typography>
    
    <Divider 
      sx={{ 
        backgroundColor: '#5EA3A3', 
        height: '1px',
        width: '100%',
        mt: 0.5,  // Margen superior reducido
        mb: 5     // Margen inferior normal
      }} 
    />

    
  </Box>

 
<Grid container spacing={2}>
    {/* Factura asociada */}
  <Grid item xs={12} md={6}>
    <Typography variant="body1">
      <Box component="span" fontWeight="500" mr={2} fontSize="1.1rem">Factura asociada:</Box>
      <Box component="span" color="#5EA3A3" fontSize="1.1rem">
        {data?.[0].operation.bill?.billId}
      </Box>
    </Typography>
  </Grid>

  {/* Valor Nominal */}
  <Grid item xs={12} md={6}>
    <Typography variant="body1">
      <Box component="span" fontWeight="500" mr={2} fontSize="1.1rem">Valor Nominal:</Box>
      <Box component="span" color="#5EA3A3" fontSize="1.1rem">
        {formatNumberWithThousandsSeparator(data?.[0].operation.payedAmount)}
      </Box>
    </Typography>
  </Grid>
    {/* Nombre del inversionista */}
  <Grid item xs={12} md={6}>
    <Typography variant="body1">
      <Box component="span" fontWeight="500" mr={2} fontSize="1.1rem">Fecha Inicio:</Box>
      <Box component="span" color="#5EA3A3" fontSize="1.1rem">
        {formatDateToDDMMYYYY(data?.[0].operation.opDate)}
      </Box>
    </Typography>
  </Grid>
  {/* Nombre del inversionista */}
  <Grid item xs={12} md={6}>
    <Typography variant="body1">
      <Box component="span" fontWeight="500" mr={2} fontSize="1.1rem">Fecha Fin:</Box>
      <Box component="span" color="#5EA3A3" fontSize="1.1rem">
        {formatDateToDDMMYYYY(data?.[0].operation.opExpiration)}
      </Box>
    </Typography>
  </Grid>
  {/* Nombre del inversionista */}
  <Grid item xs={12} md={6}>
    <Typography variant="body1">
      <Box component="span" fontWeight="500" mr={2} fontSize="1.1rem">Emisor:</Box>
      <Box component="span" color="#5EA3A3" fontSize="1.1rem">
        {data?.[0].operation.emitter?.social_reason || `${data?.[0].operation.emitter?.first_name || ''} ${data?.[0].operation.emitter?.last_name || ''}`.trim()}
      </Box>
    </Typography>
  </Grid>
  {/* Nombre del inversionista */}
  <Grid item xs={12} md={6}>
    <Typography variant="body1">
      <Box component="span" fontWeight="500" mr={2} fontSize="1.1rem">Pagador:</Box>
      <Box component="span" color="#5EA3A3" fontSize="1.1rem">
        {data?.[0].operation.payer?.social_reason || `${data?.[0].operation.payer?.first_name || ''} ${data?.[0].operation.payer?.last_name || ''}`.trim()}
      </Box>
    </Typography>
  </Grid>
  {/* Nombre del inversionista */}
  <Grid item xs={12} md={6}>
    <Typography variant="body1">
      <Box component="span" fontWeight="500" mr={2} fontSize="1.1rem">Nombre inversionista:</Box>
      <Box component="span" color="#5EA3A3" fontSize="1.1rem">
        {data?.[0].operation.investor?.social_reason || `${data?.[0].operation.investor?.first_name || ''} ${data?.[0].operation.investor?.last_name || ''}`.trim()}
      </Box>
    </Typography>
  </Grid>

  {/* NIT del inversionista */}
  <Grid item xs={12} md={6}>
    <Typography variant="body1">
      <Box component="span" fontWeight="500" mr={2} fontSize="1.1rem">Cuenta inversionista:</Box>
      <Box component="span" color="#5EA3A3" fontSize="1.1rem">
        {data?.[0].operation.clientAccount?.account_number}
      </Box>
    </Typography>
  </Grid>

  




</Grid>
</Grid>
                
                
  <Grid container spacing={2} mt={3} ml={2.5}>
  <Box sx={{ width: '100%' }}>
    <Typography
      letterSpacing={0}
      fontSize="1.5rem"
      fontWeight="regular"
      color="#5EA3A3"
      sx={{ mb: 0.5 }}  // Reduje el marginBottom a 0.5 (4px)
    >
      Datos del Recaudo
    </Typography>
    
    <Divider 
      sx={{ 
        backgroundColor: '#5EA3A3', 
        height: '1px',
        width: '100%',
        mt: 0.5,  // Margen superior reducido
        mb: 2     // Margen inferior normal
      }} 
    />
  </Box>

  <Grid container spacing={2}>
  {/* Días reales */}
  <Grid item xs={12} md={6}>
    <Typography variant="body1">
      <Box component="span" fontWeight="500" mr={2} fontSize="1.1rem">Días reales</Box>
      <Box component="span" color="#5EA3A3" fontSize="1.1rem">
        {formik.values.realDays}
        
      </Box>
    </Typography>
  </Grid>

  {/* Valor futuro Recalculado */}

 
{/* Dias adicionales  */}
 <Grid item xs={12} md={6}>
    <Typography variant="body1">
      <Box component="span" fontWeight="500" mr={2} fontSize="1.1rem">Días adicionales
       </Box>
      <Box component="span" color="#5EA3A3" fontSize="1.1rem">
        {formik.values.additionalDays}

        
      </Box>
    </Typography>
  </Grid>

  {/* Remanente Mesa  */}
  <Grid item xs={12} md={6}>
    <Typography variant="body1">
      <Box component="span" fontWeight="500" mr={2} fontSize="1.1rem">Remanente Mesa </Box>
      <Box component="span" color="#5EA3A3" fontSize="1.1rem">
        {formatNumberWithThousandsSeparator(formik.values.tableRemaining?.toFixed(0))}
      </Box>
    </Typography>
  </Grid>

    {/* Pendiente por cobrar  */}
  <Grid item xs={12} md={6}>
    <Typography variant="body1">
      <Box component="span" fontWeight="500" mr={2} fontSize="1.1rem">Pendiente por cobrar    
        <AdaptiveTooltip
        title="Muestra el saldo pendiente después de descontar el monto aplicado y los intereses adicionales al valor nominal de la factura."
        placement="top-end"
        arrow
      >
        <IconButton edge="end" size="small" aria-label="Información">
          <InfoIcon style={{ fontSize: '1rem', color: 'rgb(94, 163, 163)' }} />
        </IconButton>
       </AdaptiveTooltip></Box>
      <Box component="span" color="#5EA3A3" fontSize="1.1rem">
       {formatNumberWithThousandsSeparator(formik.values.opPendingAmount || 0)}

        
      </Box>
    </Typography>
  </Grid>

  {/* Intereses adicionales totales  */}
  <Grid item xs={12} md={6}>
    <Typography variant="body1">
      <Box component="span" fontWeight="500" mr={2} fontSize="1.1rem">Intereses adicionales totales </Box>
      <Box component="span" color="#5EA3A3" fontSize="1.1rem">
        {formatNumberWithThousandsSeparator(formik.values.additionalInterests?.toFixed(0))}
      </Box>
    </Typography>
  </Grid>
 


  
    {/* Remanente Emisor    */}
    <Grid item xs={12} md={6}>
    <Typography variant="body1">
      <Box component="span" fontWeight="500" mr={2} fontSize="1.1rem">Remanente Emisor   <AdaptiveTooltip
        title={<p>Este campo se calcula automáticamente cuando el <strong>monto neto del recaudo</strong> (Monto aplicación -  Intereses adicionales) es mayor que el valor pendiente de pago</p>}
        placement="top-end"
        arrow
      >
        <IconButton edge="end" size="small" aria-label="Información">
          <InfoIcon style={{ fontSize: '1rem', color: 'rgb(94, 163, 163)' }} />
        </IconButton>
        </AdaptiveTooltip></Box>
      <Box component="span" color="#5EA3A3" fontSize="1.1rem">
        {formatNumberWithThousandsSeparator(formik.values.remaining?.toFixed(0))}
      </Box>
    </Typography>
  </Grid>

  {/* Intereses adicionales Inv. */}
  <Grid item xs={12} md={6}>
    <Typography variant="body1">
      <Box component="span" fontWeight="500" mr={2} fontSize="1.1rem">Intereses adicionales Inv. </Box>
      <Box component="span" color="#5EA3A3" fontSize="1.1rem">
        {formatNumberWithThousandsSeparator(formik.values.investorInterests?.toFixed(0))}
      </Box>
    </Typography>
  </Grid>

  

  {/* Valor presente Inversionista */}
  <Grid item xs={12} md={6}>
    <Typography variant="body1">
      <Box component="span" fontWeight="500" mr={2} fontSize="1.1rem">Valor presente Inversionista 
         <AdaptiveTooltip
        title="Muestra el valor a ser abonado a la cuenta del inversionista."
        placement="top-end"
        arrow
      >
        <IconButton edge="end" size="small" aria-label="Información">
          <InfoIcon style={{ fontSize: '1rem', color: 'rgb(94, 163, 163)' }} />
        </IconButton>
       </AdaptiveTooltip>
      </Box>
      <Box component="span" color="#5EA3A3" fontSize="1.1rem">
        {formatNumberWithThousandsSeparator(presentValueInvestor?.toFixed(0))}
      </Box>
    </Typography>
  </Grid>

  {/* Intereses adicionales mesa */}
  <Grid item xs={12} md={6}>
    <Typography variant="body1">
      <Box component="span" fontWeight="500" mr={2} fontSize="1.1rem">Intereses adicionales mesa :</Box>
      <Box component="span" color="#5EA3A3" fontSize="1.1rem">
        {formatNumberWithThousandsSeparator(formik.values.additionalInterestsSM?.toFixed(0))}
      </Box>
    </Typography>
  </Grid>
</Grid>



</Grid>
          
   
           
          


            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                width: "calc(34vw + 4rem)",
                justifyContent: "flex-end",
              }}
            ></Box>

          
          

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
   


               </Grid>
               


        </form>
          </>
       ):(// Contenido de la segunda pestaña (tabla de eventos)
        <>
         <Box
        container
        marginTop={4}
        display="flex"
        flexDirection="column"
        width="100%"
        minHeight="60rem"
      >
       

    
       <CustomDataGrid
  rows={receipt}
  columns={columns}
  pageSize={15}
  rowsPerPageOptions={[5]}
  disableSelectionOnClick
  disableColumnMenu
  autoHeight
  sx={{
    '& .MuiDataGrid-columnHeaders': {
      backgroundColor: '#e2e0e0ff', // Gris claro para los headers
      color: '#000000', // Negro para el texto de los headers
    
    },
    '& .MuiDataGrid-columnHeaderTitle': {
      fontWeight: '600',
      fontSize: '0.85rem',
      color: '#000000', // Negro para el título de las columnas
    },
    '& .MuiDataGrid-iconButtonContainer': {
      visibility: 'visible !important', // Mostrar siempre los iconos de ordenamiento
    },
    '& .MuiDataGrid-menuIcon': {
      visibility: 'visible !important', // Mostrar siempre el icono del menú
    },
    '& .MuiDataGrid-sortIcon': {
      color: '#5EA3A3', // Color verde para los iconos de ordenamiento
      opacity: 1, // Hacerlos completamente visibles
      fontSize: '1rem',
    },
    '& .MuiDataGrid-columnHeader:hover .MuiDataGrid-sortIcon': {
      color: '#5EA3A3', // Mantener el mismo color al hover
      opacity: 1,
    },
    '& .MuiDataGrid-virtualScroller': {
      minHeight: receipt.length === 0 ? '200px' : 'auto',
    },
    '& .MuiDataGrid-main': {
      width: '100%',
      overflow: 'auto',
    },
    // Estilos para los iconos de ordenamiento activos
    '& .MuiDataGrid-columnHeaderSorted .MuiDataGrid-sortIcon': {
      color: '#5EA3A3', // Color verde para ordenamiento activo
      opacity: 1,
    },
  }}
  components={{
    ColumnSortedAscendingIcon: () => (
      <Typography fontFamily="icomoon" fontSize="0.7rem" sx={{ color: '#5EA3A3' }}>
        &#xe908;
      </Typography>
    ),

    ColumnSortedDescendingIcon: () => (
      <Typography fontFamily="icomoon" fontSize="0.7rem" sx={{ color: '#5EA3A3' }}>
        &#xe908;
      </Typography>
    ),

    NoRowsOverlay: () => (
      <Box
        height="200px"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography
          fontSize="0.9rem"
          fontWeight="600"
          color="#488B8F"
        >
          No hay recaudos registrados
        </Typography>
      </Box>
    ),

    Pagination: () => (
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        width="100%"
        padding="8px 16px"
        backgroundColor="#fafafa"
      >
        <Typography fontSize="0.8rem" fontWeight="600" color="#5EA3A3">
          {page * 15 - 14} - {Math.min(page * 15, dataCount)} de {dataCount}
        </Typography>
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
        >
          <Typography
            fontFamily="icomoon"
            fontSize="1.2rem"
            marginRight="0.8rem"
            sx={{
              cursor: page > 1 ? "pointer" : "not-allowed",
              transform: "rotate(180deg)",
              color: page > 1 ? "#63595C" : "#cccccc",
            }}
            onClick={() => {
              if (page > 1) {
                fetch({
                  page: page - 1,
                  ...(Boolean(filter) && { [filter]: query }),
                });
                setPage(page - 1);
              }
            }}
          >
            &#xe91f;
          </Typography>
          <Typography
            fontFamily="icomoon"
            fontSize="1.2rem"
            sx={{
              cursor: page < Math.ceil(dataCount / 15) ? "pointer" : "not-allowed",
              color: page < Math.ceil(dataCount / 15) ? "#63595C" : "#cccccc",
            }}
            onClick={() => {
              if (page < Math.ceil(dataCount / 15)) {
                fetch({
                  page: page + 1,
                  ...(Boolean(filter) && { [filter]: query }),
                });
                setPage(page + 1);
              }
            }}
          >
            &#xe91f;
          </Typography>
        </Box>
      </Box>
    ),
  }}
  componentsProps={{
    pagination: {
      color: "#5EA3A3",
    },
  }}
  loading={loadingGetReceiptList}
/>
      </Box>
        </>
        
    
    
    )}

       {/* Modal de Confirmación */}
        <ModalConfirmation
            values={formik.values}
            showConfirmationModal={showConfirmationModal}
            setShowConfirmationModal={setShowConfirmationModal}
            handleSubmit={formik.handleSubmit}
          />

          <ProcessModal
            open={isModalOpen}
            success={success}
            onClose={() => setIsModalOpen(false)}
          />

      <ToastContainer
        position="top-right"
        autoClose={2000}
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
           
    </>
  );
};