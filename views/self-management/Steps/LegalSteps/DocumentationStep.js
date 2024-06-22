import { useContext, useEffect } from "react";
import { useState } from "react";
import { ToastContainer } from "react-toastify";

import { Box, Grid, Typography, useMediaQuery } from "@mui/material";

import { useFetch } from "@hooks/useFetch";

import stringSchema from "@schemas/stringSchema";

import FileField from "@styles/fields/FileField";

import { FormContext } from "@views/self-management/Context";
import Hint from "@views/self-management/Hint";
import SelfManagementModalLoading from "@views/self-management/SelfManagementModalLoading";
import { CreateClientSelfManagement } from "@views/self-management/queries";
import {
  defaultStepContainerSx,
  questionDescriptionSx,
  questionParagraphSx,
  questionTextSx,
} from "@views/self-management/styles";

import { useFormik } from "formik";
import * as Yup from "yup";

const isFileUploaded = (formik, field) =>
  Boolean(formik.values[field]) ? "Archivo cargado" : undefined;

const schema = Yup.object({
  ...stringSchema("bankCertification"),
  ...stringSchema("legalRepresentationCertification"),
  ...stringSchema("shareholdingStructure"),
  ...stringSchema("financialStatementsCertification"),
  ...stringSchema("rentDeclaration"),
  ...stringSchema("rutFile"),
  ...stringSchema("dianAccountState"),
  ...stringSchema("legalRepresentativeDocumentFile"),
  ...stringSchema("legalRepresentativeIdFile"),
});

function DocumentationStep() {
  const [open, setOpen] = useState(false);

  const { pagination, data } = useContext(FormContext);

  const isXs = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleNextStep = (values) => {
    const nextData = { ...data.body.value, ...values };
    handleOpen();
    clientSelfManagement({
      ...nextData,
      attributionsAndLimitations: nextData.attributionsAndLimitations.value,
      numberOfEmployees: nextData.numberOfEmployees.value,
      city: nextData.city.value,
      department: nextData.department.value,
      legalRepresentativeCity: nextData.legalRepresentativeCity.value,
      legalRepresentativeCountry: nextData.legalRepresentativeCountry.value,
      legalRepresentativeDepartment:
        nextData.legalRepresentativeDepartment.value,
      legalRepresentativeTypeDocument:
        nextData.legalRepresentativeTypeDocument.value,
      payrollBank: nextData.payrollBank.value,
      acquisitionsBank: nextData.acquisitionsBank.value,
      ciiu: nextData.ciiu.value,
      socialObject: "NO APLICA",
      ...(nextData.foreignAccount && {
        foreignAccount: nextData.foreignAccount.value,
        foreignAccountCountry: nextData.foreignAccountCountry.value,
        foreignAccountCurrency: nextData.foreignAccountCurrency.value,
        foreignAccountInstitution: nextData.foreignAccountInstitution.value,
        foreignAccountNumber: nextData.foreignAccountNumber.value,
        foreignAccountCountry: nextData.foreignAccountCountry.value,
      }),
    });
  };

  const {
    fetch: clientSelfManagement,
    data: fetchData,
    error: error,
    loading: loading,
  } = useFetch({ service: CreateClientSelfManagement, init: false });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      bankCertification: data.body.value?.bankCertification || "",
      legalRepresentationCertification:
        data.body.value?.legalRepresentationCertification || "",
      shareholdingStructure: data.body.value?.shareholdingStructure || "",

      financialStatementsCertification:
        data.body.value?.financialStatementsCertification || "",
      rentDeclaration: data.body.value?.rentDeclaration || "",
      rutFile: data.body.value?.rutFile || "",
      dianAccountState: data.body.value?.dianAccountState || "",
      legalRepresentativeDocumentFile:
        data.body.value?.legalRepresentativeDocumentFile || "",
      legalRepresentativeIdFile:
        data.body.value?.legalRepresentativeIdFile || "",
    },
    validationSchema: schema,
    onSubmit: handleNextStep,
  });

  useEffect(() => {
    pagination.controls.setControls({
      nextStep: formik.handleSubmit,
      prevStep: () => {
        pagination.controls.changeStep(pagination.step - 1);
      },
    });
  }, []);

  const bankCertificationFileNameText = isFileUploaded(
    formik,
    "bankCertification"
  );
  const legalRepresentationCertificationFileNameText = isFileUploaded(
    formik,
    "legalRepresentationCertification"
  );
  const shareholdingStructureFileNameText = isFileUploaded(
    formik,
    "shareholdingStructure"
  );
  const financialStatementsCertificationFileNameText = isFileUploaded(
    formik,
    "financialStatementsCertification"
  );
  const rentDeclarationFileNameText = isFileUploaded(formik, "rentDeclaration");
  const rutFileNameText = isFileUploaded(formik, "rutFile");
  const dianAccountStateFileNameText = isFileUploaded(
    formik,
    "dianAccountState"
  );
  const legalRepresentativeDocumentFileNameText = isFileUploaded(
    formik,
    "legalRepresentativeDocumentFile"
  );

  const legalRepresentativeIdFileNameText = isFileUploaded(
    formik,
    "legalRepresentativeIdFile"
  );

  return (
    <Box sx={defaultStepContainerSx}>
      <Box sx={{ pb: 2 }}>
        <Typography sx={{ ...questionParagraphSx, mb: 1.5 }}>
          Sección 12 -<br /> Documentación Requerida
        </Typography>
        <Grid container spacing={1.25} rowSpacing={4.25}>
          <Grid item xs={12} sm={8} md={10}>
            <Typography sx={{ ...questionDescriptionSx, mb: 2.5 }}>
              Por favor cargue en formato PDF la documentación solicitada a
              continuación. Tenga en cuenta que para garantizar la exactitud de
              la información, el documento Digitalizado debe ser completamente
              legible
            </Typography>
          </Grid>
        </Grid>

        <Grid container spacing={1.25} rowSpacing={4.25}>
          <Grid item xs={12} sm={6} md={7}>
            <Typography sx={{ ...questionTextSx }}>
              CERTIFICACIÓN BANCARIA CON VIGENCIA NO MAYOR A 30 DÍAS
            </Typography>

            <FileField
              uploadFileText={bankCertificationFileNameText}
              error={Boolean(formik.errors.bankCertification)}
              helperText={formik.errors.bankCertification}
              onChange={(evt, value) => {
                formik.setFieldValue("bankCertification", value);
              }}
            />
          </Grid>

          {!isXs && <Grid item sm={6} md={5} />}

          <Grid item xs={12} sm={6} md={7}>
            <Typography sx={{ ...questionTextSx }}>
              CERTIFICADO DE EXISTENCIA Y REPRESENTACIÓN LEGAL CON VIGENCIA NO
              MAYOR A 60 DÍAS (REGISTRO/MATRÍCULA MERCANTIL Y EXISTENCIA Y
              REPRESENTANTE LEGAL)
            </Typography>

            <FileField
              uploadFileText={legalRepresentationCertificationFileNameText}
              error={Boolean(formik.errors.legalRepresentationCertification)}
              helperText={formik.errors.legalRepresentationCertification}
              onChange={(evt, value) => {
                formik.setFieldValue("legalRepresentationCertification", value);
              }}
            />
          </Grid>
          {!isXs && <Grid item sm={6} md={5} />}

          <Grid item xs={12} sm={6} md={7}>
            <Typography sx={{ ...questionTextSx }}>
              COMPOSICIÓN ACCIONARIA
            </Typography>

            <FileField
              uploadFileText={shareholdingStructureFileNameText}
              error={Boolean(formik.errors.shareholdingStructure)}
              helperText={formik.errors.shareholdingStructure}
              onChange={(evt, value) => {
                formik.setFieldValue("shareholdingStructure", value);
              }}
            />
          </Grid>

          {!isXs && <Grid item sm={6} md={5} />}

          <Grid item xs={12} sm={6} md={7}>
            <Typography sx={{ ...questionTextSx }}>
              ESTADOS FINANCIEROS DE LOS ÚLTIMOS 3 AÑOS (INCLUIR CORTE DEL AÑO
              CORRIENTE) FIRMADOS POR REPRESENTANTE LEGAL, REVISOR FISCAL Y/O
              CONTADOR
            </Typography>

            <FileField
              uploadFileText={financialStatementsCertificationFileNameText}
              error={Boolean(formik.errors.financialStatementsCertification)}
              helperText={formik.errors.financialStatementsCertification}
              onChange={(evt, value) => {
                formik.setFieldValue("financialStatementsCertification", value);
              }}
              multiple
            />
          </Grid>

          {!isXs && <Grid item sm={6} md={5} />}

          <Grid item xs={12} sm={6} md={7}>
            <Typography sx={{ ...questionTextSx }}>
              DECLARACIÓN DE RENTA DE LOS ÚLTIMOS DOS PERIODOS
            </Typography>

            <FileField
              uploadFileText={rentDeclarationFileNameText}
              error={Boolean(formik.errors.rentDeclaration)}
              helperText={formik.errors.rentDeclaration}
              onChange={(evt, value) => {
                formik.setFieldValue("rentDeclaration", value);
              }}
              multiple
            />
          </Grid>

          {!isXs && <Grid item sm={6} md={5} />}

          <Grid item xs={12} sm={6} md={7}>
            <Typography sx={{ ...questionTextSx }}>
              REGISTRO ÚNICO TRIBUTARIO (RUT) ACTUALIZADO
            </Typography>

            <FileField
              uploadFileText={rutFileNameText}
              error={Boolean(formik.errors.rutFile)}
              helperText={formik.errors.rutFile}
              onChange={(evt, value) => {
                formik.setFieldValue("rutFile", value);
              }}
            />
          </Grid>

          {!isXs && <Grid item sm={6} md={5} />}
          <Grid item xs={12} sm={6} md={7}>
            <Typography sx={{ ...questionTextSx }}>
              ESTADO DE CUENTA DIAN
            </Typography>

            <FileField
              uploadFileText={dianAccountStateFileNameText}
              error={Boolean(formik.errors.dianAccountState)}
              helperText={formik.errors.dianAccountState}
              onChange={(evt, value) => {
                formik.setFieldValue("dianAccountState", value);
              }}
            />
          </Grid>
          {!isXs && <Grid item sm={6} md={5} />}
          <Grid item xs={12} sm={6} md={7}>
            <Typography sx={{ ...questionTextSx }}>
              DOCUMENTO DE IDENTIDAD DEL REPRESENTANTE LEGAL
            </Typography>

            <FileField
              uploadFileText={legalRepresentativeIdFileNameText}
              error={Boolean(formik.errors.legalRepresentativeIdFile)}
              helperText={formik.errors.legalRepresentativeIdFile}
              onChange={(evt, value) => {
                formik.setFieldValue("legalRepresentativeIdFile", value);
              }}
            />
          </Grid>

          {!isXs && <Grid item sm={6} md={5} />}
          <Grid item xs={12} sm={6} md={7}>
            <Typography sx={{ ...questionTextSx }}>
              DECLARACIÓN DE RENTA DE LOS ÚLTIMOS DOS PERIODOS DEL REPRESENTANTE
              LEGAL
            </Typography>

            <FileField
              uploadFileText={legalRepresentativeDocumentFileNameText}
              error={Boolean(formik.errors.legalRepresentativeDocumentFile)}
              helperText={formik.errors.legalRepresentativeDocumentFile}
              onChange={(evt, value) => {
                formik.setFieldValue("legalRepresentativeDocumentFile", value);
              }}
              multiple
            />
          </Grid>
        </Grid>
      </Box>

      <SelfManagementModalLoading
        loading={loading}
        error={error}
        open={open}
        handleClose={handleClose}
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
  );
}

export default DocumentationStep;
