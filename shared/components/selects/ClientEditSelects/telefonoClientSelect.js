import Box from "@mui/material/Box";
import { Button, InputAdornment } from "@mui/material";
import BaseField from "@styles/fields/BaseField";


// ---- Config

export default function TelefonoClientSelect({ formik, option}) {

    return (

        <>
         <BaseField
                        fullWidth
                        id="phone_number"
                        name="phone_number"
                        isPatterned
                        format="## ###########"
                        mask="_"
                        disabled={option === "preview"}
                        placeholder="Ingresa tu número de teléfono"
                        error={
                          Boolean(formik?.errors.phone_number) &&
                          formik?.touched.phone_number
                        }
                        value={formik?.values.phone_number}
                        onChangeMasked={(values) => {
                          formik?.setFieldValue(
                            "phone_number",
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
                          Boolean(formik?.errors.phone_number) &&
                          formik?.touched.phone_number
                            ? formik?.errors.phone_number
                            : null
                        }
                      />
                  
        </>
    )}
