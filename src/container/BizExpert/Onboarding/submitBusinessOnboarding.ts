import type { Business, User } from "@/types/bizexpert";
import {
  toCreateBusinessPayload,
  toRegisterPayload,
} from "./businessOnboardingPayload";
import type { BusinessOnboardingValues } from "./businessOnboardingSchema";

export type JsonClient = {
  post: (
    url: string,
    data: unknown,
    config?: { headers?: Record<string, string> },
  ) => Promise<{ data: unknown }>;
  get: (
    url: string,
    config?: { headers?: Record<string, string> },
  ) => Promise<{ data: unknown }>;
};

function asUser(value: unknown): User {
  return value as User;
}

function asBusiness(value: unknown): Business {
  return value as Business;
}

export function registerChallenge(data: unknown): { email: string } {
  const record = data as { requiresVerification?: unknown; email?: unknown };
  if (
    record.requiresVerification !== true ||
    typeof record.email !== "string"
  ) {
    throw new Error("Register did not start email verification");
  }
  return { email: record.email };
}

function sessionResult(data: unknown): { user: User; token: string } {
  const record = data as { user?: unknown; token?: unknown };
  if (!record.user || typeof record.token !== "string") {
    throw new Error("Verify did not return a user and token");
  }
  return { user: asUser(record.user), token: record.token };
}

export async function registerOnboardingAccount(
  api: JsonClient,
  values: BusinessOnboardingValues,
): Promise<{ email: string }> {
  const registered = await api.post(
    "/auth/register",
    toRegisterPayload(values),
  );
  return registerChallenge(registered.data);
}

export async function verifyOnboardingEmail(
  api: JsonClient,
  email: string,
  otp: string,
): Promise<{ user: User; token: string }> {
  const verified = await api.post("/auth/verify-email", { email, otp });
  return sessionResult(verified.data);
}

export async function resendOnboardingOtp(api: JsonClient, email: string) {
  await api.post("/auth/resend-otp", { email });
}

export async function createOnboardingBusiness(
  api: JsonClient,
  values: BusinessOnboardingValues,
  token?: string,
): Promise<Business> {
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
  const created = await api.post(
    "/businesses",
    toCreateBusinessPayload(values),
    { headers },
  );
  const business = asBusiness(created.data);
  if (!business?.id) {
    throw new Error("Create business did not return an id");
  }
  try {
    const full = await api.get(`/businesses/${business.id}`, { headers });
    return asBusiness(full.data);
  } catch {
    return business;
  }
}

export async function submitBusinessOnboarding(input: {
  values: BusinessOnboardingValues;
  api: JsonClient;
  token?: string;
}): Promise<Business> {
  return createOnboardingBusiness(input.api, input.values, input.token);
}
