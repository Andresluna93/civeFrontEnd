import { useState } from "react";
import Fab from "@mui/material/Fab";
import Box from "@mui/material/Box";
import AddIcon from "@mui/icons-material/Add";
import PageviewIcon from "@mui/icons-material/Pageview";
import { ContactForm } from "@/components/Forms/contactForm";
import ListaContactos from "@/pages/admin/ListaContactos";
import InteractiveList from "@/pages/admin/contactos";

export default function ContactView() {
  const [view, setView] = useState("ContactForm"); // "form" or "list"
  function handleViews(e) {
    setView(e.target.name);
  }

  return (
    <>
      <Box sx={{ "& > :not(style)": { m: 1 } }}>
        <Fab variant="extended" name="ContactForm" onClick={handleViews}>
          <AddIcon sx={{ mr: 1 }} />
          Registrar
        </Fab>
        <Fab variant="extended" name="ContactList" onClick={handleViews}>
          <PageviewIcon sx={{ mr: 1 }} />
          Ver contactos
        </Fab>
      </Box>
      <Box sx={{ "& > :not(style)": { m: 1 }, mt: 5 }}>
        {view === "ContactForm" ? <ContactForm /> : <InteractiveList />}
      </Box>
    </>
  );
}
