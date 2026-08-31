import { useState, useEffect } from "react";
import { styled, alpha } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import Avatar from "@mui/material/Avatar";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import { Tickets } from "@/DB/tickers";
import VerticalLinearStepper from "@/components/HistoryProcess/historyProcess";
import { chatsAPI } from "@/services/services";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

export default function TicketList({ status }) {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [informacion, setInformaciton] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await chatsAPI.getTickets();
      const lista = Array.isArray(data?.data) ? data.data : [];
      const ordenado = [...lista].sort(
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

  const ticketsFiltrados = informacion.filter((ticket) =>
    `${ticket.ticket} ${ticket.wa_id}`
      .toLowerCase()
      .includes(busqueda.toLowerCase()),
  );

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
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </Search>
            <List sx={{ bgcolor: "background.paper" }}>
              {informacion.filter((e) => status === e?.status?.v).length ===
                0 && (
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", px: 2, py: 2 }}
                >
                  No hay requerimientos en este estado.
                </Typography>
              )}
              {ticketsFiltrados.map((e) => {
                if (status === e?.status?.v) {
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
