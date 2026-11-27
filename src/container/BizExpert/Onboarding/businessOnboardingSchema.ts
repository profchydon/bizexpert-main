import { z } from "zod";

const optionalEmail = z
  .string()
  .trim()
  .optional()
  .refine(
    (value) => !value || z.string().email().safeParse(value).success,
    "Invalid email",
  );

export const businessOnboardingFieldsSchema = z.object({
  businessName: z.string().trim().min(1, "Business name is required"),
  phone: z.string().optional(),
  email: optionalEmail,
  address: z.string().optional(),
});

export const businessOnboardingAccountSchema = z.object({
  ownerName: z.string().trim().min(1, "Your name is required"),
  ownerEmail: z.string().trim().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const businessOnboardingLoggedInSchema =
  businessOnboardingFieldsSchema.extend({
    ownerName: z.string().optional(),
    ownerEmail: z.string().optional(),
    password: z.string().optional(),
  });

export const businessOnboardingSignupSchema =
  businessOnboardingAccountSchema.merge(businessOnboardingFieldsSchema);

export function businessOnboardingSchema(needsAccount: boolean) {
  return needsAccount
    ? businessOnboardingSignupSchema
    : businessOnboardingLoggedInSchema;
}

export type BusinessOnboardingValues = z.infer<
  typeof businessOnboardingSignupSchema
>;

export const businessOnboardingDefaults: BusinessOnboardingValues = {
  ownerName: "",
  ownerEmail: "",
  password: "",
  businessName: "",
  phone: "",
  email: "",
  address: "",
};
