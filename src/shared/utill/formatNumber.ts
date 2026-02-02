export function formatNumber(value: number | string, options?: { round?: boolean }) {
  if (!value || value === 0) return 0;

  let numValue =
    typeof value === "string" ? parseFloat(value.replace(/,/g, "")) : value;

  if (isNaN(numValue)) return "";
  if (options?.round) {
    numValue = Math.round(numValue);
  }
  return numValue.toLocaleString("ko-KR");
}

export function parseNumber(value: string) {
  const parsed = parseFloat(value.replace(/,/g, ""))
  return isNaN(parsed) ? 0 : parsed
}