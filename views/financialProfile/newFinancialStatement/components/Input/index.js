//Material UI imports
import { NumericFormat } from "react-number-format";

import { Box, InputLabel, TextField } from "@mui/material";

import { FinancialStatInput } from "@styles/financialStatInput";

export default ({
  value,
  changeValue,
  verticalVariation,
  horizontalVariation,
  handleFieldChange,
  subgroup,
  isLabelColumn,
  id,
  indexPeriod,
  isEditing,
}) => {
  const formatOptions = {
    style: "currency",
    currency: "USD",
  };
  const numberFormat = new Intl.NumberFormat("en-US", formatOptions);

  return (
    <Box
      display="flex"
      flexDirection="row"
      width="100%"
      height="47px"
      justifyContent="space-between"
    >
      {isLabelColumn ? (
        <InputLabel
          sx={{
            width: "100%",
            textAlign: "left",
            display: "flex",
            alignItems: "center",
            font: "normal normal bold 12px/15px Montserrat",
            letterSpacing: "0px",
            color: "#63595C",
            textTransform: "uppercase",
            opacity: 1,
          }}
        >
          <span>{subgroup.title}</span>
        </InputLabel>
      ) : (
        <TextField
          required
          disabled={!isEditing}
          placeholder="Ingrese Monto"
          type="text"
          onChange={changeValue}
          value={isEditing ? value : numberFormat.format(value)}
          onWheel={(e) => e.target.blur()}
          variant="standard"
          onBlur={(e) => {
            handleFieldChange(e);
          }}
          name="patrimony"
          id={id}
          sx={{
            ...FinancialStatInput,
            width: indexPeriod !== 0 ? "40%" : "55%",
            fontSize: "14px",
          }}
          InputProps={{
            disableUnderline: true,
            sx: {
              mt: "-5px",
            },
          }}
          inputProps={{
            fontSize: "14px",
            style: {
              textAlign: "right",
              paddingRight: "5px",
            },
          }}
        />
      )}
      {verticalVariation !== undefined && !isLabelColumn ? (
        <TextField
          disabled
          type="number"
          variant="standard"
          value={verticalVariation}
          sx={{
            ...FinancialStatInput,
            width: "20%",
            opacity: isEditing ? 1 : 0.7,
            fontSize: "14px",
          }}
          InputProps={{
            disableUnderline: true,
            sx: {
              mt: "-5px",
              "& .Mui-disabled": {
                WebkitTextFillColor: "#4A4546",
              },
            },
            endAdornment: (
              <i
                style={{
                  color: "#5EA3A3",
                  fontSize: "14px",
                }}
                className="fa-regular fa-percent"
              ></i>
            ),
          }}
          inputProps={{
            fontSize: "14px",
            style: {
              textAlign: "right",
              paddingRight: "5px",
            },
          }}
        />
      ) : null}
      {horizontalVariation !== undefined &&
      !isLabelColumn &&
      indexPeriod !== 0 ? (
        <TextField
          type="number"
          variant="standard"
          disabled
          value={horizontalVariation}
          sx={{
            ...FinancialStatInput,
            width: "20%",
            opacity: isEditing ? 1 : 0.7,
            fontSize: "14px",
          }}
          InputProps={{
            disableUnderline: true,
            sx: {
              mt: "-5px",
              "& .Mui-disabled": {
                WebkitTextFillColor: "#4A4546",
              },
            },
            endAdornment: (
              <i
                style={{
                  color: "#5EA3A3",
                  fontSize: "14px",
                }}
                className="fa-regular fa-percent"
              ></i>
            ),
          }}
          inputProps={{
            fontSize: "14px",
            style: {
              textAlign: "right",
              paddingRight: "5px",
            },
          }}
        />
      ) : null}
    </Box>
  );
};
