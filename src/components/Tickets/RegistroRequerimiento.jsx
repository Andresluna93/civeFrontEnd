import { useState, useId } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import TextField from "@mui/material/TextField";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import Alert from "@mui/material/Alert";
import Fade from "@mui/material/Fade";
import CheckIcon from "@mui/icons-material/Check";

export function TareaFormRegister() {
  const filledStartId = useId();
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [telefono, setTelefono] = useState("");
  const [cedula, setCedula] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [open, setOpen] = useState(false);
  const [sucursalOpen, setSucursalOpen] = useState(false);
  const [servicio, setServicio] = useState("");
  const [sucursal, setSucursal] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  const handleContinue = () => {
    console.log({
      nombres,
      apellidos,
      cedula,
      telefono,
      servicio,
      sucursal,
    });
    setDisabled(true);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 2000);
  };

  const handleEdit = () => {
    setDisabled(false);
  };

  const handleServicesClick = () => {
    setOpen(!open);
  };

  const handleSucursalesClick = () => {
    setSucursalOpen(!sucursalOpen);
  };

  return (
    <>
      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
        <div>
          <TextField
            label="Nombres"
            id={`${filledStartId}-input`}
            sx={{ m: 1, width: "25ch" }}
            variant="filled"
            value={nombres}
            onChange={(e) => {
              setNombres(e.target.value);
            }}
            disabled={disabled}
          />
          <TextField
            label="Apellidos"
            id={`${filledStartId}-input`}
            sx={{ m: 1, width: "25ch" }}
            variant="filled"
            value={apellidos}
            onChange={(e) => {
              setApellidos(e.target.value);
            }}
            disabled={disabled}
          />
          <br />
          <TextField
            label="Cedula"
            id={`filled-size-small`}
            sx={{ m: 1, width: "25ch" }}
            variant="filled"
            value={cedula}
            size="small"
            onChange={(e) => {
              setCedula(e.target.value);
            }}
            disabled={disabled}
          />
          <TextField
            label="Telefono"
            id={`filled-size-small`}
            sx={{ m: 1, width: "25ch" }}
            variant="filled"
            value={telefono}
            size="small"
            onChange={(e) => {
              setTelefono(e.target.value);
            }}
            disabled={disabled}
          />
          <br />
          <ListItemButton onClick={handleServicesClick}>
            <ListItemIcon>
              <FormatListBulletedIcon />
            </ListItemIcon>
            <ListItemText primary="Servicios" secondary={servicio || null} />
            {open ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton
                sx={{ pl: 4 }}
                selected={servicio === "Informacion"}
                onClick={() => {
                  setServicio("Informacion");
                  setOpen(false);
                }}
              >
                <ListItemIcon>
                  <MedicalServicesIcon />
                </ListItemIcon>
                <ListItemText primary="Informacion" />
              </ListItemButton>
              <ListItemButton
                sx={{ pl: 4 }}
                selected={servicio === "Agendamiento"}
                onClick={() => {
                  setServicio("Agendamiento");
                  setOpen(false);
                }}
              >
                <ListItemIcon>
                  <CalendarMonthIcon />
                </ListItemIcon>
                <ListItemText primary="Agendamiento" />
              </ListItemButton>
            </List>
          </Collapse>
          <br />
          <ListItemButton onClick={handleSucursalesClick}>
            <ListItemIcon>
              <FormatListBulletedIcon />
            </ListItemIcon>
            <ListItemText primary="Sucursales" secondary={sucursal || null} />
            {sucursalOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={sucursalOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton
                sx={{ pl: 4 }}
                selected={sucursal === "Ceibos"}
                onClick={() => {
                  setSucursal("Ceibos");
                  setSucursalOpen(false);
                }}
              >
                <ListItemIcon>
                  <CorporateFareIcon />
                </ListItemIcon>
                <ListItemText primary="Ceibos" />
              </ListItemButton>
              <ListItemButton
                sx={{ pl: 4 }}
                selected={sucursal === "Villa Club"}
                onClick={() => {
                  setSucursal("Villa Club");
                  setSucursalOpen(false);
                }}
              >
                <ListItemIcon>
                  <CorporateFareIcon />
                </ListItemIcon>
                <ListItemText primary="Villa Club" />
              </ListItemButton>
            </List>
          </Collapse>
        </div>
      </Box>
      <Button onClick={handleContinue} variant="contained" sx={{ m: 1 }}>
        Registrar
      </Button>
      <Button
        onClick={handleEdit}
        variant="contained"
        sx={{ m: 1 }}
        color="success"
        startIcon={<EditIcon />}
      >
        Editar
      </Button>
      <Fade in={showMessage} timeout={500}>
        <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
          Here is a gentle confirmation that your action was successful.
        </Alert>
      </Fade>
    </>
  );
}
