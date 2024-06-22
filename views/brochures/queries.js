import Axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const GetBrochureList = async (type, params) => {
  const res = await Axios.get(`${API_URL}/selfManagement/${type}`, {
    headers: {
      authorization: "Bearer " + localStorage.getItem("access-token"),
    },
    params,
  });
  return res.data;
};

export const GetBrochureListByQuery = async (type, page) => {
  const res = await Axios.get(
    `${API_URL}/selfManagement/${type}?page=${page}`,
    {
      headers: {
        authorization: "Bearer " + localStorage.getItem("access-token"),
      },
    }
  );
  return res.data;
};

export const DeleteBrochureById = async (type, id) => {
  const res = await Axios.delete(`${API_URL}/selfManagement/${type}/${id}`, {
    headers: {
      authorization: "Bearer " + localStorage.getItem("access-token"),
    },
  });
  return res.data;
};

export const AcceptBrochureById = async (type, id) => {
  const res = await Axios.patch(
    `${API_URL}/selfManagement/${type}/${id}`,
    {
      status: 1,
    },
    {
      headers: {
        authorization: "Bearer " + localStorage.getItem("access-token"),
      },
    }
  );
  return res.data;
};

export const RejectBrochureById = async (type, id) => {
  const res = await Axios.patch(
    `${API_URL}/selfManagement/${type}/${id}`,
    {
      status: 2,
    },
    {
      headers: {
        authorization: "Bearer " + localStorage.getItem("access-token"),
      },
    }
  );
  return res.data;
};

export const ReviewBrochureById = async (type, id) => {
  const res = await Axios.patch(
    `${API_URL}/selfManagement/${type}/${id}`,
    {
      status: 0,
    },
    {
      headers: {
        authorization: "Bearer " + localStorage.getItem("access-token"),
      },
    }
  );
  return res.data;
};

export const GetNaturalClientPDF = async (id) => {
  const res = await Axios.get(
    `${API_URL}/selfManagement/naturalClient?id=${id}`,
    {
      headers: {
        authorization: "Bearer " + localStorage.getItem("access-token"),
      },
    }
  );
  return res.data;
};

export const GetLegalClientPDF = async (id) => {
  const res = await Axios.get(
    `${API_URL}/selfManagement/legalClient?id=${id}`,
    {
      headers: {
        authorization: "Bearer " + localStorage.getItem("access-token"),
      },
    }
  );
  return res.data;
};

export const SendSignature = async (id, typeClient) => {
  const res = await Axios.post(
    `${API_URL}/selfManagement/${typeClient}?id=${id}`,
    {
      headers: {
        authorization: "Bearer " + localStorage.getItem("access-token"),
      },
    }
  );
  return res.data;
};
