import Link from "next/link";
import {
  Box,
  Button,
  IconButton,
  TextField,
  InputAdornment,
} from "@mui/material";

import AdvancedDateRangePicker from "../../../../shared/components/AdvancedDateRangePicker";

import {
  TuneOutlined,
  AccountBalanceOutlined,
  PersonAddAltOutlined,
  Clear as ClearIcon,
} from "@mui/icons-material";

import { useState } from "react";

const outlineActionSx = {
  border: "1px solid #5EA3A3",
  borderRadius: "8px",
  color: "#488B8F",
  bgcolor: "#FFFFFF",
  height: 40,
  transition: "background-color .16s ease, color .16s ease, border-color .16s ease",
  "&:hover": {
    color: "#FFFFFF",
    bgcolor: "#488B8F",
    borderColor: "#488B8F",
  },
};

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
      return;
    }

    const newWindow = window.open(
      "/customers?register",
      "_blank",
      "width=800,height=600"
    );

    setOpenWindow(newWindow);

    if (newWindow) {
      newWindow.onbeforeunload = () => setOpenWindow(null);
    }
  };

  return (
    <Box sx={{ width: "100%", minWidth: 0 }}>
      <Box
        sx={{
          display: "grid",
          gap: 1,
          alignItems: "center",
          gridTemplateColumns: "minmax(0, 1fr) auto",
          gridTemplateAreas: `
            "search filters"
            "date date"
          `,
          "@media (min-width:1200px)": {
            gridTemplateColumns: "minmax(320px, 1fr) auto minmax(220px, 270px) auto auto",
            gridTemplateAreas: '"search filters date cuentas registrar"',
          },
        }}
      >
        <Box sx={{ gridArea: "search", minWidth: 0 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Buscar por NIT o nombre de cliente"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") onSearch();
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                height: 40,
                borderRadius: "8px",
                bgcolor: "#FFFFFF",
                "& fieldset": { borderColor: "#CBD7D9" },
                "&:hover fieldset": { borderColor: "#5EA3A3" },
                "&.Mui-focused fieldset": { borderColor: "#488B8F" },
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

        <IconButton
          aria-label="Abrir filtros"
          onClick={onOpenFilters}
          sx={{ ...outlineActionSx, gridArea: "filters", width: 46 }}
        >
          <TuneOutlined fontSize="small" />
        </IconButton>

        <Box
          sx={{
            gridArea: "date",
            display: "flex",
            gap: 1,
            alignItems: "center",
            minWidth: 0,
            width: "100%",
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <AdvancedDateRangePicker
              className="date-picker"
              onApply={onApplyDateRange}
              onClean={onClearDateRange}
            />
          </Box>

          <Link href="/customers/accountList" passHref>
            <IconButton
              component="a"
              aria-label="Cuentas"
              sx={{
                ...outlineActionSx,
                width: 46,
                flexShrink: 0,
                display: { xs: "flex", lg: "none" },
              }}
            >
              <AccountBalanceOutlined fontSize="small" />
            </IconButton>
          </Link>

          <IconButton
            aria-label="Registrar cliente"
            onClick={handleOpenRegisterCustomer}
            sx={{
              ...outlineActionSx,
              width: 46,
              flexShrink: 0,
              display: { xs: "flex", lg: "none" },
            }}
          >
            <PersonAddAltOutlined fontSize="small" />
          </IconButton>
        </Box>

        <Link href="/customers/accountList" passHref>
          <Button
            component="a"
            sx={{
              ...outlineActionSx,
              gridArea: "cuentas",
              px: 1.6,
              textTransform: "none",
              fontWeight: 700,
              justifyContent: "center",
              display: { xs: "none", lg: "flex" },
            }}
            startIcon={<AccountBalanceOutlined fontSize="small" />}
          >
            Cuentas
          </Button>
        </Link>

        <Button
          onClick={handleOpenRegisterCustomer}
          sx={{
            ...outlineActionSx,
            gridArea: "registrar",
            px: 1.6,
            textTransform: "none",
            fontWeight: 700,
            justifyContent: "center",
            display: { xs: "none", lg: "flex" },
          }}
          startIcon={<PersonAddAltOutlined fontSize="small" />}
        >
          Registrar
        </Button>
      </Box>
    </Box>
  );
};
