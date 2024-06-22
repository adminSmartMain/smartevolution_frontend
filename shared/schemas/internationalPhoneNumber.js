import * as Yup from "yup";

const phoneNumberSchema = (key) => ({
  [key]: Yup.number()
    .required("Campo obligatorio")
    .test(
      "len",
      "Formato de número inválido",
      (val) => val?.toString()?.length > 0 && val?.toString()?.length <= 13
    ),
});

export default phoneNumberSchema;
