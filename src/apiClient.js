import { CMS_STORAGE_KEY } from "./cmsData.js";

const JSON_HEADERS = { "Content-Type": "application/json" };
export class ApiError extends Error { constructor(message, status = 0) { super(message); this.name = "ApiError"; this.status = status; } }

async function apiRequest(path, options = {}) {
  const response = await fetch(path, { credentials: "include", ...options, headers: options.headers });
  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json") ? await response.json() : null;
  if (!response.ok || payload?.ok === false) throw new ApiError(payload?.message || `Ошибка API ${response.status}`, response.status);
  return payload;
}
export async function loadRemoteCms() { try { const payload = await apiRequest("/api/cms"); if (payload.data) window.localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(payload.data)); return payload.data || null; } catch { try { return JSON.parse(window.localStorage.getItem(CMS_STORAGE_KEY) || "null"); } catch { return null; } } }
export async function saveRemoteCms(data) { const payload = await apiRequest("/api/cms", { method: "POST", headers: JSON_HEADERS, body: JSON.stringify({ data }) }); window.localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(payload.data)); return payload.data; }
export async function loginRemote(login, password) { const payload = await apiRequest("/api/login", { method: "POST", headers: JSON_HEADERS, body: JSON.stringify({ login, password }) }); return payload.user; }
export async function logoutRemote() { await apiRequest("/api/logout", { method: "POST" }); }
export async function getRemoteSession() { const payload = await apiRequest("/api/me"); return payload.user || null; }
export async function uploadRemoteImage(file) { const formData = new FormData(); formData.append("image", file); const payload = await apiRequest("/api/media", { method: "POST", body: formData }); return payload.path; }
export async function submitLead(data) { const payload = await apiRequest("/api/leads", { method: "POST", headers: JSON_HEADERS, body: JSON.stringify(data) }); return payload.lead; }
