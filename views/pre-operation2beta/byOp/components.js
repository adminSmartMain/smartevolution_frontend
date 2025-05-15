import { useEffect, useState} from "react";
import { ToastContainer } from "react-toastify";
import Link from "next/link";
import { SearchOutlined } from "@mui/icons-material";
import { Box, Button, Fade, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, TextField, Typography, Menu, InputAdornment, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import Modal from "@components/modals/modal";
import TitleModal from "@components/modals/titleModal";
import { Toast } from "@components/toast";
import ValueFormat from "@formats/ValueFormat";
import { useFetch } from "@hooks/useFetch";
import responsiveFontSize from "@lib/responsiveFontSize";
import BackButton from "@styles/buttons/BackButton";
import MuiButton from "@styles/buttons/button";
import RedButtonModal from "@styles/buttons/noButtonModal";
import GreenButtonModal from "@styles/buttons/yesButtonModal";
import CustomTooltip from "@styles/customTooltip";
import MuiTextField from "@styles/fields";
import { StandardTextField } from "@styles/fields/BaseField";
import InputTitles from "@styles/inputTitles";
import scrollSx from "@styles/scroll";
import CustomDataGrid from "@styles/tables";
import { DeleteOperation, MassiveUpdateOperation, UpdateOperation,TypeOperation, } from "./queries";
import { id } from "date-fns/locale";
import moment from "moment";
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import * as React from 'react';
import PropTypes from 'prop-types';
import ClearIcon from "@mui/icons-material/Clear";
import Collapse from '@mui/material/Collapse';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ModalValorAGirar from "../ModalValorAGirar";
import AdvancedDateRangePicker from "../AdvancedDateRangePicker";
import Pagination from '@mui/material/Pagination';
import CircularProgress from '@mui/material/CircularProgress';
import { Tooltip } from "@mui/material";
// Estilos
const sectionTitleContainerSx = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  mb: 1
};
const tableHeaderCellSx = {
      backgroundColor: "#F5F5F5",
      color: "#8C7E82",
      fontWeight: "bold",
      letterSpacing: "0px",
      textTransform: "none",
      padding: { xs: "6px 8px", sm: "8px 12px" }, // Responsivo
      lineHeight: 1.2,
      minHeight: { xs: "28px", sm: "32px" },
      height: { xs: "28px", sm: "32px" },
      fontSize: { xs: "0.7rem", sm: "0.8rem" } // Tamaño de fuente responsivo
    };

const tableCellSx = {
  color: "#000000",
  fontSize: "0.8rem",
  fontWeight: "normal",
  borderBottom: "1px solid #E0E0E0"
};

const actionButtonSx = {
  "&:hover": { 
    backgroundColor: "#B5D1C980",
    color: "#488B8F" 
  },
  cursor: "pointer",
  color: "#999999",
  fontSize: "1.9rem"
};

const buttonHeaderPreop = {
  padding: "8px 16px",
  borderRadius: "4px",
  cursor: "pointer",
  fontFamily: "'Roboto', sans-serif",
  fontSize: "12px",
  fontWeight: 500,
  border: "1px solid #488B8F",
  backgroundColor: "#488B8F",
  color: "white",
  marginRight: "10px",
  transition: "background-color 0.3s",
  textTransform: "none", // Esto quita las mayúsculas automáticas
  "&:hover": {
    backgroundColor: "#3a7073"
  }
};

const buttonHeaderPreopTitle = {
  padding: "6px 12px",
  borderRadius: "4px",
  border: "1px solid #488B8F",
  backgroundColor: "transparent",
  color: "#488B8F",
  fontSize: "14px",
  fontWeight: 600,
  cursor: "pointer",
  transition: "all 0.3s ease",
  marginRight: "10px",
  height: "32px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  textTransform: "none", // Esto quita las mayúsculas automáticas
  "&:hover": {
    color: "#488B8F"
  }
};

// Componente de fila expandible
function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState([false, null]);

  const handleOpenDelete = (id) => setOpenDelete([true, id]);
  const handleCloseDelete = () => setOpenDelete([false, null]);
  const getStatusBadge = (status) => {
    let statusText, badgeClass;
    
    switch(status) {
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
  
    return { statusText, badgeClass };
  };
  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
            sx={{ color: "#488B8F" }}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row" sx={tableCellSx}>
          {row.emitterName}
        </TableCell>
        <TableCell align="right" sx={tableCellSx}>{row.opId}</TableCell>
        <TableCell align="right" sx={tableCellSx}>{moment(row.opDate).format('DD/MM/YYYY')}</TableCell>
        <TableCell align="right" sx={tableCellSx}>{row.opType}</TableCell>
        <TableCell align="right" sx={tableCellSx}>{row.history.length}</TableCell>
        <TableCell align="right" sx={tableCellSx}>{row.investorName}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1, backgroundColor: "#F9F9F9", borderRadius: "4px", p: 2 }}>
              <Typography variant="h6" gutterBottom component="div" sx={{ color: "#488B8F", fontSize: "0.9rem", fontWeight: 600 }}>
                Detalles de la Operación
              </Typography>
              <TableContainer component={Paper} sx={{ boxShadow: "none", border: "1px solid #E0E0E0" }}>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                    <TableCell sx={tableHeaderCellSx}>Estado</TableCell>
                      <TableCell sx={tableHeaderCellSx}>Factura</TableCell>
                      <TableCell sx={tableHeaderCellSx}>Fracción</TableCell>
                      <TableCell sx={tableHeaderCellSx}>Pagador</TableCell>
                      <TableCell sx={tableHeaderCellSx}>Inversionista</TableCell>
                      <TableCell sx={tableHeaderCellSx}>Tasa Desc.</TableCell>
                      <TableCell sx={tableHeaderCellSx}>Tasa Inver.</TableCell>
                      <TableCell sx={tableHeaderCellSx}>Valor Inversionista</TableCell>
                      <TableCell sx={tableHeaderCellSx}>Fecha Probable</TableCell>
                      <TableCell sx={tableHeaderCellSx}>Fecha Fin</TableCell>
                      <TableCell align="right" sx={tableHeaderCellSx}>Acciones</TableCell>                    
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.history.map((historyRow, index) => (
                      <TableRow key={index}>
                        <TableCell sx={tableCellSx}>
                        <div className={getStatusBadge(historyRow.status).badgeClass}>
                          {getStatusBadge(historyRow.status).statusText}
                        </div>
                      </TableCell>
                        <TableCell sx={tableCellSx}>{historyRow.billData}</TableCell>
                        <TableCell sx={tableCellSx}>{historyRow.billFraction}</TableCell>
                        <TableCell sx={tableCellSx}>{historyRow.payerName}</TableCell>
                        <TableCell sx={tableCellSx}>{row.investorName}</TableCell>
                        <TableCell sx={tableCellSx}>{historyRow.discountTax}</TableCell>
                        <TableCell sx={tableCellSx}>{historyRow.investorTax}</TableCell>
                        <TableCell sx={tableCellSx}>
                          <ValueFormat value={historyRow.payedAmount} />
                        </TableCell>
                        <TableCell sx={tableCellSx}>
                          {historyRow.probableDate ? moment(historyRow.probableDate).format('DD/MM/YYYY') : '-'}
                        </TableCell>
                        <TableCell sx={tableCellSx}>
                          {row.opExpiration ? moment(row.opExpiration).format('DD/MM/YYYY') : '-'}
                        </TableCell>
                        <TableCell align="right" sx={tableCellSx}>
                          <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                          

                           <div style={{ 
                            display: "flex", 
                            justifyContent: "center", 
                            gap: "8px",
                            width: "100%"
                          }}>
                            {/* Botón Registrar Recaudo */}
                            <Link
                                      href={
                                        row.status === 4
                                          ? "#"
                                          : `/administration/new-receipt?id=${row.id}`
                                      }
                                      passHref
                                      legacyBehavior
                                    >
                                      <Tooltip 
                                        title={row.status === 4 ? "Acción no disponible" : "Registrar recaudo"} 
                                        arrow
                                        placement="top"
                                      >
                                        <Typography
                                          fontFamily="icomoon"
                                          fontSize="1.9rem"
                                          color={row.status === 4 ? "#CCCCCC" : "#488B8F"}
                                          sx={{
                                            cursor: row.status === 4 ? "not-allowed" : "pointer",
                                            "&:hover": {
                                              backgroundColor: row.status === 4 ? "transparent" : "#B5D1C980",
                                              borderRadius: "5px"
                                            },
                                            padding: "0 4px",
                                            pointerEvents: row.status === 4 ? "none" : "auto"
                                          }}
                                          onClick={e => {
                                            if (row.status === 4) {
                                              e.preventDefault();
                                            }
                                          }}
                                        >
                                          &#xe904;
                                        </Typography>
                                      </Tooltip>
                                    </Link>

                            {/* Botón Detalles Operación */}
                            <Link 
                              href={`/pre-operations2beta/detailPreOp?id=${row.id}`}
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
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

      {/* Modal de confirmación para eliminar */}
      <Modal open={openDelete[0]} handleClose={handleCloseDelete}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="100%"
          width="100%"
        >
          <Typography letterSpacing={0} fontSize="1vw" fontWeight="medium" color="#63595C">
            ¿Estás seguro que deseas eliminar la operación?
          </Typography>

          <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center" mt={4}>
            <GreenButtonModal onClick={handleCloseDelete}>Volver</GreenButtonModal>
            <RedButtonModal sx={{ ml: 2 }} onClick={() => handleDelete(openDelete[1])}>
              Eliminar
            </RedButtonModal>
          </Box>
        </Box>
      </Modal>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    opId: PropTypes.string.isRequired,
    opDate: PropTypes.string.isRequired,
    emitterName: PropTypes.string.isRequired,
    investorName: PropTypes.string.isRequired,
    history: PropTypes.arrayOf(
      PropTypes.shape({
        billData: PropTypes.string,
        billFraction: PropTypes.string,
        payerName: PropTypes.string,
        discountTax: PropTypes.number,
        investorTax: PropTypes.number,
        payedAmount: PropTypes.number,
        probableDate: PropTypes.string
      }),
    ).isRequired,
  }).isRequired,
};

export const OperationsComponents = ({
  rows2,
  filtersHandlers,
  getOperationsFetch,
  page,
  setPage,
  dataCount,
  typeOperation,
  calcs,
   loading,
}) => {
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [anchorElCSV, setAnchorElCSV] = useState(null);
  const [openDelete, setOpenDelete] = useState([false, null]);
  // Calcula el total de páginas basado en el conteo de datos
  const totalPages = Math.ceil(dataCount / 15); // 15 es el tamaño de página por defecto
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  const handleMenuClickCSV = (event) => setAnchorElCSV(event.currentTarget);
  const handleCloseMenuCSV = () => setAnchorElCSV(null);
  const handleOpenDelete = (id) => setOpenDelete([true, id]);
  const handleCloseDelete = () => setOpenDelete([false, null]);

  // Usa useRef para rastrear si es una actualización inicial




  const openMenuCSV = Boolean(anchorElCSV);
  // Hooks
        const {
          fetch: fetchTypeIdSelect,
          loading: loadingTypeIdSelect,
          error: errorTypeIdSelect,
          data: dataTypeIdSelect,
        } = useFetch({ service: TypeOperation, init: true });
  
  const handleClearSearch = () => {
    const newFilters = {
      ...filtersHandlers.value,
      opId: "",
      billId: "",
      investor: ""
    };
    filtersHandlers.set(newFilters);
    setSearch("");
  };

  const handleTextFieldChange = (evt) => {
    setSearch(evt.target.value);
  };

  const handleDateRangeApply = (dateRange) => {
    filtersHandlers.set({
      ...filtersHandlers.value,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate
    });
  };

  const handleClear = () => {
    filtersHandlers.set({
      ...filtersHandlers.value,
      startDate: "",
      endDate: ""
    });
  };

  const updateFilters = (value, field) => {
    if (field !== "multi") {
      filtersHandlers.set({ 
        ...filtersHandlers.value, 
        [field]: value,
        startDate: filtersHandlers.value.startDate,
        endDate: filtersHandlers.value.endDate
      });
      return;
    }
  
    const onlyDigits = /^\d{3,4}$/;
    const alphaNumeric = /^[a-zA-Z0-9]{3,10}$/;
    const hasLetters = /[a-zA-Z]/.test(value);
    const hasSpaces = /\s/.test(value);
  
    const newFilters = { opId: "", billId: "", investor: "", startDate: null, endDate: null };
  
    if (onlyDigits.test(value)) {
      newFilters.opId = value;
    } else if (alphaNumeric.test(value) && !hasLetters && value.length >= 3 && value.length <= 10) {
      newFilters.billId = value;
    } else if (hasLetters || hasSpaces || value.length > 4) {
      newFilters.investor = value;
    } else {
      newFilters.investor = value;
    }
  
    if (filtersHandlers.value.startDate && filtersHandlers.value.endDate) {
      newFilters.startDate = filtersHandlers.value.startDate;
      newFilters.endDate = filtersHandlers.value.endDate;
    }
  
    filtersHandlers.set({
      ...filtersHandlers.value,
      ...newFilters,
      startDate: filtersHandlers.value.startDate,
      endDate: filtersHandlers.value.endDate
    });
  };
  
  const handleDelete = (id) => {
    DeleteOperation(id);
    setOpenDelete([false, null]);
    setTimeout(() => {
      getOperationsFetch();
    }, 1000);
  };

  function groupByOperation(data) {
    const grouped = {};

    data.forEach(item => {
      const opId = item.opId;
      if (!grouped[opId]) {
        grouped[opId] = {
          opId: item.opId,
          opDate: item.opDate,
          opExpiration: item.opExpiration,
          operationDays: item.operationDays,
          payedPercent: item.payedPercent,
          payedAmount: item.payedAmount,
          investorName: item.investorName,
          investorBroker: item.investorBroker,
          emitterName: item.emitterName,
          
          id: item.id,
          opType:  typeOperation?.data.find(item2 => item2.id === item.opType).description,
          history: []
        };
      }
      grouped[opId].history?.push({
        status: item.status,
        billData: item.billData,
        billFraction: item.billFraction,
        payerName: item.payerName,
        discountTax: item.discountTax,
        investorTax: item.investorTax,
        payedAmount: item.payedAmount,
        investorProfit: item.investorProfit,
        probableDate: item.probableDate,
        opExpiration: item.opExpiration
      });
    });
    
    return Object.values(grouped);
  }
  
  const handleExportExcel = () => {
    const currentRows = rows; 
    const columnHeaders = [
      "ID Operación", 
      "Fecha", 
      "Emisor", 
      "Inversionista", 
      "N° Facturas", 
      "Valor Total"
    ];
  
    const csvContent = [
      columnHeaders.join(","),
      ...currentRows.map(row => [
        row.opId,
        moment(row.opDate).format('DD/MM/YYYY'),
        row.emitterName,
        row.investorName,
        row.history.length,
        row.payedAmount
      ].join(","))
    ].join("\n");
  
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", "operaciones_por_grupo.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const rows = groupByOperation(rows2);

  return (
    <>
      <BackButton path="/dashboard" />
      
      {/* Encabezado */}
      <Box sx={sectionTitleContainerSx}>
        <Typography
          letterSpacing={0}
          fontSize="1.7rem"
          fontWeight="regular"
          color="#5EA3A3"
        >
          Operaciones por Grupo
        </Typography>
            
        <Link href="/operations" passHref>
          <Button sx={buttonHeaderPreopTitle}>
            Operaciones
          </Button>
        </Link>
      </Box>

      {/* Barra de búsqueda y filtros */}
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
          size="small"
          placeholder="Buscar por Inversionista..."
          value={search}
          onChange={(evt) => handleTextFieldChange(evt, "investor")}
          onKeyPress={(event) => {
            if (event.key === "Enter") {
              const valueToSearch = search || "";
              updateFilters(valueToSearch, "multi");
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
          <Link href="/pre-operations2beta" underline="none">
            <Button sx={buttonHeaderPreop}>Ver por facturas</Button>
          </Link>

          <Button sx={buttonHeaderPreop} onClick={handleOpenModal}>
            Valor a Girar
          </Button>
          
          <ModalValorAGirar open={openModal} handleClose={handleCloseModal} data={calcs} />

          <AdvancedDateRangePicker
            onApply={handleDateRangeApply}
            onClean={handleClear}
          />

          <IconButton onClick={handleMenuClickCSV} sx={{ color: "#488B8F" }}>
            <MoreVertIcon />
          </IconButton>
          
          <Menu 
            anchorEl={anchorElCSV} 
            open={openMenuCSV} 
            onClose={handleCloseMenuCSV}
            PaperProps={{
              style: {
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                borderRadius: '4px'
              }
            }}
          >
            <MenuItem 
              onClick={handleExportExcel}
              sx={{ fontSize: '0.8rem', color: '#333' }}
            >
              Exportar a CSV
            </MenuItem>
          </Menu>
        </Box>
      </Box>
      
      {/* Tabla principal */}
              {/* Indicador de carga centrado solo en la tabla */}
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
      <TableContainer 
        component={Paper} 
        sx={{ 
          boxShadow: 'none', 
          border: '1px solid #E0E0E0',
          borderRadius: '4px',
          filter: loading ? 'blur(2px)' : 'none', // Efecto de desenfoque
          transition: 'filter 0.3s ease-out' // Transición suave
        }}
      >

        <Table aria-label="collapsible table" size="medium">
          <TableHead>
            <TableRow>
              <TableCell sx={tableHeaderCellSx} width="5%"></TableCell>
              <TableCell sx={tableHeaderCellSx} width="20%">Emisor</TableCell>
              <TableCell sx={tableHeaderCellSx} width="10%" align="right"># OP</TableCell>
              <TableCell sx={tableHeaderCellSx} width="15%" align="right">Fecha Op</TableCell>
              <TableCell sx={tableHeaderCellSx} width="15%" align="right">Tipo</TableCell>
              <TableCell sx={tableHeaderCellSx} width="10%" align="right">Facturas</TableCell>
              <TableCell sx={tableHeaderCellSx} width="25%" align="right">Inversionista</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <Row key={`${row.opId}-${row.id}`} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
  {/* Paginación */}
      {/* Reemplaza el Box de Pagination actual por este: */}
 <Box
                container
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
              >
  <Typography fontSize="0.8rem" fontWeight="600" color="#5EA3A3">
    {page * 15 - 14} - {Math.min(page * 15, dataCount)} de {dataCount}
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
        color: page > 1 ? "#488B8F" : "#CCCCCC",
        transform: "rotate(180deg)"
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
        if (page < Math.ceil(dataCount / 15)) {
          setPage(page + 1);
         
        }
      }}
    >
    &#xe91f;
  </Typography>
  </Box>
</Box>
      <ToastContainer />
    </>
  );
};