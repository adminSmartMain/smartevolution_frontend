import { Clear } from "@mui/icons-material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Autocomplete } from "@mui/material";

import BaseField from "@styles/fields/BaseField";

const GenericSelect = (props) => {
  const { value, onChange, options, fullWidth, error, helperText, ...rest } =
    props;

  return (
    <Autocomplete
      size="small"
      disablePortal
      getOptionLabel={(option) => option?.label || ""}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      value={value}
      onChange={onChange}
      options={options}
      noOptionsText="Sin resultados"
      popupIcon={<KeyboardArrowDownIcon sx={{ color: "#5EA3A3" }} />}
      clearIcon={<Clear sx={{ color: "#5EA3A3" }} />}
      renderInput={(params) => (
        <BaseField
          {...params}
          fullWidth={fullWidth}
          error={error}
          helperText={helperText}
        />
      )}
      sx={{ ".MuiAutocomplete-popupIndicator": { margin: 0 } }}
    />
  );
};

export default GenericSelect;
