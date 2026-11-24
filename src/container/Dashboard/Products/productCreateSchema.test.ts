import assert from "node:assert/strict";
import { test } from "node:test";
import {
  productCreateSchema,
  toProductCreatePayload,
} from "./productCreateSchema";

test("toProductCreatePayload sends variants when hasVariants is true", () => {
  const payload = toProductCreatePayload({
    name: "T-Shirt",
    kind: "product",
    category: "Apparel",
    baseUnit: "piece",
    imageUrl: "",
    locationIds: ["11111111-1111-1111-1111-111111111111"],
    hasVariants: true,
    variants: [
      {
        name: "Small",
        sellingPrice: 5000,
        purchaseCost: 3000,
        openingStock: [
          {
            locationId: "11111111-1111-1111-1111-111111111111",
            quantity: 4,
          },
        ],
      },
    ],
  });
  assert.equal(payload.hasVariants, true);
  assert.equal(payload.variants?.[0]?.name, "Small");
  assert.equal(payload.sellingPrice, undefined);
  assert.equal(payload.purchaseCost, undefined);
});

test("toProductCreatePayload maps opening quantity onto the first store", () => {
  const payload = toProductCreatePayload({
    name: "Soap",
    kind: "product",
    baseUnit: "piece",
    imageUrl: "",
    locationIds: ["11111111-1111-1111-1111-111111111111"],
    hasVariants: false,
    sellingPrice: 400,
    purchaseCost: 200,
    openingQuantity: 12,
  });
  assert.deepEqual(payload.openingStock, [
    {
      locationId: "11111111-1111-1111-1111-111111111111",
      quantity: 12,
    },
  ]);
});

test("toProductCreatePayload omits opening stock when quantity is empty", () => {
  const payload = toProductCreatePayload({
    name: "Soap",
    kind: "product",
    baseUnit: "piece",
    imageUrl: "",
    locationIds: ["11111111-1111-1111-1111-111111111111"],
    hasVariants: false,
    sellingPrice: 400,
    purchaseCost: 200,
    openingQuantity: 0,
  });
  assert.equal(payload.openingStock, undefined);
});

test("productCreateSchema accepts a blank image URL", () => {
  const parsed = productCreateSchema.safeParse({
    name: "Soap",
    kind: "product",
    baseUnit: "piece",
    imageUrl: "",
    locationIds: ["11111111-1111-1111-1111-111111111111"],
    hasVariants: false,
    sellingPrice: 400,
    purchaseCost: 200,
  });
  assert.equal(parsed.success, true);
});

test("productCreateSchema rejects a non-URL image", () => {
  const parsed = productCreateSchema.safeParse({
    name: "Soap",
    kind: "product",
    baseUnit: "piece",
    imageUrl: "not-a-url",
    locationIds: ["11111111-1111-1111-1111-111111111111"],
    hasVariants: false,
    sellingPrice: 400,
    purchaseCost: 200,
  });
  assert.equal(parsed.success, false);
});

test("productCreateSchema ignores empty draft variants when unchecked", () => {
  const parsed = productCreateSchema.safeParse({
    name: "Soap",
    kind: "product",
    baseUnit: "piece",
    imageUrl: "",
    locationIds: ["11111111-1111-1111-1111-111111111111"],
    hasVariants: false,
    sellingPrice: 400,
    purchaseCost: 200,
    variants: [
      { name: "", sellingPrice: 0, purchaseCost: 0, openingStock: [] },
    ],
  });
  assert.equal(parsed.success, true);
});

test("productCreateSchema requires a variant name only when checked", () => {
  const parsed = productCreateSchema.safeParse({
    name: "T-Shirt",
    kind: "product",
    baseUnit: "piece",
    imageUrl: "",
    locationIds: ["11111111-1111-1111-1111-111111111111"],
    hasVariants: true,
    variants: [{ name: "", sellingPrice: 5000, purchaseCost: 3000 }],
  });
  assert.equal(parsed.success, false);
  if (parsed.success) return;
  assert.equal(
    parsed.error.issues.some(
      (issue) => issue.message === "Variant name is required",
    ),
    true,
  );
});

test("productCreateSchema requires prices for a simple product", () => {
  const parsed = productCreateSchema.safeParse({
    name: "Soap",
    kind: "product",
    baseUnit: "piece",
    imageUrl: "",
    locationIds: ["11111111-1111-1111-1111-111111111111"],
    hasVariants: false,
    sellingPrice: 0,
    purchaseCost: 0,
  });
  assert.equal(parsed.success, false);
});
