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
import { CreateNaturalClientSelfManagement } from "@views/self-management/queries";
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
  ...stringSchema("documentFile"),
  ...stringSchema("rentDeclarationFile"),
  ...stringSchema("bankCertificationFile"),
});

function DocumentationStep() {
  const [open, setOpen] = useState(false);

  const { pagination, data } = useContext(FormContext);

  const isXs = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleNextStep = (values) => {
    handleOpen();

    const nextData = { ...data.body.value, ...values };

    clientSelfManagement({
      ...nextData,

      termsAndConditions: nextData.termAndConditions?.value,
      activityType: nextData.activityType?.value,
      ciiu: nextData.ciiu?.value,
      secondaryCiiu: nextData.secondaryCiiu?.value,
      city: nextData.city?.value,
      country: nextData.country?.value,
      department: nextData.department?.value,
      referenceBankCity: nextData.referenceBankCity?.value,
      referenceBankDepartment: nextData.referenceBankDepartment?.value,
      referenceCity: nextData.referenceCity?.value,
      referenceDepartment: nextData.referenceDepartment?.value,
      typeDocument: nextData.typeDocument?.value,
      companyDepartment: nextData.companyDepartment?.value,
      companyCity: nextData.companyCity?.value,
      referenceDepartment: nextData.referenceDepartment?.value,
      referenceCity: nextData.referenceCity?.value,
      referenceBankDepartment: nextData.referenceBankDepartment?.value,
      referenceBankCity: nextData.referenceBankCity?.value,
    });
  };

  const {
    fetch: clientSelfManagement,
    data: fetchData,
    error: error,
    loading: loading,
  } = useFetch({ service: CreateNaturalClientSelfManagement, init: false });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      documentFile: data.body.value?.documentFile || "",
      rentDeclarationFile: data.body.value?.rentDeclarationFile || "",
      bankCertificationFile: data.body.value?.bankCertificationFile || "",
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

  const documentFileFileNameText = isFileUploaded(formik, "documentFile");
  const rentDeclarationFileFileNameText = isFileUploaded(
    formik,
    "rentDeclarationFile"
  );
  const bankCertificationFileFileNameText = isFileUploaded(
    formik,
    "bankCertificationFile"
  );

  return (
    <Box sx={defaultStepContainerSx}>
      <Box sx={{ pb: 2 }}>
        <Typography sx={{ ...questionParagraphSx, mb: 1.5 }}>
          Sección 6 -<br /> Documentación Requerida
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
              DOCUMENTO DE IDENTIDAD
            </Typography>

            <FileField
              uploadFileText={documentFileFileNameText}
              error={Boolean(formik.errors.documentFile)}
              helperText={formik.errors.documentFile}
              onChange={(evt, value) => {
                formik.setFieldValue("documentFile", value);
              }}
            />
          </Grid>

          {!isXs && <Grid item sm={6} md={5} />}

          <Grid item xs={12} sm={6} md={7}>
            <Typography sx={{ ...questionTextSx }}>
              DECLARACIÓN DE RENTA DE LOS ÚLTIMOS 2 PERÍODOS
            </Typography>

            <FileField
              uploadFileText={rentDeclarationFileFileNameText}
              error={Boolean(formik.errors.rentDeclarationFile)}
              helperText={formik.errors.rentDeclarationFile}
              onChange={(evt, value) => {
                formik.setFieldValue("rentDeclarationFile", value);
              }}
              multiple
            />
          </Grid>

          {!isXs && <Grid item sm={6} md={5} />}
          <Grid item xs={12} sm={6} md={7}>
            <Typography sx={{ ...questionTextSx }}>
              CERTIFICACIÓN BANCARIA CON VIGENCIA NO MAYOR A 30 DÍAS
            </Typography>

            <FileField
              uploadFileText={bankCertificationFileFileNameText}
              error={Boolean(formik.errors.bankCertificationFile)}
              helperText={formik.errors.bankCertificationFile}
              onChange={(evt, value) => {
                formik.setFieldValue("bankCertificationFile", value);
              }}
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
      <SelfManagementModalLoading
        loading={loading}
        error={error}
        open={open}
        handleClose={handleClose}
      />
    </Box>
  );
}

export default DocumentationStep;
