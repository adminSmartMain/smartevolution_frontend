
import Box from "@mui/material/Box";
import { Button, InputAdornment } from "@mui/material";
import BaseField from "@styles/fields/BaseField";



export default function LegalRepresentativePhoneNumberSelect({ formik,option }) {

    return (
        <>
        <BaseField
                                  fullWidth
                                  id="legal_representative.phone_number"
                                  name="legal_representative.phone_number"
                                  isPatterned
                                  format="## ###########"
                                  mask="_"
                                  disabled={option === "preview"}
                                  placeholder="Ingresa tu número de teléfono"
                                  error={
                                    Boolean(
                                      formik?.errors.legal_representative?.phone_number
                                    ) &&
                                    formik?.touched.legal_representative?.phone_number
                                  }
                                  value={
                                    formik?.values.legal_representative?.phone_number
                                  }
                                  onChangeMasked={(values) => {
                                    formik?.setFieldValue(
                                      "legal_representative.phone_number",
                                      values.floatValue
                                    );
                                  }}
                                  InputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <i className="fa-regular fa-plus"></i>
                                      </InputAdornment>
                                    ),
                                  }}
                                  helperText={
                                    Boolean(
                                      formik?.errors.legal_representative?.phone_number
                                    ) &&
                                    formik?.touched.legal_representative?.phone_number
                                      ? formik?.errors.legal_representative?.phone_number
                                      : null
                                  }
                                />
        </>
    )}