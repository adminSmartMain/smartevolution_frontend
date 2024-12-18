import { VisibilityOffOutlined, VisibilityOutlined } from "@mui/icons-material";
import LoginIcon from "@mui/icons-material/Login";
import {
  Box,
  FormControl,
  IconButton,
  InputAdornment,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

import MuiButton from "@styles/buttons/button";
import MuiTextField from "@styles/fields";
import HelperText from "@styles/helperText";
import InputTitles from "@styles/inputTitles";

export const InputAdornments = ({
  formik,
  values,
  handleClickShowPassword,
  handleMouseDownPassword,
  ToastContainer,
}) => {

  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };
  return (
    <>
    <form onSubmit={formik.handleSubmit}>
      <Box display="flex" flexDirection="column" sx={{ marginTop: "30px" }}>
        {/* Título principal */}
        <Typography
          sx={{
            color: "#1E88E5",
            fontSize: "1.2rem", // Tamaño reducido
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: "8px",
          }}
        >
          Inicia sesión
        </Typography>
  
        {/* Texto de registro */}
        <Typography
          sx={{
            color: "#757575",
            fontSize: "0.75rem", // Tamaño reducido
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          ¿No tienes cuenta? Contacta con la administración
        </Typography>
  
        <Box display="flex" flexDirection="column">
          {/* Campo Email */}
          <FormControl fullWidth sx={{ marginBottom: "15px" }}>
            <MuiTextField
              id="email"
              placeholder="Ingresa tu email"
              name="email"
              type="email"
              aria-label="Correo electrónico"
              onChange={formik.handleChange}
              value={formik.values.email}
              variant="standard"
              margin="normal"
              fullWidth
              InputProps={{
                disableUnderline: true,
                sx: {
                  backgroundColor: "transparent", // Fondo transparente
                  marginTop: "-5px",
                },
              }}
              error={formik.touched.email && Boolean(formik.errors.email)}
              sx={{
                backgroundColor: "transparent", // Fondo transparente
                border: formik.touched.password && Boolean(formik.errors.password)
                  ? "1.4px solid #E6643180" // Borde en rojo si hay error
                  : "1px solid rgba(0, 0, 0, 0.23)", // Borde normal
              }}
            />
            <HelperText>{formik.touched.email && formik.errors.email}</HelperText>
          </FormControl>
  
          {/* Campo Contraseña */}
          <FormControl fullWidth>
          <MuiTextField
            id="password"
            placeholder="Ingresa tu contraseña"
            aria-label="Contraseña"
            name="password"
            type={showPassword ? "text" : "password"} // Usa el estado local
            onChange={formik.handleChange}
            value={formik.values.password}
            variant="standard"
            margin="normal"
            fullWidth
            error={formik.touched.password && Boolean(formik.errors.password)}
            sx={{
              backgroundColor: "transparent",
              border: formik.touched.password && Boolean(formik.errors.password)
                ? "1.4px solid #E6643180"
                : "1px solid rgba(0, 0, 0, 0.23)",
            }}
            InputProps={{
              disableUnderline: true,
              sx: {
                backgroundColor: "transparent",
                marginTop: "-5px",
              },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleTogglePassword} // Actualiza el estado local
                    onMouseDown={(e) => e.preventDefault()} // Evita comportamiento por defecto
                  >
                    {showPassword ? (
                      <VisibilityOffOutlined sx={{ color: "#5EA3A3" }} />
                    ) : (
                      <VisibilityOutlined sx={{ color: "#5EA3A3" }} />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <HelperText>
            {formik.touched.password && formik.errors.password}
          </HelperText>
        </FormControl>
  
          {/* Enlace de Olvidaste tu contraseña */}
          <Box display="flex" justifyContent="flex-end" sx={{ marginTop: "5px" }}>
            <Typography
              component="a"
              href="/auth/forgotPassword" // Usamos el href normal para la ruta
              sx={{
                color: "#1E88E5",
                fontSize: "0.75rem", // Tamaño reducido
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              ¿Olvidaste tu contraseña?
            </Typography>
          </Box>
        </Box>
  
        {/* Botón de inicio */}
        <Box display="flex" justifyContent="center" sx={{ marginTop: "10px" }}>
          <MuiButton
            variant="contained"
            sx={{
              backgroundColor: "#64b5f6", // Azul claro
              color: "#fff",
              width: "200px", // Ajuste de ancho (moderado)
              height: "35px", // Menos alto
              fontSize: "0.75rem", // Tamaño reducido
              textTransform: "none",
              borderRadius: "5px",
              "&:hover": {
                backgroundColor: "#42a5f5", // Azul más oscuro al hover
              },
            }}
            type="submit"
          >
            Entrar
          </MuiButton>
        </Box>
  
      </Box>
    </form>
  
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  </>
  );
};
