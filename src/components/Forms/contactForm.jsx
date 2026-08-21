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
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Alert from "@mui/material/Alert";
import Fade from "@mui/material/Fade";
import CheckIcon from "@mui/icons-material/Check";
import { contactosAPI } from "../../services/services.js";

const formatTelefono = (extension, telefono) => {
  const soloNumeros = telefono.replace(/\D/g, "");
  const sinCeroInicial = soloNumeros.replace(/^0+/, "");
  return `${extension}${sinCeroInicial}`;
};

export function ContactForm() {
  const [form, setForm] = useState({
    nombres: "",
    apellidos: "",
    telefono: "",
    identificador: "",
    extension: "",
  });
  const [showMessage, setShowMessage] = useState(false);
  const [showMessageError, setShowMessageError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const filledStartId = useId();

  const handleContinue = async (e) => {
    e.preventDefault();
    if (
      !form.nombres ||
      !form.apellidos ||
      !form.telefono ||
      !form.identificador ||
      !form.extension
    ) {
      setShowMessageError(true);
      setTimeout(() => setShowMessageError(false), 2000);
      return;
    }
    const { extension, telefono, ...resto } = form;
    const payload = {
      ...resto,
      telefono: formatTelefono(extension, telefono),
    };
    setLoading(true);
    try {
      const response = await contactosAPI.registrar(payload);
      console.log("Contacto registrado:", response);
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 2000);
    } catch (error) {
      console.error("Error al registrar contacto:", error);
      setShowMessageError(true);
      setTimeout(() => setShowMessageError(false), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleRole = () => {
    setOpen(!open);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
        <div>
          <TextField
            label="Nombres"
            id={`${filledStartId}-input`}
            name="nombres"
            sx={{ m: 1, width: "35ch" }}
            variant="filled"
            size="small"
            value={form.nombres}
            onChange={handleChange}
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
          <TextField
            label="apellidos"
            id={`filled-size-small`}
            name="apellidos"
            sx={{ m: 1, width: "35ch" }}
            variant="filled"
            value={form.apellidos}
            size="small"
            onChange={handleChange}
          />
          <br />
          <FormControl variant="filled">
            <InputLabel id="demo-simple-select-label">Extension</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              name="extension"
              value={form.extension}
              label="Extension"
              onChange={handleChange}
              sx={{ width: "25ch" }}
              variant="filled"
            >
              <MenuItem value={593}>Ec +593</MenuItem>
              <MenuItem value={1}>Us +1</MenuItem>
              <MenuItem value={34}>Esp +34</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Telefono"
            id={`filled-size-small`}
            name="telefono"
            sx={{ m: 1, width: "45ch" }}
            variant="filled"
            value={form.telefono}
            size="small"
            onChange={handleChange}
          />
          <br />
          <ListItemButton onClick={handleRole}>
            <ListItemIcon>
              <FormatListBulletedIcon />
            </ListItemIcon>
            <ListItemText
              primary="Identificador"
              secondary={form.identificador || null}
            />
            {open ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton
                sx={{ pl: 4 }}
                selected={form.identificador === "REF"}
                onClick={() => {
                  setForm({ ...form, identificador: "REF" });
                  setOpen(false);
                }}
              >
                <ListItemIcon>
                  <SupportAgentIcon />
                </ListItemIcon>
                <ListItemText primary="REF" />
              </ListItemButton>
              <ListItemButton
                sx={{ pl: 4 }}
                selected={form.identificador === "CO"}
                onClick={() => {
                  setForm({ ...form, identificador: "CO" });
                  setOpen(false);
                }}
              >
                <ListItemIcon>
                  <SupervisorAccountIcon />
                </ListItemIcon>
                <ListItemText primary="CO" />
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
          El registro del Contacto Fue exitoso.
        </Alert>
      </Fade>
      <Fade in={showMessageError} timeout={500}>
        <Alert icon={<CheckIcon fontSize="inherit" />} severity="error">
          Hubo un error al registrar el Contacto.
        </Alert>
      </Fade>
    </>
  );
}
