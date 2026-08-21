import { useState, useId } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import Alert from "@mui/material/Alert";
import Fade from "@mui/material/Fade";
import CheckIcon from "@mui/icons-material/Check";
import { userApi } from "../../services/services.js";

export function UserForm() {
  const [form, setForm] = useState({
    nameUser: "",
    password: "",
    name: "",
    role: "",
  });
  const [showMessage, setShowMessage] = useState(false);
  const [showMessageError, setShowMessageError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const filledStartId = useId();

  const handleContinue = async (e) => {
    e.preventDefault();
    if (!form.nameUser || !form.password || !form.name || !form.role) {
      setShowMessageError(true);
      setTimeout(() => setShowMessageError(false), 2000);
      return;
    }
    setLoading(true);
    try {
      const response = await userApi.registrar(form);
      console.log("Usuario registrado:", response.data);
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 2000);
    } catch (error) {
      console.error("Error al registrar el usuario:", error);
      setShowMessageError(true);
      setTimeout(() => setShowMessageError(false), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleRole = () => {
    setOpen(!open);
  };

  return (
    <>
      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
        <div>
          <TextField
            label="Usuario"
            id={`${filledStartId}-input`}
            sx={{ m: 1, width: "100%" }}
            variant="filled"
            value={form.nameUser}
            onChange={(e) => {
              setForm({ ...form, nameUser: e.target.value });
            }}
          />
          {/*<TextField
            label="Apellidos"
            id={`${filledStartId}-input`}
            sx={{ m: 1, width: "25ch" }}
            variant="filled"
            value={apellidos}
            onChange={(e) => {
              setApellidos(e.target.value);
            }}
            disabled={disabled}
          />*/}
          <br />
          <TextField
            label="Password"
            id={`filled-size-small`}
            sx={{ m: 1, width: "25ch" }}
            variant="filled"
            value={form.password}
            size="small"
            onChange={(e) => {
              setForm({ ...form, password: e.target.value });
            }}
          />
          <TextField
            label="Nombres"
            id={`filled-size-small`}
            sx={{ m: 1, width: "25ch" }}
            variant="filled"
            value={form.name}
            size="small"
            onChange={(e) => {
              setForm({ ...form, name: e.target.value });
            }}
          />
          <br />
          <ListItemButton onClick={handleRole}>
            <ListItemIcon>
              <FormatListBulletedIcon />
            </ListItemIcon>
            <ListItemText primary="Roles" secondary={form.role || null} />
            {open ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton
                sx={{ pl: 4 }}
                selected={form.role === "Agente"}
                onClick={() => {
                  setForm({ ...form, role: "agente" });
                  setOpen(false);
                }}
              >
                <ListItemIcon>
                  <SupportAgentIcon />
                </ListItemIcon>
                <ListItemText primary="Agente" />
              </ListItemButton>
              <ListItemButton
                sx={{ pl: 4 }}
                selected={form.role === "Administrador"}
                onClick={() => {
                  setForm({ ...form, role: "admin" });
                  setOpen(false);
                }}
              >
                <ListItemIcon>
                  <SupervisorAccountIcon />
                </ListItemIcon>
                <ListItemText primary="Administrador" />
              </ListItemButton>
            </List>
          </Collapse>
          <br />
        </div>
      </Box>
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-muted border-t-primary" />
        </div>
      ) : (
        <Button onClick={handleContinue} variant="contained" sx={{ m: 1 }}>
          Registrar
        </Button>
      )}
      <Fade in={showMessage} timeout={500}>
        <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
          El registro del Usuario Fue exitoso.
        </Alert>
      </Fade>
      <Fade in={showMessageError} timeout={500}>
        <Alert icon={<CheckIcon fontSize="inherit" />} severity="error">
          Hubo un error al registrar el Usuario.
        </Alert>
      </Fade>
    </>
  );
}
