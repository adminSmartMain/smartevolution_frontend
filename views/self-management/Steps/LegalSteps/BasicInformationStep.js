import { useContext, useEffect } from "react";

import {
  Box,
  Grid,
  InputAdornment,
  Typography,
  useMediaQuery,
} from "@mui/material";

import CIIUsSelect from "@components/selects/CIIUsSelect";
import CitiesSelect from "@components/selects/CitiesSelect";
import DepartmentSelect from "@components/selects/DepartmentsSelect";
import EmployeeNumberSelect from "@components/selects/EmployeeNumberSelect";

import emailSchema from "@schemas/emailSchema";
import nitSchema from "@schemas/nitSchema";
import numberSchema from "@schemas/numberSchema";
import phoneNumberSchema from "@schemas/phoneNumberSchema";
import selectObjectSchema from "@schemas/selectObjectSchema";
import stringSchema from "@schemas/stringSchema";

import BaseField from "@styles/fields/BaseField";
import DatePicker from "@styles/fields/DatePicker";

import { FormContext } from "@views/self-management/Context";
import Hint from "@views/self-management/Hint";
import {
  defaultStepContainerSx,
  questionParagraphSx,
  questionTextSx,
} from "@views/self-management/styles";

import { useFormik } from "formik";
import * as Yup from "yup";

const schema = Yup.object({
  ...stringSchema("companyName"),
  ...selectObjectSchema("ciiu"),
  ...nitSchema("nit"),
  ...numberSchema("verificationDigit"),
  ...stringSchema("dateOfConstitution"),
  ...stringSchema("principalAddress"),
  ...selectObjectSchema("department"),
  ...selectObjectSchema("city"),
  ...emailSchema("companyEmail"),
  ...phoneNumberSchema("companyPhone"),
  ...stringSchema("presenceInOtherCities"),
  ...selectObjectSchema("numberOfEmployees"),
});

const BasicInformationStep = () => {
  const { pagination, data } = useContext(FormContext);

  const isXs = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const handleNextStep = (values) => {
    data.body.set({ ...data.body.value, ...values });
    pagination.controls.changeStep(pagination.step + 1);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      companyName: data.body.value?.companyName || "",
      ciiu: data.body.value?.ciiu || null,
      nit: data.body.value?.nit || "",
      verificationDigit: data.body.value?.verificationDigit || "",
      dateOfConstitution: data.body.value?.dateOfConstitution || null,
      principalAddress: data.body.value?.principalAddress || "",
      department: data.body.value?.department || null,
      city: data.body.value?.city || null,
      companyEmail: data.body.value?.companyEmail || "",
      companyPhone: data.body.value?.companyPhone || "",
      presenceInOtherCities: data.body.value?.presenceInOtherCities || "",
      numberOfEmployees: data.body.value?.numberOfEmployees || "",
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

  return (
    <Box sx={defaultStepContainerSx}>
      <Box sx={{ pb: 2 }}>
        <Typography sx={{ ...questionParagraphSx, mb: 4.5 }}>
          Sección 1 -<br />
          Información Básica de la empresa
        </Typography>

        <Grid container spacing={1.25} rowSpacing={4.25}>
          <Grid item xs={12} sm={8} md={6}>
            <Typography sx={{ ...questionTextSx }}>
              NOMBRE DE LA EMPRESA
            </Typography>

            <BaseField
              fullWidth
              id="companyName"
              name="companyName"
              placeholder="Escriba su respuesta aquí"
              error={Boolean(formik.errors.companyName)}
              value={formik.values.companyName}
              onChange={formik.handleChange}
              helperText={formik.errors.companyName}
            />
            <Hint show={!formik.errors.companyName}>
              Escriba el nombre tal cual aparece en el RUT
            </Hint>
          </Grid>

          {!isXs && <Grid item sm={4} md={0} />}

          <Grid item xs={12} sm={8} md={4}>
            <Typography sx={{ ...questionTextSx }}>
              NIT DE LA EMPRESA
            </Typography>

            <BaseField
              fullWidth
              id="nit"
              name="nit"
              isPatterned
              format="###.###.###"
              mask="X"
              placeholder="Escriba su respuesta aquí"
              error={Boolean(formik.errors.nit)}
              value={formik.values.nit}
              onChangeMasked={(values) => {
                formik.setFieldValue("nit", values.floatValue);
              }}
              helperText={formik.errors.nit}
            />
            <Hint show={!formik.errors.nit}>Dígito sin separadores</Hint>
          </Grid>

          <Grid item xs={12} sm={8} md={3}>
            <Typography sx={{ ...questionTextSx }}>
              DÍGITO DE VERIFICACIÓN
            </Typography>

            <BaseField
              fullWidth
              id="verificationDigit"
              name="verificationDigit"
              isMasked
              thousandSeparator="."
              decimalSeparator=","
              decimalScale={0}
              isAllowed={(values, sourceInfo) => {
                const { value } = values;
                return !value || value.length === 1;
              }}
              allowNegative={false}
              placeholder=""
              error={Boolean(formik.errors.verificationDigit)}
              value={formik.values.verificationDigit}
              onChangeMasked={(values) => {
                formik.setFieldValue("verificationDigit", values.floatValue);
              }}
              helperText={formik.errors.verificationDigit}
            />
            <Hint show={!formik.errors.verificationDigit}>
              Dígito al final del NIT
            </Hint>
          </Grid>

          {!isXs && <Grid item sm={0} md={0} />}

          <Grid item xs={12} sm={8} md={6}>
            <Typography sx={{ ...questionTextSx }}>
              FECHA DE CONSTITUCIÓN DE LA EMPRESA
            </Typography>

            <DatePicker
              value={formik.values.dateOfConstitution}
              onChange={(date) => {
                formik.setFieldValue(
                  "dateOfConstitution",
                  date?.format("YYYY-MM-DD")
                );
              }}
              error={Boolean(formik.errors.dateOfConstitution)}
              helperText={formik.errors.dateOfConstitution}
              fullWidth
            />
          </Grid>

          {!isXs && <Grid item sm={4} md={0} />}

          <Grid item xs={12} sm={8} md={8}>
            <Typography sx={{ ...questionTextSx }}>
              DIRECCIÓN PRINCIPAL
            </Typography>

            <BaseField
              fullWidth
              id="principalAddress"
              name="principalAddress"
              placeholder="Escriba su respuesta aquí"
              error={Boolean(formik.errors.principalAddress)}
              value={formik.values.principalAddress}
              onChange={formik.handleChange}
              helperText={formik.errors.principalAddress}
            />
          </Grid>

          {!isXs && <Grid item sm={4} md={0} />}

          <Grid item xs={12} sm={8} md={4}>
            <Typography sx={{ ...questionTextSx }}>DEPARTAMENTO</Typography>

            <DepartmentSelect
              fullWidth
              id="department"
              name="department"
              placeholder="Escriba su respuesta aquí"
              error={Boolean(formik.errors.department)}
              value={formik.values.department}
              onChange={(evt, value) => {
                formik.setFieldValue("department", value);
              }}
              helperText={formik.errors.department}
            />
          </Grid>

          <Grid item xs={12} sm={8} md={4}>
            <Typography sx={{ ...questionTextSx }}>CIUDAD</Typography>

            <CitiesSelect
              fullWidth
              id="city"
              name="city"
              placeholder="Escriba su respuesta aquí"
              departmentdId={formik.values.department?.value}
              error={Boolean(formik.errors.city)}
              value={formik.values.city}
              onChange={(evt, value) => {
                formik.setFieldValue("city", value);
              }}
              helperText={formik.errors.city}
            />
          </Grid>

          {!isXs && <Grid item sm={4} md={4} />}

          <Grid item xs={12} sm={8} md={6}>
            <Typography sx={{ ...questionTextSx }}>
              CORREO ELECTRÓNICO CORPORATIVO
            </Typography>

            <BaseField
              fullWidth
              id="companyEmail"
              name="companyEmail"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <i className="far fa-envelope" />
                  </InputAdornment>
                ),
              }}
              placeholder="Escriba su respuesta aquí"
              error={Boolean(formik.errors.companyEmail)}
              value={formik.values.companyEmail}
              onChange={formik.handleChange}
              helperText={formik.errors.companyEmail}
            />
          </Grid>

          {!isXs && <Grid item sm={4} md={6} />}

          <Grid item xs={12} sm={8} md={4}>
            <Typography sx={{ ...questionTextSx }}>
              TELÉFONO CORPORATIVO
            </Typography>

            <BaseField
              fullWidth
              id="companyPhone"
              name="companyPhone"
              isPatterned
              format="## ###########"
              mask="X"
              placeholder="Escriba su respuesta aquí"
              error={Boolean(formik.errors.companyPhone)}
              value={formik.values.companyPhone}
              onChangeMasked={(values) => {
                formik.setFieldValue("companyPhone", values.floatValue);
              }}
              helperText={formik.errors.companyPhone}
            />
          </Grid>

          {!isXs && <Grid item sm={4} md={6} />}

          <Grid item xs={12} sm={8} md={8}>
            <Typography sx={{ ...questionTextSx }}>CIIU</Typography>

            <CIIUsSelect
              fullWidth
              id="ciiu"
              name="ciiu"
              placeholder="Escriba su respuesta aquí"
              error={Boolean(formik.errors.ciiu)}
              value={formik.values.ciiu}
              onChange={(evt, value) => {
                formik.setFieldValue("ciiu", value);
              }}
              helperText={formik.errors.ciiu}
            />
          </Grid>

          {!isXs && <Grid item sm={4} md={8} />}

          <Grid item xs={12} sm={8} md={6}>
            <Typography sx={{ ...questionTextSx }}>
              COBERTURA, SEDES, PRESENCIA EN OTRAS CIUDADES
            </Typography>

            <BaseField
              fullWidth
              id="presenceInOtherCities"
              name="presenceInOtherCities"
              placeholder="Escriba su respuesta aquí"
              error={Boolean(formik.errors.presenceInOtherCities)}
              value={formik.values.presenceInOtherCities}
              onChange={formik.handleChange}
              helperText={formik.errors.presenceInOtherCities}
              inputProps={{ maxLength: 80 }}
            />
            <Hint show={!formik.errors.presenceInOtherCities}>
              Máximo 80 caracteres
            </Hint>
          </Grid>

          {!isXs && <Grid item sm={4} md={6} />}

          <Grid item xs={12} sm={8} md={5}>
            <Typography sx={{ ...questionTextSx }}>
              NÚMEROS DE EMPLEADOS
            </Typography>

            <EmployeeNumberSelect
              fullWidth
              id="numberOfEmployees"
              name="numberOfEmployees"
              placeholder="Escriba su respuesta aquí"
              error={Boolean(formik.errors.numberOfEmployees)}
              value={formik.values.numberOfEmployees}
              onChange={(evt, value) => {
                formik.setFieldValue("numberOfEmployees", value);
              }}
              helperText={formik.errors.numberOfEmployees}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default BasicInformationStep;
