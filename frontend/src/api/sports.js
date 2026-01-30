const API_BASE = "http://localhost:8000/api/v1";

export async function fetchSports() {
  const res = await fetch(`${API_BASE}/sports`);
  if (!res.ok) throw new Error("Failed to fetch sports");
  return res.json();
}

export async function fetchTurfs(sportId) {
  const res = await fetch(`${API_BASE}/sports/${sportId}/turfs`);
  if (!res.ok) throw new Error("Failed to fetch turfs");
  return res.json();
}