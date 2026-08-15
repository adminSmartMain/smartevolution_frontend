import { useEffect, useMemo, useState, useRef } from "react";
import { ToastContainer } from "react-toastify";
import Link from "next/link";
import {
  Home as HomeIcon,} from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import DocumentIcon from '@mui/icons-material/Description';

import CircularProgress from '@mui/material/CircularProgress';
import  ArticleIcon from "@mui/icons-material/Article"
import TuneIcon from "@mui/icons-material/Tune";
import Chip from "@mui/material/Chip";
import { Box, Button, Fade, FormControl, Grid, IconButton, InputLabel,Menu, MenuItem, InputAdornment , Select, TextField, Typography } from "@mui/material";
import { Toast } from "@components/toast";
import { useFetch } from "@hooks/useFetch";
import CustomTooltip from "@styles/customTooltip";
import ModalValorAGirar from "../../shared/components/ModalValorAGirar";
import AdvancedDateRangePicker from "../../shared/components/AdvancedDateRangePicker";
import ClearIcon from "@mui/icons-material/Clear";
import {
  DeleteOperation,
  MassiveUpdateOperation,
  UpdateOperation,
  GetSummaryList,
  getMassiveOperationDrafts,
  deleteMassiveOperationDraft,
} from "./queries";
import moment from "moment";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CheckIcon from "@mui/icons-material/Check";
import { Breadcrumbs} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { PreOperationsTable } from "./tables/preoperationsTable";
import { PreOperationsDraftTable } from "./tables/preOperationsDraftTable";


export const OperationsComponents = ({
  rows,
  filtersHandlers,
  getOperationsFetch,
  page,
  setPage,
  dataCount,
 loading
}) => {


  const [draftRows, setDraftRows] = useState([]);
  const [loadingDrafts, setLoadingDrafts] = useState(false);
  
  const [filterApplied, setFilterApplied] = useState(false);
  const [anchorElFilters, setAnchorElFilters] = useState(null);
  const openFiltersMenu = Boolean(anchorElFilters);
  const [anchorElRegister, setAnchorElRegister] = useState(null);
  const openRegisterMenu = Boolean(anchorElRegister);
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
  const [anchorElStatus, setAnchorElStatus] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [haveNegotiationSummary, setHaveNegotiationSummary] = useState({});
  // Estado para evitar múltiples verificaciones en la misma página
  const [checkedPages, setCheckedPages] = useState(new Set());
 const [operationState, setOperationState] = useState(null);
  // Opciones estáticas de estados
  const statusOptions = [
    { value: 0, label: "Por Aprobar", badgeClass: "badge por-aprobar" },
    
    { value: 2, label: "Rechazada", badgeClass: "badge rechazado" },

  
  ];
  const [activeTab, setActiveTab] = useState("all");
  

  const {
    fetch: fetchDeleteOperation,
    loading: loadingDeleteOperation,
    error: errorDeleteOperation,
    data: dataDeleteOperation,
  } = useFetch({ service: DeleteOperation, init: false });

  

  const {
    fetch: fetch,
    loading: loadingNegotiationSummary,
    error: error,
    data: data,
  } = useFetch({
    service: GetSummaryList,
    init: true,
  });
 
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


  
  const handleOpenRegisterMenu = (event) => {
    setAnchorElRegister(event.currentTarget);
  };

  const handleCloseRegisterMenu = () => {
    setAnchorElRegister(null);
  };
  const handleOpenFilters = (event) => {
  setAnchorElFilters(event.currentTarget);
  };

  const handleCloseFilters = () => {
    setAnchorElFilters(null);};


const openedWindowsRef = useRef({});

const openOrFocusWindow = (
  key,
  url,
  features = "width=1200,height=800"
) => {
  const existingWindow = openedWindowsRef.current[key];

  if (existingWindow && !existingWindow.closed) {
    existingWindow.focus();
    return existingWindow;
  }

  const newWindow = window.open(url, key, features);

  if (newWindow) {
    openedWindowsRef.current[key] = newWindow;

    newWindow.onbeforeunload = () => {
      if (openedWindowsRef.current[key] === newWindow) {
        delete openedWindowsRef.current[key];
      }
    };
  }

  return newWindow;
};


const handleOpenRegisterOperation = () => {
  handleCloseRegisterMenu();

  const newWindow = openOrFocusWindow(
    "registerOperation",
    "/pre-operations/manage",
    "width=1200,height=800"
  );

  if (!newWindow) {
    Toast("El navegador bloqueó la ventana emergente", "error");
  }
};
const handleOpenRegisterMassiveOperation = () => {
  handleCloseRegisterMenu();

  const newWindow = openOrFocusWindow(
    "registerMassiveOperation",
    "/pre-operations/registerMassiveOperation",
    "width=1200,height=800"
  );

  if (!newWindow) {
    Toast("El navegador bloqueó la ventana emergente", "error");
  }
};



  // Hook para verificar resúmenes
  const checkNegotiationSummaries = async (rowsToCheck) => {
    const results = {};
    
    for (const row of rowsToCheck) {
      const opId = row.opId;
      
      try {
        await GetSummaryList(opId);
  
        results[opId] = true; // Tiene resumen
      } catch (error) {
        if (error.response?.status === 500) {
          results[opId] = false; // No tiene resumen
        } else {
          
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





  const handleClickStatus = (event) => {
    setAnchorElStatus(event.currentTarget);
  };

  const handleCloseStatus = () => {
    setAnchorElStatus(null);
  };



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



  const handleClearSearch = () => {
    const newFilters = {
      ...filtersHandlers.value,  // Mantiene todos los filtros actuales
      opId: "",                  // Limpia solo estos campos
      billId: "",
      investor: "",
      
    };
    
    filtersHandlers.set(newFilters);  // Actualiza el estado conservando las fechas
    setSearch("");                    // Limpia el estado local de búsqueda si existe
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleClose = () => {
    setOpen([false, ""]);
  };



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


 
  const handleOperationState = (e) => {
    setOperationState(e.target.value);
  };



    const handleSelectStatus = (status) => {
    setSelectedStatus(status);
    console.log(status.value)
    handleCloseStatus();
    // Actualiza los filtros globales
    console.log(status?.value ?? "")
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


  const handleUpdateClick = (e) => {
  fetchUpdateOperationMassive({
    id: open[1],
    status: operationState,
    massive: false,
    massiveByInvestor: false,
    billCode: "",
  }).then(() => {  // Espera a que termine la actualización
    getOperationsFetch();  // Luego actualiza la lista
  });
};

const handleUpdateAllClick = (e) => {
  fetchUpdateOperation({
    id: open[1],
    status: operationState,
    massive: true,
    massiveByInvestor: false,
    billCode: "",
  }).then(() => {  // Espera a que termine la actualización
    getOperationsFetch();  // Luego actualiza la lista
  });
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
const handleOpenNegotiationSummary = async (operationId, opId, hasSummary) => {
  // Si ya sabemos que tiene resumen, buscar el id del resumen
  if (hasSummary) {
    try {
      // Buscar el resumen por opId para obtener el id del resumen
      const response = await GetSummaryList(opId);
      
      // El id del resumen puede venir en diferentes estructuras de respuesta
      let summaryId;
      
      if (response.data?.id) {
        // Si la respuesta tiene data.id directo
        summaryId = response.data.id;
      } else if (response.data?.results?.[0]?.id) {
        // Si la respuesta es un array en results
        summaryId = response.data.results[0].id;
      } else if (response.id) {
        // Si la respuesta tiene id en el nivel superior
        summaryId = response.id;
      } else {
        console.warn("No se pudo encontrar el ID del resumen en la respuesta:", response);
        // Fallback: usar el opId como id (no ideal pero funcional)
        summaryId = opId;
      }

      // Construir URL con el id del resumen y el opId
      const url = `/administration/negotiation-summary?modify&id=${summaryId}&opId=${opId}`;
      openNegotiationSummaryWindow(url);

    } catch (error) {
      console.error("Error al obtener el ID del resumen:", error);
      // Fallback: abrir en modo registro si hay error
      const url = `/administration/negotiation-summary?register&opId=${opId}`;
      openNegotiationSummaryWindow(url);
    }
  } else {
    // Si no tiene resumen, abrir en modo registro
    const url = `/administration/negotiation-summary?register&opId=${opId}`;
    openNegotiationSummaryWindow(url);
  }
};

// Función auxiliar para abrir la ventana
const openNegotiationSummaryWindow = (url) => {
  if (openWindow && !openWindow.closed) {
    openWindow.location.href = url;
    openWindow.focus();
  } else {
    const newWindow = window.open(url, "_blank", "width=800,height=600");
    setOpenWindow(newWindow);
    
    newWindow.onbeforeunload = () => {
      setOpenWindow(null);
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



const handleTextFieldChange = (evt) => {
  const value = evt.target.value;
  setSearch(value);
  
  // Si el campo queda vacío, actualizar filtros automáticamente
  if (value === "") {
    updateFilters("", "multi");
  }
};

const handleDateRangeApply = (dateRangeSelected) => {
  setDateRange({
    startDate: dateRangeSelected.startDate,
    endDate: dateRangeSelected.endDate,
  });

  filtersHandlers.set({
    ...filtersHandlers.value,
    startDate: dateRangeSelected.startDate,
    endDate: dateRangeSelected.endDate,
  });

  setPage(1);
};

const handleClear = () => {
  setDateRange({
    startDate: null,
    endDate: null,
  });

  filtersHandlers.set({
    ...filtersHandlers.value,
    startDate: "",
    endDate: "",
  });
};
const activeFiltersCount =
  Number(!!selectedStatus) +
  Number(!!dateRange?.startDate && !!dateRange?.endDate);

  const formatFilterDate = (date) => {
  if (!date) return "";
  return moment(date).format("DD/MM/YYYY");
};

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
  
      // Modificar el useEffect para resetear checkedPages cuando se aplica un filtro
  useEffect(() => {
    if (filterApplied) {
      setCheckedPages(new Set());
      setFilterApplied(false);
    }
  }, [filterApplied]);
  

  
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
          badgeClass = "badge por-aprobar";
      }
      
      return (
        <Tooltip title={statusText} arrow>
          <span className={badgeClass}>{statusText}</span>
        </Tooltip>
      );
    },
  },
  
  { 
    field: "opId", 
    headerName: "ID", 
    width: 55,
    renderCell: (params) => (
      <Tooltip title={params.value || ''} arrow>
        <span>{params.value}</span>
      </Tooltip>
    )
  },
  
  { 
    field: "opDate", 
    headerName: "Fecha Op", 
    width: 100,
    valueFormatter: (params) => {
      if (!params.value) return '';
      const [year, month, day] = params.value.split('T')[0].split('-');
      return `${day}/${month}/${year}`;
    },
    renderCell: (params) => (
      <Tooltip title={params.formattedValue || ''} arrow>
        <span>{params.formattedValue}</span>
      </Tooltip>
    )
  },
  
  { 
    field: "billFraction", 
    headerName: "Fracción", 
    width: 60,
    renderCell: (params) => (
      <Tooltip title={params.value || ''} arrow>
        <span>{params.value}</span>
      </Tooltip>
    )
  },
  
  { 
    field: "billData", 
    headerName: "# Factura", 
    width: 100,
    renderCell: (params) => (
      <Tooltip title={params.value || ''} arrow>
        <span>{params.value}</span>
      </Tooltip>
    )
  },
  
  { 
    field: "emitterName", 
    headerName: "Emisor", 
    width: 230,
    renderCell: (params) => (
      <Tooltip title={params.value || ''} arrow>
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
      <Tooltip title={params.value || ''} arrow>
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
      <Tooltip title={params.value || ''} arrow>
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
    headerName: "Tasa Desc", 
    width: 60,
    renderCell: (params) => (
      <Tooltip title={params.value || ''} arrow>
        <span>{params.value}</span>
      </Tooltip>
    )
  },
  
  { 
    field: "payedPercent", 
    headerName: "% Desc", 
    width: 40,
    renderCell: (params) => (
      <Tooltip title={params.value ? `${params.value}%` : ''} arrow>
        <span>{params.value}</span>
      </Tooltip>
    )
  },
  
  { 
    field: "investorTax", 
    headerName: "Tasa Inv", 
    width: 40,
    renderCell: (params) => (
      <Tooltip title={params.value || ''} arrow>
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
      <Tooltip title={params.formattedValue || ''} arrow>
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
      <Tooltip title={params.formattedValue || ''} arrow>
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
      <Tooltip title={params.formattedValue || ''} arrow>
        <span>{params.formattedValue}</span>
      </Tooltip>
    )
  },
  
  { 
    field: "opExpiration", 
    headerName: "Fecha Fin", 
    width: 94,
    valueFormatter: (params) => {
      if (!params.value) return '';
      const [year, month, day] = params.value.split('T')[0].split('-');
      return `${day}/${month}/${year}`;
    },
    renderCell: (params) => (
      <Tooltip title={params.formattedValue || ''} arrow>
        <span>{params.formattedValue}</span>
      </Tooltip>
    )
  },
   
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
                onClick={() => handleOpenNegotiationSummary(params.row.id,params.row.opId,hasSummary)}
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




  // Tabla de operaciones en borrador




const draftCount = useMemo(() => {
  return (draftRows || []).filter((item) =>
    ["DRAFT", "READY_FOR_EXCEL"].includes(item.status)
  ).length;
}, [draftRows]);

const hasCriticalDrafts = useMemo(() => {
  return (draftRows || []).some((draft) => {
    if (!draft.expiresAt) return false;

    const diffMs = new Date(draft.expiresAt).getTime() - Date.now();
    const days = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

    return days < 5;
  });
}, [draftRows]);
const loadDrafts = async () => {
  try {
    setLoadingDrafts(true);
    const response = await getMassiveOperationDrafts();
    setDraftRows(response?.data || []);
  } catch (error) {
    console.error("Error cargando borradores:", error);
    Toast("No fue posible cargar los borradores", "error");
  } finally {
    setLoadingDrafts(false);
  }
};

useEffect(() => {
  loadDrafts();
}, []);

const handleContinueDraft = (draft) => {
  const newWindow = openOrFocusWindow(
    `registerMassiveOperationDraft-${draft.id}`,
    `/pre-operations/registerMassiveOperation?draftId=${draft.id}`,
    "width=1200,height=800"
  );

  if (!newWindow) {
    Toast("El navegador bloqueó la ventana emergente", "error");
  }
};

const handleDiscardDraft = async (draft) => {
  try {
    await deleteMassiveOperationDraft(draft.id);
    Toast("Borrador descartado", "success");
    loadDrafts();
  } catch (error) {
    console.error("Error descartando borrador:", error);
    Toast("No fue posible descartar el borrador", "error");
  }
};

useEffect(() => {
  loadDrafts();
}, []);



  return (
    <>
    
 <Box
  sx={{
    display: "grid",
    gridTemplateColumns: { xs: "1fr", md: "1fr auto" },
    alignItems: "center",
    gap: 2,
    width: "100%",
    mb: 2,
  }}
>
  <Box className="view-header">
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
        sx={{ ml: 1, mt: 1 }}
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
          href="/pre-operations"
          sx={{ fontSize: "1.3rem" }}
        >
          <Typography component="h1" className="view-title">
            Operaciones por Aprobar
          </Typography>
        </Link>
      </Breadcrumbs>
    </Typography>
  </Box>

  <Box
    sx={{
      display: "flex",
      gap: 3,
      alignItems: "center",
      justifyContent: { xs: "flex-start", md: "flex-end" },
      flexWrap: "wrap",
      pr: { md: 1 },
    }}
  >
    <Link href="/operations" underline="none">
      <Typography
        sx={{
          color: "#5EA3A3",
          fontSize: "1rem",
          fontWeight: 500,
          cursor: "pointer",
          "&:hover": {
            color: "#488B8F",
            textDecoration: "underline",
          },
        }}
      >
        Operaciones
      </Typography>
    </Link>

    <Link href="/operations/electronicSignature" underline="none">
      <Typography
        sx={{
          color: "#5EA3A3",
          fontSize: "1rem",
          fontWeight: 500,
          cursor: "pointer",
          "&:hover": {
            color: "#488B8F",
            textDecoration: "underline",
          },
        }}
      >
        Notificaciones de Compra
      </Typography>
    </Link>
  </Box>
</Box>



    <Box
  sx={{
    display: "grid",
    gridTemplateColumns: { xs: "1fr", lg: "minmax(320px, 1fr) auto" },
    gap: 2,
    alignItems: "center",
    width: "100%",
    mb: 2,
  }}
>
  <TextField
    variant="outlined"
    id="searchBar"
    size="small"
    placeholder="Buscar por NIT o nombre de cliente"
    value={search}
    onChange={(evt) => handleTextFieldChange(evt, "investor")}
    onKeyPress={(event) => {
      if (event.key === "Enter") {
        const valueToSearch = search || "";
        updateFilters(valueToSearch, "multi");
      }
    }}
    sx={{
      width: "100%",
      "& .MuiOutlinedInput-root": {
        height: 42,
        fontSize: "14px",
        borderRadius: "8px",
      },
      "& .MuiInputBase-input": {
        padding: "8px 10px",
      },
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#5EA3A3",
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

  <Box
    sx={{
      display: "flex",
      flexWrap: "wrap",
      gap: 1,
      alignItems: "center",
      justifyContent: { xs: "flex-start", lg: "flex-end" },
      width: "100%",
    }}
  >
    <Button
      onClick={handleOpenFilters}
      variant="outlined"
      startIcon={<TuneIcon fontSize="small" />}
      sx={{
        height: 42,
        minWidth: "42px",
        border: "1px solid #5EA3A3",
        borderRadius: "8px",
        color: "#488B8F",
        backgroundColor: "#fff",
        px: 1.5,
        "&:hover": {
          backgroundColor: "#488B8F",
          color: "#fff",
          borderColor: "#488B8F",
        },
        "&:hover svg": {
          color: "#fff",
        },
      }}
    >
      {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ""}
    </Button>

    {dateRange?.startDate && dateRange?.endDate && (
      <Chip
        label={`Fecha: ${formatFilterDate(dateRange.startDate)} - ${formatFilterDate(dateRange.endDate)}`}
        onDelete={handleClear}
        sx={{
          height: 38,
          borderRadius: "18px",
          backgroundColor: "#EAF6F6",
          color: "#488B8F",
          fontWeight: 500,
          "& .MuiChip-deleteIcon": {
            color: "#488B8F",
            "&:hover": {
              color: "#2F6F73",
            },
          },
        }}
      />
    )}

    {selectedStatus && (
      <Chip
        label={`Estado: ${selectedStatus.label}`}
        onDelete={handleClearStatus}
        sx={{
          height: 38,
          borderRadius: "18px",
          backgroundColor: "#EAF6F6",
          color: "#488B8F",
          fontWeight: 500,
          "& .MuiChip-deleteIcon": {
            color: "#488B8F",
            "&:hover": {
              color: "#2F6F73",
            },
          },
        }}
      />
    )}

    <Button
      onClick={handleOpenModal}
      variant="outlined"
      startIcon={<ArticleIcon fontSize="small" />}
      sx={{
        height: 42,
        border: "1px solid #5EA3A3",
        borderRadius: "8px",
        color: "#488B8F",
        px: 2,
        backgroundColor: "#fff",
        textTransform: "none",
        fontWeight: 500,
        "&:hover": {
          backgroundColor: "#488B8F",
          color: "#fff",
          borderColor: "#488B8F",
        },
      }}
    >
      Valor a Girar
    </Button>

    <ModalValorAGirar
      open={openModal}
      handleClose={handleCloseModal}
      data={mockData}
    />

    <Button
      onClick={handleOpenRegisterMenu}
      variant="contained"
      endIcon={<ArrowDropDownIcon />}
      sx={{
        height: 42,
        borderRadius: "8px",
        backgroundColor: "#1C9AA0",
        color: "#fff",
        px: 2.5,
        textTransform: "none",
        fontWeight: 600,
        boxShadow: "none",
        "&:hover": {
          backgroundColor: "#16848A",
          boxShadow: "none",
        },
      }}
    >
      Registrar Operación
    </Button>

    <Menu
  anchorEl={anchorElRegister}
  open={openRegisterMenu}
  onClose={handleCloseRegisterMenu}
  anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
  transformOrigin={{ vertical: "top", horizontal: "left" }}
  PaperProps={{
    sx: {
      mt: 1,
      borderRadius: "10px",
      minWidth: 230,
      overflow: "hidden",
    },
  }}
>
  <MenuItem
    onClick={handleOpenRegisterOperation}
    sx={{
      py: 1.5,
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
    }}
  >
    <Typography sx={{ color: "#2D98A0", fontWeight: 500 }}>
      Registrar Operación
    </Typography>
    <Typography sx={{ fontSize: "0.85rem", color: "#666" }}>
      Registra facturas individualmente
    </Typography>
  </MenuItem>

  <MenuItem
    onClick={handleOpenRegisterMassiveOperation}
    sx={{
      py: 1.5,
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
    }}
  >
    <Typography sx={{ color: "#2D98A0", fontWeight: 500 }}>
      Registro Masivo
    </Typography>
    <Typography sx={{ fontSize: "0.85rem", color: "#666" }}>
      Carga de lotes con Excel
    </Typography>
  </MenuItem>
</Menu>

    <Box sx={{ justifySelf: { xs: "end", sm: "auto" } }}>
      <IconButton onClick={handleMenuClickCSV} className="context-menu">
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorElCSV}
        open={openMenuCSV}
        onClose={handleCloseMenuCSV}
      >
        <MenuItem onClick={handleExportExcel}>Exportar a CSV</MenuItem>
      </Menu>
    </Box>
  </Box>
</Box>
<Menu
  anchorEl={anchorElFilters}
  open={openFiltersMenu}
  onClose={handleCloseFilters}
  anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
  transformOrigin={{ vertical: "top", horizontal: "left" }}
  PaperProps={{
    sx: {
      width: 320,
      borderRadius: "10px",
      mt: 1,
      overflow: "hidden",
    },
  }}
>
  
  <Box sx={{ px: 2, py: 1.5 }}>
    <Typography
      sx={{
        fontWeight: 700,
        fontSize: "1rem",
        color: "#B7D6D6",
        mb: 1,
      }}
    >
      Fecha
    </Typography>

    <AdvancedDateRangePicker
      className="date-picker"
      onApply={(range) => {
        handleDateRangeApply(range);
      }}
      onClean={handleClear}
    />
  </Box>
  <Box sx={{ px: 2, py: 1.5 }}>
    <Typography
      sx={{
        fontWeight: 700,
        fontSize: "1rem",
        color: "#B7D6D6",
        mb: 1,
      }}
    >
      Estado
    </Typography>

    {statusOptions.map((option) => (
      <MenuItem
        key={option.value}
        onClick={() => handleSelectStatus(option)}
        selected={selectedStatus?.value === option.value}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderRadius: "6px",
          mb: 0.5,
        }}
      >
        <span className={option.badgeClass}>{option.label}</span>

        {selectedStatus?.value === option.value && (
          <CheckIcon fontSize="small" sx={{ color: "#488B8F" }} />
        )}
      </MenuItem>
    ))}
  </Box>

  <Box sx={{ borderTop: "1px solid #eee" }} />


  <Box sx={{ borderTop: "1px solid #eee" }} />

  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      px: 2,
      py: 1.2,
    }}
  >
    <Button
      onClick={() => {
        handleClearStatus();
        handleClear();
      }}
      sx={{
        textTransform: "none",
        color: "#b5b5b5",
      }}
    >
      Limpiar filtros
    </Button>

    <Button
      onClick={handleCloseFilters}
      variant="contained"
      sx={{
        textTransform: "none",
        backgroundColor: "#488B8F",
        "&:hover": {
          backgroundColor: "#5EA3A3",
        },
      }}
    >
      Aplicar
    </Button>
  </Box>
</Menu>
<Box
  sx={{
    display: "flex",
    alignItems: "center",
    gap: 4,
    mt: 2,
    mb: 1.5,
    pl: 1,
  }}
>
  <Button
    onClick={() => setActiveTab("all")}
    sx={{
      color: activeTab === "all" ? "#149A9A" : "#9E9E9E",
      borderBottom:
        activeTab === "all"
          ? "3px solid #149A9A"
          : "3px solid transparent",
      borderRadius: 0,
      textTransform: "none",
      fontSize: 18,
      minWidth: 180,
      pb: 1,
    }}
  >
    Todas
  </Button>

  <Button
    onClick={() => setActiveTab("drafts")}
    sx={{
      color: activeTab === "drafts" ? "#149A9A" : "#9E9E9E",
      borderBottom:
        activeTab === "drafts"
          ? "3px solid #149A9A"
          : "3px solid transparent",
      borderRadius: 0,
      textTransform: "none",
      fontSize: 18,
      minWidth: 180,
      pb: 1,
      gap: 1,
    }}
  >
    Borradores

    {draftCount > 0 && (
      <Box
        sx={{
          minWidth: 20,
          height: 20,
          borderRadius: "50%",
          bgcolor: "#C90000",
          color: "#fff",
          fontSize: 11,
          display: "grid",
          placeItems: "center",
          fontWeight: 700,
        }}
      >
        {draftCount}
      </Box>
    )}
  </Button>
</Box>

{activeTab === "drafts" && hasCriticalDrafts && (
  <Box
    sx={{
      mb: 1.5,
      px: 2,
      py: 1,
      borderRadius: "8px",
      bgcolor: "#FFF3F3",
      color: "#B71C1C",
      fontSize: 13,
      fontWeight: 600,
    }}
  >
    Tienes borradores a punto de expirar. Por favor, gestiónalos pronto.
  </Box>
)}
{activeTab === "drafts" ? (
  <PreOperationsDraftTable
  rows={draftRows}
  loading={loadingDrafts}
  onContinue={handleContinueDraft}
  onDiscard={handleDiscardDraft}
/>
) : (
  <PreOperationsTable
    handleClose={handleClose}
    handleCloseDelete={handleCloseDelete}
    handleOpenDelete={handleOpenDelete}
    openDelete={openDelete}
    open={open}
    handleUpdateAllClick={handleUpdateAllClick}
    handleUpdateClick={handleUpdateClick}
    setPage={setPage}
    page={page}
    dataCount={dataCount}
    loading={loading}
    rows={rows}
    haveNegotiationSummary={haveNegotiationSummary}
    handleOpenNegotiationSummary={handleOpenNegotiationSummary}
    handleMenuClick={handleMenuClick}
    menuState={menuState}
    handleCloseMenu={handleCloseMenu}
    UpdateStatusOperation={UpdateStatusOperation}
    DetailPreOperation={DetailPreOperation}
    EditPreOperation={EditPreOperation}
    DeletePreOperation={DeletePreOperation}
    handleDelete={handleDelete}
     columns={ columns}
  />
)}
     
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