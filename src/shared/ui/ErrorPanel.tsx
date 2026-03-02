import {
  Alert,
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import type { ParserError } from "@/core/parser/parsePseudocode";

interface Props {
  errors: ParserError[];
}

export const ErrorPanel: React.FC<Props> = ({ errors }) => {
  if (!errors.length) return null;
  return (
    <Box sx={{ mt: 2 }}>
      <Alert severity="error" sx={{ mb: 1 }}>
        Se encontraron {errors.length} errores de sintaxis
      </Alert>
      <List dense>
        {errors.map((e, idx) => (
          <ListItem key={idx} disableGutters>
            <ListItemText
              primary={`L${e.line}:C${e.column} — ${e.message}`}
              primaryTypographyProps={{ fontSize: 13 }}
            />
          </ListItem>
        ))}
      </List>
      <Typography variant="caption" color="text.secondary">
        Corrige el error antes de generar el diagrama.
      </Typography>
    </Box>
  );
};
