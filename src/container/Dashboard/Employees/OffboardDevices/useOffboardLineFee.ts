import { useEffect, useMemo } from "react";
import { useGetServiceFeesQuery } from "@/api/baseQueries/feesApi/getServiceFees";
import type { DeviceLine } from "@/types/offboard";
import { buildServiceFeeTable, feeForDevice } from "./offboardPricing";
import { useResolvedAssetType } from "./useResolvedAssetType";

interface Args {
  employeeId: string;
  line: DeviceLine;
  onFee?: (lineId: string, fee: number) => void;
}

export const useOffboardLineFee = ({ line, onFee }: Args) => {
  const { data, isFetching } = useGetServiceFeesQuery();
  const assetType = useResolvedAssetType(line.assetType);
  const table = useMemo(() => buildServiceFeeTable(data?.data), [data?.data]);
  const amount = table
    ? feeForDevice(line.disposition, line.wipeType, table, assetType)
    : null;

  useEffect(() => {
    if (amount == null || amount === line.fee) return;
    onFee?.(line.id, amount);
  }, [amount, line.fee, line.id, onFee]);

  return {
    amount,
    table,
    assetType,
    isLoading: isFetching && amount == null,
  };
};
