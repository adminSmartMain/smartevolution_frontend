import { Box, Button, Typography } from "@mui/material";
import { display } from "@mui/system";

const FileActionButton = (props) => {
  const { icon, title, onClick, file, sx } = props;
  return (
    <Button
      onClick={onClick}
      sx={{
        textAlign: "left",
        font: "bold 12px/21px Montserrat",
        letterSpacing: "0.48px",
        color: "#488B8F",
        textTransform: "uppercase",
        opacity: 1,
        background: "#5EA3A333 0% 0% no-repeat padding-box",
        border: "0.5px solid #488B8F",
        borderRadius: "4px",
        textAlign: "left",
        "&:hover": {
          backgroundColor: "#5EA3A333",
          opacity: 0.6,
        },
        ...sx,
      }}
    >
      <Typography
        fontFamily="icomoon"
        fontSize="0.9rem"
        color="#488B8F"
        marginRight="7px"
      >
        {icon}
      </Typography>
      {title}
    </Button>
  );
};

export default (props) => {
  const base64ToBlob = (base64, type = "application/octet-stream") => {
    const binStr = atob(base64.split(",")[1]);
    const len = binStr.length;
    const arr = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      arr[i] = binStr.charCodeAt(i);
    }
    return new Blob([arr], { type: type });
  };

  const downloadPDF = () => {
    const pdfLink = `${file.data}`;
    const anchorElement = document.createElement("a");
    const fileName = `${file.name}.pdf`;
    anchorElement.href = pdfLink;
    anchorElement.download = fileName;
    anchorElement.click();
  };

  const stylesToUploald = {
    width: "100%",
    backgroundColor: "white",
    border: "1.4px solid #ACCFCF",
    borderRadius: "4px",
    height: "2.5rem",
    textAlign: "left",
    letterSpacing: "0",
    fontSize: "calc(0.3rem + 0.5vw)",
    fontWeight: "regular",
    textTransform: "none",
    color: "#57575780",
    "&:hover": {
      backgroundColor: "#EBFAF6",
    },
    display: "flex",
    justifyContent: "space-between",
    paddingLeft: "1rem",
  };

  const stylesUploaded = {
    width: "100%",
    backgroundColor: "#5EA3A3",
    border: "1px solid #488B8F",
    borderRadius: "4px",
    height: "2.5rem",
    textAlign: "left",
    letterSpacing: "0",
    fontSize: "calc(0.3rem + 0.5vw)",
    fontWeight: "regular",
    textTransform: "none",
    color: "#FFFFFF",
    "&:hover": {
      backgroundColor: "#5EA3A3",
      opacity: 0.8,
    },
    display: "flex",
    justifyContent: "space-between",
    paddingLeft: "1rem",
  };

  const { idReference, title, isBackendFile, file } = props;

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <label style={{ height: "30%", width: "90%" }} htmlFor={idReference}>
          <Button
            component="span"
            sx={!title ? stylesToUploald : stylesUploaded}
          >
            {title ?? "Seleccione archivo a cargar"}
            <Typography
              fontFamily="icomoon"
              fontSize="1.2rem"
              color={!title ? "#5EA3A3" : "#FFFFFF"}
              margin="0rem 0.7rem"
            >
              {!title ? (
                <i class="fa-light fa-upload"></i>
              ) : (
                <i class="fa-regular fa-rotate-right"></i>
              )}
            </Typography>
          </Button>
        </label>
        {title ? (
          <Typography
            fontFamily="icomoon"
            fontSize="1.2rem"
            color="#5EA3A3"
            margin="0rem 0.7rem"
          >
            <i class="fa-regular fa-check"></i>
          </Typography>
        ) : null}
      </Box>
      {title ? (
        <Box
          sx={{
            width: "90%",
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <FileActionButton
            icon={<i class="fa-regular fa-eye"></i>}
            title="VER ONLINE"
            onClick={() => {
              const blobFile = base64ToBlob(file.data, "application/pdf");
              const fileURL = URL.createObjectURL(blobFile);
              window.open(fileURL);
            }}
          />
          <FileActionButton
            icon={<i class="fa-regular fa-download"></i>}
            title="DESCARGAR"
            onClick={downloadPDF}
          />
        </Box>
      ) : null}
    </Box>
  );
};
