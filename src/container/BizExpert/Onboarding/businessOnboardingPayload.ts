import type { BusinessOnboardingValues } from "./businessOnboardingSchema";

export function blankToUndefined(value?: string): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export function toRegisterPayload(values: BusinessOnboardingValues) {
  return {
    name: values.ownerName.trim(),
    email: values.ownerEmail.trim().toLowerCase(),
    password: values.password,
  };
}

export function toCreateBusinessPayload(values: BusinessOnboardingValues) {
  return {
    name: values.businessName.trim(),
    phone: blankToUndefined(values.phone),
    email: blankToUndefined(values.email)?.toLowerCase(),
    address: blankToUndefined(values.address),
  };
}
