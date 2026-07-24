import { useState, useEffect } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import Avatar from "@mui/material/Avatar";
import PersonIcon from "@mui/icons-material/Person";
import { Tickets } from "@/DB/tickers";
import VerticalLinearStepper from "@/components/HistoryProcess/historyProcess";
import axios from "axios";

export default function TicketList({ status }) {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [informacion, setInformaciton] = useState([]);
  console.log(status);
  const fetchData = async () => {
    try {
      const { data } = await axios.get("/api/chats/get");
      console.log("Respuesta:", data);
      setInformaciton(data.data);
    } catch (error) {
      console.error("Error en fetchData:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
        {informacion.map((e) => {
          if (status === e.status.v) {
            return (
              <ListItemButton key={e._id} onClick={() => setSelectedTicket(e)}>
                <ListItemAvatar>
                  <Avatar>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={e.name}
                  secondary={new Date(e.createdAt).toLocaleDateString()}
                />
              </ListItemButton>
            );
          }
          return null;
        })}
      </List>
      {selectedTicket && <VerticalLinearStepper data={selectedTicket} />}
    </>
  );
}
