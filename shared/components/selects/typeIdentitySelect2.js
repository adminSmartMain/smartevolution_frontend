import { useEffect, useState } from "react";

import Clear from "@mui/icons-material/Clear";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Autocomplete, Box } from "@mui/material";

import { useFetch } from "@hooks/useFetch";

import MuiTextField from "@styles/fields";
import HelperText from "@styles/helperText";
import InputTitles from "@styles/inputTitles";

import { IdentityType } from "./queries";

import dayjs from "dayjs";

export default function TypeIDSelect2({ formik, disabled }) {
  // Hooks
  const {
    fetch: fetch,
    loading: loading,
    error: error,
    data: data,
  } = useFetch({ service: IdentityType, init: true });

  const [typeID, setTypeID] = useState([]);

  useEffect(() => {
    if (data) {
      var typesID = [];
      data.data.map((typeID) => {
        typesID.push({ label: typeID.description, value: typeID.id });
      });

      setTypeID(typesID);
    }
  }, [data, loading, error]);

  return (
    <>
   
          <InputTitles marginBottom={1}>Tipo de identificación</InputTitles>
          <Autocomplete
            disablePortal
            disabled={disabled}
            id="legal_representative.type_identity"
            options={typeID}
            getOptionLabel={(option) => option.label}
            onChange={(e, value) => {
              if (value !== null) {
                formik.setFieldValue(
                  "legal_representative.type_identity",
                  value.value
                );
              } else {
                formik.setFieldValue(
                  "legal_representative.type_identity",
                  null
                );
              }
            }}
            color="#5EA3A3"
            value={
              typeID.filter(
                (option) =>
                  option.value ===
                  formik.values.legal_representative?.type_identity
              )[0] || null
            }
            popupIcon={<KeyboardArrowDownIcon sx={{ color: "#5EA3A3" }} />}
            clearIcon={<Clear sx={{ color: "#5EA3A3" }} />}
            renderInput={(params) => (
              <MuiTextField
                variant="standard"
                {...params}
                placeholder="Tipo de identificación"
                error={
                  formik.touched.legal_representative?.type_identity &&
                  Boolean(formik.errors.legal_representative?.type_identity)
                }
                sx={
                  formik.touched.legal_representative?.type_identity &&
                  Boolean(formik.errors.legal_representative?.type_identity)
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
       
        <HelperText >
          {formik.touched.legal_representative?.type_identity &&
            formik.errors.legal_representative?.type_identity}
        </HelperText>
     
    </>
  );
}
