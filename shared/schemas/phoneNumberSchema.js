import * as Yup from "yup";

const phoneNumberSchema = (key) => ({
  [key]: Yup.number()
    .required("Campo obligatorio")
    .nullable()

    .test(
      "len",
      "Formato de número inválido",
      (val) => val?.toString()?.length > 0 && val?.toString()?.length < 14
    ),
});

export default phoneNumberSchema;
