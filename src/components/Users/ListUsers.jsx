import { styled, alpha } from "@mui/material/styles";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import PersonIcon from "@mui/icons-material/Person";
import EditDocumentIcon from '@mui/icons-material/EditDocument';
import { userApi } from "../../services/services.js";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";

const Demo = styled("div")(({ theme }) => ({
  backgroundColor: (theme.vars || theme).palette.background.paper,
}));

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

export default function InteractiveListUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  const usuariosFiltrados = users.filter((use) =>
    `${use.nameUser}`.toLowerCase().includes(busqueda.toLowerCase()),
  );

  const fetchData = async () => {
    setLoading(true);
    try {
      const { usuarios } = await userApi.getAllUsers();
      setUsers(usuarios);
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
      <Box sx={{ flexGrow: 1, maxWidth: 752 }}>
        <Grid container spacing={2}>
          <Grid
            size={{
              xs: 12,
              md: 6,
            }}
          >
            <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
              Listado de Usuarios Registrados
            </Typography>
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
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-muted border-t-primary" />
              </div>
            ) : (
              <Demo>
                <List dense={false}>
                  {usuariosFiltrados.map((user) => (
                    <ListItem
                      key={user._id}
                      secondaryAction={
                        <Box sx={{ display: "flex", gap: 1.5 }}>
                          <IconButton
                            edge="end"
                            aria-label="call"
                            onClick={() => alert("Llamando...")}
                          >
                            <EditDocumentIcon />
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
                        primary={`${user.nameUser}`}
                        secondary={`${user.role}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Demo>
            )}
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
