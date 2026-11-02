export function uid(): string {
  try {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return crypto.randomUUID();
    }
  } catch {
    /* fallback below */
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
