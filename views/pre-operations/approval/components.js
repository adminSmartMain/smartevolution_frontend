import { useState } from "react";



import { Box, CircularProgress, Fade, Grid, Typography } from "@mui/material";



import TitleModal from "@components/modals/titleModal";



import ValueFormat from "@formats/ValueFormat";



import responsiveFontSize from "@lib/responsiveFontSize";



import BackButton from "@styles/buttons/BackButton";
import DashboardButton from "@styles/buttons/button_3";
import CustomTooltip from "@styles/customTooltip";
import InputTitles from "@styles/inputTitles";
import scrollSx from "@styles/scroll";


const half = {
  boxSizing: "border-box",
  width: "60%",
  py: 4,
  px: 5,
};

const leftHalf = {
  /* backgroundColor: "red", */
  display: "flex",
  flexDirection: "column",
};

const rightHalf = {
  backgroundColor: "#488B8F",
  pr: 8,
};

const quarter = {
  height: "70%",
  position: "relative",
  ...scrollSx,
};

const separator = {
  width: "100%",

  position: "absolute",
  bottom: 20,
  left: 0,

  borderBottom: "1px solid #57575780",
};

const upperQuarter = {
  /* backgroundColor: "teal", */
  boxSizing: "border-box",
  pb: 2.5,
};

const upperQuarterWrapper = {
  height: "calc(100% - 2.5px)",
  overflowY: "auto",
  ...scrollSx,
};

const upperLeftQuarterGrid = {
  mt: 1.75,
};

const lowerQuarter = {
  /*   backgroundColor: "pink", */
};

const lowerLeftQuarterGrid = {
  mt: 5,
};

const lowerRightQuarterGrid = {};

const circularProgressWrapper = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const distributionLegend = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
};

const conventionWrapper = {
  my: "auto",

  position: "relative",
  top: -24,

  display: "flex",
  alignItems: "center",
  gap: 1,

  fontWeight: 500,
};

const conventionDot = {
  display: "inline-block",
  aspectRatio: "1",
  width: 16,
  backgroundColor: "#488b8f",
  borderRadius: "50%",
};

const title = {
  color: "#488B8F",
  fontSize: responsiveFontSize(31.25, 2, 4),
};

const subtitle = {
  color: "#333333",
  fontSize: responsiveFontSize(25, 1.2, 5),
  fontWeight: 500,
};

const valueStatBold = {
  fontSize: responsiveFontSize(25, 1.5, 4.5),
  fontWeight: 600,
  lineHeight: "1em",
};

const rightAlignedLabel = {
  display: "flex",
  justifyContent: "end",
  alignItems: "center",
};

const totalDisplay = {
  mt: 1,
  position: "relative",
};

const display = {
  border: "1px solid #C7C7C780",
  borderRadius: 1,

  backgroundColor: "#FFFFFF1A",

  width: "calc(100% - 44px)",
  height: 35,

  position: "absolute",
  top: 25,
  left: 36,
};

const DetailEntry = (props) => {
  const { title, value, wrapperSx, titleSx, valueSx, ...rest } = props;

  return (
    <Box sx={{ m: 0, p: 0, ...wrapperSx }}>
      <InputTitles sx={{ mb: 1.25, ...titleSx }}>{title}</InputTitles>
      <Typography
        sx={{
          color: "#333333",
          fontSize: responsiveFontSize(16, 0.9, 5),
          fontWeight: 500,
          ...valueSx,
        }}
      >
        {value}
      </Typography>
    </Box>
  );
};

const LabelStats = (props) => {
  const { children, wrapperSx, valueSx, ...rest } = props;

  return (
    <Box sx={{ ...wrapperSx }}>
      <Typography
        sx={{
          color: "#EBEBEB",
          fontSize: responsiveFontSize(16, 0.9, 5),
          fontWeight: 400,
          ...valueSx,
        }}
      >
        {children}
      </Typography>
    </Box>
  );
};

const ValueStats = (props) => {
  const { children, wrapperSx, valueSx, ...rest } = props;

  return (
    <Box sx={{ ...wrapperSx }}>
      <Typography
        sx={{
          color: "#EBEBEB",
          fontSize: responsiveFontSize(31.25, 1.4, 10),
          ...valueSx,
        }}
      >
        {children}
      </Typography>
    </Box>
  );
};

const OperationDetail = ({
  data,
  sendBuyOrderFunc,
  handlePDFView,
  PDFData,
  ToastContainer,
  sendingBuyOrder,
}) => {
  const [openPDF, setOpenPDF] = useState(false);
  const handleOpenPDF = () => {
    handlePDFView();
    setOpenPDF(true);
  };
  const handleClosePDF = () => {
    setOpenPDF(false);
  };

  return (
    <>
      <Box sx={{ display: "flex", height: "76vh" }}>
        <Box sx={{ ...half, ...leftHalf }}>
          <Box
            sx={{
              ...quarter,
              ...upperQuarter,
              ["@media (max-height: 900px)"]: {
                height: "52%",
              },
              ["@media (min-height: 901px)"]: {
                height: "45%",
              },
            }}
          >
            <Box sx={{ ...upperQuarterWrapper }}>
              <BackButton path="/operations/electronicSignature" />
              <Typography sx={{ ...title }}>Detalle de Operación</Typography>
              <Grid container spacing={3} sx={{ ...upperLeftQuarterGrid }}>
                <Grid item md={6} lg={6}>
                  <InputTitles sx={{ mb: 1.25 }}>{"Emisor"}</InputTitles>
                  <CustomTooltip
                    title={data?.emitter?.name}
                    arrow
                    placement="bottom-start"
                    TransitionComponent={Fade}
                    PopperProps={{
                      modifiers: [
                        {
                          name: "offset",
                          options: {
                            offset: [0, -10],
                          },
                        },
                      ],
                    }}
                  >
                    <Typography
                      letterSpacing={0}
                      fontSize="1.042vw"
                      fontWeight="medium"
                      color="#333333"
                    >
                      {data?.emitter?.name?.length > 20
                        ? data?.emitter?.name.substring(0, 20) + "..."
                        : data?.emitter?.name}
                    </Typography>
                  </CustomTooltip>
                </Grid>
                <Grid item md={6} lg={4}>
                  <InputTitles sx={{ mb: 1.25 }}>{"Inversionista"}</InputTitles>
                  <CustomTooltip
                    title={data?.investor?.name}
                    arrow
                    placement="bottom-start"
                    TransitionComponent={Fade}
                    PopperProps={{
                      modifiers: [
                        {
                          name: "offset",
                          options: {
                            offset: [0, -10],
                          },
                        },
                      ],
                    }}
                  >
                    <Typography
                      letterSpacing={0}
                      fontSize="1.042vw"
                      fontWeight="medium"
                      color="#333333"
                    >
                      {data?.investor?.name?.length > 20
                        ? data?.investor?.name.substring(0, 20) + "..."
                        : data?.investor?.name}
                    </Typography>
                  </CustomTooltip>
                </Grid>
                <Grid item md={6} lg={6}>
                  <DetailEntry title="NIT" value={data?.emitter?.document} />
                </Grid>
                <Grid item md={6} lg={6}>
                  <DetailEntry title="NIT" value={data?.investor?.document} />
                </Grid>
              </Grid>
            </Box>
            <Box component="span" sx={{ ...separator }} />
          </Box>
          <Box>
            <Box>
              <Typography sx={{ ...title }}>Pagadores</Typography>
              <Box
                display="flex"
                flexDirection="column"
                width="100%"
                mb={5}
                mt={2}
                sx={{ ...scrollSx }}
              >
                <Box display="flex" flexDirection="row" width="100%">
                  <InputTitles width="60%">Descripción</InputTitles>
                  <InputTitles width="20%">Fecha</InputTitles>
                </Box>
                {data?.payers?.data?.map((item, index) => (
                  <Box display="flex" flexDirection="row" mt={3} key={index}>
                    <CustomTooltip
                      title={item.name}
                      arrow
                      placement="bottom-start"
                      TransitionComponent={Fade}
                      PopperProps={{
                        modifiers: [
                          {
                            name: "offset",
                            options: {
                              offset: [0, -10],
                            },
                          },
                        ],
                      }}
                    >
                      <Typography
                        letterSpacing={0}
                        fontSize="100%"
                        fontWeight="medium"
                        color="#333333"
                        width="60%"
                      >
                        {item?.name?.length > 50
                          ? item?.name?.substring(0, 50) + "..."
                          : item?.name}
                      </Typography>
                    </CustomTooltip>
                    <Typography
                      letterSpacing={0}
                      fontSize="100%"
                      fontWeight="medium"
                      color="#333333"
                      width="20%"
                    >
                      {item?.documentNumber}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
        <Box></Box>
        <Box sx={{ ...half, ...rightHalf }}>
          <Box
            sx={{
              ...quarter,
              ...upperQuarter,
              ["@media (max-height: 900px)"]: {
                height: "100%",
              },
            }}
          >
            <Box sx={{ ...upperQuarterWrapper }}>
              <Grid container>
                <Grid item sm={6}>
                  <Typography sx={{ ...subtitle, color: "white" }}>
                    Resumen general
                  </Typography>
                </Grid>
                <Grid
                  item
                  sm={6}
                  sx={{ display: "flex", justifyContent: "flex-end" }}
                >
                  <DashboardButton
                    startIcon={<i className="fa-brands fa-whatsapp" />}
                    sx={{ color: "white", borderColor: "white" }}
                    disabled={sendingBuyOrder}
                    onClick={sendBuyOrderFunc}
                  >
                    Enviar a whatsapp
                  </DashboardButton>
                  <DashboardButton
                    startIcon={<i className="fa-light fa-file-pdf" />}
                    sx={{ color: "white", borderColor: "white", ml: 1 }}
                    onClick={handleOpenPDF}
                  >
                    PDF
                  </DashboardButton>
                </Grid>
              </Grid>

              <Grid container spacing={2.75} sx={{ ...upperLeftQuarterGrid }}>
                <Grid
                  item
                  md={12}
                  lg={6}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <LabelStats>Cuenta</LabelStats>
                </Grid>
                <Grid item md={12} lg={6}>
                  <ValueStats valueSx={{ textAlign: "right" }}>
                    {data?.investor?.investorAccountNumber}
                  </ValueStats>
                </Grid>
                <Grid
                  item
                  md={12}
                  lg={6}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <LabelStats>Saldo Disponible</LabelStats>
                </Grid>
                <Grid item md={12} lg={6}>
                  <ValueStats valueSx={{ textAlign: "right" }}>
                    <ValueFormat
                      prefix="$ "
                      value={data?.investor?.investorAccountBalance}
                    />
                  </ValueStats>
                </Grid>
                <Grid
                  item
                  md={12}
                  lg={6}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <LabelStats>Cantidad de Facturas</LabelStats>
                </Grid>
                <Grid item md={12} lg={6}>
                  <ValueStats valueSx={{ textAlign: "right", fontWeight: 700 }}>
                    {data?.bills?.billsCount}
                  </ValueStats>
                </Grid>
                <Grid
                  item
                  md={12}
                  lg={6}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <LabelStats>Plazo Promedio</LabelStats>
                </Grid>
                <Grid item md={12} lg={6}>
                  <ValueStats valueSx={{ textAlign: "right", fontWeight: 700 }}>
                    {data?.bills?.averageTerm} días
                  </ValueStats>
                </Grid>

                <Grid
                  item
                  md={12}
                  lg={6}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <LabelStats>Monto</LabelStats>
                </Grid>
                <Grid item md={12} lg={6}>
                  <ValueStats valueSx={{ textAlign: "right", fontWeight: 700 }}>
                    <ValueFormat prefix="$ " value={data?.bills?.amount} />
                  </ValueStats>
                </Grid>
                <Grid
                  item
                  md={12}
                  lg={6}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <LabelStats>Celular Inversionista</LabelStats>
                </Grid>
                <Grid item md={12} lg={6}>
                  <ValueStats valueSx={{ textAlign: "right", fontWeight: 700 }}>
                    {data?.investor?.phone}
                  </ValueStats>
                </Grid>
              </Grid>
            </Box>
            <Box component="span" sx={{ ...separator, borderColor: "white" }} />
          </Box>
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
      </Box>
      <TitleModal
        open={openPDF}
        handleClose={handleClosePDF}
        containerSx={{
          width: "70%",
          height: "60%",
        }}
        title={"Oferta de Venta (PDF)"}
      >
        <Box
          display="flex"
          flexDirection="column"
          mt={5}
          sx={{ ...scrollSx }}
          height="50vh"
          alignItems="center"
        >
          {PDFData && PDFData?.data?.pdf && (
            <iframe
              src={`data:application/pdf;base64,${PDFData?.data?.pdf}`}
              width="100%"
              height="100%"
            />
          )}
        </Box>
      </TitleModal>
    </>
  );
};

export default OperationDetail;