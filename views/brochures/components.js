import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";

import { SearchOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Fade,
  IconButton,
  Typography,
} from "@mui/material";
import Link from "next/link";
import {
  Home as HomeIcon,

} from "@mui/icons-material";
import Modal from "@components/modals/modal";
import TitleModal from "@components/modals/titleModal";
import { Toast } from "@components/toast";

import DateFormat from "@formats/DateFormat";

import { useFetch } from "@hooks/useFetch";

import downloadFile from "@lib/downloadFile";

import BackButton from "@styles/buttons/BackButton";
import RedButtonModal from "@styles/buttons/noButtonModal";
import GreenButtonModal from "@styles/buttons/yesButtonModal";
import CustomTooltip from "@styles/customTooltip";
import BaseField from "@styles/fields/BaseField";
import InputTitles from "@styles/inputTitles";
import scrollSx from "@styles/scroll";
import CustomDataGrid from "@styles/tables";

import {
  AcceptBrochureById,
  DeleteBrochureById,
  GetBrochureList,
  GetLegalClientPDF,
  GetNaturalClientPDF,
  RejectBrochureById,
  ReviewBrochureById,
  SendSignature,
} from "./queries";

import moment from "moment";
const sectionTitleContainerSx = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "rigth",
};

export const BrochureListComponent = () => {
  const [filter, setFilter] = useState("name");
  const [query, setQuery] = useState("");
  const [brochure, setBrochure] = useState([]);
  const [brochureType, setBrochureType] = useState("legalClient");
  const [page, setPage] = useState(1);

  const [open, setOpen] = useState([false, "", null]);
  const handleOpen = (broker, id) => setOpen([true, broker, id]);
  const handleClose = () => setOpen([false, "", null]);
  const [open2, setOpen2] = useState([false, "", null]);
  const handleOpen2 = (broker, id) => setOpen2([true, broker, id]);
  const handleClose2 = () => setOpen2([false, "", null]);
  const [open3, setOpen3] = useState([false, "", null]);
  const handleOpen3 = (broker, id) => setOpen3([true, broker, id]);
  const handleClose3 = () => setOpen3([false, "", null]);
  const [openClientResume, setOpenClientResume] = useState(false);
  const handleOpenClientResume = () => {
    setOpenClientResume(true);
  };
  const handleCloseClientResume = () => {
    setOpenClientResume(false);
  };
  const [openSignatureConfirmation, setOpenSignatureConfirmation] = useState([
    false,
    null,
  ]);
  const handleOpenSignatureConfirmation = (id) => {
    setOpenSignatureConfirmation([true, id]);
  };
  const handleCloseSignatureConfirmation = () => {
    setOpenSignatureConfirmation([false, null]);
  };

  const {
    fetch: fetchGetNaturalClientPDF,
    loading: loadingGetNaturalClientPDF,
    error: errorGetNaturalClientPDF,
    data: dataGetNaturalClientPDF,
  } = useFetch({ service: GetNaturalClientPDF, init: false });

  const {
    fetch: fetchGetLegalClientPDF,
    loading: loadingGetLegalClientPDF,
    error: errorGetLegalClientPDF,
    data: dataGetLegalClientPDF,
  } = useFetch({ service: GetLegalClientPDF, init: false });

  const {
    fetch: fetchSendSignature,
    loading: loadingSendSignature,
    error: errorSendSignature,
    data: dataSendSignature,
  } = useFetch({ service: SendSignature, init: false });

  const handleClientResumePDF = (id) => {
    brochureType && brochureType === "legalClient"
      ? fetchGetLegalClientPDF(id)
      : fetchGetNaturalClientPDF(id);
    handleOpenClientResume();
  };

  const columns = [
    {
      field: "NoID",
      headerName: "# ID",
      width: 110,
      renderCell: (params) => {
        return (
          <CustomTooltip
            title={params.value}
            arrow
            placement="bottom-start"
            TransitionComponent={Fade}
            PopperProps={{
              modifiers: [
                {
                  name: "offset",
                  options: {
                    offset: [0, 0],
                  },
                },
              ],
            }}
          >
            <InputTitles>{params.value}</InputTitles>
          </CustomTooltip>
        );
      },
    },
    {
      field: "Customer",
      headerName: "CLIENTE",
      width: 200,
      renderCell: (params) => {
        return (
          <CustomTooltip
            title={params.value}
            arrow
            placement="bottom-start"
            TransitionComponent={Fade}
            PopperProps={{
              modifiers: [
                {
                  name: "offset",
                  options: {
                    offset: [0, 0],
                  },
                },
              ],
            }}
          >
            <InputTitles>{params.value}</InputTitles>
          </CustomTooltip>
        );
      },
    },
    {
      field: "Status",
      headerName: "ESTADO",
      width: 130,
      renderCell: (params) => {
        return (
          <>
            {params.value === 1 ? (
              <i
                style={{ color: "#488B8F" }}
                className="fa-light fa-badge-check"
              ></i>
            ) : params.value === 0 ? (
              <i style={{ color: "#E66431" }} className="fa-light fa-badge"></i>
            ) : (
              <i
                style={{ color: "#C16060" }}
                className="fa-light fa-hexagon-xmark"
              ></i>
            )}
            <Typography
              fontSize="12px"
              width="100%"
              fontWeight="bold"
              color={
                params.value === 1
                  ? "#488B8F"
                  : params.value === 0
                  ? "#E66431"
                  : "#C16060"
              }
              textTransform="uppercase"
              textAlign="center"
              padding="5.5% 8%"
            >
              {params.value === 0
                ? "Sin verificar"
                : params.value === 1
                ? "Verificado"
                : "Rechazado"}
            </Typography>
          </>
        );
      },
    },
    {
      field: "DateCreated",
      headerName: "FECHA SOLICITUD",
      width: 150,
      renderCell: (params) => {
        return (
          <InputTitles>
            {params.value ? moment(params.value).format("DD/MM/YYYY") : ""}
          </InputTitles>
        );
      },
    },

    // field that exists only if brochureType is ""
    {
      field: "Exp",
      headerName: "EXP. CONSOLIDADO",
      width: 160,

      renderCell: (params) => {
        return (
          <>
            <Box
              display="flex"
              width="100%"
              fontSize="100%"
              flexDirection="row"
              justifyContent="center"
              textAlign="center"
              alignItems="center"
              padding="1% 10%"
              borderRadius="4px"
              backgroundColor="transparent"
              border={"1px solid #488B8F"}
              // pointer events
              sx={{
                cursor: "pointer",
              }}
              onClick={(e) => {
                // open 2nd modal

                handleOpen2(params.value, params.row.id);
              }}
            >
              <Typography
                fontSize="80%"
                width="100%"
                fontWeight="bold"
                color={"#488B8F"}
                textTransform="uppercase"
                marginRight="1px"
              >
                {"Descargar"}
              </Typography>

              <Typography fontFamily="icomoon" fontSize="19px" color="#488B8F">
                &#xe902;
              </Typography>
            </Box>
          </>
        );
      },
    },
    {
      field: "Comite",
      headerName: "RESULTADO COMITE DE RIESGO",
      width: 260,

      renderCell: (params) => {
        return (
          <Box
            display="flex"
            width="100%"
            flexDirection="row"
            justifyContent="space-between"
          >
            {params.value === 0 ? (
              <>
                <Typography
                  width="48%"
                  fontWeight="bold"
                  fontSize="80%"
                  color="#FFFFFF"
                  textTransform="uppercase"
                  backgroundColor="#488B8F"
                  borderRadius="4px"
                  textAlign="center"
                  alignItems="center"
                  padding="3% 0%"
                  sx={{
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    // approve
                    fetch3(brochureType, params.row.id).then((res) => {
                      fetch();
                    });
                  }}
                >
                  APROBAR
                  <i
                    style={{ fontSize: "12px", marginLeft: "5%" }}
                    className="fa-regular fa-shield-check"
                  ></i>
                </Typography>
                <Typography
                  width="48%"
                  fontSize="80%"
                  textAlign="center"
                  border="1px solid #C16060"
                  fontWeight="bold"
                  color="#C16060"
                  borderRadius="4px"
                  textTransform="uppercase"
                  padding="3% 0%"
                  sx={{
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    fetch4(brochureType, params.row.id).then((res) => {
                      fetch();
                    });
                  }}
                >
                  RECHAZAR
                  <i
                    style={{ fontSize: "12px", marginLeft: "5%" }}
                    className="fa-regular fa-shield-xmark"
                  ></i>
                </Typography>
              </>
            ) : (
              <Typography
                width="100%"
                fontWeight="bold"
                fontSize="80%"
                color="#E66431"
                textTransform="uppercase"
                backgroundColor="transparent"
                borderRadius="4px"
                textAlign="center"
                alignItems="center"
                padding="3% 0%"
                sx={{
                  cursor: "pointer",
                }}
                border="1px solid #E66431"
                onClick={() => {
                  // set status to 0
                  fetch6(brochureType, params.row.id).then((res) => {
                    fetch();
                  });
                }}
              >
                Solicitar Nueva Revisión
                <i
                  style={{ fontSize: "12px", marginLeft: "5%" }}
                  className="fa-light fa-shield-exclamation"
                ></i>
              </Typography>
            )}
          </Box>
        );
      },
    },

    //Iconos de acciones
    {
      field: "vinculacion",
      headerName: "",
      width: 20,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        return (
          <>
            <CustomTooltip
              title="Ver resumen"
              arrow
              placement="bottom-start"
              TransitionComponent={Fade}
              PopperProps={{
                modifiers: [
                  {
                    name: "offset",
                    options: {
                      offset: [0, -15],
                    },
                  },
                ],
              }}
            >
              <Typography
                fontFamily="icomoon"
                fontSize="1.9rem"
                color="#488B8F"
                borderRadius="5px"
                sx={{
                  "&:hover": {
                    backgroundColor: "#B5D1C980",
                  },
                  cursor: "pointer",
                }}
                onClick={() => handleOpen(params.value, params.row.id)}
              >
                &#xe922;
              </Typography>
            </CustomTooltip>
          </>
        );
      },
    },
    {
      field: "Firma electrónica",
      headerName: "",
      width: 50,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        return (
          <CustomTooltip
            title="Firma electrónica"
            arrow
            placement="bottom-start"
            TransitionComponent={Fade}
            PopperProps={{
              modifiers: [
                {
                  name: "offset",
                  options: {
                    offset: [0, -15],
                  },
                },
              ],
            }}
          >
            <IconButton
              onClick={() => handleOpenSignatureConfirmation(params.row.id)}
            >
              <i
                className="fa-regular fa-file-signature"
                style={{
                  fontSize: "1.3rem",
                  color: "#999999",
                  borderRadius: "5px",

                  "&:hover": {
                    backgroundColor: "#B5D1C980",
                    color: "#488B8F",
                  },
                }}
              ></i>
            </IconButton>
          </CustomTooltip>
        );
      },
    },
    {
      field: "Ficha de cliente",
      headerName: "",
      width: 50,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        return (
          <CustomTooltip
            title="Ficha de cliente"
            arrow
            placement="bottom-start"
            TransitionComponent={Fade}
            PopperProps={{
              modifiers: [
                {
                  name: "offset",
                  options: {
                    offset: [0, -15],
                  },
                },
              ],
            }}
          >
            <IconButton onClick={() => handleClientResumePDF(params.row.id)}>
              <i
                className="fa-regular fa-print"
                style={{
                  fontSize: "1.3rem",
                  color: "#999999",
                  borderRadius: "5px",

                  "&:hover": {
                    backgroundColor: "#B5D1C980",
                    color: "#488B8F",
                  },
                }}
              ></i>
            </IconButton>
          </CustomTooltip>
        );
      },
    },
    {
      field: "Eliminar",
      headerName: "",
      width: 50,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        return (
          <>
            <CustomTooltip
              title="Eliminar"
              arrow
              placement="bottom-start"
              TransitionComponent={Fade}
              PopperProps={{
                modifiers: [
                  {
                    name: "offset",
                    options: {
                      offset: [0, -15],
                    },
                  },
                ],
              }}
            >
              <Typography
                fontFamily="icomoon"
                fontSize="1.9rem"
                color="#999999"
                borderRadius="5px"
                sx={{
                  "&:hover": {
                    backgroundColor: "#B5D1C980",
                    color: "#488B8F",
                  },
                  cursor: "pointer",
                }}
                //Delete broker by id
                onClick={() => handleOpen3(params.value, params.row.id)}
              >
                &#xe901;
              </Typography>
            </CustomTooltip>
          </>
        );
      },
    },
  ];

  const {
    fetch: fetch,
    loading: loading,
    error: error,
    data: data,
  } = useFetch({
    service: (type = brochureType, args) =>
      GetBrochureList(type, { page, ...args }),
    init: true,
  });

  const dataCount = data?.count || 0;
  useEffect(() => {
    const brochure =
      data?.results?.map((brochure) => ({
        id: brochure.id,
        NoID:
          brochureType === "legalClient"
            ? brochure.nit
            : brochure.documentNumber,
        Customer:
          brochureType === "legalClient"
            ? brochure.companyName
            : brochure.firstName + " " + brochure.lastName,
        Status: brochure.status,
        DateCreated: brochure.created_at,
        Exp:
          brochureType === "legalClient"
            ? [
                brochure.bankCertification,
                brochure.legalRepresentationCertification,
                brochure.financialStatementsCertification,
                brochure.rentDeclaration,
                brochure.rutFile,
                brochure.dianAccountState,
                brochure.legalRepresentativeDocumentFile,
                brochure.legalRepresentativeIdFile,
                brochure.shareholdingStructure,
              ]
            : [
                brochure.documentFile,
                brochure.rentDeclarationFile,
                brochure.bankCertificationFile,
              ],
        Comite: brochure.status,
        vinculacion: brochure,
      })) || [];
    setBrochure(brochure);
  }, [data]);

  useEffect(() => {
    if (dataSendSignature) {
      Toast("Firma electrónica enviada", "success");
    }
    if (loadingSendSignature) {
      Toast("Enviando firma electrónica...", "info");
      handleCloseSignatureConfirmation();
    }
    if (errorSendSignature) {
      Toast("Error al enviar la firma electrónica", "error");
    }
  }, [dataSendSignature, loadingSendSignature, errorSendSignature]);

  const {
    fetch: fetch3,
    loading: loading3,
    error: error3,
    data: data3,
  } = useFetch({
    service: AcceptBrochureById,
    init: false,
  });

  useEffect(() => {
    if (data3) {
      Toast("Cliente aprobado, se ha pasado a revisión", "success");
    }
  }, [data3]);

  const {
    fetch: fetch4,
    loading: loading4,
    error: error4,
    data: data4,
  } = useFetch({
    service: RejectBrochureById,
    init: false,
  });

  useEffect(() => {
    if (data4) {
      Toast("Cliente Rechazado", "success");
    }
  }, [data4]);

  const {
    fetch: fetch5,
    loading: loading5,
    error: error5,
    data: data5,
  } = useFetch({
    service: DeleteBrochureById,
    init: false,
  });

  const {
    fetch: fetch6,
    loading: loading6,
    error: error6,
    data: data6,
  } = useFetch({
    service: ReviewBrochureById,
    init: false,
  });

  return (
    <>
      {/* Primer modal: modal de información del prospecto */}
      <Modal open={open[0]} handleClose={handleClose}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="100%"
          width="100%"
        >
          <InputTitles sx={{ fontSize: "1.2vw" }}>
            Información del prospecto
          </InputTitles>
          <Box width="100%" mt={2} sx={{ ...scrollSx }}>
            {/* Resumen para personas jurídicas */}

            {brochureType === "legalClient" && (
              <>
                <Typography
                  letterSpacing={0}
                  fontSize="1vw"
                  fontWeight="medium"
                  color="#63595C"
                  width={"100%"}
                >
                  Nombre de la compañía: {open[1].companyName} <br />
                  Correo: {open[1].email} <br />
                  Nit: {open[1].nit} <br />
                  Dígito de verificación: {open[1].verificationDigit} <br />
                  Fecha de constitfución: {open[1].dateOfConstitution} <br />
                  Dirección: {open[1].principalAddress} <br />
                  Correo de la compañía: {open[1].companyEmail} <br />
                  Teléfono de la compañía: {open[1].companyPhone} <br />
                  Objeto social: {open[1].socialObject} <br />
                  Presencia en otras ciudades: {
                    open[1].presenceInOtherCities
                  }{" "}
                  <br />
                  Número de empleados: {open[1].numberOfEmployees} <br />
                  Gran Contribuyente:{" "}
                  {open[1].greatContributor ? "Aplica" : "No Aplica"} <br />
                  Autorretención:{" "}
                  {open[1].selfRetention ? "Aplica" : "No Aplica"} <br />
                  Rete ICA: {open[1].retICA} <br />
                  Retención de fuente: {open[1].retFte} <br />
                  Tipo de vinculacion:{" "}
                  {open[1].typeVinculation === 0
                    ? "Emisor"
                    : open[1].typeVinculation === 1
                    ? "Comprador"
                    : "Pagador"}{" "}
                  <br />
                  <br />
                </Typography>
                <InputTitles sx={{ fontSize: "1vw" }}>
                  Información del Representante legal
                </InputTitles>
                <Typography
                  letterSpacing={0}
                  fontSize="1vw"
                  fontWeight="medium"
                  color="#63595C"
                  width={"100%"}
                >
                  Nombre:{" "}
                  {open[1].legalRepresentativeName +
                    " " +
                    open[1].legalRepresentativeLastName}{" "}
                  <br />
                  Documento: {open[1].legalRepresentativeDocumentNumber} <br />
                  Fecha de nacimiento: {
                    open[1].legalRepresentativeBirthDate
                  }{" "}
                  <br />
                  Correo: {open[1].legalRepresentativeEmail} <br />
                  Dirección: {open[1].legalRepresentativeAddress} <br />
                  Teléfono: {open[1].legalRepresentativePhone} <br />
                  Cargo: {open[1].legalRepresentativePosition} <br />
                </Typography>
              </>
            )}

            {/* Resumen para personas naturales */}

            {brochureType === "naturalClient" && (
              <>
                <Typography
                  letterSpacing={0}
                  fontSize="1vw"
                  fontWeight="medium"
                  color="#63595C"
                  width={"100%"}
                >
                  Nombre: {open[1].firstName + " " + open[1].lastName} <br />
                  Documento: {open[1].documentNumber} <br />
                  Celular: {open[1].phone} <br />
                  Ciudad: {open[1].city?.description} <br />
                  Dirección: {open[1].address} <br />
                  Profesión: {open[1].profession} <br />
                  <br />
                </Typography>
              </>
            )}
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            mt={4}
          >
            <GreenButtonModal onClick={handleClose}>Volver</GreenButtonModal>
          </Box>
        </Box>
      </Modal>

      {/* Segundo modal: modal de links de descarga */}

      <TitleModal
        open={open2[0]}
        handleClose={handleClose2}
        containerSx={{
          width: "50%",
        }}
        title={"Archivos del prospecto"}
      >
        <Box
          display="flex"
          flexDirection="column"
          mt={5}
          sx={{ ...scrollSx }}
          height={brochureType === "legalClient" ? "50vh" : "35vh"}
          alignItems="center"
        >
          {brochureType === "legalClient" && (
            <Typography
              letterSpacing={0}
              fontSize="1vw"
              fontWeight="medium"
              color="#63595C"
              width={"80%"}
              textAlign="center"
              marginTop={"10px"}
            >
              <Typography
                display="flex"
                alignItems="center"
                textAlign="left"
                justifyContent="space-between"
              >
                Certificado bancario
                <Typography
                  fontFamily="icomoon"
                  fontSize="1.9rem"
                  color="#999999"
                  width="40px"
                  borderRadius="5px"
                  sx={{
                    "&:hover": {
                      backgroundColor: "#B5D1C980",
                      color: "#488B8F",
                    },
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    downloadFile(open2[1][0], "Certificado bancario.csv");
                  }}
                >
                  <i className="fa-light fa-folder-arrow-down"></i>
                </Typography>
              </Typography>

              <Typography
                display="flex"
                alignItems="center"
                textAlign="left"
                justifyContent="space-between"
              >
                Certificado del representante legal
                <Typography
                  fontFamily="icomoon"
                  fontSize="1.9rem"
                  color="#999999"
                  width="40px"
                  borderRadius="5px"
                  sx={{
                    "&:hover": {
                      backgroundColor: "#B5D1C980",
                      color: "#488B8F",
                    },
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    downloadFile(
                      open2[1][1],
                      "Certificado del representante legal.csv"
                    );
                  }}
                >
                  <i className="fa-light fa-folder-arrow-down"></i>
                </Typography>
              </Typography>

              <Typography
                display="flex"
                alignItems="center"
                textAlign="left"
                justifyContent="space-between"
              >
                Certificado estado financiero
                <Typography
                  fontFamily="icomoon"
                  fontSize="1.9rem"
                  color="#999999"
                  width="40px"
                  borderRadius="5px"
                  sx={{
                    "&:hover": {
                      backgroundColor: "#B5D1C980",
                      color: "#488B8F",
                    },
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    downloadFile(
                      open2[1][2],
                      "Certificado estado financiero.csv"
                    );
                  }}
                >
                  <i className="fa-light fa-folder-arrow-down"></i>
                </Typography>
              </Typography>
              <Typography
                display="flex"
                alignItems="center"
                textAlign="left"
                justifyContent="space-between"
              >
                Composición accionaria
                <Typography
                  fontFamily="icomoon"
                  fontSize="1.9rem"
                  color="#999999"
                  width="40px"
                  borderRadius="5px"
                  sx={{
                    "&:hover": {
                      backgroundColor: "#B5D1C980",
                      color: "#488B8F",
                    },
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    downloadFile(open2[1][8], "Composición accionaria.pdf");
                  }}
                >
                  <i className="fa-light fa-folder-arrow-down"></i>
                </Typography>
              </Typography>

              <Typography
                display="flex"
                alignItems="center"
                textAlign="left"
                justifyContent="space-between"
              >
                Declaración de renta
                <Typography
                  fontFamily="icomoon"
                  fontSize="1.9rem"
                  color="#999999"
                  width="40px"
                  borderRadius="5px"
                  sx={{
                    "&:hover": {
                      backgroundColor: "#B5D1C980",
                      color: "#488B8F",
                    },
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    downloadFile(open2[1][3], "Declaración de renta.csv");
                  }}
                >
                  <i className="fa-light fa-folder-arrow-down"></i>
                </Typography>
              </Typography>
              <Typography
                display="flex"
                alignItems="center"
                textAlign="left"
                justifyContent="space-between"
              >
                RUT
                <Typography
                  fontFamily="icomoon"
                  fontSize="1.9rem"
                  color="#999999"
                  width="40px"
                  borderRadius="5px"
                  sx={{
                    "&:hover": {
                      backgroundColor: "#B5D1C980",
                      color: "#488B8F",
                    },
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    downloadFile(open2[1][4], "RUT.csv");
                  }}
                >
                  <i className="fa-light fa-folder-arrow-down"></i>
                </Typography>
              </Typography>
              <Typography
                display="flex"
                alignItems="center"
                textAlign="left"
                justifyContent="space-between"
              >
                Estado de la DIAN
                <Typography
                  fontFamily="icomoon"
                  fontSize="1.9rem"
                  color="#999999"
                  width="40px"
                  borderRadius="5px"
                  sx={{
                    "&:hover": {
                      backgroundColor: "#B5D1C980",
                      color: "#488B8F",
                    },
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    downloadFile(open2[1][5], "Estado Dian.csv");
                  }}
                >
                  <i className="fa-light fa-folder-arrow-down"></i>
                </Typography>
              </Typography>
              <Typography
                display="flex"
                alignItems="center"
                textAlign="left"
                justifyContent="space-between"
              >
                Declaración de renta (representante legal)
                <Typography
                  fontFamily="icomoon"
                  fontSize="1.9rem"
                  color="#999999"
                  width="40px"
                  borderRadius="5px"
                  sx={{
                    "&:hover": {
                      backgroundColor: "#B5D1C980",
                      color: "#488B8F",
                    },
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    downloadFile(
                      open2[1][6],
                      "Declaración Representante Legal.csv"
                    );
                  }}
                >
                  <i className="fa-light fa-folder-arrow-down"></i>
                </Typography>
              </Typography>
              <Typography
                display="flex"
                alignItems="center"
                textAlign="left"
                justifyContent="space-between"
              >
                Documento de identidad (representante legal)
                <Typography
                  fontFamily="icomoon"
                  fontSize="1.9rem"
                  color="#999999"
                  width="40px"
                  borderRadius="5px"
                  sx={{
                    "&:hover": {
                      backgroundColor: "#B5D1C980",
                      color: "#488B8F",
                    },
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    downloadFile(
                      open2[1][7],
                      "DOcumento Representante Legal.csv"
                    );
                  }}
                >
                  <i className="fa-light fa-folder-arrow-down"></i>
                </Typography>
              </Typography>
            </Typography>
          )}
          {brochureType === "naturalClient" && (
            <Typography
              letterSpacing={0}
              fontSize="1vw"
              fontWeight="medium"
              color="#63595C"
              width={"80%"}
              textAlign="center"
              marginTop={"10px"}
            >
              <Typography
                display="flex"
                alignItems="center"
                textAlign="left"
                justifyContent="space-between"
              >
                Documento de identidad
                <Typography
                  fontFamily="icomoon"
                  fontSize="1.9rem"
                  color="#999999"
                  width="40px"
                  borderRadius="5px"
                  sx={{
                    "&:hover": {
                      backgroundColor: "#B5D1C980",
                      color: "#488B8F",
                    },
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    downloadFile(open2[1][0], "Documento de identidad.csv");
                  }}
                >
                  <i className="fa-light fa-folder-arrow-down"></i>
                </Typography>
              </Typography>

              <Typography
                display="flex"
                alignItems="center"
                textAlign="left"
                justifyContent="space-between"
              >
                Declaración de renta (útimos dos periodos)
                <Typography
                  fontFamily="icomoon"
                  fontSize="1.9rem"
                  color="#999999"
                  width="40px"
                  borderRadius="5px"
                  sx={{
                    "&:hover": {
                      backgroundColor: "#B5D1C980",
                      color: "#488B8F",
                    },
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    downloadFile(open2[1][1], "Declaración de renta.csv");
                  }}
                >
                  <i className="fa-light fa-folder-arrow-down"></i>
                </Typography>
              </Typography>

              <Typography
                display="flex"
                alignItems="center"
                textAlign="left"
                justifyContent="space-between"
              >
                Certificado bancaria
                <Typography
                  fontFamily="icomoon"
                  fontSize="1.9rem"
                  color="#999999"
                  width="40px"
                  borderRadius="5px"
                  sx={{
                    "&:hover": {
                      backgroundColor: "#B5D1C980",
                      color: "#488B8F",
                    },
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    downloadFile(open2[1][2], "Certificado bancaria.csv");
                  }}
                >
                  <i className="fa-light fa-folder-arrow-down"></i>
                </Typography>
              </Typography>
            </Typography>
          )}

          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            mt={4}
          >
            <GreenButtonModal onClick={handleClose2}>Volver</GreenButtonModal>
          </Box>
        </Box>
      </TitleModal>

      {/* Tercer modal: modal de confirmaciones */}
      <Modal open={open3[0]} handleClose={handleClose3}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="100%"
          width="100%"
        >
          <Typography
            letterSpacing={0}
            fontSize="1vw"
            fontWeight="medium"
            color="#63595C"
          >
            ¿Estás seguro que desea eliminar el prospecto?
          </Typography>
          <Typography
            letterSpacing={0}
            fontSize="0.8vw"
            fontWeight="medium"
            color="#333333"
            mt={3.5}
          >
            Si elimina este prospecto, no podrá recuperarlo.
          </Typography>
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            mt={4}
          >
            <GreenButtonModal onClick={handleClose3}>Volver</GreenButtonModal>
            <RedButtonModal
              sx={{
                ml: 2,
              }}
              onClick={() => {
                setBrochure(brochure.filter((item) => item.id !== open3[2]));
                DeleteBrochureById(brochureType, open3[2]);
                handleClose3();
              }}
            >
              Eliminar
            </RedButtonModal>
          </Box>
        </Box>
      </Modal>

      {/* Cuarto modal: modal de confirmación firma electrónica */}
      <Modal
        open={openSignatureConfirmation[0]}
        handleClose={handleCloseSignatureConfirmation}
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="100%"
          width="100%"
        >
          <Typography
            letterSpacing={0}
            fontSize="1vw"
            fontWeight="medium"
            color="#63595C"
            textAlign="center"
          >
            ¿Estás seguro que deseas enviar el correo para firma electrónica?
          </Typography>
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            mt={4}
          >
            <GreenButtonModal onClick={handleCloseSignatureConfirmation}>
              Volver
            </GreenButtonModal>
            <GreenButtonModal
              sx={{
                ml: 2,
                backgroundColor: "#488B8F",
                color: "white",
                ":hover": {
                  backgroundColor: "#B5D1C980",
                },
              }}
              onClick={() => {
                fetchSendSignature(openSignatureConfirmation[1], brochureType);
              }}
            >
              Enviar
            </GreenButtonModal>
          </Box>
        </Box>
      </Modal>



      <Box sx={{ ...sectionTitleContainerSx }}>


         <Box className="view-header">

                <Link href="/dashboard" underline="none">
                            <a>
                            <HomeIcon
                                fontSize="large" 
                                sx={{ 
                                  color: '#488b8f',
                                  opacity: 0.8, // Ajusta la transparencia (0.8 = 80% visible)
                                  strokeWidth: 1, // Grosor del contorno
                                }} 
                              />
                          
                            </a>
                            
                            </Link>
       <Typography 
  variant="h5" 
  component="h1" 
  className="view-title"
>
  - Consulta y gestión de Prospectos
</Typography>
         </Box>
           <Button
          variant="standard"
          color="primary"
          size="large"
          sx={{
            height: "2.6rem",
            backgroundColor: "transparent",
            border: "1.4px solid #63595C",
            borderRadius: "4px",
          }}
          onClick={() => {
            //change text to Ver prospectos jurídicos o Ver prospectos naturales

            brochureType === "naturalClient"
              ? fetch("legalClient")
              : fetch("naturalClient");

            brochureType === "naturalClient"
              ? setBrochureType("legalClient")
              : setBrochureType("naturalClient");
          }}
        >
          <Typography
            letterSpacing={0}
            fontSize="80%"
            fontWeight="bold"
            color="#63595C"
          >
            Ver prospectos{" "}
            {brochureType == "legalClient" ? "naturales" : "jurídicos"}
          </Typography>

          <Typography
            fontFamily="icomoon"
            fontSize="1.8rem"
            color="#63595C"
            marginLeft="0.6rem"
          >
            &#xe923;
          </Typography>
        </Button>
      </Box>
   
      
      <Box>
        <BaseField
          placeholder="Filtro por nombre"
          value={query}
          onChange={(evt) => {
            setQuery(evt.target.value);
          }}
          onKeyPress={(event) => {
            if (event.key === "Enter") {
              fetch(brochureType, {
                page: 1,
                ...(Boolean(filter) && {
                  [filter]: query,
                }),
              });
              setPage(1);
            }
          }}
          InputProps={{
            endAdornment: <SearchOutlined sx={{ color: "#5EA3A3" }} />,
          }}
          sx={{ mt: 1 }}
        />
      </Box>

      <Box
        container
        marginTop={4}
        display="flex"
        flexDirection="column"
        width="100%"
        height="100%"
      >
        <CustomDataGrid
          rows={brochure}
          columns={columns}
          pageSize={15}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          disableColumnMenu
          components={{
            ColumnSortedAscendingIcon: () => (
              <Typography fontFamily="icomoon" fontSize="0.7rem">
                &#xe908;
              </Typography>
            ),

            ColumnSortedDescendingIcon: () => (
              <Typography fontFamily="icomoon" fontSize="0.7rem">
                &#xe908;
              </Typography>
            ),

            Pagination: () => (
              <Box
                container
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography fontSize="0.8rem" fontWeight="600" color="#5EA3A3">
                  {page * 15 - 14} - {page * 15} de {dataCount}{" "}
                </Typography>
                <Box
                  container
                  display="flex"
                  flexDirection="row"
                  justifyContent="space-between"
                >
                  <Typography
                    fontFamily="icomoon"
                    fontSize="1.2rem"
                    marginRight="0.3rem"
                    marginLeft="0.5rem"
                    sx={{
                      cursor: "pointer",
                      transform: "rotate(180deg)",
                      color: "#63595C",
                    }}
                    onClick={() => {
                      if (page > 1) {
                        fetch(brochureType, {
                          page: page - 1,
                          ...(Boolean(filter) && { [filter]: query }),
                        });
                        setPage(page - 1);
                      }
                    }}
                  >
                    &#xe91f;
                  </Typography>
                  <Typography
                    fontFamily="icomoon"
                    fontSize="1.2rem"
                    marginRight="0.3rem"
                    marginLeft="0.5rem"
                    sx={{
                      cursor: "pointer",

                      color: "#63595C",
                    }}
                    onClick={() => {
                      if (page < dataCount / 15) {
                        fetch(brochureType, {
                          page: page + 1,
                          ...(Boolean(filter) && { [filter]: query }),
                        });
                        setPage(page + 1);
                      }
                    }}
                  >
                    &#xe91f;
                  </Typography>
                </Box>
              </Box>
            ),
          }}
          componentsProps={{
            pagination: {
              color: "#5EA3A3",
            },
          }}
          loading={loading}
        />
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
        open={openClientResume}
        handleClose={handleCloseClientResume}
        containerSx={{
          width: "70%",
          height: "60%",
        }}
        title={"Ficha de cliente (PDF)"}
      >
        {dataGetNaturalClientPDF && brochureType === "naturalClient" && (
          <Box
            display="flex"
            flexDirection="column"
            mt={5}
            sx={{ ...scrollSx }}
            height="50vh"
            alignItems="center"
          >
            {loadingGetNaturalClientPDF && (
              <CircularProgress style={{ color: "#488B8F" }} />
            )}
            {dataGetNaturalClientPDF && dataGetNaturalClientPDF?.data && (
              <iframe
                src={`data:application/pdf;base64,${dataGetNaturalClientPDF?.data}`}
                width="100%"
                height="100%"
              />
            )}
          </Box>
        )}
        {dataGetLegalClientPDF && brochureType === "legalClient" && (
          <Box
            display="flex"
            flexDirection="column"
            mt={5}
            sx={{ ...scrollSx }}
            height="50vh"
            alignItems="center"
          >
            {loadingGetLegalClientPDF && (
              <CircularProgress style={{ color: "#488B8F" }} />
            )}
            {dataGetLegalClientPDF && dataGetLegalClientPDF?.data && (
              <iframe
                src={`data:application/pdf;base64,${dataGetLegalClientPDF?.data}`}
                width="100%"
                height="100%"
              />
            )}
          </Box>
        )}
      </TitleModal>
    </>
  );
};
