import { API_BASE_URL } from "./base.js";

export async function fetchTeams() {
  const res = await fetch(`${API_BASE_URL}/api/v1/teams`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch teams");
  return res.json();
}

export async function createTeam(name) {
  const res = await fetch(`${API_BASE_URL}/api/v1/teams`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error("Failed to create team");
  return res.json();
}
