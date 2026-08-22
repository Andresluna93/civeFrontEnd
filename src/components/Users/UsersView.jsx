import { useState } from "react";
import Fab from "@mui/material/Fab";
import Box from "@mui/material/Box";
import AddIcon from "@mui/icons-material/Add";
import PageviewIcon from "@mui/icons-material/Pageview";
import { UserForm } from "@/components/Forms/userForm";
import InteractiveListUsers from "@/components/Users/ListUsers";

export default function UsersView() {
  const [view, setView] = useState("UsersForm"); // "form" or "list"
  function handleViews(e) {
    setView(e.target.name);
  }

  return (
    <>
      <Box sx={{ "& > :not(style)": { m: 1 } }}>
        <Fab variant="extended" name="UsersForm" onClick={handleViews}>
          <AddIcon sx={{ mr: 1 }} />
          Registrar
        </Fab>
        <Fab variant="extended" name="UsersList" onClick={handleViews}>
          <PageviewIcon sx={{ mr: 1 }} />
          Ver usuarios
        </Fab>
      </Box>
      <Box sx={{ "& > :not(style)": { m: 1 }, mt: 5 }}>
        {view === "UsersForm" ? <UserForm /> : <InteractiveListUsers />}
      </Box>
    </>
  );
}
