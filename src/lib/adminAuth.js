const SESSION_KEY = "admin_auth_ok";

export function isAdminAuthenticated() {
  return sessionStorage.getItem(SESSION_KEY) === "true";
}

export function setAdminAuthenticated() {
  sessionStorage.setItem(SESSION_KEY, "true");
}

export function clearAdminAuthenticated() {
  sessionStorage.removeItem(SESSION_KEY);
}

export async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}