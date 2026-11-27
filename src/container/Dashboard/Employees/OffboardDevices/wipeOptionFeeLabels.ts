import {
  feeForDevice,
  getWipeOptions,
  type Disposition,
  type ServiceFeeTable,
  type WipeType,
} from "./offboardPricing";

export function wipeOptionFeeLabels(
  disposition: Disposition,
  table: ServiceFeeTable | null | undefined,
  assetType: string | undefined,
  format: (amount: number) => string,
): Partial<Record<WipeType, string>> {
  const labels: Partial<Record<WipeType, string>> = {};
  getWipeOptions(disposition).forEach((option) => {
    const amount = feeForDevice(disposition, option.value, table, assetType);
    labels[option.value] = `${option.label} · ${format(amount)}`;
  });
  return labels;
}
