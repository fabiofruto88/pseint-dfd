import React from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Grid,
  Stack,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineCodeBracket,
  HiOutlineCpuChip,
  HiOutlineEye,
  HiOutlineArrowDown,
  HiOutlineArrowRight,
  HiOutlineRocketLaunch,
  HiOutlineDocumentText,
  HiOutlinePhoto,
} from "react-icons/hi2";

const features = [
  {
    icon: <HiOutlineCodeBracket size={36} />,
    title: "Escribe tu pseudocódigo",
    description:
      "Pega o escribe tu algoritmo en pseudocódigo compatible con PSeInt. Soportamos todas las estructuras: Si, Mientras, Para, Repetir y más.",
  },
  {
    icon: <HiOutlineCpuChip size={36} />,
    title: "Análisis automático",
    description:
      "Nuestro parser analiza tu código en tiempo real, detecta errores de sintaxis y genera el árbol de instrucciones internamente.",
  },
  {
    icon: <HiOutlineEye size={36} />,
    title: "Visualiza el DFD",
    description:
      "Obtenés un Diagrama de Flujo de Datos profesional, con formas estándar: inicio/fin, procesos, decisiones y entrada/salida.",
  },
  {
    icon: <HiOutlinePhoto size={36} />,
    title: "Exporta como imagen",
    description:
      "Descargá tu diagrama en formato PNG con un solo clic para incluirlo en tus trabajos, informes o presentaciones.",
  },
];

const steps = [
  { number: "1", text: "Pega tu pseudocódigo PSeInt" },
  { number: "2", text: 'Presiona "Generar DFD"' },
  { number: "3", text: "Visualiza y exporta tu diagrama" },
];

const Home: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.primary.light} 100%)`,
          color: "#fff",
          py: { xs: 8, md: 14 },
          px: 2,
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h2"
            component="h1"
            fontWeight={800}
            sx={{ fontSize: { xs: "2rem", sm: "2.8rem", md: "3.5rem" } }}
            gutterBottom
          >
            FlowPseud
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
              opacity: 0.92,
              maxWidth: 650,
              mx: "auto",
              mb: 4,
              lineHeight: 1.6,
            }}
          >
            Convierte tu pseudocódigo PSeInt en Diagramas de Flujo al instante.
            Sin registro, sin complicaciones.
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
          >
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/flow")}
              startIcon={<HiOutlineRocketLaunch size={20} />}
              sx={{
                bgcolor: "#fff",
                color: theme.palette.primary.dark,
                fontWeight: 700,
                px: 4,
                py: 1.5,
                fontSize: "1rem",
                "&:hover": { bgcolor: "#f0f0f0" },
              }}
            >
              Empezar ahora
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* What is FlowPseud */}
      <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 } }}>
        <Box textAlign="center" mb={6}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            ¿Qué es FlowPseud?
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              maxWidth: 700,
              mx: "auto",
              fontSize: { xs: "0.95rem", md: "1.1rem" },
              lineHeight: 1.8,
            }}
          >
            FlowPseud es una herramienta web gratuita que transforma tu
            pseudocódigo escrito en formato PSeInt en un Diagrama de Flujo de
            Datos (DFD) visual. No es un editor de pseudocódigo: simplemente
            pegas tu algoritmo y nosotros lo graficamos para vos.
          </Typography>
        </Box>

        {/* How it works */}
        <Box textAlign="center" mb={8}>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            ¿Cómo funciona?
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
            alignItems="center"
            sx={{ mt: 4 }}
          >
            {steps.map((step, idx) => (
              <React.Fragment key={step.number}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    textAlign: "center",
                    minWidth: { xs: "100%", sm: 180 },
                    maxWidth: 220,
                    borderRadius: 3,
                  }}
                >
                  <Typography
                    variant="h3"
                    fontWeight={800}
                    color="primary"
                    gutterBottom
                  >
                    {step.number}
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {step.text}
                  </Typography>
                </Paper>
                {idx < steps.length - 1 && (
                  <Box
                    sx={{
                      display: { xs: "none", sm: "flex" },
                      alignItems: "center",
                    }}
                  >
                    <HiOutlineArrowRight
                      size={28}
                      color={theme.palette.primary.main}
                    />
                  </Box>
                )}
                {idx < steps.length - 1 && (
                  <Box
                    sx={{
                      display: { xs: "flex", sm: "none" },
                      justifyContent: "center",
                    }}
                  >
                    <HiOutlineArrowDown
                      size={28}
                      color={theme.palette.primary.main}
                    />
                  </Box>
                )}
              </React.Fragment>
            ))}
          </Stack>
        </Box>
      </Container>

      {/* Features */}
      <Box sx={{ bgcolor: "background.paper", py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            fontWeight={700}
            textAlign="center"
            gutterBottom
            sx={{ mb: 6 }}
          >
            Características
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, idx) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
                <Paper
                  elevation={1}
                  sx={{
                    p: 4,
                    height: "100%",
                    textAlign: "center",
                    borderRadius: 3,
                    transition: "box-shadow 0.3s, transform 0.3s",
                    "&:hover": {
                      boxShadow: 6,
                      transform: "translateY(-4px)",
                    },
                  }}
                >
                  <Box sx={{ color: "primary.main", mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    lineHeight={1.7}
                  >
                    {feature.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Supported structures */}
      <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 } }}>
        <Typography
          variant="h4"
          fontWeight={700}
          textAlign="center"
          gutterBottom
          sx={{ mb: 2 }}
        >
          Estructuras soportadas
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          textAlign="center"
          sx={{ mb: 4 }}
        >
          Compatibilidad completa con la sintaxis de PSeInt
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          {[
            "Definir variables",
            "Leer / Escribir",
            "Asignación (<-)",
            "Si / SiNo / FinSi",
            "Mientras / FinMientras",
            "Para / FinPara",
            "Repetir / Hasta Que",
          ].map((item) => (
            <Grid size={{ xs: 6, sm: 4, md: 3 }} key={item}>
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  textAlign: "center",
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                }}
              >
                <HiOutlineDocumentText
                  size={18}
                  color={theme.palette.primary.main}
                />
                <Typography variant="body2" fontWeight={500}>
                  {item}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA */}
      <Box
        sx={{
          bgcolor: theme.palette.primary.main,
          color: "#fff",
          py: { xs: 6, md: 8 },
          textAlign: "center",
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="h4" fontWeight={700} gutterBottom>
            ¿Listo para visualizar tu algoritmo?
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, opacity: 0.9 }}>
            No necesitas crear una cuenta. Solo pega tu pseudocódigo y genera tu
            diagrama de flujo.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/flow")}
            startIcon={<HiOutlineRocketLaunch size={20} />}
            sx={{
              bgcolor: "#fff",
              color: theme.palette.primary.dark,
              fontWeight: 700,
              px: 5,
              py: 1.5,
              fontSize: "1.05rem",
              "&:hover": { bgcolor: "#f0f0f0" },
            }}
          >
            Ir al generador
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
