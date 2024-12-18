import { VisibilityOffOutlined, VisibilityOutlined } from "@mui/icons-material";
import { Box, FormControl, IconButton, InputAdornment, Typography } from "@mui/material";
import MuiButton from "@styles/buttons/button";
import MuiTextField from "@styles/fields";
import HelperText from "@styles/helperText";
import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export const InputNewPassword = ({ formik, ToastContainer, loading,invalidToken }) => {

  const [showPassword, setShowPassword] = useState({
    newPassword: false,
    confirmPassword: false,
  });




  const handleClickShowPassword = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };
  return (
      <>
      <form onSubmit={formik.handleSubmit}>
        <Box display="flex" flexDirection="column" sx={{ marginTop: "30px" }}>
          <Typography
            sx={{
              color: "#1E88E5",
              fontSize: "1.2rem",
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: "8px",
            }}
          >
            Recuperar contraseña
          </Typography>

          <Typography
            sx={{
              color: "#757575",
              fontSize: "0.75rem",
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            Por favor ingresa tu nueva contraseña
          </Typography>

          {/* Nueva contraseña */}
          <FormControl fullWidth sx={{ marginBottom: "15px" }}>
            <MuiTextField
               aria-label="newPassword"
              
              
              id="newPassword"
              name="newPassword"
              type={showPassword.newPassword ? "text" : "password"} // Cambio de tipo dinámico
              placeholder="Nueva contraseña"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.newPassword}
              error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
              variant="standard"
              margin="normal"
              fullWidth
              InputProps={{
                disableUnderline: true,
                endAdornment: (
                  <InputAdornment position="start">
                    <IconButton
                      onClick={() => handleClickShowPassword("newPassword")}
                      edge="start"
                      sx={{ padding: 0 }} // Eliminar padding extra
                    >
                      {showPassword.newPassword ? (
                        <VisibilityOff sx={{ fontSize: "1.2rem" }} /> // Ajustar tamaño del ícono
                      ) : (
                        <Visibility sx={{ fontSize: "1.2rem" }} /> // Ajustar tamaño del ícono
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                backgroundColor: "transparent", // Fondo transparente
                "& .MuiInputBase-input": {
                  backgroundColor: "transparent", // Garantiza que el fondo del input sea transparente
                },
              }}
            />
            {formik.touched.newPassword && formik.errors.newPassword && (
              <Typography color="error" sx={{ fontSize: "0.75rem" }}>
                {formik.errors.newPassword}
              </Typography>
            )}
          </FormControl>

          {/* Confirmar contraseña */}
          <FormControl fullWidth sx={{ marginBottom: "15px" }}>
            <MuiTextField

aria-label="newPassword2"
              
              id="confirmPassword"
              name="confirmPassword"
              
              type={showPassword.confirmPassword ? "text" : "password"} // Cambio de tipo dinámico
              placeholder="Confirmar contraseña"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.confirmPassword}
              error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
              variant="standard"
              margin="normal"
              fullWidth
              InputProps={{
                disableUnderline: true,
                endAdornment: (
                  <InputAdornment position="start">
                    <IconButton
                      onClick={() => handleClickShowPassword("confirmPassword")}
                      edge="start"
                      sx={{ padding: 0 }} // Eliminar padding extra
                    >
                      {showPassword.confirmPassword ? (
                        <VisibilityOff sx={{ fontSize: "1.2rem" }} /> // Ajustar tamaño del ícono
                      ) : (
                        <Visibility sx={{ fontSize: "1.2rem" }} /> // Ajustar tamaño del ícono
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                backgroundColor: "transparent", // Fondo transparente
                "& .MuiInputBase-input": {
                  backgroundColor: "transparent", // Garantiza que el fondo del input sea transparente
                },
              }}
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <Typography color="error" sx={{ fontSize: "0.75rem" }}>
                {formik.errors.confirmPassword}
              </Typography>
            )}
          </FormControl>

          {/* Botón de actualizar */}
          <Box display="flex" justifyContent="center" sx={{ marginTop: "10px" }}>
            <MuiButton
              variant="contained"
              disabled={loading}
              sx={{
                backgroundColor: "#64b5f6",
                color: "#fff",
                width: "200px",
                height: "35px",
                fontSize: "0.75rem",
                textTransform: "none",
                borderRadius: "5px",
                "&:hover": {
                  backgroundColor: "#42a5f5",
                },
              }}
              type="submit"
            >
              {loading ? "Actualizando..." : "Actualizar"}
            </MuiButton>
          </Box>
        </Box>
      </form>

     
    </>
  );
};
