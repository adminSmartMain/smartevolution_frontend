
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import MuiTextField from "@styles/fields";

import HelperText from "@styles/helperText";



export default function LegalRepresentativeNacimientoSelect({ formik, option,handleChange,valueD }) {

    return (
        <>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DesktopDatePicker
                            label="Date desktop"
                            inputFormat="MM/DD/YYYY"
                            value={valueD}
                            onChange={handleChange}
                            renderInput={(params) => (
                              <MuiTextField
                                id="legal_representative.birth_date"
                                placeholder="Ingresa la fecha"
                                name="legal_representative.birth_date"
                                type="date"
                                variant="standard"
                                margin="normal"
                                fullWidth
                                disabled={option === "preview"}
                                value={
                                  formik?.values.legal_representative?.birth_date
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
                                    ?.birth_date &&
                                  Boolean(
                                    formik?.errors.legal_representative
                                      ?.birth_date
                                  )
                                }
                                sx={
                                  formik?.touched.legal_representative
                                    ?.birth_date &&
                                  Boolean(
                                    formik?.errors.legal_representative
                                      ?.birth_date
                                  )
                                    ? { border: "1.4px solid #E6643180" }
                                    : null
                                }
                              />
                            )}
                          />
                        </LocalizationProvider>

                        <HelperText>
                          {formik?.touched.legal_representative?.birth_date &&
                            formik?.errors.legal_representative?.birth_date}
                        </HelperText>
        </>
    )}