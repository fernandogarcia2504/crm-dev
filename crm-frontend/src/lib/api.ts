// Helper de API del CRM (token de staff).
const API_BASE = "http://localhost:3000/api";

function authHeaders(): HeadersInit {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(path: string, options: RequestInit): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...authHeaders(),
            ...(options.headers || {})
        }
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error((data as { message?: string }).message || "Error en la solicitud");
    }

    return data as T;
}

export const api = {
    get: <T>(path: string) => request<T>(path, { method: "GET" }),
    post: <T>(path: string, body?: unknown) =>
        request<T>(path, { method: "POST", body: JSON.stringify(body ?? {}) }),
    put: <T>(path: string, body?: unknown) =>
        request<T>(path, { method: "PUT", body: JSON.stringify(body ?? {}) }),
    patch: <T>(path: string, body?: unknown) =>
        request<T>(path, { method: "PATCH", body: JSON.stringify(body ?? {}) }),
    del: <T>(path: string) => request<T>(path, { method: "DELETE" })
};
