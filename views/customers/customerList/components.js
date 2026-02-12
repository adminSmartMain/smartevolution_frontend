import React,{ useEffect, useState } from "react";
import { Box, Typography, IconButton, Menu, MenuItem, } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useFetch } from "@hooks/useFetch";
import { DeleteClientById, GetClientList } from "./queries";
import { Tooltip, Fade } from "@mui/material";
import Skeleton from '@mui/material/Skeleton';
import { ClientHeader } from "./components/ClientHeader";
import { ClientTableComponent } from "./components/ClientTableComponent";
import AddReactionIcon from '@mui/icons-material/AddReaction';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import MoodIcon from '@mui/icons-material/Mood';
import SentimentSatisfiedSharpIcon from '@mui/icons-material/SentimentSatisfiedSharp';
import SentimentNeutralRoundedIcon from '@mui/icons-material/SentimentNeutralRounded';
import SentimentVeryDissatisfiedRoundedIcon from '@mui/icons-material/SentimentVeryDissatisfiedRounded';
import AccountBalanceRoundedIcon from '@mui/icons-material/AccountBalanceRounded';
import Link from "next/link";
import CustomTooltip from "@styles/customTooltip";
import Modal from "@components/modals/modal";
import InputTitles from "@styles/inputTitles";
import RedButtonModal from "@styles/buttons/noButtonModal";
import GreenButtonModal from "@styles/buttons/yesButtonModal";
import { useRouter } from "next/router"; 
import Button from "@mui/material/Button";

import moment from "moment";

const RiskTooltip = ({ children, row }) => (
  <Tooltip
    title={<RiskTooltipContent row={row} />}
    arrow
    placement="right"
    TransitionComponent={Fade}
    PopperProps={{
      modifiers: [
        { name: "offset", options: { offset: [10, 8] } }, // se separa del icono
      ],
    }}
    componentsProps={{
      tooltip: {
        sx: {
          backgroundColor: "#fff",
          color: "#4b4b4b",
          border: "1px solid #D7E6E4",
          boxShadow: "0px 8px 20px rgba(0,0,0,0.12)",
          borderRadius: "10px",
          p: 1.2,
          maxWidth: "none",
        },
      },
      arrow: {
        sx: {
          color: "#fff",
          "&:before": {
            border: "1px solid #D7E6E4",
          },
        },
      },
    }}
  >
    {children}
  </Tooltip>
);

const RiskTooltipContent = ({ row }) => {
  const hasRiskProfile = Boolean(row?.riskProfile);

  const name = row?.Customer ?? "Nombre completo cliente A";

  // ✅ Caso NO aplica
  if (!hasRiskProfile) {
    const level = "No aplica";
    const score = 0;
    const c = "#7a7a7a";
    const detail =
      "Este cliente aun no cuenta con informaciòn suficiente para determinar su perfil de riesgo. Se requiere completar el cuestionario o validar datos antes de emitir una recomendación.";

    return (
      <Box sx={{ width: 260 }}>
        <Typography sx={{ fontSize: 12, fontWeight: 800, color: "#2b8c90" }}>
          {name}
        </Typography>

        <Box sx={{ display: "flex", gap: 1.5, mt: 1 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              backgroundColor: `${c}22`,
              display: "grid",
              placeItems: "center",
              fontSize: 22,
              fontWeight: 900,
              color: c,
              flex: "0 0 auto",
            }}
          >
            —
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: "#4b4b4b" }}>
              Puntaje: <span style={{ color: c }}>{score}</span>
            </Typography>
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: "#4b4b4b" }}>
              Nivel de Riesgo: <span style={{ color: c }}>{level}</span>
            </Typography>

            <Typography
              sx={{
                mt: 0.5,
                fontSize: 10.5,
                fontWeight: 600,
                color: "#7a7a7a",
                lineHeight: 1.2,
              }}
            >
              {detail}
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }

  // ✅ Caso con perfil (tu lógica normal)
  const score = row?.RiskScore ?? 591;
  const level = row?.RiskLabel ?? "Alto";
  const detail =
    row?.RiskDetail ??
    "Historial con reportes negativos recientes o morosidad recurrente. Capacidad de pago comprometida.";

  const mapColor = {
    Alto: "#E66431",
    Medio: "#E3A400",
    Bajo: "#1E8E3E",
    Desconocido: "#7a7a7a",
  };

  const c = mapColor[level] ?? "#7a7a7a";

  return (
    <Box sx={{ width: 260 }}>
      <Typography sx={{ fontSize: 12, fontWeight: 800, color: "#2b8c90" }}>
        {name}
      </Typography>

      <Box sx={{ display: "flex", gap: 1.5, mt: 1 }}>
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            backgroundColor: `${c}22`,
            display: "grid",
            placeItems: "center",
            fontSize: 22,
            fontWeight: 900,
            color: c,
            flex: "0 0 auto",
          }}
        >
          ☹
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontSize: 11, fontWeight: 700, color: "#4b4b4b" }}>
            Puntaje: <span style={{ color: c }}>{score}</span>
          </Typography>
          <Typography sx={{ fontSize: 11, fontWeight: 700, color: "#4b4b4b" }}>
            Nivel de Riesgo: <span style={{ color: c }}>{level}</span>
          </Typography>

          <Typography
            sx={{
              mt: 0.5,
              fontSize: 10.5,
              fontWeight: 600,
              color: "#7a7a7a",
              lineHeight: 1.2,
            }}
          >
            {detail}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};


const TableSkeleton = ({ rows = 15, columns = 9 }) => {
  return (
    <Box
      sx={{
        border: '1px solid #e0e0e0',
        borderRadius: '4px',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          backgroundColor: '#f5f5f5',
          borderBottom: '2px solid #e0e0e0',
          px: 2,
          py: 1,
        }}
      >
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton
            key={i}
            variant="text"
            height={40}
            sx={{ mx: 1 }}
          />
        ))}
      </Box>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <Box
          key={rowIndex}
          sx={{
            display: 'grid',
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            px: 2,
            py: 1,
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              variant="rectangular"
              height={55}
              sx={{
                mx: 1,
                borderRadius: '4px',
              }}
            />
          ))}
        </Box>
      ))}
    </Box>
  );
};

const sectionTitleContainerSx = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "rigth",
};
const money = (v) =>
  v === null || v === undefined || v === "" ? "" : new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(Number(v));

const ColumnHeader2 = ({ top, bottom }) => (
  <Box sx={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
    <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#5b5b5b" }}>
      {top}
    </Typography>
    {bottom ? (
      <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#7a7a7a" }}>
        {bottom}
      </Typography>
    ) : null}
  </Box>
);



export const ClientListComponent = () => {
   const router = useRouter();

  const [page, setPage] = useState(1);
  const [open, setOpen] = useState([false, "", null]);
  const [customers, setCustomers] = useState([]);
  const [query, setQuery] = useState("");
  const [openWindow, setOpenWindow] = useState(null);

    const handleOpenViewCustomer = (id) => {
    
      
    if (openWindow && !openWindow.closed) {
      openWindow.focus();
    } else {
      const newWindow = window.open(
        `/customers?preview=${id}`,
        "_blank",
        "width=800,height=600"
      );
      setOpenWindow(newWindow);

      newWindow.onbeforeunload = () => {
        setOpenWindow(null);
      };
    }
  };

  const handleOpenEditCustomer = (id) => {
    
      
    if (openWindow && !openWindow.closed) {
      openWindow.focus();
    } else {
      const newWindow = window.open(
       `/customers?modify=${id}`,
        "_blank",
        "width=800,height=600"
      );
      setOpenWindow(newWindow);

      newWindow.onbeforeunload = () => {
        setOpenWindow(null);
      };
    }
  };
  const [actionsMenu, setActionsMenu] = useState({
    anchorEl: null,
    row: null,
  });

  const menuOpen = Boolean(actionsMenu.anchorEl);

  const openMenu = (e, row) => {
    e.preventDefault?.();
    e.stopPropagation();
    setActionsMenu({ anchorEl: e.currentTarget, row });
  };

  const closeMenu = (e) => {
    e?.stopPropagation?.();
    setActionsMenu({ anchorEl: null, row: null });
  };

  const handleOpen = (customerName, id) => setOpen([true, customerName, id]);

  const handleClose = () => {
    setOpen([false, "", null]); // ✅ NO false
  };

  const handleDelete = (id) => {
    DeleteClientById(id);
    setOpen([false, "", null]);

    setTimeout(() => {
      setCustomers((prev) => prev.filter((c) => c.id !== id));
    }, 1000);
  };

  // Helpers del menú (para que funcione “como antes”)
  const goPreview = (e) => {
    e?.stopPropagation?.();
    const id = actionsMenu.row?.id;
    closeMenu(e);
    if (id) handleOpenViewCustomer(id);
  };

  const goModify = (e) => {
    e?.stopPropagation?.();
    const id = actionsMenu.row?.id;
    closeMenu(e);
    if (id) handleOpenEditCustomer(id);
  };

  const askDelete = (e) => {
    e?.stopPropagation?.();
    const row = actionsMenu.row;
    closeMenu(e);
    if (row?.id) handleOpen(row?.Customer, row?.id);
  };





const showRiskProfile = (e) => {
  e?.stopPropagation?.();

  const row = actionsMenu.row;
  closeMenu(e);

  if (row?.id) {
    router.push(
      `/customers/financialAnalysisInformation?id=${encodeURIComponent(row.id)}&tab=1`
    );
  }
};

const showFinancialProfileOld = (e) => {
  e?.stopPropagation?.();

  const row = actionsMenu.row;
  closeMenu(e);

  if (row?.id) {
    router.push(
      `/financialProfile/financialStatement?id=${encodeURIComponent(row.id)}&tab=1`
    );
  }
};

const showRiskProfileOld = (e) => {
  e?.stopPropagation?.();

  const row = actionsMenu.row;
  closeMenu(e);

  if (row?.id) {
    router.push(
      `/riskProfile?id=${encodeURIComponent(row.id)}`
    );
  }
};
  

  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  // ✅ Hook Fetch
  const { fetch, loading, error, data } = useFetch({
    service: (args) => GetClientList({ page, ...args }),
    init: true,
  });

const safeDate = (iso) => {
  if (!iso) return "—";
  const m = moment(iso);
  return m.isValid() ? m.format("DD/MM/YYYY") : "—";
};

const toNumber = (v) => {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

// ✅ Cuando cambia data -> map customers
useEffect(() => {
  const mapped =
    data?.results?.map((customer) => {
      const roleNames = (customer.rolesData ?? [])
        .map((a) => a?.role?.name)
        .filter(Boolean);

      return {
        id: customer.id,

        DocumentNumber: customer.document_number,
        Customer: `${customer.first_name ?? ""} ${customer.last_name ?? ""} ${
          customer.social_reason ?? ""
        }`.trim(),

        created_at: customer.created_at,
        RegisteredAt: customer.RegisteredAt,
        LastOperationAt: customer.LastOperationAt,

        AvatarUrl: customer.profile_image,

        FinancialProfile: customer.financial_profile,
        RiskProfile: customer.riskProfile,

        Email: customer.email,
        Phone: customer.phone_number,

        InvoicesPending: customer.InvoicesPending ?? 0,
        InvoicesTotal: customer.InvoicesTotal ?? 0,

        // ✅ NUEVOS (backend)
        IsInvestor: Boolean(customer.IsInvestor),
        SaldoCuenta: toNumber(customer.SaldoCuenta),         // "0.00" -> 0
        PorCobrar: toNumber(customer.PorCobrar),             // "1000.00" -> 1000
        TotalPortafolio: toNumber(customer.TotalPortafolio), // "1000.00" -> 1000

        // ✅ Roles por cliente
        Roles: roleNames.length ? roleNames.join(", ") : "—",

        // ✅ riesgo (ajusta el path real)
        risk_level: customer.riskProfileData?.riskLevels ?? "No aplica",
      };
    }) || [];

  setCustomers(mapped);
}, [data]);



  // ✅ handlers del header

  const handleSearch = () => {
    setPage(1);
    fetch({
      page: 1,
      ...(query && { intelligent_query: query }), // o client/document según tu API
      ...(dateRange.startDate && { startDate: dateRange.startDate }),
      ...(dateRange.endDate && { endDate: dateRange.endDate }),
    });
  };

  const handleClearSearch = () => {
    setQuery("");
    setPage(1);
    fetch({
      page: 1,
      ...(dateRange.startDate && { startDate: dateRange.startDate }),
      ...(dateRange.endDate && { endDate: dateRange.endDate }),
    });
  };

  const handleApplyDateRange = (range) => {
    setDateRange({
      startDate: range.startDate,
      endDate: range.endDate,
    });

    setPage(1);
    fetch({
      page: 1,
      ...(query && { intelligent_query: query }),
      startDate: range.startDate,
      endDate: range.endDate,
    });
  };

  const handleClearDateRange = () => {
    setDateRange({ startDate: "", endDate: "" });
    setPage(1);

    fetch({
      page: 1,
      ...(query && { intelligent_query: query }),
    });
  };

   const dataCount = data?.count || 0;
  const  columns = [
  // NIT / Nombre (con icono + 2 líneas)
  {
    field: "nitNombre",
    headerName: "NIT / Nombre",
    width: 260,
    sortable: true,
    renderCell: (params) => {
      // Ajusta a tu data real:
      const nit = params.row?.DocumentNumber ?? "1234567890";
      const name = params.row?.Customer ?? "Nombre completo cliente A";
      const iconUrl =
        params.row?.AvatarUrl ??
        "https://devsmartevolution.s3.us-east-1.amazonaws.com/clients-profiles/default-profile.svg"; // placeholder

      return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, width: "100%" }}>
          <Box
            component="img"
            src={iconUrl}
            alt="icon"
            sx={{ width: 28, height: 28, objectFit: "contain" }}
          />
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: "#4b4b4b" }}>
              {nit}
            </Typography>
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 700,
                color: "#2b8c90",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: 200,
              }}
              title={name}
            >
              {name}
            </Typography>
          </Box>
        </Box>
      );
    },
  },

  // Registrado / Ultima op.
  {
    field: "registered",
    width: 130,
    renderHeader: () => <ColumnHeader2 top="Registrado" bottom="Ultima op." />,
    renderCell: (params) => {
      const reg = moment(params.row?.created_at).format("DD/MM/YYYY") ?? "12/01/2026";
      const lastOpRaw = params.row?.LastOperationAt;
const lastOp = lastOpRaw && moment(lastOpRaw).isValid()
  ? moment(lastOpRaw).format("DD/MM/YYYY")
  : "Sin operación";

      return (
        <Box sx={{ display: "flex", flexDirection: "column", lineHeight: 1.15 }}>
          <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#4b4b4b" }}>
            {reg}
          </Typography>
          <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#8a8a8a" }}>
            {lastOp}
          </Typography>
        </Box>
      );
    },
  },

  // Rol(es)
  {
  field: "roles",
  headerName: "Rol(es)",
  width: 150,
  renderCell: (params) => {
    const raw = params.row?.Roles ?? ""; // ej: "Emisor, Inversionista, Pagador"
    const roles = raw
      .split(",")
      .map(r => r.trim())
      .filter(Boolean);

    if (roles.length === 0) {
      return (
        <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#4b4b4b" }}>
          —
        </Typography>
      );
    }

    const maxVisible = 1;
    const visible = roles.slice(0, maxVisible);
    const rest = roles.slice(maxVisible);
    const moreCount = rest.length;

    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, minWidth: 0 }}>
        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 700,
            color: "#4b4b4b",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {visible.join(", ")}
        </Typography>

        {moreCount > 0 && (
  <Tooltip
    title={
      <Box sx={{ p: 0.5 }}>
        <Typography sx={{ fontSize: 11, fontWeight: 800, color: "#2b8c90" }}>
          Roles adicionales
        </Typography>
        <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#6b7280", mt: 0.25 }}>
          {rest.join(", ")}
        </Typography>
      </Box>
    }
    arrow
    placement="right"
    PopperProps={{
      modifiers: [{ name: "offset", options: { offset: [10, 8] } }],
    }}
    componentsProps={{
      tooltip: {
        sx: {
          backgroundColor: "#fff",
          color: "#4b4b4b",
          border: "1px solid #E5E7EB",
          boxShadow: "0px 8px 20px rgba(0,0,0,0.12)",
          borderRadius: "10px",
          p: 1.2,
          maxWidth: 260,
        },
      },
      arrow: {
        sx: {
          color: "#fff",
          "&:before": { border: "1px solid #E5E7EB" },
        },
      },
    }}
  >
    <Box
      onClick={(e) => e.stopPropagation()}
      sx={{
        ml: 0.5,
        px: 0.8,
        py: 0.1,
        fontSize: 11,
        fontWeight: 800,
        lineHeight: 1.4,
        borderRadius: "999px",
        color: "#0F766E",
        backgroundColor: "#ECFDF5",
        border: "1px solid #A7F3D0",
        cursor: "pointer",
        userSelect: "none",
        "&:hover": {
          backgroundColor: "#D1FAE5",
        },
      }}
    >
      +{moreCount}
    </Box>
  </Tooltip>
)}

      </Box>
    );
  },
}
,


  // Riesgo (carita / semáforo)
{
  field: "risk",
  headerName: "Riesgo",
  width: 80,
  align: "center",
  headerAlign: "center",
  sortable: false,
  renderCell: (params) => {
    const hasRiskProfile = Boolean(params.row?.riskProfile);

    const risk = hasRiskProfile
      ? (params.row?.RiskLevel ?? "No aplica").trim()
      : "No aplica";

    const map = {
      "Muy Bajo": { bg: "#E6F4EA", color: "#1E8E3E", Icon: AddReactionIcon },
      "Bajo": { bg: "#E6F4EA", color: "#43A047", Icon: SentimentSatisfiedSharpIcon },
      "Regular": { bg: "#FFF4E5", color: "#E3A400", Icon: SentimentNeutralRoundedIcon },
      "Alto": { bg: "#FCE8E6", color: "#E66431", Icon: SentimentVeryDissatisfiedIcon },
      "Muy Alto": { bg: "#FCE8E6", color: "#D93025", Icon: SentimentVeryDissatisfiedRoundedIcon },
      "No aplica": { bg: "#eeeeee", color: "#777777", Icon: AddReactionIcon },
    };

    const cfg = map[risk] ?? map["No aplica"];
    const IconComp = cfg.Icon;

    const IconBubble = (
      <Box
        sx={{
          width: 22,
          height: 22,
          borderRadius: "50%",
          background: cfg.bg,
          display: "grid",
          placeItems: "center",
          cursor: hasRiskProfile ? "pointer" : "default",
          "&:hover": hasRiskProfile
            ? { backgroundColor: "#B5D1C980" }
            : undefined,
        }}
      >
        <IconComp sx={{ fontSize: 16, color: cfg.color }} />
      </Box>
    );

    return (
      <RiskTooltip row={params.row}>
        {hasRiskProfile ? (
          <Link
            href={`/riskProfile?id=${params.row.id}`}
            style={{ textDecoration: "none" }}
          >
            {IconBubble}
          </Link>
        ) : (
          IconBubble
        )}
      </RiskTooltip>
    );
  },
},


  // Perfil S (icono tipo banco)
 {
  field: "Perfil Financiero Cliente",
  headerName: "",
  width: 20,
  sortable: false,
  filterable: false,
  renderCell: (params) => {
    const loaded = Boolean(params.row?.FinancialProfile); // 👈 viene del serializer

    return (
      <Link href={`/financialProfile/financialStatement/?id=${params.row.id}`}>
        <AccountBalanceRoundedIcon
          sx={{
            color: loaded ? "#488B8F" : "#BDBDBD", // ✅ activo / inactivo
            fontSize: 20,
            cursor: "pointer",
            borderRadius: "5px",
            "&:hover": {
              backgroundColor: "#B5D1C980",
            },
          }}
        />
      </Link>
    );
  },
},


  // Contacto (correo + teléfono, subrayado como link)
  {
    field: "contact",
    headerName: "Contacto",
    width: 220,
    sortable: false,
    renderCell: (params) => {
      const email = params.row?.Email ?? "correoprincipal@usuario.com";
      const phone = params.row?.Phone ?? "+584241234567";

      return (
        <Box sx={{ display: "flex", flexDirection: "column", lineHeight: 1.15 }}>
          <Typography
            sx={{
              fontSize: 11,
              fontWeight: 700,
              color: "#2b8c90",
              textDecoration: "underline",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: 210,
            }}
            title={email}
          >
            {email}
          </Typography>
          <Typography sx={{ fontSize: 11, fontWeight: 700, color: "#4b4b4b" }}>
            {phone}
          </Typography>
        </Box>
      );
    },
  },

  // Saldo cuenta
 {
  field: "SaldoCuenta",
  headerName: "Saldo cuenta",
  width: 130,
  renderCell: (params) => {
    const isInvestor = params.row?.IsInvestor;
    const v = params.row?.SaldoCuenta;

    return (
      <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#4b4b4b" }}>
        {!isInvestor ? "No Aplica" : money(v ?? 0)}
      </Typography>
    );
  },
},


  // Facturas (ej: 13 (10))
 {
  field: "invoices",
  headerName: "Facturas",
  width: 90,
  renderCell: (params) => {
    const total = params.row?.InvoicesTotal ?? 0;
    const pending = params.row?.InvoicesPending ?? 0;

    return (
      <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#4b4b4b" }}>
        {total} ({pending})
      </Typography>
    );
  },
},

  // Total Portafolio
{
  field: "TotalPortafolio",
  headerName: "Total Portafolio",
  width: 170,
  renderCell: (params) => {
    const v = params.row?.TotalPortafolio;
    return (
      <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#4b4b4b" }}>
        {money(v ?? 0)}
      </Typography>
    );
  },
},

    {
      field: "actions",
      headerName: "Acciones",
      width: 90,
      align: "center",
      headerAlign: "center",
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <IconButton
          size="small"
          onMouseDown={(e) => e.stopPropagation()} // ✅ evita que DataGrid “capture” el click
          onClick={(e) => openMenu(e, params.row)}
        >
          <MoreVertIcon sx={{ color: "#4b4b4b" }} />
        </IconButton>
      ),
    },


];
 
  return (
    <>
     
      <Box sx={{ ...sectionTitleContainerSx }}>

        <ClientHeader
        query={query}
        setQuery={setQuery}
        onSearch={handleSearch}
        onClearSearch={handleClearSearch}
        onOpenFilters={() => console.log("Abrir modal filtros")}
        onApplyDateRange={handleApplyDateRange}
        onClearDateRange={handleClearDateRange}
      />
      </Box>

            {loading ? (
  <TableSkeleton rows={8} columns={columns.length} />
) : (  
    <ClientTableComponent

    rows={customers}
    columns={columns}
    page={page}
    dataCount={dataCount}
    setPage={setPage}
    fetch={fetch}
    query={query}
    loading={loading}

    
    />
    
      
       )}


      <Menu
        anchorEl={actionsMenu.anchorEl}
        open={menuOpen}
        onClose={closeMenu}
        // ✅ importante: NO frenes el click aquí, solo frena dentro de cada handler
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            borderRadius: "10px",
            mt: 1,
            boxShadow: "0px 10px 25px rgba(0,0,0,0.12)",
            border: "1px solid #E6E6E6",
            minWidth: 190,
            px: 0.5,
          },
        }}
      >
        {/* VER */}
        <MenuItem sx={{ gap: 1 }} onClick={goPreview}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CustomTooltip
              title="Ver cliente"
              arrow
              placement="bottom-start"
              TransitionComponent={Fade}
              PopperProps={{
                modifiers: [{ name: "offset", options: { offset: [0, -15] } }],
              }}
            >
             <Typography
                fontFamily="icomoon"
                fontSize="1.9rem"
                color="#999999"
                borderRadius="5px"
                sx={{
                  "&:hover": { backgroundColor: "#B5D1C980", color: "#488B8F" },
                  cursor: "pointer",
                }}
              >
                &#xe922;
              </Typography>
            </CustomTooltip>

            <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#4b4b4b" }}>
              Ver detalles
            </Typography>
          </Box>
        </MenuItem>
        {/* ELIMINAR */}
        <MenuItem sx={{ gap: 1 }} onClick={askDelete}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CustomTooltip
              title="Eliminar"
              arrow
              placement="bottom-start"
              TransitionComponent={Fade}
              PopperProps={{
                modifiers: [{ name: "offset", options: { offset: [0, -15] } }],
              }}
            >
              <Typography
                fontFamily="icomoon"
                fontSize="1.9rem"
                color="#999999"
                borderRadius="5px"
                sx={{
                  "&:hover": { backgroundColor: "#B5D1C980", color: "#488B8F" },
                  cursor: "pointer",
                }}
              >
                &#xe901;
              </Typography> 
            </CustomTooltip>

            <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#4b4b4b" }}>
              Ver Cuenta
            </Typography>
          </Box>
        </MenuItem>
        {/* ELIMINAR */}
        <MenuItem sx={{ gap: 1 }} onClick={showRiskProfile}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CustomTooltip
              title="Eliminar"
              arrow
              placement="bottom-start"
              TransitionComponent={Fade}
              PopperProps={{
                modifiers: [{ name: "offset", options: { offset: [0, -15] } }],
              }}
            >
              <Typography
                fontFamily="icomoon"
                fontSize="1.9rem"
                color="#999999"
                borderRadius="5px"
                sx={{
                  "&:hover": { backgroundColor: "#B5D1C980", color: "#488B8F" },
                  cursor: "pointer",
                }}
              >
                &#xe901;
              </Typography>
            </CustomTooltip>

            <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#4b4b4b" }}>
              Ver Perfil de Riesgo
            </Typography>
          </Box>
        </MenuItem>


         <MenuItem sx={{ gap: 1 }} onClick={showRiskProfileOld}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CustomTooltip
              title="Eliminar"
              arrow
              placement="bottom-start"
              TransitionComponent={Fade}
              PopperProps={{
                modifiers: [{ name: "offset", options: { offset: [0, -15] } }],
              }}
            >
             <Typography
                fontFamily="icomoon"
                fontSize="1.9rem"
                color="#999999"
                borderRadius="5px"
                sx={{
                  "&:hover": { backgroundColor: "#B5D1C980", color: "#488B8F" },
                  cursor: "pointer",
                }}
              >
                &#xe901;
              </Typography>
            </CustomTooltip>

            <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#4b4b4b" }}>
              Ver Perfil de Riesgo viejo
            </Typography>
          </Box>
        </MenuItem>


         <MenuItem sx={{ gap: 1 }} onClick={showFinancialProfileOld}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CustomTooltip
              title="Eliminar"
              arrow
              placement="bottom-start"
              TransitionComponent={Fade}
              PopperProps={{
                modifiers: [{ name: "offset", options: { offset: [0, -15] } }],
              }}
            >
              <Typography
                fontFamily="icomoon"
                fontSize="1.9rem"
                color="#999999"
                borderRadius="5px"
                sx={{
                  "&:hover": { backgroundColor: "#B5D1C980", color: "#488B8F" },
                  cursor: "pointer",
                }}
              >
                &#xe901;
              </Typography>
            </CustomTooltip>

            <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#4b4b4b" }}>
              Ver Perfil financiero Viejo
            </Typography>
          </Box>
        </MenuItem>
        {/* ELIMINAR */}
        <MenuItem sx={{ gap: 1 }} onClick={askDelete}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CustomTooltip
              title="Eliminar"
              arrow
              placement="bottom-start"
              TransitionComponent={Fade}
              PopperProps={{
                modifiers: [{ name: "offset", options: { offset: [0, -15] } }],
              }}
            >
             <Typography
                fontFamily="icomoon"
                fontSize="1.9rem"
                color="#999999"
                borderRadius="5px"
                sx={{
                  "&:hover": { backgroundColor: "#B5D1C980", color: "#488B8F" },
                  cursor: "pointer",
                }}
              >
                &#xe901;
              </Typography>
            </CustomTooltip>

            <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#4b4b4b" }}>
              Ver Perfil Financiero
            </Typography>
          </Box>
        </MenuItem>
        {/* EDITAR */}
        <MenuItem sx={{ gap: 1 }} onClick={goModify}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CustomTooltip
              title="Editar cliente"
              arrow
              placement="bottom-start"
              TransitionComponent={Fade}
              PopperProps={{
                modifiers: [{ name: "offset", options: { offset: [0, -15] } }],
              }}
            >
              <Typography
                fontFamily="icomoon"
                fontSize="1.9rem"
                color="#999999"
                borderRadius="5px"
                sx={{
                  "&:hover": { backgroundColor: "#B5D1C980", color: "#488B8F" },
                  cursor: "pointer",
                }}
              >
                &#xe900;
              </Typography>
            </CustomTooltip>

            <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#4b4b4b" }}>
              Editar cliente
            </Typography>
          </Box>
        </MenuItem>

        {/* ELIMINAR */}
        <MenuItem sx={{ gap: 1 }} onClick={askDelete}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CustomTooltip
              title="Eliminar"
              arrow
              placement="bottom-start"
              TransitionComponent={Fade}
              PopperProps={{
                modifiers: [{ name: "offset", options: { offset: [0, -15] } }],
              }}
            >
              <Typography
                fontFamily="icomoon"
                fontSize="1.9rem"
                color="#999999"
                borderRadius="5px"
                sx={{
                  "&:hover": { backgroundColor: "#B5D1C980", color: "#488B8F" },
                  cursor: "pointer",
                }}
              >
                &#xe901;
              </Typography>
            </CustomTooltip>

            <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#4b4b4b" }}>
              Eliminar
            </Typography>
          </Box>
        </MenuItem>
      </Menu>

      {/* ✅ Modal igual al de antes, pero usando open[] bien */}
      <Modal open={open[0]} handleClose={handleClose}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="100%"
          width="100%"
        >
          <Typography letterSpacing={0} fontSize="1vw" fontWeight="medium" color="#63595C">
            ¿Estás seguro que deseas eliminar a
          </Typography>

          <InputTitles mt={2} sx={{ fontSize: "1.1vw" }}>
            {open[1]}
          </InputTitles>

          <Typography letterSpacing={0} fontSize="1vw" fontWeight="medium" color="#63595C" mt={2}>
            de los clientes?
          </Typography>

          <Typography letterSpacing={0} fontSize="0.8vw" fontWeight="medium" color="#333333" mt={3.5}>
            Si eliminas a este cliente, no podrás recuperarlo.
          </Typography>

          <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center" mt={4}>
            <GreenButtonModal onClick={handleClose}>Volver</GreenButtonModal>
            <RedButtonModal sx={{ ml: 2 }} onClick={() => handleDelete(open[2])}>
              Eliminar
            </RedButtonModal>
          </Box>
        </Box>
      </Modal>

    </>
  );
};
