import React from "react";
import {
  Snackbar,
  Alert,
  Slide,
  type SlideProps,
  type SnackbarCloseReason,
} from "@mui/material";
import type { NotificationState } from "@/core/hooks/useNotification";

interface NotificationSnackbarProps {
  notification: NotificationState;
  onClose: (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => void;
}

// Transición personalizada para el Snackbar
function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="up" />;
}

export default function NotificationSnackbar({
  notification,
  onClose,
}: NotificationSnackbarProps) {
  return (
    <Snackbar
      open={notification.open}
      autoHideDuration={notification.duration}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      slots={{ transition: SlideTransition }}
      sx={{
        // Estilos responsivos para diferentes tamaños de pantalla
        "& .MuiSnackbar-root": {
          minWidth: { xs: "280px", sm: "320px" },
          maxWidth: { xs: "90vw", sm: "600px" },
        },
      }}
    >
      <Alert
        onClose={onClose}
        severity={notification.type}
        variant="filled"
        sx={{
          width: "100%",
          fontSize: { xs: "0.875rem", sm: "0.9rem" },
          fontWeight: 500,
          justifyContent: "center",
          // Sombra sutil para dar profundidad
          boxShadow: (theme) => theme.shadows[6],
          // Bordes redondeados consistentes
          borderRadius: 2,

          // Estilos para el ícono de cierre
          "& .MuiAlert-action": {
            paddingLeft: 1,
          },
        }}
      >
        {notification.message}
      </Alert>
    </Snackbar>
  );
}
