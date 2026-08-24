import { styled, alpha } from "@mui/material/styles";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import SendIcon from "@mui/icons-material/Send";
import MarkChatUnreadIcon from "@mui/icons-material/MarkChatUnread";
import MarkChatReadIcon from "@mui/icons-material/MarkChatRead";
import BeenhereIcon from "@mui/icons-material/Beenhere";
import SmsFailedIcon from "@mui/icons-material/SmsFailed";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  TemplatesApi,
  CampanaMarketingAPI,
  EstadosMensajesApi,
} from "../../services/services.js";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Modal from "@mui/material/Modal";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import Chip from "@mui/material/Chip";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

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

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const statConfig = [
  { key: "sent", label: "Enviados", color: "primary" },
  { key: "delivered", label: "Recibidos", color: "info" },
  { key: "read", label: "Leídos", color: "success" },
  { key: "failed", label: "Fallidos", color: "error" },
];

export default function TemplateList() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [open, setOpen] = useState(false);
  const [openEstatics, setOpenEstatics] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [loadings, setLoadings] = useState(false);
  const [contador, setContador] = useState({});

  useEffect(() => {
    if (!loadings) return;
    const timeout = setTimeout(() => {
      setLoadings(false);
    }, 2000);
    return () => clearTimeout(timeout);
  }, [loadings]);

  const handleOpen = (template) => {
    console.log(template);
    setSelectedTemplate(template);
    setOpen(true);
  };
  const handleOpenEstatics = (template) => {
    console.log(template);
    setSelectedTemplate(template);
    setOpenEstatics(true);
    fetchStatusTemplates(template._id);
  };
  const handleClose = () => {
    setOpen(false);
    setSelectedTemplate(null);
  };
  const handleCloseEstatics = () => {
    setOpenEstatics(false);
    setSelectedTemplate(null);
  };

  const templatesFiltrados = templates.filter((template) =>
    `${template.name} ${template.category}`
      .toLowerCase()
      .includes(busqueda.toLowerCase()),
  );

  const fetchDataTemplates = async () => {
    setLoading(true);
    try {
      const response = await TemplatesApi.getAllTemplates();
      console.log(response);
      setTemplates(response);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatusTemplates = async (id) => {
    setLoading(true);
    try {
      const response = await EstadosMensajesApi.getStatus(id);
      console.log(response);
      setContador(response.conteo);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSendTemplatesUsers = async (template, archivo) => {
    try {
      const formData = new FormData();
      formData.append("templateName", template);
      formData.append("file", archivo);
      const response = await CampanaMarketingAPI.enviarUsersTemplate(formData);
      console.log(response);
    } catch (error) {
      console.error("Error fetching template Users:", error);
    }
  };

  useEffect(() => {
    fetchDataTemplates();
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
              Listado de Templates
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
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  mt: 2,
                }}
              >
                {templatesFiltrados.map((template) => (
                  <Card key={template._id} variant="outlined">
                    <CardContent>
                      <Typography variant="h5" component="div">
                        {template.name}
                      </Typography>
                      <Typography
                        gutterBottom
                        sx={{ color: "text.secondary", fontSize: 14 }}
                      >
                        {`${template.category} / ${template.status}`}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {template.components[1]?.text}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Tooltip title="ver mas">
                        <IconButton
                          aria-label="ver mas"
                          size="small"
                          onClick={() => handleOpen(template)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Estadisticas">
                        <IconButton
                          aria-label="estadisticas"
                          size="small"
                          onClick={() => handleOpenEstatics(template)}
                        >
                          <InsertChartIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="enviar">
                        <IconButton
                          aria-label="enviar"
                          size="small"
                          component="label"
                          loading={loadings}
                        >
                          <SendIcon />
                          <VisuallyHiddenInput
                            type="file"
                            accept=".csv"
                            onChange={(event) => {
                              const file = event.target.files[0];
                              if (!file) return;
                              setLoadings(true);
                              fetchSendTemplatesUsers(template.name, file);
                            }}
                          />
                        </IconButton>
                      </Tooltip>
                    </CardActions>
                  </Card>
                ))}
                <Modal
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="parent-modal-title"
                  aria-describedby="parent-modal-description"
                >
                  <Box sx={{ ...style, width: 400 }}>
                    <Typography
                      id="parent-modal-title"
                      variant="h6"
                      component="h2"
                    >
                      {selectedTemplate?.name}
                    </Typography>
                    <Box
                      id="parent-modal-description"
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        mt: 2,
                      }}
                    >
                      <Typography variant="body1">
                        {selectedTemplate?.components[1]?.text}
                      </Typography>

                      <Typography
                        variant="caption"
                        sx={{ color: "text.secondary" }}
                      >
                        {selectedTemplate?.components[2]?.text}
                      </Typography>
                    </Box>
                  </Box>
                </Modal>
                <Modal
                  open={openEstatics}
                  onClose={handleCloseEstatics}
                  aria-labelledby="parent-modal-title"
                  aria-describedby="parent-modal-description"
                >
                  <Box sx={{ ...style, width: 400 }}>
                    <Typography
                      id="parent-modal-title"
                      variant="h5"
                      component="h2"
                    >
                      {`${selectedTemplate?.name}`}
                    </Typography>
                    <Box
                      id="parent-modal-description"
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        mt: 2,
                      }}
                    >
                      <Grid container spacing={1} sx={{ mt: 1 }}>
                        {statConfig.map(({ key, label, color }) => (
                          <Grid key={key} size={6}>
                            <Card variant="outlined">
                              <CardContent sx={{ textAlign: "center", py: 1.5 }}>
                                <Typography variant="h5">
                                  {contador?.[key] ?? 0}
                                </Typography>
                                <Chip
                                  size="small"
                                  label={label}
                                  color={color}
                                  sx={{ mt: 0.5 }}
                                />
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  </Box>
                </Modal>
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
