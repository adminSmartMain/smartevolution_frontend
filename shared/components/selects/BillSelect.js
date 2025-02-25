import { useEffect, useState } from "react";
import Clear from "@mui/icons-material/Clear";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Autocomplete, Box, Button } from "@mui/material";
import { Toast } from "@components/toast";
import { useFetch } from "@hooks/useFetch";
import MuiTextField from "@styles/fields";
import InputTitles from "@styles/inputTitles";
import { Bills, billById, payerByBill } from "./queries";

export default function BillSelect({
  formik,
  customer,
  marginLeft,
  marginTop,
  width,
  setIsCreatingBill,
  isEditing,
  disabled,
  reset,
  preview,
}) {
  // Hooks
  const {
    fetch: fetch,
    loading: loading,
    error: error,
    data: data,
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

  const [values, setValues] = useState([]);
  const [isAddingBill, setIsAddingBill] = useState(false);
  const [id, setId] = useState("");
  const [investorId, setInvestorId] = useState("");

  const options1 = { style: "currency", currency: "COP" };
  const numberFormat1 = new Intl.NumberFormat("es-ES", options1);

  useEffect(() => {
    if (formik.values.emitter) {
      console.log(formik.values.emitter)
      fetch(formik.values.emitter);
      setId(formik.values.emitter);
    }
  }, [formik.values.emitter]);

  useEffect(() => {
    if (id) {
      fetch(id);
    }
  }, [reset, formik.values.investor]);

  useEffect(() => {
    if (data) {
      let bills = [];
      if (data !== undefined) {
        data?.data?.map((item) => {
          if (isEditing || preview) {
            const value = `${item.billId} - ${numberFormat1
              .format(item.currentBalance)
              .replace("COP", "")}`;
  
            bills.push({
              label: value,
              value: item.id,
              integrationCode: item.integrationCode ? item.integrationCode : "",
            });
          } else {
            if (item.currentBalance > 0) {
              const value = `${item.billId} - ${numberFormat1
                .format(item.currentBalance)
                .replace("COP", "")}`;
              bills.push({
                label: value,
                value: item.id,
                integrationCode: item.integrationCode ? item.integrationCode : "",
              });
            }
          }
        });
        setValues(bills);
      }
    }
  }, [data, loading, error]);
  
  

  useEffect(() => {
    if (formik.values.bill) {
      const bill = data?.data?.find((bill) => bill.id === formik.values.bill);
      if (
        formik.values.integrationCode != bill?.integrationCode &&
        formik.values.integrationCode != ""
      ) {
        Toast(
          "El código de integración debe coincidir con el de la factura previa",
          "error"
        );
        formik.setFieldValue("bill", null);
      } else {
        fetchPayer(formik.values.bill);

        if (bill?.reBuyAvailable && !preview) {
          fetchBill(formik.values.bill);
        }
        // get the bill data from the first query
        formik.setFieldValue("DateBill", bill?.dateBill);
        formik.setFieldValue("DateExpiration", bill?.expirationDate);
        formik.setFieldValue("probableDate", bill?.expirationDate);
        formik.setFieldValue("amount", bill?.currentBalance);
        formik.setFieldValue("payedAmount", bill?.currentBalance);
        formik.setFieldValue(
          "integrationCode",
          bill?.integrationCode ? bill?.integrationCode : ""
        );
      }
    }
  }, [formik.values.bill]);

  useEffect(() => {
    if (dataPayer) {
      if (!formik.values.payer) formik.setFieldValue("payer", dataPayer.data);
    }
  }, [dataPayer]);

  useEffect(() => {
    if (dataBill) {
      if (dataBill?.data?.bill?.reBuyAvailable && !preview) {
        formik.setFieldValue("isRebuy", true);
        formik.setFieldValue("isReBuy", true);
        formik.setFieldValue("discountTax", dataBill?.data?.discountTax);
        formik.setFieldValue("investorTax", dataBill?.data?.discountTax);
      }
    }
  }, [errorBill, dataBill]);

  return (
    <Box
      sx={{
        marginLeft: marginLeft ? marginLeft : 0,
        marginTop: marginTop ? marginTop : 0,
      }}
    >
      <Box>
        <InputTitles marginBottom={2}>FACTURA</InputTitles>
        <Box sx={{ display: isAddingBill ? "none" : "flex" }}>
          <Autocomplete
            id="bill"
            disablePortal
            disabled={disabled}
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
                        width: "14.5vw",
                        "@media (max-height: 900px)": {
                          width: "16.5vw",
                        },
                      }
                    : {
                        width: "14.5vw",
                        "@media (max-height: 900px)": {
                          width: "16.5vw",
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
          <Box
            sx={{
              color: "#5EA3A3",
              border: "1.4px solid #5EA3A3",
              width: "35px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "5px",
              marginRight: "2rem",
              height: "33px",
              marginTop: "2px",
            }}
            onClick={() => {
              !disabled ? setIsCreatingBill(true) : null;
            }}
          >
            <i className="fa-solid fa-plus"></i>
          </Box>
        </Box>
      </Box>
    </Box>
  );
} 