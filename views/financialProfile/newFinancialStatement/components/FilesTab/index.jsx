//React imports
//Material UI imports
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { Box, Button, CircularProgress, Grid, Typography } from "@mui/material";

//Queries imports
import { Toast } from "@components/toast";

import { useFetch } from "@hooks/useFetch";

import { getBase64 } from "../../libs/pdf";
import { UpdatePeriod } from "../../queries";
import { financialStatementActions } from "../../store/slice";
import FileInput from "../FileInput";

export default (props) => {
  const inputs = [
    {
      key: "balance",
      title: "BALANCE",
    },
    {
      key: "stateOfCashflow",
      title: "ESTADO DE FLUJO DE EFECTIVO",
    },
    {
      key: "financialStatementAudit",
      title: "DICTAMEN DE ESTADOS FINANCIEROS",
    },
    {
      key: "managementReport",
      title: "INFORME DE GESTIÓN",
    },
    {
      key: "certificateOfStockOwnership",
      title: "CERTIFICADO DE COMPOSICIÓN ACCIONARIA",
    },
    {
      key: "rentDeclaration",
      title: "DECLARACIÓN DE RENTA",
    },
  ];

  const { tabValue, period, indexPeriod } = props;
  const [allFiles, setAllFiles] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  useEffect(async () => {
    const initvalues = await inputs.map(async (item) => {
      if (period[item.key]) {
        let filename = period[item.key].split("/");
        filename = filename[filename.length - 1];
        const response = await fetch(period[item.key], {
          method: "GET",
          headers: {
            "Content-Type": "application/pdf",
          },
        });
        const blob = await response.blob();
        const data = await getBase64(blob);
        return {
          [item.key]: {
            data: data,
            name: filename,
          },
        };
      }
    });
    Promise.all(initvalues).then((values) => {
      const newValues = {};
      for (let i = 0; i < values.length; i++) {
        Object.assign(newValues, values[i]);
      }
      setAllFiles(newValues);
      setIsLoading(false);
    });
  }, []);

  const {
    fetch: fetchUpdatePeriod,
    loading: loading,
    error: error,
    data: data,
  } = useFetch({ service: UpdatePeriod, init: false });

  const handleUpdatePeriod = async () => {
    fetchUpdatePeriod(period.id, {
      balance: allFiles?.balance?.data,
      stateOfCashflow: allFiles?.stateOfCashflow?.data,
      financialStatementAudit: allFiles?.financialStatementAudit?.data,
      managementReport: allFiles?.managementReport?.data,
      certificateOfStockOwnership: allFiles?.certificateOfStockOwnership?.data,
      rentDeclaration: allFiles?.rentDeclaration?.data,
    }).then((res) => {
      if (res.status === 200) {
        dispatch(
          financialStatementActions.updatePeriod({
            indexPeriod: indexPeriod,
            formik: period.formik,
            data: {
              ...period,
              balance: res.data.data.balance,
              stateOfCashflow: res.data.data.stateOfCashflow,
              financialStatementAudit: res.data.data.financialStatementAudit,
              managementReport: res.data.data.managementReport,
              certificateOfStockOwnership:
                res.data.data.certificateOfStockOwnership,
              rentDeclaration: res.data.data.rentDeclaration,
            },
          })
        );
        Toast("Documentos actualizados correctamente.", "success");
      } else {
        Toast("No se ha podido actualizar los documentos.", "error");
      }
    });
  };

  return isLoading ? (
    <Box
      display="flex"
      flexDirection="column"
      width="100%"
      height="65vh"
      justifyContent="center"
      alignItems="center"
    >
      <CircularProgress style={{ color: "#488B8F" }} />
    </Box>
  ) : (
    <Box
      display="flex"
      flexDirection="column"
      position="relative"
      width="100%"
      height="100%"
      justifyContent="center"
      alignItems="center"
      gap="20px"
    >
      <Box
        display="flex"
        position="relative"
        flexDirection="row"
        justifyContent="flex-start"
        alignItems="center"
        zIndex={99}
        width="100%"
      >
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="flex-start"
          alignItems="center"
        >
          <Grid container sx={{ width: "100%" }}>
            {inputs.map((item, index) => {
              return (
                <FileInput
                  key={"FileInput-" + index}
                  item={item}
                  tabValue={tabValue}
                  period={period}
                  allFiles={allFiles}
                  setAllFiles={setAllFiles}
                />
              );
            })}
          </Grid>
        </Box>
      </Box>
      <Box
        width="100%"
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
      >
        <Button
          variant="standard"
          color="primary"
          size="large"
          onClick={handleUpdatePeriod}
          disabled={loading}
          sx={{
            width: "100px",
            height: "2.6rem",
            backgroundColor: "#488B8F",
            border: "1.4px solid #5EA3A3",
            borderRadius: "4px",
            "&:hover": {
              backgroundColor: "#5EA3A3",
            },
            color: "#FFFFFF",
          }}
        >
          {loading ? (
            <CircularProgress
              disableShrink={true}
              size={20}
              sx={{
                color: "#FFFFFF",
              }}
            />
          ) : (
            <>
              <Typography
                letterSpacing={0}
                fontSize="80%"
                fontWeight="bold"
                color="#FFFFFF"
                mr="10px"
              >
                Guardar
              </Typography>

              <i class="fa-solid fa-floppy-disk"></i>
            </>
          )}
        </Button>
      </Box>
    </Box>
  );
};
