import { useState } from "react";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";

import { useFetch } from "@hooks/useFetch";

import { FinancialStat } from "./components/Content";
import { GetCustomerById } from "./queries";
import store from "./store";

export default () => {
  const [id, setID] = useState("");
  const {
    fetch: fetch,
    loading: loading,
    error: error,
    data: data,
  } = useFetch({ service: GetCustomerById, init: false });

  const tableData = useState(...(data?.periods || []));
  return (
    <Provider store={store}>
      <FinancialStat data={data} fetch={fetch} id={id} setID={setID} />
      <ToastContainer
        position="top-right"
        autoClose={5}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Provider>
  );
};
