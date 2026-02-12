

import MuiTextField from "@styles/fields";
import HelperText from "@styles/helperText";


export default function RazonSocialSelect({ formik,option}) {

    return (

        <>
        
        <MuiTextField
                          id="social_reason"
                          placeholder="Ingresa tu razón social"
                          name="social_reason"
                          type="text"
                          variant="standard"
                          margin="normal"
                          fullWidth
                          disabled={option === "preview"}
                          value={formik?.values.social_reason}
                          InputProps={{
                            disableUnderline: true,
                            sx: {
                              marginTop: "-5px",
                            },
                          }}
                          onChange={formik?.handleChange}
                          error={
                            formik?.touched.social_reason &&
                            Boolean(formik?.errors.social_reason)
                          }
                          sx={
                            formik?.touched.social_reason &&
                            Boolean(formik?.errors.social_reason)
                              ? { border: "1.4px solid #E6643180" }
                              : null
                          }
                        />
                        <HelperText>
                          {formik?.touched.social_reason &&
                            formik?.errors.social_reason}
                        </HelperText>
        
        
        </>


    )}