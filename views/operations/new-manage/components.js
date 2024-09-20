// Material
// hooks
import { useRouter } from "next/router";
import { Box, Switch, Typography } from "@mui/material";
import BackButton from "@styles/buttons/BackButton";
import scrollSx from "@styles/scroll";
// Styles
import { aSx, bSx, cSx } from "./styles";
// Zustand
import { useFormStore } from './store'

export const ManageOperationC = ({ formik }) => {
  const router = useRouter();

  // Zustand
    const { printFormData, setApplyGm } = useFormStore();
  return (
    <Box sx={{ ...scrollSx }}>
      <Box display="flex" flexDirection="row" alignItems="center">
        <BackButton onClick={() => router.back()} />
      </Box>
      <Box>
        <Typography
          letterSpacing={0}
          fontSize="1.6rem"
          fontWeight="medium"
          marginBottom="0.7rem"
          color="#5EA3A3"
          marginLeft={1.5}
        >
          Registro De Operaciones
        </Typography>
      </Box>

      <Box
        display="flex"
        flexDirection="row"
        alignItems="space-around"
        marginLeft={"1rem"}
      >
        <Box
          display={"flex"}
          flexDirection={"column"}
          sx={{
            marginRight: "2rem",
            marginTop: "2rem",
          }}
        >
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            bgcolor={"#fafafa"}
            borderRadius={"4px"}
            border={"0.1rem solid #5EA3A380"}
            padding={"0 7px 0 5px"}
          >
            <Typography
              variant="h6"
              fontSize="0.9vw"
              letterSpacing={0}
              fontWeight="regular"
              color="#333333"
            >
              Aplica GM
            </Typography>
            <Switch
              value={formik.values.applyGm}
              checked={formik.values.applyGm}
              //disabled={option === "preview"}
              sx={{
                "& .MuiSwitch-switchBase": {
                  "&.Mui-checked": {
                    color: "#FFFFFF",
                  },
                  "&.Mui-checked + .MuiSwitch-track": {
                    backgroundColor: "#488B8F",
                  },

                  "&.Mui-disabled": {
                    color: "#488B8F",
                  },
                  "&.Mui-disabled + .MuiSwitch-track": {
                    backgroundColor: "#B5D1C9",
                  },
                },
              }}
              onChange={(e) => {
                if (e.target.checked) {
                  setApplyGm(true)
                } else {
                  setApplyGm(false)
                }
              }}
            />
          </Box>
        </Box>
      </Box>
    <button onClick={printFormData}>Print Form Data</button>

    </Box>
  );
};
