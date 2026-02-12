// lib/fetcher.ts
export async function publicFetcher(url: string) {
  const res = await fetch(url);

  if (!res.ok) throw new Error("Failed to fetch");
  const data = await res.json();

  return data.bookings;
}
export async function publicFetcherEventHalls(url: string) {
  const res = await fetch(url);

  if (!res.ok) throw new Error("Failed to fetch");

  const data = await res.json();
  return data.data; // ← event halls data буцаана
}
