import Axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getOperationPreviewById = async (id) => {
  const res = await Axios.get(
    `${API_URL}/preOperation/${id}`,
    {
      headers: {
        authorization:
          "Bearer " +
          localStorage.getItem("access-token"),
      },
    }
  );

  return res.data;
};

export const getElectronicSignaturePreview = async ({
  opId,
  investorId,
}) => {
  const res = await Axios.get(
    `${API_URL}/preOperation`,
    {
      headers: {
        authorization:
          "Bearer " +
          localStorage.getItem("access-token"),
      },

      params: {
        opId: "undefined",
        opIdV: opId,
        investor: investorId,
      },
    }
  );

  return res.data;
};