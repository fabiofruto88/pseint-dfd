import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  InformationCircleIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import type { AlertType } from "@/types/common";

interface AlertModalProps {
  open: boolean;
  type: AlertType;
  title: string;
  description: string;
  onCancel: () => void;
  onConfirm?: () => void;
  cancelText?: string;
  confirmText?: string;
  showCancel?: boolean;
  showConfirm?: boolean;
}

const alertConfig: Record<
  AlertType,
  { icon: React.ElementType; color: string; bgColor: string }
> = {
  info: {
    icon: InformationCircleIcon,
    color: "#2196F3",
    bgColor: "#E3F2FD",
  },
  error: {
    icon: XCircleIcon,
    color: "#F44336",
    bgColor: "#FFEBEE",
  },
  success: {
    icon: CheckCircleIcon,
    color: "#4CAF50",
    bgColor: "#E8F5E9",
  },
  danger: {
    icon: ExclamationCircleIcon,
    color: "#FF5722",
    bgColor: "#FBE9E7",
  },
  warning: {
    icon: ExclamationTriangleIcon,
    color: "#FF9800",
    bgColor: "#FFF3E0",
  },
  question: {
    icon: QuestionMarkCircleIcon,
    color: "#9C27B0",
    bgColor: "#F3E5F5",
  },
};

const AlertModal: React.FC<AlertModalProps> = ({
  open,
  type,
  title,
  description,
  onCancel,
  onConfirm,
  cancelText = "cancel",
  confirmText = "confirm",
  showCancel = true,
  showConfirm = true,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const config = alertConfig[type];
  const IconComponent = config.icon;

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onCancel();
  };

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 4,
          padding: isMobile ? 2 : 3,
          maxWidth: 500,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pt: 2,
        }}
      >
        <Box
          sx={{
            width: isMobile ? 64 : 80,
            height: isMobile ? 64 : 80,
            borderRadius: "50%",
            backgroundColor: config.bgColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2,
          }}
        >
          <IconComponent
            style={{
              width: isMobile ? 40 : 48,
              height: isMobile ? 40 : 48,
              color: config.color,
            }}
          />
        </Box>

        <DialogTitle
          sx={{
            textAlign: "center",
            fontSize: isMobile ? "1.25rem" : "1.5rem",
            fontWeight: 600,
            padding: 0,
            mb: 1,
          }}
        >
          {title}
        </DialogTitle>
      </Box>

      <DialogContent sx={{ textAlign: "center", px: isMobile ? 2 : 3 }}>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            fontSize: isMobile ? "0.875rem" : "1rem",
            lineHeight: 1.6,
          }}
        >
          {description}
        </Typography>
      </DialogContent>

      <DialogActions
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column-reverse" : "row",
          gap: isMobile ? 1 : 2,
          padding: isMobile ? "16px 16px 8px" : "16px 24px 24px",
          justifyContent: "center",
        }}
      >
        {showCancel && (
          <Button
            onClick={onCancel}
            variant="outlined"
            fullWidth={isMobile}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: 500,
              padding: "10px 24px",
              borderColor: "#E0E0E0",
              color: "#666",
              "&:hover": {
                borderColor: "#BDBDBD",
                backgroundColor: "#F5F5F5",
              },
            }}
          >
            {cancelText}
          </Button>
        )}

        {showConfirm && (
          <Button
            onClick={handleConfirm}
            variant="contained"
            fullWidth={isMobile}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: 500,
              padding: "10px 24px",
              backgroundColor: config.color,
              "&:hover": {
                backgroundColor: config.color,
                filter: "brightness(0.9)",
              },
            }}
          >
            {confirmText}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
export default AlertModal;
