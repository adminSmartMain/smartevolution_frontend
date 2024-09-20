import { Box, Typography } from "@mui/material";

import fileToBase64 from "@lib/fileToBase64";

import { PDFDocument } from "pdf-lib";

const FileField = (props) => {
  const {
    hideDownload,
    uploadFileText = "Seleccione archivo a cargar",
    multiple,
    onChange,
    error,
    helperText,
    ...rest
  } = props;

  async function mergePDFs(base64PDFs) {
    const pdfDocs = [];

    for (const base64PDF of base64PDFs) {
      const pdfDoc = await PDFDocument.load(base64PDF, { base64: true });
      pdfDocs.push(pdfDoc);
    }

    const mergedPDF = await PDFDocument.create();

    for (const pdfDoc of pdfDocs) {
      const copiedPages = await mergedPDF.copyPages(
        pdfDoc,
        pdfDoc.getPageIndices()
      );
      copiedPages.forEach((page) => {
        mergedPDF.addPage(page);
      });
    }

    const mergedPDFData = await mergedPDF.save();
    const mergedPDFBase64 = Buffer.from(mergedPDFData).toString("base64");

    return mergedPDFBase64;
  }

  const onFileUpload = async (evt) => {
    const files = evt.target.files;

    let b64Files = [];
    if (files.length > 1) {
      for (const file of files) {
        const b64File = await fileToBase64(file);
        b64Files.push(b64File);
      }

      mergePDFs(b64Files)
        .then((mergedPDFBase64) => {
          b64Files.splice(0, b64Files.length);
          b64Files.push(mergedPDFBase64);
        })
        .catch((error) => console.log(error));
    } else {
      b64Files.push(await fileToBase64(files[0]));
    }
    setTimeout(() => {
      onChange?.(evt, b64Files[0]);
    }, 100);
  };

  return (
    <Box
      sx={{
        position: "relative",

        border: "1.4px solid #5EA3A3",
        borderRadius: 1,
        backgroundColor: "#FAFAFA",

        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",

        px: 1,

        width: "100%",
        height: 37.13,

        boxSizing: "border-box",
      }}
    >
      <Box>
        <Typography sx={{ color: "#57575780", fontWeight: 500, fontSize: 14 }}>
          {uploadFileText}
        </Typography>
      </Box>

      <Box
        component="label"
        sx={{
          cursor: "pointer",

          color: "#5EA3A3",

          display: "flex",
          gap: 1,
          justifyContent: "space-around",
          alignItems: "center",

          padding: "2px 4px",
        }}
      >
        <i className="far fa-upload" />

        <input type="file" hidden multiple={multiple} onChange={onFileUpload} />
      </Box>

      {error && (
        <Box sx={{ position: "absolute", bottom: -20, left: 0 }}>
          <Typography sx={{ color: "#d32f2f", fontSize: 12 }}>
            {helperText}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default FileField;
