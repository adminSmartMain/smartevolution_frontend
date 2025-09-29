import { useState } from "react";
import { useEffect,useRef } from "react";
import Axios from "axios";
import Link from "next/link";
import { debounce, set } from "lodash";
import { parseISO, parse, isValid } from 'date-fns';
import es from 'date-fns/locale/es';

import SearchIcon from '@mui/icons-material/Search'; // Importa el ícono de búsqueda
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import {
  Box,
  Button,
  CircularProgress,
  Fade,
  Grid,
  Popover,
  IconButton,
  Typography,
  TextField,
  Tooltip,
} from "@mui/material";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subWeeks, subMonths } from "date-fns";
import styled from "@emotion/styled";
import TitleModal from "@components/modals/titleModal";

import DateFormat from "@formats/DateFormat";
import ValueFormat from "@formats/ValueFormat";

import { useFetch } from "@hooks/useFetch";

import BackButton from "@styles/buttons/BackButton";
import CustomTooltip from "@styles/customTooltip";
import BaseField from "@styles/fields/BaseField";
import InputTitles from "@styles/inputTitles";
import scrollSx from "@styles/scroll";
import CustomDataGrid from "@styles/tables";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from 'dayjs';
import { GetNegotiationSummaryPDF, GetSummaryList } from "./queries";
import ClearIcon from '@mui/icons-material/Clear';

import moment from "moment";


const StyledButton = styled(Button)`
  color: #488b8f;
  border-color: #488b8f;
  text-transform: none;
  margin: 5px 0;
  &:hover {
    color: #fff;
    background-color: #3c7071;
    border-color: #488b8f;
  }
`;
const tableWrapperSx = {
  marginTop: 2,
  display: "flex",
  flexDirection: "column",
  width: "100%",
  height: "100%",
};

const StyledApplyButton = styled(Button)`
  background-color: #488b8f;
  color: #fff;
  text-transform: none;
  &:hover {
    background-color: #3c7071;
  }
`;

export const SummaryListComponent = () => {
  const columns = [
    {
      field: "NoOP",
      headerName: "NO. OP",
      width: 100,
      renderCell: (params) => {
        return <InputTitles>{params.value}</InputTitles>;
      },
    },
    {
      field: "date",
      headerName: "FECHA",
      width: 130,
      renderCell: (params) => {
        return (
          <InputTitles>
            {params.value ? moment(params.value).format("DD/MM/YYYY") : ""}
          </InputTitles>
        );
      },
    },
    {
      field: "emitter",
      headerName: "NOMBRE EMISOR",
      width: 280,
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
      field: "payer",
      headerName: "NOMBRE PAGADOR",
      width: 280,
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
      field: "total",
      headerName: "DESEMBOLSOS",
      width: 170,
      renderCell: (params) => {
        return (
          <InputTitles>
            <ValueFormat prefix="$ " value={params.value} />
          </InputTitles>
        );
      },
    },
    {
      field: "totalDeposits",
      headerName: "TOTAL CONSIGNACIONES",
      width: 170,
      renderCell: (params) => {
        return (
          <InputTitles>
            <ValueFormat prefix="$ " value={params.value} />
          </InputTitles>
        );
      },
    },
    {
      field: "pendingToDeposit",
      headerName: "PENDIENTE DESEMBOLSO",
      width: 190,
      renderCell: (params) => {
        return (
          <InputTitles>
            <ValueFormat prefix="$ " value={params.value} />
          </InputTitles>
        );
      },
    },

    //Iconos de acciones
    {
      field: "Editar resumen",
      headerName: "",
      width: 50,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        return (
          <Link
            href={`/administration/negotiation-summary?modify&id=${params.row.id}&opId=${params.row.NoOP}`}
          >
            <CustomTooltip
              title="Editar resumen"
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
                fontFamily="icomoon"
                fontSize="1.9rem"
                color="#999999"
                borderRadius="5px"
                sx={{
                  "&:hover": {
                    backgroundColor: "#B5D1C980",
                    color: "#488B8F",
                  },
                  cursor: "pointer",
                }}
              >
                &#xe900;
              </Typography>
            </CustomTooltip>
          </Link>
        );
      },
    },
    {
      field: "Imprimir resumen",
      headerName: "",
      width: 50,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        return (
          <CustomTooltip
            title="Imprimir resumen"
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
              onClick={() => handleNegotiationSummaryClick(params.row.NoOP)}
            >
              <i
                className="fa-regular fa-print"
                style={{
                  fontSize: "1.3rem",
                  color: "#999999",
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
      },
    },
  ];
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [filter, setFilter] = useState("");
  const [query, setQuery] = useState("");
  const [filterInput, setFilterInput] = useState("");
  const [errorFilter, setError] = useState("");
  const [dataFiltered, setDataFiltered] = useState(null);
  const [dateSelectedFilter,setDateSelectedFilter]=useState([])
  const [dataFilteredByDate,setDataFilteredByDate]=useState(null)
  const [isDateFilter,setIsDateFilter] = useState(false)
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true); // Controla si es la primera carga o un cambio de página
  const [isFilterApplied, setIsFilterApplied] = useState(false); // Controla si el filtro está aplicado
  const [pageFiltered,setPageFiltered]=useState(1)
  const [modeFilter,setModelFilter]=useState("")
  const today = new Date();
  const [anchorEl, setAnchorEl] = useState(null);
  const [startDatePicker, setStartDatePicker] = useState(format(today, "yyyy-MM-dd")); // Almacena la fecha de inicio como string;
  const [endDatePicker, setEndDatePicker] = useState(format(today, "yyyy-MM-dd")); // Almacena la fecha de fin como string;
  const [errorPicker, setErrorPicker] = useState("");// Almacena errores relacionados con la validación de fechas

  const openPicker = Boolean(anchorEl);
  const [searchTrigger, setSearchTrigger] = useState(false);

  const [filterParams, setFilterParams] = useState({
    id: "",
    emitter: "",
    startDate: "",
    endDate: "",
    page: 1,
  });
  
  
  // Hooks
  const {
    fetch: fetch,
    loading: loading,
    error: error,
    data: data,
  } = useFetch({
    service: GetSummaryList,
    init: true,
  });
  let dataCount = 0;

    const {
    fetch: fetchNegotiationSummmary,
    loading: loadingNegotiationSummary,
    error: errorNegotiationSummary,
    data: dataNegotiationSummary,
  } = useFetch({ service: GetNegotiationSummaryPDF, init: false });


  if (Array.isArray(dataFiltered?.results)) {
    // Si `dataFiltered.results` es un array, contamos los elementos
    dataCount = dataFiltered.count;
  } else if (typeof dataFiltered?.data === "object") {
    // Si `dataFiltered.data` es un objeto, asumimos que hay un solo resultado
    dataCount = 1;
  } else if (Array.isArray(data?.results)) {
    // Si `data.results` es un array, contamos los elementos
    dataCount = data.count;
  }
  

   const summary = (
    
    dataFiltered?.results // Si `dataFiltered.data` es un array con elementos
      ? dataFiltered.results.map((summary) => ({
          id: summary.id,
          NoOP: summary.opId,
          date: summary.date,
          emitter: summary.emitter,
          payer: summary.payer,
          total: summary.total,
          totalDeposits: summary.totalDeposits,
          pendingToDeposit: summary.pendingToDeposit,
        }))
      : dataFiltered?.data // Si `dataFiltered.data` no es un array, se asume que es un objeto único
      ? [
          {
            id: dataFiltered.data.id,
            NoOP: dataFiltered.data.opId,
            date: dataFiltered.data.date,
            emitter: dataFiltered.data.emitter,
            payer: dataFiltered.data.payer,
            total: dataFiltered.data.total,
            totalDeposits: dataFiltered.data.totalDeposits,
            pendingToDeposit: dataFiltered.data.pendingToDeposit,
          },
        ]
      : data?.results // Si `data` tiene `results`, mapeamos los resultados
      ? data.results.map((summary) => ({
          id: summary.id,
          NoOP: summary.opId,
          date: summary.date,
          emitter: summary.emitter,
          payer: summary.payer,
          total: summary.total,
          totalDeposits: summary.totalDeposits,
          pendingToDeposit: summary.pendingToDeposit,
        }))
      : [] // Si no hay ni `data` ni `dataFiltered`, devolvemos un array vacío
  ) || [];
  


  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };


  const handleNegotiationSummaryClick = (id) => {
    fetchNegotiationSummmary(id);
    handleOpen();
  };

// Leer parámetros iniciales de la URL
useEffect(() => {
  const searchParams = new URLSearchParams(window.location.search);
  const opId = searchParams.get("opId") || ""; // Cambiar "id" por "opId"
  const emitter = searchParams.get("emitter") || "";

  if (emitter) {
    setFilterInput(emitter);
  } else if (opId) {
    setFilterInput(opId);
     setPage(1);
        setPageFiltered(1);
        fetchFilteredData();
        setIsFilterApplied(true);
  }
}, []);

  // Actualizar `pageFiltered` cada vez que `page` cambie
  useEffect(() => {

    setPageFiltered(page);
  }, [page]);



// Modificar handleFilterChange para solo actualizar el estado
const handleFilterChange = (e) => {
    setFilterInput(e.target.value);
    const { name, value } = e.target;
    setFilterParams((prevParams) => ({
        ...prevParams,
        [name]: value,
    }));
};

// Manejar la tecla Enter
const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
        setSearchTrigger(prev => !prev); // Alternar el valor para trigger el efecto
    }
};

// Efecto que se ejecuta cuando se presiona Enter o cuando searchTrigger cambia
useEffect(() => {
    if (filterInput !== "") {
        console.log('Búsqueda con Enter o botón');
        setPage(1);
        setPageFiltered(1);
        fetchFilteredData();
        setIsFilterApplied(true);
    }
}, [searchTrigger]); // Solo se ejecuta cuando searchTrigger cambia


  const isNumber = (value) => {
    return /^\d+$/.test(value); // Comprueba si es un número entero
  };
 





  // Efecto para manejar la paginación, que solo se activa después de aplicar el filtro
  useEffect(() => {
    if (!isFirstLoad && isFilterApplied) {
  fetchFilteredData(); 
      
    }
  }, [pageFiltered, isFirstLoad, isFilterApplied]);
  
  // Efecto que se ejecuta al inicio para marcar que es la primera carga y no cambiar el filtro
  useEffect(() => {
    if (isFirstLoad && filterInput !== "") {
      setIsFirstLoad(false); // Después de la primera carga, cambiamos el estado
      setPage(1)
    }
  }, [isFirstLoad, filterInput]);


  const fetchFilteredData = async () => {
    let url = `${API_URL}/report/negotiationSummary`;
    let params = new URLSearchParams(window.location.search); // Inicializamos con los parámetros actuales de la URL
    console.log("Hacemos peticiones de objetos filtrados");

    // Si hay un filtro
    if (filterInput !== "") {
        if (isNumber(filterInput)) {
            // Si el filtro es un número, es un filtro por `id`
            setModelFilter("opId");
            params.set("opId", filterInput);
            params.set("mode", "filter");
            params.set("emitter", ""); // Limpiamos otros filtros relacionados
        } else {
            // Si el filtro es texto, es un filtro por `emitter`
            setModelFilter("emitter");
            params.set("opId", ""); // Limpiamos otros filtros relacionados
            params.set("mode", "filter");
            params.set("emitter", filterInput);
            params.set("page", pageFiltered);
        }
    }
    


    try {
       

        // Actualizamos la URL del navegador con los parámetros modificados
        window.history.pushState(null, "", `?${params.toString()}`);
        try {
          // Realizamos la solicitud al backend con los parámetros actualizados
          const response = await Axios.get(url, {
              headers: {
                  authorization: `Bearer ${localStorage.getItem("access-token")}`,
              },
              params: Object.fromEntries(params.entries()), // Convertimos URLSearchParams a un objeto plano
          });
      

          setDataFiltered(response.data); // Actualizamos los datos con la respuesta
          setError(""); // Limpiamos cualquier error previo
          return response; // O realiza la acción deseada con la respuesta
      } catch (error) {
          console.error("Error en la solicitud:", error);
          
          
          try {
            params.set("page", 1);
          setPage(1)
              const response = await Axios.get(url, {
                  headers: {
                      authorization: `Bearer ${localStorage.getItem("access-token")}`,
                  },
                  params: Object.fromEntries(params.entries()),
              });
                // Reiniciamos el parámetro "page" a 1 y hacemos una nueva solicitud
  
              window.history.pushState(null, "", `?${params.toString()}`);
              
              setDataFiltered(response.data); // Actualizamos los datos con la respuesta
              setError(""); // Limpiamos cualquier error previo
              return response; // O realiza la acción deseada con la respuesta
          } catch (retryError) {
              console.error("Error en la solicitud después de reiniciar página:", retryError);
              throw retryError; // Propaga el error si no puedes manejarlo
          }
      }
      

      
    } catch (err) {
        setError("Error al realizar la solicitud. Verifique su entrada.");
        console.error("Error en la solicitud:", err);
    }
};

 

// Función para limpiar filtros
const clearFilters = async () => {
  let url = `${API_URL}/report/negotiationSummary`;
  try {
    // Obtener los parámetros actuales de la URL
    const params = new URLSearchParams(window.location.search);

    // Variables para determinar el estado de los parámetros
    const startDate = params.get("startDate");
    const endDate = params.get("endDate");
    const emitter = params.get("emitter");
    const id = params.get("opId");

    // Lógica condicional según los parámetros
    if (startDate && endDate && !emitter && !id) {
      // Caso: Si están startDate y endDate llenos, y emitter e id vacíos, no hacer nada
      return;
    }

    if (startDate && endDate && (emitter || id)) {
      // Caso: Si están startDate y endDate llenos y emitter o id llenos, vaciarlos sin borrarlos
      if (emitter) params.set("emitter", "");
      if (id) params.set("opId", "");

      window.history.pushState(null, "", `/administration/negotiation-summary/summaryList?${params.toString()}`);

    // Restablecer el estado
    setFilterInput(""); // Limpiar el input del filtro
    setPageFiltered(1); // Restablecer la página filtrada
    setPage(1); // Restablecer la página a la inicial
    setError(""); // Limpiar errores

    // Realizamos la solicitud al backend con los parámetros actualizados
    const responsef = await Axios.get(url, {
      headers: {
          authorization: `Bearer ${localStorage.getItem("access-token")}`,
      },
      params: Object.fromEntries(params.entries()), // Convertimos URLSearchParams a un objeto plano
  });

    // Actualizar los datos mostrados
    setDataFiltered(responsef.data);

    } else if (emitter && !id) {
      // Caso: Si emitter está lleno, borrar todo
      params.delete("emitter");
      params.delete("startDate");
      params.delete("endDate");
      params.delete("opId");
      params.delete("filter");
      params.delete("mode");
      params.delete("page");
        // Actualizar la URL con los parámetros restantes
    window.history.pushState(null, "", `/administration/negotiation-summary/summaryList?${params.toString()}`);

    // Restablecer el estado
    setFilterInput(""); // Limpiar el input del filtro
    setPageFiltered(1); // Restablecer la página filtrada
    setPage(1); // Restablecer la página a la inicial
    setError(""); // Limpiar errores

    // Realizar la solicitud inicial con los parámetros actualizados
    const responsec = await fetch({
      page: 1, // Página inicial
    });

    // Actualizar los datos mostrados
    setDataFiltered(responsec.data);

    } else if (id && !emitter) {
      // Caso: Si id está lleno, borrar todo
      console.log('casoid')
      params.delete("opId");
      params.delete("startDate");
      params.delete("endDate");
      params.delete("emitter");
      params.delete("filter");
      params.delete("mode");
      params.delete("page");

         // Actualizar la URL con los parámetros restantes
    window.history.pushState(null, "", `/administration/negotiation-summary/summaryList?${params.toString()}`);

    // Restablecer el estado
    setFilterInput(""); // Limpiar el input del filtro
    setPageFiltered(1); // Restablecer la página filtrada
    setPage(1); // Restablecer la página a la inicial
    setError(""); // Limpiar errores

    // Realizar la solicitud inicial con los parámetros actualizados
    const responsed = await fetch({
      page: 1, // Página inicial
    });

    // Actualizar los datos mostrados
    setDataFiltered(responsed.data);
    }

    
    
  } catch (err) {
    setError("Error al limpiar los filtros.");
    console.error("Error al limpiar los filtros:", err);
  }
};


///////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Configuración de datepicker
 // Restablecer el filtro
 const handleClear = async () => {
  let url = `${API_URL}/report/negotiationSummary`;
  setStartDatePicker(format(today, "yyyy-MM-dd"));
  setAnchorEl(null); // Cierra el picker
  setEndDatePicker(format(today, "yyyy-MM-dd"));
  setErrorPicker("");

  try {
    // Obtener los parámetros actuales de la URL
    const params = new URLSearchParams(window.location.search);

    // Verificar si los parámetros `id` y `emitter` están vacíos
    const id = params.get("opId");
    const emitter = params.get("emitter");

    if (!id && !emitter) {
        

      // Si ambos están vacíos, eliminar todos los parámetros
      window.history.pushState(null, "", window.location.pathname);
      const responseb = await fetch({
      page: 1, // Página inicial
    });
    setPage(1);
    setDataFiltered(responseb.data);
    
    } else {
      // Eliminar solo los parámetros de fecha
      params.delete("startDate");
      params.delete("endDate");

      params.delete("page");
      // Actualizar la URL en el navegador
      window.history.pushState(null, "", `?${params.toString()}`);
      // Realizar la solicitud al backend
    const responsea = await Axios.get(url, {
      headers: {
        authorization: `Bearer ${localStorage.getItem("access-token")}`,
      },
      params: params,
    });
    setDataFiltered(responsea.data);
    setPage(1);
    }

    
   
    setError(""); // Limpiar errores previos
  } catch (err) {
    setError("Error al realizar la solicitud. Verifique su entrada.");
    console.error("Error en la solicitud:", err);
  }
};

const formatDateSelected = (date) => {
  try {
    if (!date) {
      throw new Error("La fecha proporcionada es nula o indefinida.");
    }

    const d = new Date(date);
    if (isNaN(d.getTime())) {
      throw new Error("La fecha proporcionada no es válida.");
    }

    return d.toISOString().split('T')[0]; // Formato YYYY-MM-DD
  } catch (error) {
    console.error(`Error al formatear la fecha: ${error.message}`);
    return null; // Devuelve `null` si hay un error
  }
};




//abrir el popover
const handleOpenPicker = (event) => setAnchorEl(event.currentTarget);
// Cerrar el Popover
const handleClosePickerSimple = () => {
  setOpen(null);
  
  setAnchorEl(null); // Cierra el picker
};

const handleClosePicker = async () => {
  let url = `${API_URL}/report/negotiationSummary`;
  let params = {}; // Parámetros de la solicitud

  setAnchorEl(null); // Cierra el picker
  setPage(1);
  // Asegúrate de que startDatePicker y endDatePicker estén en el formato adecuado
  const formattedStartDate = formatDateSelected(startDatePicker); // Formatear la fecha de inicio
  const formattedEndDate = formatDateSelected(endDatePicker); // Formatear la fecha de fin

  setDataFilteredByDate([formattedStartDate, formattedEndDate]); // Establece las fechas formateadas
  setIsDateFilter(true); // Activa el filtro de fecha
  
  // Si hay un filtro, asignamos los parámetros
  if (formattedStartDate !== "" && formattedEndDate !== "") {
    // Verificamos si filterInput es un número o un texto
    if (!isNaN(filterInput)) {
      // Si es un número, lo asignamos a 'id'
      params = {
        opId: filterInput || "",
        mode: "filter",
        emitter: "", // No asignamos 'emitter' si es un número
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        page: 1,
      };
    } else {
      // Si es texto, lo asignamos a 'emitter'
      params = {
        opId: "",
        mode: "filter",
        emitter: filterInput || "", // Asignamos 'emitter' si es un texto
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        page: 1,
      };
    }
  }

  try {
    // Obtener los parámetros actuales de la URL
    const currentParams = new URLSearchParams(window.location.search);
    
    // Merge de los parámetros actuales con los nuevos
    Object.keys(params).forEach((key) => {
      // Solo actualizamos el parámetro si tiene un valor no vacío
      if (params[key] !== "" && params[key] !== null) {
        currentParams.set(key, params[key]); // Modificar o agregar los parámetros
      } else if (!currentParams.has(key)) {
        // Si el parámetro no existe, se agrega con su valor
        currentParams.append(key, params[key]);
      }
    });

    console.log(currentParams.toString()); // Verificar los parámetros resultantes

    // Actualizar la URL del navegador con los nuevos parámetros
    window.history.pushState(null, "", `?${currentParams.toString()}`);

    // Realizar la solicitud al backend
    const response = await Axios.get(url, {
      headers: {
        authorization: `Bearer ${localStorage.getItem("access-token")}`,
      },
      params: params,
    });

    setDataFiltered(response.data);
    setError(""); // Limpiar errores previos
  } catch (err) {
    setError("Error al realizar la solicitud. Verifique su entrada.");
    console.error("Error en la solicitud:", err);
  }
};






const setQuickFilter = (type) => {
  const options = { weekStartsOn: 1 }; // Configura la semana para que empiece el lunes
  switch (type) {
    case "today":
      setStartDatePicker(format(today, "yyyy-MM-dd"));
      setEndDatePicker(format(today, "yyyy-MM-dd"));
      break;
    case "thisWeek":
      setStartDatePicker(format(startOfWeek(today, options), "yyyy-MM-dd"));
      setEndDatePicker(format(endOfWeek(today, options), "yyyy-MM-dd"));
      break;
    case "lastWeek":
      setStartDatePicker(format(startOfWeek(subWeeks(today, 1), options), "yyyy-MM-dd"));
      setEndDatePicker(format(endOfWeek(subWeeks(today, 1), options), "yyyy-MM-dd"));
      break;
    case "thisMonth":
      setStartDatePicker(format(startOfMonth(today), "yyyy-MM-dd"));
      setEndDatePicker(format(endOfMonth(today), "yyyy-MM-dd"));
      break;
    case "lastMonth":
      setStartDatePicker(format(startOfMonth(subMonths(today, 1)), "yyyy-MM-dd"));
      setEndDatePicker(format(endOfMonth(subMonths(today, 1)), "yyyy-MM-dd"));
      break;
    default:
      setStartDatePicker(format(today, "yyyy-MM-dd"));
      setEndDatePicker(format(today, "yyyy-MM-dd"));
  }
  setErrorPicker("");// Limpiar errores previos
};




// Manejar cambios en las fechas (soportar edición parcial)
  // Manejar cambios en las fechas (soportar edición parcial)
  const handleDateChange = (type, value) => {
    const parsedDate = parseISO(value); // Convertir la fecha ingresada en un objeto Date

    if (isNaN(parsedDate)) {
      setError(`La fecha ${type === "start" ? "de inicio" : "de fin"} no es válida.`);
      return;
    }
    // Primero, actualizamos el valor de la fecha de inicio o fin según corresponda
    if (type === "start") {
      setStartDatePicker(format(parsedDate, "yyyy-MM-dd")); // Formatear y almacenar como cadena;
      if (parsedDate > parseISO(endDatePicker)) {
        setErrorPicker("La fecha de inicio no puede ser posterior a la fecha de fin.");
        return;
      }
    } else if (type === "end") {
      setEndDatePicker(format(parsedDate, "yyyy-MM-dd")); // Formatear y almacenar como cadena
      if (parsedDate < parseISO(startDatePicker)) {
        setErrorPicker("La fecha de fin no puede ser anterior a la fecha de inicio.");
        return;
      }
    }

    setErrorPicker(""); // Limpiar el error si todo está bien
  
    // Validar solo si el valor es una fecha completa (formato YYYY-MM-DD)
    if (value.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const selectedDate = new Date(value);
  
      // Verificar si la fecha es válida
      if (isNaN(selectedDate.getTime())) {
        setErrorPicker(`La fecha ${type === "start" ? "de inicio" : "de fin"} no es válida.`);
        return;
      }

      // Convertir la fecha a medianoche (sin hora) para evitar problemas con las zonas horarias
      //const dateAtMidnight = new Date(selectedDate.setHours(0, 0, 0, 0));
  
      // Validaciones
      if (type === "start") {
        // Si la fecha de inicio es posterior a la de fin
        if (new Date() > new Date(endDatePicker)) {
          setErrorPicker("La fecha de inicio no puede ser posterior a la fecha de fin.");
          return;
        } else {
          setErrorPicker(""); // Limpiar el error si todo está bien
        }
      } else if (type === "end") {
        // Si la fecha de fin es anterior a la de inicio
        if (new Date() < new Date(startDatePicker)) {
          setErrorPicker("La fecha de fin no puede ser anterior a la fecha de inicio.");
          return;
        } else {
          setErrorPicker(""); // Limpiar el error si todo está bien
        }
      }
    }
  };
  

  return (
    <>
     
  <Box
    container
    display="flex"
    flexDirection="row"
    justifyContent="flex-start"  // Alinea a la izquierda
    alignItems="center"          // Alinea verticalmente los elementos
    gap="1rem"                   // Espacio entre el botón y el título
  >
  <BackButton path="/administration" />
  <Typography
    letterSpacing={0}
    fontSize="1.7rem"
    fontWeight="regular"
    marginBottom="0.7rem"
    color="#5EA3A3"
  >
    Consulta de resumen de negociación
  </Typography>
</Box>



      





<Box
  display="flex"
  alignItems="center" // Alinea los elementos verticalmente
  justifyContent="space-between" // Espaciado entre los elementos
  sx={{
    width: '100%', // Asegura que el contenedor ocupe todo el ancho disponible
    padding: '20px', // Espaciado interno
    gap: '10px', // Espacio entre los elementos
    marginRight: '10px', // Ajuste de margen derecho
    marginLeft: '10px', // Ajuste de margen izquierdo
  }}
>
  {/* Filtro */}
  <Box
  display="flex"
  alignItems="center"
  gap="8px"
  sx={{
    border: '1px solid #488f8f', // Borde del filtro
    borderRadius: '4px', // Bordes redondeados
    padding: '4px', // Espaciado interno
    backgroundColor: '#f8f9fa', // Fondo del filtro
    flex: 1, // Ocupa el máximo espacio disponible
    height:'29px',
    marginRight:'30px',
   
  }}
>
<TextField
    placeholder="Ingrese número de operación o emisor"
    variant="standard"
    value={filterInput}
    onChange={handleFilterChange}
    onKeyPress={handleKeyPress} // Agregar manejo de tecla Enter
    required
    InputProps={{
        disableUnderline: true,
        sx: {
            fontSize: '0.875rem',
            color: '#6c757d',
            height: '7px',
        },
    }}
    sx={{
        flex: 1,
        '& .MuiInputBase-root': {
            padding: '8px',
        },
    }}
/>

  <Button
    onClick={clearFilters}
    variant="text"
    size="small"
    sx={{
      minWidth: 'unset', // Elimina el ancho mínimo predeterminado
      padding: '4px 6px', // Ajusta el padding interno
      height: '32px', // Define una altura específica
      lineHeight: '1.2', // Ajusta la altura de línea para el contenido del botón
      color: '#488f8f', // Color del botón
      
    }}
  >
    <ClearIcon />
  </Button>
</Box>


  {/* Botón para abrir el rango de fechas */}
  <Button
    onClick={handleOpenPicker}
    variant="outlined"
    startIcon={<CalendarTodayIcon />}
    sx={{
      textTransform: 'none',
      borderColor: '#488b8f',
      color: '#488b8f',
      whiteSpace: 'nowrap', // Evita que el texto se divida en líneas
      backgroundColor: '#f8f9fa',
      width: '280px',
      height:'41px',
      marginRight:'27px',
     
    }}
  >
    {/* {startDatePicker && endDatePicker
      ? `${format(new Date(startDatePicker), 'dd/MM/yyyy')} - ${format(new Date(endDatePicker), 'dd/MM/yyyy')}`
      : 'Seleccionar rango'} */}

    {startDatePicker && endDatePicker
      ? `${format(parseISO(startDatePicker), "dd/MM/yyyy")} - ${format(parseISO(endDatePicker), "dd/MM/yyyy")}`
      : "Seleccionar rango"}
  </Button>

  {/* Botón para registrar un nuevo resumen */}
  <Link
    href="/administration/negotiation-summary?register"
    underline="none"
  >
    <Button
      variant="outlined"
      color="primary"
      size="large"
      sx={{
        height: '2.6rem',
        backgroundColor: 'transparent',
        border: '1.4px solid #63595C',
        borderRadius: '4px',
      }}
    >
      <Tooltip title="Registrar Nuevo Resumen de Negociación" placement="top">
        <Box display="flex" alignItems="center" >
          <Typography
            letterSpacing={0}
            fontSize="0.875rem"
            fontWeight="bold"
            color="#63595C"
          >
            Nuevo Resumen
          </Typography>
          <Typography
            fontFamily="icomoon"
            fontSize="1.2rem"
            color="#63595C"
            marginLeft="0.9rem"
          >
            &#xe927;
          </Typography>
        </Box>
      </Tooltip>
    </Button>
  </Link>
</Box>

{/* Popover para rango de fechas */}
<Popover
        open={openPicker}
        anchorEl={anchorEl}
        onClose={handleClosePickerSimple}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
         <Box sx={{ padding: 2, width: 300 }}>
          <Typography variant="subtitle2" gutterBottom>
            Seleccionar Rango de Fechas
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="date"
                label="Fecha Inicio"
                value={startDatePicker}
                onChange={(e) => handleDateChange("start", e.target.value)}
                InputLabelProps={{ shrink: true }}
                error={!!errorPicker && errorPicker.includes("inicio")}
                helperText={errorPicker && errorPicker.includes("inicio") ? errorPicker : ""}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="date"
                label="Fecha Fin"
                value={endDatePicker}
                onChange={(e) => handleDateChange("end", e.target.value)}
                InputLabelProps={{ shrink: true }}
                error={!!errorPicker && errorPicker.includes("fin")}
                helperText={errorPicker && errorPicker.includes("fin") ? errorPicker : ""}
              />
            </Grid>
          </Grid>

          {/* Filtros rápidos */}
          <Box sx={{ marginTop: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Filtros Rápidos
            </Typography>
            <StyledButton fullWidth onClick={() => setQuickFilter("today")}>
              Hoy
            </StyledButton>
            <StyledButton fullWidth onClick={() => setQuickFilter("thisWeek")}>
              Esta Semana
            </StyledButton>
            <StyledButton fullWidth onClick={() => setQuickFilter("lastWeek")}>
              Semana Anterior
            </StyledButton>
            <StyledButton fullWidth onClick={() => setQuickFilter("thisMonth")}>
              Este Mes
            </StyledButton>
            <StyledButton fullWidth onClick={() => setQuickFilter("lastMonth")}>
              Mes Anterior
            </StyledButton>
          </Box>

          {/* Botones de acciones */}
          <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
            <Button
              variant="text"
              onClick={handleClear}
              sx={{
                textTransform: "none",
                color: "#488b8f",
                "&:hover": {
                  color: "#376b6d",
                },
              }}
            >
              Limpiar
            </Button>
            <StyledApplyButton 
            onClick={handleClosePicker}
            disabled={!!errorPicker}
            >Aplicar</StyledApplyButton>
          </Box>
        </Box>
      </Popover>


   


      <Box
        sx={{ ...tableWrapperSx }}
      >
        <CustomDataGrid
          rows={summary}
          columns={columns}
          pageSize={15}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          disableColumnMenu
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
                No hay resumenes de negociación registrados
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
                        if(data){
                          const backPage = page - 1;
                          const currentParams = new URLSearchParams(window.location.search);
                          currentParams.set("page", backPage); // Establecer la nueva página
                          if (currentParams.has('emitter') &&
                          currentParams.has('startDate') &&
                          currentParams.has('endDate') &&
                          currentParams.has('page'))
                            {
                              console.log("Navegación con filtros activos");
                              console.log('atras')
                              window.history.pushState(null, "", `?${currentParams.toString()}`);
                              setPage(page - 1);
                              
                              fetchFilteredData() 
                              
                            }
                            else{
                              window.history.pushState(null, "", `?${currentParams.toString()}`);
                              fetch({
                                page: page - 1,
                                ...(Boolean(filter) && { [filter]: query }),
                              });
                              
                              setPage(page - 1);
                            }
                          
                         
                          

                        }
                        
                        
                       
                        
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
                      const nextPage = page + 1;
                      const currentParams = new URLSearchParams(window.location.search);
                      currentParams.set("page", nextPage); // Establecer la nueva página
                      if (page < dataCount / 15) {
                        if(data){
                          console.log('fetch hacia adelante')
                          
                          
                          console.log(currentParams.toString())
                          const pagea = currentParams.get("page");
                          const ida = currentParams.get("opId");
                          const modea = currentParams.get("mode");
                          const emittera = currentParams.get("emitter");
                          const startDatea = currentParams.get("startDate");
                          const endDatea = currentParams.get("endDate")
                          if (emittera!="" &&
                            currentParams.has('emitter') &&
                          currentParams.has('startDate') &&
                          currentParams.has('endDate') &&
                          currentParams.has('page'))
                            {
                              console.log("Navegación con filtros activos");
                              console.log('adelante')
                              window.history.pushState(null, "", `?${currentParams.toString()}`);
                              setPage(page + 1);
                             
                             
                            }
                            else if (emittera=="" && startDatea!="" && currentParams.has('startDate') &&
                            currentParams.has('endDate') &&
                            currentParams.has('page'))
                              {
                                console.log("Navegación con filtros activos");
                                console.log('adelante')
                                window.history.pushState(null, "", `?${currentParams.toString()}`);
                                setPage(page + 1);
                               fetchFilteredData()
                               
                              }
                            else{
                              console.log('else aqui')
                              window.history.pushState(null, "", `?${currentParams.toString()}`);
                              fetch({
                                page: page + 1,
                                ...(Boolean(filter) && { [filter]: query }),
                              });
                              
                              setPage(page + 1);
                            }
                          
                         
                        }
                       
                        
                        
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
        <TitleModal
          open={open}
          handleClose={handleClose}
          containerSx={{
            width: "70%",
            height: "60%",
          }}
          title={"Resumen de negociación (PDF)"}
        >
          <Box
            display="flex"
            flexDirection="column"
            mt={5}
            sx={{ ...scrollSx }}
            height="50vh"
            alignItems="center"
          >
            {loadingNegotiationSummary && (
              <CircularProgress style={{ color: "#488B8F" }} />
            )}
            {dataNegotiationSummary && dataNegotiationSummary?.pdf && (
              <iframe
                src={`data:application/pdf;base64,${dataNegotiationSummary?.pdf}`}
                width="100%"
                height="100%"
              />
            )}
          </Box>
        </TitleModal>
      </Box>
    </>
  );
};
