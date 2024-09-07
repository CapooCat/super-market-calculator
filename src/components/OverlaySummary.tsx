import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { IFieldArray } from "@/models/IFieldArray";
import { IconPhoto } from "@tabler/icons-react";
import formatCurrency from "@/ultis/formatCurrency";
import Label from "./Label";

interface ISummary {
  lowest: IFieldArray;
  highest: IFieldArray;
  most: IFieldArray;
  least: IFieldArray;
}

interface IItem {
  title: string;
  item: IFieldArray;
}

const OverlaySummary = () => {
  const { control } = useFormContext();
  const fields = useWatch({ control, name: "fieldArray" });
  const summary: ISummary = fields.reduce(
    (result: ISummary, current: IFieldArray) => {
      result.lowest = result.lowest ?? current;
      result.highest = result.highest ?? current;
      result.least = result.least ?? current;
      result.most = result.most ?? current;

      result.lowest = current.price < result.lowest.price ? current : result.lowest;
      result.highest = current.price > result.highest.price ? current : result.highest;
      result.least = current.quantity < result.least.quantity ? current : result.least;
      result.most = current.quantity > result.most.quantity ? current : result.most;

      return result;
    },
    { lowestPrice: null, highestPrice: null }
  );

  const ItemImage = ({ src }) => {
    if (src)
      return (
        <div className="w-16">
          <img src={src} className="object-cover aspect-square rounded-xl" />
        </div>
      );
    else
      return (
        <div className="flex items-center justify-center w-16 bg-gray-900 border border-gray-700 rounded-xl">
          <IconPhoto />
        </div>
      );
  };

  const Item = ({ title, item }: IItem) => {
    return (
      <li className="py-4 first:pt-0 last:pb-0">
        <p className="pb-2 mb-2 font-bold">{title}</p>
        {item ? (
          <div className="flex gap-4">
            <ItemImage src={item.image} />
            <div className="flex flex-col w-full gap-2">
              <Label title="Giá sản phẩm:" value={formatCurrency(item.price)} />
              <Label title="Số lượng hiện tại:" value={item.quantity ?? 0} />
            </div>
          </div>
        ) : (
          <div>
            <p className="text-gray-500">Không có dữ liệu</p>
          </div>
        )}
      </li>
    );
  };

  return (
    <ul className="flex flex-col divide-y-2 divide-gray-700 divide-dashed">
      <Item title="Sản phẩm có đơn giá cao nhất:" item={summary.highest} />
      <Item title="Sản phẩm có đơn giá thấp nhất:" item={summary.lowest} />
      <Item title="Sản phẩm có số lượng cao nhất:" item={summary.most} />
      <Item title="Sản phẩm có số lượng thấp nhất:" item={summary.least} />
    </ul>
  );
};

export default OverlaySummary;
