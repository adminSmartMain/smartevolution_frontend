import { useEffect, useState } from "react";

import { Box } from "@mui/system";

import {
  Document,
  Font,
  Image,
  PDFViewer,
  Page,
  StyleSheet,
  Svg,
  Text,
  View,
} from "@react-pdf/renderer";

//Register fonts

Font.register({
  family: "Calibri Light",
  src: "https://fonts.cdnfonts.com/css/calibri-light",
});

Font.register({
  family: "Calibri",
  src: "https://fonts.cdnfonts.com/css/calibri",
});

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    margin: "0 20px",
  },
  GeneralTitle: {
    fontSize: "20pt",
    color: "#44546a",
    fontWeight: "bold",
  },
});

const NegotiationSummaryPDF = () => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            width: "100%",
          }}
        >
          {/* Title and Logo */}
          <View
            style={{
              marginTop: "20px",
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <Text style={styles.GeneralTitle}>Oferta de Venta</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

const PDFView = () => {
  const [client, setClient] = useState(false);

  useEffect(() => {
    setClient(true);
  }, []);

  return (
    <PDFViewer style={{ width: "100%", height: "100%" }}>
      <NegotiationSummaryPDF />
    </PDFViewer>
  );
};

export default PDFView;
