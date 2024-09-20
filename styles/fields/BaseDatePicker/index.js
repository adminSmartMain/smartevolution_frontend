import { useState } from "react";

import TextField from "@mui/material/TextField";
import { Box } from "@mui/system";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

export default function DatePicker({ value, onChange }) {
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DesktopDatePicker
          inputFormat="MM/DD/YYYY"
          value={value.opDate}
          onChange={onChange}
          renderInput={(params) => <TextField {...params} />}
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
    </>
  );
}
