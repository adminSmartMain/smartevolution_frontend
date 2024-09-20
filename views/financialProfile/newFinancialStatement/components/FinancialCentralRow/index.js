import { NumericFormat } from "react-number-format";

import {
  Button,
  Checkbox,
  TableCell,
  TableRow,
  TextField,
} from "@mui/material";

import BanksSelect from "@components/selects/BanksSelect";

import { FinancialStatInput } from "@styles/financialStatInput";

export default (props) => {
  const {
    isChecked,
    bank,
    centralBalances,
    rating,
    index,
    setTableData,
    tableData,
    onDelete,
  } = props;

  return (
    <TableRow>
      <TableCell
        sx={{
          borderBottom: "none",
        }}
      >
        <Checkbox
          checked={isChecked}
          onChange={(e) => {
            const newTableData = JSON.parse(JSON.stringify(tableData));
            newTableData[index].isChecked = e.target.checked;
            setTableData(newTableData);
          }}
          inputProps={{ "aria-label": "controlled" }}
        />
      </TableCell>
      <TableCell
        width="50%"
        align="center"
        sx={{
          borderBottom: "none",
        }}
      >
        <BanksSelect
          value={bank}
          onChange={(evt, value) => {
            const newTableData = JSON.parse(JSON.stringify(tableData));
            newTableData[index].bank = value;
            setTableData(newTableData);
          }}
          fullWidth={true}
          obtainLabelById={true}
        />
      </TableCell>
      <TableCell
        width="25%"
        align="center"
        sx={{
          borderBottom: "none",
        }}
      >
        <NumericFormat
          customInput={TextField}
          decimalSeparator="."
          thousandSeparator=","
          required
          placeholder="Ingrese el monto"
          type="text"
          onChange={(e) => {
            const newTableData = JSON.parse(JSON.stringify(tableData));
            newTableData[index].centralBalances = e.target.value;
            setTableData(newTableData);
          }}
          value={centralBalances}
          onWheel={(e) => e.target.blur()}
          variant="standard"
          sx={{
            ...FinancialStatInput,
            width: "100%",
            padding: "0px",
            pt: "10px",
            pb: "10px",
            pl: "10px",
            color: "#575757",
            font: "bold 14px/15px Montserrat",
          }}
          InputProps={{
            disableUnderline: true,
            sx: {
              mt: "-5px",
            },
          }}
        />
      </TableCell>
      <TableCell
        width="25%"
        align="center"
        sx={{
          borderBottom: "none",
        }}
      >
        <TextField
          required
          placeholder="Ingrese la calificación"
          type="text"
          onChange={(e) => {
            const newTableData = JSON.parse(JSON.stringify(tableData));
            newTableData[index].rating = e.target.value;
            setTableData(newTableData);
          }}
          value={rating}
          onWheel={(e) => e.target.blur()}
          variant="standard"
          sx={{
            ...FinancialStatInput,
            width: "100%",
            padding: "0px",
            pt: "10px",
            pb: "10px",
            pl: "10px",
            color: "#575757",
            fontWeight: 500,
            font: "bold 14px/15px Montserrat",
          }}
          InputProps={{
            disableUnderline: true,
            sx: {
              mt: "-5px",
            },
          }}
        />
      </TableCell>
      <TableCell
        sx={{
          borderBottom: "none",
        }}
      >
        <Button
          onClick={onDelete}
          sx={{
            color: "#5EA3A3",
          }}
        >
          <i class="fa-regular fa-trash"></i>
        </Button>
      </TableCell>
    </TableRow>
  );
};
