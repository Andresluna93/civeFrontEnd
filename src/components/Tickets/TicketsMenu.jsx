import { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import TicketList from "@/components/Tickets/ListTicketsStatus";
import PersonIcon from "@mui/icons-material/Person";
import LocalActivityIcon from "@mui/icons-material/LocalActivity";

const cards = [
  {
    id: 1,
    title: "Ingresados",
    description: "Requerimientos que el cliente solicito.",
    status: "ingresado",
  },
  {
    id: 2,
    title: "En proceso",
    description: "Requerimiento que estan siendo atendidos.",
    status: "enProceso",
  },
  {
    id: 3,
    title: "Finalizados",
    description: "Requerimientos que fueron solucionados.",
    status: "finalizado",
  },
  {
    id: 4,
    title: "Abandonados",
    description:
      "Requerimientos donde el cliente decidio finalizar la interaccion.",
    status: "abandono",
  },
];

export default function TicketsSelectionCard({ onStatusChange }) {
  const [selectedCard, setSelectedCard] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const handleClick = (i, status) => {
    setSelectedCard(i);
    setSelectedStatus(status);
    onStatusChange?.(status);
  };
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Box
        sx={{
          width: "100%",
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fill, minmax(min(200px, 100%), 1fr))",
          gap: 2,
        }}
      >
        {cards.map((card, index) => (
          <Card key={card.id}>
            <CardActionArea
              onClick={() => handleClick(index, card.status)}
              data-active={selectedCard === index ? "" : undefined}
              data-status={card.status}
              sx={{
                height: "100%",
                "&[data-active]": {
                  backgroundColor: "action.selected",
                  "&:hover": {
                    backgroundColor: "action.selectedHover",
                  },
                },
              }}
            >
              <CardContent sx={{ height: "100%" }}>
                <Typography variant="h5" component="div">
                  <LocalActivityIcon />
                  {card.title}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {card.description}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
      {selectedStatus && <TicketList status={selectedStatus} />}
    </Box>
  );
}
