import { useRouter } from "next/router";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import CitySelect from "@components/selects/citySelect";
import DepartmentSelect from "@components/selects/departmentSelect";
import TypeIDSelect from "@components/selects/typeIdentitySelect";

import BackButton from "@styles/buttons/BackButton";
import MuiButton from "@styles/buttons/button";
import MuiTextField from "@styles/fields";
import HelperText from "@styles/helperText";
import InputTitles from "@styles/inputTitles";
import scrollSx from "@styles/scroll";
import { Dialog,DialogContent, CircularProgress} from "@mui/material";
import { CheckCircle, Error } from "@mui/icons-material";
export const SignUpBroker = ({ formik, option, ToastContainer,loading,success,isModalOpen }) => {
  const router = useRouter();
  return (
    <>
      <Box display="flex" flexDirection="column" sx={{ ...scrollSx }}>
        <form onSubmit={formik.handleSubmit}>
          <BackButton path="/brokers/brokerList" />
          <Box display="flex" flexDirection="column" alignItems="left">
            <Typography
              letterSpacing={0}
              fontSize="1.7rem"
              fontWeight="regular"
              marginBottom="4rem"
              color="#5EA3A3"
            >
              {option === "register" ? "Registro de corredor" : null}
              {option === "modify" ? "Modificación de corredor" : null}
              {option === "preview" ? "Visualización de corredor" : null}
            </Typography>
            <Box display="flex" mb={6} flexDirection="row" position="relative">
              <TypeIDSelect formik={formik} disabled={option === "preview"} />
              <Box ml={5} position="relative">
                <Box width="17vw">
                  <InputTitles>Número de identificación</InputTitles>
                  <MuiTextField
                    id="document_number"
                    placeholder="Ingresa tu identificación"
                    name="document_number"
                    type="text"
                    variant="standard"
                    margin="normal"
                    fullWidth
                    disabled={option === "modify" || option === "preview"}
                    value={formik.values.document_number}
                    InputProps={{
                      disableUnderline: true,
                      sx: {
                        marginTop: "-5px",
                      },
                    }}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.document_number &&
                      Boolean(formik.errors.document_number)
                    }
                    sx={
                      formik.touched.document_number &&
                      Boolean(formik.errors.document_number)
                        ? { border: "1.4px solid #E6643180" }
                        : null
                    }
                  />
                  <HelperText>
                    {formik.touched.document_number &&
                      formik.errors.document_number}
                  </HelperText>
                </Box>
              </Box>
            </Box>
            <Box display="flex" mb={6} flexDirection="row" position="relative">
              {formik.values.type_identity !==
                "6b1a9326-00c6-4b72-a8b4-4453b889fbb7" && (
                <>
                  <Box width="17vw">
                    <InputTitles>Nombres</InputTitles>
                    <MuiTextField
                      id="first_name"
                      placeholder="Ingresa tu nombre"
                      name="first_name"
                      type="text"
                      variant="standard"
                      margin="normal"
                      fullWidth
                      disabled={option === "preview"}
                      value={formik.values.first_name}
                      InputProps={{
                        disableUnderline: true,
                        sx: {
                          marginTop: "-5px",
                        },
                      }}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.first_name &&
                        Boolean(formik.errors.first_name)
                      }
                      sx={
                        formik.touched.first_name &&
                        Boolean(formik.errors.first_name)
                          ? { border: "1.4px solid #E6643180" }
                          : null
                      }
                    />
                    <HelperText>
                      {formik.touched.first_name && formik.errors.first_name}
                    </HelperText>
                  </Box>
                  <Box ml={5} width="17vw">
                    <InputTitles>Apellidos</InputTitles>
                    <MuiTextField
                      id="last_name"
                      placeholder="Ingresa tu apellido"
                      name="last_name"
                      type="text"
                      variant="standard"
                      margin="normal"
                      fullWidth
                      disabled={option === "preview"}
                      value={formik.values.last_name}
                      InputProps={{
                        disableUnderline: true,
                        sx: {
                          marginTop: "-5px",
                        },
                      }}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.last_name &&
                        Boolean(formik.errors.last_name)
                      }
                      sx={
                        formik.touched.last_name &&
                        Boolean(formik.errors.last_name)
                          ? { border: "1.4px solid #E6643180" }
                          : null
                      }
                    />

                    <HelperText>
                      {formik.touched.last_name && formik.errors.last_name}
                    </HelperText>
                  </Box>
                </>
              )}
              {formik.values.type_identity ===
                "6b1a9326-00c6-4b72-a8b4-4453b889fbb7" && (
                <Box width="calc(34vw + 3rem)">
                  <InputTitles>Razón social</InputTitles>
                  <MuiTextField
                    id="social_reason"
                    placeholder="Ingresa tu razón social"
                    name="social_reason"
                    type="text"
                    variant="standard"
                    margin="normal"
                    fullWidth
                    disabled={option === "preview"}
                    value={formik.values.social_reason}
                    InputProps={{
                      disableUnderline: true,
                      sx: {
                        marginTop: "-5px",
                      },
                    }}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.social_reason &&
                      Boolean(formik.errors.social_reason)
                    }
                    sx={
                      formik.touched.social_reason &&
                      Boolean(formik.errors.social_reason)
                        ? { border: "1.4px solid #E6643180" }
                        : null
                    }
                  />
                  <HelperText>
                    {formik.touched.social_reason &&
                      formik.errors.social_reason}
                  </HelperText>
                </Box>
              )}
            </Box>
            <Box display="flex" mb={6} flexDirection="row" position="relative">
              <Box width="17vw">
                <InputTitles>Número de teléfono</InputTitles>
                <MuiTextField
                  id="phone_number"
                  placeholder="Ingresa tu número de teléfono"
                  name="phone_number"
                  type="tel"
                  variant="standard"
                  margin="normal"
                  fullWidth
                  disabled={option === "preview"}
                  value={formik.values.phone_number}
                  InputProps={{
                    disableUnderline: true,
                    sx: {
                      marginTop: "-5px",
                    },
                  }}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.phone_number &&
                    Boolean(formik.errors.phone_number)
                  }
                  sx={
                    formik.touched.phone_number &&
                    Boolean(formik.errors.phone_number)
                      ? { border: "1.4px solid #E6643180" }
                      : null
                  }
                />
                <HelperText>
                  {formik.touched.phone_number && formik.errors.phone_number}
                </HelperText>
              </Box>
              <Box ml={5} width="17vw">
                <InputTitles>Email</InputTitles>
                <MuiTextField
                  id="email"
                  placeholder="Ingresa tu email"
                  name="email"
                  type="email"
                  variant="standard"
                  margin="normal"
                  fullWidth
                  disabled={option === "preview"}
                  value={formik.values.email}
                  InputProps={{
                    disableUnderline: true,
                    sx: {
                      marginTop: "-5px",
                    },
                  }}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  sx={
                    formik.touched.email && Boolean(formik.errors.email)
                      ? { border: "1.4px solid #E6643180" }
                      : null
                  }
                />
                <HelperText>
                  {formik.touched.email && formik.errors.email}
                </HelperText>
              </Box>
            </Box>
            <Box display="flex" mb={6} flexDirection="row" position="relative">
              <DepartmentSelect
                formik={formik}
                disabled={option === "preview"}
              />
              <CitySelect formik={formik} disabled={option === "preview"} />
            </Box>
            <Box display="flex" flexDirection="row">
              <Box mb={4} width="calc(34vw + 3rem)">
                <InputTitles>Dirección</InputTitles>
                <MuiTextField
                  id="address"
                  placeholder="Ingresa tu dirección"
                  name="address"
                  type="text"
                  variant="standard"
                  margin="normal"
                  fullWidth
                  disabled={option === "preview"}
                  value={formik.values.address}
                  InputProps={{
                    disableUnderline: true,
                    sx: {
                      marginTop: "-5px",
                    },
                  }}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.address && Boolean(formik.errors.address)
                  }
                  sx={
                    formik.touched.address && Boolean(formik.errors.address)
                      ? { border: "1.4px solid #E6643180" }
                      : null
                  }
                />
                <HelperText>
                  {formik.touched.address && formik.errors.address}
                </HelperText>
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              width: "calc(34vw + 4rem)",
              justifyContent: "flex-end",
            }}
          >
            <Box>
              {option === "register" || option === "modify" ? (
                <MuiButton
                  type="submit"
                  onClick={formik.handleSubmit}
                  sx={{
                    mb: 2,
                    boxShadow: "none",
                    borderRadius: "4px",
                  }}
                >
                  <Typography fontSize="90%" fontWeight="bold">
                    {option === "register" && "Registrar"}
                    {option === "modify" && "Modificar"}
                  </Typography>
                  {/* MODAL DE PROCESO */}
                      <Dialog  open={isModalOpen} PaperProps={{ sx: { borderRadius: "10px", textAlign: "center", p: 3 } }}>
                        <DialogContent>
                          {success === null ? (
                            <>
                              <CircularProgress size={80} sx={{ color: "#1976D2", mb: 2 }} />
                              <Typography variant="h6">Procesando...</Typography>
                            </>
                          ) : success ? (
                            <>
                              <CheckCircle sx={{ fontSize: 80, color: "green", mb: 2 }} />
                              <Typography variant="h5" color="success.main">
                                {option === "register" && "¡Registro de corredor Exitoso!"}
                                {option === "modify" && "¡El corredor se ha modificado con éxito!"}
                              </Typography>
                            </>
                          ) : (
                            <>
                              <Error sx={{ fontSize: 80, color: "red", mb: 2 }} />
                              <Typography variant="h5" color="error.main">
                                {option === "register" && "Error al Registrar el corredor"}
                                {option === "modify" && "Error al Modificar el corredor"}
                              </Typography>
                            </>
                          )}
                        </DialogContent>
                      </Dialog>
                  <Typography
                    fontFamily="icomoon"
                    sx={{
                      color: "#fff",
                      ml: 2,
                      fontSize: "medium",
                    }}
                  >
                    &#xe91f;
                  </Typography>
                </MuiButton>
              ) : (
                <MuiButton
                  onClick={() => router.push("/brokers/brokerList")}
                  sx={{
                    mb: 2,
                    boxShadow: "none",
                    borderRadius: "4px",
                  }}
                >
                  <Typography fontSize="90%" fontWeight="bold">
                    Volver a corredores
                  </Typography>
                  <Typography
                    fontFamily="icomoon"
                    sx={{
                      color: "#fff",
                      ml: 2,
                      fontSize: "medium",
                    }}
                  >
                    &#xe91f;
                  </Typography>
                </MuiButton>
              )}
            </Box>
          </Box>
        </form>
      </Box>
      <ToastContainer
        position="top-right"
        autoClose={50000}
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
