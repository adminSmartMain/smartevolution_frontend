import { useEffect, useState } from "react";
import { Dialog,DialogContent, CircularProgress,Grid,TextField,Divider} from "@mui/material";
import Clear from "@mui/icons-material/Clear";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Autocomplete, Box } from "@mui/material";

import { useFetch } from "@hooks/useFetch";

import MuiTextField from "@styles/fields";
import HelperText from "@styles/helperText";
import InputTitles from "@styles/inputTitles";

import { receiptStatus } from "./queries";

export default function ReceiptStatusSelect({ formik, disabled, ml }) {
  // Hooks
  const {
    fetch: fetch,
    loading: loading,
    error: error,
    data: data,
  } = useFetch({ service: receiptStatus, init: true });

  const [dataReceiptStatus, setDataReceiptStatus] = useState([]);

  useEffect(() => {
    if (data) {
     const receiptStatus = data.data.map((x) => {
        return {label: x.description, value: x.id }
      });

      setDataReceiptStatus(receiptStatus);
    }
  }, [data, loading, error]);

  return (
    <>

         
          <Autocomplete
            disablePortal
            disabled={disabled}
            id="receiptStatus"
      fullWidth
            
            options={dataReceiptStatus}
            getOptionLabel={(option) => option.label}
            onChange={(e, value) => {
              if (value !== null) {
                formik.setFieldValue("receiptStatus", value.value);
              } else {
                formik.setFieldValue("receiptStatus", null);
              }
            }}
          
            value={
              dataReceiptStatus.filter(
                (option) => option.value === formik.values.receiptStatus
              )[0] || null
            }
            popupIcon={<KeyboardArrowDownIcon sx={{ color: "#5EA3A3" }} />}
            clearIcon={<Clear sx={{ color: "#5EA3A3" }} />}
            renderInput={(params) => (
              <TextField
              
                {...params}
                placeholder="Tipo de Recaudo"
                label="Tipo de Recaudo"
                error={
                  formik.touched.receiptStatus &&
                  Boolean(formik.errors.receiptStatus)
                }
                sx={
                  formik.touched.receiptStatus &&
                  Boolean(formik.errors.receiptStatus)
                    ? { border: "1.4px solid #E6643180" }
                    : null
                }
                InputProps={{
                  ...params.InputProps,
                  
                  
                }}
              />
            )}
          />
       
        <HelperText mt={0.8}>
          {formik.touched.receiptStatus && formik.errors.receiptStatus}
        </HelperText>
    
    </>
  );
}
