import { Box } from "@mui/material";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import BaseField from "../BaseField";

const DatePicker = (props) => {
  const {
    label,
    value,
    fullWidth,
    error,
    helperText,
    onChange,
    InputProps,
    ...rest
  } = props;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DesktopDatePicker
        label={label}
        value={value}
        onChange={onChange}
        inputFormat="DD/MM/YYYY"
        renderInput={(params) => (
          <BaseField
            {...params}
            fullWidth={fullWidth}
            error={error}
            helperText={helperText}
          />
        )}
        components={{
          OpenPickerIcon: () => (
            <Box color="#5EA3A3" width={24} height={24}>
              <i className="far fa-xs fa-calendar-range" />
            </Box>
          ),
        }}
        OpenPickerButtonProps={{
          disableRipple: true,
          sx: { padding: 0, mr: 0 },
        }}
      />
    </LocalizationProvider>
  );
};

export default DatePicker;
