import { Box, Grid, IconButton } from "@mui/material";

const gridSx = {
  /* backgroundColor: "red", */
  height: "100%",
};

const iconWrapper = {
  width: 17,
  height: 17,

  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const SelfManagementDynamicContainer = (props) => {
  const { disabled, onDelete, children, ...rest } = props;

  const containerSx = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    px: children.length > 1 && 0.7,
    py: children.length > 1 && 1.5,

    mb: 1.25,

    "@media (max-width: 900px)": {
      border: children.length > 1 && "1.4px solid #5EA3A380",
      borderRadius: 1,
    },
  };

  return (
    <Box sx={{ ...containerSx }}>
      <Grid container rowSpacing={1.25} columnSpacing={1} sx={{ ...gridSx }}>
        {children}
      </Grid>
      <IconButton disabled={disabled} onClick={onDelete}>
        <Box sx={{ ...iconWrapper, color: disabled ? "#BFBFBF" : "#5EA3A3" }}>
          <i className="far fa-xs fa-trash" />
        </Box>
      </IconButton>
    </Box>
  );
};

export default SelfManagementDynamicContainer;
