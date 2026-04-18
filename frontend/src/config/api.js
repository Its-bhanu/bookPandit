const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
const SOCKET_BASE = import.meta.env.VITE_SOCKET_BASE_URL || API_BASE;

export { API_BASE, SOCKET_BASE };
