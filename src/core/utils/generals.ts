/* eslint-disable @typescript-eslint/no-explicit-any */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to convert file to base64"));
      }
    };
    reader.onerror = () => reject(new Error("Error reading file"));
    reader.readAsDataURL(file);
  });
};

/**
 * Convierte una imagen `File` a base64 intentando optimizar tamaño/quality.
 * - Redimensiona manteniendo aspecto si supera `maxWidth`/`maxHeight`.
 * - Intenta reducir la calidad (JPEG) iterativamente hasta alcanzar `maxSizeKB`.
 * Devuelve un data URL en formato `image/jpeg`.
 */
export const imageFileToOptimizedBase64 = (
  file: File,
  options?: {
    maxSizeKB?: number; // objetivo en KB
    maxWidth?: number;
    maxHeight?: number;
    initialQuality?: number; // 0-1
    minQuality?: number; // 0-1
  }
): Promise<string> => {
  const {
    maxSizeKB = 200,
    maxWidth = 1024,
    maxHeight = 1024,
    initialQuality = 0.9,
    minQuality = 0.4,
  } = options || {};

  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("El archivo no es una imagen"));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Error leyendo la imagen"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Error cargando la imagen"));
      if (typeof reader.result !== "string") {
        reject(new Error("Formato de imagen inválido"));
        return;
      }
      img.src = reader.result;
      img.onload = () => {
        try {
          const origW = img.naturalWidth;
          const origH = img.naturalHeight;

          // calcular escala manteniendo aspecto
          const ratio = Math.min(
            1,
            maxWidth / origW || 1,
            maxHeight / origH || 1
          );
          let targetW = Math.round(origW * ratio);
          let targetH = Math.round(origH * ratio);

          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("No se pudo crear canvas"));
            return;
          }

          const targetBytes = maxSizeKB * 1024;
          let quality = initialQuality;
          let dataUrl = "";
          let currentBytes = Infinity;
          let attempts = 0;

          const produceDataUrl = () => {
            canvas.width = targetW;
            canvas.height = targetH;
            ctx.clearRect(0, 0, targetW, targetH);
            ctx.drawImage(img, 0, 0, targetW, targetH);
            dataUrl = canvas.toDataURL("image/jpeg", quality);
            // Aproximación de bytes: base64 length -> bytes
            const base64 = dataUrl.split(",")[1] || "";
            currentBytes = Math.ceil((base64.length * 3) / 4);
          };

          produceDataUrl();

          // Iterar reduciendo quality y si hace falta, resolución
          while (currentBytes > targetBytes && attempts < 12) {
            attempts += 1;
            if (quality > minQuality) {
              quality = Math.max(minQuality, quality * 0.8);
            } else {
              // reducir resolución
              targetW = Math.max(100, Math.round(targetW * 0.8));
              targetH = Math.max(100, Math.round(targetH * 0.8));
              quality = Math.max(minQuality, quality * 0.95);
            }
            produceDataUrl();
          }

          if (!dataUrl) {
            reject(new Error("No se pudo optimizar la imagen"));
            return;
          }

          resolve(dataUrl);
        } catch (err) {
          reject(err);
        }
      };
    };
    reader.readAsDataURL(file);
  });
};

export const base64ToFile = (base64: string, filename = "file"): File => {
  const parts = base64.split(",");
  const meta = parts[0] || "";
  const data = parts[1] || "";
  const mimeMatch = meta.match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : "application/octet-stream";
  const binary = atob(data);
  let length = binary.length;
  const u8arr = new Uint8Array(length);
  while (length--) {
    u8arr[length] = binary.charCodeAt(length);
  }
  return new File([u8arr], filename, { type: mime });
};

/**
 * Convierte un data URL/base64 a un elemento `HTMLImageElement` cargado.
 * Devuelve una Promise que resuelve con la imagen cuando se haya cargado,
 * o se rechaza si ocurre un error al cargarla.
 */
export const base64ToImage = (
  base64?: string | null
): Promise<HTMLImageElement | null> => {
  return new Promise((resolve, reject) => {
    // If caller passed undefined or null, resolve with null (non-fatal).
    if (base64 === undefined || base64 === null) {
      resolve(null);
      return;
    }

    if (typeof base64 !== "string" || base64.trim() === "") {
      reject(new Error("base64 inválido"));
      return;
    }

    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () =>
      reject(new Error("Error al crear la imagen a partir de base64"));
    img.src = base64;
  });
};

//Example: "fabio andres fruto jimenez" -> "Fabio Andres Fruto Jimenez"

export const capitalizeName = (name: string): string => {
  if (!name) return "";
  const words = name.trim().split(/\s+/);
  const capitalizeToken = (token: string) => {
    // Keep delimiters '-' and '\'' when splitting
    const parts = token.split(/(-|')/);
    return parts
      .map((p) => {
        if (p === "-" || p === "'") return p;
        return p.charAt(0).toUpperCase() + p.slice(1).toLowerCase();
      })
      .join("");
  };
  return words.map(capitalizeToken).join(" ");
};

// Navigation filter util
import { type NavigationItem } from "../../modules/auth/config/navigation.config";

export const filterNavItems = (
  items: NavigationItem[],
  params?: {
    hasModule?: (moduleName: string) => boolean;
    userRole?: string | null | undefined;
  }
): NavigationItem[] => {
  const { hasModule, userRole } = params || {};

  return items
    .filter((item) => {
      // Support new `role` (string) or `roles` (string[]) fields in NavigationItem
      const itemRoles: string | string[] | undefined =
        (item as any).role ?? (item as any).roles;
      if (itemRoles) {
        if (!userRole) return false;
        if (typeof itemRoles === "string") {
          if (itemRoles !== userRole) return false;
        } else if (Array.isArray(itemRoles)) {
          if (!itemRoles.includes(userRole)) return false;
        }
      }

      // If no module required, keep
      if (!item.requiredModule) return true;

      // If module is required, use the provided hasModule checker if available
      if (hasModule) return hasModule(item.requiredModule);

      // If we can't check modules, be conservative and hide
      return false;
    })
    .map((item) => ({
      ...item,
      children: item.children
        ? filterNavItems(item.children, params)
        : undefined,
    }));
};
