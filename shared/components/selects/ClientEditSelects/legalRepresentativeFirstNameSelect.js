

import MuiTextField from "@styles/fields";

import HelperText from "@styles/helperText";


export default function LegalRepresentativeFirstNameSelect({ formik, option }) {

    return (

        <>
        
        <MuiTextField
                          id="legal_representative.first_name"
                          placeholder="Ingresa su nombre"
                          name="legal_representative.first_name"
                          type="text"
                          variant="standard"
                          margin="normal"
                          fullWidth
                          disabled={option === "preview"}
                          value={formik?.values.legal_representative?.first_name}
                          InputProps={{
                            disableUnderline: true,
                            sx: {
                              marginTop: "-5px",
                            },
                          }}
                          onChange={formik?.handleChange}
                          error={
                            formik?.touched.legal_representative?.first_name &&
                            Boolean(
                              formik?.errors.legal_representative?.first_name
                            )
                          }
                          sx={
                            formik?.touched.legal_representative?.first_name &&
                            Boolean(
                              formik?.errors.legal_representative?.first_name
                            )
                              ? { border: "1.4px solid #E6643180" }
                              : null
                          }
                        />
                        <HelperText>
                          {formik?.touched.legal_representative?.first_name &&
                            formik?.errors.legal_representative?.first_name}
                        </HelperText>
        </>
    )}