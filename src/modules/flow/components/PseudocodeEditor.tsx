import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";

const EXAMPLE = `Proceso EjemploDFD
  Definir edad Como Entero
  Escribir "Ingresa tu edad:"
  Leer edad
  Si edad >= 18 Entonces
    Escribir "Mayor de edad"
  SiNo
    Escribir "Menor de edad"
  FinSi
FinProceso`;

interface Props {
  onGenerate: (code: string) => void;
}

export const PseudocodeEditor: React.FC<Props> = ({ onGenerate }) => {
  const [code, setCode] = useState(EXAMPLE);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      <Typography variant="subtitle2" color="text.secondary">
        Código PSeInt
      </Typography>
      <TextField
        multiline
        minRows={12}
        maxRows={20}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        variant="outlined"
        size="small"
        inputProps={{
          style: {
            fontFamily: '"JetBrains Mono","Fira Mono","Courier New",monospace',
            fontSize: 13,
            lineHeight: 1.6,
          },
          spellCheck: false,
        }}
        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
      />
      <Button variant="contained" onClick={() => onGenerate(code)} sx={{ alignSelf: "flex-start" }}>
        Generar DFD
      </Button>
    </Box>
  );
};
