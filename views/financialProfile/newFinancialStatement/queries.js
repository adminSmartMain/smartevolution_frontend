import { totals } from "./libs/groups";

import Axios from "axios";

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxOTQyMjk1OTkyLCJpYXQiOjE2Nzk0OTU5OTIsImp0aSI6IjU4OTc5YzVmYTgxODRlN2M4Y2NkNWJkNmYyNTc2ZTBlIiwidXNlcl9pZCI6ImU3OTkxZTQwLTE2ODQtNGZlOC05ZDcyLTU0NjMzMTM0MzEzZiIsIm5hbWUiOiJzbWFydCAgYWRtaW4iLCJyb2xlcyI6WyJzdXBlcnVzZXIiXSwiaXNfc3VwZXJ1c2VyIjp0cnVlfQ.eU3R88ps423NGzPieEX36OMPyvLVjqNq7IZz-SuOmOs";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const changeValueString = (data) => {
  try {
    delete data["user_updated_at"];
    delete data["user_created_at"];
    delete data["created_at"];
    delete data["updated_at"];

    const keys = Object.keys(data);
    const newData = {};
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]; /* The current period. */

      newData[key] = data[key] !== "" ? Number(data[key]) : 0;
    }
    return newData;
  } catch (error) {
    return {};
  }
};

const changeObjectKeys = (data) => {
  const newData = {};
  const keys = Object.keys(data);

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (data[key] !== undefined && data[key] !== null) {
      if (
        key == "passives" ||
        key == "assets" ||
        key == "patrimony" ||
        key == "stateOfResult"
      ) {
        const newKey = "_" + key;
        newData[newKey] = data[key];
      } else {
        newData[key] = data[key];
      }
    }
  }
  return newData;
};

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

export const AddNewPeriod = async (period) => {
  period["assets"] = changeValueString(period["assets"]);
  period["passives"] = changeValueString(period["passives"]);
  period["patrimony"] = changeValueString(period["patrimony"]);
  period["stateOfResult"] = changeValueString(period["stateOfResult"]);

  totals.forEach((totalDoc) => {
    period[totalDoc.group][totalDoc.key] = totalDoc.operation(period);
  });

  const res = await Axios.post(
    `${API_URL}/financialProfile/`,
    {
      periods: [{ ...period, formik: undefined, isNewPeriod: undefined }],
    },
    {
      headers: {
        authorization: "Bearer " + localStorage.getItem("access-token"),
      },
    }
  );
  return res;
};

export const UpdatePeriod = async (
  periodId,
  data,
  isUpdatingColumn = false
) => {
  if (isUpdatingColumn) {
    data["assets"] = changeValueString(data["assets"]);
    data["passives"] = changeValueString(data["passives"]);
    data["patrimony"] = changeValueString(data["patrimony"]);
    data["stateOfResult"] = changeValueString(data["stateOfResult"]);
    totals.forEach((totalDoc) => {
      data[totalDoc.group][totalDoc.key] = totalDoc.operation(data);
    });
  }

  let changedData = {
    ...data,
    formik: "",
  };
  changedData = changeObjectKeys(changedData);

  const res = await Axios.patch(
    `${API_URL}/financialProfile/${periodId}`,
    { ...changedData, clientId: null },
    {
      headers: {
        authorization: "Bearer " + localStorage.getItem("access-token"),
      },
    }
  );
  return res;
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

export const getPeriodsType = async () => {
  const res = await Axios.get(`${API_URL}/type_period`, {
    headers: {
      authorization: "Bearer " + localStorage.getItem("access-token"),
    },
  });
  return res.data;
};
