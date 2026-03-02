// src/utils/cookies.ts

/**
 * Utilidades para manejo de cookies
 */
export class CookieUtils {
  /**
   * Obtener una cookie por nombre
   */
  static getCookie(name: string): string | null {
    const value = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${name}=`))
      ?.split("=")[1];

    return value ? decodeURIComponent(value) : null;
  }

  /**
   * Establecer una cookie
   */
  static setCookie(
    name: string,
    value: string,
    days: number = 7,
    options: {
      secure?: boolean;
      sameSite?: "Strict" | "Lax" | "None";
      path?: string;
    } = {}
  ) {
    const { secure = true, sameSite = "Lax", path = "/" } = options;

    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

    let cookieString = `${name}=${encodeURIComponent(
      value
    )}; expires=${expires.toUTCString()}; path=${path}; SameSite=${sameSite}`;

    if (secure) {
      cookieString += "; Secure";
    }

    document.cookie = cookieString;
  }

  /**
   * Eliminar una cookie
   */
  static deleteCookie(name: string, path: string = "/") {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};`;
  }

  /**
   * Verificar si el token ha expirado
   */
  static isTokenExpired(): boolean {
    const expires = this.getCookie("tokenExpires");
    if (!expires) return true;

    return Date.now() >= parseInt(expires);
  }
}
