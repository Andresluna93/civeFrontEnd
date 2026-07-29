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
import axios from "axios";

export function TareaFormRegister() {
  const filledStartId = useId();
  const [name, setName] = useState("");
  const [wa_id, setWaId] = useState("");
  const [cedula, setCedula] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [open, setOpen] = useState(false);
  const [sucursalOpen, setSucursalOpen] = useState(false);
  const [servicio, setServicio] = useState("");
  const [sucursal, setSucursal] = useState(null);
  const [showMessage, setShowMessage] = useState(false);
  const [showMessageError, setShowMessageError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    setDisabled(true);
    /*console.log({
      name,
      cedula,
      wa_id,
      servicio,
      sucursal,
    });*/
    const ok = await fetchData("/api/chats/create");
    if (ok) {
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 2000);
    }
  };

  const fetchData = async (url) => {
    setLoading(true);
    try {
      const dataToSend = {
        name: name,
        estado: "ingresado",
        canal: "contact",
        cedula: cedula,
        wa_id: wa_id,
        status: {
          v: "ingresado",
          date: new Date().toISOString(),
          hora: new Date().toISOString(),
        },
        servicio: servicio,
        sucursal: sucursal,
      };
      await axios.post(url, dataToSend);
      return true;
    } catch {
      setShowMessageError(true);
      setTimeout(() => setShowMessageError(false), 2000);
      return false;
    } finally {
      setLoading(false);
      setName("");
      setCedula("");
      setWaId("");
      setServicio("");
      setSucursal(null);
    }
  };

  /*const handleEdit = () => {
    setDisabled(false);
  };*/

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
            sx={{ m: 1, width: "100%" }}
            variant="filled"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
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
            label="Cedula"
            id={`filled-size-small`}
            sx={{ m: 1, width: "25ch" }}
            variant="filled"
            value={cedula}
            size="small"
            onChange={(e) => {
              setCedula(e.target.value);
            }}
          />
          <TextField
            label="Telefono"
            id={`filled-size-small`}
            sx={{ m: 1, width: "25ch" }}
            variant="filled"
            value={wa_id}
            size="small"
            onChange={(e) => {
              setWaId(e.target.value);
            }}
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
                  setDisabled(true);
                  setSucursal(null);
                  setSucursalOpen(false);
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
                  setDisabled(false);
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
          <ListItemButton onClick={handleSucursalesClick} disabled={disabled}>
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
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-muted border-t-primary" />
        </div>
      ) : (
        <Button onClick={handleContinue} variant="contained" sx={{ m: 1 }}>
          Registrar
        </Button>
      )}
      {/*<Button
        onClick={handleEdit}
        variant="contained"
        sx={{ m: 1 }}
        color="success"
        startIcon={<EditIcon />}
      >
        Editar
      </Button>*/}
      <Fade in={showMessage} timeout={500}>
        <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
          El registro del Ticket Fue exitoso.
        </Alert>
      </Fade>
      <Fade in={showMessageError} timeout={500}>
        <Alert icon={<CheckIcon fontSize="inherit" />} severity="error">
          Hubo un error al registrar el Ticket.
        </Alert>
      </Fade>
    </>
  );
}
