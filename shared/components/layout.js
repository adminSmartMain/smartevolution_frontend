// components/layout.js
import Box from "@mui/material/Box";
import Footer from "./footer";
import Header from "./header";
import Sidebar from "./sidebar";

export default function Layout({ children }) {
  const headerIsFixed = false;
  const headerHeight = 72; // cambia si tu header mide más

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <Box sx={{ flexShrink: 0 }}>
        <Header />
      </Box>

      {/* Main */}
      <Box
        component="main"
        sx={{
          flex: 1,
          display: "flex",
          width: "100%",
          px: { xs: 2, sm: 3, md: "5%" },
          pt: headerIsFixed ? `${headerHeight}px` : 3,
          boxSizing: "border-box",
        }}
      >
     

        {/* Contenido principal */}
        <Box
          sx={{
            flex: 1, // ocupa todo lo demás
            display: "flex",
            flexDirection: "column",
          }}
        >
          {children}
        </Box>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          flexShrink: 0,
          backgroundColor: "background.paper",
        }}
      >
        <Box sx={{ px: { xs: 2, sm: 3, md: "5%" }, py: 2 }}>
          <Footer />
        </Box>
      </Box>
    </Box>
  );
}
