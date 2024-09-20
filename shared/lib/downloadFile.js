/**
 * Creates an anchor element `<a></a>` with
 * the base64 pdf source and a filename with the
 * HTML5 `download` attribute then clicks on it.
 * @param  {string} pdfEncodedB64
 * @return {void}
 */
const downloadFile = (url, fileName) => {
  if (document) {
    const linkSource = url;
    const downloadLink = document.createElement("a");
    downloadLink.target = "_blank";
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  }
};

export default downloadFile;
