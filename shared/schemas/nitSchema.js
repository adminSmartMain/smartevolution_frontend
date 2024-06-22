import * as Yup from "yup";

const nitSchema = (key) => ({
  [key]: Yup.number()
    .required("Campo obligatorio")
    .test(
      "len",
      "Formato de NIT inválido",
      (val) => val?.toString()?.length === 9
    ),
});

export default nitSchema;
