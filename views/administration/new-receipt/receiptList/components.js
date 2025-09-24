import { useState ,useEffect,useRef} from "react";
import { SearchOutlined } from "@mui/icons-material";
import { Box, Button, Fade, Typography,TextField ,Menu,MenuItem,IconButton, Divider,InputAdornment,} from "@mui/material";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
/* Modal imports*/
import ValueFormat from "@formats/ValueFormat";
import { useFetch } from "@hooks/useFetch";
import BackButton from "@styles/buttons/BackButton";
import CustomTooltip from "@styles/customTooltip";
import BaseField from "@styles/fields/BaseField";
import InputTitles from "@styles/inputTitles";
import CustomDataGrid from "@styles/tables";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import { DeleteDepositById, GetReceiptList,billById ,typeReceipt} from "./queries";
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Link from "next/link";
import moment from "moment";
import AdvancedDateRangePicker from "../../../../shared/components/AdvancedDateRangePicker";
import { useRouter } from "next/router";
import {

  Clear as ClearIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon
} from '@mui/icons-material';
const sectionTitleContainerSx = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "rigth",
};


const OperationCell = ({ params }) => {
  // Verificar que todos los parámetros existan
  if (!params || !params.row || !params.row.operation) {
    return <InputTitles>N/A</InputTitles>;
  }
  
  const [openTooltip, setOpenTooltip] = useState(false);
  const anchorRef = useRef(null);

  const router=useRouter()
  const handleClick = () => {
    setOpenTooltip((prevOpen) => !prevOpen);
  };

  const handleCloseTooltip = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpenTooltip(false);
  };

  const handleCloseIconClick = (e) => {
    e.stopPropagation();
    setOpenTooltip(false);
  };

  return (
    <div>
       <Box
        ref={anchorRef}
        onClick={handleClick}
        sx={{ cursor: 'pointer', display: 'inline-block' }}
      >
        <InputTitles>{params.row.operation.opId}</InputTitles>
      </Box>

      <CustomTooltip
        open={openTooltip}
        onClose={handleCloseTooltip}
        title={
    <Box
      sx={{
          // Fondo oscuro
        color: "#fff",           // Texto blanco
        p: 1.5,
        borderRadius: 1,
        minWidth: 230,
        fontSize: "0.85rem",
      }}
    >
        {/* Cabecera con título y botón de cerrar */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      
      >
        <Typography fontWeight="bold" fontSize="0.9rem">
          OpID {params.row.operation.opId}
        </Typography>

        <CloseIcon
                fontSize="small"
                sx={{
                  cursor: "pointer",
                  "&:hover": { color: "#ff5252" },
                }}
                onClick={handleCloseIconClick}
              />
      </Box>
      <Divider sx={{ my: 1, bgcolor: "#777" }} />

      <Typography>Emisor: {params.row.operation.emitter?.social_reason ||
        `${params.row.operation.emitter?.first_name || ""} ${params.row.operation.emitter?.last_name || ""}`.trim() || ""}</Typography>

      <Typography>Pagador: {params.row.operation.payer?.social_reason ||
        `${params.row.operation.payer?.first_name || ""} ${params.row.operation.payer?.last_name || ""}`.trim() || ""}</Typography>

      <Typography>Fecha Inicio: {params.row.operation.opDate}</Typography>
      <Typography>Fecha Fin: {params.row.operation.opExpiration}</Typography>
      <Typography>Valor Nominal: {params.row.operation.payedAmount}</Typography>
      <Typography>% Descuento: {params.row.operation.payedPercent}</Typography>

      <Box sx={{ mt: 1, ml:31,display: "flex", justifyContent: "flex-start", bgcolor:"#488b8f" ,color: "#ffffffff", width:'20px'}}   onClick={()=>(router.push(`/operations?opId=${params.row.operation.opId}`))}>
        <ReadMoreIcon fontSize="small" />
      </Box>
    </Box>
  }
        arrow
        placement="bottom-start"
        TransitionComponent={Fade}
        PopperProps={{
          modifiers: [
            {
              name: "offset",
              options: { offset: [0, 0] },
            },
          ],
          anchorEl: anchorRef.current || null, // Asegurar que no sea undefined
        }}
        disableFocusListener
        disableHoverListener
        disableTouchListener
      />
    </div>
  );
};
export const ReceiptListComponent = () => {
  const [filter, setFilter] = useState("");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState([false, "", null]);
    const [search, setSearch] = useState("");

  const [anchorElStatus, setAnchorElStatus] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [anchorElCSV, setAnchorElCSV] = useState(null);
    const openMenuCSV = Boolean(anchorElCSV);
    const openStatus = Boolean(anchorElStatus);



    const formatNumberWithThousandsSeparator = (value) => {
    if (value === undefined || value === null) return '';
    
    // Convert to string and split into integer and decimal parts
    const [integerPart, decimalPart] = value.toString().split('.');
    
    // Format only the integer part with commas
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    
    // Combine with decimal part if it exists
    return decimalPart ? ` ${formattedInteger}.${decimalPart}` : formattedInteger;
};

  const handleSelectStatus = (status) => {
    setSelectedStatus(status);
    handleCloseStatus();


    // Actualiza los filtros globales
    filtersHandlers.set({
      ...filtersHandlers.value,
      statusReceipt: status?.id || "", // Usa option.value o cadena vacía
      page: 1 // Resetear a primera página
    });
  };
   const router = useRouter();


 const {
    fetch: fetchReceipt,
    loading: loadingReceipt,
    error: errorReceipt,
    data: dataReceipt,
  } = useFetch({ service: typeReceipt, init: true });


    // Hooks
  const {
    fetch: fetch,
    loading: loading,
    error: error,
    data: data,
  } = useFetch({
    service: (args) => GetReceiptList({ page, ...filters}),
    init: true,
  });

console.log(dataReceipt)
  // Opciones estáticas de estados


  
  const dataCount = data?.count || 0;

  const [page, setPage] = useState(1);
// Filters


  const [filters, setFilters] = useState({

   
    opId_billId: "",
    statusReceipt: "",       
         
    startDate: "",
    endDate: ""
  });

  const filtersHandlers = {
    value: filters,
    set: setFilters,
    get: fetch,
    loading: loading,
    error: error,
    data: data?.results || {},
  };

  const [tempFilters, setTempFilters] = useState({ ...filtersHandlers.value });
  useEffect(() => {
    fetch();
  }, [
   
    filters.opId_billId,
    
    filters.startDate,
    filters.endDate,
    filters.statusReceipt,    // Añade esta dependencia
        // Añade esta dependencia
    page
  ]);

  
 // CODIGO DE MANEJO FILTRO POR 


  const [filterApplied, setFilterApplied] = useState(false);
  const updateFilters = (value, field) => {
      if (field !== "multi") {
    const newFilters = {
      ...filtersHandlers.value,  // Cambio clave: usar filtersHandlers.value en lugar de tempFilters
      [field]: value
    };

    filtersHandlers.set(newFilters);

    // Si el valor es diferente al filtro actual, marcamos como filtro aplicado
    if (filtersHandlers.value[field] !== value) {
      setFilterApplied(true);
    }
    return;
  }

  // Inicializamos los filtros vacíos
  const newFilters = {
    ...filtersHandlers.value,  // Cambio clave: mantener todos los filtros existentes
    opId_billId: value,        // Solo actualizar este campo
  };
    // Clasificación más precisa
    
      // Por defecto lo tratamos como inversionista
      newFilters.opId_billId = value;
     
    

    // Si las fechas no están vacías, las agregamos
    if (tempFilters.startDate && tempFilters.endDate) {
      newFilters.startDate = tempFilters.startDate;
      newFilters.endDate = tempFilters.endDate;
    }



    // Si las fechas no están vacías, las agregamos
    if (tempFilters.statusReceipt) {
      newFilters.statusReceipt = tempFilters.statusReceipt;

    }
     // Filtramos y actualizamos los filtros
  filtersHandlers.set(newFilters);

  setFilterApplied(true);
  setPage(1)
  };

  console.log(filters)

  const [openWindow, setOpenWindow] = useState(null);
  const handleMenuClickCSV = (event) => {
    setAnchorElCSV(event.currentTarget);
  };
  
  const handleCloseMenuCSV = () => {
    setAnchorElCSV(null);
  };
  
  const handleClearSearch = () => {
    const newFilters = {
      ...filtersHandlers.value,  // Mantiene todos los filtros actuales
      opId_billId: "",                  // Limpia solo estos campos
      page: 1                          // Resetea a la primera página
  };
    
    filtersHandlers.set(newFilters);  // Actualiza el estado conservando las fechas
    setSearch("");                    // Limpia el estado local de búsqueda si existe
  };

  const handleClickStatus = (event) => {
    setAnchorElStatus(event.currentTarget);
  };

  const handleCloseStatus = () => {
    setAnchorElStatus(null);
  };

    const handleClearStatus = () => {
    setSelectedStatus(null);
    filtersHandlers.set({
      ...filtersHandlers.value,
      statusReceipt: "",
      page: 1
    });
  };

  
const handleTextFieldChange = (evt) => {
  const value = evt.target.value;
  setSearch(value);
  
  // Si el campo queda vacío, actualizar filtros automáticamente
  if (value === "") {
    updateFilters("", "multi");
  }
};

  const handleDateRangeApply = (dateRange) => {
    // Actualiza solo las fechas manteniendo otros filtros

    filtersHandlers.set({
      ...filtersHandlers.value,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate
    });
 setPage(1)

  };
  const handleClear = () => {
    
    // Limpiar solo fechas en los filtros globales
    filtersHandlers.set({
      ...filtersHandlers.value,
      startDate: "",
      endDate: ""
    });
  };

  
  /* Experimento para exportar los datos del data grid a un archivo csv que pueda ser leido por Excel*/
  const handleExportExcel = () => {
    // Obtener los datos de las filas visibles en la página actual del DataGrid
    const currentRows = rows; // Aquí, rows son los datos actuales de la página.
  
    // Generar los encabezados de las columnas
    const columnHeaders = columns.map(col => col.headerName);
  
    // Convertir las filas de datos en formato CSV
    const csvContent = [
      columnHeaders.join(","), // Cabecera de las columnas
      ...currentRows.map(row =>
        columns.map(col => row[col.field] ? row[col.field] : "").join(",") // Filas de datos
      ),
    ].join("\n");
  
    // Crear un Blob con el contenido CSV
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  
    // Crear un enlace de descarga
    const link = document.createElement("a");
  
    // Crear un URL para el Blob
    const url = URL.createObjectURL(blob);
    
    // Configurar el enlace para que descargue el archivo CSV
    link.setAttribute("href", url);
    link.setAttribute("download", "datos_exportados.csv"); // Nombre del archivo
  
    // Simular un clic en el enlace para iniciar la descarga
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Funciones específicas que usan la función genérica
  const handleOpenReceiptDetail = (idOp) => {
    handleOpenWindow(`/administration/new-receipt/receipt-visualization?id=${idOp}`);
  };
    const handleOpenWindow = (url, windowFeatures = "width=800, height=600") => {
    if (openWindow && !openWindow.closed) {
      // Si la ventana ya está abierta, solo le damos el foco
      openWindow.focus();
      return openWindow;
    } else {
      // Si la ventana no está abierta, la abrimos y guardamos la referencia
      const newWindow = window.open(url, "_blank", windowFeatures);
      setOpenWindow(newWindow);

      // Escuchar el evento de cierre de la ventana
      newWindow.onbeforeunload = () => {
        setOpenWindow(null);
      };

      return newWindow;
    }
  };
  const columns = [
  {
    field: "operation",
    headerName: "opID",
    flex: 1, // Cambia width por flex
    minWidth: 100, // Mantén un ancho mínimo
    renderCell: (params) => {
      // Verificación de que los parámetros existan
      if (!params || !params.row || !params.row.operation) {
        return <InputTitles>N/A</InputTitles>;
      }
      
      const operation = params.row.operation;
      
      return (
        <CustomTooltip
          title={
            <Box sx={{ p: 1.5, color: "#fff", fontSize: "0.85rem", minWidth: 230 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                <Typography fontWeight="bold" fontSize="0.9rem">
                  OpID {operation.opId}
                </Typography>
                <CloseIcon
                  fontSize="small"
                  sx={{ cursor: "pointer", "&:hover": { color: "#ff5252" } }}
                />
              </Box>
              <Divider sx={{ my: 1, bgcolor: "#777" }} />
              <Typography>Emisor: {operation.emitter?.social_reason || 
                `${operation.emitter?.first_name || ""} ${operation.emitter?.last_name || ""}`.trim() || "N/A"}</Typography>
              <Typography>Pagador: {operation.payer?.social_reason || 
                `${operation.payer?.first_name || ""} ${operation.payer?.last_name || ""}`.trim() || "N/A"}</Typography>
              <Typography>Fecha Inicio: {operation.opDate || "N/A"}</Typography>
              <Typography>Fecha Fin: {operation.opExpiration || "N/A"}</Typography>
              <Typography>Valor Nominal: {operation.payedAmount || "N/A"}</Typography>
              <Typography>% Descuento: {operation.payedPercent || "N/A"}</Typography>
              <Box 
                sx={{ 
                  mt: 1, 
                  display: "flex", 
                  justifyContent: "flex-start", 
                  bgcolor: "#488b8f", 
                  color: "#ffffff", 
                  width: "fit-content",
                  p: 0.5,
                  borderRadius: 1,
                  cursor: "pointer"
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(`/operations?opId=${operation.opId}`, '_blank');
                }}
              >
                <ReadMoreIcon fontSize="small" />
              </Box>
            </Box>
          }
          arrow
          placement="bottom-start"
          TransitionComponent={Fade}
          PopperProps={{
            modifiers: [{ name: "offset", options: { offset: [0, 0] } }],
          }}
        >
          <InputTitles 
            sx={{ 
              cursor: 'pointer',
              
              color: "#5eaea3",
              '&:hover': {
                color: "#5eaea3"
              }
            }}
          >
            {operation.opId}
          </InputTitles>
        </CustomTooltip>
      );
    },
  },
     {
  field: "typeReceipt",
  headerName: "Estado / Tipo ",
    flex: 1.5, // flex: 1.5 le dará más espacio que las demás
    minWidth: 180,
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
},
    
    {
      field: "date",
      headerName: "Aplicado",
     flex: 1,
    minWidth: 100,
      renderCell: (params) => {
        return (
          <InputTitles>
            {params.value ? moment(params.value).format("DD/MM/YYYY") : ""}
          </InputTitles>
        );
      },
    },
       {
      field: "billId",
      headerName: "Factura",
      flex: 1,
    minWidth: 100,

      renderCell: (params) => {
        return (
          <CustomTooltip
            title={params.value}
            arrow
            placement="bottom-start"
            TransitionComponent={Fade}
            PopperProps={{
              modifiers: [
                {
                  name: "offset",
                  options: {
                    offset: [0, 0],
                  },
                },
              ],
            }}
          >
            <InputTitles>{params.value}</InputTitles>
          </CustomTooltip>
        );
      },
    },
   {
  field: "payedAmount",
  headerName: "Monto Aplicado",
    flex: 1.5,
    minWidth: 190,
  renderCell: (params) => {
    return (
      <Box 
        sx={{ 
          display: "flex", 
          alignItems: "center", 
          gap: 1,
          padding: "4px 8px",
          
        }}
      >
        <ReadMoreIcon 
          fontSize="medium" 
          sx={{ 
            color: "#488b8f",
            "&:hover": {
              color: "#2a6c70",
              transform: "scale(1.1)"
            },
            transition: "all 0.2s ease"
          }} 
          onClick={()=>(handleOpenReceiptDetail(params.row.id))}
        />

        <InputTitles sx={{ fontWeight: 600, color: "#2c3e50" }}>
          <ValueFormat prefix="$ " value={params.value} />
        </InputTitles>
      </Box>
    );
  },
},


     {
  field: "operation2",
  headerName: "Inversionista/Valor Presente",
  flex: 2, // Más flex para columnas más largas
    minWidth: 180,
  renderCell: (params) => {
   
    const Inversionista =  params.row?.operation2?.investor?.social_reason || 
                  `${params.row?.operation2?.investor?.first_name || ''} ${params.row?.operation2?.investor?.last_name || ''}`.trim()|| '';
    const ValorPresente = formatNumberWithThousandsSeparator(params.row?.operation2?.presentValueInvestor )|| '';

    return (
      <CustomTooltip
        title={`${Inversionista} / ${ValorPresente}`}
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
            {Inversionista}
          </Typography>
          <Typography
            fontSize="0.8rem"
            color="#333" // Gris oscuro
            lineHeight={1.2}
          >
            $ {ValorPresente}
          </Typography>
        </Box>
      </CustomTooltip>
    );
  },
},
    {
      field: "realDays",
      headerName: "Dias R.",
          flex: 0.8, // Menos flex para columnas pequeñas
    minWidth: 80,
      renderCell: (params) => {
        return (
          <CustomTooltip
            title={params.value}
            arrow
            placement="bottom-start"
            TransitionComponent={Fade}
            PopperProps={{
              modifiers: [
                {
                  name: "offset",
                  options: {
                    offset: [0, 0],
                  },
                },
              ],
            }}
          >
            <InputTitles>{params.value}</InputTitles>
          </CustomTooltip>
        );
      },
    },
    {
      field: "additionalDays",
      headerName: "Días +",
      flex: 0.8,
    minWidth: 80,
      renderCell: (params) => {
        return (
          <CustomTooltip
            title={params.value}
            arrow
            placement="bottom-start"
            TransitionComponent={Fade}
            PopperProps={{
              modifiers: [
                {
                  name: "offset",
                  options: {
                    offset: [0, 0],
                  },
                },
              ],
            }}
          >
            <InputTitles>{params.value}</InputTitles>
          </CustomTooltip>
        );
      },
    },
    
    {
      field: "additionalInterests",
      headerName: "Intereses +",
      flex: 1.2,
    minWidth: 150,
      renderCell: (params) => {
        return (
          <CustomTooltip
            title={<ValueFormat prefix="$ " value={params.value} />}
            arrow
            placement="bottom-start"
            TransitionComponent={Fade}
            PopperProps={{
              modifiers: [
                {
                  name: "offset",
                  options: {
                    offset: [0, 0],
                  },
                },
              ],
            }}
          >
            <InputTitles>
              <ValueFormat prefix="$ " value={params.value} />
            </InputTitles>
          </CustomTooltip>
        );
      },
    },
  
  ];









const receipt =
  data?.results?.map((receipt) => {
    return {
      id: receipt.id,
      dId: receipt.dId,
      date: receipt.date,
      typeReceipt: receipt.typeReceipt.description,
      statusReceipt: receipt.receiptStatus.description,
      operation: receipt.operation,
      operation2: receipt.operation,
      billId: receipt.operation.bill.billId,
      payedAmount: receipt.payedAmount,
      realDays: receipt.realDays,
      additionalDays: receipt.additionalDays,
      calculatedDays: receipt.calculatedDays,
      additionalInterests: receipt.additionalInterests,
      additionalInterestsSM: receipt.additionalInterestsSM,
      investorInterests: receipt.investorInterests,
      remaining: receipt.remaining,
      tableInterests: receipt.tableInterests,
      tableRemaining: receipt.tableRemaining,
      presentValueInvestor: receipt.presentValueInvestor,
   
    };
  }) || [];
  return (
    <>
       <Box sx={{ ...sectionTitleContainerSx }}>

<Box display="flex" alignItems="center">
<Link href="/dashboard" underline="none">
          <a>
          <HomeOutlinedIcon 
              fontSize="large" 
              sx={{ 
                color: '#488b8f',
                opacity: 0.8, // Ajusta la transparencia (0.8 = 80% visible)
                strokeWidth: 1, // Grosor del contorno
              }} 
            />
        
          </a>
          
          </Link>
       <Typography
          letterSpacing={0}
          fontSize="1.7rem"
          fontWeight="regular"
          marginBottom="0.7rem"
          marginTop='0.7rem'
          color="#5EA3A3"
        >
           - Consulta de recaudos
          </Typography>
</Box>
       
        <Box sx={{ ...sectionTitleContainerSx }}>
      
              </Box>
      </Box>

            <Box
  sx={{
    display: 'flex',
    flexWrap: 'wrap',
    gap: 2,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    mb: 2
  }}
>
<TextField
  variant="outlined"
  id="searchBar"
  size="small"
  placeholder="Buscar por OpID o factura"
  value={search}
  onChange={(evt) => handleTextFieldChange(evt, "investor")}
  onKeyPress={(event) => {
    if (event.key === "Enter") {
      const valueToSearch = search || ""; // Si está vacío, manda cadena vacía
      updateFilters(valueToSearch, "multi"); // realiza la búsqueda, incluso si el valor está vacío
    }
  }}
  sx={{
    flexGrow: 1,
    minWidth: '250px',
    maxWidth: '580px',
    '& .MuiOutlinedInput-root': {
      height: 35,
      fontSize: '14px',
      paddingRight: 0,
    },
    '& .MuiInputBase-input': {
      padding: '6px 8px',
    },
  }}
  InputProps={{
    endAdornment: search && (
      <InputAdornment position="end">
        <IconButton 
          onClick={handleClearSearch}
          size="small"
          edge="end"
        >
          <ClearIcon sx={{ color: "#488b8f", fontSize: '18px' }} />
        </IconButton>
      </InputAdornment>
    ),
  }}
/>


{/* Filtro por estado */}

  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
  
      <Button
      className="button-header-preop-title"
    variant="outlined"
    onClick={handleClickStatus}
    sx={{
      justifyContent: 'space-between',
      minWidth: 200,
      textTransform: 'none',
      color: selectedStatus ? 'text.primary' : 'text.secondary',
      borderColor: selectedStatus ? 'primary.main' : 'grey.400',
      '&:hover': {
        borderColor: selectedStatus ? 'primary.dark' : 'grey.600'
      }
    }}
  >
    {selectedStatus ? selectedStatus.description : 'Seleccionar estado'}
    <KeyboardArrowDownIcon sx={{ ml: 1, fontSize: 18 }} />
  </Button>
  
  {selectedStatus && (
    <IconButton 
      onClick={handleClearStatus}
      size="small"
      sx={{ 
        color: 'grey.500',
        '&:hover': {
          color: 'error.main',
          backgroundColor: 'error.light'
        }
      }}
    >
      <ClearIcon fontSize="small" />
    </IconButton>
  )}
  
  <Menu
    anchorEl={anchorElStatus}
    open={openStatus}
    onClose={handleCloseStatus}
    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
    transformOrigin={{ vertical: 'top', horizontal: 'left' }}
  >
    {dataReceipt?.data?.map((status) => (
      <MenuItem
        key={status.id}
        onClick={() => handleSelectStatus(status)}
        selected={selectedStatus?.id === status.id}
        sx={{
          '&.Mui-selected': {
            backgroundColor: '#488B8F10',
            '&:hover': {
              backgroundColor: '#488B8F15'
            }
          },
          px: 2,
          py: 1,
          minWidth: 200,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <span>{status.description}</span>
        {selectedStatus?.id === status.id && (
          <CheckIcon fontSize="small" sx={{ color: '#488B8F', ml: 1 }} />
        )}
      </MenuItem>
    ))}
  </Menu>

{/* fin Filtro por estado */}

    <AdvancedDateRangePicker
      
      className="date-picker"
      onApply={handleDateRangeApply}
      onClean={handleClear}
      
    />

 

    <IconButton onClick={handleMenuClickCSV} className="context-menu">
      <MoreVertIcon />
    </IconButton>
    <Menu anchorEl={anchorElCSV} open={openMenuCSV} onClose={handleCloseMenuCSV}>
      <MenuItem onClick={handleExportExcel}>Exportar a CSV</MenuItem>
    </Menu>
  </Box>
</Box>
<Box
  container
  marginTop={4}
  display="flex"
  flexDirection="column"
  width="100%"
  height="100%"
>
  <CustomDataGrid
    rows={receipt}
    columns={columns}
    pageSize={15}
    rowsPerPageOptions={[5]}
    disableSelectionOnClick
    disableColumnMenu
    sx={{
      width: '100%',
      // ESTILOS NUEVOS PARA ELIMINAR ESPACIO SOBRANTE
      '& .MuiDataGrid-virtualScroller': {
        minHeight: receipt.length === 0 ? '200px' : 'auto',
        overflowX: 'hidden', // Oculta el scroll horizontal innecesario
      },
      '& .MuiDataGrid-main': {
        width: '100%',
        overflow: 'hidden', // Cambia de 'auto' a 'hidden'
      },
      '& .MuiDataGrid-columnHeaders': {
        backgroundColor: '#e2e0e0ff',
        color: '#000000',
        minWidth: '100% !important', // Fuerza el ancho completo
        width: '100% !important',
      },
      '& .MuiDataGrid-row': {
        minWidth: '100% !important',
        width: '100% !important',
      },
      '& .MuiDataGrid-viewport': {
        minWidth: '100% !important',
        width: '100% !important',
      },
      // ELIMINA EL ESPACIO SOBRANTE DE LA ÚLTIMA COLUMNA
      '& .MuiDataGrid-filler': {
        display: 'none !important',
      },
      '& .MuiDataGrid-scrollbar': {
        display: 'none !important',
      },
      '& .MuiDataGrid-columnHeader:last-child': {
        borderRight: 'none',
      },
      '& .MuiDataGrid-cell:last-of-type': {
        borderRight: 'none',
      },
      // ESTILOS EXISTENTES
      '& .MuiDataGrid-columnHeaderTitle': {
        fontWeight: '600',
        fontSize: '0.85rem',
        color: '#000000',
      },
      '& .MuiDataGrid-iconButtonContainer': {
        visibility: 'visible !important',
      },
      '& .MuiDataGrid-menuIcon': {
        visibility: 'visible !important',
      },
      '& .MuiDataGrid-sortIcon': {
        color: '#5EA3A3',
        opacity: 1,
        fontSize: '1rem',
      },
      '& .MuiDataGrid-columnHeader:hover .MuiDataGrid-sortIcon': {
        color: '#5EA3A3',
        opacity: 1,
      },
      '& .MuiDataGrid-columnHeaderSorted .MuiDataGrid-sortIcon': {
        color: '#5EA3A3',
        opacity: 1,
      },
    }}
    components={{
      ColumnSortedAscendingIcon: () => (
        <Typography fontFamily="icomoon" fontSize="0.7rem">
          &#xe908;
        </Typography>
      ),
      ColumnSortedDescendingIcon: () => (
        <Typography fontFamily="icomoon" fontSize="0.7rem">
          &#xe908;
        </Typography>
      ),
      NoRowsOverlay: () => (
        <Typography
          fontSize="0.9rem"
          fontWeight="600"
          color="#488B8F"
          height="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          No hay recaudos registrados
        </Typography>
      ),
      Pagination: () => (
        <Box
          container
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography fontSize="0.8rem" fontWeight="600" color="#5EA3A3">
            {page * 15 - 14} - {page * 15} de {dataCount}{" "}
          </Typography>
          <Box
            container
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <Typography
              fontFamily="icomoon"
              fontSize="1.2rem"
              marginRight="0.3rem"
              marginLeft="0.5rem"
              sx={{
                cursor: "pointer",
                transform: "rotate(180deg)",
                color: "#63595C",
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
              marginRight="0.3rem"
              marginLeft="0.5rem"
              sx={{
                cursor: "pointer",
                color: "#63595C",
              }}
              onClick={() => {
                if (page < dataCount / 15) {
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
    loading={loading}
  />
</Box>
    </>
  );
};
