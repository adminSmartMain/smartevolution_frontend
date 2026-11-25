import { getAccessToken } from "@lib/auth/session";
import Axios from "axios";

const readToken = () => getAccessToken();

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const Departments = async (data) => {
  const res = await Axios.get(`${API_URL}/department`, {
    headers: {
      authorization: `Bearer ${readToken()}`,
    },
  });
  return res.data;
};

export const Cities = async (data) => {
  const res = await Axios.get(`${API_URL}/city/${data.department}`, {
    headers: {
      authorization: `Bearer ${readToken()}`,
    },
  });
  return res.data;
};



export const IdentityType = async (data) => {
  const res = await Axios.get(`${API_URL}/type_identity/`, {
    headers: {
      authorization: `Bearer ${readToken()}`,
    },
  });
  return res.data;
};

export const Broker = async (data) => {
  const res = await Axios.get(`${API_URL}/broker/`, {
    headers: {
      authorization: "Bearer " + getAccessToken(),
    },
  });
  return res.data;
};

export const ClientType = async (data) => {
  const res = await Axios.get(`${API_URL}/type_client/`, {
    headers: {
      authorization: `Bearer ${readToken()}`,
    },
  });
  return res.data;
};
export const CIIU = async (data) => {
  const res = await Axios.get(`${API_URL}/ciiu/`, {
    headers: {
      authorization: `Bearer ${readToken()}`,
    },
  });
  return res.data;
};

export const Citizenship = async (data) => {
  const res = await Axios.get(`${API_URL}/country/`, {
    headers: {
      authorization: `Bearer ${readToken()}`,
    },
  });
  return res.data;
};

export const Clients = async (data) => {
  const res = await Axios.get(`${API_URL}/client/all`, {
    headers: {
      authorization: "Bearer " + getAccessToken(),
    },
  });
  return res.data;
};



export const operationById = async (data) => {
  const res = await Axios.get(`${API_URL}/preOperation/${data.id}`, {
    headers: {
      authorization: `Bearer ${readToken()}`,
    },
  });
  return res.data;
};


export const getAllOperations  = async (data) => {
  const res = await Axios.get(`${API_URL}/preOperation/`, {
    headers: {
      authorization: `Bearer ${readToken()}`,
    },
  });
  return res.data;
};

export const AccountsFromClient = async (data) => {
  const res = await Axios.get(`${API_URL}/account/client/${data.client}`, {
    headers: {
      authorization: "Bearer " + getAccessToken(),
    },
  });
  return res.data;
};
export const AccountTypes = async (data) => {
  const res = await Axios.get(`${API_URL}/account_type/`, {
    headers: {
      authorization: `Bearer ${readToken()}`,
    },
  });
  return res.data;
};
export const AccountTypes2 = async (data) => {
  const res = [{ description: "Primaria" }, { description: "Secundaria" }];
  return res;
};
export const State = async (data) => {
  const res = [{ description: "Activo" }, { description: "Inactivo" }];
  return res;
};

export const Banks = async (data) => {
  const res = await Axios.get(`${API_URL}/bank/`, {
    headers: {
      authorization: "Bearer " + getAccessToken(),
    },
  });
  return res.data;
};

export const ListBanks = async (data) => {
  const res = await Axios.get(`${API_URL}/bank/`, {
    headers: {
      authorization: `Bearer ${readToken()}`,
    },
  });
  return res.data;
};

export const Egresses = async (data) => {
  const res = await Axios.get(`${API_URL}/type_expenditure/`, {
    headers: {
      authorization: "Bearer " + getAccessToken(),
    },
  });
  return res.data;
};

export const AccountingAccounts = async (data) => {
  const res = await Axios.get(`${API_URL}/accounting_account/all`, {
    headers: {
      authorization: "Bearer " + getAccessToken(),
    },
  });
  return res.data;
};

export const TypeOperation = async (data) => {
  const res = await Axios.get(`${API_URL}/type_operation`, {
    headers: {
      authorization: "Bearer " + getAccessToken(),
    },
  });
  return res.data;
};

export const OperationsByClient = async (data) => {
  const res = await Axios.get(`${API_URL}/preOperation/emitter/${data}`, {
    headers: {
      authorization: "Bearer " + getAccessToken(),
    },
  });
  return res.data;
};

export const Bills = async (data) => {
  if (data) {
    const res = await Axios.get(`${API_URL}/bill/${data}`, {
      headers: {
        authorization: "Bearer " + getAccessToken(),
      },
    });
    return res.data;
  }
};

export const BillsByOperation = async (data) => {
  const res = await Axios.get(`${API_URL}/bill?opId=${data}`, {
    headers: {
      authorization: "Bearer " + getAccessToken(),
    },
  });
  return res.data;
};

export const BrokerByClient = async (data) => {
  const res = await Axios.get(`${API_URL}/broker/client/${data}`, {
    headers: {
      authorization: "Bearer " + getAccessToken(),
    },
  });
  return res.data;
};

export const payerByBill = async (data) => {
  const res = await Axios.get(`${API_URL}/bill?payerId=${data}`, {
    headers: {
      authorization: "Bearer " + getAccessToken(),
    },
  });
  return res.data;
};

export const billById = async (data) => {
  const res = await Axios.get(`${API_URL}/bill?reBuy=${data}`, {
    headers: {
      authorization: "Bearer " + getAccessToken(),
    },
  });
  return res.data;
};

export const typeReceipt = async (data) => {
  const res = await Axios.get(`${API_URL}/type_receipt`, {
    headers: {
      authorization: "Bearer " + getAccessToken(),
    },
  });
  return res.data;
};

export const receiptStatus = async (data) => {
  const res = await Axios.get(`${API_URL}/receipt_status`, {
    headers: {
      authorization: "Bearer " + getAccessToken(),
    },
  });
  return res.data;
};
