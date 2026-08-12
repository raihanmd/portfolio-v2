export function formatTilDate(dateString: string): string {
  const formatted = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(dateString));
  return formatted.replace(",", "").toUpperCase();
}
