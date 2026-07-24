import { styled } from "@mui/material/styles";
import { useState, useEffect } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import PersonIcon from "@mui/icons-material/Person";
import CallIcon from "@mui/icons-material/Call";
import SendIcon from "@mui/icons-material/Send";

const Demo = styled("div")(({ theme }) => ({
  backgroundColor: (theme.vars || theme).palette.background.paper,
}));

export default function InteractiveList() {
  const [info, setInfo] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/contacts/getContacts");
      setInfo(data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-muted border-t-primary" />
        </div>
      ) : (
        <Box sx={{ flexGrow: 1, maxWidth: 752 }}>
          <Grid container spacing={2}>
            <Grid
              size={{
                xs: 12,
                md: 6,
              }}
            >
              <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
                Lista de Contactos
              </Typography>
              <Demo>
                <List dense={false}>
                  {info.map((contact) => (
                    <ListItem
                      key={contact.wa_id}
                      secondaryAction={
                        <Box sx={{ display: "flex", gap: 1.5 }}>
                          <IconButton edge="end" aria-label="call" onClick={() => alert("Llamando...")}>
                            <CallIcon />
                          </IconButton>
                          <IconButton edge="end" aria-label="send" onClick={() => alert("Enviando...")}>
                            <SendIcon />
                          </IconButton>
                        </Box>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar>
                          <PersonIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={contact.name}
                        secondary={`+${contact.wa_id.slice(0, 3)} ${contact.wa_id.slice(3)}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Demo>
            </Grid>
          </Grid>
        </Box>
      )}
    </>
  );
}
