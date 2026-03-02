/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ShowNotificationFn } from "@/core/hooks/useNotification";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  modules: string[];
  avatar?: string;
}

export interface LoginResponse {
  message?: string;
  token: string;
  user: User;
  refreshToken?: string;
  expiresIn?: number;
}

/**
 * Configuración de una ruta protegida
 */
export interface RouteConfig {
  path: string;
  component: React.ReactElement;
  requiredModule?: string;
  requiredModules?: string[];
  requireAllModules?: string[];
  isPublic?: boolean;
  layout?: "public" | "authenticated"; // 👈 AÑADIR ESTA LÍNEA
  name?: string;
}
export interface LoginFormInputs {
  email: string;
  password: string;
}
export interface LoginFromProps {
  showNotification: ShowNotificationFn;
}
