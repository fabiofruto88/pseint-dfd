import React from "react";
import { Container, Grid, Typography, Box, Paper } from "@mui/material";
import { PseudocodeEditor } from "@/modules/flow/components/PseudocodeEditor";
import { ErrorPanel } from "@/modules/flow/components/ErrorPanel";
import { FlowViewer } from "@/modules/flow/components/FlowViewer";
import { usePseudocodeToDFD } from "@/core/hooks/usePseudocodeToDFD";

const FlowPage: React.FC = () => {
  const { graph, errors, generate } = usePseudocodeToDFD();

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Generador de DFD desde PSeInt
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Pega o escribe código PSeInt y genera automáticamente el diagrama de flujo.
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 3, height: "100%" }}>
            <PseudocodeEditor onGenerate={generate} />
            <ErrorPanel errors={errors} />
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 3, height: "100%" }}>
            {graph ? (
              <FlowViewer graph={graph} />
            ) : (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: 300,
                  color: "text.secondary",
                }}
              >
                <Typography variant="body2">
                  El diagrama aparecerá aquí después de generar.
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default FlowPage;
