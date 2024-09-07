import React, { memo, useEffect, useRef, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import formatCurrency from "@/ultis/formatCurrency";
import { classNames } from "primereact/utils";

interface ITotal {
  priceField: string;
  quantityField: string;
}

interface ITotalStatus {
  type: "isIncrease" | "isDecrease";
  byAmount: number;
}

const FormTotal = memo(function ({ priceField, quantityField }: ITotal) {
  const { control } = useFormContext();
  const totalToastRef = useRef<HTMLDivElement>(null);
  const [total, setTotal] = useState<number | null>(null);
  const [totalStatus, setTotalStatus] = useState<ITotalStatus | null>(null);
  const price = useWatch({ control, name: priceField });
  const quantity = useWatch({ control, name: quantityField });

  const totalToast = classNames("absolute inset-0 w-fit h-fit -left-6 top-10 opacity-0 px-3 rounded-lg", {
    "text-green-500 bg-green-500/25 toast-plus": totalStatus?.type == "isIncrease",
    "text-red-500 bg-red-500/25 toast-minus": totalStatus?.type == "isDecrease",
  });

  const totalLabel = classNames("font-bold", {
    "text-sm": formatCurrency(total ?? 0).length >= 13,
    "text-xs": formatCurrency(total ?? 0).length >= 16,
  });

  useEffect(() => {
    if (totalStatus) {
      totalToastRef.current?.classList.add("animation-toast");
      const timer = setTimeout(() => totalToastRef.current?.classList.remove("animation-toast"), 700);
      return () => clearTimeout(timer);
    }
    return;
  }, [totalStatus]);

  useEffect(() => {
    const newTotal = (price ?? 0) * quantity;
    totalToastRef.current?.classList.remove("animation-toast");
    if (total != null) {
      newTotal > total && setTotalStatus({ type: "isIncrease", byAmount: newTotal - total });
      newTotal < total && setTotalStatus({ type: "isDecrease", byAmount: total - newTotal });
      newTotal == total && setTotalStatus(null);
    }

    setTotal(newTotal);
  }, [price, quantity]);

  return (
    <div className="relative">
      <span className={totalLabel}>{formatCurrency(total ?? 0)}</span>
      <div className={totalToast} ref={totalToastRef}>
        {formatCurrency(totalStatus ? totalStatus.byAmount : 0)}
      </div>
    </div>
  );
});

export default FormTotal;
