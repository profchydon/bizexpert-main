import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { test } from "node:test";

test("app root does not ship a favicon.ico", () => {
  assert.equal(existsSync("src/app/favicon.ico"), false);
});
