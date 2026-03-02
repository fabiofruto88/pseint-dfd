import { useState, useCallback } from "react";

// Tipos para las notificaciones
export type NotificationType = "error" | "success" | "info" | "warning";

export interface NotificationState {
  open: boolean;
  message: string;
  type: NotificationType;
  duration: number;
}

// Función para mostrar notificaciones con parámetros opcionales
export type ShowNotificationFn = (
  message: string,
  type?: NotificationType,
  duration?: number
) => void;

/**
 * Hook personalizado para manejar notificaciones tipo Snackbar
 * Mejoras sobre el hook original:
 * - Mejor nomenclatura y estructura
 * - Control de duración más preciso
 * - Función de cierre manual
 * - Estado consolidado en un objeto
 * - Uso de useCallback para optimización de rendimiento
 */
const useNotification = () => {
  // Estado consolidado de la notificación
  const [notification, setNotification] = useState<NotificationState>({
    open: false,
    message: "",
    type: "info",
    duration: 4000, // Duración por defecto
  });

  // Función optimizada para mostrar notificaciones
  const showNotification: ShowNotificationFn = useCallback(
    (
      message: string,
      type: NotificationType = "info",
      duration: number = 4000
    ) => {
      // Primero cerramos cualquier notificación activa
      setNotification((prev) => ({ ...prev, open: false }));

      // Pequeño delay para permitir que se cierre la anterior
      setTimeout(() => {
        setNotification({
          open: true,
          message,
          type,
          duration,
        });
      }, 100);
    },
    []
  );

  // Función para cerrar manualmente la notificación
  const closeNotification = useCallback(() => {
    setNotification((prev) => ({ ...prev, open: false }));
  }, []);

  // Función para cerrar automáticamente después de la duración especificada
  const handleAutoClose = useCallback(
    (_event?: React.SyntheticEvent | Event, reason?: string) => {
      // No cerrar si el usuario hace clic fuera (clickaway)
      if (reason === "clickaway") {
        return;
      }
      closeNotification();
    },
    [closeNotification]
  );

  return {
    // Estado de la notificación
    notification,
    // Funciones de control
    showNotification,
    closeNotification,
    handleAutoClose,
    // Propiedades individuales para compatibilidad con el código existente
    isOpen: notification.open,
    message: notification.message,
    type: notification.type,
    duration: notification.duration,
  };
};

export default useNotification;
