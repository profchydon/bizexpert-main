import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

test("home page sends BizExpert users to login", () => {
  const source = readFileSync("src/app/page.tsx", "utf8");
  assert.match(source, /isBizExpertApp\(\)/);
  assert.match(source, /redirect\(routes\.LOGIN\)/);
});

test("Rayda onboarding index sends BizExpert users to login", () => {
  const source = readFileSync("src/app/onboarding/page.tsx", "utf8");
  assert.match(source, /isBizExpertApp\(\)/);
  assert.match(source, /redirect\(routes\.LOGIN\)/);
});

test("BizExpert create-business onboarding is a dedicated route", () => {
  const source = readFileSync("src/app/onboarding/business/page.tsx", "utf8");
  assert.match(source, /isBizExpertApp\(\)/);
  assert.match(source, /BusinessOnboarding/);
  assert.equal(source.includes("DashboardSectionPlaceholder"), false);
});
