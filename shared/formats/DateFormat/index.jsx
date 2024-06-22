import { format } from "date-fns";
import { es } from "date-fns/locale";

const DateFormat = (props) => {
  const { date, variant, ...rest } = props;

  const valueDate = new Date(date);
  valueDate.setDate(valueDate.getDate());

  switch (variant) {
    case "LONG":
      return (
        <>{format(valueDate, "KK:mm:ss aaa / d MMMM yyyy", { locale: es })}</>
      );

    default:
      return <>{format(valueDate, "dd / M / yyyy", { locale: es })}</>;
  }
};

export default DateFormat;
