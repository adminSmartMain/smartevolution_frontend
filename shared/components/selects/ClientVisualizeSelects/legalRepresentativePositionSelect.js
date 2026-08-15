

import MuiTextField from "@styles/fields";

import HelperText from "@styles/helperText";

export default function LegalRepresentativePositionSelect ({ formik, option }) {

    return (
        
        <>
        <MuiTextField
                          id="legal_representative.position"
                          placeholder="Ingresa su cargo"
                          name="legal_representative.position"
                          type="text"
                          variant="standard"
                          margin="normal"
                          fullWidth
                          disabled={option === "preview"}
                          value={formik?.values.legal_representative?.position}
                          InputProps={{
                            disableUnderline: true,
                            sx: {
                              marginTop: "-5px",
                            },
                          }}
                          onChange={formik?.handleChange}
                          error={
                            formik?.touched.legal_representative?.position &&
                            Boolean(
                              formik?.errors.legal_representative?.position
                            )
                          }
                          sx={
                            formik?.touched.legal_representative?.position &&
                            Boolean(
                              formik?.errors.legal_representative?.position
                            )
                              ? { border: "1.4px solid #E6643180" }
                              : null
                          }
                        />
                        <HelperText>
                          {formik?.touched.legal_representative?.position &&
                            formik?.errors.legal_representative?.position}
                        </HelperText>
        </>
    )}