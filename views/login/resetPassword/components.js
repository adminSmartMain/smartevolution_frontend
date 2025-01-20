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
      <Box display="flex" flexDirection="column" 
      sx={{ marginTop: "30px",
        width:"275px",    
    marginRight:"28px"}}>
        <Typography
          sx={{
            color: "#1E88E5",
            fontSize: "1.2rem",
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: "8px",
            marginLeft:"40px"
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
            marginLeft:"40px",
          }}
        >
          Por favor ingresa tu nueva contraseña
        </Typography>
  
        {/* Nueva contraseña */}
        <FormControl fullWidth sx={{ marginBottom: "15px",marginRight:"10px",
              marginLeft:"25px", }}>
          <MuiTextField
            aria-label="newPassword"
            id="newPassword"
            name="newPassword"
            type={showPassword.newPassword ? "text" : "password"}
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
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => handleClickShowPassword("newPassword")}
                    edge="end"
                    sx={{ padding: 2 }}
                  >
                    {showPassword.newPassword ? (
                      <VisibilityOff sx={{ fontSize: "1.2rem" }} />
                    ) : (
                      <Visibility sx={{ fontSize: "1.2rem" }} />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              display: "inline-flex",
              flexDirection: "column",
              position: "relative",
              minWidth: "0px",
              margin: "16px 0px 8px",
              width: "250px",
              borderRadius: "5px",
              padding: "10px",
              height: "1rem",
              backgroundColor: "transparent",
              border: "1px solid rgba(0, 0, 0, 0.23)",
            }}
          />
          {formik.touched.newPassword && formik.errors.newPassword && (
            <Typography color="error" sx={{ fontSize: "0.75rem" }}>
              {formik.errors.newPassword}
            </Typography>
          )}
        </FormControl>
  
        {/* Confirmar contraseña */}
        <FormControl fullWidth sx={{ marginBottom: "15px",width: "260px",
              marginRight:"10px",
              marginLeft:"25px", }}>
          <MuiTextField
            aria-label="confirmPassword"
            id="confirmPassword"
            name="confirmPassword"
            type={showPassword.confirmPassword ? "text" : "password"}
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
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => handleClickShowPassword("confirmPassword")}
                    edge="end"
                    sx={{ padding: 2 }}
                  >
                    {showPassword.confirmPassword ? (
                      <VisibilityOff sx={{ fontSize: "1.2rem" }} />
                    ) : (
                      <Visibility sx={{ fontSize: "1.2rem" }} />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              display: "inline-flex",
              flexDirection: "column",
              position: "relative",
              minWidth: "0px",
              margin: "16px 0px 8px",
              width: "250px",
              
              borderRadius: "5px",
              padding: "10px",
              height: "1rem",
              backgroundColor: "transparent",
              border: "1px solid rgba(0, 0, 0, 0.23)",
            }}
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <Typography color="error" sx={{ fontSize: "0.75rem" }}>
              {formik.errors.confirmPassword}
            </Typography>
          )}
        </FormControl>
  
        {/* Botón de actualizar */}
        <Box display="flex" justifyContent="center" sx={{ marginTop: "10px",marginLeft:"30px" }}>
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
