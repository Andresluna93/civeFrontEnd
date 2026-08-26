import { useState, useEffect, useRef } from "react";
import Alert from "@mui/material/Alert";
import Fade from "@mui/material/Fade";
import CheckIcon from "@mui/icons-material/Check";

export default function ErrorMessage({ message, show, duration = 2000, onHide }) {
  const [visible, setVisible] = useState(show);
  const onHideRef = useRef(onHide);
  onHideRef.current = onHide;

  useEffect(() => {
    setVisible(show);
    if (show) {
      const timer = setTimeout(() => {
        setVisible(false);
        onHideRef.current?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration]);

  return (
    <Fade in={visible} timeout={500}>
      <Alert icon={<CheckIcon fontSize="inherit" />} severity="error">
        {message}
      </Alert>
    </Fade>
  );
}
