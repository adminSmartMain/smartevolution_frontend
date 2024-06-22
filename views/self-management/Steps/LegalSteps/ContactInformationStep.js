import { useContext, useEffect } from "react";

import { Box, Grid, InputAdornment, Typography } from "@mui/material";

import emailSchema from "@schemas/emailSchema";
import phoneNumberSchema from "@schemas/phoneNumberSchema";
import stringSchema from "@schemas/stringSchema";

import BaseField from "@styles/fields/BaseField";

import { FormContext } from "@views/self-management/Context";
import SelfManagementAddMoreButton from "@views/self-management/SelfManagementAddMoreButton";
import SelfManagementDynamicContainer from "@views/self-management/SelfManagementDynamicContainer";
import {
  defaultStepContainerSx,
  questionParagraphSx,
  questionTextSx,
  sectionTitleSx,
} from "@views/self-management/styles";

import { useFormik } from "formik";
import * as Yup from "yup";

const schema = Yup.object({
  legalClientContacts: Yup.array().of(
    Yup.object({
      ...stringSchema("name"),
      ...stringSchema("area"),
      ...stringSchema("position"),
      ...phoneNumberSchema("phone"),
      ...emailSchema("email"),
    })
  ),
});

const ContactInformationStep = () => {
  const { pagination, data } = useContext(FormContext);

  const handleNextStep = (values) => {
    data.body.set({ ...data.body.value, ...values });
    pagination.controls.changeStep(pagination.step + 1);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      legalClientContacts: data.body.value?.legalClientContacts || [
        {
          name: null,
          area: null,
          position: null,
          phone: "",
          email: "",
        },
      ],
    },
    validationSchema: schema,
    onSubmit: handleNextStep,
  });

  const addLegalClientContacts = () => {
    formik.setFieldValue("legalClientContacts", [
      ...formik.values.legalClientContacts,
      {
        name: null,
        area: null,
        position: null,
        phone: "",
        email: "",
      },
    ]);
  };

  const removeLegalClientContacts = (index) => {
    formik.setFieldValue(
      "legalClientContacts",
      formik.values.legalClientContacts.filter((p, i) => index !== i)
    );
  };

  useEffect(() => {
    pagination.controls.setControls({
      nextStep: formik.handleSubmit,
      prevStep: () => {
        pagination.controls.changeStep(pagination.step - 1);
      },
    });
  }, []);

  return (
    <Box sx={defaultStepContainerSx}>
      <Box sx={{ pb: 2 }}>
        <Typography sx={{ ...questionParagraphSx, mb: 3.75 }}>
          Sección 11 -<br />
          Información de Contacto
        </Typography>

        <Typography sx={{ ...sectionTitleSx, my: 2.5 }}>
          DATOS DE LAS PERSONAS DE CONTACTO
        </Typography>
        <Grid item xs={12}>
          <Grid container sx={{ pr: 3 }}>
            <Grid item xs={12} md={4}>
              <Typography sx={{ ...questionTextSx }}>
                NOMBRE Y APELLIDO
              </Typography>
            </Grid>

            <Grid item xs={12} md={2}>
              <Typography sx={{ ...questionTextSx }}>ÁREA</Typography>
            </Grid>

            <Grid item xs={12} md={2}>
              <Typography sx={{ ...questionTextSx }}>CARGO</Typography>
            </Grid>

            <Grid item xs={12} md={2}>
              <Typography sx={{ ...questionTextSx }}>TELÉFONO</Typography>
            </Grid>

            <Grid item xs={12} md={2}>
              <Typography sx={{ ...questionTextSx }}>
                CORREO ELECTRÓNICO
              </Typography>
            </Grid>
          </Grid>

          {formik.values.legalClientContacts.map((field, i) => (
            <SelfManagementDynamicContainer
              key={`field-${i}`}
              disabled={formik.values.legalClientContacts.length <= 1}
              onDelete={() => removeLegalClientContacts(i)}
            >
              <Grid item xs={12} md={4}>
                <BaseField
                  fullWidth
                  id={`legalClientContacts[${i}].name`}
                  name={`legalClientContacts[${i}].name`}
                  placeholder="Escriba su respuesta aquí"
                  error={Boolean(formik.errors.legalClientContacts?.[i]?.name)}
                  value={formik.values.legalClientContacts?.[i]?.name || ""}
                  onChange={formik.handleChange}
                  helperText={formik.errors.legalClientContacts?.[i]?.name}
                />
              </Grid>

              <Grid item xs={12} md={2}>
                <BaseField
                  fullWidth
                  id={`legalClientContacts[${i}].area`}
                  name={`legalClientContacts[${i}].area`}
                  placeholder="Escriba su respuesta aquí"
                  error={Boolean(formik.errors.legalClientContacts?.[i]?.area)}
                  value={formik.values.legalClientContacts?.[i]?.area || ""}
                  onChange={formik.handleChange}
                  helperText={formik.errors.legalClientContacts?.[i]?.area}
                />
              </Grid>

              <Grid item xs={12} md={2}>
                <BaseField
                  fullWidth
                  id={`legalClientContacts[${i}].position`}
                  name={`legalClientContacts[${i}].position`}
                  placeholder="Escriba su respuesta aquí"
                  error={Boolean(
                    formik.errors.legalClientContacts?.[i]?.position
                  )}
                  value={formik.values.legalClientContacts?.[i]?.position || ""}
                  onChange={formik.handleChange}
                  helperText={formik.errors.legalClientContacts?.[i]?.position}
                />
              </Grid>

              <Grid item xs={12} md={2}>
                <BaseField
                  fullWidth
                  id={`legalClientContacts[${i}].phone`}
                  name={`legalClientContacts[${i}].phone`}
                  isPatterned
                  format="## ###########"
                  mask="X"
                  placeholder="Escriba su respuesta aquí"
                  error={Boolean(formik.errors.legalClientContacts?.[i]?.phone)}
                  value={formik.values.legalClientContacts?.[i]?.phone || ""}
                  onChangeMasked={(values) => {
                    formik.setFieldValue(
                      `legalClientContacts[${i}].phone`,
                      values.floatValue
                    );
                  }}
                  helperText={formik.errors.legalClientContacts?.[i]?.phone}
                />
              </Grid>

              <Grid item xs={12} md={2}>
                <BaseField
                  fullWidth
                  id={`legalClientContacts[${i}].email`}
                  name={`legalClientContacts[${i}].email`}
                  placeholder="Escriba su respuesta aquí"
                  error={Boolean(formik.errors.legalClientContacts?.[i]?.email)}
                  value={formik.values.legalClientContacts?.[i]?.email || ""}
                  onChange={formik.handleChange}
                  helperText={formik.errors.legalClientContacts?.[i]?.email}
                />
              </Grid>
            </SelfManagementDynamicContainer>
          ))}

          <SelfManagementAddMoreButton
            fullWidth
            sx={{ mt: 1.25 }}
            onClick={addLegalClientContacts}
          >
            Agregar nuevo contacto
          </SelfManagementAddMoreButton>
        </Grid>
      </Box>
    </Box>
  );
};

export default ContactInformationStep;
