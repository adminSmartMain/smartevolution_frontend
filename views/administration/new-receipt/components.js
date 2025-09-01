import { useEffect,useState,useContext } from "react";
import { ToastContainer } from "react-toastify";
import { useRouter } from "next/router";
import { Box, Typography } from "@mui/material";
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
import {typeReceipt} from "./queries";
import ProcessModal from "@components/modals/receiptBillModals/processModal"
import authContext from "@context/authContext";
import { useFetch } from "@hooks/useFetch";



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


  const {
    fetch: fetchReceipt,
    loading: loadingReceipt,
    error: errorReceipt,
    data: dataReceipt,
  } = useFetch({ service: typeReceipt, init: true });



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

console.log(data)
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
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    
    // Combine with decimal part if it exists
    return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
};

  const [typeID, setTypeID] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    console.log(dataReceipt)
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

console.log(dataReceipt)
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
  return (
    <>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ padding: 5, backgroundColor: 'white', borderRadius: 1, boxShadow: 1 }}>
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
        Registrar Recaudo Op: {data?.opId}
    </Typography>

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
     <Grid container rowSpacing={2}  alignItems="stretch" justifyContent="space-between" mt={3}>
        <Grid item xs={12} md={2}>
          <DesktopDatePicker
            label="Date desktop"
            inputFormat="DD/MM/YYYY"
            value={valueD}
            onChange={handleChange}
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
                sx={formik.touched.date && Boolean(formik.errors.date) ? 
                  { border: "1.4px solid #E6643180" } : null}
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
            disabled={false}
          />
        </Grid>

    
    <Grid item xs={12} md={1}>
  <TextField
    id="calculatedDays"
    placeholder="Días Cálculo"
    name="calculatedDays"
    type="number"
    label="Días Cálculo"
    value={formik.values.calculatedDays}
    fullWidth
    InputProps={{
      endAdornment: (
     <AdaptiveTooltip
  title="Este campo se completa automáticamente con los dias reales calculados, pero puedes modificarlo manualmente"
  placement="top-end"
>
  <IconButton edge="end" size="small" aria-label="Información">
    <InfoIcon style={{ fontSize: '1rem', color: 'rgb(94, 163, 163)' }} />
  </IconButton>
</AdaptiveTooltip>
      ),
    }}
    onChange={formik.handleChange}
    error={formik.touched.calculatedDays && Boolean(formik.errors.calculatedDays)}
  />
</Grid>
<Grid item xs={12} md={4}>
  <BaseField
    fullWidth
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
            <InfoIcon style={{ fontSize: '1rem', color: 'rgb(94, 163, 163)' }} />
          </IconButton>
       </AdaptiveTooltip>
      ),
    }}
    id="payedAmount"
    name="payedAmount"
    label="Monto Aplicación"
    value={formik.values.payedAmount}
    thousandSeparator="."
    decimalSeparator=","
    decimalScale={0}
    allowNegative={false}
    isMasked
    error={formik.touched.payedAmount && Boolean(formik.errors.payedAmount)}
    onChangeMasked={(values) => {
                    formik.setFieldValue("payedAmount", values.floatValue);
                  }}
  />
</Grid>

  


  


      </Grid>



   
  


                    {/* Contenedores de datos operacion y recuados */}
<Grid container spacing={2}>
 <Grid container spacing={2} mt={7} ml={2.5}>
  <Box sx={{ width: '100%' }}>
    <Typography
      letterSpacing={0}
      fontSize="1.7rem"
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
        {data?.bill?.billId}
      </Box>
    </Typography>
  </Grid>

  {/* Valor Nominal */}
  <Grid item xs={12} md={6}>
    <Typography variant="body1">
      <Box component="span" fontWeight="500" mr={2} fontSize="1.1rem">Valor Nominal:</Box>
      <Box component="span" color="#5EA3A3" fontSize="1.1rem">
        {formatNumberWithThousandsSeparator(data?.payedAmount)}
      </Box>
    </Typography>
  </Grid>
    {/* Nombre del inversionista */}
  <Grid item xs={12} md={6}>
    <Typography variant="body1">
      <Box component="span" fontWeight="500" mr={2} fontSize="1.1rem">Fecha Inicio:</Box>
      <Box component="span" color="#5EA3A3" fontSize="1.1rem">
        {data?.opDate}
      </Box>
    </Typography>
  </Grid>
  {/* Nombre del inversionista */}
  <Grid item xs={12} md={6}>
    <Typography variant="body1">
      <Box component="span" fontWeight="500" mr={2} fontSize="1.1rem">Fecha Fin:</Box>
      <Box component="span" color="#5EA3A3" fontSize="1.1rem">
        {data?.opExpiration}
      </Box>
    </Typography>
  </Grid>
  {/* Nombre del inversionista */}
  <Grid item xs={12} md={6}>
    <Typography variant="body1">
      <Box component="span" fontWeight="500" mr={2} fontSize="1.1rem">Emisor:</Box>
      <Box component="span" color="#5EA3A3" fontSize="1.1rem">
        {data?.emitter?.social_reason || `${data?.emitter?.first_name || ''} ${data?.emitter?.last_name || ''}`.trim()}
      </Box>
    </Typography>
  </Grid>
  {/* Nombre del inversionista */}
  <Grid item xs={12} md={6}>
    <Typography variant="body1">
      <Box component="span" fontWeight="500" mr={2} fontSize="1.1rem">Pagador:</Box>
      <Box component="span" color="#5EA3A3" fontSize="1.1rem">
        {data?.payer?.social_reason || `${data?.payer?.first_name || ''} ${data?.payer?.last_name || ''}`.trim()}
      </Box>
    </Typography>
  </Grid>
  {/* Nombre del inversionista */}
  <Grid item xs={12} md={6}>
    <Typography variant="body1">
      <Box component="span" fontWeight="500" mr={2} fontSize="1.1rem">Nombre inversionista:</Box>
      <Box component="span" color="#5EA3A3" fontSize="1.1rem">
        {data?.investor?.social_reason || `${data?.investor?.first_name || ''} ${data?.investor?.last_name || ''}`.trim()}
      </Box>
    </Typography>
  </Grid>

  {/* NIT del inversionista */}
  <Grid item xs={12} md={6}>
    <Typography variant="body1">
      <Box component="span" fontWeight="500" mr={2} fontSize="1.1rem">Cuenta inversionista:</Box>
      <Box component="span" color="#5EA3A3" fontSize="1.1rem">
        {data?.clientAccount?.account_number}
      </Box>
    </Typography>
  </Grid>

  




</Grid>
</Grid>
                
                
  <Grid container spacing={2} mt={7} ml={2.5}>
  <Box sx={{ width: '100%' }}>
    <Typography
      letterSpacing={0}
      fontSize="1.7rem"
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
      <Box component="span" fontWeight="500" mr={2} fontSize="1.1rem">Dias reales</Box>
      <Box component="span" color="#5EA3A3" fontSize="1.1rem">
        {formik.values.realDays}
        
      </Box>
    </Typography>
  </Grid>

  {/* Valor futuro Recalculado */}
  <Grid item xs={12} md={6}>
    <Typography variant="body1">
      <Box component="span" fontWeight="500" mr={2} fontSize="1.1rem">Valor futuro Recalculado  <AdaptiveTooltip
        title="Muestra el valor a reconocer al inversionista en caso de recaudos anticipados, tomando en cuenta los días reales de la operación."
        placement="top-end"
        arrow
      >
        <IconButton edge="end" size="small" aria-label="Información">
          <InfoIcon style={{ fontSize: '1rem', color: 'rgb(94, 163, 163)' }} />
        </IconButton>
       </AdaptiveTooltip></Box>
      <Box component="span" color="#5EA3A3" fontSize="1.1rem">
        {formatNumberWithThousandsSeparator(formik.values.futureValueRecalculation?.toFixed(0))}
      </Box>
    </Typography>
  </Grid>
  <Grid item xs={12}>
    <Divider sx={{ borderColor: '#d8d7d7ff' }} />
  </Grid>
{/* Dias adicionales  */}
 <Grid item xs={12} md={6}>
    <Typography variant="body1">
      <Box component="span" fontWeight="500" mr={2} fontSize="1.1rem">Dias adicionales
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
 <Grid item xs={12}>
    <Divider sx={{ borderColor:'#d8d7d7ff' }} />
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
        {formatNumberWithThousandsSeparator(pendingAmount)}

        
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
 <Grid item xs={12}>
    <Divider sx={{ borderColor:'#d8d7d7ff' }} />
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

   <Grid item xs={12}>
    <Divider sx={{ borderColor: '#d8d7d7ff' }} />
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

 <Grid item xs={12}>
    <Divider sx={{ borderColor: '#d8d7d7ff' }} />
  </Grid>

</Grid>
          
   
           
          
  <Grid container spacing={2} mt={7} ml={1}>
           {formik.values.lastDate && (
              <>
 <Box sx={{ width: '100%' }} ml={1.5}>
    <Typography
      letterSpacing={0}
      fontSize="1.7rem"
      fontWeight="regular"
      color="#5EA3A3"
      sx={{ mb: 0.5 }}  // Reduje el marginBottom a 0.5 (4px)
    >
      Datos de Recaudos Anteriores
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
               {/* Fecha Último Recaudo */}
               <Grid item xs={12} md={6}>

                
    <Typography variant="body1">
      <Box component="span" fontWeight="500" mr={2} fontSize="1.1rem">Fecha Último Recaudo</Box>
      <Box component="span" color="#5EA3A3" fontSize="1.1rem">
        {formik.values.lastDate}
      </Box>
    </Typography>
  </Grid>

   {/* Monto Recaudos Previos< */}
   <Grid item xs={12} md={6}>
    <Typography variant="body1">
      <Box component="span" fontWeight="500" mr={2} fontSize="1.1rem">Monto Recaudos Previos</Box>
      <Box component="span" color="#5EA3A3" fontSize="1.1rem">
        {formatNumberWithThousandsSeparator(formik.values.previousPayedAmount)}
      </Box>
    </Typography>
  </Grid>
 <Grid item xs={12}>
    <Divider sx={{ borderColor: '#d8d7d7ff'}} />
  </Grid>

   {/* Intereses */}
   <Grid item xs={12} md={6}>
    <Typography variant="body1">
      <Box component="span" fontWeight="500" mr={2} fontSize="1.1rem"> Intereses</Box>
      <Box component="span" color="#5EA3A3" fontSize="1.1rem">
        {formatNumberWithThousandsSeparator(formik.values.interest)}
      </Box>
    </Typography>
  </Grid>
        <Grid item xs={12}>
    <Divider sx={{ borderColor: '#d8d7d7ff' }} />
  </Grid>
       
              </>
            )}

    </Grid>          
            
     
            {data?.previousOperationBill && (
              <>
              <Grid item xs={12} md={6}>
                
    <Typography variant="body1">
      <Box component="span" fontWeight="500" mr={2} fontSize="1.1rem"> Fecha Radicación</Box>
      <Box component="span" color="#5EA3A3" fontSize="1.1rem">
        {formik.values.previousOpDate}
      </Box>
    </Typography>
  </Grid>
  <Grid item xs={12} md={6}>
    <Typography variant="body1">
      <Box component="span" fontWeight="500" mr={2} fontSize="1.1rem">  Tasa Descuento</Box>
      <Box component="span" color="#5EA3A3" fontSize="1.1rem">
        {formatNumberWithThousandsSeparator(formik.values.previousDiscountTax)}
      </Box>
    </Typography>
  </Grid>
   <Grid item xs={12}>
    <Divider sx={{ borderColor: '#d8d7d7ff' }} />
  </Grid>

  <Grid item xs={12} md={6}>
    <Typography variant="body1">
      <Box component="span" fontWeight="500" mr={2} fontSize="1.1rem">  Nro Operacion</Box>
      <Box component="span" color="#5EA3A3" fontSize="1.1rem">
       {formik.values.previousOpNumber}
      </Box>
    </Typography>
  </Grid>
          <Grid item xs={12}>
    <Divider sx={{ borderColor: '#d8d7d7ff' }} />
  </Grid>
     
              </>
            )}

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
   

     <Grid item xs={12}>
            <MuiButton
              type="button"
              variant="contained"
              onClick={handleSubmitWithConfirmation}
              disabled={formik.isSubmitting || loading}
              sx={{
                mb: 2,
                mt: 2,
                ml: 2,
                boxShadow: "none",
                borderRadius: "4px",
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '20rem',
              }}
            >
              <Typography fontWeight="bold" sx={{ textAlign: 'center' }}>
                Registrar
              </Typography>
            </MuiButton>
          </Grid> 

               </Grid>
               


        </form>
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