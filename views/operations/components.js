import {useEffect, useState } from "react";
import { useRouter } from 'next/router';
import Link from "next/link";
import CircularProgress from '@mui/material/CircularProgress';
import { SearchOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  Fade,
  Grid,
  IconButton,
  TextField,
  Typography,
  InputAdornment ,
   Select,
   Menu, MenuItem,
} from "@mui/material";
import ListItemText from '@mui/material/ListItemText'; // Importación añadida
import { styled } from "@mui/material/styles";
import {
  Home as HomeIcon,

} from "@mui/icons-material";
import ValueFormat from "@formats/ValueFormat";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import responsiveFontSize from "@lib/responsiveFontSize";

import BackButton from "@styles/buttons/BackButton";
import MuiButton from "@styles/buttons/button";
import RedButtonModal from "@styles/buttons/noButtonModal";
import GreenButtonModal from "@styles/buttons/yesButtonModal";
import CustomTooltip from "@styles/customTooltip";
import MuiTextField from "@styles/fields";
import { StandardTextField } from "@styles/fields/BaseField";
import InputTitles from "@styles/inputTitles";
import ClearIcon from "@mui/icons-material/Clear";
import ModalValorAGirar from "../../shared/components/ModalValorAGirar";
import AdvancedDateRangePicker from "../../shared/components/AdvancedDateRangePicker";
import scrollSx from "@styles/scroll";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check"
import CustomDataGrid from "@styles/tables";
import DocumentIcon from '@mui/icons-material/Description';
import { Tooltip } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import moment from "moment";
import { getOperationsVersionTwo,getOperationsVersionTwo2 } from "./queries";

const sectionTitleContainerSx = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "rigth",
};


const tableWrapperSx = {
  marginTop: 2,
  display: "flex",
  flexDirection: "column",
  width: "100%",
  height: "100%",
};



const SortIcon = () => (
  <Typography fontFamily="icomoon" fontSize="0.7rem">
    &#xe908;
  </Typography>
);




export const OperationsComponents = ({
  rows,
  filtersHandlers,
  getOperationsFetch,
  page,
  setPage,
  dataCount,
  calcs,
  loading
}) => {
  const [other, setOther] = useState(calcs?.others || 0);
  const [tempFilters, setTempFilters] = useState({ ...filtersHandlers.value });
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [anchorElCSV, setAnchorElCSV] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenuCSV = Boolean(anchorElCSV);
    const [openWindow, setOpenWindow] = useState(null); 


  const [anchorElStatus, setAnchorElStatus] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
const router = useRouter();

const opIdQuery=router.query.opId



  // Opciones estáticas de estados
  const statusOptions = [
  
    { value: 1, label: "Vigente", badgeClass: "badge aprobado" },
 
 
    { value: 4, label: "Cancelada", badgeClass: "badge cancelada" },
     { value: 5, label: "Vencida", badgeClass: "badge vencido" }
  ];



  const handleClickStatus = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseStatus = () => {
    setAnchorEl(null);
  };

    const handleSelectStatus = (status) => {
    setSelectedStatus(status);
   
    handleCloseStatus();
    // Actualiza los filtros globales
    
  filtersHandlers.set({
    ...filtersHandlers.value,
    status: status?.value ?? "", // Usa option.value o cadena vacía
    page: 1 // Resetear a primera página
  });
  };

  const handleClearStatus = () => {
    setSelectedStatus(null);

     filtersHandlers.set({
    ...filtersHandlers.value,
    status: "",
    page: 1
  });
  };


  const formatOptions = {
    style: "currency",
    currency: "USD",
  };
  const numberFormat = new Intl.NumberFormat("en-US", formatOptions);
  
  const [selectedData, setSelectedData] = useState(calcs);


const handleClearSearch = () => {
  const newFilters = {
    ...filtersHandlers.value,  // Mantiene todos los filtros actuales
    opId: "",                  // Limpia solo estos campos
    billId: "",
    investor: ""
  };
  
  filtersHandlers.set(newFilters);  // Actualiza el estado conservando las fechas
  setSearch("");                    // Limpia el estado local de búsqueda si existe
  
  // Limpiar el parámetro opId de la URL si existe
  if (window.location.search.includes('opId=')) {
    const url = new URL(window.location);
    url.searchParams.delete('opId');
    window.history.replaceState(null, '', url.toString());
  }
};
  const handleOpenModal = () => {

    setOpenModal(true);
  };
  const handleMenuClickCSV = (event) => {
    setAnchorElCSV(event.currentTarget);
  };
  const handleCloseMenuCSV = () => {
    setAnchorElCSV(null);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
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


// Funciones específicas que usan la función genérica
const handleOpenRegisterReceipt = (id) => {
  handleOpenWindow(`/administration/new-receipt?id=${id}`);
};



const columns = [
  {
    field: "status",
    headerName: "Estado",
    width: 100,
    renderCell: (params) => {
      let statusText = "";
      let badgeClass = "";
      
      switch (params.value) {
        case 0:
          statusText = "Por Aprobar";
          badgeClass = "badge por-aprobar";
          break;
        case 1:
          statusText = "Vigente";
          badgeClass = "badge aprobado";
          break;
        case 2:
          statusText = "Rechazada";
          badgeClass = "badge rechazado";
          break;
        case 3:
          statusText = "Vigente";
          badgeClass = "badge vigente";
          break;
        case 4:
          statusText = "Cancelada";
          badgeClass = "badge cancelada";
          break;
        case 5:
          statusText = "Vencida";
          badgeClass = "badge vencido";
          break;
        default:
          statusText = "Por Aprobar";
          badgeClass = "badge por-aprobar";
      }
      
      return (
        <Tooltip title={statusText} arrow placement="top">
          <span className={badgeClass}>{statusText}</span>
        </Tooltip>
      );
    },
  },
  
  { 
    field: "opId", 
    headerName: "ID", 
    width: 56,
    renderCell: (params) => (
      <Tooltip title={params.value || ''} arrow placement="top">
        <span>{params.value}</span>
      </Tooltip>
    )
  },
  
  { 
    field: "opDate", 
    headerName: "Fecha Op", 
    width: 93,
    valueFormatter: (params) => {
      if (!params.value) return '';
      const [year, month, day] = params.value.split('T')[0].split('-');
      return `${day}/${month}/${year}`;
    },
    renderCell: (params) => (
      <Tooltip title={params.formattedValue || ''} arrow placement="top">
        <span>{params.formattedValue}</span>
      </Tooltip>
    )
  },
  
  { 
    field: "billFraction", 
    headerName: "Fracción", 
    width: 60,
    renderCell: (params) => (
      <Tooltip title={params.value || ''} arrow placement="top">
        <span>{params.value}</span>
      </Tooltip>
    )
  },
  
  { 
    field: "billData", 
    headerName: "# Factura", 
    width: 100,
    renderCell: (params) => (
      <Tooltip title={params.value || ''} arrow placement="top">
        <span>{params.value}</span>
      </Tooltip>
    )
  },
  
  { 
    field: "emitterName", 
    headerName: "Emisor", 
    width: 230,
    renderCell: (params) => (
      <Tooltip title={params.value || ''} arrow placement="top">
        <span style={{ 
          whiteSpace: 'nowrap', 
          overflow: 'hidden', 
          textOverflow: 'ellipsis',
          width: '100%'
        }}>
          {params.value}
        </span>
      </Tooltip>
    )
  },
  
  { 
    field: "investorName", 
    headerName: "Inversionista", 
    width: 200,
    renderCell: (params) => (
      <Tooltip title={params.value || ''} arrow placement="top">
        <span style={{ 
          whiteSpace: 'nowrap', 
          overflow: 'hidden', 
          textOverflow: 'ellipsis',
          width: '100%'
        }}>
          {params.value}
        </span>
      </Tooltip>
    )
  },
  
  { 
    field: "payerName", 
    headerName: "Pagador", 
    width: 150,
    renderCell: (params) => (
      <Tooltip title={params.value || ''} arrow placement="top">
        <span style={{ 
          whiteSpace: 'nowrap', 
          overflow: 'hidden', 
          textOverflow: 'ellipsis',
          width: '100%'
        }}>
          {params.value}
        </span>
      </Tooltip>
    )
  },
  
  { 
    field: "discountTax", 
    headerName: "Tasa Desc.", 
    width: 60,
    renderCell: (params) => (
      <Tooltip title={params.value || ''} arrow placement="top">
        <span>{params.value}</span>
      </Tooltip>
    )
  },
  
  { 
    field: "payedPercent", 
    headerName: "% Desc.", 
    width: 40,
    renderCell: (params) => (
      <Tooltip title={params.value ? `${params.value}%` : ''} arrow placement="top">
        <span>{params.value}</span>
      </Tooltip>
    )
  },
  
  { 
    field: "investorTax", 
    headerName: "Tasa Inv.", 
    width: 40,
    renderCell: (params) => (
      <Tooltip title={params.value || ''} arrow placement="top">
        <span>{params.value}</span>
      </Tooltip>
    )
  },
  
  { 
    field: "payedAmount", 
    headerName: "Valor Nominal", 
    width: 110,
    valueFormatter: ({ value }) => {
      if (value == null) return "$0.00";
      return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
      }).format(value);
    },
    renderCell: (params) => (
      <Tooltip title={params.formattedValue || ''} arrow placement="top">
        <span>{params.formattedValue}</span>
      </Tooltip>
    )
  },
  
  { 
    field: "presentValueInvestor", 
    headerName: "Valor Inversionista", 
    width: 110,
    valueFormatter: ({ value }) => {
      if (value == null) return "$0.00";
      return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
      }).format(value);
    },
    renderCell: (params) => (
      <Tooltip title={params.formattedValue || ''} arrow placement="top">
        <span>{params.formattedValue}</span>
      </Tooltip>
    )
  },
  
  { 
    field: "probableDate", 
    headerName: "Fecha Probable", 
    width: 93,
    valueFormatter: (params) => {
      if (!params.value) return '';
      const [year, month, day] = params.value.split('T')[0].split('-');
      return `${day}/${month}/${year}`;
    },
    renderCell: (params) => (
      <Tooltip title={params.formattedValue || ''} arrow placement="top">
        <span>{params.formattedValue}</span>
      </Tooltip>
    )
  },
  
  { 
    field: "opExpiration", 
    headerName: "Fecha Fin", 
    width: 93,
    valueFormatter: (params) => {
      if (!params.value) return '';
      const [year, month, day] = params.value.split('T')[0].split('-');
      return `${day}/${month}/${year}`;
    },
    renderCell: (params) => (
      <Tooltip title={params.formattedValue || ''} arrow placement="top">
        <span>{params.formattedValue}</span>
      </Tooltip>
    )
  },
   {
  field: "Acciones",
  headerName: "Acciones",
  width: 100,
  sortable: false,
  filterable: false,
  renderCell: (params) => {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        gap: "8px",
        width: "100%"
      }}>
        {/* Versión alternativa usando useRouter */}
<Tooltip 
  title={params.row.status === 4 ? "Acción no disponible" : "Registrar recaudo"} 
  arrow
  placement="top"
>
  <Typography
    fontFamily="icomoon"
    fontSize="1.9rem"
    color={params.row.status === 4 ? "#CCCCCC" : "#488B8F"}
    sx={{
      cursor: params.row.status === 4 ? "not-allowed" : "pointer",
      "&:hover": {
        backgroundColor: params.row.status === 4 ? "transparent" : "#B5D1C980",
        borderRadius: "5px"
      },
      padding: "0 4px"
    }}
    onClick={() => {
      if (params.row.status !== 4) {
       handleOpenRegisterReceipt(params.row.id);
      }
    }}
  >
    &#xe904;
  </Typography>
</Tooltip>

        {/* Botón Detalles Operación */}
        <Link 
          href={`/pre-operations/detailPreOp?id=${params.row.id}`}
          passHref
          legacyBehavior
        >
          <Tooltip 
            title="Detalles operación" 
            arrow
            placement="top"
          >
            <Typography
              fontFamily="icomoon"
              fontSize="1.9rem"
              color="#999999"
              sx={{
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "#B5D1C980",
                  color: "#488B8F",
                  borderRadius: "5px"
                },
                padding: "0 4px"
              }}
            >
              &#xe922;
            </Typography>
          </Tooltip>
        </Link>
      </div>
    );
  }
},
  ];





  useEffect(()=>{
    if(opIdQuery){

      setSearch(opIdQuery)
    }

  },[opIdQuery])
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

    const [filterApplied, setFilterApplied] = useState(false);
  const updateFilters = (value, field) => {
  if (field !== "multi") {
    const newFilters = { 
      ...tempFilters, 
      [field]: value
    };
    
    setTempFilters(newFilters);
    filtersHandlers.set({
      ...newFilters,
      page: 1
    });

    if (tempFilters[field] !== value) {
      setFilterApplied(true);
    }
    return;
  }

  const onlyDigits = /^\d{3,4}$/;
  const alphaNumeric = /^[a-zA-Z0-9]{3,10}$/;
  const hasLetters = /[a-zA-Z]/.test(value);
  const hasSpaces = /\s/.test(value);

  // SOLUCIÓN: Usar filtersHandlers.value en lugar de tempFilters
  const newFilters = { 
    ...filtersHandlers.value, // ← Usar el valor ACTUAL de los filtros
    opId: "", 
    billId: "", 
    investor: "",
    page: 1
  };

  if (onlyDigits.test(value)) {
    newFilters.opId = value;
  } else if (alphaNumeric.test(value) && !hasLetters && value.length >= 3 && value.length <= 10) {
    newFilters.billId = value;
  } else if (hasLetters || hasSpaces || value.length > 4) {
    newFilters.investor = value;
  } else {
    newFilters.investor = value;
  }

  // Actualizar ambos estados
  setTempFilters(newFilters);
  filtersHandlers.set(newFilters);

  setFilterApplied(true);
  setPage(1);
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

  return (
    <>
     
      <Box sx={{ ...sectionTitleContainerSx }}>
        <Box  className="view-header">

            <Link href="/dashboard" underline="none">
                    <a>
                    <HomeIcon
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
                    className="view-title"
                  >
                    - Operaciones Aprobadas
                  </Typography>
        </Box>
                

                  <Box sx={{ ...sectionTitleContainerSx }}>
                        <Link href="/pre-operations" passHref>
                        <button className="button-header-preop-title">
                          Pre-Operaciones
                        </button>
                      </Link>
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
  placeholder="Buscar por Emisor o Inversionista..."
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

  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>

<button
        onClick={handleClickStatus}
        className="button-header-preop-title"
        style={{ 
            display: 'flex', 
    alignItems: 'center', 
    gap: '4px',
    position: 'relative',
          paddingRight: selectedStatus ? '32px' : '8px',
       
        }}
      >
        {selectedStatus?.label || "Por Estado"}
        
        {selectedStatus ? (
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleClearStatus();
            }}
            sx={{
              position: 'absolute',
              right: '4px',
              color: "#ffff",
              '&:hover': {
                backgroundColor: "#ffffff20"
              },
              width: 20,
              height: 20
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        ) : (
          <ArrowDropDownIcon sx={{ fontSize: "16px", color: "#488B8F" }} />
        )}
      </button>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseStatus}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
  transformOrigin={{ vertical: "top", horizontal: "left" }}
  
>
        {statusOptions.map((option) => (
          <MenuItem
            key={option.value}
            onClick={() => handleSelectStatus(option)}
            selected={selectedStatus?.value === option.value}
             disableGutters
      sx={{
        '&.Mui-selected': {
          backgroundColor: "#488B8F10",
          '&:hover': {
            backgroundColor: "#488B8F15"
          }
        },
        px: 0.5,          // reduce padding horizontal
        py: 0.25,         // reduce padding vertical
        minHeight: "auto", // quita alto mínimo de MUI
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "4px"
      }}
          >
             <span
        className={option.badgeClass}
        style={{
          display: "inline-block",
          padding: "4px 10px",
          borderRadius: "6px",
          fontSize: "0.85rem",
          fontWeight: 600,
          minWidth: "100px", // todos iguales de ancho
          textAlign: "center",
          lineHeight: 1.2
        }}
      >
              {option.label}
            </span>
        
            {selectedStatus?.value === option.value && (
              <CheckIcon fontSize="small" sx={{ ml: 1, color: "#488B8F" }} />
            )}
          </MenuItem>
        ))}
      </Menu>

  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
    <Link href="/operations/byOp" underline="none">
      <button className="button-header-preop-title">Ver por Grupos</button>
    </Link>

 


    <button className="button-header-preop" onClick={handleOpenModal}>Valor a Girar</button>
    <ModalValorAGirar open={openModal} handleClose={handleCloseModal} data={calcs} />

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
</Box>
       
      
  {loading && (
    <Box
      sx={{
        position: 'absolute',
        top: '60%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1,
        
       
      }}
    >
      <CircularProgress sx={{ color: '#488B8F' }} />
      <Typography variant="body2" color="#488B8F">
        Cargando operaciones...
      </Typography>
    </Box>
  )}
      <Box sx={{ ...tableWrapperSx }}>
        <CustomDataGrid
          rows={rows}
          columns={columns}
          pageSize={15}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          disableColumnMenu
          sx={{
            border: '1px solid #e0e0e0', // Borde exterior
            '& .MuiDataGrid-cell': {
              borderRight: '1px solid #f0f0f0', // Bordes verticales entre celdas
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f5f5f5', // Fondo del encabezado
              borderBottom: '2px solid #e0e0e0', // Borde inferior del encabezado
            },
            '& .MuiDataGrid-columnHeader': {
              borderRight: '1px solid #e0e0e0', // Bordes entre columnas
            },
            '& .MuiDataGrid-row': {
              '&:nth-of-type(even)': {
                backgroundColor: '#fafafa', // Color filas pares
              },
              '&:hover': {
                backgroundColor: '#f0f0f0', // Color al pasar el mouse
              },
            },
            '& .MuiDataGrid-footerContainer': {
              borderTop: '1px solid #e0e0e0', // Borde superior del footer
            },
            '& .MuiDataGrid-virtualScroller': {
              overflowX: 'auto', // Oculta el scroll horizontal si no es necesario
            },
          filter: loading ? 'blur(2px)' : 'none', // Efecto de desenfoque
          transition: 'filter 0.3s ease-out' // Transición suave
            
          }}
          components={{
            ColumnSortedAscendingIcon: SortIcon,
            ColumnSortedDescendingIcon: SortIcon,
            NoRowsOverlay: () => (
              <Typography
                fontSize="0.9rem"
                fontWeight="600"
                color="#488B8F"
                height="100%"
                display="flex"
                alignItems="center"
                justifyContent="center"
                sx={{
                  border: '1px dashed #e0e0e0', // Borde para el área vacía
                  margin: '0 16px 16px 16px',
                  borderRadius: '4px',
                  
                }}
              >
                No hay operaciones registradas
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
        />
      </Box>
    </>
  );
};
