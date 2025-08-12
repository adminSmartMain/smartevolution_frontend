import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import { ListItemIcon } from '@mui/material';
import ClearIcon from "@mui/icons-material/Clear";
import Link from "next/link";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { SearchOutlined } from "@mui/icons-material";
import { Box, Button, Fade, FormControl, Grid,ListItemText, IconButton, InputLabel,Menu, MenuItem, InputAdornment , Select, TextField, Typography,CircularProgress } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckIcon from "@mui/icons-material/Check";
import Modal from "@components/modals/modal";
import TitleModal from "@components/modals/titleModal";
import { Toast } from "@components/toast";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

import DateFormat from "@formats/DateFormat";

import { useFetch } from "@hooks/useFetch";

import downloadFile from "@lib/downloadFile";
import axios from 'axios';
import BackButton from "@styles/buttons/BackButton";
import RedButtonModal from "@styles/buttons/noButtonModal";
import GreenButtonModal from "@styles/buttons/yesButtonModal";
import CustomTooltip from "@styles/customTooltip";
import BaseField from "@styles/fields/BaseField";
import InputTitles from "@styles/inputTitles";
import LoadingCircle from "@styles/loading";
import scrollSx from "@styles/scroll";
import CustomDataGrid from "@styles/tables";
import EditIcon from '@mui/icons-material/Edit';
import AdvancedDateRangePicker from "@components/AdvancedDateRangePicker";

import {
  DeleteBillById,
  GetBillEvents,
  GetBillList,
  GetBillListByQuery,getTypeBill
} from "./queries";

import FileSaver, { saveAs } from "file-saver";
import moment from "moment";

//comentario de prueba
export const BillsComponents = () => {
  const [filter, setFilter] = useState("");
  const [query, setQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
    const [anchorElTypeBill, setAnchorElTypeBil] = useState(null);
    const [anchorElChannel, setAnchorElChannel] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [search, setSearch] = useState("");
  const [optionsTypeBill,setOptionsTypeBill]= useState("");
     const [page, setPage] = useState(1);
  const formatOptions = {
    style: "currency",
    currency: "USD",
  };
  const [anchorElCSV, setAnchorElCSV] = useState(null);
    const openMenuCSV = Boolean(anchorElCSV);
  const numberFormat = new Intl.NumberFormat("en-US", formatOptions);
  const [openWindow, setOpenWindow] = useState(null); 
  
//Type bill button
  const [selectedOptionTypeBill, setSelectedOptionTypeBill] = useState(null);
 const [selectedOptionChannel, setSelectedOptionChannel] = useState(null);


  // Hooks
  const {
    fetch: fetchBillList,
    loading: loading,
    error: error,
    data: data,
  } = useFetch({
    service: (args) => GetBillList({ ...filters, page }),
    init: true,
  });

  const {
    fetch: fetchDeleteBillById,
    loading: loadingDeleteBillById,
    error: errorDeleteBillById,
    data: dataDeleteBillById,
  } = useFetch({ service: DeleteBillById, init: false });

  const {
    fetch: fetchGetBillEvents,
    loading: loadingGetBillEvents,
    error: errorGetBillEvents,
    data: dataGetBillEvents,
  } = useFetch({ service: GetBillEvents, init: false });





// Filters


const [filters, setFilters] = useState({
  operation: "",
  mode: 'intelligent_query',
  emitter_or_payer_or_billId: "",
  typeBill: "",       // Añade este campo
  channel: "",        // Añade este campo
  startDate: "",
  endDate: ""
});

  const filtersHandlers = {
    value: filters,
    set: setFilters,
    get: fetchBillList,
    loading: loading,
    error:  error,
    data: data?.results || {},
  };

 const [tempFilters, setTempFilters] = useState({ ...filtersHandlers.value });
useEffect(() => {
  fetchBillList();
}, [
  filters.operation, 
  filters.emitter_or_payer_or_billId,
  filters.mode,
  filters.startDate, 
  filters.endDate,
  filters.typeBill,    // Añade esta dependencia
  filters.channel,     // Añade esta dependencia
  page
]);

  const handleClearSearch = () => {
    console.log(filtersHandlers.value)
    const newFilters = {
      ...filtersHandlers.value,  // Mantiene todos los filtros actuales
      operation: "",                  // Limpia solo estos campos
      mode:'intelligent_query',
      emitter_or_payer_or_billId: "",
    
    };
    
    filtersHandlers.set(newFilters);  // Actualiza el estado conservando las fechas
    setSearch("");                    // Limpia el estado local de búsqueda si existe
  };

const handleTextFieldChange = (evt) => {
  const value = evt.target.value;
  setSearch(value);
  
  // Si el campo queda vacío, actualizar filtros automáticamente
  if (value === "") {
    updateFilters("", "multi");
  }
};




//CODIGO FILTRO FECHAS
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



 const optionByChannel=[{label:'Todos',value:'todos'},{label:'Autogestion',value:'autogestion'},{label:'No-autogestión',value:'no-autogestion'}]

  // CODIGO DE MANEJO FILTRO POR CANAL
 
 const handleSelectChannel = (option) => {
  setSelectedOptionChannel(option);
  handleCloseChannel();
  
  // Actualiza los filtros globales
  filtersHandlers.set({
    ...filtersHandlers.value,
    channel: option?.value || "", // Usa option.value o cadena vacía
    page: 1 // Resetear a primera página
  });
};


    
  const handleClearByChannel = () => {
    setSelectedOptionChannel(null);
    // Limpiar solo fechas en los filtros globales
    filtersHandlers.set({
      ...filtersHandlers.value,
     channel: "",
       page: 1
    });
  };



 const handleSelectTypeBill = (option) => {
  setSelectedOptionTypeBill(option);
  handleCloseTypeBill();
  
  // Actualiza los filtros globales
  filtersHandlers.set({
    ...filtersHandlers.value,
    typeBill: option?.id || "", // Usa option.value o cadena vacía
    page: 1 // Resetear a primera página
  });
};

const handleClearTypeBill = () => {
  setSelectedOptionTypeBill(null);
  filtersHandlers.set({
    ...filtersHandlers.value,
    typeBill: "",
    page: 1
  });
};






 const [filterApplied, setFilterApplied] = useState(false);
  const updateFilters = (value, field) => {
     if (field !== "multi") {
      const newFilters = { 
        ...tempFilters, 
        [field]: value,
        startDate: tempFilters.startDate,
        endDate: tempFilters.endDate,
        typeBill:tempFilters.typeBill,
        channel:tempFilters.channel
      };
      
      filtersHandlers.set(newFilters);

      // Si el valor es diferente al filtro actual, marcamos como filtro aplicado
      if (tempFilters[field] !== value) {
        setFilterApplied(true);
      }
      return;
    }

 const onlyDigits = /^\d{3,4}$/; // Operación: 3-4 dígitos
    const alphaNumeric = /^[a-zA-Z0-9]{3,10}$/; // Factura: Alfanumérico de 3-10 caracteres
    const hasLetters = /[a-zA-Z]/.test(value); // Si tiene letras
    const hasSpaces = /\s/.test(value); // Si tiene espacios
  
    // Inicializamos los filtros vacíos
      // Resto de tu lógica existente...
  const newFilters = { 
    operation: "",
    emitter_or_payer_or_billId: "",
    mode: "",
    startDate: "", 
    endDate: "",
    typeBill: tempFilters.typeBill,    // Conserva el filtro de tipo
    channel: tempFilters.channel       // Conserva el filtro de canal
  };
    // Clasificación más precisa
    if (onlyDigits.test(value)) {
      // Asignamos opId solo si tiene 3-4 dígitos
      newFilters.operation = value; // Asignar a opId si es una operación
      
    } else if (alphaNumeric.test(value) && !hasLetters && value.length >= 3 && value.length <= 10) {
      // Asignamos billId solo si es alfanumérico de 3-10 caracteres y no tiene letras
      newFilters.billId = value;
      newFilters.mode="intelligent_query"
    } else if (hasLetters || hasSpaces || value.length > 4) {
      // Si tiene letras o espacios, es un nombre de inversionista
      newFilters.emitter_or_payer_or_billId = value;
      newFilters.mode="intelligent_query"
    } else {
      // Por defecto lo tratamos como inversionista
      newFilters.emitter_or_payer_or_billId = value;
      newFilters.mode="intelligent_query"
    }
  
    // Si las fechas no están vacías, las agregamos
    if (tempFilters.startDate && tempFilters.endDate) {
      newFilters.startDate = tempFilters.startDate;
      newFilters.endDate = tempFilters.endDate;
    }



     // Si las fechas no están vacías, las agregamos
    if (tempFilters.typeBill) {
      newFilters.typeBill = tempFilters.typeBill;
   
    }
    // Filtramos y actualizamos los filtros
    filtersHandlers.set({
      ...tempFilters,
      ...newFilters,
      startDate: tempFilters.startDate, // Conserva fechas
      endDate: tempFilters.endDate,
      typeBill: tempFilters.typeBill,
    });

        setFilterApplied(true);
              setPage(1)
  };
  
console.log(filters)

// Fin codigo filtro




  const handleOpenRegisterOperation = () => {
  if (openWindow && !openWindow.closed) {
    // Si la ventana ya está abierta, solo le damos el foco (la trae al frente)
    openWindow.focus();
  } else {
    // Si la ventana no está abierta, la abrimos y guardamos la referencia
    const newWindow = window.open("/bills/createBill", "_blank", "width=800, height=600");
    setOpenWindow(newWindow); // Guardamos la referencia de la ventana
    // Escuchar el evento de cierre de la ventana
    newWindow.onbeforeunload = () => {
      setOpenWindow(null); // Restablecer la referencia cuando la ventana se cierre
    };
  }
};


  const handleOpenDetailBill = (id) => {
  if (openWindow && !openWindow.closed) {
    // Si la ventana ya está abierta, solo le damos el foco (la trae al frente)
    openWindow.focus();
  } else {
    // Si la ventana no está abierta, la abrimos y guardamos la referencia
    const newWindow = window.open(`/bills/detailBill?id=${id}`, "_blank", "width=800, height=600");
    setOpenWindow(newWindow); // Guardamos la referencia de la ventana
    // Escuchar el evento de cierre de la ventana
    newWindow.onbeforeunload = () => {
      setOpenWindow(null); // Restablecer la referencia cuando la ventana se cierre
    };
  }
};

const SortIcon = () => (
  <Typography fontFamily="icomoon" fontSize="0.7rem">
    &#xe908;
  </Typography>
);
 const {
    fetch: fetchTypeBill,
    loading: loadingTypeBill,
    error: errorTypeBill,
    data: dataTypeBill,
  } = useFetch({ service: getTypeBill, init: true });

  // Llamada única al montar (opcional si init: true ya lo hace)
  useEffect(() => {
    if (!dataTypeBill) {
      fetchTypeBill();
    }
  }, []);

  // Transformación segura de los datos
  useEffect(() => {
    if (dataTypeBill?.data) {
      try {
        const options = Array.isArray(dataTypeBill.data) 
          ? dataTypeBill.data.map((typeBill) => ({
              id: typeBill.id,
              label: typeBill.description,
              value: typeBill.description,
            }))
          : [];
        setOptionsTypeBill(options);
      } catch (error) {
        console.error("Error al procesar datos:", error);
        setOptionsTypeBill([]);
      }
    } else {
      setOptionsTypeBill([]);
    }
  }, [dataTypeBill]);


  const handleClickTypeBill = (event) => {
    setAnchorElTypeBil(event.currentTarget);
  };

  const handleCloseTypeBill = () => {
    setAnchorElTypeBil(null);
  };


    const handleClickChannel = (event) => {
    setAnchorElChannel(event.currentTarget);
  };

  const handleCloseChannel = () => {
    setAnchorElChannel(null);
  };



const handleDownload = (url, fileName) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;  // Fuerza la descarga en lugar de abrir el PDF
  link.target = '_blank';   // Opcional: abre en nueva pestaña
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

  const addLineBreaks = (text, lineLength) => {
    const regex = new RegExp(`.{1,${lineLength}}`, "g");
    if (text) {
      return text.match(regex).join("\n");
    }
  };

  const columns = [
 {
  field: "typeBill",
  headerName: "Tipo",
  width: 100,
  renderCell: (params) => {
    return (
      <Box 
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center', // Centrado horizontal
          alignItems: 'center'    // Centrado vertical (opcional)
        }}
      >

<Typography
        sx={{
          fontSize: "100%",
          color: "#488B8F !important",  // !important para forzar prioridad
          fontWeight: "500 !important",
          textTransform: "uppercase",
          // Reset de estilos no deseados
          backgroundColor: "transparent !important",
          border: "none !important",
          padding: "0 !important",
          width: "auto !important",
          textAlign: "center !important"
        }}
      >
        {params.value}
      </Typography>
      </Box>
      
    );
  },
  valueGetter: (params) => {
    switch (params.value) {
      case "a7c70741-8c1a-4485-8ed4-5297e54a978a":
        return "FV-TV";
      case "29113618-6ab8-4633-aa8e-b3d6f242e8a4":
        return "ENDOSADO";
      default:
        return "FV";
    }
  },
},
 {
  field: "billId",
  headerName: "ID",
  width: 110,
  renderCell: (params) => {
    return (
      <Box display="flex" flexDirection="column">
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
        
        {params.row.integrationCode && (
          <Box
            sx={{
              backgroundColor: "#488B8F",
              color: "white",
              borderRadius: "12px",
              padding: "2px 8px",
              fontSize: "0.7rem",
              fontWeight: "bold",
              marginTop: "4px",
              display: "inline-block",
              alignSelf: "flex-start",
            }}
          >
            Autogestión
          </Box>
        )}
      </Box>
    );
  },
}, {
      field: "DateBill",
      headerName: "Emitido",
      width:81,
      renderCell: (params) => {
        return (
          <InputTitles>
            {params.value ? moment(params.value).format("DD/MM/YYYY") : ""}
          </InputTitles>
        );
      },
    },
    {
      field: "DatePayment",
      headerName: "Vence",
      width:  81,
      renderCell: (params) => {
        return (
          <InputTitles>
            {params.value ? moment(params.value).format("DD/MM/YYYY") : ""}
          </InputTitles>
        );
      },
    },
    {
      field: "Emitter",
      headerName: "Emisor",
      width: 190,
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
      field: "Payer",
      headerName: "Pagador",
      width: 190,
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
      field: "Total",
      headerName: "Total",
      width: 150,
      renderCell: (params) => {
        return (
          <CustomTooltip
            title={numberFormat.format(params.value)}
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
            <InputTitles>{numberFormat.format(params.value)}</InputTitles>
          </CustomTooltip>
        );
      },
    },

  
   {
      field: "valor_a_recibir",
      headerName: "Valor a recibir",
      width: 150,
      renderCell: (params) => {
        return (
          <CustomTooltip
            title={numberFormat.format(params.value)}
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
            <InputTitles>{numberFormat.format(params.value)}</InputTitles>
          </CustomTooltip>
        );
      },
    },
    {
      field: "currentBalance",
      headerName: "Saldo Disponible",
      width: 150,
      renderCell: (params) => {
        return (
          <CustomTooltip
            title={numberFormat.format(params.value)}
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
            <InputTitles>{numberFormat.format(params.value)}</InputTitles>
          </CustomTooltip>
        );
      },
    },
    {
      field: "associatedOperation",
      headerName: "OpId",
      width: 103,
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
            {params.value !== null ? (
              <InputTitles>{params.value}</InputTitles>
            ) : (
              <InputTitles>NO ASOCIADA</InputTitles>
            )}
          </CustomTooltip>
        );
      },
    },
    
   

    {
    field: "actions",
    headerName: "Acciones",
    width: 80,
    sortable: false,
    filterable: false,
    renderCell: (params) => {
      return (
        <>
        <Box>
 <CustomTooltip
            title="Descargar factura"
            arrow
            placement="bottom-start"
          >
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                handleDownload(params.row.file, params.row.billId);
              }}
              sx={{
                color: "#999999",
                "&:hover": {
                  backgroundColor: "#B5D1C980",
                  color: "#488B8F",
                },
              }}
            >
              <DownloadIcon />
            </IconButton>
          </CustomTooltip>
 <CustomTooltip
            title="Acciones"
            arrow
            placement="bottom-start"
            TransitionComponent={Fade}
            PopperProps={{
              modifiers: [
                {
                  name: "offset",
                  options: {
                    offset: [0, -15],
                  },
                },
              ],
            }}
          >
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                setAnchorEl(e.currentTarget);
                setSelectedRow(params.row);
              }}
              sx={{
                color: "#999999",
                "&:hover": {
                  backgroundColor: "#B5D1C980",
                  color: "#488B8F",
                },
              }}
            >
              <MoreVertIcon />
            </IconButton>
          </CustomTooltip>
        </Box>
         

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl) && selectedRow?.id === params.row.id}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <MenuItem
              onClick={() => {
                handleOpenDetailBill(selectedRow.id);
               
              }}
            >
              <ListItemIcon>
                <VisibilityIcon fontSize="small" />
              </ListItemIcon>
              Ver factura
            </MenuItem>

            <MenuItem
             onClick={() => {
    if (selectedRow?.associatedOperation != null) {
      Toast(
        "No se puede editar una factura asociada a una operación",
        "error"
      );
    } else {
      // Navegar a la página de edición con el UUID de la factura
      window.location.href = `/bills/editBill?id=${selectedRow.id}`;
    }
    setAnchorEl(null);
  }}
  sx={{
    // Opcional: cambiar el color cuando está deshabilitado
    '&.Mui-disabled': {
      opacity: 0.7,
    }
  }}
  disabled={selectedRow?.associatedOperation != null}
          >
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            Editar factura
          </MenuItem>

            <MenuItem
              onClick={() => {
                if (selectedRow.associatedOperation != null) {
                  Toast(
                    "No se puede eliminar una factura asociada a una operación",
                    "error"
                  );
                } else {
                  handleOpenDelete(selectedRow.id);
                }
                setAnchorEl(null);
              }}
            >
              <ListItemIcon>
                <DeleteIcon fontSize="small" />
              </ListItemIcon>
              Eliminar
            </MenuItem>
          </Menu>

         

          <Modal open={openDelete[0]} handleClose={handleCloseDelete}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              height="100%"
              width="100%"
            >
              <Typography
                letterSpacing={0}
                fontSize="1vw"
                fontWeight="medium"
                color="#63595C"
              >
                ¿Estás seguro que deseas eliminar
              </Typography>

              <Typography
                letterSpacing={0}
                fontSize="1vw"
                fontWeight="medium"
                color="#63595C"
                mt={2}
              >
                esta factura?
              </Typography>

              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                justifyContent="center"
                mt={4}
              >
                <GreenButtonModal onClick={handleCloseDelete}>
                  Volver
                </GreenButtonModal>
                <RedButtonModal
                  sx={{
                    ml: 2,
                  }}
                  onClick={() => {
                    handleDelete(openDelete[1]);
                  }}
                >
                  Eliminar
                </RedButtonModal>
              </Box>
            </Box>
          </Modal>
        </>
      );
    },
  },
  ];


  useEffect(() => {
    if (dataDeleteBillById) {
      Toast("Factura eliminada", "success");
      fetchBillList();
    }

    if (errorDeleteBillById) {
      Toast("Error al eliminar factura", "error");
    }
  }, [dataDeleteBillById, loadingDeleteBillById, errorDeleteBillById]);

  const dataCount = data?.count || 0;


  const [bill, setBill] = useState([]);

  useEffect(() => {
    const bill =
      data?.results?.map((bill) => ({
        id: bill.id,
        Cufe: bill.cufe,
        billId: bill.billId,
        Emitter: bill.emitterName,
        Payer: bill.payerName,
        Subtotal: bill.subTotal,
        Total: bill.total,
        typeBill: bill.typeBill,
        DateBill: bill.dateBill,
        DatePayment: bill.datePayment,
        currentBalance: bill.currentBalance,
        integrationCode: bill.integrationCode,
        payedBalance: bill.associatedOperation?.payedAmount
          ? Number(bill.associatedOperation?.payedAmount)
          : 0,
        associatedOperation: bill.associatedOperation?.opId
          ? bill.associatedOperation?.opId
          : null,
        file: bill.file,
        valor_a_recibir: (bill.subTotal + bill.iva) - (bill.ret_iva + bill.ret_ica + bill.ret_fte + bill.other_ret)
      })) || [];
    setBill(bill);
  }, [data]);

  const [openDelete, setOpenDelete] = useState([false, null]);
  const handleOpenDelete = (id) => setOpenDelete([true, id]);
  const handleCloseDelete = () => setOpenDelete([false, null]);
  const handleDelete = (id) => {
    fetchDeleteBillById(id);
    setOpenDelete([false, null]);
    setTimeout(() => {
      setBill(bill.filter((bill) => bill.id !== id));
    }, 1000);
  };

  const [openEvents, setOpenEvents] = useState([false, null]);
  const handleOpenEvents = (id) => handleEvents(id);
  const handleCloseEvents = () => setOpenEvents([false, null]);
  const handleEvents = (id) => {
    fetchGetBillEvents(id);
    setOpenEvents([true, id]);
  };
  


  //EXPORT TABLE TO EXCEL
    const handleCloseMenuCSV = () => {
    setAnchorElCSV(null);
  };

    const handleMenuClickCSV = (event) => {
    setAnchorElCSV(event.currentTarget);
  };


    /* Experimento para exportar los datos del data grid a un archivo csv que pueda ser leido por Excel*/
  const handleExportExcel = () => {
    // Obtener los datos de las filas visibles en la página actual del DataGrid
    const currentRows = bill; // Aquí, rows son los datos actuales de la página.
  
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



  const tableWrapperSx = {
    marginTop: 2,
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
  };
  
  return (
    <>
     
      <Box container display="flex" flexDirection="column" mt={-3}>
  
<Box
  display="flex"
  flexDirection="row"
  mt={2}
  alignItems="center"
  justifyContent="space-between"
  gap={3}
  sx={{
    width: '100%',
    padding: '0px 0'
  }}
>
  <Box display="flex" alignItems="center" gap={2}>
  
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
  - Consulta de facturas
  </Typography>
  </Box>
  
  {/* Tus otros elementos aquí */}
</Box>
        <Box
          container
          display="flex"
          flexDirection="row"
          mt={2}
          alignItems="center"
          justifyContent="space-between"
        >
                   <TextField
  variant="outlined"
  id="searchBar"
  size="small"
  placeholder="Buscar por ID, Emisor, pagador u operacion (OpID)..."
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
    maxWidth: '350px',
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
{/*BOTON DE POR TIPO */}
<button
  onClick={handleClickTypeBill}
  className="button-header-bill button-header-bill-primary"
>
  {selectedOptionTypeBill?.label || "Por Tipo"}
  <ArrowDropDownIcon sx={{ fontSize: "16px" }}/>  {/* Icono al final del texto */}
</button>

  {selectedOptionTypeBill && (
      <IconButton
        size="small"
        onClick={handleClearTypeBill}
        sx={{
          position: "relative", // Cambiado de absolute a relative
          marginLeft: "-30px", // Ajuste de posición
          zIndex: 1,
          color: "#488B8F",
          '&:hover': {
            backgroundColor: "#488B8F20"
          }
        }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    )}

  <Menu
    anchorEl={anchorElTypeBill}
    open={Boolean(anchorElTypeBill)}
    onClose={handleCloseTypeBill}
    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
    transformOrigin={{ vertical: "top", horizontal: "left" }}
    PaperProps={{
      sx: {
        maxHeight: 300,
        width: "250px"
      }
    }}
  >
    {loadingTypeBill ? (
      <MenuItem disabled>
        <CircularProgress size={20} />
        Cargando opciones...
      </MenuItem>
    ) : errorTypeBill ? (
      <MenuItem disabled sx={{ color: "error.main" }}>
        Error al cargar opciones
      </MenuItem>
    ) : (
      Array.isArray(optionsTypeBill) && optionsTypeBill.map((option) => (
        <MenuItem
          key={option.value}
          onClick={() => handleSelectTypeBill(option)}
          selected={selectedOptionTypeBill?.value === option.value}
          sx={{
            '&.Mui-selected': {
              backgroundColor: "#488B8F10",
              '&:hover': {
                backgroundColor: "#488B8F15"
              }
            }
          }}
        >
          <ListItemText primary={option.label} />
          {selectedOptionTypeBill?.value === option.value && (
            <CheckIcon fontSize="small" sx={{ ml: 1, color: "#488B8F" }} />
          )}
        </MenuItem>
      ))
    )}
  </Menu>

  {/*BOTON DE POR CANAL */}
         <button
   
    onClick={handleClickChannel}
   className="button-header-bill button-header-bill-primary"
  >
 
      {selectedOptionChannel?.label || "Por Canal"}
      <ArrowDropDownIcon sx={{ fontSize: "16px" }}/>  {/* Icono al final del texto */}
  </button>

  {selectedOptionChannel  && (
      <IconButton
        size="small"
        onClick={handleClearByChannel}
        sx={{
          position: "relative", // Cambiado de absolute a relative
          marginLeft: "-30px", // Ajuste de posición
          zIndex: 1,
          color: "#488B8F",
          '&:hover': {
            backgroundColor: "#488B8F20"
          }
        }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    )}

  <Menu
    anchorEl={anchorElChannel}
    open={Boolean(anchorElChannel)}
    onClose={handleCloseChannel}
    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
    transformOrigin={{ vertical: "top", horizontal: "left" }}
    PaperProps={{
      sx: {
        maxHeight: 300,
        width: "250px"
      }
    }}
  >
    {loadingTypeBill ? (
      <MenuItem disabled>
        <CircularProgress size={20} />
        Cargando opciones...
      </MenuItem>
    ) : errorTypeBill ? (
      <MenuItem disabled sx={{ color: "error.main" }}>
        Error al cargar opciones
      </MenuItem>
    ) : (
      Array.isArray(optionByChannel) && optionByChannel.map((option) => (
        <MenuItem
          key={option.value}
          onClick={() => handleSelectChannel(option)}
          selected={selectedOptionChannel ?.value === option.value}
          sx={{
            '&.Mui-selected': {
              backgroundColor: "#488B8F10",
              '&:hover': {
                backgroundColor: "#488B8F15"
              }
            }
          }}
        >
          <ListItemText primary={option.label} />
          {selectedOptionChannel ?.value === option.value && (
            <CheckIcon fontSize="small" sx={{ ml: 1, color: "#488B8F" }} />
          )}
        </MenuItem>
      ))
    )}
  </Menu>

    <AdvancedDateRangePicker
      
      className="date-picker"
      onApply={handleDateRangeApply}
      onClean={handleClear}
      
    />
       <Link href="/bills?=register" underline="none">
       <button
  className="button-header-bill button-header-bill-primary"
  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
>
  Extraer Facturas
  <span 
    style={{ 
      fontFamily: 'icomoon', 
      fontSize: '1rem', 
      color: '#FFF' 
    }}
  >
    &#xe927;
  </span>
</button>
        </Link>


        <button
  className="button-header-bill button-header-bill-primary"
  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            onClick={handleOpenRegisterOperation}
          >
          Registrar Factura Manual
      

          <span 
    style={{ 
      fontFamily: 'icomoon', 
      fontSize: '1rem', 
      color: '#FFF' 
    }}
  >
    &#xe927;
  </span>
          </button>
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
        sx={{ ...tableWrapperSx }}
      >
        <CustomDataGrid
          rows={bill}
          columns={columns}
          pageSize={15}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          disableColumnMenu

          
          sx={{
            border: '1px solid #e0e0e0',
            // Estilo para el texto en las celdas
            
            '& .MuiDataGrid-cell': {
              borderRight: '1px solid #f0f0f0',
               color: '#000000ff',
                 // Gris oscuro estándar
              '& .MuiTypography-root, & .InputTitles': { // Afecta tanto a Typography como a componentes personalizados
                fontWeight: 400, // 400 = normal (300 es light, 500 medium, 600 semibold)
                  color: 'inherit' // Hereda el color de la celda
              }
            },
            // Estilo para los encabezados de columna
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f5f5f5',
              
              borderBottom: '2px solid #e0e0e0',
              '& .MuiDataGrid-columnHeaderTitle': {
                fontWeight: 600, // Un poco más grueso que el contenido pero no bold (600+)
                 color: '#808080',
                fontSize: '0.85rem'
              }
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
                      fontWeight="600 "
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
                         No hay facturas registradas
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
                        fetchBillList({
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
                        fetchBillList({
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
    </>
  );
};
