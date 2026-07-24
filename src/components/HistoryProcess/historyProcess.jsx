import { useState, useRef, useEffect } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
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

export default function VerticalLinearStepper({ data }) {
  console.log(data);
  const [activeStep, setActiveStep] = useState(0);
  const [requerimiento, setRequerimiento] = useState(null);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    fetchData();
  };

  const fetchData = async () => {
    try {
      const dataToSend = {
        id: data._id,
        estado: "finalizado",
        requeriment: requerimiento,
        status: {
          v: "finalizado",
          date: new Date().toISOString(),
          hora: new Date().toISOString(),
        },
      };
      const response = await axios.post("/api/chats/updatestatus", dataToSend);
      console.log("Enviar:", response.data);
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
        resetButtonRef.current.focus();
        console.log(
          "If the user has completed all steps and hits Finish, focus the Reset button",
        );
      } else {
        // Focus the "Continue" button otherwise.
        continueButtonRef.current.focus();
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
      continueButtonRef.current.focus();
      return;
    }

    // Focus the "Back" button otherwise.
    console.log("Focus the Back button otherwise.");
    backButtonRef.current.focus();
  }, [activeStep]);

  return (
    <Box sx={{ maxWidth: 400 }}>
      <Typography sx={{ color: "text.secondary" }}>
        {data.name}-{new Date(data.createdAt).toLocaleDateString()}
      </Typography>
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
                {new Date(step.date).toLocaleDateString()} -{" "}
                {new Date(step.hora).toLocaleTimeString()}
              </Typography>
              {index === 1 && (
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {data.servicio} - {data.sucursal}
                </Typography>
              )}
              {index === 2 && (
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {data.requeriment}
                </Typography>
              )}
              <Box sx={{ mb: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{ mt: 1, mr: 1 }}
                  ref={continueButtonRef}
                >
                  {index === data.statusH.length - 1
                    ? "Finalizar"
                    : "Continuar"}
                </Button>
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
              <TextField
                label="Observación"
                multiline
                rows={3}
                fullWidth
                sx={{ mt: 1 }}
                value={requerimiento ?? ""}
                onChange={(e) => setRequerimiento(e.target.value)}
              />
            </>
          ) : (
            <Typography>
              Todos los pasos fueron completados - haz&apos; cumplido
            </Typography>
          )}
          <Button
            onClick={handleReset}
            sx={{ mt: 1, mr: 1 }}
            ref={resetButtonRef}
          >
            Enviar
          </Button>
        </Paper>
      )}
    </Box>
  );
}
