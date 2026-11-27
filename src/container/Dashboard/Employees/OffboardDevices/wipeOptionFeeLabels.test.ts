import assert from "node:assert/strict";
import { test } from "node:test";
import { buildServiceFeeTable } from "./offboardServiceFees";
import { wipeOptionFeeLabels } from "./wipeOptionFeeLabels";

const table = buildServiceFeeTable({
  Storage: { Macbook: 25 },
  Factory_Reset: 20,
  Dispose: 75,
  Reassignment: 99,
});

test("wipe dropdown labels use the catalog fee for that action", () => {
  const labels = wipeOptionFeeLabels(
    "STORE",
    table,
    "Macbook",
    (amount) => `£${amount}`,
  );

  assert.equal(labels.None, "None · £25");
  assert.equal(labels["Full Factory Reset"], "Full Factory Reset · £45");
});

test("wipe dropdown labels stay on the catalog when the table is missing", () => {
  const labels = wipeOptionFeeLabels(
    "STORE",
    null,
    "Macbook",
    (amount) => `£${amount}`,
  );

  assert.equal(labels.None, "None · £0");
});
