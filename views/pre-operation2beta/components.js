import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import Link from "next/link";
import { SearchOutlined } from "@mui/icons-material";
import { Box, Button, Fade, FormControl, Grid, IconButton, InputLabel,Menu, MenuItem, InputAdornment , Select, TextField, Typography } from "@mui/material";
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
import ModalValorAGirar from "./ModalValorAGirar";
import AdvancedDateRangePicker from "./AdvancedDateRangePicker";
import { DataGrid } from "@mui/x-data-grid";

import scrollSx from "@styles/scroll";

import CustomDataGrid from "@styles/tables";
import { DeleteOperation, MassiveUpdateOperation, UpdateOperation } from "./queries";
import { id } from "date-fns/locale";
import moment from "moment";
import DocumentIcon from '@mui/icons-material/Description';
import { Tooltip } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
const sectionTitleContainerSx = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "rigth",
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
      Inputprops={{
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
    
      <button className="button"
        onClick={handleOpenRegisterOperation}
       
      >
        
          Registrar operacion
        
       
        </button>
    
  );
};



const EditPreOperation = (props) => {
  const { ...rest } = props;
 // Función que maneja la apertura de la ventana de registro de operación

 const [anchorEl, setAnchorEl] = useState(null); // Estado para controlar el menú
 const openMenu = Boolean(anchorEl); // Determina si el menú está abierto

 //Estado de la pestana de registro de operacion

 const [openWindow, setOpenWindow] = useState(null); // Estado para almacenar la referencia de la ventana
 const handleOpenEditPreOperation = () => {
  if (openWindow && !openWindow.closed) {
    // Si la ventana ya está abierta, solo le damos el foco (la trae al frente)
    openWindow.focus();
  } else {
    // Si la ventana no está abierta, la abrimos y guardamos la referencia
    const newWindow = window.open("/pre-operations2beta/editPreOp", "_blank", "width=800, height=600");
    setOpenWindow(newWindow); // Guardamos la referencia de la ventana
    // Escuchar el evento de cierre de la ventana
    newWindow.onbeforeunload = () => {
      setOpenWindow(null); // Restablecer la referencia cuando la ventana se cierre
    };
  }
};
  return (
    <MenuItem onClick={() => handleOpenEditPreOperation()}>
                Editar
              </MenuItem>
    
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

const SellOrderButton = (props) => {
  const { ...rest } = props;

  return (
    <Link href="/operations/electronicSignature" underline="none">
      <button className="button">
     
          Notificaciones de Compra
       
        </button>
    </Link>
  );
};

const formatNumber = (value) => new Intl.NumberFormat("es-ES").format(value || 0);
export const OperationsComponents = ({
  rows,
  filtersHandlers,
  getOperationsFetch,
  page,
  setPage,
  dataCount,
}) => {
  const calcs = rows[0]?.calcs;

  const [other, setOther] = useState(calcs?.others || 0);
  const [tempFilters, setTempFilters] = useState({ ...filtersHandlers.value });

  const [open, setOpen] = useState([false, ""]);
  const [rowCount, setRowCount] = useState(dataCount);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [anchorElCSV, setAnchorElCSV] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const openMenuCSV = Boolean(anchorElCSV);
  const [openWindow, setOpenWindow] = useState(null);
  const [openModal, setOpenModal] = useState(false);
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




  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [selectedOperation, setSelectedOperation] = useState(null);
  const [currentStatus, setCurrentStatus] = useState("");
  const [operationLabel, setOperationLabel] = useState("");
  const [operationToDelete, setOperationToDelete] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

// En el componente padre que contiene el DataGrid
const [menuState, setMenuState] = useState({
  anchorEl: null,
  currentRowId: null,
  currentStatus: null
});

const handleMenuClick = (event, rowId, rowStatus) => {
  event.stopPropagation();
  setMenuState({
    anchorEl: event.currentTarget,
    currentRowId: rowId,
    currentStatus: rowStatus
  });
};

const handleCloseMenu = () => {
  setMenuState({ anchorEl: null, currentRowId: null, currentStatus: null });
};
  const handleActionClick = (action, operation) => {
    if (action === "Actualizar Estado") {
      setSelectedOperation(operation.id); // Establecer el ID de la operación
      setCurrentStatus(operation.estado);  // Establecer el estado actual
      setOperationLabel(`Factura: ${operation.factura_fraccion}`); // Establecer el número de factura/fracción
      setOpenUpdateModal(true); // Abrir el modal
    }
  };
  




  const handleOpen = (id) => {
    setOpen([true, id]);
  };


  const EditPreOperation = ({ id, status }) => {
    const [openWindow, setOpenWindow] = useState(null);
  
    const handleOpenEditPreOperation = (e) => {
      e.stopPropagation();
      if (!id) return;
  
      if (openWindow && !openWindow.closed) {
        openWindow.focus();
        return;
      }
  
      let url;
      switch(status) {
        case 0: 
          url = `/pre-operations2beta/editPreOp?id=${id}`;
          break;
        case 2: 
          url = `/pre-operations2beta/editPreOp?id=${id}&previousDeleted=true`;
          break;
        default:
          return;
      }
  
      const newWindow = window.open(url, '_blank', 'width=800,height=600');
      if (newWindow) {
        setOpenWindow(newWindow);
        newWindow.onbeforeunload = () => setOpenWindow(null);
      }
    };
  
    return (
      <Typography
        onClick={handleOpenEditPreOperation}
        sx={{
          color: 'primary.main',
          cursor: 'pointer',
          fontWeight: 500,
          fontSize: '0.875rem',
          '&:hover': {
            color: 'primary.dark',
           
          },
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          padding: '4px 8px',
          borderRadius: '4px',
          transition: 'all 0.2s ease',
          '&:active': {
            transform: 'scale(0.98)',
          }
        }}
      >
       Editar
      </Typography>
    );
  };
  

  const DetailPreOperation = ({ id }) => {
    const [openWindow, setOpenWindow] = useState(null);
  
    const handleOpenDetailPreOperation = () => {
      if (openWindow && !openWindow.closed) {
        openWindow.focus();
      } else {
        const newWindow = window.open(
          `/pre-operations2beta/detailPreOp?id=${id}`,
          "_blank",
          "width=800,height=600"
        );
        setOpenWindow(newWindow);
        newWindow.onbeforeunload = () => setOpenWindow(null);
      }
    };


  
    
  
    return (
      <Typography
        
        fontSize="1.9rem"
        color="#999999"
        borderRadius="5px"
        sx={{
          color: 'primary.main',
          cursor: 'pointer',
          fontWeight: 500,
          fontSize: '0.875rem',
          '&:hover': {
            color: 'primary.dark',
            
          },
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          padding: '4px 8px',
          borderRadius: '4px',
          transition: 'all 0.2s ease',
          '&:active': {
            transform: 'scale(0.98)',
          }
        }}
        onClick={handleOpenDetailPreOperation}
      >
        Visualización
      </Typography>
    );
  };




  
  const DeletePreOperation = ({ id, status }) => {

  
   

  
    return (
      <>
      <CustomTooltip
        title="Eliminar"
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
        <Typography
         
          fontSize="1.9rem"
          color="#999999"
          borderRadius="5px"
          sx={{
            color: 'primary.main',
            cursor: 'pointer',
            fontWeight: 500,
            fontSize: '0.875rem',
            '&:hover': {
              color: 'primary.dark',
              
            },
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '4px 8px',
            borderRadius: '4px',
            transition: 'all 0.2s ease',
            '&:active': {
              transform: 'scale(0.98)',
            }
          }}
          onClick={() => {
            if ( status === 1) {
              Toast(
                "No se puede eliminar una operación aprobada",
                "error"
              );
            } else {
              handleOpenDelete(id);
            }
          }}
        >
        Eliminar
        </Typography>
      </CustomTooltip>
     
    </>
    );
  };

  const UpdateStatusOperation = ({ id}) => {
    
  
   
  
  
    return (
      <CustomTooltip
          title="Actualizar estado"
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
          <IconButton onClick={() => handleOpen(id)}>
            <i
              className="fa-regular fa-check"
              style={{
                fontSize: "1.3rem",
                color: "#488B8F",
                borderRadius: "5px",

                "&:hover": {
                  backgroundColor: "#B5D1C980",
                  color: "#488B8F",
                },
              }}
            ></i>
          </IconButton>
        </CustomTooltip>
    );
  };

  const handleMenuClickCSV = (event) => {
    setAnchorElCSV(event.currentTarget);
  };
  
  const handleCloseMenuCSV = () => {
    setAnchorElCSV(null);
  };


  const handleExportXML = () => {
    alert("Exportar como XML");
    handleCloseMenu();
  };

  const handleClearSearch = () => {
    setSearch("");
  };

  const handleOpenModal = () => {
    console.log("Datos seleccionados para el modal:", selectedData);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleClose = () => {
    setOpen([false, ""]);
  };

  const {
    fetch: fetchDeleteOperation,
    loading: loadingDeleteOperation,
    error: errorDeleteOperation,
    data: dataDeleteOperation,
  } = useFetch({ service: DeleteOperation, init: false });

  
  console.log(rows)

  console.log(calcs)
  useEffect(() => {
    if (dataDeleteOperation) {
      Toast("Operación eliminada", "success");
    }

    if (errorDeleteOperation) {
      Toast("Error al eliminar la operación", "error");
    }

    if (loadingDeleteOperation) {
      Toast("Eliminando operación", "info");
    }
  }, [dataDeleteOperation, errorDeleteOperation, loadingDeleteOperation]);

  const {
    fetch: fetchUpdateOperation,
    loading: loadingUpdateOperation,
    error: errorUpdateOperation,
    data: dataUpdateOperation,
  } = useFetch({ service: UpdateOperation, init: false });

  const {
    fetch: fetchUpdateOperationMassive,
    loading: loadingUpdateOperationMassive,
    error: errorUpdateOperationMassive,
    data: dataUpdateOperationMassive,
  } = useFetch({ service: MassiveUpdateOperation, init: false });

  const [operationState, setOperationState] = useState(null);
  const handleOperationState = (e) => {
    setOperationState(e.target.value);
  };


  // Función que maneja la acción de eliminar
  const handleDeleteOperation = (operationId) => {
    setRows(rows.filter(row => row.id !== operationId)); // Filtrar las filas y eliminar la operación
  };

  const handleActionClickdelete = (action, operation) => {
    if (action === "Eliminar") {
      setOperationToDelete(operation); // Establecemos la operación seleccionada para eliminar
      setOpenDeleteModal(true); // Abrimos el modal de confirmación
    }
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false); // Cerramos el modal sin hacer nada
    setOperationToDelete(null); // Limpiar la operación seleccionada
  };


  const handleUpdateClick = (e) => {
    fetchUpdateOperationMassive({
      id: open[1],
      status: operationState,
      massive: false,
      massiveByInvestor: false,
      billCode: "",
    });
    getOperationsFetch();
  };
  const handleUpdateAllClick = (e) => {
    fetchUpdateOperation({
      id: open[1],
      status: operationState,
      massive: true,
      massiveByInvestor: false,
      billCode: "",
    });
    getOperationsFetch();
  };

  useEffect(() => {
    if (dataUpdateOperation) {
      Toast("Operacion actualizada", "success");
      handleClose();
    }
    if (loadingUpdateOperation == true) {
      Toast("Cargando..", "loading");
    }

    if (errorUpdateOperation) {
      typeof errorUpdateOperation.message === "object"
        ? Toast(`${Object.values(errorUpdateOperation.message)}`, "error")
        : Toast(`${errorUpdateOperation.message}`, "error");
    }
  }, [dataUpdateOperation, loadingUpdateOperation, errorUpdateOperation]);

  useEffect(() => {
    if (dataUpdateOperationMassive) {
      Toast("Operaciones actualizadas", "success");
      handleClose();
    }
    if (loadingUpdateOperationMassive == true) {
      Toast("Cargando..", "loading");
    }

    if (errorUpdateOperationMassive) {
      typeof errorUpdateOperationMassive.message === "object"
        ? Toast(
            `${Object.values(errorUpdateOperationMassive.message)}`,
            "error"
          )
        : Toast(`${errorUpdateOperationMassive.message}`, "error");
    }
  }, [
    dataUpdateOperationMassive,
    loadingUpdateOperationMassive,
    errorUpdateOperationMassive,
  ]);

  const formatOptions = {
    style: "currency",
    currency: "USD",
  };
  const numberFormat = new Intl.NumberFormat("en-US", formatOptions);
  console.log(page)
  const columns = [
    {
      field: "status",
      headerName: "Estado",
      width: 160,
      renderCell: (params) => {
        console.log(params.row); 
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
            badgeClass = "badge";
        }
        
        return <span className={badgeClass}>{statusText}</span>;
      },
    },
    
    { field: "opId", headerName: "ID", width: 80 },
    { field: "opDate", headerName: "Creado el", width: 110 },
    { field: "billFraction", headerName: "Fracción", width: 90 },
    { field: "billData", headerName: "# Factura", width: 90 },
    { field: "emitterName", headerName: "Emisor", width: 200 },
    { field: "investorName", headerName: "Inversionista", width: 200 },
    { field: "payerName", headerName: "Pagador", width: 150 },
    { field: "discountTax", headerName: "Tasa Desc.", width: 90 },
    { field: "payedPercent", headerName: "% Desc.", width: 90 }, // Nueva columna
    { field: "investorTax", headerName: "Tasa Inv.", width: 90 },
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
    { field: "probableDate", headerName: "Fecha Probable", width: 110 },
    { field: "opExpiration", headerName: "Fecha Fin", width: 110 },
   
    {
      field: "Acciones",
      headerName: "Acciones",
      width: 90,
      renderCell: (params) => {
        const isOperationApproved = params.row.estado === "Aprobado";
        
        return (
          <div style={{ display: "flex", justifyContent: "center" }}>
            {/* Botón de Documento */}
            <Tooltip title="Crear o ver resumen de negociación" arrow>
              <IconButton
                onClick={() => console.log("Redirigiendo a:", params.row.id)}
                style={{ marginRight: 10 }}
              >
                <DocumentIcon />
              </IconButton>
            </Tooltip>
    
            {/* Botón de Menú */}
            <IconButton 
              onClick={(e) => handleMenuClick(e, params.row.id, params.row.status)}
              className="context-menu"
            >
              <MoreVertIcon />
            </IconButton>
    
            {/* Menú Contextual */}
            <Menu
              anchorEl={menuState.anchorEl}
              open={Boolean(menuState.anchorEl)}
              onClose={handleCloseMenu}
            >
              <MenuItem onClick={(e) => {
                e.stopPropagation();
                handleCloseMenu();
              }}>
                <UpdateStatusOperation id={menuState.currentRowId} />
              </MenuItem>
    
              <MenuItem onClick={(e) => {
                e.stopPropagation();
                handleCloseMenu();
              }}>
                <DetailPreOperation id={menuState.currentRowId} />
              </MenuItem>
    
              <MenuItem onClick={(e) => {
                e.stopPropagation();
                handleCloseMenu();
              }}>
                <EditPreOperation 
                  id={menuState.currentRowId} 
                  status={menuState.currentStatus} 
                />
              </MenuItem>
    
              {!isOperationApproved && (
                <MenuItem onClick={(e) => {
                  e.stopPropagation();
                  handleCloseMenu();
                }}>
                  <DeletePreOperation 
                    id={menuState.currentRowId} 
                    status={menuState.currentStatus} 
                  />
                </MenuItem>
              )}
            </Menu>
          </div>
        );
      }
    },
    
   
  ];


  const handleTextFieldChange = async (evt, field) => {
    setTempFilters({ ...tempFilters, [field]: evt.target.value });
  };

  const updateFilters = (value, field) => {
    filtersHandlers.set({ ...tempFilters, [field]: value });
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
          Consulta de Pre-operaciones
        </Typography>
        <Box sx={{ ...sectionTitleContainerSx }}>
        <button className="button">
               
                  Operaciones
                
                </button>
              <SellOrderButton /> 
              </Box>
      </Box>

      <Box sx={{ ...filtersContainerSx }}>
      <div className="search-and-actions-container">
        <input
          type="text"
          placeholder="Buscar o filtrar resultados..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          inputprops={{
            endAdornment: search && (
              <InputAdornment position="end">
                <IconButton onClick={handleClearSearch}>
                  <ClearIcon sx={{ color: "#488b8f" }} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          className="search-bar"
        />
        <Box display="flex" alignSelf="flex-end" ml="auto" mb={1}>
          
         
          <Link href="/pre-operations2beta/byOp" underline="none">
          <button className="button">
             
                Ver por Grupos
              

              
              </button>
          </Link>
          <div>
          <button className="button" onClick={handleOpenModal}>Valor a Girar</button>
          <ModalValorAGirar open={openModal} handleClose={handleCloseModal}  />
          
        </div>
          <AdvancedDateRangePicker
          onDateRangeChange={(range) => setDateRange(range)}
          className="date-picker"
        />
          
        <RegisterButton />
        </Box>
        
        
       
      
        <IconButton onClick={handleMenuClickCSV} className="context-menu">
          <MoreVertIcon />
        </IconButton>
        <Menu anchorEl={anchorElCSV} open={openMenuCSV} onClose={handleCloseMenuCSV}>
        <MenuItem onClick={handleExportExcel}>
          Exportar a CSV
        </MenuItem>
        </Menu>
        
      </div>

        
        

        
      </Box>
      

      <Grid container spacing={1.5} sx={{ ...entriesGrid }}>
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
      </Grid>


      

      <Box sx={{ ...tableWrapperSx }}>
      <CustomDataGrid
          rows={rows}
          columns={columns}
          pageSize={15}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          disableColumnMenu
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
              >
                No hay pre-operaciones registradas
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
                        console.log('e')
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
                      console.log('f')
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
      <TitleModal
        open={open[0]}
        handleClose={handleClose}
        container
        Sx={{
          width: "25%",
          height: "30%",
        }}
        title={"Actualizar estado"}
      >
        <Box display="flex" flexDirection="column" mt={3} sx={{ ...scrollSx }}>
          <FormControl variant="standard" fullWidth>
            <InputLabel
              sx={{
                fontSize: "1rem",
                fontWeight: "600",
                color: "#488B8F",
                "&.Mui-focused": {
                  color: "#488B8F",
                },
              }}
              id="demo-simple-select-label"
            >
              Estado
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="operationStatus"
              value={operationState}
              label="Estado"
              onChange={handleOperationState}
              sx={{ ...selectSx }}
            >
              <MenuItem value={1}>Aprobada</MenuItem>
              <MenuItem value={2}>Rechazada</MenuItem>
            </Select>
          </FormControl>

          <Box display="flex" justifyContent="center">
            <MuiButton
              variant="standard"
              onClick={handleUpdateClick}
              sx={{
                mb: 2,
                boxShadow: "none",
                borderRadius: "4px",
              }}
            >
              <Typography fontSize="80%" fontWeight="bold">
                Actualizar
              </Typography>
              <Typography
                fontFamily="icomoon"
                sx={{
                  color: "#fff",
                  ml: 2,
                  fontSize: "medium",
                }}
              >
                &#xe91f;
              </Typography>
            </MuiButton>
            <MuiButton
              variant="standard"
              onClick={handleUpdateAllClick}
              sx={{
                mb: 2,
                ml: 2,
                boxShadow: "none",
                borderRadius: "4px",
              }}
            >
              <Typography fontSize="80%" fontWeight="bold">
                Actualizar todos
              </Typography>
            </MuiButton>
          </Box>
        </Box>
      </TitleModal>
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
            ¿Estás seguro que deseas la operación?
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
              onClick={() => handleDelete(openDelete[1])}
            >
              Eliminar
            </RedButtonModal>
          </Box>
        </Box>
      </Modal>
      {/* Modal de confirmación para actualizar estados*/}
      {/* <Modal open={openDelete[0]} handleClose={handleCloseDelete}>
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
            ¿Estás seguro que deseas la operación?
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
              onClick={() => handleDelete(openDelete[1])}
            >
              Eliminar
            </RedButtonModal>
          </Box>
        </Box>
      </Modal> */}
      <ToastContainer
        position="top-right"
        autoClose={50000}
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