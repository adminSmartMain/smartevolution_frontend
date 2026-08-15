import MuiTextField from "@styles/fields";

import HelperText from "@styles/helperText";

export default function EmailClientSelect({ formik, option }) {


    return (

        <>
         <MuiTextField
                        id="email"
                        placeholder="Ingresa tu correo electrónico"
                        name="email"
                        type="email"
                        variant="standard"
                        margin="normal"
                        fullWidth
                        disabled={option === "preview"}
                        value={formik?.values.email}
                        InputProps={{
                          disableUnderline: true,
                          sx: {
                            marginTop: "-5px",
                          },
                        }}
                        onChange={formik?.handleChange}
                        error={
                          formik?.touched.email && Boolean(formik?.errors.email)
                        }
                        sx={
                          formik?.touched.email && Boolean(formik?.errors.email)
                            ? { border: "1.4px solid #E6643180" }
                            : null
                        }
                      />
                      <HelperText>
                        {formik?.touched.email && formik?.errors.email}
                      </HelperText>
        </>
    )}