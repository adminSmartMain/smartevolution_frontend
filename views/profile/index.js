import { useContext, useEffect, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import authContext from "@context/authContext";
import { getProfile, updateProfile } from "./queries";

const fileToDataUrl = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
  reader.readAsDataURL(file);
});

const emptyForm = {
  first_name: "",
  last_name: "",
  email: "",
  phone_number: "",
  profile_photo: "",
};

const emptyPasswordForm = {
  current_password: "",
  new_password: "",
  confirm_password: "",
};

const getErrorMessage = (err, fallback) => {
  const responseMessage = err.response?.data?.message || err.response?.data?.profile_photo || fallback;
  return Array.isArray(responseMessage) ? responseMessage.join(" ") : String(responseMessage);
};

export default function ProfileView() {
  const { user, setSessionUser } = useContext(authContext);
  const [form, setForm] = useState(emptyForm);
  const [passwordForm, setPasswordForm] = useState(emptyPasswordForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [editing, setEditing] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [notice, setNotice] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getProfile();
      setForm({ ...emptyForm, ...data });
    } catch (err) {
      setError(getErrorMessage(err, "No fue posible cargar tu perfil."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const setField = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const setPasswordField = (field, value) => setPasswordForm((current) => ({ ...current, [field]: value }));

  const closePasswordModal = () => {
    setPasswordModalOpen(false);
    setPasswordError("");
    setPasswordForm(emptyPasswordForm);
  };

  const saveProfile = async () => {
    try {
      setSaving(true);
      setError("");
      setNotice("");
      const data = await updateProfile({
        first_name: form.first_name,
        last_name: form.last_name,
        phone_number: form.phone_number,
        profile_photo: form.profile_photo,
      });
      setForm({ ...emptyForm, ...data });
      setSessionUser?.({ ...user, name: `${data.first_name || ""} ${data.last_name || ""}`.trim() || data.email, profile_photo: data.profile_photo || "" });
      setEditing(false);
      setNotice("Perfil actualizado correctamente.");
    } catch (err) {
      setError(getErrorMessage(err, "No fue posible actualizar tu perfil."));
    } finally {
      setSaving(false);
    }
  };

  const savePassword = async () => {
    try {
      setSavingPassword(true);
      setPasswordError("");
      setNotice("");
      await updateProfile(passwordForm);
      closePasswordModal();
      setNotice("Contraseña actualizada correctamente.");
    } catch (err) {
      setPasswordError(getErrorMessage(err, "No fue posible actualizar la contraseña."));
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) return <Box sx={{ p: 6, textAlign: "center" }}><CircularProgress /></Box>;

  const initials = `${form.first_name || form.email || "U"}`.charAt(0).toUpperCase();

  return (
    <Box sx={{ maxWidth: 980, mx: "auto", width: "100%" }}>
      {error && <Alert severity="error" onClose={() => setError("")} sx={{ mb: 2 }}>{error}</Alert>}
      {notice && <Alert severity="success" onClose={() => setNotice("")} sx={{ mb: 2 }}>{notice}</Alert>}

      <Paper sx={{ p: { xs: 2, md: 4 } }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={4} alignItems={{ xs: "flex-start", md: "center" }}>
          <Avatar src={form.profile_photo || ""} sx={{ width: 112, height: 112, bgcolor: "#488B8F", fontSize: 42 }}>
            {initials}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5">{`${form.first_name || ""} ${form.last_name || ""}`.trim() || form.email}</Typography>
            <Typography color="text.secondary">{form.email}</Typography>
            {editing && (
              <Box sx={{ mt: 2 }}>
                <Button variant="outlined" component="label">
                  Cambiar foto
                  <input hidden accept="image/png,image/jpeg,image/webp" type="file" onChange={async (event) => {
                    const file = event.target.files?.[0];
                    if (!file) return;
                    setField("profile_photo", await fileToDataUrl(file));
                  }} />
                </Button>
                {form.profile_photo && <Button sx={{ ml: 1 }} onClick={() => setField("profile_photo", "")}>Quitar foto</Button>}
              </Box>
            )}
          </Box>
          <Stack direction={{ xs: "row", md: "column" }} spacing={1}>
            <Button variant={editing ? "outlined" : "contained"} onClick={() => setEditing((value) => !value)}>
              {editing ? "Cancelar edición" : "Editar perfil"}
            </Button>
            <Button variant="text" onClick={() => setPasswordModalOpen(true)}>
              Cambiar contraseña
            </Button>
          </Stack>
        </Stack>

        <Divider sx={{ my: 4 }} />

        <Stack spacing={2}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField fullWidth label="Nombres" value={form.first_name || ""} disabled={!editing} onChange={(event) => setField("first_name", event.target.value)} />
            <TextField fullWidth label="Apellidos" value={form.last_name || ""} disabled={!editing} onChange={(event) => setField("last_name", event.target.value)} />
          </Stack>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField fullWidth label="Correo" value={form.email || ""} disabled />
            <TextField fullWidth label="Teléfono" value={form.phone_number || ""} disabled={!editing} onChange={(event) => setField("phone_number", event.target.value)} />
          </Stack>

          {editing && (
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
              <Button disabled={saving} onClick={() => { setEditing(false); load(); }}>Descartar</Button>
              <Button variant="contained" disabled={saving} onClick={saveProfile}>{saving ? "Guardando..." : "Guardar cambios"}</Button>
            </Box>
          )}
        </Stack>
      </Paper>

      <Dialog open={passwordModalOpen} onClose={closePasswordModal} fullWidth maxWidth="sm">
        <DialogTitle>Cambiar contraseña</DialogTitle>
        <DialogContent>
          {passwordError && <Alert severity="error" sx={{ mb: 2 }}>{passwordError}</Alert>}
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField fullWidth type="password" label="Contraseña actual" value={passwordForm.current_password} onChange={(event) => setPasswordField("current_password", event.target.value)} />
            <TextField fullWidth type="password" label="Nueva contraseña" value={passwordForm.new_password} onChange={(event) => setPasswordField("new_password", event.target.value)} />
            <TextField fullWidth type="password" label="Confirmar contraseña" value={passwordForm.confirm_password} onChange={(event) => setPasswordField("confirm_password", event.target.value)} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closePasswordModal}>Cancelar</Button>
          <Button
            variant="contained"
            disabled={savingPassword || !passwordForm.current_password || !passwordForm.new_password || !passwordForm.confirm_password}
            onClick={savePassword}
          >
            {savingPassword ? "Actualizando..." : "Actualizar contraseña"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
