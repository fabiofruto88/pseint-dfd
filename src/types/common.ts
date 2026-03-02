/* eslint-disable @typescript-eslint/no-explicit-any */
export type AlertType =
  | "info"
  | "error"
  | "success"
  | "danger"
  | "warning"
  | "question";
export interface ModalConfig {
  open: boolean;
  type: AlertType;
  title: string;
  description: string;
  cancelText?: string;
  confirmText?: string;
  onConfirm?: () => void;
}
