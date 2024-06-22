import { useContext, useEffect } from "react";

import { Box, Grid, InputAdornment, Typography } from "@mui/material";

import numberSchema from "@schemas/numberSchema";
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
  principals: Yup.array().of(
    Yup.object({
      ...stringSchema("name"),
      ...numberSchema("type"),
    })
  ),
  substitutes: Yup.array().of(
    Yup.object({
      name: Yup.string().nullable(),
      type: Yup.number().nullable(),
    })
  ),
  partnersAndShareholders: Yup.array().of(
    Yup.object({
      ...stringSchema("name"),
      documentNumber: Yup.number().required("Campo obligatorio").nullable(),
      ...stringSchema("descriptionAndInformation"),
      percentage: Yup.number().required("Campo obligatorio").nullable(),
    })
  ),
});

const BoardAndPartnersStep = () => {
  const { pagination, data } = useContext(FormContext);

  const handleNextStep = (values) => {
    data.body.set({
      ...data.body.value,
      ...{
        managementBoard: [...values.principals, ...values.substitutes],
        partnersAndShareholders: values.partnersAndShareholders,
      },
    });
    pagination.controls.changeStep(pagination.step + 1);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      principals: data.body.value?.managementBoard?.filter(
        (i) => i.type === 1
      ) || [{ name: null, type: 1 }],
      substitutes: data.body.value?.managementBoard?.filter(
        (i) => i.type === 0
      ) || [{ name: null, type: 0 }],
      partnersAndShareholders: data.body.value?.partnersAndShareholders || [
        {
          name: null,
          documentNumber: null,
          descriptionAndInformation: null,
          percentage: null,
        },
      ],
    },
    validationSchema: schema,
    onSubmit: handleNextStep,
  });

  const addPrincipal = () => {
    formik.setFieldValue("principals", [
      ...formik.values.principals,
      { name: null, type: 1 },
    ]);
  };

  const removePrincipal = (index) => {
    formik.setFieldValue(
      "principals",
      formik.values.principals.filter((p, i) => index !== i)
    );
  };

  const addSubstitute = () => {
    formik.setFieldValue("substitutes", [
      ...formik.values.substitutes,
      { name: null, type: 0 },
    ]);
  };

  const removeSubstitute = (index) => {
    formik.setFieldValue(
      "substitutes",
      formik.values.substitutes.filter((p, i) => index !== i)
    );
  };

  const addPartner = () => {
    formik.setFieldValue("partnersAndShareholders", [
      ...formik.values.partnersAndShareholders,
      {
        name: null,
        documentNumber: null,
        descriptionAndInformation: null,
        percentage: null,
      },
    ]);
  };

  const removePartner = (index) => {
    formik.setFieldValue(
      "partnersAndShareholders",
      formik.values.partnersAndShareholders.filter((p, i) => index !== i)
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
          Sección 3 -<br /> Información de Junta Directiva y Socios
        </Typography>

        <Typography sx={{ ...sectionTitleSx, mb: 2.5 }}>
          COMPOSICIÓN DE LA JUNTA DIRECTIVA
        </Typography>
        <Grid container spacing={1.25} rowSpacing={4.25}>
          <Grid item xs={12} md={6}>
            <Typography sx={{ ...questionTextSx }}>
              MIEMBROS PRINCIPALES
            </Typography>

            {formik.values.principals.map((field, i) => (
              <SelfManagementDynamicContainer
                key={`field2-${i}`}
                disabled={formik.values.principals.length <= 1}
                onDelete={() => removePrincipal(i)}
              >
                <Grid item xs={12}>
                  <BaseField
                    fullWidth
                    id={`principals[${i}].name`}
                    name={`principals[${i}].name`}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <i className="far fa-user" />
                        </InputAdornment>
                      ),
                    }}
                    placeholder="Escriba su respuesta aquí"
                    error={Boolean(formik.errors.principals?.[i]?.name)}
                    value={formik.values.principals?.[i]?.name || ""}
                    onChange={formik.handleChange}
                    helperText={formik.errors.principals?.[i]?.name}
                  />
                </Grid>
              </SelfManagementDynamicContainer>
            ))}

            <SelfManagementAddMoreButton
              fullWidth
              sx={{ mt: 1.25 }}
              onClick={addPrincipal}
            >
              Agregar nuevo miembro principal
            </SelfManagementAddMoreButton>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography sx={{ ...questionTextSx }}>
              MIEMBROS SUPLENTES
            </Typography>

            {formik.values.substitutes.map((field, i) => (
              <SelfManagementDynamicContainer
                key={`field3-${i}`}
                disabled={formik.values.substitutes.length <= 1}
                onDelete={() => removeSubstitute(i)}
              >
                <Grid item xs={12}>
                  <BaseField
                    fullWidth
                    id={`substitutes[${i}].name`}
                    name={`substitutes[${i}].name`}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <i className="far fa-user" />
                        </InputAdornment>
                      ),
                    }}
                    placeholder="Escriba su respuesta aquí"
                    error={Boolean(formik.errors.substitutes?.[i]?.name)}
                    value={formik.values.substitutes?.[i]?.name || ""}
                    onChange={formik.handleChange}
                    helperText={formik.errors.substitutes?.[i]?.name}
                  />
                </Grid>
              </SelfManagementDynamicContainer>
            ))}

            <SelfManagementAddMoreButton
              fullWidth
              sx={{ mt: 1.25 }}
              onClick={addSubstitute}
            >
              Agregar nuevo miembro suplente
            </SelfManagementAddMoreButton>
          </Grid>
        </Grid>

        <Typography sx={{ ...sectionTitleSx, mt: 4.25, mb: 2.5 }}>
          INFORMACIÓN DE SOCIOS Y ACCIONISTAS
        </Typography>

        <Grid item xs={12}>
          <Grid container sx={{ pr: 3 }}>
            <Grid item xs={12} md={3}>
              <Typography sx={{ ...questionTextSx }}>
                NOMBRES DE ACCIONISTAS
              </Typography>
            </Grid>

            <Grid item xs={12} md={3}>
              <Typography sx={{ ...questionTextSx }}>
                NRO. IDENTIFICACIÓN
              </Typography>
            </Grid>

            <Grid item xs={12} md={3}>
              <Typography sx={{ ...questionTextSx }}>
                DESCRIPCIÓN - EXPERIENCIA
              </Typography>
            </Grid>

            <Grid item xs={12} md={3}>
              <Typography sx={{ ...questionTextSx }}>
                % PARTICIPACIÓN
              </Typography>
            </Grid>
          </Grid>

          {formik.values.partnersAndShareholders.map((field, i) => (
            <SelfManagementDynamicContainer
              key={`field-${i}`}
              disabled={formik.values.partnersAndShareholders.length <= 1}
              onDelete={() => removePartner(i)}
            >
              <Grid item xs={12} md={3}>
                <BaseField
                  fullWidth
                  id={`partnersAndShareholders[${i}].name`}
                  name={`partnersAndShareholders[${i}].name`}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <i className="far fa-user" />
                      </InputAdornment>
                    ),
                  }}
                  placeholder="Escriba su respuesta aquí"
                  error={Boolean(
                    formik.errors.partnersAndShareholders?.[i]?.name
                  )}
                  value={formik.values.partnersAndShareholders?.[i]?.name || ""}
                  onChange={formik.handleChange}
                  helperText={formik.errors.partnersAndShareholders?.[i]?.name}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <BaseField
                  fullWidth
                  id={`partnersAndShareholders[${i}].documentNumber`}
                  name={`partnersAndShareholders[${i}].documentNumber`}
                  isMasked
                  thousandSeparator="."
                  decimalSeparator=","
                  decimalScale={0}
                  allowNegative={false}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <i className="far fa-id-card" />
                      </InputAdornment>
                    ),
                  }}
                  placeholder="Escriba su respuesta aquí"
                  error={Boolean(
                    formik.errors.partnersAndShareholders?.[i]?.documentNumber
                  )}
                  value={
                    formik.values.partnersAndShareholders?.[i]
                      ?.documentNumber || ""
                  }
                  onChangeMasked={(values) => {
                    formik.setFieldValue(
                      `partnersAndShareholders[${i}].documentNumber`,
                      values.floatValue
                    );
                  }}
                  helperText={
                    formik.errors.partnersAndShareholders?.[i]?.documentNumber
                  }
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <BaseField
                  fullWidth
                  id={`partnersAndShareholders[${i}].descriptionAndInformation`}
                  name={`partnersAndShareholders[${i}].descriptionAndInformation`}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <i className="far fa-user" />
                      </InputAdornment>
                    ),
                  }}
                  placeholder="Escriba su respuesta aquí"
                  error={Boolean(
                    formik.errors.partnersAndShareholders?.[i]
                      ?.descriptionAndInformation
                  )}
                  value={
                    formik.values.partnersAndShareholders?.[i]
                      ?.descriptionAndInformation || ""
                  }
                  onChange={formik.handleChange}
                  helperText={
                    formik.errors.partnersAndShareholders?.[i]
                      ?.descriptionAndInformation
                  }
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <BaseField
                  fullWidth
                  id={`partnersAndShareholders[${i}].percentage`}
                  name={`partnersAndShareholders[${i}].percentage`}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <i className="far fa-percentage" />
                      </InputAdornment>
                    ),
                  }}
                  isMasked
                  thousandSeparator="."
                  decimalSeparator=","
                  decimalScale={2}
                  allowNegative={false}
                  isAllowed={(values, sourceInfo) => {
                    const { floatValue } = values;
                    return !floatValue || floatValue <= 100;
                  }}
                  placeholder="Escriba su respuesta aquí"
                  error={Boolean(
                    formik.errors.partnersAndShareholders?.[i]?.percentage
                  )}
                  value={
                    formik.values.partnersAndShareholders?.[i]?.percentage || ""
                  }
                  onChangeMasked={(values) => {
                    formik.setFieldValue(
                      `partnersAndShareholders[${i}].percentage`,
                      values.floatValue
                    );
                  }}
                  helperText={
                    formik.errors.partnersAndShareholders?.[i]?.percentage
                  }
                />
              </Grid>
            </SelfManagementDynamicContainer>
          ))}

          <SelfManagementAddMoreButton
            fullWidth
            sx={{ mt: 1.25 }}
            onClick={addPartner}
          >
            Agregar nuevo accionista
          </SelfManagementAddMoreButton>
        </Grid>
      </Box>
    </Box>
  );
};

export default BoardAndPartnersStep;
