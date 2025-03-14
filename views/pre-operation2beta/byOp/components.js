import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import Link from "next/link";
import { SearchOutlined } from "@mui/icons-material";
import { Box, Button, Fade, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
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
import { DeleteOperation, MassiveUpdateOperation, UpdateOperation } from "./queries";
import { id } from "date-fns/locale";
import moment from "moment";
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import * as React from 'react';
import PropTypes from 'prop-types';

import Collapse from '@mui/material/Collapse';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';


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

const selectSx = {
  color: "#333333",
  "&:before": {
    borderBottom: "1px solid #333333",
  },
  "&:after": {
    borderBottom: "2px solid #488B8F",
  },
  "&:hover:not(.Mui-disabled):before": {
    borderBottom: "2px solid #488B8F",
  },
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

const RegisterButton = (props) => {
  const { ...rest } = props;
 // Función que maneja la apertura de la ventana de registro de operación

 const [anchorEl, setAnchorEl] = useState(null); // Estado para controlar el menú
 const openMenu = Boolean(anchorEl); // Determina si el menú está abierto

 //Estado de la pestana de registro de operacion

 const [openWindow, setOpenWindow] = useState(null); // Estado para almacenar la referencia de la ventana
 const handleOpenRegisterOperation = () => {
  if (openWindow && !openWindow.closed) {
    // Si la ventana ya está abierta, solo le damos el foco (la trae al frente)
    openWindow.focus();
  } else {
    // Si la ventana no está abierta, la abrimos y guardamos la referencia
    const newWindow = window.open("/pre-operations2beta/manage", "_blank", "width=800, height=600");
    setOpenWindow(newWindow); // Guardamos la referencia de la ventana
    // Escuchar el evento de cierre de la ventana
    newWindow.onbeforeunload = () => {
      setOpenWindow(null); // Restablecer la referencia cuando la ventana se cierre
    };
  }
};
  return (
    
      <Button
        variant="standard"
        color="primary"
        size="large"
        onClick={handleOpenRegisterOperation}
        sx={{
          height: "2.6rem",
          backgroundColor: "transparent",
          border: "1.4px solid #63595C",
          borderRadius: "4px",
        }}
      >
        <Typography
          letterSpacing={0}
          fontSize="80%"
          fontWeight="bold"
          color="#63595C"
        >
          Registrar nueva operacion
        </Typography>

        <Typography
          fontFamily="icomoon"
          fontSize="1.2rem"
          color="#63595C"
          marginLeft="0.9rem"
        >
          &#xe927;
        </Typography>
      </Button>
    
  );
};

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

const formatNumber = (value) => new Intl.NumberFormat("es-ES").format(value || 0);
export const OperationsComponents = ({
  rows2,
  filtersHandlers,
  getOperationsFetch,
  page,
  setPage,
  dataCount,
}) =>  {
  const calcs = rows2[0]?.calcs;
  const [other, setOther] = useState(calcs?.others || 0);
  const [tempFilters, setTempFilters] = useState({ ...filtersHandlers.value });


  const [open, setOpen] = useState([false, ""]);
  const handleOpen = (id) => {
    setOpen([true, id]);
  };
  const [openDelete, setOpenDelete] = useState([false, null]);
  const handleOpenDelete = (id) => setOpenDelete([true, id]);
  const handleCloseDelete = () => setOpenDelete([false, null]);

  const handleDelete = (id) => {
    fetchDeleteOperation(id);
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
                history: []
            };
        }
        grouped[opId].history?.push({
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
 
  
  function Row(props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);
  
    return (
      
      <React.Fragment>
        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row">
            {row.emitterName}
          </TableCell>
          <TableCell align="right">{row.opId}</TableCell>
          <TableCell align="right">{row.opDate}</TableCell>
          <TableCell align="right">{row.emitterName}</TableCell>
          <TableCell align="right">{row.history.length}</TableCell>
          <TableCell align="right">{row.emitterName}</TableCell>
          <TableCell align="right">
  

  {/* Editar operación */}
  <Link
    href={
      row.status == 0
        ? `/operations/manage/?id=${row.id}`
        : row.status === 2
        ? `/operations/manage/?id=${row.id}&previousDeleted=true`
        : `#`
    }
  >
    <CustomTooltip
      title="Editar operación"
      arrow
      placement="bottom-start"
      TransitionComponent={Fade}
      PopperProps={{
        modifiers: [{ name: "offset", options: { offset: [0, -15] } }],
      }}
    >
      <Typography
        fontFamily="icomoon"
        fontSize="1.9rem"
        color="#999999"
        borderRadius="5px"
        sx={{
          "&:hover": { backgroundColor: "#B5D1C980", color: "#488B8F" },
          cursor: "pointer",
        }}
      >
        &#xe900;
      </Typography>
    </CustomTooltip>
  </Link>

  {/* Ver detalles */}
  <Link href={`/operations/manage?preview&id=${row.id}`}>
    <CustomTooltip
      title="Ver operación"
      arrow
      placement="bottom-start"
      TransitionComponent={Fade}
      PopperProps={{
        modifiers: [{ name: "offset", options: { offset: [0, -15] } }],
      }}
    >
      <Typography
        fontFamily="icomoon"
        fontSize="1.9rem"
        color="#999999"
        borderRadius="5px"
        sx={{
          "&:hover": { backgroundColor: "#B5D1C980", color: "#488B8F" },
          cursor: "pointer",
        }}
      >
        &#xe922;
      </Typography>
    </CustomTooltip>
  </Link>

  {/* Eliminar */}
  <CustomTooltip
    title="Eliminar"
    arrow
    placement="bottom-start"
    TransitionComponent={Fade}
    PopperProps={{
      modifiers: [{ name: "offset", options: { offset: [0, -15] } }],
    }}
  >
    <Typography
      fontFamily="icomoon"
      fontSize="1.9rem"
      color="#999999"
      borderRadius="5px"
      sx={{
        "&:hover": { backgroundColor: "#B5D1C980", color: "#488B8F" },
        cursor: "pointer",
      }}
      onClick={() => {
        if (row.status === 1) {
          Toast("No se puede eliminar una operación aprobada", "error");
        } else {
          handleOpenDelete(row.id);
        }
      }}
    >
      &#xe901;
    </Typography>
  </CustomTooltip>

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
</TableCell>

        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  Detalles
                </Typography>
                <TableContainer sx={{ width: "100%", minHeight: "200px" }}>
                <Table aria-label="purchases">
                  <TableHead sx={{ width: "100%" }}>
                    <TableRow>
                      <TableCell>Factura</TableCell>
                      <TableCell>Fraccion</TableCell>
                      <TableCell>Pagador</TableCell>
                      <TableCell>Inversionista</TableCell>
                      <TableCell>Tasa Desc.</TableCell>
                      <TableCell>Tasa Inver.</TableCell>
                      <TableCell>Valor Inversionista</TableCell>
                      <TableCell>Fecha Probable</TableCell>
                      <TableCell>Fecha Fin</TableCell>
                      
                      <TableCell align="right">Acciones</TableCell>                    
                      </TableRow>
                  </TableHead>
                  <TableBody sx={{ minWidth: "100%" }}>
                    {row.history.map((historyRow) => (
                      <TableRow key={historyRow.date}>
                        <TableCell component="th" scope="row">
                          {historyRow.billData}
                        </TableCell>
                        <TableCell>{historyRow.billFraction}</TableCell>
                        <TableCell align="right">{historyRow.payerName}</TableCell>
                        <TableCell align="right">
                          {row.investorName}
                        </TableCell>
                        <TableCell align="right">
                          {historyRow.discountTax}
                        </TableCell>
                        <TableCell align="right">
                          {historyRow.investorTax}
                        </TableCell>
                        <TableCell align="right">
                          {historyRow.probableDate}
                        </TableCell>
                        <TableCell align="right">
                          {historyRow.probableDate}
                        </TableCell>
                        <TableCell align="right">
                          {row.opExpiration}
                        </TableCell>
                        
                        <TableCell align="right">
 
                {/* Editar operación */}
                <Link
                  href={
                    row.status == 0
                      ? `/pre-operation2beta/editPreOp/?id=${row.id}`
                      : row.status === 2
                      ? `/pre-operation2beta/editPreOp/?id=${row.id}&previousDeleted=true`
                      : `#`
                  }
                >
                  <CustomTooltip
                    title="Editar operación"
                    arrow
                    placement="bottom-start"
                    TransitionComponent={Fade}
                    PopperProps={{
                      modifiers: [{ name: "offset", options: { offset: [0, -15] } }],
                    }}
                  >
                    <Typography
                      fontFamily="icomoon"
                      fontSize="1.9rem"
                      color="#999999"
                      borderRadius="5px"
                      sx={{
                        "&:hover": { backgroundColor: "#B5D1C980", color: "#488B8F" },
                        cursor: "pointer",
                      }}
                    >
                      &#xe900;
                    </Typography>
                  </CustomTooltip>
                </Link>

                {/* Ver detalles */}
                <Link href={`/operations/manage?preview&id=${row.id}`}>
                  <CustomTooltip
                    title="Ver operación"
                    arrow
                    placement="bottom-start"
                    TransitionComponent={Fade}
                    PopperProps={{
                      modifiers: [{ name: "offset", options: { offset: [0, -15] } }],
                    }}
                  >
                    <Typography
                      fontFamily="icomoon"
                      fontSize="1.9rem"
                      color="#999999"
                      borderRadius="5px"
                      sx={{
                        "&:hover": { backgroundColor: "#B5D1C980", color: "#488B8F" },
                        cursor: "pointer",
                      }}
                    >
                      &#xe922;
                    </Typography>
                  </CustomTooltip>
                </Link>

                {/* Eliminar */}
                <CustomTooltip
                  title="Eliminar"
                  arrow
                  placement="bottom-start"
                  TransitionComponent={Fade}
                  PopperProps={{
                    modifiers: [{ name: "offset", options: { offset: [0, -15] } }],
                  }}
                >
                  <Typography
                    fontFamily="icomoon"
                    fontSize="1.9rem"
                    color="#999999"
                    borderRadius="5px"
                    sx={{
                      "&:hover": { backgroundColor: "#B5D1C980", color: "#488B8F" },
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      if (row.status === 1) {
                        Toast("No se puede eliminar una operación aprobada", "error");
                      } else {
                        handleOpenDelete(row.id);
                      }
                    }}
                  >
                    &#xe901;
                  </Typography>
                </CustomTooltip>

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
                        </React.Fragment>
                      );
                    }
  
  Row.propTypes = {
    row: PropTypes.shape({
      calories: PropTypes.number.isRequired,
      carbs: PropTypes.number.isRequired,
      fat: PropTypes.number.isRequired,
      history: PropTypes.arrayOf(
        PropTypes.shape({
          amount: PropTypes.number.isRequired,
          customerId: PropTypes.string.isRequired,
          date: PropTypes.string.isRequired,
        }),
      ).isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      protein: PropTypes.number.isRequired,
    }).isRequired,
  };
  
  const rows =groupByOperation(rows2)
  console.log(rows)
  
  const handleTextFieldChange = async (evt, field) => {
    setTempFilters({ ...tempFilters, [field]: evt.target.value });
  };

  const updateFilters = (value, field) => {
    filtersHandlers.set({ ...tempFilters, [field]: value });
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
          Consulta de Pre-operaciones
        </Typography>
        <Button
                variant="standard"
                color="primary"
                size="large"
                
                sx={{
                  height: "2.6rem",
                  backgroundColor: "transparent",
                  border: "1.4px solid #63595C",
                  borderRadius: "4px",
                }}
              >
                <Typography
                  letterSpacing={0}
                  fontSize="80%"
                  fontWeight="bold"
                  color="#63595C"
                >
                  Operaciones
                </Typography>
        
               
              </Button>
      </Box>

      <Box sx={{ ...filtersContainerSx }}>
        <Box display="flex" flexDirection="column">
          <InputTitles sx>Buscar N° Operación</InputTitles>
          <TextFieldSearch
            id="searchOperation"
            placeholder="N° Operación"
            value={tempFilters.opId}
            onChange={(evt) => handleTextFieldChange(evt, "opId")}
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                updateFilters(event.target.value, "opId");
              }
              handleTextFieldChange(event, "opId");
            }}
          />
        </Box>

        <Box display="flex" flexDirection="column">
          <InputTitles>Buscar N° Factura</InputTitles>
          <TextFieldSearch
            id="searchBill"
            placeholder="N° Factura"
            value={tempFilters.billId}
            onChange={(evt) => handleTextFieldChange(evt, "billId")}
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                updateFilters(event.target.value, "billId");
              }
              handleTextFieldChange(event, "billId");
            }}
          />
        </Box>

        <Box display="flex" flexDirection="column">
          <InputTitles>Buscar nombres</InputTitles>
          <TextFieldSearch
            id="searchName"
            placeholder="Nombre"
            value={tempFilters.investor}
            onChange={(evt) => handleTextFieldChange(evt, "investor")}
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                updateFilters(event.target.value, "investor");
              }
              handleTextFieldChange(event, "investor");
            }}
          />
        </Box>

        <Box display="flex" alignSelf="flex-end" ml="auto" mb={1}>
        <Button
                variant="standard"
                color="primary"
                size="large"
                
                sx={{
                  height: "2.6rem",
                  backgroundColor: "transparent",
                  border: "1.4px solid #63595C",
                  borderRadius: "4px",
                }}
              >
                <Typography
                  letterSpacing={0}
                  fontSize="80%"
                  fontWeight="bold"
                  color="#63595C"
                >
                 ver por factura
                </Typography>
        
              </Button>
          <RegisterButton />
          
        </Box>
      </Box>

       <Box display="flex" alignSelf="flex-end" ml="auto" mb={1}>
      
            <Grid container spacing={2} alignItems="center" sx={{ whiteSpace: "nowrap", overflowX: "auto", p: 1 }}>
                  {[
                    { title: "Comisión", value: calcs?.commission },
                    { title: "IVA", value: calcs?.iva },
                    { title: "Valor inversor", value: calcs?.investorValue },
                    { title: "RETEFUENTE", value: calcs?.rteFte },
                    { title: "FACTURAR NETO", value: calcs?.netFact },
                    { title: "RETEICA", value: calcs?.retIca },
                    { title: "VALOR FUTURO", value: calcs?.futureValue },
                    { title: "RETEIVA", value: calcs?.retIva },
                    { title: "VALOR A GIRAR", value: calcs?.depositValue - other },
                  ].map((item, index) => (
                    <Box key={index} sx={{ display: "flex", flexDirection: "column", alignItems: "center", mx: 2.7 }}>
                      <Typography variant="caption" color="textSecondary">{item.title}</Typography>
                      <Typography variant="body2">{formatNumber(Math.round(item.value))}</Typography>
                    </Box>
                  ))}
      
                  {/* Campo editable para "Otros" */}
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mx: 2.7 }}>
                    <Typography variant="caption" color="textSecondary">Otros</Typography>
                    <TextField
                      variant="standard"
                      size="small"
                      type="number"
                      value={other}
                      onChange={(e) => setOther(parseFloat(e.target.value) || 0)}
                      sx={{ width: 90, textAlign: "right", textAlignLast: "right" }}
                    />
                  </Box>
                </Grid>
      
      
            </Box>
           
    <TableContainer component={Paper}>
    <Table aria-label="collapsible table">
      <TableHead>
        <TableRow>
          <TableCell />
          <TableCell>Estado</TableCell>
          <TableCell align="right"># OP</TableCell>
          <TableCell align="right">Creado el</TableCell>
          <TableCell align="right">Tipo</TableCell>
          <TableCell align="right">Facturas</TableCell>
          <TableCell align="right">Emisor</TableCell>
          <TableCell align="right">Acciones</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row) => (
          <Row key={row.name} row={row} />
        ))}
      </TableBody>
    </Table>
  </TableContainer></>
    
  );
}
