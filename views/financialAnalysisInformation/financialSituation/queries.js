import Axios from "axios";

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxOTQyMjk1OTkyLCJpYXQiOjE2Nzk0OTU5OTIsImp0aSI6IjU4OTc5YzVmYTgxODRlN2M4Y2NkNWJkNmYyNTc2ZTBlIiwidXNlcl9pZCI6ImU3OTkxZTQwLTE2ODQtNGZlOC05ZDcyLTU0NjMzMTM0MzEzZiIsIm5hbWUiOiJzbWFydCAgYWRtaW4iLCJyb2xlcyI6WyJzdXBlcnVzZXIiXSwiaXNfc3VwZXJ1c2VyIjp0cnVlfQ.eU3R88ps423NGzPieEX36OMPyvLVjqNq7IZz-SuOmOs";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Get Financial Profile by ID
export const GetFinancialProfileById = async (id) => {
  const res = await Axios.get(`${API_URL}/financialProfile/${id}/3`, {
    headers: {
      authorization: "Bearer " + localStorage.getItem("access-token"),
    },
  });
  return res.data;
};


// Get Customer By ID
export const GetCustomerById = async (id) => {
  const res = await Axios.get(`${API_URL}/client/${id}`, {
    headers: {
      authorization: "Bearer " + localStorage.getItem("access-token"),
    },
  });
  return res.data;
};
export const UpdateFinancialCentral = async (
  clientId,
  qualitativeOverview,
  financialAnalisis,
  financialCentralsData
) => {
  const res = await Axios.patch(
    `${API_URL}/financialProfile/${clientId}`,
    {
      clientId: clientId,
      analisis: {
        client: clientId,
        qualitativeOverview: qualitativeOverview,
        financialAnalisis: financialAnalisis,
      },
      financialCentrals: financialCentralsData,
    },
    {
      headers: {
        authorization: "Bearer " + localStorage.getItem("access-token"),
      },
    }
  );
  return res.status;
};