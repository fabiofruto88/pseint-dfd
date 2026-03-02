// src/layouts/components/Footer.tsx
import {
  Box,
  Button,
  Container,
  IconButton,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import useRequest from "@/core/hooks/useRequest";

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" mt={1}>
      {"Copyright © "}
      <Link href="#">footer base ts </Link>
      {new Date().getFullYear()}
    </Typography>
  );
}

export default function Footer() {
  const [email, setEmail] = useState("");
  const { post, loading } = useRequest();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await post("/masinfo", { correo: email }, false);
      setEmail("");
      alert("¡Gracias! Te enviaremos más información.");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Container
      component="footer"
      sx={{
        minWidth: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: { xs: 4, sm: 8 },
        p: { xs: 4, sm: 8, md: 10 },
        textAlign: { sm: "center", md: "left" },
        borderTop: "1px solid",
        borderColor: "divider",
        mt: "auto", // Empuja el footer al fondo
        bgcolor: "background.paper",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        {/* Newsletter */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            minWidth: { xs: "100%", sm: "60%" },
          }}
        >
          <Box sx={{ width: { xs: "100%", sm: "60%" } }}>
            <Box sx={{ ml: "-15px" }}>
              {/*  <img src={logo} style={logoStyle} alt="Logo" /> */}
            </Box>
            <Typography variant="body2" fontWeight={600} gutterBottom>
              footer base ts
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              ¿De qué se trata?, ¡pide más info a tu correo!
            </Typography>
            <Stack direction="row" spacing={1} useFlexGap>
              <TextField
                size="small"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Tu correo electrónico"
                type="email"
                disabled={loading}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ flexShrink: 0 }}
                disabled={loading}
              >
                {loading ? "Enviando..." : "Más info"}
              </Button>
            </Stack>
          </Box>
        </Box>

        {/* Sistema */}
        <Box
          sx={{
            display: { xs: "none", sm: "flex" },
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Typography variant="body2" fontWeight={600}>
            Sistema
          </Typography>
          <Link color="text.secondary" href="#">
            Documentación
          </Link>
          <Link color="text.secondary" href="#">
            FAQs
          </Link>
        </Box>

        {/* Desarrolladores */}
        {/* <Box
          sx={{
            display: { xs: "none", sm: "flex" },
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Typography variant="body2" fontWeight={600}>
            Desarrolladores
          </Typography>
          <Link
            color="text.secondary"
            href="https://www.instagram.com/fabiofruto8/"
            target="_blank"
          >
            Fabio Fruto
          </Link>
          <Link
            color="text.secondary"
            href="https://www.instagram.com/jesulin_jimenez"
            target="_blank"
          >
            Jesus Jimenez
          </Link>
        </Box> */}

        {/* Legal */}
        <Box
          sx={{
            display: { xs: "none", sm: "flex" },
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Typography variant="body2" fontWeight={600}>
            Legal
          </Typography>
          <Link color="text.secondary" href="#">
            Términos
          </Link>
          <Link color="text.secondary" href="#">
            Privacidad
          </Link>
        </Box>
      </Box>

      {/* Bottom */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          pt: { xs: 4, sm: 8 },
          width: "100%",
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <div>
          <Link color="text.secondary" href="#">
            Política de privacidad
          </Link>
          <Typography display="inline" sx={{ mx: 0.5, opacity: 0.5 }}>
            &nbsp;•&nbsp;
          </Typography>
          <Link color="text.secondary" href="#">
            Términos y condiciones
          </Link>
          <Copyright />
        </div>
        <Stack direction="row" justifyContent="left" spacing={1} useFlexGap>
          <IconButton color="inherit" href="#" aria-label="Logo UIB">
            {/*  <img src={logo2} style={logoStyle2} alt="Logo de UIB" /> */}
          </IconButton>
        </Stack>
      </Box>
    </Container>
  );
}
