import { useEffect, useState } from "react";

import Head from "next/head";

import { useFetch } from "@hooks/useFetch";

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
  });

  const [commission, setCommission] = useState(0);
  const [page, setPage] = useState(1);
  const {
    fetch: getOperationsFetch,
    loading: loadingGetOperations,
    error: errorGetOperations,
    data: dataGetOperations,
  } = useFetch({
    service: () => getOperationsVersionTwo({ ...filters, page }),
    init: true,
  });

  let dataCount = dataGetOperations?.count || 0;

  const filtersHandlers = {
    value: filters,
    set: setFilters,
    get: getOperationsFetch,
    loading: loadingGetOperations,
    error: errorGetOperations,
    data: dataGetOperations?.results || {},
  };

  useEffect(() => {
    setPage(1);
    getOperationsFetch();
  }, [filters.opId, filters.billId, filters.investor]);

  useEffect(() => {
    getOperationsFetch();
  }, [page]);

  useEffect(() => {
    if (dataGetOperations) {
      dataCount = dataGetOperations?.count || 0;
      const preOperations = dataGetOperations.results.filter(
        (x) => x.status <= 3 || x.status == 1
      );

      setFilteredData(preOperations);

      if (preOperations?.length == 0) filtersHandlers.data.calcs = {};
    }
  }, [dataGetOperations]);

  useEffect(() => {
    if (dataGetOperations) {
      const preOperations = dataGetOperations?.results.filter(
        (x) => x.status < 3
      );
      setData(preOperations);
    }
  }, [dataGetOperations, loadingGetOperations, errorGetOperations]);

  return (
    <>
      <Head>
        <title>Consulta de pre-operaciones</title>
        <meta name="description" content="Generated by create next app" />
      </Head>

      <OperationsComponents
        rows={data}
        filtersHandlers={filtersHandlers}
        getOperationsFetch={getOperationsFetch}
        dataGetOperations={dataGetOperations}
        loadingGetOperations={loadingGetOperations}
        page={page}
        setPage={setPage}
        dataCount={dataCount}
      />
    </>
  );
}
