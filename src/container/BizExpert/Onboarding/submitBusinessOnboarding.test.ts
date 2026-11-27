import assert from "node:assert/strict";
import { test } from "node:test";
import { businessOnboardingDefaults } from "./businessOnboardingSchema";
import { readBizExpertOnboardingError } from "./readBizExpertOnboardingError";
import {
  createOnboardingBusiness,
  registerChallenge,
  registerOnboardingAccount,
  verifyOnboardingEmail,
} from "./submitBusinessOnboarding";

const values = {
  ...businessOnboardingDefaults,
  ownerName: "Ada",
  ownerEmail: "ada@shop.ng",
  password: "Demo1234!",
  businessName: "Ada Stores",
};

test("registerOnboardingAccount requires email verification", async () => {
  assert.deepEqual(
    registerChallenge({
      requiresVerification: true,
      email: "ada@shop.ng",
    }),
    { email: "ada@shop.ng" },
  );
  assert.throws(() => registerChallenge({ user: {}, token: "tok" }));
  const calls: string[] = [];
  const challenge = await registerOnboardingAccount(
    {
      post: async (url) => {
        calls.push(`POST ${url}`);
        return {
          data: { requiresVerification: true, email: "ada@shop.ng" },
        };
      },
      get: async () => ({ data: {} }),
    },
    values,
  );
  assert.deepEqual(calls, ["POST /auth/register"]);
  assert.equal(challenge.email, "ada@shop.ng");
});

test("verifyOnboardingEmail then createOnboardingBusiness", async () => {
  const calls: string[] = [];
  const user = { id: "u1", name: "Ada", email: "ada@shop.ng", isActive: true };
  const session = await verifyOnboardingEmail(
    {
      post: async (url) => {
        calls.push(`POST ${url}`);
        return { data: { user, token: "tok" } };
      },
      get: async () => ({ data: {} }),
    },
    "ada@shop.ng",
    "123456",
  );
  assert.deepEqual(calls, ["POST /auth/verify-email"]);
  assert.equal(session.token, "tok");
  const business = await createOnboardingBusiness(
    {
      post: async (url) => {
        calls.push(`POST ${url}`);
        return { data: { id: "b1", name: "Ada Stores" } };
      },
      get: async (url) => {
        calls.push(`GET ${url}`);
        return {
          data: {
            id: "b1",
            name: "Ada Stores",
            locations: [{ id: "l1", name: "Main Location" }],
          },
        };
      },
    },
    values,
    "tok",
  );
  assert.deepEqual(calls, [
    "POST /auth/verify-email",
    "POST /businesses",
    "GET /businesses/b1",
  ]);
  assert.equal(business.locations?.[0]?.name, "Main Location");
});

test("readBizExpertOnboardingError reads Nest array messages", () => {
  assert.equal(
    readBizExpertOnboardingError({
      response: { data: { message: ["name should not be empty"] } },
    }),
    "name should not be empty",
  );
  assert.equal(
    readBizExpertOnboardingError(null),
    "Could not create the business",
  );
});
