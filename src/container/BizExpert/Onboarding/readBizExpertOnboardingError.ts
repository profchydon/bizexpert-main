function nestMessage(data: unknown): string | undefined {
  if (!data || typeof data !== "object" || !("message" in data)) return;
  const message = (data as { message: unknown }).message;
  if (typeof message === "string" && message.trim()) return message;
  if (!Array.isArray(message)) return;
  const parts = message.filter(
    (row): row is string => typeof row === "string" && row.trim().length > 0,
  );
  if (parts.length) return parts.join(". ");
}

function axiosBits(err: unknown): { code?: string; data?: unknown } {
  if (!err || typeof err !== "object") return {};
  const record = err as { code?: unknown; response?: { data?: unknown } };
  return {
    code: typeof record.code === "string" ? record.code : undefined,
    data: record.response?.data,
  };
}

export function readBizExpertOnboardingError(
  err: unknown,
  fallback = "Could not create the business",
): string {
  const { code, data } = axiosBits(err);
  if (code === "ECONNABORTED") return "The API timed out. Try again.";
  if (code === "ERR_NETWORK") {
    return "Can't reach the API. Check that the app can call the API URL.";
  }
  return nestMessage(data) ?? fallback;
}
