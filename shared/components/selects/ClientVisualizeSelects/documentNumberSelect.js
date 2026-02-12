import MuiTextField from "@styles/fields";

import HelperText from "@styles/helperText";



export default function DocumentNumberSelect({ formik, option}) {

    return (
<>

                                  <MuiTextField
                                  id="document_number"
                                  placeholder="Ingresa tu identificación"
                                  name="document_number"
                                  type="text"
                                  variant="standard"
                                  margin="normal"
                                  fullWidth
                                  disabled={option !== "register"}
                                  value={formik?.values.document_number}
                                  InputProps={{
                                    disableUnderline: true,
                                    sx: {
                                      marginTop: "-5px",
                                    },
                                  }}
                                  onChange={formik?.handleChange}
                                  error={
                                    formik?.touched.document_number &&
                                    Boolean(formik?.errors.document_number)
                                  }
                                  sx={
                                    formik?.touched.document_number &&
                                    Boolean(formik?.errors.document_number)
                                      ? { border: "1.4px solid #E6643180" }
                                      : null
                                  }
                                />
                                <HelperText>
                                  {formik?.touched.document_number &&
                                    formik?.errors.document_number}
                                </HelperText>
</>

        
    );

}
