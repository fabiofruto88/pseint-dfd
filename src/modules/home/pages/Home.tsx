import React from "react";
import { Container, Typography, Box, Paper } from "@mui/material";

const Home: React.FC = () => {
  return (
    <Container maxWidth="sm">
      <Box mt={8}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Página de Inicio
          </Typography>
          <Typography variant="body1">
            Esta es una base de prueba usando Material UI.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Home;
