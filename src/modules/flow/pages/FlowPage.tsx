import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { usePseudocodeToDFD } from "@/core/hooks/usePseudocodeToDFD";
import { ErrorPanel } from "@/shared/ui/ErrorPanel";
import FlowViewer from "@/core/renderer/FlowViewer";

const sample = `Proceso Ejemplo
  Definir x Como Entero
  Leer x
  Si x > 0 Entonces
    Escribir "Positivo"
  SiNo
    Escribir "No positivo"
  FinSi
FinProceso`;

export default function FlowPage() {
  const [text, setText] = useState(sample);
  const { graph, errors, generate } = usePseudocodeToDFD();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Generar DFD desde PSeInt
      </Typography>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack spacing={2}>
          <TextField
            label="Pega tu pseudocódigo PSeInt"
            value={text}
            onChange={(e) => setText(e.target.value)}
            multiline
            minRows={10}
            fullWidth
            slotProps={{
              input: {
                sx: { fontFamily: "monospace", fontSize: 14 },
              },
            }}
          />
          <Box>
            <Button variant="contained" onClick={() => generate(text)}>
              Generar DFD
            </Button>
          </Box>
        </Stack>
        <ErrorPanel errors={errors} />
      </Paper>

      {graph && (
        <Paper sx={{ p: 2, minHeight: 400 }}>
          <FlowViewer graph={graph} />
        </Paper>
      )}
    </Container>
  );
}
