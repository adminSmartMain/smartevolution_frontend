import {useEffect, useState } from "react";

import Link from "next/link";

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
import { styled } from "@mui/material/styles";

import ValueFormat from "@formats/ValueFormat";

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
import ModalValorAGirar from "./ModalValorAGirar";
import AdvancedDateRangePicker from "./AdvancedDateRangePicker";
import scrollSx from "@styles/scroll";

import CustomDataGrid from "@styles/tables";
import DocumentIcon from '@mui/icons-material/Description';
import { Tooltip } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import moment from "moment";

const sectionTitleContainerSx = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const filtersContainerSx = {
  display: "flex",
  gap: 1,
};

const entriesGrid = {
  backgroundColor: "#488B8F",
  borderRadius: "4px",

  mt: 1,

  pb: 1.5,
  pr: 1.5,
};

const entryContainerSx = {
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",

  position: "relative",
};

const titleSx = {
  letterSpacing: 0,
  fontSize: 10,
  fontWeight: "bold",
  color: "#488B8F",
  textTransform: "uppercase",
  textAlign: "right",

  position: "absolute",
  left: 8,
  top: 3,
};

const valueSx = {
  letterSpacing: 0,
  color: "#488B8F",
  fontSize: 14,
  fontWeight: 600,
  textAlign: "right",

  border: "1px solid #C7C7C780",
  borderRadius: "4px",

  backgroundColor: "#ebfaf6",
  width: "100%",
  padding: "0.35rem",
  pt: "0.7rem",
  pb: "0.1rem",
};

const tableWrapperSx = {
  marginTop: 2,
  display: "flex",
  flexDirection: "column",
  width: "100%",
  height: "100%",
};

const TextFieldSearch = (props) => {
  const { ...rest } = props;

  return (
    <MuiTextField
      type="text"
      variant="standard"
      margin="normal"
      InputProps={{
        disableUnderline: true,
        sx: {
          marginTop: "-5px",
        },
        endAdornment: <SearchOutlined sx={{ color: "#5EA3A3" }} />,
      }}
      sx={{ m: 0, my: 1 }}
      {...rest}
    />
  );
};

const Entry = (props) => {
  const { title, children, sx, ...rest } = props;

  return (
    <Box sx={{ ...entryContainerSx, ...sx }}>
      <Typography sx={{ ...titleSx }}>{title}</Typography>
      <Typography sx={{ ...valueSx }}>{children}</Typography>
    </Box>
  );
};

const SortIcon = () => (
  <Typography fontFamily="icomoon" fontSize="0.7rem">
    &#xe908;
  </Typography>
);

const EntryField = styled(StandardTextField)(({ theme }) => ({
  "& label": {
    color: "#488B8F",
    fontWeight: 600,
    top: 10,
    left: -5,
  },

  "& .Mui-focused": {
    color: "#488B8F",
    fontWeight: 600,
  },

  "& fieldset": {
    display: "none",
  },

  "& .MuiInputBase-root": {
    height: 35.78,
    backgroundColor: "#ebfaf6",
  },

  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#5EA3A380 !important",
  },

  "& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline": {
    borderColor: "#d32f2f !important",
  },

  "& .MuiOutlinedInput-input": {
    textAlign: "right",
    color: "#488B8F",
    fontWeight: 600,
    fontSize: 14,
  },

  "& .MuiInputAdornment-root": {
    color: "#5EA3A3",
  },
}));

const EditableEntry = (props) => {
  const { title, value, onChangeMasked, ...rest } = props;

  return (
    <EntryField
      notched={true}
      label={title}
      InputLabelProps={{ shrink: true }}
      isMasked
      thousandSeparator="."
      decimalSeparator=","
      decimalScale={2}
      allowNegative={false}
      value={value}
      onChangeMasked={onChangeMasked}
    />
  );
};

const NotificationsButton = (props) => {
  const { ...rest } = props;

  return (
    <Link href="/operations/notifications" underline="none">
      <Button
        variant="standard"
        color="primary"
        size="large"
        sx={{
          height: "2.6rem",
          backgroundColor: "transparent",
          border: "1.4px solid #63595C",
          borderRadius: "4px",
          ml: 1,
        }}
      >
        <Typography
          letterSpacing={0}
          fontSize="80%"
          fontWeight="bold"
          color="#63595C"
        >
          Estado de firma
        </Typography>

        <Typography
          fontFamily="icomoon"
          fontSize="1.5rem"
          color="#63595C"
          marginLeft="0.9rem"
        >
          &#xe900;
        </Typography>
      </Button>
    </Link>
  );
};

export const OperationsComponents = ({
  rows,
  filtersHandlers,
  getOperationsFetch,
  page,
  setPage,
  dataCount,
  calcs
}) => {
  const [other, setOther] = useState(calcs?.others || 0);
  const [tempFilters, setTempFilters] = useState({ ...filtersHandlers.value });
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [anchorElCSV, setAnchorElCSV] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenuCSV = Boolean(anchorElCSV);
  const formatOptions = {
    style: "currency",
    currency: "USD",
  };
  const numberFormat = new Intl.NumberFormat("en-US", formatOptions);
  
  const [selectedData, setSelectedData] = useState(calcs);
  console.log(calcs)

  const handleClearSearch = () => {
    const newFilters = {
      ...filtersHandlers.value,  // Mantiene todos los filtros actuales
      opId: "",                  // Limpia solo estos campos
      billId: "",
      investor: ""
    };
    
    filtersHandlers.set(newFilters);  // Actualiza el estado conservando las fechas
    setSearch("");                    // Limpia el estado local de búsqueda si existe
  };
  const handleOpenModal = () => {
    console.log("Datos seleccionados para el modal:", calcs);
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






  const columns = [
    {
      field: "status",
      headerName: "Estado",
      width: 147,
      renderCell: (params) => {
       
        let statusText = "";
        let badgeClass = "";
        
        switch (params.value) {
          case 0:
            statusText = "Por Aprobar";
            badgeClass = "badge por-aprobar";
            break;
          case 1:
            statusText = "Aprobada";
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
          default:
            statusText = "Por Aprobar";
            badgeClass = "badge por-aprobar";
        }
        
        return <span className={badgeClass}>{statusText}</span>;
      },
    },
    
    { field: "opId", headerName: "ID", width: 40 },
    {
      field: "created_at",
      headerName: "Creado el",
      width: 93,
      valueFormatter: (params) => {
        if (!params.value) return '';
        // Extrae directamente las partes de la fecha ISO (evita conversión local)
        const [year, month, day] = params.value.split('T')[0].split('-');
        return `${day}/${month}/${year}`; // Formato dd/mm/YYYY
      }
    },
    {
      field: "opDate", 
      headerName: "Fecha Op", 
      width:93,
      valueFormatter: (params) => {
        if (!params.value) return '';
        const [year, month, day] = params.value.split('T')[0].split('-');
        return `${day}/${month}/${year}`;
      }
    },
    { field: "billFraction", headerName: "Fracción", width: 60 },
    { field: "billData", headerName: "# Factura", width: 100},
    { field: "emitterName", headerName: "Emisor", width: 230 },
    { field: "investorName", headerName: "Inversionista", width: 200 },
    { field: "payerName", headerName: "Pagador", width: 150 },
    { field: "discountTax", headerName: "Tasa Desc.", width: 60 },
    { field: "payedPercent", headerName: "% Desc.", width: 40 }, // Nueva columna
    { field: "investorTax", headerName: "Tasa Inv.", width:  40},
    { field: "payedAmount", headerName: "Valor Nominal", width: 110,
      valueFormatter: ({ value }) => {
        if (value == null) return "$0.00";
        return new Intl.NumberFormat("es-CO", {
          style: "currency",
          currency: "COP",
        }).format(value);
      },
    },
    { field: "presentValueInvestor", headerName: "Valor Inversionista", width: 110,
      valueFormatter: ({ value }) => {
        if (value == null) return "$0.00";
        return new Intl.NumberFormat("es-CO", {
          style: "currency",
          currency: "COP",
        }).format(value);
      },
    },
    { field: "probableDate", headerName: "Fecha Probable", width: 93,
      valueFormatter: (params) => {
        if (!params.value) return '';
        const [year, month, day] = params.value.split('T')[0].split('-');
        return `${day}/${month}/${year}`;
      }
    }, 
    { field: "opExpiration", headerName: "Fecha Fin", width: 93 ,
      valueFormatter: (params) => {
        if (!params.value) return '';
        const [year, month, day] = params.value.split('T')[0].split('-');
        return `${day}/${month}/${year}`;
      }
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
        {/* Botón Registrar Recaudo */}
        <Link
          href={
            params.row.status === 4
              ? "#"
              : `/administration/new-receipt?id=${params.row.id}`
          }
          passHref
          legacyBehavior
        >
          <Tooltip 
            title="Registrar recaudo" 
            arrow
            placement="top"
          >
            <Typography
              fontFamily="icomoon"
              fontSize="1.9rem"
              color="#488B8F"
              sx={{
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "#B5D1C980",
                  borderRadius: "5px"
                },
                padding: "0 4px"
              }}
            >
              &#xe904;
            </Typography>
          </Tooltip>
        </Link>

        {/* Botón Detalles Operación */}
        <Link 
          href={`/operations/manage?preview&id=${params.row.id}`}
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

  const handleTextFieldChange = (evt) => {
    setSearch(evt.target.value);
  };

  const handleDateRangeApply = (dateRange) => {
    // Actualiza solo las fechas manteniendo otros filtros
    console.log(dateRange)
    filtersHandlers.set({
      ...filtersHandlers.value,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate
    });
  };
  const handleClear = () => {
    
    // Limpiar solo fechas en los filtros globales
    filtersHandlers.set({
      ...filtersHandlers.value,
      startDate: "",
      endDate: ""
    });
  };
  const updateFilters = (value, field) => {
    if (field !== "multi") {
      filtersHandlers.set({ 
        ...tempFilters, 
        [field]: value,
        // Mantiene las fechas existentes
        startDate: tempFilters.startDate,
        endDate: tempFilters.endDate
      });
      return;
    }
  
    const onlyDigits = /^\d{3,4}$/; // Operación: 3-4 dígitos
    const alphaNumeric = /^[a-zA-Z0-9]{3,10}$/; // Factura: Alfanumérico de 3-10 caracteres
    const hasLetters = /[a-zA-Z]/.test(value); // Si tiene letras
    const hasSpaces = /\s/.test(value); // Si tiene espacios
  
    // Inicializamos los filtros vacíos
    const newFilters = { opId: "", billId: "", investor: "", startDate: null, endDate: null };
  
    // Clasificación más precisa
    if (onlyDigits.test(value)) {
      // Asignamos opId solo si tiene 3-4 dígitos
      newFilters.opId = value; // Asignar a opId si es una operación
    } else if (alphaNumeric.test(value) && !hasLetters && value.length >= 3 && value.length <= 10) {
      // Asignamos billId solo si es alfanumérico de 3-10 caracteres y no tiene letras
      newFilters.billId = value;
    } else if (hasLetters || hasSpaces || value.length > 4) {
      // Si tiene letras o espacios, es un nombre de inversionista
      newFilters.investor = value;
    } else {
      // Por defecto lo tratamos como inversionista
      newFilters.investor = value;
    }
  
    // Si las fechas no están vacías, las agregamos
    if (tempFilters.startDate && tempFilters.endDate) {
      newFilters.startDate = tempFilters.startDate;
      newFilters.endDate = tempFilters.endDate;
    }
    console.log(tempFilters)
    // Filtramos y actualizamos los filtros
    filtersHandlers.set({
      ...tempFilters,
      ...newFilters,
      startDate: tempFilters.startDate, // Conserva fechas
      endDate: tempFilters.endDate
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

  return (
    <>
      <BackButton path="/dashboard" />
      <Box sx={{ ...sectionTitleContainerSx }}>
        <Typography
          letterSpacing={0}
          fontSize="1.7rem"
          fontWeight="regular"
          marginBottom="0.7rem"
          color="#5EA3A3"
        >
          Operaciones
        </Typography>

        <Box sx={{ ...sectionTitleContainerSx }}>
        <Link href="/pre-operations2beta" passHref>
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
  placeholder="Buscar por Inversionista..."
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
    <Link href="/pre-operations2beta/byOp" underline="none">
      <button className="button-header-preop">Ver por Grupos</button>
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
        {/*<Grid container spacing={1.5} sx={{ ...entriesGrid }}>
        <Grid item xs={2}>
          <Entry title="Comisión">
            <ValueFormat value={Math.round(calcs?.commission) || 0} />
          </Entry>
        </Grid>

        <Grid item xs={2}>
          <EditableEntry
            title="Otros"
            onChangeMasked={(values) => {
              setOther(values.floatValue);
            }}
          />
        </Grid>

        <Grid item xs={2}>
          <Entry title="IVA">
            <ValueFormat value={Math.round(calcs?.iva) || 0} />
          </Entry>
        </Grid>

        <Grid item xs={2}>
          <Entry title="Valor inversor">
            <ValueFormat value={Math.round(calcs?.investorValue) || 0} />
          </Entry>
        </Grid>

        <Grid item xs={2}>
          <Entry title="RETEFUENTE">
            <ValueFormat value={Math.round(calcs?.rteFte) || 0} />
          </Entry>
        </Grid>

        <Grid item xs={2}>
          <Entry title="FACTURAR NETO">
            <ValueFormat value={Math.round(calcs?.netFact) || 0} />
          </Entry>
        </Grid>

        <Grid item xs={2}>
          <Entry title="RETEICA">
            <ValueFormat value={Math.round(calcs?.retIca) || 0} />
          </Entry>
        </Grid>

        <Grid item xs={2}>
          <Entry title="VALOR FUTURO">
            <ValueFormat value={Math.round(calcs?.futureValue) || 0} />
          </Entry>
        </Grid>

        <Grid item xs={2}>
          <Entry title="RETEIVA">
            <ValueFormat value={Math.round(calcs?.retIva) || 0} />
          </Entry>
        </Grid>

        <Grid item xs={2}>
          <Entry title="VALOR A GIRAR">
            <ValueFormat value={Math.round(calcs?.depositValue - other) || 0} />
          </Entry>
        </Grid>
      </Grid> */}
      

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
