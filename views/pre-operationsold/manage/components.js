import { BookOutlined } from "@mui/icons-material";
import { Box, Button, Switch, Typography } from "@mui/material";
// Styles
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import BillSelect from "@components/selects/BillSelect";
import BrokerByClientSelect from "@components/selects/BrokerByClientSelect";
// Selects
import EmitterSelect from "@components/selects/EmitterSelect";
import InvestorAccountSelect from "@components/selects/InvestorAccountSelect";
import InvestorSelect from "@components/selects/InvestorSelect";
import PayerSelect from "@components/selects/PayerSelect";
import TypeOperationSelect from "@components/selects/typeOperationSelect";

import BackButton from "@styles/buttons/BackButton";
import MuiTextField from "@styles/fields";
import InputTitles from "@styles/inputTitles";
import scrollSx from "@styles/scroll";

const aSx = {
  border: "1.4px solid #E6643180",
  marginTop: "0px",
  width: "17vw",
  "@media (max-height: 900px)": {
    width: "20vw",
  },
};

const bSx = {
  border: "1.4px solid #5EA3A3",
  marginTop: "0px",
  width: "17vw",
  "@media (max-height: 900px)": {
    width: "20vw",
  },
};

const cSx = { border: "1.4px solid #E6643180", marginTop: "0px" };

export const ManageOperationC = ({
  formik,
  updated,
  ToastContainer,
  isEditing,
  handleMultipleOperations,
  isCreatingBill,
  setIsCreatingBill,
}) => {
  return (
    <Box sx={{ ...scrollSx }}>
      <Box display="flex" flexDirection="row" alignItems="center">
        <BackButton path="/operations" buttonSx={{}} />
      </Box>
      <Box>
        <Typography
          letterSpacing={0}
          fontSize="1.6rem"
          fontWeight="medium"
          marginBottom="0.7rem"
          color="#5EA3A3"
          marginLeft={1.5}
        >
          Registro De Operaciones
        </Typography>
      </Box>

      <Box display="flex" flexDirection="row" alignItems="space-around" marginLeft={"1rem"}>
        <Box
          display={"flex"}
          flexDirection={"column"}
          sx={{
            marginRight: "2rem",
            marginTop: "2rem",
          }}
        >
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            bgcolor={"#fafafa"}
            borderRadius={"4px"}
            border={"0.1rem solid #5EA3A380"}
            padding={"0 7px 0 5px"}
          >
            <Typography
              variant="h6"
              fontSize="0.9vw"
              letterSpacing={0}
              fontWeight="regular"
              color="#333333"
            >
              Aplica GM
            </Typography>
            <Switch
              value={formik.values.applyGm}
              checked={formik.values.applyGm}
              sx={{
                "& .MuiSwitch-switchBase": {
                  "&.Mui-checked": {
                    color: "#FFFFFF",
                  },
                  "&.Mui-checked + .MuiSwitch-track": {
                    backgroundColor: "#488B8F",
                  },

                  "&.Mui-disabled": {
                    color: "#488B8F",
                  },
                  "&.Mui-disabled + .MuiSwitch-track": {
                    backgroundColor: "#B5D1C9",
                  },
                },
              }}
              onChange={(e) => {
                if (e.target.checked) {
                  formik.setFieldValue("applyGm", true);
                } else {
                  formik.setFieldValue("applyGm", false);
                }
              }}
            />
          </Box>
        </Box>

        <TypeOperationSelect formik={formik} />
        <Box
          sx={{
            marginLeft: "3rem",
          }}
        >
          <InputTitles marginBottom={2}>Fecha de operacion</InputTitles>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              value={formik.values.opDate}
              onChange={formik.handleChange}
              renderInput={(params) => (
                <MuiTextField
                  id="opDate"
                  placeholder="Ingresa la fecha"
                  name="opDate"
                  type="date"
                  variant="standard"
                  margin="normal"
                  value={formik.values.opDate}
                  InputProps={{
                    disableUnderline: true,
                    sx: {
                      marginTop: "-5px",
                    },
                  }}
                  onChange={formik.handleChange}
                  error={formik.touched.date && Boolean(formik.errors.opDate)}
                  sx={
                    formik.touched.date && Boolean(formik.errors.opDate)
                      ? cSx
                      : {
                          border: "1.4px solid #5EA3A3",
                          marginTop: "0px",
                        }
                  }
                />
              )}
              components={{
                OpenPickerIcon: () => (
                  <Box color="#5EA3A3" width={24} height={24}>
                    <i className="far fa-xs fa-calendar-range" />
                  </Box>
                ),
              }}
            />
          </LocalizationProvider>
        </Box>

        <Box
          sx={{
            marginLeft: "2rem",
          }}
        >
          <InputTitles marginBottom={2}># de operacion</InputTitles>
          <MuiTextField
            id="opId"
            placeholder=""
            name="opId"
            type="number"
            variant="standard"
            margin="normal"
            value={formik.values.opId}
            InputProps={{
              disableUnderline: true,
              sx: {
                marginTop: "-5px",
                width: "7vw",
              },
            }}
            onChange={formik.handleChange}
            error={formik.touched.opId && Boolean(formik.errors.opId)}
            sx={
              formik.touched.opId && Boolean(formik.errors.opId)
                ? cSx
                : {
                    border: "1.4px solid #5EA3A3",
                    marginTop: "0px",
                  }
            }
          />
        </Box>
      </Box>
      <Box
        display="flex"
        flexDirection="row"
        alignItems="space-around"
        sx={{
          marginTop: "2rem",
          marginLeft: "1rem",
        }}
      >
        <EmitterSelect formik={formik} customer={"emisor"} />
        <PayerSelect formik={formik} customer={"pagador"} marginLeft={"3rem"} />
      </Box>

      <Box
        display="flex"
        flexDirection="row"
        alignItems="space-around"
        sx={{
          marginTop: "2rem",
          marginLeft: "1rem",
        }}
      >
        <InvestorSelect formik={formik} customer={"inversionista"} />

        <InvestorAccountSelect formik={formik} marginLeft={"3rem"} />
      </Box>

      <Box display={"flex"}>
        <Box
          sx={{
            display: isCreatingBill ? "none" : "flex",
          }}
        >
          <BillSelect
            width={"17vw"}
            formik={formik}//CON ESTE BOTON SE SELECCIONAN LAS FACTURAS
            marginLeft={"1rem"}
            marginTop={"2rem"}
            setIsCreatingBill={setIsCreatingBill}
          />
        </Box>
        <Box
          sx={{
            marginLeft: "1rem",
            marginTop: "2rem",
            display: isCreatingBill ? "flex" : "none",
            flexDirection: "column",
            "@media (max-height: 900px)": {
              marginRight: "1rem",
            },
          }}
        >
          <InputTitles marginBottom={2}>Codigo factura</InputTitles>
          <MuiTextField
            id="billCode"
            placeholder=""
            name="billCode"
            type="text"
            variant="standard"
            margin="normal"
            value={formik.values.billCode === 1 ? 0 : formik.values.billCode}
            InputProps={{
              disableUnderline: true,
              sx: {
                marginTop: "-5px",
              },
            }}
            onChange={formik.handleChange}
            error={formik.touched.billCode && Boolean(formik.errors.billCode)}
            sx={
              formik.touched.billCode && Boolean(formik.errors.billCode)
                ? {
                    border: "1px solid #E6643180",
                    marginTop: "0px",
                    width: "17vw",
                    "@media (max-height: 900px)": {
                      width: "20vw",
                    },
                  }
                : {
                    border: "1px solid #5EA3A3",
                    marginTop: "0px",
                    width: "17vw",
                    "@media (max-height: 900px)": {
                      width: "20vw",
                    },
                  }
            }
          />
        </Box>
        <Box
          sx={{
            marginLeft: isCreatingBill ? "2rem" : "0.6rem",
            marginTop: "2rem",
            "@media (max-height: 900px)": {
              marginLeft: "0.8rem",
            },
          }}
        >
          <InputTitles marginBottom={2}>Fraccion</InputTitles>
          <MuiTextField
            id="billFraction"
            placeholder=""
            name="billFraction"
            type="number"
            variant="standard"
            margin="normal"
            disabled
            value={
              formik.values.billFraction === 1 ? 0 : formik.values.billFraction
            }
            InputProps={{
              disableUnderline: true,
              sx: {
                marginTop: "-5px",
              },
            }}
            onChange={formik.handleChange}
            error={
              formik.touched.billFraction && Boolean(formik.errors.billFraction)
            }
            sx={
              formik.touched.billFraction && Boolean(formik.errors.billFraction)
                ? {
                    border: "1px solid #E6643180",
                    marginTop: "0px",
                    width: "17vw",
                    "@media (max-height: 900px)": {
                      width: "20vw",
                    },
                  }
                : {
                    border: "1px solid #5EA3A3",
                    marginTop: "0px",
                    width: "17vw",
                    "@media (max-height: 900px)": {
                      width: "20vw",
                    },
                  }
            }
          />
        </Box>
      </Box>

      <Box
        sx={{
          marginLeft: "1rem",
          marginTop: "2rem",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Box>
          <InputTitles marginBottom={2}>Fecha de Emision</InputTitles>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              value={formik.values.DateBill}
              onChange={formik.handleChange}
              renderInput={(params) => (
                <MuiTextField
                  id="DateBill"
                  placeholder="Ingresa la fecha"
                  name="DateBill"
                  type="date"
                  variant="standard"
                  margin="normal"
                  value={formik.values.DateBill}
                  InputProps={{
                    disableUnderline: true,
                    sx: {
                      marginTop: "-5px",
                    },
                  }}
                  onChange={formik.handleChange}
                  error={formik.touched.date && Boolean(formik.errors.DateBill)}
                  sx={
                    formik.touched.date && Boolean(formik.errors.DateBill)
                      ? {
                          border: "1.4px solid #E6643180",
                          marginTop: "0px",
                          width: "17vw",
                          "@media (max-height: 900px)": {
                            width: "20vw",
                          },
                        }
                      : {
                          border: "1.4px solid #5EA3A3",
                          marginTop: "0px",
                          width: "17vw",
                          "@media (max-height: 900px)": {
                            width: "20vw",
                          },
                        }
                  }
                />
              )}
              components={{
                OpenPickerIcon: () => (
                  <Box color="#5EA3A3" width={24} height={24}>
                    <i className="far fa-xs fa-calendar-range" />
                  </Box>
                ),
              }}
            />
          </LocalizationProvider>
        </Box>

        <Box
          sx={{
            marginLeft: "1.5rem",
          }}
        >
          <InputTitles marginBottom={2}>Fecha Vencimiento</InputTitles>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              value={formik.values.DateExpiration}
              onChange={formik.handleChange}
              renderInput={(params) => (
                <MuiTextField
                  id="DateExpiration"
                  placeholder="Ingresa la fecha"
                  name="DateExpiration"
                  type="date"
                  variant="standard"
                  margin="normal"
                  value={formik.values.DateExpiration}
                  InputProps={{
                    disableUnderline: true,
                    sx: {
                      marginTop: "-5px",
                    },
                  }}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.DateExpiration &&
                    Boolean(formik.errors.DateExpiration)
                  }
                  sx={
                    formik.touched.DateExpiration &&
                    Boolean(formik.errors.DateExpiration)
                      ? {
                          border: "1.4px solid #E6643180",
                          marginTop: "0px",
                          width: "7vw",
                          "@media (max-height: 900px)": {
                            width: "8.5vw",
                            marginLeft: "-0.8rem",
                          },
                        }
                      : {
                          border: "1.4px solid #5EA3A3",
                          marginTop: "0px",
                          width: "7vw",
                          "@media (max-height: 900px)": {
                            width: "8.5vw",
                          },
                        }
                  }
                />
              )}
              components={{
                OpenPickerIcon: () => (
                  <Box color="#5EA3A3" width={24} height={24}>
                    <i className="far fa-xs fa-calendar-range" />
                  </Box>
                ),
              }}
            />
          </LocalizationProvider>
        </Box>

        <Box
          sx={{
            marginLeft: "1.5rem",
          }}
        >
          <InputTitles marginBottom={2}>Fecha Probable</InputTitles>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              value={formik.values.probableDate}
              onChange={formik.handleChange}
              renderInput={(params) => (
                <MuiTextField
                  id="probableDate"
                  placeholder="Ingresa la fecha"
                  name="probableDate"
                  type="date"
                  variant="standard"
                  margin="normal"
                  value={formik.values.probableDate}
                  InputProps={{
                    disableUnderline: true,
                    sx: {
                      marginTop: "-5px",
                    },
                  }}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.date && Boolean(formik.errors.probableDate)
                  }
                  sx={
                    formik.touched.date && Boolean(formik.errors.probableDate)
                      ? {
                          border: "1.4px solid #E6643180",
                          marginTop: "0px",
                          width: "7vw",
                          "@media (max-height: 900px)": {
                            width: "8.5vw",
                            marginLeft: "-0.8rem",
                          },
                        }
                      : {
                          border: "1.4px solid #5EA3A3",
                          marginTop: "0px",
                          width: "7vw",
                          "@media (max-height: 900px)": {
                            width: "8.5vw",
                          },
                        }
                  }
                />
              )}
              components={{
                OpenPickerIcon: () => (
                  <Box color="#5EA3A3" width={24} height={24}>
                    <i className="far fa-xs fa-calendar-range" />
                  </Box>
                ),
              }}
            />
          </LocalizationProvider>
        </Box>
      </Box>
      <Box
        sx={{
          marginLeft: "1rem",
          marginTop: "2rem",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Box>
          <InputTitles marginBottom={2}>Valor Futuro</InputTitles>
          <MuiTextField
            id="amount"
            placeholder=""
            name="amount"
            type="number"
            variant="standard"
            margin="normal"
            value={formik.values.amount}
            InputProps={{
              disableUnderline: true,
              sx: {
                marginTop: "-5px",
              },
              startAdornment: (
                <i
                  style={{
                    color: "#5EA3A3",
                    marginRight: "0.7vw",
                    fontSize: "1.1vw",
                  }}
                  className="far fa-dollar-sign"
                ></i>
              ),
            }}
            onChange={formik.handleChange}
            error={formik.touched.amount && Boolean(formik.errors.amount)}
            sx={
              formik.touched.amount && Boolean(formik.errors.amount) ? aSx : bSx
            }
          />
        </Box>

        <Box
          sx={{
            marginLeft: "1.5rem",
          }}
        >
          <InputTitles marginBottom={2}>Tasa Inversionista </InputTitles>
          <MuiTextField
            id="investorTax"
            placeholder=""
            name="investorTax"
            type="number"
            variant="standard"
            margin="normal"
            value={formik.values.investorTax}
            InputProps={{
              disableUnderline: true,
              sx: {
                marginTop: "-5px",
              },
              endAdornment: (
                <i
                  style={{
                    color: "#5EA3A3",
                    fontSize: "1.1vw",
                  }}
                  className="far fa-percent"
                ></i>
              ),
            }}
            onChange={formik.handleChange}
            error={
              formik.touched.investorTax && Boolean(formik.errors.investorTax)
            }
            sx={
              formik.touched.investorTax && Boolean(formik.errors.investorTax)
                ? {
                    border: "1.4px solid #E6643180",
                    marginTop: "0px",
                    width: "7vw",
                    "@media (max-height: 900px)": {
                      width: "8vw",
                    },
                  }
                : {
                    border: "1.4px solid #5EA3A3",
                    marginTop: "0px",
                    width: "7vw",
                    "@media (max-height: 900px)": {
                      width: "8vw",
                    },
                  }
            }
          />
        </Box>

        <Box
          sx={{
            marginLeft: "2rem",
          }}
        >
          <InputTitles marginBottom={2}>% Descuento</InputTitles>
          <MuiTextField
            id="payedPercent"
            placeholder=""
            name="payedPercent"
            type="number"
            variant="standard"
            margin="normal"
            disabled
            value={formik.values.payedPercent}
            InputProps={{
              disableUnderline: true,
              sx: {
                marginTop: "-5px",
              },
              endAdornment: (
                <i
                  style={{
                    color: "#5EA3A3",
                    fontSize: "1.1vw",
                  }}
                  className="far fa-percent"
                ></i>
              ),
            }}
            onChange={formik.handleChange}
            error={
              formik.touched.payedPercent && Boolean(formik.errors.payedPercent)
            }
            sx={
              formik.touched.payedPercent && Boolean(formik.errors.payedPercent)
                ? {
                    border: "1.4px solid #E6643180",
                    marginTop: "0px",
                    width: "7vw",
                    "@media (max-height: 900px)": {
                      width: "8vw",
                    },
                  }
                : {
                    border: "1.4px solid #5EA3A3",
                    marginTop: "0px",
                    width: "7vw",
                    "@media (max-height: 900px)": {
                      width: "8vw",
                    },
                  }
            }
          />
        </Box>
      </Box>

      <Box
        sx={{
          marginLeft: "1rem",
          marginTop: "2rem",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Box>
          <InputTitles marginBottom={2}>Valor Nominal</InputTitles>
          <MuiTextField
            id="payedAmount"
            placeholder=""
            name="payedAmount"
            type="number"
            variant="standard"
            margin="normal"
            value={formik.values.payedAmount}
            InputProps={{
              disableUnderline: true,
              sx: {
                marginTop: "-5px",
              },
              startAdornment: (
                <i
                  style={{
                    color: "#5EA3A3",
                    marginRight: "0.7vw",
                    fontSize: "1.1vw",
                  }}
                  className="far fa-dollar-sign"
                ></i>
              ),
            }}
            onChange={formik.handleChange}
            error={
              formik.touched.payedAmount && Boolean(formik.errors.payedAmount)
            }
            sx={
              formik.touched.payedAmount && Boolean(formik.errors.payedAmount)
                ? aSx
                : bSx
            }
          />
        </Box>

        <Box
          sx={{
            marginLeft: "1.5rem",
          }}
        >
          <InputTitles marginBottom={2}>Tasa Descuento</InputTitles>
          <MuiTextField
            id="discountTax"
            placeholder=""
            name="discountTax"
            type="number"
            variant="standard"
            margin="normal"
            value={formik.values.discountTax}
            InputProps={{
              disableUnderline: true,
              sx: {
                marginTop: "-5px",
              },
              endAdornment: (
                <i
                  style={{
                    color: "#5EA3A3",
                    fontSize: "1.1vw",
                  }}
                  className="far fa-percent"
                ></i>
              ),
            }}
            onChange={formik.handleChange}
            error={
              formik.touched.discountTax && Boolean(formik.errors.discountTax)
            }
            sx={
              formik.touched.discountTax && Boolean(formik.errors.discountTax)
                ? {
                    border: "1.4px solid #E6643180",
                    marginTop: "0px",
                    width: "7vw",
                    "@media (max-height: 900px)": {
                      width: "8vw",
                    },
                  }
                : {
                    border: "1.4px solid #5EA3A3",
                    marginTop: "0px",
                    width: "7vw",
                    "@media (max-height: 900px)": {
                      width: "8vw",
                    },
                  }
            }
          />
        </Box>

        <Box
          sx={{
            marginLeft: "3rem",
          }}
        >
          <InputTitles marginBottom={2}>Fecha Fin</InputTitles>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              value={formik.values.opExpiration}
              onChange={formik.handleChange}
              renderInput={(params) => (
                <MuiTextField
                  id="opExpiration"
                  placeholder="Ingresa la fecha"
                  name="opExpiration"
                  type="date"
                  variant="standard"
                  margin="normal"
                  value={formik.values.opExpiration}
                  InputProps={{
                    disableUnderline: true,
                    sx: {
                      marginTop: "-5px",
                    },
                  }}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.date && Boolean(formik.errors.opExpiration)
                  }
                  sx={
                    formik.touched.date && Boolean(formik.errors.opExpiration)
                      ? {
                          border: "1.4px solid #E6643180",
                          marginTop: "0px",
                          width: "7vw",
                          "@media (max-height: 900px)": {
                            width: "8.5vw",
                            marginLeft: "-0.8rem",
                          },
                        }
                      : {
                          border: "1.4px solid #5EA3A3",
                          marginTop: "0px",
                          width: "7vw",
                          "@media (max-height: 900px)": {
                            width: "8.5vw",
                            marginLeft: "-0.8rem",
                          },
                        }
                  }
                />
              )}
              components={{
                OpenPickerIcon: () => (
                  <Box color="#5EA3A3" width={24} height={24}>
                    <i className="far fa-xs fa-calendar-range" />
                  </Box>
                ),
              }}
            />
          </LocalizationProvider>
        </Box>
      </Box>

      <Box
        sx={{
          marginLeft: "1rem",
          marginTop: "2rem",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <BrokerByClientSelect formik={formik} isEmitter={true} />

        <BrokerByClientSelect
          formik={formik}
          isEmitter={false}
          marginLeft={"3rem"}
        />
      </Box>

      <Box
        display="flex"
        flexDirection="row"
        alignItems="space-around"
        sx={{
          marginTop: "1rem",
          marginLeft: "1rem",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            marginTop: "1.2rem",
          }}
        >
          <InputTitles marginBottom={2}>Dias en Operacion</InputTitles>
          <MuiTextField
            id="operationDays"
            placeholder=""
            name="operationDays"
            type="number"
            variant="standard"
            margin="normal"
            value={formik.values.operationDays}
            InputProps={{
              disableUnderline: true,
              sx: {
                marginTop: "-5px",
              },
            }}
            onChange={formik.handleChange}
            error={
              formik.touched.operationDays &&
              Boolean(formik.errors.operationDays)
            }
            sx={
              formik.touched.operationDays &&
              Boolean(formik.errors.operationDays)
                ? aSx
                : bSx
            }
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            marginTop: "1.2rem",
            marginLeft: "2rem",
          }}
        >
          <InputTitles marginBottom={2}>Utilidad Inversion</InputTitles>
          <MuiTextField
            id="investorProfit"
            placeholder=""
            name="investorProfit"
            type="number"
            variant="standard"
            margin="normal"
            disabled
            value={formik.values.investorProfit}
            InputProps={{
              disableUnderline: true,
              sx: {
                marginTop: "-5px",
              },
              startAdornment: (
                <i
                  style={{
                    color: "#5EA3A3",
                    marginRight: "0.7vw",
                    fontSize: "1.1vw",
                  }}
                  className="far fa-dollar-sign"
                ></i>
              ),
            }}
            onChange={formik.handleChange}
            error={
              formik.touched.investorProfit &&
              Boolean(formik.errors.investorProfit)
            }
            sx={
              formik.touched.investorProfit &&
              Boolean(formik.errors.investorProfit)
                ? aSx
                : bSx
            }
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            marginTop: "1.2rem",
          }}
        ></Box>
      </Box>

      <Box
        display="flex"
        flexDirection="row"
        alignItems="space-around"
        sx={{
          marginTop: "1rem",
          marginLeft: "1rem",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            marginTop: "1.2rem",
          }}
        >
          <InputTitles marginBottom={2}>Valor Presente Inversion</InputTitles>
          <MuiTextField
            id="presentValueInvestor"
            placeholder=""
            name="presentValueInvestor"
            type="number"
            variant="standard"
            margin="normal"
            disabled
            value={formik.values.presentValueInvestor}
            InputProps={{
              disableUnderline: true,
              sx: {
                marginTop: "-5px",
              },
            }}
            onChange={formik.handleChange}
            error={
              formik.touched.presentValueInvestor &&
              Boolean(formik.errors.presentValueInvestor)
            }
            sx={
              formik.touched.presentValueInvestor &&
              Boolean(formik.errors.presentValueInvestor)
                ? aSx
                : bSx
            }
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            marginTop: "1.2rem",
            marginLeft: "2rem",
          }}
        >
          <InputTitles marginBottom={2}>Valor Presente SF</InputTitles>
          <MuiTextField
            id="presentValueSF"
            placeholder=""
            name="presentValueSF"
            type="number"
            variant="standard"
            margin="normal"
            disabled
            value={formik.values.presentValueSF}
            InputProps={{
              disableUnderline: true,
              sx: {
                marginTop: "-5px",
              },
              startAdornment: (
                <i
                  style={{
                    color: "#5EA3A3",
                    marginRight: "0.7vw",
                    fontSize: "1.1vw",
                  }}
                  className="far fa-dollar-sign"
                ></i>
              ),
            }}
            onChange={formik.handleChange}
            error={
              formik.touched.presentValueSF &&
              Boolean(formik.errors.presentValueSF)
            }
            sx={
              formik.touched.presentValueSF &&
              Boolean(formik.errors.presentValueSF)
                ? aSx
                : bSx
            }
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            marginTop: "1.2rem",
          }}
        ></Box>
      </Box>

      <Box
        display="flex"
        flexDirection="row"
        alignItems="space-around"
        sx={{
          marginTop: "1rem",
          marginLeft: "1rem",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            marginTop: "1.2rem",
          }}
        >
          <InputTitles marginBottom={2}>Comisión SF</InputTitles>
          <MuiTextField
            id="commissionSF"
            placeholder=""
            name="commissionSF"
            type="number"
            variant="standard"
            margin="normal"
            disabled
            value={formik.values.commissionSF}
            InputProps={{
              disableUnderline: true,
              sx: {
                marginTop: "-5px",
              },
            }}
            onChange={formik.handleChange}
            error={
              formik.touched.commissionSF && Boolean(formik.errors.commissionSF)
            }
            sx={
              formik.touched.commissionSF && Boolean(formik.errors.commissionSF)
                ? aSx
                : bSx
            }
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            marginTop: "1.2rem",
            marginLeft: "2rem",
          }}
        >
          <InputTitles marginBottom={2}>GM</InputTitles>
          <MuiTextField
            id="GM"
            placeholder=""
            name="GM"
            type="number"
            variant="standard"
            margin="normal"
            disabled={formik.values.applyGm ? false : true}
            value={formik.values.GM}
            InputProps={{
              disableUnderline: true,
              sx: {
                marginTop: "-5px",
              },
              startAdornment: (
                <i
                  style={{
                    color: "#5EA3A3",
                    marginRight: "0.7vw",
                    fontSize: "1.1vw",
                  }}
                  className="far fa-dollar-sign"
                ></i>
              ),
            }}
            onChange={formik.handleChange}
            error={formik.touched.gm && Boolean(formik.errors.GM)}
            sx={formik.touched.gm && Boolean(formik.errors.GM) ? aSx : bSx}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            marginTop: "1.2rem",
          }}
        ></Box>
        <Box
          display="flex"
          flexDirection="column"
          width={"30%"}
          justifyContent={"flex-end"}
        >
          <Button
            variant="standard"
            onClick={formik.handleSubmit}
            sx={{
              backgroundColor: "#488B8F",
              borderRadius: "4px",
              color: "#FFFFFF",
              height: "3rem",
              width: "14vw",
              marginTop: "0rem",
              marginBottom: "2rem",
              position: "fixed",
              bottom: "3.5rem",
              right: "8rem",
              fontSize: "0.7rem",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#5EA3A3",
              },
            }}
            aria-label="add"
          >
            {isEditing ? "Actualizar" : "Guardar"}
          </Button>

          <Button
            variant="standard"
            disabled={
              formik.values.bill != "" || formik.values.billCode != ""
                ? false
                : true
            }
            onClick={handleMultipleOperations}
            sx={{
              backgroundColor: "#488B8F",
              borderRadius: "4px",
              color: "#FFFFFF",
              height: "3rem",
              width: "14vw",
              marginTop: "2rem",
              marginBottom: "2rem",
              position: "fixed",
              bottom: "9rem",
              right: "8rem",
              fontSize: "0.7rem",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#5EA3A3",
              },
            }}
            aria-label="add"
          >
            {"Agregar factura"}
            <BookOutlined sx={{ ml: 1, fontSize: "medium" }} />
          </Button>
        </Box>
      </Box>

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
    </Box>
  );
};
