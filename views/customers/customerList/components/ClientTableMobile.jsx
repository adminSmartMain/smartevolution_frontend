import { Fragment, useState } from "react";
import Link from "next/link";
import moment from "moment";

import {
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
} from "@mui/material";

import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";

import ClientDeleteModal from "./ClientDeleteModal";

export const ClientTableMobile = ({
  rows = [],
  handleOpen,
  open,
  handleClose,
  handleDelete,
}) => {
  const [openRow, setOpenRow] = useState(null);

  const toggleRow = (id) => {
    setOpenRow(openRow === id ? null : id);
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ borderRadius: "12px", mt: 3 }}>
        <Table size="small">
          {/* ✅ Header principal */}
          <TableHead>
            <TableRow sx={{ backgroundColor: "#e3e3e3" }}>
              <TableCell sx={{ fontWeight: "bold", fontSize: "0.75rem" }}>
                NIT / Nombre
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "0.75rem" }}>
                Registrado
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "0.75rem" }}>
                Rol(es)
              </TableCell>
              <TableCell />
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((row) => {
              const isOpen = openRow === row.id;

              // ✅ Backend keys reales (según tu ejemplo)
              const doc = row.DocumentNumber ?? "";
              const customer = row.Customer ?? "";
              const created = row.DateCreated
                ? moment(row.DateCreated).format("DD/MM/YYYY")
                : "";
              const roles = row.Roles ?? ""; // ej: "Pagador, Inversionista"
              const email = row.Email ?? "N/A";
              const phone = row.Phone ?? "N/A";
              const riskLevel = row.risk_level ?? "No aplica";

              // booleans
              const hasRiskProfile = !!row.RiskProfile;
              const hasFinancialProfile = !!row.FinancialProfile;

              return (
                <Fragment key={row.id}>
                  {/* ✅ Row principal */}
                  <TableRow>
                    <TableCell sx={{ pr: 1 }}>
                      <Typography fontSize="0.72rem" color="#63595C">
                        {doc}
                      </Typography>

                      <Typography
                        fontWeight="bold"
                        fontSize="0.82rem"
                        color="#5EA3A3"
                        sx={{ wordBreak: "break-word" }}
                      >
                        {customer}
                      </Typography>
                    </TableCell>

                    <TableCell sx={{ pr: 1 }}>
                      <Typography fontSize="0.75rem">{created}</Typography>
                      <Typography fontSize="0.7rem" color="#999">
                        Sin operación
                      </Typography>
                    </TableCell>

                    <TableCell sx={{ pr: 1 }}>
                      <Typography
                        fontSize="0.75rem"
                        sx={{ wordBreak: "break-word" }}
                      >
                        {roles || "—"}
                      </Typography>
                    </TableCell>

                    <TableCell align="right" sx={{ width: 44 }}>
                      <IconButton onClick={() => toggleRow(row.id)}>
                        {isOpen ? (
                          <RemoveCircleOutline sx={{ color: "#5EA3A3" }} />
                        ) : (
                          <AddCircleOutline sx={{ color: "#5EA3A3" }} />
                        )}
                      </IconButton>
                    </TableCell>
                  </TableRow>

                  {/* ✅ Collapse detalle */}
                  <TableRow>
                    <TableCell colSpan={4} sx={{ p: 0 }}>
                      <Collapse in={isOpen} timeout="auto" unmountOnExit>
                        <Box sx={{ backgroundColor: "#f5f5f5", p: 2 }}>
                          {/* ✅ HEADER DETALLE */}
                          <Box
                            sx={{
                              display: "grid",
                              gridTemplateColumns: "repeat(4, 1fr)",
                              gap: 1,
                              mb: 1,
                              backgroundColor: "#e3e3e3",
                              p: 1,
                              borderRadius: "6px",
                            }}
                          >
                            <Typography fontSize="0.72rem" fontWeight="bold">
                              Riesgo
                            </Typography>
                            <Typography fontSize="0.72rem" fontWeight="bold">
                              Perfil
                            </Typography>
                            <Typography fontSize="0.72rem" fontWeight="bold">
                              Contacto
                            </Typography>
                            <Typography fontSize="0.72rem" fontWeight="bold">
                              Teléfono
                            </Typography>
                          </Box>

                          {/* ✅ VALORES DETALLE */}
                          <Box
                            sx={{
                              display: "grid",
                              gridTemplateColumns: "repeat(4, 1fr)",
                              gap: 1,
                              mb: 2,
                            }}
                          >
                            <Typography fontSize="0.72rem">
                              {riskLevel}
                            </Typography>

                            <Typography fontSize="0.72rem">
                              {hasFinancialProfile ? "Cargado" : "Sin cargar"}
                            </Typography>

                            <Typography fontSize="0.72rem" sx={{ wordBreak: "break-word" }}>
                              {email}
                            </Typography>

                            <Typography fontSize="0.72rem">
                              {phone}
                            </Typography>
                          </Box>

                          {/* ✅ FOOTER DETALLE */}
                          <Box
                            sx={{
                              display: "grid",
                              gridTemplateColumns: "repeat(3, 1fr)",
                              gap: 1,
                              mb: 1,
                              backgroundColor: "#e3e3e3",
                              p: 1,
                              borderRadius: "6px",
                            }}
                          >
                            <Typography fontSize="0.72rem" fontWeight="bold">
                              Risk Profile
                            </Typography>
                            <Typography fontSize="0.72rem" fontWeight="bold">
                              Financial Profile
                            </Typography>
                            <Typography
                              fontSize="0.72rem"
                              fontWeight="bold"
                              sx={{ textAlign: "center" }}
                            >
                              Acciones
                            </Typography>
                          </Box>

                          <Box
                            sx={{
                              display: "grid",
                              gridTemplateColumns: "repeat(3, 1fr)",
                              gap: 1,
                              alignItems: "center",
                            }}
                          >
                            <Typography fontSize="0.72rem">
                              {hasRiskProfile ? "Cargado" : "Sin cargar"}
                            </Typography>

                            <Typography fontSize="0.72rem">
                              {hasFinancialProfile ? "Cargado" : "Sin cargar"}
                            </Typography>

                            {/* ✅ ACCIONES */}
                            <Box
                              display="flex"
                              gap={1}
                              justifyContent="center"
                              sx={{ flexWrap: "wrap" }}
                            >
                              <Link
                                href={`/financialProfile/financialStatement/?id=${row.id}`}
                                passHref
                              >
                                <Typography
                                  component="a"
                                  fontFamily="icomoon"
                                  fontSize="1.4rem"
                                  color="#488B8F"
                                  sx={{ cursor: "pointer" }}
                                >
                                  &#xe904;
                                </Typography>
                              </Link>

                              <Link href={`/riskProfile?id=${row.id}`} passHref>
                                <Typography
                                  component="a"
                                  fontFamily="icomoon"
                                  fontSize="1.4rem"
                                  color="#488B8F"
                                  sx={{ cursor: "pointer" }}
                                >
                                  &#xe903;
                                </Typography>
                              </Link>

                              <Link href={`/customers?preview=${row.id}`} passHref>
                                <Typography
                                  component="a"
                                  fontFamily="icomoon"
                                  fontSize="1.4rem"
                                  color="#999"
                                  sx={{ cursor: "pointer" }}
                                >
                                  &#xe922;
                                </Typography>
                              </Link>

                              <Link href={`/customers?modify=${row.id}`} passHref>
                                <Typography
                                  component="a"
                                  fontFamily="icomoon"
                                  fontSize="1.4rem"
                                  color="#999"
                                  sx={{ cursor: "pointer" }}
                                >
                                  &#xe900;
                                </Typography>
                              </Link>

                              <Typography
                                fontFamily="icomoon"
                                fontSize="1.4rem"
                                color="#999"
                                sx={{ cursor: "pointer" }}
                                onClick={() => handleOpen?.(row.Customer, row.id)}
                              >
                                &#xe901;
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </Fragment>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ✅ Renderiza el modal una sola vez (no dentro del map) */}
      {open && (
        <ClientDeleteModal
          open={open}
          handleClose={handleClose}
          handleDelete={handleDelete}
        />
      )}
    </>
  );
};

