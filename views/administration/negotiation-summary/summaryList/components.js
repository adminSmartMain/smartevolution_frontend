import { useState } from "react";
import { useEffect } from "react";
import Axios from "axios";
import Link from "next/link";

import { SearchOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Fade,
  IconButton,
  Typography,
  TextField,
} from "@mui/material";

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

import { GetNegotiationSummaryPDF, GetSummaryList } from "./queries";

import moment from "moment";

export const SummaryListComponent = () => {
  const [filter, setFilter] = useState("");
  const [query, setQuery] = useState("");
  const [filterInput, setFilterInput] = useState("");
  const [errorFilter, setError] = useState("");
  const [dataFiltered, setDataFiltered] = useState(null);
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
      width: 150,
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
      width: 200,
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
      width: 200,
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
            href={`/administration/negotiation-summary?modify&id=${params.row.NoOP}&opId=${params.row.id}`}
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
  
  console.log("dataCount:", dataCount);
  

  
  const [page, setPage] = useState(1);
  console.log(dataFiltered)
  console.log(data)
  console.log('dataCount',dataCount)

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
  
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const {
    fetch: fetchNegotiationSummmary,
    loading: loadingNegotiationSummary,
    error: errorNegotiationSummary,
    data: dataNegotiationSummary,
  } = useFetch({ service: GetNegotiationSummaryPDF, init: false });

  const handleNegotiationSummaryClick = (id) => {
    fetchNegotiationSummmary(id);
    handleOpen();
  };


  const API_URL = process.env.NEXT_PUBLIC_API_URL;

   // Leer parámetros iniciales de la URL
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get("id") || "";
    const emitter = searchParams.get("emitter") || "";

    if (emitter) {
      setFilterInput(emitter);
    } else if (id) {
      setFilterInput(id);
    }
  }, []);

  console.log(page)

  const [pageFiltered,setPageFiltered]=useState(1)

  // Actualizar `pageFiltered` cada vez que `page` cambie
  useEffect(() => {
    setPageFiltered(page);
  }, [page]);
  console.log(pageFiltered)


  const handleFilterChange = (e) => {
    setFilterInput(e.target.value);
    
  };

  const isNumber = (value) => {
    return /^\d+$/.test(value); // Comprueba si es un número entero
  };
 


  const fetchFilteredData = async () => {
    let url = `${API_URL}/report/negotiationSummary`;
    let params;
   
    // Si hay un filtro
    if (filterInput !== "") {
      if (isNumber(filterInput)) {
        // Si el filtro es un número, es un filtro por `id`
        params = {
          id: filterInput,
          mode: "filter",
          emitter: "",
         
        };
      } else {
        // Si el filtro es texto, es un filtro por `emitter`
        params = {
          id: "",
          mode: "filter",
          emitter: filterInput,
          page:pageFiltered,
          
        };
      }
    } else {
      
    }
  
    try {
      // Actualizar la URL del navegador con los parámetros
      const searchParams = new URLSearchParams(params);
      window.history.pushState(null, "", `?${searchParams.toString()}`);
  
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





  const [isFirstLoad, setIsFirstLoad] = useState(true); // Controla si es la primera carga o un cambio de página
  const [isFilterApplied, setIsFilterApplied] = useState(false); // Controla si el filtro está aplicado
  
  // Efecto para aplicar el filtro al cargar la página o cuando cambia filterInput
  useEffect(() => {
    if (filterInput !== "") {
      fetchFilteredData(); // Aplica el filtro
      setIsFilterApplied(true); // Marca que el filtro ha sido aplicado
    } else {
      setIsFilterApplied(false); // Si no hay filtro, reseteamos el estado
    }
  }, [filterInput]);
  
  // Efecto para manejar la paginación, que solo se activa después de aplicar el filtro
  useEffect(() => {
    if (!isFirstLoad && isFilterApplied) {
      fetchFilteredData(); // Realiza la búsqueda de la página solo si el filtro está activo
    }
  }, [pageFiltered, isFirstLoad, isFilterApplied]);
  
  // Efecto que se ejecuta al inicio para marcar que es la primera carga y no cambiar el filtro
  useEffect(() => {
    if (isFirstLoad && filterInput !== "") {
      setIsFirstLoad(false); // Después de la primera carga, cambiamos el estado
    }
  }, [isFirstLoad, filterInput]);



  // Función para limpiar filtros
const clearFilters = async () => {
  try {
    // Actualizar la URL eliminando los filtros
    window.history.pushState(null, "", "/administration/negotiation-summary/summaryList");

    // Restablecer el estado de entrada y datos
    setFilterInput(""); // Limpiar el input del filtro
    setPageFiltered(1); // Restablecer la página filtrada a la inicial

    // Realizar la solicitud sin parámetros adicionales
    const response = await fetch()

    setDataFiltered(response.data); // Actualizar los datos mostrados
    setError(""); // Limpiar errores
  } catch (err) {
    setError("Error al limpiar los filtros.");
    console.error("Error al limpiar los filtros:", err);
  }
};
  return (
    <>
      <BackButton path="/administration" />
      <Box
        container
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
      >
        <Typography
          letterSpacing={0}
          fontSize="1.7rem"
          fontWeight="regular"
          marginBottom="0.7rem"
          color="#5EA3A3"
        >
          Consulta de resumen de negociación
        </Typography>
        <Link
          href="/administration/negotiation-summary?register"
          underline="none"
        >
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
              Registrar nuevo resumen de negociación
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
        </Link>
      </Box>
            <Box
        container
        display="flex"
        flexDirection="row"
        justifyContent="flex-end" // Alinea contenido al final (derecha)
        alignItems="center" // Asegura que estén verticalmente alineados
        gap="8px" // Espaciado entre el input y el botón
      >
        <TextField
        label="Ingrese noOp o nombre del emisor"
        variant="outlined"
        value={filterInput}
        onChange={handleFilterChange}
        required
        sx={{
          width: 250,  // Controla el ancho del campo
          height: 40,  // Ajusta la altura
          '& .MuiInputBase-root': {
            borderRadius: '4px',
            padding: '6px 10px',  // Reduce el padding
            height: '40px',  // Ajusta la altura interna del input
          },
          '& .MuiInputLabel-root': {
            fontSize: '0.875rem',  // Tamaño de la etiqueta
          },
          '& .MuiOutlinedInput-root': {
            fontSize: '0.875rem',  // Tamaño de la fuente del input
          },
        }}
      />
      <Button
        onClick={fetchFilteredData}
        variant="contained"
        color="primary"
        sx={{
          padding: '10px 20px',
          borderRadius: '4px',
          fontSize: '0.875rem',
          textTransform: 'none',
          '&:hover': {
            backgroundColor: '#0056b3',
          },
        }}
      >
        Filtrar
      </Button>
      <Button
  onClick={clearFilters}
  variant="outlined"
  color="secondary"
  size="small"
>
  Limpiar Filtros
</Button>
      </Box>

      <Box
        container
        marginTop={4}
        display="flex"
        flexDirection="column"
        width="100%"
        height="100%"
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
                          fetch({
                            page: page - 1,
                            ...(Boolean(filter) && { [filter]: query }),
                          });
                          setPage(page - 1);

                        }else{

                          fetchFilteredData() 
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
                      if (page < dataCount / 15) {
                        if(data){
                          fetch({
                            page: page + 1,
                            ...(Boolean(filter) && { [filter]: query }),
                          });
                          
                          setPage(page + 1);
                        }
                        else{

                          fetchFilteredData() 


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
