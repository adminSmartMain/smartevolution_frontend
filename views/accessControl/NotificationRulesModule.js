import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  MenuItem,
  Paper,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import {
  getNotificationRuleOptions,
  getNotificationRules,
  updateNotificationRule,
} from "./queries";

const recipientSummary = (rule) => {
  const parts = [];

  if (rule.permission_code) {
    parts.push(`Permiso: ${rule.permission_code}`);
  }

  if (rule.include_entity_creator) {
    parts.push("Creador de la entidad");
  }

  if (rule.role_names?.length) {
    parts.push(`${rule.role_names.length} rol(es)`);
  }

  if (rule.include_user_ids?.length) {
    parts.push(`${rule.include_user_ids.length} usuario(s)`);
  }

  if (rule.exclude_user_ids?.length) {
    parts.push(`${rule.exclude_user_ids.length} excluido(s)`);
  }

  return parts.length ? parts.join(" · ") : "Sin destinatarios";
};

export default function NotificationRulesModule() {
  const [rules, setRules] = useState([]);
  const [options, setOptions] = useState({
    roles: [],
    users: [],
    permissions: [],
  });
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const [ruleRows, optionRows] = await Promise.all([
        getNotificationRules(),
        getNotificationRuleOptions(),
      ]);
      setRules(ruleRows);
      setOptions(optionRows);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "No fue posible cargar las reglas de notificación."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const permissionOptions = useMemo(
    () =>
      [...(options.permissions || [])].sort((a, b) =>
        a.code.localeCompare(b.code)
      ),
    [options.permissions]
  );

  const columns = [
    {
      field: "label",
      headerName: "Evento",
      flex: 1,
      minWidth: 240,
      renderCell: ({ row }) => (
        <Box>
          <Typography variant="body2" fontWeight={700}>
            {row.label}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.event_type}
          </Typography>
        </Box>
      ),
    },
    {
      field: "enabled",
      headerName: "Estado",
      width: 120,
      renderCell: ({ value }) => (
        <Chip
          size="small"
          color={value ? "success" : "default"}
          label={value ? "Activa" : "Desactivada"}
        />
      ),
    },
    {
      field: "routing",
      headerName: "Destinatarios",
      flex: 1.3,
      minWidth: 320,
      valueGetter: ({ row }) => recipientSummary(row),
      renderCell: ({ row }) => (
        <Typography variant="body2">
          {recipientSummary(row)}
        </Typography>
      ),
    },
    {
      field: "actions",
      headerName: "",
      width: 110,
      renderCell: ({ row }) => (
        <Button
          size="small"
          onClick={() =>
            setEditing({
              ...row,
              role_ids: [...(row.role_ids || [])],
              include_user_ids: [...(row.include_user_ids || [])],
              exclude_user_ids: [...(row.exclude_user_ids || [])],
            })
          }
        >
          Editar
        </Button>
      ),
    },
  ];

  const save = async () => {
    try {
      setSaving(true);
      setError("");
      await updateNotificationRule(editing.id, {
        enabled: editing.enabled,
        permission_code: editing.permission_code || null,
        include_entity_creator: editing.include_entity_creator,
        role_ids: editing.role_ids,
        include_user_ids: editing.include_user_ids,
        exclude_user_ids: editing.exclude_user_ids,
      });
      setEditing(null);
      setNotice("Regla de notificación actualizada.");
      await load();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "No fue posible guardar la regla de notificación."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ height: "100%" }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}
      {notice && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setNotice("")}>
          {notice}
        </Alert>
      )}

      <Paper
        variant="outlined"
        sx={{ p: 2, mb: 2, bgcolor: "#f8fbfb", borderColor: "#d9e5e5" }}
      >
        <Typography fontWeight={700}>
          Cómo se resuelven los destinatarios
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Recibe la notificación quien cumpla al menos una inclusión: permiso base,
          rol adicional, usuario adicional o creador de la entidad. Las exclusiones
          se aplican al final y siempre tienen prioridad.
        </Typography>
      </Paper>

      <Box sx={{ height: 430 }}>
        <DataGrid
          rows={rules}
          columns={columns}
          loading={loading}
          pageSize={10}
          disableSelectionOnClick
        />
      </Box>

      <Dialog
        open={!!editing}
        onClose={() => setEditing(null)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {editing ? `Destinatarios · ${editing.label}` : "Regla de notificación"}
        </DialogTitle>

        <DialogContent>
          {editing && (
            <>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {editing.description}
              </Typography>

              <FormControlLabel
                control={
                  <Switch
                    checked={!!editing.enabled}
                    onChange={(event) =>
                      setEditing({
                        ...editing,
                        enabled: event.target.checked,
                      })
                    }
                  />
                }
                label="Evento habilitado"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={!!editing.include_entity_creator}
                    onChange={(event) =>
                      setEditing({
                        ...editing,
                        include_entity_creator: event.target.checked,
                      })
                    }
                  />
                }
                label="Incluir al usuario que creó la entidad"
              />

              <TextField
                select
                fullWidth
                margin="normal"
                label="Permiso base"
                value={editing.permission_code || ""}
                onChange={(event) =>
                  setEditing({
                    ...editing,
                    permission_code: event.target.value || null,
                  })
                }
                helperText="Todos los usuarios internos activos que posean este permiso recibirán el evento."
              >
                <MenuItem value="">
                  <em>Sin permiso base</em>
                </MenuItem>
                {permissionOptions.map((permission) => (
                  <MenuItem key={permission.code} value={permission.code}>
                    {permission.name} ({permission.code})
                  </MenuItem>
                ))}
              </TextField>

              <Autocomplete
                multiple
                options={options.roles || []}
                getOptionLabel={(option) =>
                  `${option.name} (${option.code})`
                }
                value={(options.roles || []).filter((role) =>
                  editing.role_ids.includes(role.id)
                )}
                onChange={(_, values) =>
                  setEditing({
                    ...editing,
                    role_ids: values.map((value) => value.id),
                  })
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    margin="normal"
                    label="Roles adicionales"
                    helperText="Los miembros activos de estos roles también recibirán el evento."
                  />
                )}
              />

              <Autocomplete
                multiple
                options={options.users || []}
                getOptionLabel={(option) =>
                  `${option.name} — ${option.email}`
                }
                value={(options.users || []).filter((user) =>
                  editing.include_user_ids.includes(user.id)
                )}
                onChange={(_, values) =>
                  setEditing({
                    ...editing,
                    include_user_ids: values.map((value) => value.id),
                  })
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    margin="normal"
                    label="Usuarios adicionales"
                    helperText="Útil para excepciones individuales sin modificar el rol."
                  />
                )}
              />

              <Autocomplete
                multiple
                options={options.users || []}
                getOptionLabel={(option) =>
                  `${option.name} — ${option.email}`
                }
                value={(options.users || []).filter((user) =>
                  editing.exclude_user_ids.includes(user.id)
                )}
                onChange={(_, values) =>
                  setEditing({
                    ...editing,
                    exclude_user_ids: values.map((value) => value.id),
                  })
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    margin="normal"
                    label="Usuarios excluidos"
                    helperText="La exclusión gana incluso si el usuario recibe por permiso, rol o creador."
                  />
                )}
              />
            </>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setEditing(null)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={save}
            disabled={saving}
          >
            Guardar regla
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
