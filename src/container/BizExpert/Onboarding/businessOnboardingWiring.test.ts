import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

function source(path: string) {
  return readFileSync(path, "utf8");
}

test("business onboarding is a real create flow, not a placeholder", () => {
  const page = source("src/app/onboarding/business/page.tsx");
  const form = source(
    "src/container/BizExpert/Onboarding/BusinessOnboardingForm.tsx",
  );
  const layout = source("src/app/onboarding/layout.tsx");
  const login = source("src/container/BizExpert/Auth/BizExpertLogin.tsx");
  const protect = source(
    "src/components/bizexpert/BizExpertAuthProtectWrapper.tsx",
  );
  const auth = source("src/store/bizexpert/auth-context.tsx");
  assert.equal(page.includes("DashboardSectionPlaceholder"), false);
  assert.equal(page.includes("BusinessOnboarding"), true);
  assert.equal(form.includes("registerOnboardingAccount"), true);
  assert.equal(form.includes("verifyOnboardingEmail"), true);
  assert.equal(form.includes("BusinessOnboardingOtp"), true);
  assert.equal(form.includes("needsAccount"), true);
  assert.equal(layout.includes("BizExpertAuthProvider"), true);
  assert.equal(login.includes("ONBOARDING_BUSINESS"), true);
  assert.equal(protect.includes("ONBOARDING_BUSINESS"), true);
  assert.equal(auth.includes("ONBOARDING_BUSINESS"), true);
  assert.equal(auth.includes("persistSession"), true);
});
