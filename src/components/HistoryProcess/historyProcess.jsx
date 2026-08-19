import { useState, useRef, useEffect } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import axios from "axios";

const steps = [
  {
    label: "Selecciona Requerimiento",
    description: `Selecciona uno de los tickets que te fueron asignados.`,
  },
  {
    label: "Agregar Informacion",
    description: "Recopilas informacion sobre el cliente y su requerimiento.",
  },
  {
    label: "Finaliza Requerimiento",
    description: `Finalizas el requerimiento del usuario una vez hayas resuelto el requerimiento solicitado.`,
  },
];

const servicesListItem = [
  "LLAMADA DE PRUEBA",
  "LLAMADA EQUIVOCADA",
  "OTRAS AREAS CEIBOS",
  "OTRAS AREAS VILLA CLUB",
  "INFORMATIVO CEIBOS",
  "INFORMATIVO VILLA CLUB",
  "AGENDAMIENTO CITA VILLA CLUB",
  "AGENDAMIENTO CITA CEIBOS",
  "REAGENDAMIENTO VILLA CLUB",
  "REAGENDAMIENTO CEIBOS",
  "PROMOCIONES VILLA CLUB",
  "PROMOCIONES CEIBOS",
  "PACIENTES SEGUROS PUBLICO VILLA CLUB",
  "PACIENTES SEGUROS PUBLICO CEIBOS",
  "PACIENTES SEGUROS PRIVADOS VILLA CLUB",
  "PACIENTES SEGUROS PRIVADOS CEIBOS",
  "CANCELACIONES VILLA CLUB",
  "CANCELACIONES CEIBOS",
  "NO CONTESTAN VILLA CLUB",
  "NO CONTESTAN CEIBOS",
];

export default function VerticalLinearStepper({ data, onFinalizado }) {
  console.log(data);
  const [open, setOpen] = useState(false);
  const [serviceItem, setServiceItem] = useState(null);
  //const [fecha, setFecha] = useState(null);

  const handleClick = () => {
    setOpen(!open);
  };
  const [activeStep, setActiveStep] = useState(0);
  const [observacion, setObservacion] = useState(null);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    if (serviceItem) setServiceItem(null);
    if (observacion) setObservacion(null);
  };

  const handleReset = async () => {
    await fetchData("/api/chats/updatestatus", "finalizado", "finalizado");
    setActiveStep(0);
    setServiceItem(null);
    setObservacion(null);
    //console.log(fecha);
  };

  const handleProcesar = async () => {
    await fetchData("/api/chats/updatestatus", "en_proceso", "enProceso");
  };

  const fetchData = async (url, estate, status) => {
    try {
      const dataToSend = {
        id: data._id,
        estado: estate,
        requeriment: serviceItem,
        observacion: observacion,
        status: {
          v: status,
          date: new Date().toISOString(),
          hora: new Date().toISOString(),
        },
      };
      const response = await axios.post(url, dataToSend);
      console.log("Enviar:", response.data);
      onFinalizado?.();
    } catch (error) {
      console.error("Error en fetchData:", error);
    }
  };

  const previousActiveStepRef = useRef(activeStep);
  const continueButtonRef = useRef(null);
  const backButtonRef = useRef(null);
  const resetButtonRef = useRef(null);

  // Manage focus when the active step changes.
  useEffect(() => {
    const previousActiveStep = previousActiveStepRef.current;
    previousActiveStepRef.current = activeStep;

    // If the user is going forward.
    if (previousActiveStep < activeStep) {
      if (activeStep === data.statusH.length) {
        // If the user has completed all steps and hits "Finish", focus the "Reset" button.
        resetButtonRef.current?.focus();
        console.log(
          "If the user has completed all steps and hits Finish, focus the Reset button",
        );
      } else {
        // Focus the "Continue" button otherwise.
        continueButtonRef.current?.focus();
        console.log("Focus the continue button otherwise");
      }
      return;
    }
    // Otherwise, the user is going back.

    if (activeStep === 0) {
      // If the user hit "Back" on the second step, or hit "Reset", focus the "Continue" button.
      console.log(
        "If the user hit Back on the second step, or hit Reset, focus the Continue button.",
      );
      continueButtonRef.current?.focus();
      return;
    }

    // Focus the "Back" button otherwise.
    console.log("Focus the Back button otherwise.");
    backButtonRef.current?.focus();
  }, [activeStep]);

  return (
    <Box sx={{ maxWidth: 400, pt: 3, pb: 3 }}>
      <Typography sx={{ color: "text.secondary" }}>
        {data.ticket || data.name}
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 0.5,
        }}
      >
        <Typography component="span" sx={{ color: "text.secondary" }}>
          {`+${data.wa_id.slice(0, 3)} ${data.wa_id.slice(3)}`}
        </Typography>
        <IconButton
          edge="end"
          aria-label="copiar"
          size="small"
          onClick={() => {
            navigator.clipboard.writeText(data.wa_id);
          }}
        >
          <ContentCopyIcon fontSize="small" />
        </IconButton>
      </Box>
      <Stepper activeStep={activeStep} orientation="vertical">
        {data.statusH.map((step, index) => (
          <Step key={step.v}>
            <StepLabel
              optional={
                index === steps.length - 1 ? (
                  <Typography variant="caption">Ultimo paso</Typography>
                ) : null
              }
            >
              {step.v}
            </StepLabel>
            <StepContent>
              <Typography>
                {data.name}
                <br />
                {"Canal: " + data.canal}
                <br />
                {new Date(step.date).toLocaleDateString()} -{" "}
                {new Date(step.hora).toLocaleTimeString()}
              </Typography>
              {index === 1 && (
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {data.sucursal
                    ? `${data.servicio} - ${data.sucursal}`
                    : data.servicio}
                </Typography>
              )}
              {index === 2 && (
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {data.requeriment}
                  <br />
                  {data.observacion ? data.observacion : "Sin observación"}
                </Typography>
              )}
              <Box sx={{ mb: 2 }}>
                {(index !== data.statusH.length - 1 ||
                  data.status.v !== "finalizado") && (
                  <Button
                    variant="contained"
                    onClick={
                      data.status.v === "ingresado"
                        ? handleProcesar
                        : handleNext
                    }
                    sx={{ mt: 1, mr: 1 }}
                    ref={continueButtonRef}
                  >
                    {data.status.v === "ingresado"
                      ? "Procesar"
                      : index === data.statusH.length - 1
                        ? "Finalizar"
                        : "Continuar"}
                  </Button>
                )}
                {index !== 0 && (
                  <Button
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                    ref={backButtonRef}
                  >
                    Regresar
                  </Button>
                )}
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === data.statusH.length && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          {data.statusH.length < steps.length ? (
            <>
              {/* <Typography color="warning.main">
                El requerimiento no completó todos los pasos. Es necesario
                notificar al cliente para continuar.
              </Typography> */}
              <ListItemButton onClick={handleClick}>
                <ListItemIcon>
                  <MedicalServicesIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Servicios"
                  secondary={serviceItem || null}
                />
                {open ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {servicesListItem.map((service, index) => (
                    <ListItemButton key={index} sx={{ pl: 4 }}>
                      <ListItemText
                        primary={service}
                        onClick={() => {
                          setServiceItem(service);
                          setOpen(false);
                        }}
                      />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
              {/*<br />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  format="DD/MM/YYYY"
                  value={fecha}
                  onChange={(nuevo) => setFecha(nuevo)}
                  disabled={true}
                />
              </LocalizationProvider>*/}
              <br />
              <TextField
                label="Observación"
                multiline
                rows={3}
                fullWidth
                sx={{ mt: 1 }}
                value={observacion ?? ""}
                onChange={(e) => setObservacion(e.target.value)}
              />
            </>
          ) : (
            <Typography>
              Todos los pasos fueron completados - haz&apos; cumplido
            </Typography>
          )}
          <Button
            variant="contained"
            onClick={handleReset}
            sx={{ mt: 1, mr: 1 }}
            ref={resetButtonRef}
          >
            Enviar
          </Button>
          <Button
            onClick={handleBack}
            sx={{ mt: 1, mr: 1 }}
            ref={backButtonRef}
          >
            Regresar
          </Button>
        </Paper>
      )}
    </Box>
  );
}
