import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import MuiTextField from "@styles/fields";

import HelperText from "@styles/helperText";




export default function DatePickerSelect({ formik, option,handleChangeDate,valueDate }) {
    return (

        <>
        

         <LocalizationProvider dateAdapter={AdapterDayjs}>
        
                                  
                                      <DesktopDatePicker
                                  label="Date desktop"
                                  inputFormat="MM/DD/YYYY"
                                  value={valueDate}
                                  onChange={handleChangeDate}
                                  renderInput={(params) => (
                                    <MuiTextField
                                      id="birth_date"
                                      placeholder="Selecciona la fecha"
                                      name="birth_date"
                                      type="date"
                                      variant="standard"
                                      margin="normal"
                                      fullWidth
                                      disabled={option === "preview"}
                                      value={formik?.values.birth_date}
                                      InputProps={{
                                        disableUnderline: true,
                                        sx: {
                                          marginTop: "-5px",
                                        },
                                      }}
                                      onChange={formik?.handleChange}
                                      error={
                                        formik?.touched.birth_date &&
                                        Boolean(formik?.errors.birth_date)
                                      }
                                      sx={
                                        formik?.touched.birth_date &&
                                        Boolean(formik?.errors.birth_date)
                                          ? { border: "1.4px solid #E6643180" }
                                          : null
                                      }
                                    />
                                  )}
                                />
                               
                              </LocalizationProvider>
                              <HelperText>
                                {formik?.touched.birth_date && formik?.errors.birth_date}
                              </HelperText>
        </>
    )}
