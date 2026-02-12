
import MuiTextField from "@styles/fields";

import HelperText from "@styles/helperText";


export default function NombreClientSelect({ formik, option}) { 

    return (

        <>
        <MuiTextField
                          id="first_name"
                          placeholder="Ingresa tu nombre"
                          name="first_name"
                          type="text"
                          variant="standard"
                          margin="normal"
                          fullWidth
                          disabled={option === "preview"}
                          value={formik?.values.first_name}
                          InputProps={{
                            disableUnderline: true,
                            sx: {
                              marginTop: "-5px",
                            },
                          }}
                          onChange={formik?.handleChange}
                          error={
                            formik?.touched.first_name &&
                            Boolean(formik?.errors.first_name)
                          }
                          sx={
                            formik?.touched.first_name &&
                            Boolean(formik?.errors.first_name)
                              ? { border: "1.4px solid #E6643180" }
                              : null
                          }
                        />
                        <HelperText>
                          {formik?.touched.first_name &&
                            formik?.errors.first_name}
                        </HelperText>
        
        </>
    )}
