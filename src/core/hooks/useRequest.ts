/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/useRequest.tsx
import { useState, useCallback, useRef } from "react";
import axios from "axios";
import type {
  AxiosInstance,
  AxiosRequestConfig,
  CancelTokenSource,
} from "axios";
import { CookieUtils } from "../utils/cookies";

// ============================================
// TIPOS
// ============================================
export interface RequestState<T = any> {
  data: T | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

export interface UseRequestReturn<T = any> {
  // Estados
  data: T | null;
  loading: boolean;
  error: string | null;
  success: boolean;

  // Función principal
  loadReq: (
    endpoint: string,
    token: boolean,
    type: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
    body?: any,
    files?: boolean
  ) => Promise<T>;
  reset: () => void;
  cancel: () => void;

  // Funciones de conveniencia
  get: (endpoint: string, requiresAuth?: boolean) => Promise<T>;
  post: (
    endpoint: string,
    body?: any,
    requiresAuth?: boolean,
    files?: boolean
  ) => Promise<T>;
  put: (
    endpoint: string,
    body?: any,
    requiresAuth?: boolean,
    files?: boolean
  ) => Promise<T>;
  delete: (endpoint: string, requiresAuth?: boolean) => Promise<T>;
}

// ============================================
// HOOK useRequest
// ============================================
export const useRequest = <T = any>(): UseRequestReturn<T> => {
  // Estados principales
  const [state, setState] = useState<RequestState<T>>({
    data: null,
    loading: false,
    error: null,
    success: false,
  });

  // Referencia para cancelar peticiones con Axios
  const cancelTokenRef = useRef<CancelTokenSource | null>(null);

  // Instancia de Axios
  const axiosInstance = useRef<AxiosInstance | null>(null);

  // ============================================
  // Inicializar Axios
  // ============================================
  const getAxiosInstance = useCallback(() => {
    if (!axiosInstance.current) {
      const baseURL = import.meta.env.VITE_API_URL;

      if (!baseURL) {
        throw new Error(
          "URL de la API no está configurada en las variables de entorno (VITE_API_URL)"
        );
      }

      axiosInstance.current = axios.create({
        baseURL,
        timeout: 10000,
        withCredentials: true,
      });

      // Interceptor para agregar headers
      axiosInstance.current.interceptors.request.use((config) => {
        config.headers = config.headers || {};
        console.log("📤 Petición:", config.method?.toUpperCase(), config.url);
        return config;
      });

      // Interceptor para manejo de errores
      axiosInstance.current.interceptors.response.use(
        (response) => {
          console.log("✅ Respuesta:", response.config.url);
          return response;
        },
        (error) => {
          if (
            error.response?.status === 401 ||
            error.response?.status === 403
          ) {
            handleAuthError();
          }
          return Promise.reject(error);
        }
      );
    }

    return axiosInstance.current;
  }, []);

  // ============================================
  // Obtener token desde cookies
  // ============================================
  const getAuthToken = useCallback((): string | null => {
    if (CookieUtils.isTokenExpired()) {
      return null;
    }
    return CookieUtils.getCookie("accessToken");
  }, []);

  // ============================================
  // Manejar errores de autenticación
  // ============================================
  const handleAuthError = useCallback(() => {
    console.warn("🚫 Error de autenticación - limpiando cookies");
    CookieUtils.deleteCookie("accessToken");
    CookieUtils.deleteCookie("refreshToken");
    CookieUtils.deleteCookie("tokenExpires");
    CookieUtils.deleteCookie("user");
    // window.location.href = "/login"; // Descomenta si quieres redirect automático
  }, []);

  // ============================================
  // FUNCIÓN PRINCIPAL: loadReq
  // ============================================
  const loadReq = useCallback(
    async (
      endpoint: string,
      token: boolean,
      type: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
      body?: any,
      files: boolean = false
    ): Promise<T> => {
      const requiresAuth = token;

      // Cancelar petición anterior si existe
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel("Nueva petición iniciada");
      }

      // Crear nuevo cancel token
      cancelTokenRef.current = axios.CancelToken.source();

      // Resetear estados
      setState((prev) => ({
        ...prev,
        loading: true,
        error: null,
        success: false,
      }));

      try {
        const axiosInst = getAxiosInstance();

        // Configurar headers
        const headers: Record<string, string> = {};

        // Agregar token si es requerido
        if (requiresAuth) {
          const authToken = getAuthToken();
          if (authToken) {
            headers["Authorization"] = `Bearer ${authToken}`;
          } else {
            throw new Error("Token de autenticación no disponible");
          }
        }

        // Configurar la petición
        const config: AxiosRequestConfig = {
          method: type.toLowerCase() as any,
          url: endpoint,
          headers,
          cancelToken: cancelTokenRef.current.token,
        };

        // Agregar datos según el método
        if (type !== "GET" && body) {
          if (files || body instanceof FormData) {
            config.data = body;
            headers["Content-Type"] = "multipart/form-data";
          } else {
            config.data = body;
            headers["Content-Type"] = "application/json";
          }
        }

        // Hacer la petición
        const response = await axiosInst.request<T>(config);

        // Actualizar estado con éxito
        setState({
          data: response.data,
          loading: false,
          error: null,
          success: true,
        });

        return response.data;
      } catch (error: any) {
        // No actualizar estado si la petición fue cancelada
        if (axios.isCancel(error)) {
          return Promise.reject(error);
        }

        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Error de conexión. Intenta nuevamente.";

        setState({
          data: null,
          loading: false,
          error: errorMessage,
          success: false,
        });

        throw new Error(errorMessage);
      }
    },
    [getAuthToken, handleAuthError, getAxiosInstance]
  );

  // ============================================
  // FUNCIONES AUXILIARES
  // ============================================
  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      success: false,
    });
  }, []);

  const cancel = useCallback(() => {
    if (cancelTokenRef.current) {
      cancelTokenRef.current.cancel("Petición cancelada por el usuario");
      cancelTokenRef.current = null;
    }
  }, []);

  // ============================================
  // FUNCIONES DE CONVENIENCIA
  // ============================================
  const get = useCallback(
    (endpoint: string, requiresAuth: boolean = true) => {
      return loadReq(endpoint, requiresAuth, "GET");
    },
    [loadReq]
  );

  const post = useCallback(
    (
      endpoint: string,
      body?: any,
      requiresAuth: boolean = true,
      files: boolean = false
    ) => {
      return loadReq(endpoint, requiresAuth, "POST", body, files);
    },
    [loadReq]
  );

  const put = useCallback(
    (
      endpoint: string,
      body?: any,
      requiresAuth: boolean = true,
      files: boolean = false
    ) => {
      return loadReq(endpoint, requiresAuth, "PUT", body, files);
    },
    [loadReq]
  );

  const deleteRequest = useCallback(
    (endpoint: string, requiresAuth: boolean = true) => {
      return loadReq(endpoint, requiresAuth, "DELETE");
    },
    [loadReq]
  );

  return {
    // Estados
    data: state.data,
    loading: state.loading,
    error: state.error,
    success: state.success,

    // Función principal
    loadReq,
    reset,
    cancel,

    // Funciones de conveniencia
    get,
    post,
    put,
    delete: deleteRequest,
  };
};

export default useRequest;
