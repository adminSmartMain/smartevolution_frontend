import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  Link,
  MenuItem,
  Select,
  Skeleton,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import AddAPhotoOutlined from "@mui/icons-material/AddAPhotoOutlined";
import ArchiveOutlined from "@mui/icons-material/ArchiveOutlined";
import CheckCircle from "@mui/icons-material/CheckCircle";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";
import Close from "@mui/icons-material/Close";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import EditOutlined from "@mui/icons-material/EditOutlined";
import LockReset from "@mui/icons-material/LockReset";
import PersonAddAlt from "@mui/icons-material/PersonAddAlt";
import PersonOutline from "@mui/icons-material/PersonOutline";
import RadioButtonUnchecked from "@mui/icons-material/RadioButtonUnchecked";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  archiveUser,
  changeUserPassword,
  createUser,
  getUser,
  getUserOperations,
  updateUser,
} from "./queries";

const TEAL = "#3b828e";
const MAX_PHOTO_SIZE = 5 * 1024 * 1024;
const ACCEPTED_PHOTO_TYPES = ["image/png", "image/jpeg", "image/webp"];
const emptyUser = {
  email: "",
  first_name: "",
  last_name: "",
  phone_number: "",
  profile_photo: "",
  roles: [],
  organization: "",
  description: "",
  is_active: true,
};

const fullName = (user) =>
  `${user?.first_name || ""} ${user?.last_name || ""}`.trim() || "Usuario sin nombre";

const initials = (user) =>
  `${user?.first_name?.[0] || ""}${user?.last_name?.[0] || ""}`.toUpperCase() ||
  user?.email?.[0]?.toUpperCase() ||
  "U";

const readPhoto = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const dialogPaper = (mobile, maxWidth) => ({
  maxWidth,
  width: mobile ? "100%" : `min(${maxWidth}px, calc(100% - 32px))`,
  m: mobile ? 0 : 2,
  position: mobile ? "fixed" : "relative",
  bottom: mobile ? 0 : "auto",
  borderRadius: mobile ? "20px 20px 0 0" : "8px",
  maxHeight: mobile ? "92vh" : "calc(100vh - 48px)",
});

function DragHandle({ mobile }) {
  if (!mobile) return null;
  return <Box sx={{ width: 42, height: 4, borderRadius: 2, bgcolor: "#c4cbd2", mx: "auto", mt: 1 }} />;
}

function ModalTitle({ icon, title, onClose }) {
  return (
    <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1, pr: 6, py: 1.75, borderBottom: "1px solid #e7ebef" }}>
      {icon}
      <Typography component="span" fontSize={17} fontWeight={700}>{title}</Typography>
      <IconButton aria-label="Cerrar" onClick={onClose} sx={{ position: "absolute", right: 12, top: 10 }}>
        <Close />
      </IconButton>
    </DialogTitle>
  );
}

function AvatarEditor({ form, setForm, setError }) {
  const inputRef = useRef(null);
  const selectPhoto = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!ACCEPTED_PHOTO_TYPES.includes(file.type)) {
      setError("La foto debe ser PNG, JPG, JPEG o WEBP.");
      return;
    }
    if (file.size > MAX_PHOTO_SIZE) {
      setError("La foto no puede superar 5 MB.");
      return;
    }
    setError("");
    setForm({ ...form, profile_photo: await readPhoto(file) });
  };
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
      <Avatar src={form.profile_photo || ""} sx={{ width: 58, height: 58, bgcolor: "#f4f7fa", color: "#718096", border: "1px dashed #aebbc7", fontWeight: 700 }}>
        {form.profile_photo ? null : (form.first_name || form.last_name || form.email ? initials(form) : <AddAPhotoOutlined />)}
      </Avatar>
      <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", columnGap: 1.5, rowGap: 0.75, mt: 1 }}>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          <Button variant="outlined" startIcon={<AddAPhotoOutlined />} onClick={() => inputRef.current?.click()}>
            {form.profile_photo ? "Reemplazar foto" : "Subir foto"}
          </Button>
          {form.profile_photo && (
            <Tooltip title="Eliminar foto">
              <IconButton aria-label="Eliminar foto" color="error" onClick={() => setForm({ ...form, profile_photo: "" })}>
                <DeleteOutline />
              </IconButton>
            </Tooltip>
          )}
        </Box>
        <input ref={inputRef} hidden type="file" accept=".png,.jpg,.jpeg,.webp" onChange={selectPhoto} />
        <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
          PNG, JPG o WEBP, máximo 5 MB.
        </Typography>
      </Box>
    </Box>
  );
}

const compactFieldSx = {
  "& .MuiOutlinedInput-root": { minHeight: 40, borderRadius: "7px" },
  "& .MuiInputBase-input": { py: 1.05 },
};

function FieldLabel({ children, required = false }) {
  return (
    <Typography component="label" variant="caption" sx={{ display: "block", mb: 0.55, color: "#657386", fontWeight: 700, textTransform: "uppercase" }}>
      {children}{required ? " *" : ""}
    </Typography>
  );
}

function UserFormFields({ form, setForm, roles, errors = {}, editing = false }) {
  return (
    <>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1.5 }}>
        <Box><FieldLabel required>Nombres</FieldLabel><TextField id="user-first-name" fullWidth size="small" placeholder="Ej. Jhon" value={form.first_name} error={!!errors.first_name} helperText={errors.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} sx={compactFieldSx} /></Box>
        <Box><FieldLabel required>Apellidos</FieldLabel><TextField id="user-last-name" fullWidth size="small" placeholder="Ej. Doe" value={form.last_name} error={!!errors.last_name} helperText={errors.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} sx={compactFieldSx} /></Box>
        <Box><FieldLabel required>Correo electrónico</FieldLabel><TextField id="user-email" fullWidth size="small" type="email" placeholder="usuario@empresa.com" value={form.email} error={!!errors.email} helperText={errors.email} onChange={(e) => setForm({ ...form, email: e.target.value })} sx={compactFieldSx} /></Box>
        <Box><FieldLabel>Teléfono</FieldLabel><TextField id="user-phone" fullWidth size="small" type="tel" placeholder="+57 (300) 000-0000" value={form.phone_number} onChange={(e) => setForm({ ...form, phone_number: e.target.value })} sx={compactFieldSx} /></Box>
        <Box>
          <FieldLabel required>Rol asignado</FieldLabel>
          <FormControl fullWidth size="small" error={!!errors.roles} sx={compactFieldSx}>
            <Select displayEmpty value={form.roles[0] || ""} onChange={(e) => setForm({ ...form, roles: e.target.value ? [e.target.value] : [] })}>
              <MenuItem value=""><em>Seleccione un rol</em></MenuItem>
              {roles.filter((role) => role.state !== false).map((role) => <MenuItem key={role.code} value={role.code}>{role.name}</MenuItem>)}
            </Select>
          </FormControl>
          {errors.roles && <Typography variant="caption" color="error">{errors.roles}</Typography>}
        </Box>
        {editing && (
          <Box>
            <FieldLabel required>Estado de la cuenta</FieldLabel>
            <FormControl fullWidth size="small" sx={compactFieldSx}>
              <Select value={form.is_active ? "active" : "inactive"} onChange={(e) => setForm({ ...form, is_active: e.target.value === "active" })}>
                <MenuItem value="active">Activo</MenuItem>
                <MenuItem value="inactive">Inactivo / Suspendido</MenuItem>
              </Select>
            </FormControl>
          </Box>
        )}
        <Box sx={{ gridColumn: editing ? { sm: "1 / -1" } : "auto" }}>
          <FieldLabel>Empresa / Organización</FieldLabel>
          <TextField id="user-organization" fullWidth size="small" placeholder="Ej. Smart Evolution" value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} sx={compactFieldSx} />
        </Box>
      </Box>
      <Box sx={{ mt: 1.5 }}>
        <FieldLabel>Notas internas</FieldLabel>
        <TextField id="user-notes" fullWidth multiline minRows={3} placeholder="Observaciones o notas administrativas iniciales..." value={form.description} inputProps={{ maxLength: 1000 }} onChange={(e) => setForm({ ...form, description: e.target.value })} sx={{ ...compactFieldSx, "& textarea": { lineHeight: 1.45 } }} />
      </Box>
    </>
  );
}

function validateUser(form) {
  const errors = {};
  if (!form.first_name.trim()) errors.first_name = "Los nombres son obligatorios.";
  if (!form.last_name.trim()) errors.last_name = "Los apellidos son obligatorios.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errors.email = "Ingresa un correo válido.";
  if (!form.roles.length) errors.roles = "Selecciona al menos un rol.";
  return errors;
}

export function CreateUserModal({ open, roles, onClose, onSaved, notifyError }) {
  const mobile = useMediaQuery("(max-width:580px)");
  const [form, setForm] = useState(emptyUser);
  const [errors, setErrors] = useState({});
  const [photoError, setPhotoError] = useState("");
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    if (open) {
      setForm({ ...emptyUser, roles: [] });
      setErrors({});
      setPhotoError("");
    }
  }, [open]);
  const dirty = JSON.stringify(form) !== JSON.stringify(emptyUser);
  const close = () => {
    if (dirty && !window.confirm("Hay datos sin guardar. ¿Deseas descartarlos?")) return;
    onClose();
  };
  const save = async () => {
    const nextErrors = validateUser(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    try {
      setSaving(true);
      const response = await createUser(form);
      onSaved(response);
    } catch (error) {
      notifyError(error.response?.data?.message || "No fue posible crear el usuario.");
    } finally {
      setSaving(false);
    }
  };
  return (
    <Dialog open={open} onClose={(_, reason) => reason !== "backdropClick" && close()} fullWidth PaperProps={{ sx: dialogPaper(mobile, 570) }}>
      <DragHandle mobile={mobile} />
      <ModalTitle icon={<PersonAddAlt sx={{ color: TEAL }} />} title="Crear Nuevo Usuario" onClose={close} />
      <DialogContent sx={{ p: { xs: 2, sm: 2.25 } }}>
        {photoError && <Alert severity="error" sx={{ mb: 2 }}>{photoError}</Alert>}
        <AvatarEditor form={form} setForm={setForm} setError={setPhotoError} />
        <UserFormFields form={form} setForm={setForm} roles={roles} errors={errors} />
      </DialogContent>
      <DialogActions sx={{ p: 2, borderTop: "1px solid #e7ebef", "& > :not(style) ~ :not(style)": { ml: 1 }, "& .MuiButton-root": { flex: { xs: 1, sm: "initial" } } }}>
        <Button variant="outlined" color="inherit" onClick={close}>Cancelar</Button>
        <Button variant="contained" onClick={save} disabled={saving || Object.keys(validateUser(form)).length > 0} startIcon={saving ? <CircularProgress size={16} color="inherit" /> : null} sx={{ bgcolor: TEAL }}>
          Crear Usuario
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export function EditUserModal({ userId, roles, onClose, onSaved, notifyError }) {
  const mobile = useMediaQuery("(max-width:640px)");
  const [form, setForm] = useState(null);
  const [original, setOriginal] = useState(null);
  const [errors, setErrors] = useState({});
  const [photoError, setPhotoError] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    getUser(userId)
      .then((user) => {
        const value = {
          ...emptyUser,
          ...user,
          phone_number: user.phone_number || "",
          profile_photo: user.profile_photo || "",
          organization: user.organization || "",
          description: user.description || "",
          roles: user.roles || [],
        };
        setForm(value);
        setOriginal(value);
      })
      .catch(() => notifyError("No fue posible cargar la información actual del usuario."))
      .finally(() => setLoading(false));
  }, [userId, notifyError]);
  const dirty = !!form && !!original && JSON.stringify(form) !== JSON.stringify(original);
  const close = () => {
    if (dirty && !window.confirm("Hay cambios sin guardar. ¿Deseas descartarlos?")) return;
    onClose();
  };
  const save = async () => {
    const nextErrors = validateUser(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    try {
      setSaving(true);
      const response = await updateUser(userId, form);
      onSaved(response.data.data);
    } catch (error) {
      notifyError(error.response?.data?.message || "No fue posible actualizar el usuario.");
    } finally {
      setSaving(false);
    }
  };
  return (
    <Dialog open={!!userId} onClose={(_, reason) => reason !== "backdropClick" && close()} fullWidth PaperProps={{ sx: dialogPaper(mobile, 560) }}>
      <DragHandle mobile={mobile} />
      <ModalTitle icon={<EditOutlined sx={{ color: TEAL }} />} title="Editar Usuario" onClose={close} />
      <DialogContent sx={{ p: { xs: 2, sm: 2.25 } }}>
        {loading || !form ? (
          <Box><Skeleton variant="circular" width={76} height={76} /><Skeleton height={56} sx={{ mt: 2 }} /><Skeleton height={56} /><Skeleton height={120} /></Box>
        ) : (
          <>
            {photoError && <Alert severity="error" sx={{ mb: 2 }}>{photoError}</Alert>}
            <AvatarEditor form={form} setForm={setForm} setError={setPhotoError} />
            <UserFormFields form={form} setForm={setForm} roles={roles} errors={errors} editing />
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2, borderTop: "1px solid #e7ebef", "& .MuiButton-root": { flex: { xs: 1, sm: "initial" } } }}>
        <Button variant="outlined" color="inherit" onClick={close}>Cancelar</Button>
        <Button variant="contained" onClick={save} disabled={!dirty || saving || !form || Object.keys(validateUser(form || emptyUser)).length > 0} startIcon={saving ? <CircularProgress size={16} color="inherit" /> : null} sx={{ bgcolor: TEAL }}>
          Guardar Cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export function PasswordModal({ user, onClose, onSaved, notifyError }) {
  const mobile = useMediaQuery("(max-width:640px)");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    if (user) {
      setPassword("");
      setConfirmation("");
      setShowPassword(false);
      setShowConfirmation(false);
    }
  }, [user]);
  const rules = [
    ["Mínimo 8 caracteres", password.length >= 8],
    ["Al menos una letra mayúscula", /[A-Z]/.test(password)],
    ["Al menos un número", /\d/.test(password)],
    ["Las contraseñas coinciden", !!confirmation && password === confirmation],
  ];
  const valid = rules.every((rule) => rule[1]);
  const save = async () => {
    try {
      setSaving(true);
      await changeUserPassword(user.id, { new_password: password, confirm_password: confirmation });
      onSaved();
    } catch (error) {
      notifyError(error.response?.data?.message || "No fue posible actualizar la contraseña.");
    } finally {
      setSaving(false);
    }
  };
  const passwordAdornment = (visible, toggle, label) => (
    <InputAdornment position="end">
      <IconButton aria-label={visible ? `Ocultar ${label}` : `Mostrar ${label}`} onClick={toggle} edge="end">
        {visible ? <VisibilityOff /> : <Visibility />}
      </IconButton>
    </InputAdornment>
  );
  return (
    <Dialog open={!!user} onClose={onClose} fullWidth PaperProps={{ sx: dialogPaper(mobile, 460) }}>
      <DragHandle mobile={mobile} />
      <ModalTitle icon={<LockReset sx={{ color: TEAL }} />} title="Cambiar Contraseña" onClose={onClose} />
      <DialogContent dividers>
        <Typography color="text.secondary" sx={{ mb: 2 }}>{fullName(user)}</Typography>
        <Box component="input" name="username" autoComplete="username" value={user?.email || ""} readOnly aria-hidden="true" tabIndex={-1} sx={{ position: "absolute", width: 1, height: 1, opacity: 0, pointerEvents: "none" }} />
        <TextField autoFocus fullWidth name="new-password" autoComplete="new-password" label="Nueva contraseña" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} InputProps={{ endAdornment: passwordAdornment(showPassword, () => setShowPassword((value) => !value), "contraseña") }} />
        <TextField fullWidth name="confirm-new-password" autoComplete="new-password" label="Confirmar nueva contraseña" type={showConfirmation ? "text" : "password"} value={confirmation} onChange={(e) => setConfirmation(e.target.value)} sx={{ mt: 2 }} InputProps={{ endAdornment: passwordAdornment(showConfirmation, () => setShowConfirmation((value) => !value), "confirmación") }} />
        <Box sx={{ my: 2 }}>
          {rules.map(([label, met]) => (
            <Box key={label} sx={{ display: "flex", alignItems: "center", gap: 1, color: met ? "#2e7d32" : "text.secondary", mb: 0.75 }}>
              {met ? <CheckCircle fontSize="small" /> : <RadioButtonUnchecked fontSize="small" />}
              <Typography variant="body2">{label}</Typography>
            </Box>
          ))}
        </Box>
        <Alert severity="info">El cambio cerrará las sesiones activas del usuario en otros dispositivos.</Alert>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" disabled={!valid || saving} onClick={save} startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <LockReset />}>Actualizar Contraseña</Button>
      </DialogActions>
    </Dialog>
  );
}

function formatDate(value) {
  if (!value) return "Sin registro";
  return new Intl.DateTimeFormat("es-CO", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(value));
}

function formatMoney(value) {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(value || 0);
}

export function UserProfileModal({ userId, onClose, notifyError }) {
  const mobile = useMediaQuery("(max-width:640px)");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [operationTab, setOperationTab] = useState("pending");
  const [operationPage, setOperationPage] = useState(1);
  const [operations, setOperations] = useState({ results: [], total: 0, counts: { pending: 0, approved: 0 }, page_size: 5 });
  const [operationsLoading, setOperationsLoading] = useState(false);
  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    setOperationTab("pending");
    setOperationPage(1);
    getUser(userId).then(setUser).catch(() => notifyError("No fue posible cargar el perfil.")).finally(() => setLoading(false));
  }, [userId, notifyError]);
  useEffect(() => {
    if (!userId) return;
    setOperationsLoading(true);
    getUserOperations(userId, operationTab, operationPage, 5)
      .then(setOperations)
      .catch(() => notifyError("No fue posible cargar las operaciones del usuario."))
      .finally(() => setOperationsLoading(false));
  }, [userId, operationTab, operationPage, notifyError]);
  const start = operations.total ? (operationPage - 1) * operations.page_size + 1 : 0;
  const end = Math.min(operationPage * operations.page_size, operations.total);
  const lastPage = Math.max(Math.ceil(operations.total / operations.page_size), 1);
  return (
    <Dialog open={!!userId} onClose={onClose} fullWidth PaperProps={{ sx: dialogPaper(mobile, 850) }}>
      <DragHandle mobile={mobile} />
      <ModalTitle icon={<PersonOutline sx={{ color: TEAL }} />} title="Perfil de Usuario" onClose={onClose} />
      <DialogContent dividers sx={{ p: { xs: 2, sm: 3 } }}>
        {loading || !user ? <Box><Skeleton variant="circular" width={88} height={88} /><Skeleton height={42} width="45%" /><Skeleton height={160} /></Box> : (
          <>
            <Box sx={{ display: "flex", alignItems: { xs: "flex-start", sm: "center" }, flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
              <Avatar src={user.profile_photo || ""} sx={{ width: 88, height: 88, bgcolor: "#dfecef", color: TEAL, fontSize: 28, fontWeight: 700 }}>{initials(user)}</Avatar>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 1 }}>
                  <Typography variant="h5" fontWeight={700}>{fullName(user)}</Typography>
                  <Chip size="small" label={user.is_active ? "Activo" : "Inactivo"} sx={{ bgcolor: user.is_active ? "#e8f5e9" : "#ffebee", color: user.is_active ? "#2e7d32" : "#d32f2f", fontWeight: 700 }} />
                </Box>
                <Typography color="text.secondary">{user.roles?.length ? user.roles.join(", ") : "Sin rol asignado"}</Typography>
              </Box>
            </Box>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" }, gap: 2, py: 3 }}>
              <Box><Typography variant="caption" color="text.secondary">Empresa</Typography><Typography>{user.company || "Sin empresa asociada"}</Typography></Box>
              <Box><Typography variant="caption" color="text.secondary">Creación de cuenta</Typography><Typography>{formatDate(user.date_joined)}</Typography></Box>
              <Box><Typography variant="caption" color="text.secondary">Estado administrativo</Typography><Typography>{user.archived_at ? `Archivado el ${formatDate(user.archived_at)}` : "Disponible"}</Typography></Box>
            </Box>
            <Divider />
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2, py: 3 }}>
              <Box><Typography variant="caption" color="text.secondary">Correo principal</Typography><Link display="block" href={`mailto:${user.email}`} color="#25616b">{user.email}</Link></Box>
              <Box><Typography variant="caption" color="text.secondary">Teléfono principal</Typography>{user.phone_number ? <Link display="block" href={`tel:${user.phone_number}`} color="#25616b">{user.phone_number}</Link> : <Typography>Sin teléfono</Typography>}</Box>
            </Box>
            <Box sx={{ mb: 3 }}><Typography fontWeight={700} sx={{ mb: 0.5 }}>Notas internas</Typography><Typography color="text.secondary" sx={{ whiteSpace: "pre-wrap" }}>{user.description || "Sin notas internas."}</Typography></Box>
            <Typography fontWeight={700}>Operaciones creadas por el usuario</Typography>
            <Tabs value={operationTab} onChange={(_, value) => { setOperationTab(value); setOperationPage(1); }} sx={{ borderBottom: "1px solid #eaedf1" }}>
              <Tab value="pending" label={`Por Aprobar (${operations.counts.pending || 0})`} />
              <Tab value="approved" label={`Aprobadas (${operations.counts.approved || 0})`} />
            </Tabs>
            <Box sx={{ overflowX: "auto", minHeight: 210 }}>
              {operationsLoading ? <Box sx={{ p: 3 }}><Skeleton height={42} /><Skeleton height={42} /><Skeleton height={42} /></Box> : (
                <Box component="table" sx={{ borderCollapse: "collapse", width: "100%", minWidth: 650, "& th, & td": { textAlign: "left", p: 1.5, borderBottom: "1px solid #eaedf1" }, "& th": { color: "text.secondary", fontSize: 12 } }}>
                  <thead><tr><th>ID</th><th>Fecha Op</th><th>Emisor</th><th>Valor Nominal</th><th>Estado</th></tr></thead>
                  <tbody>
                    {operations.results.length ? operations.results.map((operation) => (
                      <tr key={operation.id}><td>{operation.operation_id}</td><td>{formatDate(operation.date)}</td><td>{operation.emitter}</td><td>{formatMoney(operation.nominal_value)}</td><td><Chip size="small" label={operation.status} /></td></tr>
                    )) : <tr><td colSpan={5}>No hay operaciones en este estado.</td></tr>}
                  </tbody>
                </Box>
              )}
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 1, mt: 1 }}>
              <Typography variant="body2" color="text.secondary">Mostrando {start} a {end} de {operations.total} operaciones</Typography>
              <Box>
                <IconButton aria-label="Página anterior" disabled={operationPage === 1} onClick={() => setOperationPage((page) => page - 1)}><ChevronLeft /></IconButton>
                <IconButton aria-label="Página siguiente" disabled={operationPage >= lastPage} onClick={() => setOperationPage((page) => page + 1)}><ChevronRight /></IconButton>
              </Box>
            </Box>
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2 }}><Button onClick={onClose}>Cerrar</Button></DialogActions>
    </Dialog>
  );
}

export function ArchiveUserModal({ user, onClose, onSaved, notifyError }) {
  const mobile = useMediaQuery("(max-width:640px)");
  const [saving, setSaving] = useState(false);
  const save = async () => {
    try {
      setSaving(true);
      await archiveUser(user.id);
      onSaved(user);
    } catch (error) {
      notifyError(error.response?.data?.message || "No fue posible archivar el usuario.");
    } finally {
      setSaving(false);
    }
  };
  return (
    <Dialog open={!!user} onClose={(_, reason) => reason !== "backdropClick" && !saving && onClose()} fullWidth PaperProps={{ sx: dialogPaper(mobile, 520) }}>
      <DragHandle mobile={mobile} />
      <ModalTitle icon={<ArchiveOutlined sx={{ color: "#db8200" }} />} title="Archivar Usuario" onClose={saving ? undefined : onClose} />
      <DialogContent sx={{ px: { xs: 2, sm: 3.25 }, py: 2.5 }}>
        <Avatar sx={{ width: 68, height: 68, mx: "auto", mb: 2, bgcolor: "#fff8e8", color: "#db8200", border: "1px solid #f6e4b8" }}>
          <ArchiveOutlined sx={{ fontSize: 36 }} />
        </Avatar>
        <Typography textAlign="center" color="text.secondary" sx={{ mb: 2.25 }}>
          ¿Estás seguro de que deseas archivar a este usuario? El acceso a la plataforma será suspendido de inmediato.
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 1.5, bgcolor: "#f8fafb", border: "1px solid #e1e7ec", borderRadius: "8px" }}>
          <Avatar src={user?.profile_photo || ""}>{initials(user)}</Avatar>
          <Box sx={{ minWidth: 0 }}><Typography fontWeight={700}>{fullName(user)}</Typography><Typography variant="body2" color="text.secondary" noWrap>{user?.email}</Typography></Box>
        </Box>
        <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 2.25 }}>
          <Box component="span" sx={{ color: "text.primary", fontWeight: 700 }}>Nota: </Box>
          Esta acción no elimina la información ni los registros históricos. El usuario podrá ser restaurado posteriormente por un administrador.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2, borderTop: "1px solid #e7ebef", justifyContent: "flex-end", "& .MuiButton-root": { flex: { xs: 1, sm: "initial" } } }}>
        <Button variant="outlined" color="inherit" onClick={onClose} disabled={saving}>Cancelar</Button>
        <Button variant="contained" disabled={saving} onClick={save} startIcon={saving ? <CircularProgress size={16} color="inherit" /> : null} sx={{ bgcolor: "#e88900", "&:hover": { bgcolor: "#cf7800" } }}>Archivar Usuario</Button>
      </DialogActions>
    </Dialog>
  );
}
