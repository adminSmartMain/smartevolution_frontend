import Link from "next/link";
import {
  Box,
  Button,
  IconButton,
  Typography,
  TextField,
  InputAdornment,
} from "@mui/material";

import AdvancedDateRangePicker from "../../../../shared/components/AdvancedDateRangePicker";

import {
  Home as HomeIcon,
  TuneOutlined,
  AccountBalanceOutlined,
  PersonAddAltOutlined,
  Clear as ClearIcon,
} from "@mui/icons-material";
import { Breadcrumbs} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

import { useEffect, useState } from "react";










export const ClientHeader = ({
  query,
  setQuery,
  onSearch,
  onClearSearch,
  onOpenFilters,
  onApplyDateRange,
  onClearDateRange,
}) => {


  const [openWindow, setOpenWindow] = useState(null);

    const handleOpenRegisterCustomer = () => {
    
      
    if (openWindow && !openWindow.closed) {
      openWindow.focus();
    } else {
      const newWindow = window.open(
        "/customers?register",
        "_blank",
        "width=800,height=600"
      );
      setOpenWindow(newWindow);

      newWindow.onbeforeunload = () => {
        setOpenWindow(null);
      };
    }
  };
  return (

    <Box sx={{ width: "100%" }}>
      {/* ✅ TITLE */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
       <Typography
                      letterSpacing={0}
                      fontSize="1.7rem"
                      fontWeight="regular"
                      marginBottom="0.7rem"
                      color="#5EA3A3"
                    >
                        <Breadcrumbs
                    separator={<NavigateNextIcon fontSize="small" />}
                    aria-label="breadcrumb"
                    sx={{ ml: 1, mt: 1 }}
                  >
                    <Link href="/dashboard" underline="none">
              <a>
                 <HomeIcon
                                        fontSize="large" 
                                        sx={{ 
                                          color: '#488b8f',
                                          opacity: 0.8, // Ajusta la transparencia (0.8 = 80% visible)
                                          strokeWidth: 1, // Grosor del contorno
                                        }} 
                                      />

              </a>

            </Link>
                
            
                 <Typography
                               component="h1" className="view-title">
               Clientes
                    </Typography>
                  </Breadcrumbs>
            
                    </Typography>
      </Box>

      {/* ✅ GRID RESPONSIVE */}
      <Box
        sx={{
          display: "grid",
          gap: 1,

          // ✅ MOBILE: 2 FILAS
          gridTemplateColumns: "1fr auto",
          gridTemplateAreas: `
            "search filters"
            "date date"
          `,

          // ✅ DESKTOP: 1 FILA
          "@media (min-width:900px)": {
            gridTemplateColumns: "1fr auto auto auto auto",
            gridTemplateAreas: `"search filters date cuentas registrar"`,
            alignItems: "center",
          },
        }}
      >
        {/* 🔎 SEARCH */}
        <Box sx={{ gridArea: "search" }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Buscar por NIT o nombre de cliente"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSearch();
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                height: 40,
                borderRadius: "10px",
              },
              "& fieldset": {
                borderColor: "#5EA3A3",
              },
            }}
            InputProps={{
              endAdornment: query ? (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={onClearSearch}>
                    <ClearIcon sx={{ color: "#488B8F", fontSize: 18 }} />
                  </IconButton>
                </InputAdornment>
              ) : null,
            }}
          />
        </Box>

        {/* 🎚 FILTERS BUTTON */}
        <IconButton
          onClick={onOpenFilters}
          sx={{
            gridArea: "filters",
            border: "1px solid #5EA3A3",
            borderRadius: "10px",
            color: "#5EA3A3",
            height: 40,
            width: 50,
          }}
        >
          <TuneOutlined />
        </IconButton>

        {/* 📅 DATE ROW (DATE PICKER + ICON BUTTONS ON MOBILE) */}
        <Box
          sx={{
            gridArea: "date",
            display: "flex",
            gap: 1,
            alignItems: "center",
          }}
        >
          {/* Date picker ocupa todo lo que pueda */}
          <Box sx={{ flex: 1 }}>
            <AdvancedDateRangePicker
              className="date-picker"
              onApply={onApplyDateRange}
              onClean={onClearDateRange}
            />
          </Box>

          {/* ✅ MOBILE ONLY: CUENTAS ICON */}
          <Link href="/customers/accountList" passHref>
            <IconButton
              component="a"
              sx={{
                border: "1px solid #5EA3A3",
                borderRadius: "10px",
                color: "#5EA3A3",
                height: 40,
                width: 50,
                display: { xs: "flex", md: "none" },
              }}
            >
              <AccountBalanceOutlined />
            </IconButton>
          </Link>

          {/* ✅ MOBILE ONLY: REGISTRAR ICON */}
          <Link href="/customers?register" passHref>
            <IconButton
              component="a"
              
              sx={{
                border: "1px solid #5EA3A3",
                borderRadius: "10px",
                color: "#5EA3A3",
                height: 40,
                width: 50,
                display: { xs: "flex", md: "none" },
              }}
            >
              <PersonAddAltOutlined />
            </IconButton>
          </Link>
        </Box>

        {/* ✅ DESKTOP ONLY: CUENTAS BUTTON */}
        <Link href="/customers/accountList" passHref>
          <Button
            component="a"
            sx={{
              gridArea: "cuentas",
              border: "1px solid #5EA3A3",
              borderRadius: "10px",
              color: "#5EA3A3",
              textTransform: "none",
              fontWeight: "bold",
              height: 40,
              px: 2,
              justifyContent: "center",
              display: { xs: "none", md: "flex" },
            }}
            startIcon={<AccountBalanceOutlined />}
          >
            Cuentas
          </Button>
        </Link>

        {/* ✅ DESKTOP ONLY: REGISTRAR BUTTON */}
        
          <Button
            component="a"
             onClick={handleOpenRegisterCustomer}
            sx={{
              gridArea: "registrar",
              border: "1px solid #5EA3A3",
              borderRadius: "10px",
              color: "#5EA3A3",
              textTransform: "none",
              fontWeight: "bold",
              height: 40,
              px: 2,
              justifyContent: "center",
              display: { xs: "none", md: "flex" },
            }}
            startIcon={<PersonAddAltOutlined />}
          >
            Registrar
          </Button>
        
      </Box>
    </Box>
  );
};
