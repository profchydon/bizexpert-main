"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { SlideoutMenu } from "@/components/application/slideout-menus/slideout-menu";
import { Button } from "@/components/ui/button";
import { bizexpertApi } from "@/lib/bizexpert/api";
import { useBizExpertBusiness } from "@/store/bizexpert/business-context";
import type { Category, Location } from "@/types/bizexpert";
import { categoriesQueryKeys } from "../Categories/categoriesQueryKeys";
import {
  mainCategorySelectOptions,
  subCategorySelectOptions,
} from "../Categories/categorySelectOptions";
import { locationsQueryKeys } from "../Locations/locationsQueryKeys";
import { ProductCreateFormFields } from "./ProductCreateFormFields";
import { ProductVariantEditor } from "./ProductVariantEditor";
import { readProductsApiError } from "./productsApiError";
import { PRODUCT_FORM_SLIDEOUT_RESIZE } from "./productsPageClasses";
import {
  firstProductCreateError,
  preferredProductLocationIds,
} from "./productCreateFeedback";
import {
  productCreateDefaults,
  productCreateSchema,
  toProductCreatePayload,
  type ProductCreateValues,
} from "./productCreateSchema";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export function SingleProductCreateSlideout({ isOpen, onClose }: Props) {
  const { businessId } = useBizExpertBusiness();
  const qc = useQueryClient();
  const form = useForm<ProductCreateValues>({
    resolver: zodResolver(productCreateSchema),
    defaultValues: productCreateDefaults,
  });

  const { data: categories } = useQuery({
    queryKey: categoriesQueryKeys.list(businessId ?? ""),
    enabled: !!businessId && isOpen,
    queryFn: async () => {
      const res = await bizexpertApi.get(
        `/businesses/${businessId}/categories`,
      );
      return res.data as Category[];
    },
  });

  const { data: locations } = useQuery({
    queryKey: locationsQueryKeys.list(businessId ?? ""),
    enabled: !!businessId && isOpen,
    queryFn: async () => {
      const res = await bizexpertApi.get(`/businesses/${businessId}/locations`);
      return res.data as Location[];
    },
  });

  useEffect(() => {
    if (!isOpen) return;
    form.reset(productCreateDefaults);
  }, [form, isOpen]);

  useEffect(() => {
    if (!isOpen || !locations?.length) return;
    if (form.getValues("locationIds").length) return;
    form.setValue("locationIds", preferredProductLocationIds(locations), {
      shouldValidate: true,
    });
  }, [form, isOpen, locations]);

  const close = () => {
    form.reset(productCreateDefaults);
    onClose();
  };

  const onSubmit = async (values: ProductCreateValues) => {
    if (!businessId) {
      toast.error("No business selected");
      return;
    }
    try {
      await bizexpertApi.post(
        `/businesses/${businessId}/products/full`,
        toProductCreatePayload(values),
      );
      toast.success("Product created");
      await qc.invalidateQueries({ queryKey: ["products"] });
      await qc.invalidateQueries({ queryKey: ["inventory-products"] });
      close();
    } catch (err) {
      toast.error(readProductsApiError(err, "Failed to create product"));
    }
  };

  const submitProduct = form.handleSubmit(onSubmit, (errors) => {
    toast.error(firstProductCreateError(errors));
  });

  const mainCategory = form.watch("category") ?? "";
  const categoryOptions = mainCategorySelectOptions(
    categories ?? [],
    mainCategory,
  );
  const subCategoryOptions = subCategorySelectOptions(
    categories ?? [],
    mainCategory,
    form.watch("subCategory"),
  );
  const hasVariants = form.watch("hasVariants");
  const kind = form.watch("kind");
  const locationIds = form.watch("locationIds");

  return (
    <SlideoutMenu
      isOpen={isOpen}
      onOpenChange={(open) => !open && close()}
      isDismissable={false}
      ariaLabel="Add single product"
      resizeOptions={PRODUCT_FORM_SLIDEOUT_RESIZE}
    >
      <SlideoutMenu.Header
        onClose={close}
        className="pb-5 shadow-[inset_0px_-1px_0px_0px] shadow-border-secondary"
      >
        <h2 className="text-lg font-semibold text-primary">Single product</h2>
        <p className="mt-1 text-sm text-tertiary">
          Match Lumi-style setup: type, stores, variants, and opening stock.
        </p>
      </SlideoutMenu.Header>
      <form
        className="flex min-h-0 flex-1 flex-col overflow-hidden"
        onSubmit={(event) => {
          event.preventDefault();
          void submitProduct();
        }}
      >
        <SlideoutMenu.Content className="space-y-4">
          <ProductCreateFormFields
            form={form}
            categoryOptions={categoryOptions}
            subCategoryOptions={subCategoryOptions}
            locations={locations ?? []}
          />
          {hasVariants ? (
            <ProductVariantEditor
              form={form}
              showStock={kind === "product"}
              defaultLocationId={locationIds[0]}
            />
          ) : null}
        </SlideoutMenu.Content>
        <SlideoutMenu.Footer className="flex flex-col gap-3 bg-primary sm:flex-row sm:items-center sm:justify-end">
          {form.formState.isSubmitted && !form.formState.isValid ? (
            <p className="mr-auto text-sm text-error-600">
              {firstProductCreateError(form.formState.errors)}
            </p>
          ) : null}
          <Button type="button" variant="outline" onClick={close}>
            Cancel
          </Button>
          <Button
            type="button"
            isLoading={form.formState.isSubmitting}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              void submitProduct();
            }}
          >
            Create product
          </Button>
        </SlideoutMenu.Footer>
      </form>
    </SlideoutMenu>
  );
}
