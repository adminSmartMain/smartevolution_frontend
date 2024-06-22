import { Box, Button, Grid, Tab, Tabs, Typography } from "@mui/material";

import { Toast } from "@components/toast";

import FileUploadButton from "@styles/buttons/uploadFileButton";
import InputTitles from "@styles/inputTitles";

import { getBase64 } from "../../libs/pdf";
import FileInputLabel from "../FileInputLabel";

export default (props) => {
  const { item, period, tabValue, allFiles, setAllFiles, isTExtAr } = props;

  return (
    <>
      <Grid
        item
        xs={6}
        key={period.period + "-" + item.key}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "90%",
          mb: "16px",
        }}
      >
        <Box
          sx={{
            width: "90%",
          }}
        >
          <InputTitles mt={3} marginBottom={1}>
            {item.title}
          </InputTitles>
          <input
            id={`${item.key}-${tabValue}`}
            style={{ display: "none" }}
            name={item.key}
            type="file"
            accept="application/pdf"
            onChange={(e) => {
              if (
                e.target.files[0] &&
                e.target.files[0].name.slice(-3) === "pdf"
              ) {
                const fileName = e.currentTarget.name;
                const fileCompleteName = e.target.files[0].name;

                getBase64(e.currentTarget.files[0]).then((data) => {
                  setAllFiles({
                    ...allFiles,
                    [item.key]: {
                      data: data,
                      name: fileCompleteName,
                    },
                  });
                });
              } else {
                Toast("Sólo se permiten archivos PDF", "error");
              }
            }}
          />
          <FileInputLabel
            key={`${item.key}-${tabValue}`}
            idReference={`${item.key}-${tabValue}`}
            title={
              allFiles[item.key]
                ? allFiles[item.key].name.length > 30
                  ? allFiles[item.key].name.substring(0, 30) + "..."
                  : allFiles[item.key].name
                : undefined
            }
            isBackendFile={false}
            file={allFiles[item.key]}
          />
        </Box>
      </Grid>
    </>
  );
};
