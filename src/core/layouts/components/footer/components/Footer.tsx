import {
  Box,
  Container,
  IconButton,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import { HiOutlineCpuChip } from "react-icons/hi2";
import { FaGithub } from "react-icons/fa";

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" mt={1}>
      {"© "}
      {new Date().getFullYear()} FlowPseud — Todos los derechos reservados.
    </Typography>
  );
}

export default function Footer() {
  return (
    <Container
      component="footer"
      sx={{
        minWidth: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: { xs: 3, sm: 4 },
        p: { xs: 3, sm: 5, md: 6 },
        textAlign: { sm: "center", md: "left" },
        borderTop: "1px solid",
        borderColor: "divider",
        mt: "auto",
        bgcolor: "background.paper",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          width: "100%",
          justifyContent: "space-between",
          alignItems: { xs: "center", sm: "flex-start" },
          gap: 3,
        }}
      >
        {/* Brand */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: { xs: "center", sm: "flex-start" },
            gap: 1,
            maxWidth: 350,
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <HiOutlineCpuChip size={24} />
            <Typography variant="h6" fontWeight={800}>
              FlowPseud
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            Herramienta gratuita para convertir pseudocódigo PSeInt en Diagramas
            de Flujo de Datos. Sin registro, sin complicaciones.
          </Typography>
        </Box>

        {/* Links */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            alignItems: { xs: "center", sm: "flex-start" },
          }}
        >
          <Typography variant="body2" fontWeight={600}>
            Navegación
          </Typography>
          <Link color="text.secondary" href="/" underline="hover">
            Inicio
          </Link>
          <Link color="text.secondary" href="/flow" underline="hover">
            Generador DFD
          </Link>
        </Box>

        {/* About */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            alignItems: { xs: "center", sm: "flex-start" },
          }}
        >
          <Typography variant="body2" fontWeight={600}>
            Acerca de
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ maxWidth: 220 }}
          >
            FlowPseud es un proyecto open source para estudiantes y docentes de
            programación.
          </Typography>
        </Box>
      </Box>

      {/* Bottom */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: "center",
          pt: 3,
          width: "100%",
          borderTop: "1px solid",
          borderColor: "divider",
          gap: 1,
        }}
      >
        <Copyright />
        <Stack direction="row" spacing={1}>
          <IconButton
            color="inherit"
            href="https://github.com/fabiofruto88/pseint-dfd"
            target="_blank"
            aria-label="GitHub"
            size="small"
          >
            <FaGithub size={20} />
          </IconButton>
        </Stack>
      </Box>
    </Container>
  );
}
