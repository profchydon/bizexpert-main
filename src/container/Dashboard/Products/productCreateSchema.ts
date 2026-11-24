import { z } from "zod";

const openingStockSchema = z.object({
  locationId: z.string().uuid(),
  quantity: z.coerce.number().min(0),
});

const variantDraftSchema = z.object({
  name: z.string().optional(),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  sellingPrice: z.coerce.number().optional(),
  purchaseCost: z.coerce.number().optional(),
  openingStock: z.array(openingStockSchema).optional(),
});

type VariantDraft = z.infer<typeof variantDraftSchema>;

function refineRequiredVariants(
  variants: VariantDraft[] | undefined,
  ctx: z.RefinementCtx,
) {
  if (!variants?.length) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Add at least one variant",
      path: ["variants"],
    });
    return;
  }
  variants.forEach((variant, index) => {
    if (!variant.name?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Variant name is required",
        path: ["variants", index, "name"],
      });
    }
    if (!variant.sellingPrice || variant.sellingPrice <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Selling price is required",
        path: ["variants", index, "sellingPrice"],
      });
    }
    if (!variant.purchaseCost || variant.purchaseCost <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Cost price is required",
        path: ["variants", index, "purchaseCost"],
      });
    }
  });
}

export const productCreateSchema = z
  .object({
    name: z.string().trim().min(1, "Product name is required"),
    kind: z.enum(["product", "service"]),
    category: z.string().optional(),
    subCategory: z.string().optional(),
    sku: z.string().optional(),
    barcode: z.string().optional(),
    baseUnit: z.string().trim().min(1, "Unit is required"),
    imageUrl: z
      .string()
      .trim()
      .optional()
      .refine(
        (value) => !value || /^https?:\/\/\S+$/i.test(value),
        "Enter a valid image URL or leave blank",
      ),
    locationIds: z.array(z.string().uuid()).min(1, "Select at least one store"),
    hasVariants: z.boolean(),
    sellingPrice: z.coerce.number().optional(),
    purchaseCost: z.coerce.number().optional(),
    lowStockThreshold: z.coerce.number().min(0).optional(),
    openingQuantity: z.coerce.number().min(0).optional(),
    openingStock: z.array(openingStockSchema).optional(),
    variants: z.array(variantDraftSchema).optional(),
  })
  .superRefine((values, ctx) => {
    if (values.hasVariants) {
      refineRequiredVariants(values.variants, ctx);
      return;
    }
    if (!values.sellingPrice || values.sellingPrice <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Selling price is required",
        path: ["sellingPrice"],
      });
    }
    if (!values.purchaseCost || values.purchaseCost <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Cost price is required",
        path: ["purchaseCost"],
      });
    }
  });

export type ProductCreateValues = z.infer<typeof productCreateSchema>;

export const productCreateDefaults: ProductCreateValues = {
  name: "",
  kind: "product",
  category: "",
  subCategory: "",
  sku: "",
  barcode: "",
  baseUnit: "piece",
  imageUrl: "",
  locationIds: [],
  hasVariants: false,
  sellingPrice: 0,
  purchaseCost: 0,
  lowStockThreshold: 0,
  openingQuantity: 0,
  openingStock: [],
  variants: [{ name: "", sellingPrice: 0, purchaseCost: 0, openingStock: [] }],
};

export function toProductCreatePayload(values: ProductCreateValues) {
  const trim = (value?: string) => {
    const next = value?.trim();
    return next ? next : undefined;
  };
  return {
    name: values.name.trim(),
    kind: values.kind,
    category: trim(values.category),
    subCategory: trim(values.subCategory),
    sku: trim(values.sku),
    barcode: trim(values.barcode),
    baseUnit: values.baseUnit.trim(),
    imageUrl: trim(values.imageUrl),
    locationIds: values.locationIds,
    hasVariants: values.hasVariants,
    lowStockThreshold: values.lowStockThreshold ?? 0,
    sellingPrice: values.hasVariants ? undefined : values.sellingPrice,
    purchaseCost: values.hasVariants ? undefined : values.purchaseCost,
    openingStock:
      values.kind === "product" &&
      !values.hasVariants &&
      values.openingQuantity &&
      values.openingQuantity > 0 &&
      values.locationIds[0]
        ? [
            {
              locationId: values.locationIds[0],
              quantity: values.openingQuantity,
            },
          ]
        : undefined,
    variants: values.hasVariants
      ? values.variants?.map((variant) => ({
          name: variant.name.trim(),
          sku: trim(variant.sku),
          barcode: trim(variant.barcode),
          sellingPrice: variant.sellingPrice,
          purchaseCost: variant.purchaseCost,
          openingStock:
            values.kind === "product" ? variant.openingStock : undefined,
        }))
      : undefined,
  };
}
