// lib/fetcher.ts
export async function authFetcher(url: string) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to fetch");

  const data = await res.json();
  return data.bookings;
}
