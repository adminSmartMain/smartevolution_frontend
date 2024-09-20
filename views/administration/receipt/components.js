import { useState } from "react";

import { useRouter } from "next/router";

import { Box, Grid, Typography } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import ClientSelect from "@components/selects/customerSelect";
import OperationSelect from "@components/selects/operationBySelect";
import BillsByOperationSelect from "@components/selects/billByOperationSelect";
import TypeReceiptSelect from "@components/selects/typeReceiptSelect";
import AccountSelect from "@components/selects/accountSelect";

import BackButton from "@styles/buttons/BackButton";
import MuiTextField from "@styles/fields";
import HelperText from "@styles/helperText";
import InputTitles from "@styles/inputTitles";
import scrollSx from "@styles/scroll";

import dayjs from "dayjs";
import BaseField from "@styles/fields/BaseField";

const aSx = {
  border: "1.4px solid #E6643180",
  marginTop: "0px",
  marginLeft: "1.5rem",
  width: "17vw",
  "@media (max-height: 900px)": {
    width: "17vw",
  },
};

const bSx = {
  border: "1.4px solid #5EA3A3",
  marginTop: "0px",
  width: "17vw",
  marginLeft: "1.5rem",
  "@media (max-height: 900px)": {
    width: "17vw",
  },
};

export const ReceiptC = ({
formik
}) => 
{
    const [valueD, setValue] = useState(dayjs("2014-08-18T21:11:54"));

    const [activeStep, setActiveStep] = useState(0);
  
    const handleChange = (newValue) => {
      setValue(newValue);
    };
  
    const handleNext = () => {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };
  
    const handleBack = () => {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
  
    const router = useRouter();
    return (
        <>
        <Box display="flex"  flexDirection="column" sx={{ ...scrollSx }}>
            <form onSubmit={formik.onSubmit}>
            <BackButton path="/administration" />
            {activeStep === 0 && (
            <Box display="flex" flexDirection="column" alignItems="left">
              <Typography
                letterSpacing={0}
                fontSize="1.7rem"
                fontWeight="regular"
                marginBottom="4rem"
                color="#5EA3A3"
              >
                Registrar Recaudo
              </Typography>
            
              <Box display="flex" flexDirection="row" alignItems="center">
              <Box ml={0} mb={2}  width="17vw">
                  <InputTitles>Fecha</InputTitles>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DesktopDatePicker
                      label="Date desktop"
                      inputFormat="DD/MM/YYYY"
                      value={valueD}
                      onChange={handleChange}
                      renderInput={(params) => (
                        <MuiTextField
                          id="date"
                          placeholder="Ingresa la fecha"
                          name="date"
                          type="date"
                          variant="standard"
                          margin="normal"
                          fullWidth
                          value={formik.values.date}
                          InputProps={{
                            disableUnderline: true,
                            sx: {
                              marginTop: "-5px",
                            },
                          }}
                          onChange={formik.handleChange}
                          error={
                            formik.touched.date && Boolean(formik.errors.date)
                          }
                          sx={
                            formik.touched.date && Boolean(formik.errors.date)
                              ? { border: "1.4px solid #E6643180" }
                              : null
                          }
                        />
                      )}
                    />
                  </LocalizationProvider>

                  <HelperText>
                    {formik.touched.date && formik.errors.date}
                  </HelperText>
              </Box>
              <TypeReceiptSelect formik={formik} mt={'-18px'} ml={'3rem'} disabled={true}/>
              </Box>

              <Box display="flex" flexDirection="row" alignItems="center">
              <ClientSelect formik={formik} customer={'cliente'} />
              <OperationSelect
                  formik={formik}
                  ml={'3rem'}
                  mt={'5px'}
                />
              </Box>
              <Box display="flex" flexDirection="row" alignItems="center">
                <BillsByOperationSelect formik={formik} marginTop={'1rem'} width={'5rem'} />
                <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            marginTop: "1.2rem",
          }}
        >
          <InputTitles marginBottom={2} marginLeft={3}>Dias en Operacion</InputTitles>
          <MuiTextField
            id="additionalDays"
            placeholder=""
            name="additionalDays"
            type="number"
            variant="standard"
            margin="normal"
            value={formik.values.additionalDays}
            disabled={true}
            InputProps={{
              disableUnderline: true,
              sx: {
                marginTop: "-5px",
              },
            }}
            onChange={formik.handleChange}
            error={
              formik.touched.additionalDays &&
              Boolean(formik.errors.additionalDays)
            }
            sx={
              formik.touched.additionalDays &&
              Boolean(formik.errors.additionalDays)
                ? aSx
                : bSx
            }
          />
        </Box>
              </Box>
              <Box display="flex" flexDirection="row" alignItems="center">
              <Box>
          <InputTitles marginBottom={2} marginTop={2}>Monto</InputTitles>
          <BaseField
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
            sx={{
              marginTop: "6px",
              width: "18.3vw",

              "@media (max-height: 900px)": {
                width: "18.7vw",
              },
            }}
            id="payedAmount"
            placeholder=""
            name="payedAmount"
            isMasked
            value={formik.values.payedAmount}
            thousandSeparator="."
            decimalSeparator=","
            decimalScale={0}
            allowNegative={false}
            error={
              formik.touched.payedAmount && Boolean(formik.errors.payedAmount)
            }
            onChangeMasked={(values) => {
              formik.setFieldValue("payedAmount", values.floatValue);
            }}
          />
        </Box>
        <Box>
          <InputTitles marginBottom={2} marginTop={2} marginLeft={3.2}>Intereses Adicionales</InputTitles>
          <BaseField
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
            sx={{
              marginTop: "6px",
              width: "18.3vw",
              marginLeft: "1.5rem",
              "@media (max-height: 900px)": {
                width: "18.7vw",
              },
            }}
            id="additionalInterests"
            placeholder=""
            name="additionalInterests"
            isMasked
            value={formik.values.additionalInterests}
            thousandSeparator="."
            decimalSeparator=","
            decimalScale={0}
            allowNegative={false}
            disabled={true}
            error={
              formik.touched.additionalInterests && Boolean(formik.errors.additionalInterests)
            }
            onChangeMasked={(values) => {
              formik.setFieldValue("additionalInterests", values.floatValue);
            }}
          />
        </Box>
              </Box>

              <Box display="flex" flexDirection="row" alignItems="center">
              <Box>
          <InputTitles marginBottom={2} marginTop={3}>Intereses Adicionales Inversionista</InputTitles>
          <BaseField
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
            sx={{
              marginTop: "6px",
              width: "18.3vw",

              "@media (max-height: 900px)": {
                width: "18.7vw",
              },
            }}
            id="investorInterests"
            placeholder=""
            name="investorInterests"
            isMasked
            value={formik.values.investorInterests}
            thousandSeparator="."
            decimalSeparator=","
            decimalScale={0}
            allowNegative={false}
            disabled={true}
            error={
              formik.touched.investorInterests && Boolean(formik.errors.investorInterests)
            }
            onChangeMasked={(values) => {
              formik.setFieldValue("investorInterests", values.floatValue);
            }}
          />
        </Box>
        <Box>
          <InputTitles marginBottom={2} marginTop={3} marginLeft={2.2}>Intereses Adicionales Mesa</InputTitles>
          <BaseField
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
            sx={{
              marginTop: "6px",
              width: "18.3vw",
              marginLeft: "1.5rem",
              "@media (max-height: 900px)": {
                marginLeft: "1.1rem",
                width: "18.7vw",
              },
            }}
            id="tableInterests"
            placeholder=""
            name="tableInterests"
            isMasked
            value={formik.values.tableInterests}
            thousandSeparator="."
            decimalSeparator=","
            decimalScale={0}
            allowNegative={false}
            disabled={true}
            error={
              formik.touched.tableInterests && Boolean(formik.errors.tableInterests)
            }
            onChangeMasked={(values) => {
              formik.setFieldValue("tableInterests", values.floatValue);
            }}
          />
        </Box>
              </Box> 
              <Box display="flex" flexDirection="row" alignItems="center">
              <Box>
          <InputTitles marginBottom={2} marginTop={3}>Valor Futuro Recalculo</InputTitles>
          <BaseField
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
            sx={{
              marginTop: "6px",
              width: "18.3vw",

              "@media (max-height: 900px)": {
                width: "18.7vw",
              },
            }}
            id="futureValueRecalculation"
            placeholder=""
            name="futureValueRecalculation"
            isMasked
            value={formik.values.futureValueRecalculation}
            thousandSeparator="."
            decimalSeparator=","
            decimalScale={0}
            allowNegative={false}
            disabled={true}
            error={
              formik.touched.futureValueRecalculation && Boolean(formik.errors.futureValueRecalculation)
            }
            onChangeMasked={(values) => {
              formik.setFieldValue("futureValueRecalculation", values.floatValue);
            }}
          />
        </Box>
        <Box>
          <InputTitles marginBottom={2} marginTop={3} marginLeft={3.6}>GM</InputTitles>
          <BaseField
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
            sx={{
              marginTop: "6px",
              width: "18.3vw",
              marginLeft: "1.5rem",
              "@media (max-height: 900px)": {
                marginLeft: "1.6rem",
                width: "18.7vw",
              },
            }}
            id="gmvValue"
            placeholder=""
            name="gmvValue"
            isMasked
            value={formik.values.gmvValue}
            thousandSeparator="."
            decimalSeparator=","
            decimalScale={0}
            allowNegative={false}
            disabled={true}
            error={
              formik.touched.gmvValue && Boolean(formik.errors.gmvValue)
            }
            onChangeMasked={(values) => {
              formik.setFieldValue("gmvValue", values.floatValue);
            }}
          />
        </Box>
              </Box> 
            </Box>
          )}
            </form>
        </Box>
        </>
    )
}