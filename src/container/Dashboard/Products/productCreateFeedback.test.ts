import assert from "node:assert/strict";
import { test } from "node:test";
import type { Location } from "@/types/bizexpert";
import {
  firstProductCreateError,
  preferredProductLocationIds,
} from "./productCreateFeedback";

const shop = (id: string, isDefault: boolean): Location => ({
  id,
  businessId: "b1",
  name: id,
  type: "shop",
  isDefault,
  isActive: true,
});

test("preferredProductLocationIds uses the default store", () => {
  const ids = preferredProductLocationIds([
    shop("11111111-1111-1111-1111-111111111111", false),
    shop("22222222-2222-2222-2222-222222222222", true),
  ]);
  assert.deepEqual(ids, ["22222222-2222-2222-2222-222222222222"]);
});

test("firstProductCreateError reads nested messages", () => {
  const message = firstProductCreateError({
    locationIds: { message: "Select at least one store", type: "too_small" },
  });
  assert.equal(message, "Select at least one store");
});
