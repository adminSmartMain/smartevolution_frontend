import MuiTextField from "@styles/fields";

import HelperText from "@styles/helperText";


export default function LegalRepresentativeDocumentNumberSelect({ formik, option }) {

    return (
        <>
            <MuiTextField
                          id="legal_representative.document_number"
                          placeholder="Ingresa su identificación"
                          name="legal_representative.document_number"
                          type="text"
                          variant="standard"
                          margin="normal"
                          fullWidth
                          disabled={option === "preview"}
                          value={
                            formik?.values.legal_representative?.document_number
                          }
                          InputProps={{
                            disableUnderline: true,
                            sx: {
                              marginTop: "-5px",
                            },
                          }}
                          onChange={formik?.handleChange}
                          error={
                            formik?.touched.legal_representative
                              ?.document_number &&
                            Boolean(
                              formik?.errors.legal_representative
                                ?.document_number
                            )
                          }
                          sx={
                            formik?.touched.legal_representative
                              ?.document_number &&
                            Boolean(
                              formik?.errors.legal_representative
                                ?.document_number
                            )
                              ? { border: "1.4px solid #E6643180" }
                              : null
                          }
                        />
                        <HelperText>
                          {formik?.touched.legal_representative
                            ?.document_number &&
                            formik?.errors.legal_representative?.document_number}
                        </HelperText>
        </>

                          )}