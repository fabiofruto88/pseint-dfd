// src/pages/NotFound.tsx
import { Box, Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Box
        sx={{
          width: "100%",
          textAlign: "center",
          bgcolor: "background.paper",
          borderRadius: 2,
          py: 6,
          boxShadow: 1,
        }}
      >
        <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
          <svg
            width="140"
            height="100"
            viewBox="0 0 140 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <rect width="140" height="100" rx="12" fill="#F3F4F6" />
            <text
              x="50%"
              y="50%"
              dominantBaseline="middle"
              textAnchor="middle"
              fontSize="28"
              fill="#9CA3AF"
            >
              404
            </text>
          </svg>
        </Box>

        <Typography variant="h4" component="h1" gutterBottom>
          Página no encontrada
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Lo sentimos, la página que buscas no existe o fue movida.
        </Typography>

        <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(-1)}
            aria-label="Volver a la página anterior"
          >
            Volver
          </Button>

          <Button
            variant="outlined"
            onClick={() => navigate("/")}
            aria-label="Ir al inicio"
          >
            Ir al inicio
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
