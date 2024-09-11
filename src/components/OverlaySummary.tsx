import React, { useEffect, useRef } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { IconPhoto } from "@tabler/icons-react";
import { classNames } from "primereact/utils";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import download from "downloadjs";
import { toPng } from "html-to-image";
import dayjs from "dayjs";
import { IFieldArray } from "@/models/IFieldArray";
import formatCurrency from "@/ultis/formatCurrency";
import Label from "./Label";

interface ISummary {
  lowest: IFieldArray | null;
  highest: IFieldArray | null;
  most: IFieldArray | null;
  total: {
    price: number;
    quantity: number;
    item: number;
  };
}

const OverlaySummary = () => {
  const { control } = useFormContext();
  const printComponent = useRef(null);
  const fields: IFieldArray[] = useWatch({ control, name: "fieldArray" });
  const summary: ISummary = fields.reduce(
    (result: ISummary, current: IFieldArray) => {
      result.lowest = result.lowest ?? current;
      result.highest = result.highest ?? current;
      result.most = result.most ?? current;

      result.lowest = current.price < result.lowest.price * result.lowest.quantity ? current : result.lowest;
      result.highest = current.price > result.highest.price * result.highest.quantity ? current : result.highest;
      result.most = current.quantity > result.most.quantity ? current : result.most;
      result.total.price += current.price;
      result.total.quantity += current.quantity;
      result.total.item += 1;

      return result;
    },
    {
      lowest: null,
      highest: null,
      most: null,
      total: {
        price: 0,
        quantity: 0,
        item: 0,
      },
    }
  );

  const Image = ({ src }: { src: string }) => {
    const image = classNames("size-36 aspect-square h-fit", {
      "flex items-center justify-center bg-gray-900 border-gray-700 rounded-xl": !src,
    });

    if (src)
      return (
        <div className={image}>
          <img src={src} className="object-cover aspect-square rounded-xl" />
        </div>
      );
    else
      return (
        <div className={image}>
          <IconPhoto />
        </div>
      );
  };

  const Item = ({ item }: { item: IFieldArray }) => {
    return (
      <li className="pb-4 last:pb-0">
        <div className="flex flex-shrink-0 gap-4 ">
          <Image src={item.image} />
          <div className="flex flex-col justify-start w-full gap-1">
            <Label title="Giá sản phẩm:" value={formatCurrency(item.price)} />
            <Label title="Số lượng:" value={item.quantity ?? 0} />
            <Label title="Tổng:" value={formatCurrency(item.price * item.quantity)} />
            <div className="flex gap-2 pt-1">
              {summary.highest?.price == item.price && <Tag value="Giá cao nhất" severity="danger" />}
              {summary.lowest?.price == item.price && <Tag value="Giá thấp nhất" severity="success" />}
              {summary.most?.quantity == item.quantity && <Tag value="SL nhiều nhất" />}
            </div>
          </div>
        </div>
      </li>
    );
  };

  const handlePrint = () => {
    if (printComponent.current)
      toPng(printComponent.current, {
        style: { borderRadius: "0.75rem", paddingTop: "1.5rem" },
      }).then(function (dataUrl) {
        const date = dayjs().format("DD/MM/YYYY_hh:mm:ss");
        download(dataUrl, `hoa-don-${date}.png`);
      });
  };

  return (
    <>
      <div
        className="flex flex-col px-6 pb-12 divide-y-2 divide-gray-700 bg-inherit divide-dashed"
        ref={printComponent}
      >
        <div className="flex flex-col gap-2 pb-4">
          <Label title="Tổng tiền:" value={formatCurrency(summary.total.price)} />
          <Label title="Tổng sản phẩm:" value={summary.total.quantity} />
          <Label title="Tổng số lượng:" value={summary.total.item} />
        </div>

        <ul className="pt-4">
          <p className="pb-3 text-lg font-bold">Danh sách sản phẩm:</p>
          {fields.map((item, index) => (
            <Item item={item} key={index} />
          ))}
        </ul>
      </div>

      <div className="sticky bottom-0 px-6 -translate-y-6">
        <Button className="justify-center w-full text-xl" onClick={handlePrint}>
          Lưu tổng kết
        </Button>
      </div>
    </>
  );
};

export default OverlaySummary;
