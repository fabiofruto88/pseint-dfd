import React from "react";
import { Container, Typography, Box, Paper, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box mt={8}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            PSeInt DFD Generator
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Convierte pseudocódigo PSeInt en diagramas de flujo (DFD) automáticamente.
          </Typography>
          <Button variant="contained" size="large" onClick={() => navigate("/dfd")}>
            Abrir Generador de DFD
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default Home;
