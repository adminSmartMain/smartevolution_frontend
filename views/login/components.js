import { VisibilityOffOutlined, VisibilityOutlined } from "@mui/icons-material";
import CircularProgress from "@mui/material/CircularProgress";
import { Box, FormControl, IconButton, InputAdornment, Typography } from "@mui/material";
import React, { useState } from "react";

import MuiButton from "@styles/buttons/button";
import MuiTextField from "@styles/fields";
import HelperText from "@styles/helperText";
import CaptchaGate from "./CaptchaGate";

export const InputAdornments = ({
  formik,
  ToastContainer,
  loading,
  isSubmitting,
  captchaRequired,
  onCaptchaToken,
  cooldownSeconds = 0,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const formDisabled = loading || isSubmitting || cooldownSeconds > 0;
  const fieldStyles = (hasError) => ({
    backgroundColor: "#fff",
    border: hasError ? "1.5px solid #d14343" : "1px solid #c9d6e2",
    borderRadius: 2,
    "&:focus-within": { borderColor: "#008bb8", boxShadow: "0 0 0 3px rgba(0, 139, 184, 0.13)" },
  });

  return (
    <>
      <form onSubmit={(event) => {
        if (formDisabled) {
          event.preventDefault();
          return;
        }
        formik.handleSubmit(event);
      }} noValidate>
        <Box sx={{ mt: 4, width: "100%" }}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <Typography component="label" htmlFor="email" sx={{ color: "#20385d", fontSize: "0.9rem", fontWeight: 500, mb: 0.75 }}>Correo electrónico</Typography>
            <MuiTextField id="email" placeholder="Ingresa tu correo electrónico" name="email" type="email" aria-label="Correo electrónico" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.email} disabled={formDisabled} variant="standard" fullWidth InputProps={{ disableUnderline: true, sx: { px: 2, py: 0.55 } }} error={formik.touched.email && Boolean(formik.errors.email)} sx={fieldStyles(formik.touched.email && Boolean(formik.errors.email))} />
            <HelperText>{formik.touched.email && formik.errors.email}</HelperText>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 1 }}>
            <Typography component="label" htmlFor="password" sx={{ color: "#20385d", fontSize: "0.9rem", fontWeight: 500, mb: 0.75 }}>Contraseña</Typography>
            <MuiTextField id="password" placeholder="Ingresa tu contraseña" aria-label="Contraseña" name="password" type={showPassword ? "text" : "password"} onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.password} disabled={formDisabled} variant="standard" fullWidth error={formik.touched.password && Boolean(formik.errors.password)} sx={fieldStyles(formik.touched.password && Boolean(formik.errors.password))} InputProps={{
              disableUnderline: true,
              sx: { pl: 2, pr: 0.5, py: 0.55 },
              endAdornment: <InputAdornment position="end"><IconButton aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"} onClick={() => setShowPassword((visible) => !visible)} onMouseDown={(event) => event.preventDefault()} disabled={formDisabled} edge="end">{showPassword ? <VisibilityOffOutlined sx={{ color: "#007fa8" }} /> : <VisibilityOutlined sx={{ color: "#007fa8" }} />}</IconButton></InputAdornment>,
            }} />
            <HelperText>{formik.touched.password && formik.errors.password}</HelperText>
          </FormControl>

          {captchaRequired && <CaptchaGate onToken={onCaptchaToken} />}

          <Box display="flex" justifyContent="flex-end" sx={{ mb: 3, mt: 1 }}>
            <Typography component="a" href="/auth/forgotPassword" sx={{ color: "#007fa8", fontSize: "0.88rem", fontWeight: 500, textDecoration: "none", "&:hover": { textDecoration: "underline" } }}>¿Olvidaste tu contraseña?</Typography>
          </Box>

          <MuiButton variant="contained" fullWidth disabled={formDisabled} sx={{ minHeight: 48, backgroundColor: "#008dbb", color: "#fff", fontSize: "0.95rem", fontWeight: 700, textTransform: "none", borderRadius: 2, boxShadow: "0 8px 18px rgba(0, 120, 165, 0.22)", "&:hover": { backgroundColor: "#00789f" } }} type="submit">
            {loading || isSubmitting ? <CircularProgress size={18} color="inherit" aria-label="Iniciando sesión" /> : cooldownSeconds > 0 ? `Espera ${cooldownSeconds}s` : "Entrar"}
          </MuiButton>
        </Box>
      </form>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </>
  );
};
