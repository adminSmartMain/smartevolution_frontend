import MuiTextField from "@styles/fields";

import HelperText from "@styles/helperText";

export default function DirecciónClientSelect({ formik, option }) {


    return (

        <>
         <MuiTextField
                        id="address"
                        placeholder="Ingresa tu dirección"
                        name="address"
                        type="text"
                        variant="standard"
                        margin="normal"
                        fullWidth
                        disabled={option === "preview"}
                        value={formik?.values.address}
                        InputProps={{
                          disableUnderline: true,
                          sx: {
                            marginTop: "-5px",
                          },
                        }}
                        onChange={formik?.handleChange}
                        error={
                          formik?.touched.address &&
                          Boolean(formik?.errors.address)
                        }
                        sx={
                          formik?.touched.address &&
                          Boolean(formik?.errors.address)
                            ? { border: "1.4px solid #E6643180" }
                            : null
                        }
                      />
                      <HelperText>
                        {formik?.touched.address && formik?.errors.address}
                      </HelperText>
        </>
    )}