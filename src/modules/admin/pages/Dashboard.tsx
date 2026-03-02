// src/pages/Dashboard.tsx

import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
} from "@mui/material";
import routes from "@/core/router/routes.config";
import { useAuth } from "@/context/AuthContext";

export default function Dashboard() {
  const { user, logout, hasModule, getModules } = useAuth();
  const navigate = useNavigate();

  // Filtrar rutas a las que tiene acceso
  const availableRoutes = routes.filter((route) => {
    if (route.isPublic) return false;
    if (!route.requiredModule) return true;
    return hasModule(route.requiredModule);
  });

  return (
    <Box sx={{ p: 4 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <div>
          <Typography variant="h3" gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Bienvenido, {user?.name}
          </Typography>
        </div>
        <Button variant="outlined" color="error" onClick={logout}>
          Cerrar Sesión
        </Button>
      </Box>

      {/* Info del usuario */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Tu Información
          </Typography>
          <Typography>Email: {user?.email}</Typography>
          <Typography>Rol: {user?.role}</Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Módulos disponibles:
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {getModules().map((module) => (
                <Chip
                  key={module}
                  label={module}
                  color="primary"
                  size="small"
                />
              ))}
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Módulos disponibles */}
      <Typography variant="h5" gutterBottom>
        Rutas Disponibles
      </Typography>
      <Grid container spacing={2}>
        {availableRoutes.map((route) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={route.path}>
            <Card
              sx={{
                cursor: "pointer",
                "&:hover": { boxShadow: 6 },
              }}
              onClick={() => navigate(route.path)}
            >
              <CardContent>
                <Typography variant="h6">{route.name || route.path}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {route.path}
                </Typography>
                {route.requiredModule && (
                  <Chip
                    label={route.requiredModule}
                    size="small"
                    sx={{ mt: 1 }}
                  />
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
