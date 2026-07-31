import { useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  Menu,
  MenuItem,
  Paper,
  Select,
  Switch,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Autorenew from "@mui/icons-material/Autorenew";
import BusinessOutlined from "@mui/icons-material/BusinessOutlined";
import EditOutlined from "@mui/icons-material/EditOutlined";
import GroupOutlined from "@mui/icons-material/GroupOutlined";
import LockOpenOutlined from "@mui/icons-material/LockOpenOutlined";
import LockOutlined from "@mui/icons-material/LockOutlined";
import LockReset from "@mui/icons-material/LockReset";
import MoreVert from "@mui/icons-material/MoreVert";
import PersonAddAlt from "@mui/icons-material/PersonAddAlt";
import PageHeader from "@components/pageHeader";
import PieChartOutline from "@mui/icons-material/PieChartOutline";
import Search from "@mui/icons-material/Search";
import ShowChart from "@mui/icons-material/ShowChart";
import VisibilityOutlined from "@mui/icons-material/VisibilityOutlined";
import VerifiedUserOutlined from "@mui/icons-material/VerifiedUserOutlined";
import { ToastContainer, toast } from "react-toastify";
import authContext from "@context/authContext";
import {
  createClientAccess,
  deleteUser,
  getAccessOptions,
  getClientAccess,
  getUserMetrics,
  getUsers,
  restoreUser,
  updateClientAccess,
} from "./queries";
import {
  ArchiveUserModal,
  CreateUserModal,
  EditUserModal,
  PasswordModal,
  UserProfileModal,
} from "./UserModals";

const TEAL = "#3b828e";

const nameOf = (user) =>
  `${user.first_name || ""} ${user.last_name || ""}`.trim() || "Sin nombre";
const initials = (user) =>
  `${user.first_name?.[0] || ""}${user.last_name?.[0] || ""}`.toUpperCase() ||
  user.email?.[0]?.toUpperCase() ||
  "U";

function StatusBadge({ active }) {
  return (
    <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.75, px: 1.25, py: 0.5, borderRadius: "999px", bgcolor: active ? "#e8f5e9" : "#ffebee", color: active ? "#2e7d32" : "#d32f2f", fontSize: 13, fontWeight: 700 }}>
      <Box component="span" sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: "currentColor" }} />
      {active ? "Activo" : "Inactivo"}
    </Box>
  );
}

function Kpi({ icon, value, label, detail, detailColor = "#2e7d32" }) {
  return (
    <Paper variant="outlined" sx={{ minWidth: 184, minHeight: 158, p: 1.75, borderColor: "#e3e8ec", borderRadius: "8px", boxShadow: "0 3px 12px rgba(31,45,61,.04)", "@media (min-width:768px)": { minWidth: 0, minHeight: 104, p: 1.75 } }}>
      <Box sx={{ display: "flex", flexDirection: "column", textAlign: "center", justifyContent: "center", alignItems: "center", gap: 1.5, height: "100%", "@media (min-width:768px)": { flexDirection: "row", textAlign: "left", justifyContent: "flex-start" } }}>
        <Avatar sx={{ bgcolor: "#e4f0f2", color: TEAL, width: 48, height: 48, "@media (min-width:768px)": { width: 40, height: 40 } }}>{icon}</Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Typography fontSize={26} lineHeight={1.05} fontWeight={700}>{value}</Typography>
          <Typography variant="body2" color="text.secondary">{label}</Typography>
          {detail && <Typography variant="caption" sx={{ color: detailColor, fontWeight: 700 }}>{detail}</Typography>}
        </Box>
      </Box>
    </Paper>
  );
}

function UserActions({ user, canAdminister, onView, onEdit, onPassword, onArchive, onRestore, onDelete }) {
  const [anchor, setAnchor] = useState(null);
  return (
    <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", width: "100%" }}>
      <Tooltip title="Ver perfil"><IconButton aria-label="Ver perfil" size="small" onClick={() => onView(user)}><VisibilityOutlined fontSize="small" /></IconButton></Tooltip>
      {canAdminister && <Tooltip title="Editar usuario"><IconButton aria-label="Editar usuario" size="small" onClick={() => onEdit(user)}><EditOutlined fontSize="small" /></IconButton></Tooltip>}
      {canAdminister && (
        <>
          <Tooltip title="Más acciones"><IconButton aria-label="Más acciones" size="small" onClick={(event) => setAnchor(event.currentTarget)}><MoreVert fontSize="small" /></IconButton></Tooltip>
          <Menu anchorEl={anchor} open={!!anchor} onClose={() => setAnchor(null)}>
            <MenuItem onClick={() => { setAnchor(null); onPassword(user); }}><LockReset fontSize="small" sx={{ mr: 1 }} />Cambiar contraseña</MenuItem>
            {user.is_active ? (
              <MenuItem onClick={() => { setAnchor(null); onArchive(user); }} sx={{ color: "#b3261e" }}><LockOutlined fontSize="small" sx={{ mr: 1 }} />Archivar usuario</MenuItem>
            ) : (
              <MenuItem onClick={() => { setAnchor(null); onRestore(user); }}><LockOpenOutlined fontSize="small" sx={{ mr: 1 }} />Restaurar usuario</MenuItem>
            )}
            {user.can_delete && <MenuItem onClick={() => { setAnchor(null); onDelete(user); }} sx={{ color: "#b3261e" }}><PieChartOutline fontSize="small" sx={{ mr: 1 }} />Eliminar permanentemente</MenuItem>}
          </Menu>
        </>
      )}
    </Box>
  );
}

export default function UsersModule() {
  const router = useRouter();
  const mobile = useMediaQuery("(max-width:767px)");
  const { can, admin, roles: sessionRoles, authReady } = useContext(authContext);
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [access, setAccess] = useState([]);
  const [metrics, setMetrics] = useState({
    total_users: 0,
    active_users: 0,
    active_percentage: 0,
    client_accounts: 0,
    client_association_percentage: 0,
    blocked_users: 0,
    blocked_percentage: 0,
  });
  const [options, setOptions] = useState({ clients: [], users: [], roles: [] });
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("active");
  const [selected, setSelected] = useState([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [profileId, setProfileId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [passwordUser, setPasswordUser] = useState(null);
  const [archiveTarget, setArchiveTarget] = useState(null);
  const [accessForm, setAccessForm] = useState(null);
  const canAdminister = admin || sessionRoles.includes("ADMIN");

  const load = async () => {
    try {
      setLoading(true);
      const [userRows, accessRows, optionRows, metricRows] = await Promise.all([
        getUsers(),
        getClientAccess(),
        getAccessOptions(),
        getUserMetrics(),
      ]);
      setUsers(userRows);
      setAccess(accessRows);
      setOptions(optionRows);
      setMetrics(metricRows);
    } catch (error) {
      toast.error(error.response?.data?.message || "No fue posible cargar usuarios y cuentas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authReady) return;
    if (!can("users.view")) router.replace("/dashboard");
    else load();
    // `can` is derived from auth context and changes identity on each render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authReady]);

  const filteredUsers = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return users.filter((user) => {
      const haystack = `${user.email} ${nameOf(user)} ${(user.roles || []).join(" ")}`.toLowerCase();
      return (!needle || haystack.includes(needle)) &&
        (roleFilter === "all" || (roleFilter === "none" ? !user.roles?.length : user.roles?.includes(roleFilter))) &&
        (statusFilter === "active" ? user.is_active : !user.is_active);
    });
  }, [users, search, roleFilter, statusFilter]);

  const percentageLabel = (value) => Number(value || 0).toLocaleString("es-CO", {
    maximumFractionDigits: 1,
  });

  const closeAndReload = (message) => {
    setCreateOpen(false);
    setEditId(null);
    setPasswordUser(null);
    setArchiveTarget(null);
    toast.success(message);
    load();
  };

  const handleArchive = (user) => {
    setArchiveTarget(null);
    toast.success(
      <Box>
        <Typography variant="body2">Usuario archivado correctamente.</Typography>
        <Button size="small" onClick={() => restoreUser(user.id).then(() => { toast.success("Usuario restaurado."); load(); })}>Deshacer / Restaurar</Button>
      </Box>,
      { autoClose: 8000 }
    );
    load();
  };

  const handleRestore = async (user) => {
    try {
      await restoreUser(user.id);
      toast.success("Usuario restaurado.");
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || "No fue posible restaurar el usuario.");
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`¿Eliminar permanentemente a ${user.email}? Esta acción no se puede deshacer.`)) return;
    try {
      await deleteUser(user.id);
      toast.success("Usuario eliminado permanentemente.");
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || "No fue posible eliminar el usuario.");
    }
  };

  const saveAccess = async () => {
    try {
      const response = await createClientAccess(accessForm);
      setAccessForm(null);
      toast.success(response.data.temporary_password ? `Cuenta creada. Contraseña temporal: ${response.data.temporary_password}` : "Cuenta vinculada correctamente.");
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || "No fue posible vincular la cuenta.");
    }
  };

  const columns = [
    {
      field: "email", headerName: "Usuario", flex: 1.2, minWidth: 240,
      renderCell: ({ row }) => <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}><Avatar src={row.profile_photo || ""} sx={{ width: 36, height: 36, bgcolor: "#dfecef", color: TEAL, fontSize: 14 }}>{initials(row)}</Avatar><Typography variant="body2">{row.email}</Typography></Box>,
    },
    { field: "full_name", headerName: "Nombre", flex: 1, minWidth: 170, valueGetter: ({ row }) => nameOf(row) },
    {
      field: "roles", headerName: "Roles", flex: 1, minWidth: 190, sortable: false,
      renderCell: ({ value }) => <Box sx={{ display: "flex", gap: 0.5, overflow: "hidden" }}>{value?.length ? value.map((role) => <Chip key={role} size="small" label={role} sx={{ bgcolor: "#eef1f3" }} />) : <Chip size="small" label="Sin Rol" variant="outlined" />}</Box>,
    },
    { field: "is_active", headerName: "Estado", width: 130, renderCell: ({ value }) => <StatusBadge active={value} /> },
    {
      field: "actions", headerName: "Acciones", width: 150, sortable: false, align: "right", headerAlign: "right",
      renderCell: ({ row }) => <UserActions user={row} canAdminister={canAdminister} onView={(user) => setProfileId(user.id)} onEdit={(user) => setEditId(user.id)} onPassword={setPasswordUser} onArchive={setArchiveTarget} onRestore={handleRestore} onDelete={handleDelete} />,
    },
  ];

  if (!authReady || loading) return <Box sx={{ p: 7, textAlign: "center" }}><CircularProgress /></Box>;

  return (
    <Box sx={{ bgcolor: "#fff", minHeight: "100%", pb: { xs: 11, md: 3 }, fontFamily: "Inter, Montserrat, sans-serif" }}>
      <ToastContainer position="top-right" autoClose={5000} />
      <PageHeader
        title={mobile ? "Usuarios y Cuentas" : "Usuarios y cuentas de clientes"}
        subtitle="Administra identidades, accesos y cuentas asociadas."
        breadcrumbs={[{ label: "Administración", href: "/administration" }, { label: "Usuarios y Cuentas" }]}
        actions={canAdminister ? <Button variant="contained" startIcon={<PersonAddAlt />} onClick={() => setCreateOpen(true)} sx={{ display: { xs: "none", sm: "inline-flex" }, bgcolor: TEAL, borderRadius: "8px", whiteSpace: "nowrap" }}>Crear Usuario</Button> : null}
      />

      <Box sx={{
        display: "flex",
        gap: 2,
        overflowX: "auto",
        pb: 1,
        mb: 3,
        scrollSnapType: "x mandatory",
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": { display: "none" },
        "& > *": { scrollSnapAlign: "start" },
        "@media (min-width:768px)": { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", overflowX: "visible", scrollSnapType: "none" },
        "@media (min-width:1024px)": { gridTemplateColumns: "repeat(4, minmax(0, 1fr))" },
      }}>
        <Kpi icon={<GroupOutlined />} value={metrics.total_users} label="Total Usuarios Registrados" />
        <Kpi icon={<ShowChart />} value={metrics.active_users} label="Usuarios Activos" detail={`↗ ${percentageLabel(metrics.active_percentage)}% del total`} />
        <Kpi icon={<VerifiedUserOutlined />} value={metrics.client_accounts} label="Cuentas de Clientes" detail={`↗ ${percentageLabel(metrics.client_association_percentage)}% asociadas`} />
        <Kpi icon={<PieChartOutline />} value={metrics.blocked_users} label="Usuarios Inactivos" detail={`↘ ${percentageLabel(metrics.blocked_percentage)}% de incidencia`} detailColor="#d32f2f" />
      </Box>

      <Paper variant="outlined" sx={{ borderColor: "#eaedf1", borderRadius: "8px", overflow: "hidden" }}>
        <Tabs value={tab} onChange={(_, value) => setTab(value)} sx={{ px: { xs: 1, sm: 2 }, borderBottom: "1px solid #eaedf1" }}>
          <Tab label={<Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>Usuarios <Chip size="small" label={users.length} /></Box>} />
          <Tab label={<Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>Cuentas de clientes <Chip size="small" label={access.length} /></Box>} />
        </Tabs>
        {tab === 0 ? (
          <>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0, 1fr) minmax(0, 1fr) 48px", md: "minmax(260px, 1fr) 220px 190px 48px" }, gap: 1.5, p: 2, borderBottom: "1px solid #eaedf1" }}>
              <TextField name="user-list-search" type="search" autoComplete="off" size="small" placeholder="Buscar por email, nombre o rol..." value={search} onChange={(e) => setSearch(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }} sx={{ gridColumn: { xs: "1 / -1", md: "auto" }, "& .MuiOutlinedInput-root": { borderRadius: "999px" } }} />
              <FormControl size="small"><InputLabel id="role-filter-label">Todos los Roles</InputLabel><Select labelId="role-filter-label" label="Todos los Roles" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}><MenuItem value="all">Todos los Roles</MenuItem>{options.roles.map((role) => <MenuItem key={role.code} value={role.code}>{role.code}</MenuItem>)}<MenuItem value="none">Sin Rol</MenuItem></Select></FormControl>
              <Box sx={{ minHeight: 40, px: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 0.25, border: "1px solid #cfd6dc", borderRadius: "8px", bgcolor: "#fff" }}>
                <Switch
                  size="small"
                  checked={statusFilter === "inactive"}
                  onChange={(event) => setStatusFilter(event.target.checked ? "inactive" : "active")}
                  inputProps={{ "aria-label": "Alternar entre usuarios activos e inactivos" }}
                  sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: TEAL }, "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: TEAL } }}
                />
                <Typography variant="body2" sx={{ color: TEAL, fontWeight: 700 }}>{statusFilter === "active" ? "Activos" : "Inactivos"}</Typography>
              </Box>
              <Tooltip title="Refrescar"><IconButton aria-label="Refrescar usuarios" onClick={load} sx={{ border: "1px solid #d7dde2", borderRadius: "8px" }}><Autorenew /></IconButton></Tooltip>
            </Box>
            {mobile ? (
              <Box sx={{ p: 2, bgcolor: "#f7f9fb" }}>
                {filteredUsers.map((user) => (
                  <Paper key={user.id} variant="outlined" sx={{ p: 2, mb: 2, borderColor: "#dfe5ea", borderRadius: "8px", boxShadow: "0 2px 8px rgba(31,45,61,.04)" }}>
                    <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                      <Avatar src={user.profile_photo || ""} sx={{ bgcolor: "#dfecef", color: TEAL }}>{initials(user)}</Avatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}><Typography fontWeight={700}>{nameOf(user)}</Typography><Typography variant="body2" color="text.secondary" noWrap>{user.email}</Typography></Box>
                      <Checkbox size="small" checked={selected.includes(user.id)} onChange={(event) => setSelected((current) => event.target.checked ? [...current, user.id] : current.filter((id) => id !== user.id))} inputProps={{ "aria-label": `Seleccionar ${user.email}` }} />
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1, mt: 1.5, pt: 1.5, borderTop: "1px dashed #dfe5ea" }}>
                      <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>{user.roles?.length ? user.roles.map((role) => <Chip key={role} size="small" label={role} sx={{ bgcolor: "#eef1f3" }} />) : <Chip size="small" label="Sin Rol" sx={{ bgcolor: "#eef1f3" }} />}</Box>
                      <StatusBadge active={user.is_active} />
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", mt: 1 }}>
                      {canAdminister && <Button size="small" onClick={() => setEditId(user.id)} sx={{ color: TEAL, fontWeight: 700 }}>Asignar Roles</Button>}
                      <UserActions user={user} canAdminister={canAdminister} onView={(value) => setProfileId(value.id)} onEdit={(value) => setEditId(value.id)} onPassword={setPasswordUser} onArchive={setArchiveTarget} onRestore={handleRestore} onDelete={handleDelete} />
                    </Box>
                  </Paper>
                ))}
                {!filteredUsers.length && <Typography color="text.secondary" textAlign="center" sx={{ py: 5 }}>No hay usuarios que coincidan con los filtros.</Typography>}
              </Box>
            ) : (
              <Box sx={{ height: 570, width: "100%" }}>
                <DataGrid checkboxSelection disableSelectionOnClick rows={filteredUsers} columns={columns} pageSize={10} rowsPerPageOptions={[10, 25, 50]} selectionModel={selected} onSelectionModelChange={setSelected} sx={{ border: 0, "& .MuiDataGrid-columnHeaders": { bgcolor: "#f8fafb" }, "& .MuiDataGrid-cell:focus": { outline: "none" } }} />
              </Box>
            )}
          </>
        ) : (
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, mb: 2 }}>
              <Typography color="text.secondary">Cuentas de acceso vinculadas a clientes.</Typography>
              {canAdminister && <Button variant="contained" startIcon={<BusinessOutlined />} onClick={() => setAccessForm({ client: "", user: "", status: "ACTIVE" })}>Vincular cuenta</Button>}
            </Box>
            <Box sx={{ overflowX: "auto" }}>
              <Box component="table" sx={{ width: "100%", minWidth: 680, borderCollapse: "collapse", "& th, & td": { p: 1.5, borderBottom: "1px solid #eaedf1", textAlign: "left" }, "& th": { bgcolor: "#f8fafb", color: "text.secondary", fontSize: 12 } }}>
                <thead><tr><th>Cliente</th><th>Cuenta</th><th>Estado</th><th>Acciones</th></tr></thead>
                <tbody>{access.map((item) => <tr key={item.id}><td>{item.client_name}</td><td>{item.user_email}</td><td><StatusBadge active={item.status === "ACTIVE"} /></td><td>{canAdminister && item.status !== "ACTIVE" && <Button size="small" onClick={() => updateClientAccess(item.id, { status: "ACTIVE", blocked_reason: "" }).then(load)}>Activar</Button>}</td></tr>)}</tbody>
              </Box>
            </Box>
          </Box>
        )}
      </Paper>

      {canAdminister && mobile && (
        <Button
          variant="contained"
          startIcon={<PersonAddAlt />}
          onClick={() => setCreateOpen(true)}
          sx={{ position: "fixed", right: 20, bottom: 20, zIndex: 10, bgcolor: TEAL, borderRadius: "999px", px: 2.5, py: 1.25, boxShadow: "0 8px 22px rgba(59,130,142,.35)" }}
        >
          Crear Usuario
        </Button>
      )}

      <CreateUserModal open={createOpen} roles={options.roles} onClose={() => setCreateOpen(false)} onSaved={(response) => closeAndReload(`Usuario creado. Contraseña temporal: ${response.temporary_password}`)} notifyError={toast.error} />
      <EditUserModal userId={editId} roles={options.roles} onClose={() => setEditId(null)} onSaved={() => closeAndReload("Usuario actualizado correctamente.")} notifyError={toast.error} />
      <PasswordModal user={passwordUser} onClose={() => setPasswordUser(null)} onSaved={() => closeAndReload("Contraseña actualizada y sesiones cerradas.")} notifyError={toast.error} />
      <UserProfileModal userId={profileId} onClose={() => setProfileId(null)} notifyError={toast.error} />
      <ArchiveUserModal user={archiveTarget} onClose={() => setArchiveTarget(null)} onSaved={handleArchive} notifyError={toast.error} />

      <Dialog open={!!accessForm} onClose={() => setAccessForm(null)} fullWidth maxWidth="sm">
        <DialogTitle>Cuenta de acceso para cliente</DialogTitle>
        <DialogContent>
          {accessForm && <>
            <FormControl fullWidth sx={{ mt: 2 }}><InputLabel id="client-link-label">Cliente</InputLabel><Select labelId="client-link-label" label="Cliente" value={accessForm.client} onChange={(e) => setAccessForm({ ...accessForm, client: e.target.value })}>{options.clients.map((client) => <MenuItem key={client.id} value={client.id}>{client.name} - {client.document_number}</MenuItem>)}</Select></FormControl>
            <FormControl fullWidth sx={{ mt: 2 }}><InputLabel id="user-link-label">Cuenta de usuario</InputLabel><Select labelId="user-link-label" label="Cuenta de usuario" value={accessForm.user} onChange={(e) => setAccessForm({ ...accessForm, user: e.target.value })}><MenuItem value=""><em>Crear usuario con el correo del cliente</em></MenuItem>{options.users.map((user) => <MenuItem key={user.id} value={user.id}>{user.email} - {user.first_name} {user.last_name}</MenuItem>)}</Select></FormControl>
            <Alert severity="info" sx={{ mt: 2 }}>Si no seleccionas un usuario, se creará una cuenta con el correo del cliente y se mostrará una contraseña temporal una sola vez.</Alert>
          </>}
        </DialogContent>
        <DialogActions><Button onClick={() => setAccessForm(null)}>Cancelar</Button><Button variant="contained" disabled={!accessForm?.client} onClick={saveAccess}>Crear vínculo</Button></DialogActions>
      </Dialog>
    </Box>
  );
}
