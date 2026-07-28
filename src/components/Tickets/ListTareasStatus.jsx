import { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import Avatar from "@mui/material/Avatar";
import PersonIcon from "@mui/icons-material/Person";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { Tickets } from "@/DB/tickers";
import VerticalLinearStepper from "@/components/HistoryProcess/historyProcess";
import axios from "axios";

export default function TicketList({ status }) {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [informacion, setInformaciton] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  console.log(status);
  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/chats/get");
      //console.log("Respuesta:", data);
      const ordenado = [...data.data].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
      setInformaciton(ordenado);
    } catch (error) {
      console.error("Error en fetchData:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleFinalizado = () => {
    setSelectedTicket(null);
    setShowSuccess(true);
    fetchData();
  };

  return (
    <>
      <div className="flex gap-4 items-start">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-muted border-t-primary" />
          </div>
        ) : (
          <Paper
            elevation={2}
            sx={{
              width: "100%",
              maxWidth: 360,
              position: "sticky",
              top: 16,
              maxHeight: 420,
              overflowY: "auto",
              border: "1px solid",
              borderColor: "grey.300",
              scrollbarWidth: "thin",
              scrollbarColor: (theme) =>
                `${theme.palette.grey[400]} ${theme.palette.grey[100]}`,
              "&::-webkit-scrollbar": {
                width: 8,
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "grey.100",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "grey.400",
                borderRadius: 4,
              },
            }}
          >
            <List sx={{ bgcolor: "background.paper" }}>
              {informacion.map((e) => {
                if (status === e.status.v) {
                  return (
                    <ListItemButton
                      key={e._id}
                      selected={selectedTicket?._id === e._id}
                      onClick={() => setSelectedTicket(e)}
                    >
                      <ListItemAvatar>
                        <Avatar>
                          <ConfirmationNumberIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={e.ticket || e.name}
                        secondary={new Date(e.createdAt).toLocaleDateString()}
                      />
                    </ListItemButton>
                  );
                }
                return null;
              })}
            </List>
          </Paper>
        )}
        {selectedTicket && (
          <VerticalLinearStepper
            data={selectedTicket}
            onFinalizado={handleFinalizado}
          />
        )}
      </div>
      <Snackbar
        open={showSuccess}
        autoHideDuration={4000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setShowSuccess(false)} severity="success">
          Ticket cerrado exitosamente
        </Alert>
      </Snackbar>
    </>
  );
}
