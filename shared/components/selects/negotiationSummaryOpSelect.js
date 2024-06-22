import { useEffect, useState } from "react";

import { useRouter } from "next/router";

import Clear from "@mui/icons-material/Clear";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Autocomplete, Box } from "@mui/material";

import { useFetch } from "@hooks/useFetch";

import MuiTextField from "@styles/fields";
import HelperText from "@styles/helperText";
import InputTitles from "@styles/inputTitles";

import { OperationsByClient } from "./queries";

import { differenceInDays } from "date-fns";

export default function OperationSelect({ formik, disabled, ml, mt }) {
  // Hooks
  const {
    fetch: fetch,
    loading: loading,
    error: error,
    data: data,
  } = useFetch({ service: OperationsByClient, init: false });

  const [id, setID] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (router && router.query) {
      setID(router.query.id);
    }
  }, [router.query]);

  const [operationByClient, setOperationByClient] = useState([]);
  const [operations, setOperations] = useState([]);

  const [canceled, setCanceled] = useState(false);
  const [state, setState] = useState("");

  useEffect(() => {
    fetch(formik.values.client);
  }, [formik.values.client]);

  useEffect(() => {
    if (data) {
      const res = data.data.map((operation) => {
        return {
          label: operation.opId,
          value: operation.id,
          date: operation.opDate,
          expiration: operation.opExpiration,
          opAmount: operation.payedAmount,
        };
      });
      setOperations(res);
      setOperationByClient(res);
    }
  }, [data, loading, error]);

  useEffect(() => {
    const operation = operations.filter(
      (operation) => operation.value === formik.values.operation
    );
    formik.setFieldValue(
      "additionalDays",
      differenceInDays(
        new Date(formik.values.date),
        new Date(operation[0]?.date)
      )
    );
  }, [formik.values.operation, formik.values.date]);

  useEffect(() => {
    const operation = operations.filter(
      (operation) => operation.value === formik.values.operation
    );
    if (
      Date.parse(formik.values.date) <
      Date.parse(new Date(operation[0]?.expiration))
    ) {
      setState("anticipada");
    } else if (
      Date.parse(formik.values.date) >
      Date.parse(new Date(operation[0]?.expiration))
    ) {
      setState("vencida");
    } else {
      setState("vigente");
    }
  }, [formik.values.additionalDays]);

  useEffect(() => {
    const operation = operations.filter(
      (operation) => operation.value === formik.values.operation
    );
    if (Number(formik.values.payedAmount) === Number(operation[0]?.opAmount)) {
      setCanceled(true);
    } else {
      setCanceled(false);
    }
  }, [formik.values.payedAmount, formik.values.operation]);

  useEffect(() => {
    if (canceled) {
      switch (state) {
        case "anticipada":
          formik.setFieldValue(
            "typeReceipt",
            "3d461dea-0545-4a92-a847-31b8327bf033"
          );
          break;
        case "vencida":
          formik.setFieldValue(
            "typeReceipt",
            "62b0ca1e-f999-4a76-a07f-be1fe4f38cfb"
          );
          break;
        default:
          formik.setFieldValue(
            "typeReceipt",
            "db1d1fa4-e467-4fde-9aee-bbf4008d688b"
          );
      }
    } else {
      switch (state) {
        case "anticipada":
          formik.setFieldValue(
            "typeReceipt",
            "edd99cf7-6f47-4c82-a4fd-f13b4c60a0c0"
          );
          break;
        case "vencida":
          formik.setFieldValue(
            "typeReceipt",
            "ed85d2bc-1a4b-45ae-b2fd-f931527d9f7f"
          );
          break;
        default:
          formik.setFieldValue(
            "typeReceipt",
            "d40e91b1-fb6c-4c61-9da8-78d4f258181d"
          );
          break;
      }
    }
  }, [canceled, state]);

  return (
    <Box
      width="17vw"
      sx={{
        marginLeft: ml ? ml : 0,
        marginTop: mt ? mt : 0,
      }}
    >
      <Box>
        <InputTitles marginBottom={2}>Operación</InputTitles>
        <Autocomplete
          id="operation"
          disablePortal
          disabled={disabled}
          options={operationByClient}
          getOptionLabel={(option) => String(option.label)}
          onChange={(e, value) => {
            if (value !== null) {
              formik.setFieldValue("operation", value.value);
            } else {
              formik.setFieldValue("operation", null);
            }
          }}
          value={
            operationByClient.filter(
              (option) => option.value === formik.values.operation
            )[0] || null
          }
          color="#5EA3A3"
          popupIcon={<KeyboardArrowDownIcon sx={{ color: "#5EA3A3" }} />}
          clearIcon={<Clear sx={{ color: "#5EA3A3" }} />}
          renderInput={(params) => (
            <MuiTextField
              variant="standard"
              {...params}
              name="operation"
              id="operation"
              placeholder="Operación"
              value={formik.values.operation}
              error={
                formik.touched.operation && Boolean(formik.errors.operation)
              }
              sx={
                formik.touched.operation && Boolean(formik.errors.operation)
                  ? { border: "1.4px solid #E6643180" }
                  : null
              }
              InputProps={{
                ...params.InputProps,
                disableUnderline: true,
                sx: {
                  marginTop: "-7px",
                },
              }}
            />
          )}
        />
        <HelperText mt={0.8}>
          {formik.touched.operation && formik.errors.operation}
        </HelperText>
      </Box>
    </Box>
  );
}
