import LoginIcon from "@mui/icons-material/Login";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { Box, FormControl, IconButton, InputAdornment } from "@mui/material";

import MuiButton from "@styles/buttons/button";
import MuiTextField from "@styles/fields";
import HelperText from "@styles/helperText";

import globalStyles from "../styles/global.module.css";

import { useFormik } from "formik";
import * as yup from "yup";

export default function InputAdornments() {
  const validationSchema = yup.object({
    email: yup
      .string("Ingresa un email")
      .matches(
        /^[a-zA-Z]+[a-zA-Z0-9_.]+@[a-zA-Z.]+[a-zA-Z]$/,
        "Ingresa un email válido"
      )
      .required("El email es requerido"),
    password: yup
      .string("Ingresa una contraseña")
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .required("La contraseña es requerida"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  const [values, setValues] = React.useState({
    amount: "",
    password: "",
    weight: "",
    weightRange: "",
    showPassword: false,
  });

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box display="flex" flexDirection="column" sx={{ marginTop: "50px" }}>
        <Box display="flex" flexDirection="column">
          <h1 className={globalStyles.subtitulo}>Email</h1>
          <FormControl fullWidth sx={{ marginBottom: "20px" }}>
            <MuiTextField
              id="email"
              placeholder="Ingresa tu email"
              name="email"
              type="email"
              onChange={formik.handleChange}
              value={formik.values.email}
              variant="standard"
              margin="normal"
              fullWidth
              error={formik.touched.email && Boolean(formik.errors.email)}
              InputProps={{
                disableUnderline: true,
              }}
              sx={
                formik.touched.email && Boolean(formik.errors.email)
                  ? { border: "2px solid #E6643180" }
                  : null
              }
            />
            <HelperText>
              {formik.touched.email && formik.errors.email}
            </HelperText>
          </FormControl>
          <h1 className={globalStyles.subtitulo}>Contraseña</h1>
          <FormControl fullWidth>
            <MuiTextField
              id="password"
              placeholder="Ingresa tu contraseña"
              name="password"
              type={values.showPassword ? "text" : "password"}
              onChange={formik.handleChange}
              value={formik.values.password}
              variant="standard"
              margin="normal"
              fullWidth
              error={formik.touched.password && Boolean(formik.errors.password)}
              sx={
                formik.touched.password && Boolean(formik.errors.password)
                  ? { border: "2px solid #E6643180" }
                  : null
              }
              InputProps={{
                disableUnderline: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {values.showPassword ? (
                        <VisibilityOutlinedIcon style={{ color: "#69AAA9" }} />
                      ) : (
                        <VisibilityOffOutlinedIcon
                          style={{ color: "#69AAA9" }}
                        />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>
          <HelperText>
            {formik.touched.password && formik.errors.password}
          </HelperText>
        </Box>

        <Box display="flex" justifyContent="center">
          <MuiButton
            variant="contained"
            color="primary"
            type="submit"
            startIcon={<LoginIcon />}
          >
            Iniciar la plataforma
          </MuiButton>
        </Box>
      </Box>
    </form>
  );
}
