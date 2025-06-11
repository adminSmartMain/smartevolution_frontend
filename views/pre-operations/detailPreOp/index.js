// Hooks
import { useEffect, useState } from "react";
import { useBeforeunload } from "react-beforeunload";
// Alerts
import { ToastContainer } from "react-toastify";

import { useRouter } from "next/router";

import { Toast } from "@components/toast";

import { useFetch } from "@hooks/useFetch";

// Components
import { ManageOperationDetails} from "./components";
// Queries
import {
  CreateOperation,
  DeleteOperation,
  GetBillFraction,
  GetLastOperationId,
  GetOperationById,
  GetRiskProfile,
  UpdateOperation,
  Clients,GetAllUsers
} from "./queries";
import { Bills, billById, payerByBill } from "./queries";
// Utils
import { PV } from "@formulajs/formulajs";
import { addDays, differenceInDays, format, subDays } from "date-fns";
import { useFormik } from "formik";

export const ManageOperationV = () => {
  // States
  const [created, setCreated] = useState(0);
  const [updated, setUpdated] = useState(0);
  const [opId, setOpId] = useState(null);
  const [id, setId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [operation, setOperation] = useState([]);
  const [isAddingBill, setIsAddingBill] = useState(false);
  const [isCreatingBill, setIsCreatingBill] = useState(false);
  const [users, setUsers] = useState([]);
 
  // Router
  const router = useRouter();
  console.log(router.query)
  // Queries
const {
      fetch: fetchAllUsers,
      loading: loadingAllUsers,
      error: errorAllUsers,
      data: dataAllUsers,
    } = useFetch({ service: GetAllUsers, init: true });

    const {
      fetch: fetch,
      loading: loading,
      error: error,
      data: data,
    } = useFetch({ service: Clients, init: true });

  const {
      fetch: fetchBills,
      loading: loadingBills,
      error: errorBills,
      data: dataBills,
    } = useFetch({ service: Bills, init: false });

  // get the payer of the bill
  const {
    fetch: fetchPayer,
    loading: loadingPayer,
    error: errorPayer,
    data: dataPayer,
  } = useFetch({ service: payerByBill, init: false });

  // get the bill info
  const {
    fetch: fetchBill,
    loading: loadingBill,
    error: errorBill,
    data: dataBill,
  } = useFetch({ service: billById, init: false });
   

  const {
    fetch: getLastId,
    loading: loadingGetLastId,
    error: errorGetLastId,
    data: dataGetLastId,
  } = useFetch({ service: GetLastOperationId, init: true });

  const {
    fetch: getOperationByIdFetch,
    loading: loadingGetOperationById,
    error: errorGetOperationById,
    data: dataGetOperationById,
  } = useFetch({ service: GetOperationById, init: false });

  const {
    fetch: createOperationFetch,
    loading: loadingCreateOperation,
    error: errorCreateOperation,
    data: dataCreateOperation,
  } = useFetch({ service: CreateOperation, init: false });

  const {
    fetch: getBillFractionFetch,
    loading: loadingGetBillFraction,
    error: errorGetBillFraction,
    data: dataGetBillFraction,
  } = useFetch({ service: GetBillFraction, init: false });

  const {
    fetch: deleteOperationFetch,
    loading: loadingDeleteOperation,
    error: errorDeleteOperation,
    data: dataDeleteOperation,
  } = useFetch({ service: DeleteOperation, init: false });

  const {
    fetch: riskProfileFetch,
    loading: loadingRiskProfile,
    error: errorRiskProfile,
    data: dataRiskProfile,
  } = useFetch({ service: GetRiskProfile, init: false });

  const {
    fetch: updateOperationFetch,
    loading: loadingUpdateOperation,
    error: errorUpdateOperation,
    data: dataUpdateOperation,
  } = useFetch({ service: UpdateOperation, init: false });

  // Detect when the user is editing an operation
  useEffect(() => {
    if (router && router.query) {
      
      if (router.query.id) {
        console.log(router.query)
        setId(router.query.id);
      }

      if (router.query.previousDeleted) {
        
      }
    }
  }, [router.query]);
  console.log(id)

  useEffect(() => {
    if (id) {
      getOperationByIdFetch(id); // Hace la consulta
      setIsEditing(true);
    }
  }, [id]);
  
  useEffect(() => {
    if (dataGetOperationById) {
      setOperation(dataGetOperationById);
    }
  }, [dataGetOperationById]); // Espera a que los datos lleguen
  
 // Get the last operation id
  useEffect(() => {
    if (dataGetLastId) {
      setOpId(dataGetLastId.data);
      
    }
  }, [loadingGetLastId, errorGetLastId, dataGetLastId]);
console.log(opId)
console.log(dataGetOperationById)

const [client, setClient] = useState([]);
//GET CLIENTS (EMITTERS)
  
  useEffect(() => {
    if (data) {
      var Clients = [];
      data.data.map((client) => {
        Clients.push({
          label: client.first_name
            ? client.first_name +
              " " +
              client.last_name +
              " - " +
              client.document_number
            : client.social_reason + " - " + client.document_number,
          value: client.id,
          data:client,
        });
      });
      setClient(Clients);
    }
  }, [data, loading, error]);
  console.log(client)

  useEffect(() => {
    if (dataAllUsers) {
      setUsers(dataAllUsers);
    }
  }, [dataAllUsers]); // Espera a que los datos lleguen


  
return (
  <>
    {opId && <ManageOperationDetails 
              opId={opId}
              emitters={client}
              investors={client}
              dataDetails={operation}
              users={users}
               />}

  </>
);

};
