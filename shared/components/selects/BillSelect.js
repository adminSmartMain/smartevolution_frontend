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
  // Manejo de cambios en el emisor
  console.log('manejo en el emisor')
useEffect(() => {
  if (formik.values.emitter) {
    console.log('Fetching emitter data');
    if (formik.values.emitter !== id) {
      fetch(formik.values.emitter);
      setId(formik.values.emitter);
    }
  }
}, [formik.values.emitter]);

// Manejo de cambios en el ID
console.log('manejo de cambios en el ID')
useEffect(() => {
  if (id) {
    console.log('Fetching data by ID');
    fetch(id);
  }
}, [id]);

// Procesamiento de datos y actualización de facturas
console.log('logica de procesamiento de datos y actualizacion de facturas')
useEffect(() => {
  if (data) {
    console.log('Processing data');
    const bills = data.data
      ?.filter((item) => isEditing || preview || item.currentBalance > 0)
      ?.map((item) => ({
        label: `${item.billId} - ${numberFormat1.format(item.currentBalance)}`.replace("COP", ""),
        value: item.id,
        integrationCode: item.integrationCode || "",
      }));
    setValues(bills || []);
  }
}, [data, isEditing, preview]);

// Manejo de lógica de la factura seleccionada
console.log('logica de la factura seleccionada')
useEffect(() => {
  if (formik.values.bill && data) {
    console.log('Handling bill logic');
    const bill = data?.data?.find((bill) => bill.id === formik.values.bill);
    if (
      formik.values.integrationCode !== bill?.integrationCode &&
      formik.values.integrationCode !== ""
    ) {
      Toast("El código de integración debe coincidir con el de la factura previa", "error");
      formik.setFieldValue("bill", null);
    } else {
      fetchPayer(formik.values.bill);
      if (bill?.reBuyAvailable && !preview) fetchBill(formik.values.bill);

      // Actualizar valores del formik solo si son diferentes
      const updatedFields = {
        DateBill: bill?.dateBill,
        DateExpiration: bill?.expirationDate,
        probableDate: bill?.expirationDate,
        amount: bill?.currentBalance,
        payedAmount: bill?.currentBalance,
        integrationCode: bill?.integrationCode || "",
      };

      Object.keys(updatedFields).forEach((key) => {
        if (formik.values[key] !== updatedFields[key]) {
          formik.setFieldValue(key, updatedFields[key]);
        }
      });
    }
  }
}, [formik.values.bill, data, preview]);
console.log('PayerSelect en BillSelect')
// Manejo del pagador
useEffect(() => {
  if (dataPayer) {
    console.log('Setting payer data');
    if (!formik.values.payer) {
      formik.setFieldValue("payer", dataPayer.data);
    }
  }
}, [dataPayer]);

// Manejo de detalles de la factura
console.log('manejo de detalles de factura')
useEffect(() => {
  if (dataBill) {
    console.log('Processing bill details');
    if (dataBill?.data?.bill?.reBuyAvailable && !preview) {
      const updatedFields = {
        isRebuy: true,
        isReBuy: true,
        discountTax: dataBill?.data?.discountTax,
        investorTax: dataBill?.data?.discountTax,
      };

      Object.keys(updatedFields).forEach((key) => {
        if (formik.values[key] !== updatedFields[key]) {
          formik.setFieldValue(key, updatedFields[key]);
        }
      });
    }
  }
}, [dataBill, preview]);


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
