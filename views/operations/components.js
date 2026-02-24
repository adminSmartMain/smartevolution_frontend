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
import { Breadcrumbs} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Skeleton from '@mui/material/Skeleton';
const TableSkeleton = ({ rows = 15, columns = 9 }) => {
  return (
    <Box
      sx={{
        border: '1px solid #e0e0e0',
        borderRadius: '4px',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          backgroundColor: '#f5f5f5',
          borderBottom: '2px solid #e0e0e0',
          px: 2,
          py: 1,
        }}
      >
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton
            key={i}
            variant="text"
            height={40}
            sx={{ mx: 1 }}
          />
        ))}
      </Box>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <Box
          key={rowIndex}
          sx={{
            display: 'grid',
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            px: 2,
            py: 1,
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              variant="rectangular"
              height={55}
              sx={{
                mx: 1,
                borderRadius: '4px',
              }}
            />
          ))}
        </Box>
      ))}
    </Box>
  );
};

const buttonCompactSx = {
  height: { xs: 34, sm: 40 },
  padding: { xs: "6px 10px", sm: "10px 16px" },
  fontSize: { xs: "0.78rem", sm: "0.9rem" },
  minWidth: { xs: 120, sm: 140 },
  whiteSpace: "nowrap",
};

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


const btnCompactSx = {
  height: 36,
  px: 2,
  fontSize: "0.85rem",
  whiteSpace: "nowrap",
  minWidth: { xs: "100%", sm: "auto" },
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0, // ✅ clave: evita que el texto se parta
};

  return (
    <>
<Box
  sx={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 2,
    width: "100%",
    mb: 2,
    flexWrap: { xs: "wrap", sm: "nowrap" },
  }}
>
  {/* ✅ IZQUIERDA */}
  <Box className="view-header" sx={{ flexGrow: 1, minWidth: 260 }}>
    <Typography
      letterSpacing={0}
      fontSize="1.7rem"
      fontWeight="regular"
      marginBottom="0.7rem"
      color="#5EA3A3"
    >
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
        sx={{ ml: 1, mt: 0 }}
      >
        <Link href="/dashboard" underline="none">
          <a>
            <HomeIcon
              fontSize="large"
              sx={{
                color: "#488b8f",
                opacity: 0.8,
                strokeWidth: 1,
              }}
            />
          </a>
        </Link>

        <Link
          underline="hover"
          color="#5EA3A3"
          href="/administration"
          sx={{ fontSize: "1.3rem" }}
        >
          <Typography component="h1" className="view-title">
            Operaciones Aprobadas
          </Typography>
        </Link>
      </Breadcrumbs>
    </Typography>
  </Box>

  {/* ✅ DERECHA */}
  <Box
    sx={{
      width: { xs: "100%", sm: "auto" },
      display: "flex",
      justifyContent: { xs: "stretch", sm: "flex-end" },
    }}
  >
    <Link href="/pre-operations" passHref>
      <button
        className="button-header-preop-title"
        style={{
          width: "100%",
          boxSizing: "border-box",
          whiteSpace: "nowrap",
        }}
      >
        Pre-Operaciones
      </button>
    </Link>
  </Box>
</Box>

<Box
  sx={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 2,
    width: "100%",
    mb: 2,

    // ✅ desktop igual que siempre
    flexDirection: { xs: "column", sm: "row" },
  }}
>
  {/* 🔎 BUSCADOR */}
  <TextField
    variant="outlined"
    id="searchBar"
    size="small"
    placeholder="Buscar por Emisor o Inversionista..."
    value={search}
    onChange={(evt) => handleTextFieldChange(evt, "investor")}
    onKeyPress={(event) => {
      if (event.key === "Enter") {
        updateFilters(search || "", "multi");
      }
    }}
    sx={{
      width: { xs: "100%", sm: "20rem" }, // ✅ desktop igual
      flexGrow: 1,
      maxWidth: "580px",
      "& .MuiOutlinedInput-root": {
        height: 35,
        fontSize: "14px",
        paddingRight: 0,
      },
      "& .MuiInputBase-input": {
        padding: "6px 8px",
      },
    }}
    InputProps={{
      endAdornment: search && (
        <InputAdornment position="end">
          <IconButton onClick={handleClearSearch} size="small" edge="end">
            <ClearIcon sx={{ color: "#488b8f", fontSize: "18px" }} />
          </IconButton>
        </InputAdornment>
      ),
    }}
  />

  {/* ✅ BOTONES (solo móvil grid, desktop flex normal) */}
  <Box
    sx={{
      width: { xs: "100%", sm: "auto" },

      // ✅ SOLO móvil se vuelve grid (como la foto)
      display: { xs: "grid", sm: "flex" },

      // ✅ móvil exacto: 2 columnas para 1ra fila
      gridTemplateColumns: { xs: "1fr 1fr", sm: "none" },

      gap: 1,
      alignItems: "center",
      justifyContent: { sm: "flex-end" }, // ✅ desktop igual
      flexWrap: { sm: "nowrap" },         // ✅ desktop igual

      // ✅ clave para que NO se rompa en móvil
      minWidth: 0,
    }}
  >
    {/* ✅ Estado */}
    <button
      onClick={handleClickStatus}
      className="button-header-preop-title"
      style={{
        width: "100%",
        boxSizing: "border-box",
        whiteSpace: "nowrap",
        height: 36,
        position: "relative",
        paddingRight: selectedStatus ? "32px" : "8px",
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
            position: "absolute",
            right: "4px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#fff",
            "&:hover": { backgroundColor: "#ffffff20" },
            width: 20,
            height: 20,
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
        >
          {option.label}
        </MenuItem>
      ))}
    </Menu>

    {/* ✅ Ver por grupos */}
    <Link href="/operations/byOp" underline="none">
      <button
        className="button-header-preop-title"
        style={{
          width: "100%",
          boxSizing: "border-box",
          whiteSpace: "nowrap",
          height: 36,
        }}
      >
        Ver por Grupos
      </button>
    </Link>

    {/* ✅ Valor a Girar (FULL WIDTH en móvil) */}
    <Box sx={{ gridColumn: { xs: "span 2", sm: "auto" }, width: "100%" }}>
      <button
        className="button-header-preop-title"
        onClick={handleOpenModal}
        style={{
          width: "100%",
          boxSizing: "border-box",
          whiteSpace: "nowrap",
          height: 36,
        }}
      >
        Valor a Girar
      </button>
      <ModalValorAGirar open={openModal} handleClose={handleCloseModal} data={calcs} />
    </Box>

    {/* ✅ DatePicker (FULL WIDTH en móvil) */}
    <Box sx={{ gridColumn: { xs: "span 2", sm: "auto" }, width: "100%" }}>
      <AdvancedDateRangePicker
        className="date-picker"
        onApply={handleDateRangeApply}
        onClean={handleClear}
      />
    </Box>

    {/* ✅ Menú CSV abajo derecha */}
    <Box
      sx={{
        gridColumn: { xs: "span 2", sm: "auto" },
        display: "flex",
        justifyContent: { xs: "flex-end", sm: "flex-start" },
        width: "100%",
      }}
    >
      <IconButton onClick={handleMenuClickCSV} className="context-menu">
        <MoreVertIcon />
      </IconButton>

      <Menu anchorEl={anchorElCSV} open={openMenuCSV} onClose={handleCloseMenuCSV}>
        <MenuItem onClick={handleExportExcel}>Exportar a CSV</MenuItem>
      </Menu>
    </Box>
  </Box>
</Box>


       
      
        {loading ? (
  <TableSkeleton rows={8} columns={columns.length} />
) : (
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
      )}
    </>
    
  );
};
