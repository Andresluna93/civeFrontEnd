import { useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import Avatar from "@mui/material/Avatar";
import PersonIcon from "@mui/icons-material/Person";
import { Tickets } from "@/DB/tickers";
import VerticalLinearStepper from "@/components/HistoryProcess/historyProcess";

export default function TicketList({ status }) {
  const [selectedTicket, setSelectedTicket] = useState(null);
  console.log(status);
  return (
    <>
      <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
        {Tickets.map((e) => {
          if (status === e.status.v) {
            return (
              <ListItemButton key={e.name} onClick={() => setSelectedTicket(e)}>
                <ListItemAvatar>
                  <Avatar>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={e.name} secondary={e.date} />
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
