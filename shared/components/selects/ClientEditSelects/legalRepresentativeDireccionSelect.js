import MuiTextField from "@styles/fields";

import HelperText from "@styles/helperText";


export default function LegalRepresentativeDireccionSelect({ formik,option }) {


    return (

        <>

        <MuiTextField
                                  id="legal_representative.address"
                                  placeholder="Ingresa su dirección"
                                  name="legal_representative.address"
                                  type="text"
                                  variant="standard"
                                  margin="normal"
                                  fullWidth
                                  disabled={option === "preview"}
                                  value={formik?.values.legal_representative?.address}
                                  InputProps={{
                                    disableUnderline: true,
                                    sx: {
                                      marginTop: "-5px",
                                    },
                                  }}
                                  onChange={formik?.handleChange}
                                  error={
                                    formik?.touched.legal_representative?.address &&
                                    Boolean(formik?.errors.legal_representative?.address)
                                  }
                                  sx={
                                    formik?.touched.legal_representative?.address &&
                                    Boolean(formik?.errors.legal_representative?.address)
                                      ? { border: "1.4px solid #E6643180" }
                                      : null
                                  }
                                />
                                <HelperText>
                                  {formik?.touched.legal_representative?.address &&
                                    formik?.errors.legal_representative?.address}
                                </HelperText>
        
        </>
    )}