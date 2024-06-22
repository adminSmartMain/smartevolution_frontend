import MUICheckbox from "@mui/material/Checkbox";
import { styled } from "@mui/material/styles";

const Chekechoko = (props) => {
  return <MUICheckbox size="small" {...props} />;
};

const SMCheckBox = styled(Chekechoko)(({ theme }) => ({
  color: "#488B8F",

  "&.Mui-checked": {
    color: "#488B8F",
  },
}));

export default SMCheckBox;
