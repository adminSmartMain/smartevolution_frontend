import { useEffect, useState, useRef } from "react";
import Head from "next/head";
import { useFetch } from "@hooks/useFetch";
import { useRouter } from 'next/router';
import { OperationsComponents } from "./components";
// queries
import { getOperationsVersionTwo } from "./queries";

export default function Operations() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    opId: "",
    billId: "",
    investor: "",
    status: "",
    startDate: "",
    endDate: ""
  });

  const [commission, setCommission] = useState(0);
  const [page, setPage] = useState(1);
  const [calcs, setCalcs] = useState({});
  const isInitialLoad = useRef(true);
  const searchSource = useRef('manual'); // 'manual' o 'url'

  const router = useRouter();
  const opIdQuery = router.query.opId;

  const {
    fetch: getOperationsFetch,
    loading: loadingGetOperations,
    error: errorGetOperations,
    data: dataGetOperations,
  } = useFetch({
    service: () => getOperationsVersionTwo({ ...filters, page }),
    init: false,
  });

  let dataCount = dataGetOperations?.count || 0;

  // Función para manejar búsquedas manuales
  const handleManualSearch = (newFilters) => {
    searchSource.current = 'manual';
    setFilters(newFilters);
    setPage(1); // Resetear a página 1 al hacer nueva búsqueda
  };

  // Función para limpiar filtros
  const handleClearFilters = () => {
    searchSource.current = 'manual';
    setFilters({
      opId: "",
      billId: "",
      investor: "",
      status: "",
      startDate: "",
      endDate: ""
    });
    setPage(1);
  };

  const filtersHandlers = {
    value: filters,
    set: handleManualSearch, // Usamos nuestra función personalizada
    get: getOperationsFetch,
    loading: loadingGetOperations,
    error: errorGetOperations,
    data: dataGetOperations?.results || {},
    clear: handleClearFilters // Añadimos función para limpiar
  };

  // Efecto para la carga inicial y cuando hay opId en la URL
  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      
      if (opIdQuery) {
        console.log('Búsqueda automática por URL con opId:', opIdQuery);
        searchSource.current = 'url';
        
        // Realizar búsqueda directa sin pasar por setFilters
        getOperationsVersionTwo({ 
          opId: opIdQuery, 
          billId: "",
          investor: "",
          status: "",
          startDate: "",
          endDate: "",
          page: 1 
        })
          .then(response => {
            // Actualizar el estado con los resultados
            if (response.results) {
              setData(response.results);
              setFilteredData(response.results);
              setCalcs(response.results[0]?.calcs || {});
              
              // También actualizamos los filtros para mostrarlo en la UI
              setFilters({
                opId: opIdQuery,
                billId: "",
                investor: "",
                status: "",
                startDate: "",
                endDate: ""
              });
            }
          })
          .catch(error => {
            console.error('Error en búsqueda automática:', error);
          });
      } else {
        // Carga inicial normal sin parámetros URL
        getOperationsFetch();
      }
    }
  }, []); // Solo se ejecuta una vez al montar el componente

  // Efecto para búsquedas manuales (cuando cambian los filtros)
  useEffect(() => {
    // No ejecutar en la carga inicial o si es una búsqueda desde URL
    if (isInitialLoad.current || searchSource.current === 'url') {
      // Si es búsqueda desde URL, resetear la fuente para próximas búsquedas
      if (searchSource.current === 'url') {
        searchSource.current = 'manual';
      }
      return;
    }

    // Para búsquedas manuales, verificamos si hay al menos un filtro activo
    const hasActiveFilter = filters.opId || filters.billId || filters.investor || 
                           filters.status || filters.startDate || filters.endDate;
    
    if (hasActiveFilter) {
      console.log('Búsqueda manual con filtros:', filters);
      getOperationsFetch();
    } else {
      // Si no hay filtros activos, cargar todas las operaciones
      console.log('Sin filtros activos, cargando todas las operaciones');
      getOperationsFetch();
    }
  }, [filters, page]);

  useEffect(() => {
    if (dataGetOperations) {
      dataCount = dataGetOperations?.count || 0;

      const preOperations = dataGetOperations.results;
      setFilteredData(preOperations);

      if (preOperations?.length == 0) {
        // Resetear cálculos si no hay resultados
        setCalcs({});
      }
    }
  }, [dataGetOperations]);

  useEffect(() => {
    if (dataGetOperations) {
      const checkOperations = dataGetOperations?.results.map(row => {
        const opExpiration = new Date(row.opExpiration + " " + "00:00:00");
        const today = new Date();

        if (opExpiration < today && row.status != 4) {
          return {
            ...row,
            status: 5
          }
        }
        return row
      });

      const preOperations = checkOperations;
      setData(preOperations);
      
      // Actualizar cálculos si hay resultados
      if (dataGetOperations.results && dataGetOperations.results.length > 0) {
        setCalcs(dataGetOperations.results[0]?.calcs || {});
      }
    }
  }, [dataGetOperations, loadingGetOperations, errorGetOperations]);

  return (
    <>
      <Head>
        <title>Consulta de operaciones</title>
        <meta name="description" content="Generated by create next app" />
      </Head>

      <OperationsComponents
        rows={data}
        calcs={calcs}
        filtersHandlers={filtersHandlers}
        getOperationsFetch={getOperationsFetch}
        dataGetOperations={dataGetOperations}
        loadingGetOperations={loadingGetOperations}
        page={page}
        setPage={setPage}
        dataCount={dataCount}
        loading={loadingGetOperations}
        opIdFromUrl={opIdQuery}
      />
    </>
  );
}