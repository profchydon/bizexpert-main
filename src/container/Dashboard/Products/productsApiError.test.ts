import assert from "node:assert/strict";
import { test } from "node:test";
import { readProductsApiError } from "./productsApiError";

test("readProductsApiError joins Nest validation arrays", () => {
  const message = readProductsApiError({
    response: { data: { message: ["imageUrl must be a URL address"] } },
  });
  assert.equal(message, "imageUrl must be a URL address");
});

test("readProductsApiError reads a string Nest message", () => {
  const message = readProductsApiError({
    response: { data: { message: "Selling price and cost are required" } },
  });
  assert.equal(message, "Selling price and cost are required");
});

test("readProductsApiError explains a hung request", () => {
  assert.equal(
    readProductsApiError({ code: "ECONNABORTED" }),
    "The API timed out. Try again.",
  );
});

test("readProductsApiError explains a network failure", () => {
  assert.equal(
    readProductsApiError({ code: "ERR_NETWORK" }, "Failed to create product"),
    "Can't reach the API. Check that the app can call the API URL.",
  );
});
