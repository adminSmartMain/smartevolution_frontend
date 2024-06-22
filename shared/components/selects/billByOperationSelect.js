import { useEffect, useState } from "react";

import Clear from "@mui/icons-material/Clear";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Autocomplete, Box, Button } from "@mui/material";

import { useFetch } from "@hooks/useFetch";

import MuiTextField from "@styles/fields";
import InputTitles from "@styles/inputTitles";

import { BillsByOperation } from "./queries";

export default function BillByOperationSelect({
  formik,
  customer,
  marginLeft,
  marginTop,
  width,
}) {
  // Hooks
  const {
    fetch: fetch,
    loading: loading,
    error: error,
    data: data,
  } = useFetch({ service: BillsByOperation, init: false });

  const [values, setValues] = useState([]);

  const options1 = { style: "currency", currency: "COP" };

  useEffect(() => {
    if (formik.values.operation) {
      fetch(formik.values.operation);
    }
  }, [formik.values.operation]);

  useEffect(() => {
    if (data) {
      let bills = [];
      data.data.map((data) => {
        const value = `${data.billId}`;
        bills.push({ label: value, value: data.id, opAmount: data.opAmount });
      });
      setValues(bills);
    }
  }, [data, loading, error]);

  useEffect(() => {
    const amount = values.filter(
      (option) => option.value === formik.values.bill
    )[0]?.opAmount;
    formik.setFieldValue("payedAmount", amount);
  }, [formik.values.bill]);

  return (
    <Box
      sx={{
        marginLeft: marginLeft ? marginLeft : 0,
        marginTop: marginTop ? marginTop : 0,
      }}
    >
      <Box>
        <InputTitles marginBottom={2}>FACTURA</InputTitles>
        <Box>
          <Autocomplete
            id="bill"
            disablePortal
            options={values}
            getOptionLabel={(option) => option.label}
            onChange={(e, value) => {
              if (value !== null) {
                formik.setFieldValue("bill", value.value);
              } else {
                formik.setFieldValue("bill", null);
              }
            }}
            color="#5EA3A3"
            inputValue={
              values.filter((option) => option.value === formik.values.bill)[0]
                ?.label
            }
            value={
              values.filter(
                (option) => option.value === formik.values.bill
              )[0] || null
            }
            popupIcon={<KeyboardArrowDownIcon sx={{ color: "#5EA3A3" }} />}
            clearIcon={<Clear sx={{ color: "#5EA3A3" }} />}
            renderInput={(params) => (
              <MuiTextField
                variant="standard"
                {...params}
                name="bill"
                placeholder={"Factura"}
                value={formik.values.bill}
                error={formik.touched.bill && Boolean(formik.errors.bill)}
                sx={
                  formik.touched.bill && Boolean(formik.errors.bill)
                    ? {
                        border: "1.4px solid #E6643180",
                        width: "17vw",
                        "@media (max-height: 900px)": {
                          width: "17vw",
                        },
                      }
                    : {
                        width: "17vw",
                        "@media (max-height: 900px)": {
                          width: "17vw",
                        },
                      }
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
        </Box>
      </Box>
    </Box>
  );
}
