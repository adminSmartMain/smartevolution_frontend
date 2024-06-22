import { useContext, useEffect } from "react";

import { Box, Grid, Typography } from "@mui/material";

import CheckBoxGroup, { CheckBoxElement } from "@components/CheckBoxGroup";

import { FormContext } from "@views/self-management/Context";
import {
  defaultStepContainerSx,
  questionParagraphSx,
  questionTextSx,
  termsTextSx,
} from "@views/self-management/styles";

import { useFormik } from "formik";
import * as Yup from "yup";

const schema = Yup.object({
  first: Yup.bool()
    .required("Selecciona una opción")
    .nullable()
    .oneOf([true], "Debes aceptar todos los términos"),
  second: Yup.bool()
    .required("Selecciona una opción")
    .nullable()
    .oneOf([true], "Debes aceptar todos los términos"),
  third: Yup.bool()
    .required("Selecciona una opción")
    .nullable()
    .oneOf([true], "Debes aceptar todos los términos"),
});

const TermsAndConditionsStep = () => {
  const { pagination, data } = useContext(FormContext);

  const handleNextStep = (values) => {
    data.body.set({
      ...data.body.value,
      termsAndConditions: values.first && values.second && values.third,
    });
    pagination.controls.changeStep(pagination.step + 1);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      first: data.body.value?.first ?? null,
      second: data.body.value?.second ?? null,
      third: data.body.value?.third ?? null,
    },
    validationSchema: schema,
    onSubmit: handleNextStep,
  });

  const errorMessage =
    formik.errors.first || formik.errors.second || formik.errors.third;

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
        <Typography sx={{ ...questionParagraphSx, mb: 4.5 }}>
          Sección 10 -<br />
          Declaraciones, Certificaciones y Autorizaciones
        </Typography>

        <Grid container spacing={1.25} rowSpacing={4.25}>
          <Grid item xs={12} lg={11}>
            <CheckBoxGroup
              error={Boolean(errorMessage)}
              helperText={errorMessage}
            >
              <CheckBoxElement
                labelPlacement="end"
                label={
                  <>
                    <Typography sx={{ ...questionTextSx }}>
                      DECLARACIÓN DE PREVENCIÓN DE RIESGOS DE LA/FT
                    </Typography>
                    <Typography sx={{ ...termsTextSx }}>
                      Manifestamos que nuestros dineros provienen de actividades
                      lícitas y que en ningún caso utilizaremos dineros
                      provenientes de cualquier forma con el tráfico de
                      estupefacientes, lavado de activos y/o cualquier otra
                      actividad penalizada por la legislación Nacional o
                      Internacional. Igualmente, adoptaremos integralmente las
                      políticas y procedimientos que SMART EVOLUTION S.A.S.
                      defina para la administración y prevención de los riesgos
                      asociados al LA/FT.
                    </Typography>
                  </>
                }
                checked={formik.values.first}
                onChange={(evt, value) => {
                  formik.setFieldValue("first", value);
                }}
              />
              <CheckBoxElement
                labelPlacement="end"
                label={
                  <>
                    <Typography sx={{ ...questionTextSx }}>
                      DECLARACIÓN DE RESPONSABILIDAD POR LA INFORMACIÓN APORTADA
                    </Typography>
                    <Typography sx={{ ...termsTextSx }}>
                      Certificamos que la información presentada en este
                      formulario y los documentos anexos es verídica y
                      corresponde a la realidad. En caso de inexactitud,
                      falsedad o inconsistencia en la información aportada, la
                      entidad que represento será civilmente responsable ante
                      SMART EVOLUTION S.A.S. y terceros afectados, por los
                      perjuicios que esta circunstancia pudiera
                      ocasionarles.Acepto que en el evento en que la empresa,
                      los socios o el representante legal se encuentren
                      reportados en algunas de las listas restrictivas definidas
                      por SMART EVOLUTION S.A.S. , al momento de la vinculación
                      o durante la relación contractual, SMART EVOLUTION S.A.S.
                      podrá para dar por terminado unilateralmente el contrato
                      en cualquier momento y sin previo aviso, por configurarse
                      una causal objetiva de terminación del mismo.Aceptamos y
                      damos por entendido que cualquier irregularidad en el
                      proceso de vinculación, hará que este no continúe y
                      constituirá una causal de terminación anticipada del
                      vínculo contractual que se llegara a tener con SMART
                      EVOLUTION S.A.S. ., sin que por ello se genere el
                      reconocimiento de indemnizaciones o pagos de perjuicios.
                    </Typography>
                  </>
                }
                checked={formik.values.second}
                onChange={(evt, value) => {
                  formik.setFieldValue("second", value);
                }}
              />
              <CheckBoxElement
                labelPlacement="end"
                label={
                  <>
                    <Typography sx={{ ...questionTextSx }}>
                      AUTORIZACIÓN DE VISITA, VERIFICACIÓN DE INFORMACIÓN,
                      CONSULTA Y REPORTE
                    </Typography>
                    <Typography sx={{ ...termsTextSx }}>
                      Autorizamos a SMART EVOLUTION S.A.S. para que: 1)
                      Directamente o a través de quien ella designe, mediante
                      consulta en bases de datos o visita a nuestras
                      instalaciones verifique los datos que entregamos en este
                      documento y sus anexos; 2) Realice toda clase de consultas
                      y reportes a las centrales de riesgos y cualquier otra
                      fuente de información de antecedentes disciplinarios,
                      penales, contractuales, fiscales, comerciales, financieros
                      y de cualquier otra naturaleza, de la empresa, sus
                      administradores, representantes legales o socios con más
                      del 5% de participación en el capital social; 3) El
                      tratamiento de los datos personales aportados en este
                      formulario para los fines de la relación comercial con
                      SMART EVOLUTION S.A.S. y conforme a la Política de
                      Tratamiento de Datos de SMART EVOLUTION S.A.S.
                    </Typography>
                  </>
                }
                checked={formik.values.third}
                onChange={(evt, value) => {
                  formik.setFieldValue("third", value);
                }}
              />
            </CheckBoxGroup>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default TermsAndConditionsStep;
