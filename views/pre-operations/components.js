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
import ModalValorAGirar from "../../shared/components/ModalValorAGirar";
import AdvancedDateRangePicker from "../../shared/components/AdvancedDateRangePicker";
import { DataGrid } from "@mui/x-data-grid";
import ClearIcon from "@mui/icons-material/Clear";
import scrollSx from "@styles/scroll";
import CircularProgress from '@mui/material/CircularProgress';
import CustomDataGrid from "@styles/tables";
import { DeleteOperation, MassiveUpdateOperation, UpdateOperation ,GetSummaryList} from "./queries";
import { id } from "date-fns/locale";
import moment from "moment";
import DocumentIcon from '@mui/icons-material/Description';
import { Tooltip } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { T } from "@formulajs/formulajs";


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
    const newWindow = window.open("/pre-operations/manage", "_blank", "width=800, height=600");
    setOpenWindow(newWindow); // Guardamos la referencia de la ventana
    // Escuchar el evento de cierre de la ventana
    newWindow.onbeforeunload = () => {
      setOpenWindow(null); // Restablecer la referencia cuando la ventana se cierre
    };
  }
};
  return (
    
    <button className="button-header-preop button-header-preop-primary"
        onClick={handleOpenRegisterOperation}
       
      >
        
          Registrar operacion
        
       
        </button>
    
  );
};





const SellOrderButton = (props) => {
  const { ...rest } = props;

  return (
    <Link href="/operations/electronicSignature" underline="none">
      <button className="button-header-preop-title">
     
          Notificaciones de Compra
       
        </button>
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
 loading
}) => {
 // Nuevo estado para controlar cuando se aplica un filtro
  const [filterApplied, setFilterApplied] = useState(false);
// Hooks
  const {
    fetch: fetch,
    loading: loadingNegotiationSummary,
    error: error,
    data: data,
  } = useFetch({
    service: GetSummaryList,
    init: true,
  });
 

   // Estado para almacenar qué operaciones tienen resumen
  const [haveNegotiationSummary, setHaveNegotiationSummary] = useState({});
  // Estado para evitar múltiples verificaciones en la misma página
  const [checkedPages, setCheckedPages] = useState(new Set());

  // Hook para verificar resúmenes
  const checkNegotiationSummaries = async (rowsToCheck) => {
    const results = {};
    
    for (const row of rowsToCheck) {
      const opId = row.opId;
      
      try {
        await GetSummaryList(opId);
        console.log('aaa')
        results[opId] = true; // Tiene resumen
      } catch (error) {
        if (error.response?.status === 500) {
          results[opId] = false; // No tiene resumen
        } else {
          console.error(`Error verificando resumen para opId ${opId}:`, error);
          results[opId] = false;
        }
      }
    }
    
    return results;
  };

  // Efecto que se ejecuta cuando cambia la página o las filas
    useEffect(() => {
    if (rows.length > 0) {
      // Si hay filtros activos, verificamos siempre (sin usar checkedPages)
      const hasActiveFilters = Object.values(filtersHandlers.value).some(
        val => val !== null && val !== "" && val !== undefined
      );
      
      if (hasActiveFilters || !checkedPages.has(page)) {
        checkNegotiationSummaries(rows).then(results => {
          setHaveNegotiationSummary(prev => ({ ...prev, ...results }));
          if (!hasActiveFilters) {
            setCheckedPages(prev => new Set(prev).add(page));
          }
        });
      }
    }
  }, [page, rows, checkedPages, filtersHandlers.value]);

  console.log(haveNegotiationSummary)
  const calcs = rows[0]?.calcs;

  const [other, setOther] = useState(calcs?.others || 0);
  const [tempFilters, setTempFilters] = useState({ ...filtersHandlers.value });

  const [open, setOpen] = useState([false, ""]);
  const [rowCount, setRowCount] = useState(dataCount);
  const [pageSize, setPageSize] = useState(10);

  const [search, setSearch] = useState("");
 // Supongamos que `dateRange` es un estado que mantiene el rango de fechas seleccionado
const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });
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
          url = `/pre-operations/editPreOp?id=${id}`;
          break;
        case 2: 
          url = `/pre-operations/editPreOp?id=${id}&previousDeleted=true`;
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
          color:"#488B8F",
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
          `/pre-operations/detailPreOp?id=${id}`,
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
        color="#488B8F"
        borderRadius="5px"
        sx={{
          color: "#488B8F",
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
          color="#488B8F"
          borderRadius="5px"
          sx={{
            color: "#488B8F",
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
      <>
      
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
        
            <Typography
              fontSize="1.9rem"
              color="#488B8F"
              borderRadius="5px"
              onClick={() => handleOpen(id)}
              sx={{
                color: "#488B8F",
                cursor: 'pointer',
                fontWeight: 500,
                fontSize: '0.875rem',
                '&:hover': {
                  color: 'primary.dark',
                  
                },
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '2px 8px',
                borderRadius: '4px',
                transition: 'all 0.2s ease',
                '&:active': {
                  transform: 'scale(0.98)',
                }
              }}>
          Actualizar

              </Typography>
            
          
        </CustomTooltip></>
      
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

  

  const mockData =rows[0]?.calcs;

  const [selectedData, setSelectedData] = useState(mockData);

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

const handleOpenNegotiationSummary = (id, opId,hasSummary) => {
  // Verificar si ya tenemos información sobre si existe resumen para este opId

  console.log(`Verificando resumen para opId ${opId}:`, hasSummary);
  // Construir la URL basada en si existe o no el resumen
  let url;
  if (hasSummary) {
    // Si existe, usar la URL de modificación con los parámetros invertidos
    url = `/administration/negotiation-summary?modify&id=${id}&opId=${opId}`;
  } else {
    // Si no existe o no sabemos, usar la URL de registro normal
    url = `/administration/negotiation-summary?register&id=${id}`;
  }

  if (openWindow && !openWindow.closed) {
    // Si la ventana ya está abierta, solo le damos el foco
    openWindow.focus();
  } else {
    // Si la ventana no está abierta, la abrimos con la URL correspondiente
    const newWindow = window.open(url, "_blank", "width=800,height=600");
    setOpenWindow(newWindow);
    
    // Escuchar el evento de cierre de la ventana
    newWindow.onbeforeunload = () => {
      setOpenWindow(null);
      
      // Cuando se cierra la ventana, podríamos querer actualizar el estado
      // de si tiene resumen o no (opcional)
      if (hasSummary === undefined) {
        // Si no sabíamos si tenía resumen, verificamos ahora
        checkSingleNegotiationSummary(opId);
      }
    };
  }
};

// Función auxiliar para verificar un solo resumen
const checkSingleNegotiationSummary = async (opId) => {
  try {
    await GetSummaryList(opId);
    setHaveNegotiationSummary(prev => ({ ...prev, [opId]: true }));
  } catch (error) {
    if (error.response?.status === 500) {
      setHaveNegotiationSummary(prev => ({ ...prev, [opId]: false }));
    } else {
      console.error(`Error verificando resumen para opId ${opId}:`, error);
    }
  }
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
    
    { field: "opId", headerName: "ID", width:55 },
   // { field: "created_at", headerName: "Creado el", width: 93,  valueFormatter: (params) => {
      // if (!params.value) return '';
      // Extrae directamente las partes de la fecha ISO (evita conversión local)
     //  const [year, month, day] = params.value.split('T')[0].split('-');
    //  return `${day}/${month}/${year}`; // Formato dd/mm/YYYY
    //}},
    { field: "opDate", headerName: "Fecha Op", width: 100,valueFormatter: (params) => {
      if (!params.value) return '';
      const [year, month, day] = params.value.split('T')[0].split('-');
      return `${day}/${month}/${year}`;
    }},
    { field: "billFraction", headerName: "Fracción", width: 60},
    { field: "billData", headerName: "# Factura", width: 100 },
    { field: "emitterName", headerName: "Emisor", width: 230 },
    { field: "investorName", headerName: "Inversionista", width: 200 },
    { field: "payerName", headerName: "Pagador", width: 150 },
    { field: "discountTax", headerName: "Tasa Desc", width: 60 },
    { field: "payedPercent", headerName: "% Desc", width: 40}, // Nueva columna
    { field: "investorTax", headerName: "Tasa Inv", width: 40 },
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
    { field: "probableDate", headerName: "Fecha Probable", width: 93 ,  valueFormatter: (params) => {
      if (!params.value) return '';
      // Extrae directamente las partes de la fecha ISO (evita conversión local)
      const [year, month, day] = params.value.split('T')[0].split('-');
      return `${day}/${month}/${year}`; // Formato dd/mm/YYYY
    }},
    { field: "opExpiration", headerName: "Fecha Fin", width: 94 ,  valueFormatter: (params) => {
      if (!params.value) return '';
      // Extrae directamente las partes de la fecha ISO (evita conversión local)
      const [year, month, day] = params.value.split('T')[0].split('-');
      return `${day}/${month}/${year}`; // Formato dd/mm/YYYY
    }},
   
    {
      field: "Acciones",
      headerName: "Acciones",
      width: 90,
      renderCell: (params) => {
        const isOperationApproved = params.row.estado === "Aprobado";
       const hasSummary = haveNegotiationSummary[params.row.opId];
      
        return (
          <div style={{ display: "flex", justifyContent: "center" }}>
            {/* Botón de Documento */}
            <Tooltip 
              title={hasSummary ? "Ver resumen de negociación" : "Crear resumen de negociación"} 
              arrow
            >
              <IconButton
                onClick={() => handleOpenNegotiationSummary(params.row.opId,params.row.id,hasSummary)}
                style={{ marginRight: 10, position: 'relative' }}
              >
               <DocumentIcon sx={{ color: hasSummary ? "#488B8F" : "action.disabled" }} />
                {hasSummary === undefined && (
                  <CircularProgress 
                    size={16} 
                    sx={{ 
                      position: 'absolute',
                     
                    }} 
                  />
                )}
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
  const handleTextFieldChange = (evt) => {
    setSearch(evt.target.value);
  };

  const handleDateRangeApply = (dateRange) => {
    // Actualiza solo las fechas manteniendo otros filtros

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
      const newFilters = { 
        ...tempFilters, 
        [field]: value,
        startDate: tempFilters.startDate,
        endDate: tempFilters.endDate
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

    // Filtramos y actualizamos los filtros
    filtersHandlers.set({
      ...tempFilters,
      ...newFilters,
      startDate: tempFilters.startDate, // Conserva fechas
      endDate: tempFilters.endDate
    });

        setFilterApplied(true);
  };
  
  
      // Modificar el useEffect para resetear checkedPages cuando se aplica un filtro
  useEffect(() => {
    if (filterApplied) {
      setCheckedPages(new Set());
      setFilterApplied(false);
    }
  }, [filterApplied]);
  
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
          Pre-operaciones
        </Typography>
        <Box sx={{ ...sectionTitleContainerSx }}>
        <Link href="/operations" passHref>
  <button className="button-header-preop-title">
    Operaciones
  </button>
</Link>
              <SellOrderButton /> 
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
  

    <button className="button-header-preop" onClick={handleOpenModal}>Valor a Girar</button>
    <ModalValorAGirar open={openModal} handleClose={handleCloseModal} data={mockData} />

    <AdvancedDateRangePicker
      
      className="date-picker"
      onApply={handleDateRangeApply}
      onClean={handleClear}
      
    />

    <RegisterButton />

    <IconButton onClick={handleMenuClickCSV} className="context-menu">
      <MoreVertIcon />
    </IconButton>
    <Menu anchorEl={anchorElCSV} open={openMenuCSV} onClose={handleCloseMenuCSV}>
      <MenuItem onClick={handleExportExcel}>Exportar a CSV</MenuItem>
    </Menu>
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
        overflow: 'visible', // Muestra todo el contenido al hacer hover
        zIndex: 1,
        position: 'relative'
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