import type { FieldErrors } from "react-hook-form";
import type { Location } from "@/types/bizexpert";
import type { ProductCreateValues } from "./productCreateSchema";

export function preferredProductLocationIds(locations: Location[]): string[] {
  if (!locations.length) return [];
  const preferred = locations.find((row) => row.isDefault) ?? locations[0];
  return [preferred.id];
}

export function firstProductCreateError(
  errors: FieldErrors<ProductCreateValues>,
): string {
  const walk = (value: unknown): string | undefined => {
    if (!value || typeof value !== "object") return;
    const record = value as { message?: unknown };
    if (typeof record.message === "string" && record.message) {
      return record.message;
    }
    for (const child of Object.values(value as Record<string, unknown>)) {
      const found = walk(child);
      if (found) return found;
    }
  };
  return walk(errors) ?? "Check the product form";
}
