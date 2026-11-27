import assert from "node:assert/strict";
import { test } from "node:test";
import {
  businessOnboardingDefaults,
  businessOnboardingSchema,
} from "./businessOnboardingSchema";
import {
  blankToUndefined,
  toCreateBusinessPayload,
  toRegisterPayload,
} from "./businessOnboardingPayload";

test("signup schema requires owner, password, and business name", () => {
  const schema = businessOnboardingSchema(true);
  assert.equal(schema.safeParse(businessOnboardingDefaults).success, false);
  const parsed = schema.safeParse({
    ...businessOnboardingDefaults,
    ownerName: "Ada",
    ownerEmail: "ada@shop.ng",
    password: "Demo1234!",
    businessName: "Ada Stores",
  });
  assert.equal(parsed.success, true);
});

test("logged-in schema only requires business name", () => {
  const schema = businessOnboardingSchema(false);
  assert.equal(
    schema.safeParse({ ...businessOnboardingDefaults, businessName: "Ada" })
      .success,
    true,
  );
  assert.equal(schema.safeParse(businessOnboardingDefaults).success, false);
});

test("payloads omit blank optional fields and lowercase emails", () => {
  assert.equal(blankToUndefined("  "), undefined);
  assert.equal(blankToUndefined("Lagos"), "Lagos");
  const values = {
    ...businessOnboardingDefaults,
    ownerName: " Ada ",
    ownerEmail: "Ada@Shop.ng",
    password: "Demo1234!",
    businessName: " Ada Stores ",
    email: " Contact@Shop.ng ",
    phone: "",
    address: " 14 Broad ",
  };
  assert.deepEqual(toRegisterPayload(values), {
    name: "Ada",
    email: "ada@shop.ng",
    password: "Demo1234!",
  });
  assert.deepEqual(toCreateBusinessPayload(values), {
    name: "Ada Stores",
    phone: undefined,
    email: "contact@shop.ng",
    address: "14 Broad",
  });
});
