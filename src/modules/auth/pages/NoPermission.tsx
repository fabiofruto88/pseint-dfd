// src/pages/NoPermission.tsx
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function NoPermission() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f5f5f5"
      p={3}
    >
      <Typography variant="h3" gutterBottom>
        🚫 Sin Permiso
      </Typography>
      <Typography variant="h6" color="text.secondary" mb={3}>
        No tienes permisos para acceder a esta página
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Usuario: {user?.name} ({user?.role})
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Módulos disponibles: {user?.modules.join(", ")}
      </Typography>
      <Button variant="contained" onClick={() => navigate("/dashboard")}>
        Volver al Dashboard
      </Button>
    </Box>
  );
}
