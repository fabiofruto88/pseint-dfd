import React from "react";
import { Alert, Box, Typography } from "@mui/material";
import type { ParserError } from "@/shared/types/flow.types";

interface Props {
  errors: ParserError[];
}

export const ErrorPanel: React.FC<Props> = ({ errors }) => {
  if (errors.length === 0) return null;
  return (
    <Box sx={{ mt: 1.5, display: "flex", flexDirection: "column", gap: 0.75 }}>
      <Typography variant="subtitle2" color="error">
        Errores de sintaxis ({errors.length})
      </Typography>
      {errors.map((e, i) => (
        <Alert key={`${e.line}-${e.column}-${i}`} severity="error" sx={{ py: 0.5 }}>
          Línea {e.line}, col {e.column}: {e.message}
        </Alert>
      ))}
    </Box>
  );
};
