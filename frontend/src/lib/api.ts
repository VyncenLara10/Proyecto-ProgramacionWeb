// ============================================
// 📌 Cliente Axios definitivo
// --------------------------------------------
// Este archivo centraliza toda la comunicación
// con tu backend Django DRF.
// Aquí configuras la URL base, los headers
// y el manejo de tokens (cuando uses JWT).
//
// ❌ Este archivo NO se toca más.
// ✅ Todo lo demás se hace en "services"
// (items.ts, payments.ts, etc.)
// ============================================

import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

// ============================================
// 1. Cliente Axios base
// --------------------------------------------
// baseURL: se toma de .env.local
// headers: todas las peticiones son JSON
// ============================================
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: { "Content-Type": "application/json" },
});

// ============================================
// 2. Tokens para JWT (cuando uses login)
// --------------------------------------------
// Por ahora están vacíos, pero cuando tengas
// login en tu backend, guardarás los tokens aquí.
// ============================================
let accessToken: string | null = null;
let refreshToken: string | null = null;

export function setTokens(access: string, refresh: string) {
    accessToken = access;
    refreshToken = refresh;
}

export function clearTokens() {
    accessToken = null;
    refreshToken = null;
}

// ============================================
// 3. Interceptor de REQUEST
// --------------------------------------------
// Antes de cada petición:
// - Si hay accessToken, lo agrega en el header
//   Authorization: Bearer <token>
// Así no repites este código en cada service.
// ============================================
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    if (accessToken) {
        config.headers = {
        ...config.headers,
        Authorization: `Bearer ${accessToken}`,
        };
    }
    return config;
});

// ============================================
// 4. Interceptor de RESPONSE
// --------------------------------------------
// Manejo central de errores o refresh token.
// Por ahora devuelve el error tal cual.
// En el futuro:
//   - Puedes refrescar el token si da 401.
//   - Mostrar notificaciones de error.
//   - Redirigir al login.
// ============================================
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// ============================================
// 5. Exportar cliente
// --------------------------------------------
// Ahora en tus services (items.ts, payments.ts...)
// usas "api.get", "api.post", etc.
// ============================================
export default api;
