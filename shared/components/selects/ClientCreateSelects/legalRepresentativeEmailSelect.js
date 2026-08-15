

import MuiTextField from "@styles/fields";

import HelperText from "@styles/helperText";


export default function LegalRepresentativeEmailSelect({ formik, option }) {  

    return (

        <>
        <MuiTextField
                          id="legal_representative.email"
                          placeholder="Ingresa su correo electrónico"
                          name="legal_representative.email"
                          type="text"
                          variant="standard"
                          margin="normal"
                          fullWidth
                          disabled={option === "preview"}
                          value={formik?.values.legal_representative?.email}
                          InputProps={{
                            disableUnderline: true,
                            sx: {
                              marginTop: "-5px",
                            },
                          }}
                          onChange={formik?.handleChange}
                          error={
                            formik?.touched.legal_representative?.email &&
                            Boolean(formik?.errors.legal_representative?.email)
                          }
                          sx={
                            formik?.touched.legal_representative?.email &&
                            Boolean(formik?.errors.legal_representative?.email)
                              ? { border: "1.4px solid #E6643180" }
                              : null
                          }
                        />
                        <HelperText>
                          {formik?.touched.legal_representative?.email &&
                            formik?.errors.legal_representative?.email}
                        </HelperText>
        </>
    )}