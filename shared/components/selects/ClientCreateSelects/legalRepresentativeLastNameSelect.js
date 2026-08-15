
import MuiTextField from "@styles/fields";

import HelperText from "@styles/helperText";


export default function LegalRepresentativeLastNameSelect({ formik,option }) {

    return (
        
        <>
                        <MuiTextField
                                  id="legal_representative.last_name"
                                  placeholder="Ingresa su apellido"
                                  name="legal_representative.last_name"
                                  type="text"
                                  variant="standard"
                                  margin="normal"
                                  fullWidth
                                  disabled={option === "preview"}
                                  value={formik?.values.legal_representative?.last_name}
                                  InputProps={{
                                    disableUnderline: true,
                                    sx: {
                                      marginTop: "-5px",
                                    },
                                  }}
                                  onChange={formik?.handleChange}
                                  error={
                                    formik?.touched.legal_representative?.last_name &&
                                    Boolean(
                                      formik?.errors.legal_representative?.last_name
                                    )
                                  }
                                  sx={
                                    formik?.touched.legal_representative?.last_name &&
                                    Boolean(
                                      formik?.errors.legal_representative?.last_name
                                    )
                                      ? { border: "1.4px solid #E6643180" }
                                      : null
                                  }
                                />
                                <HelperText>
                                  {formik?.touched.legal_representative?.last_name &&
                                    formik?.errors.legal_representative?.last_name}
                                </HelperText>
        </>
    )}