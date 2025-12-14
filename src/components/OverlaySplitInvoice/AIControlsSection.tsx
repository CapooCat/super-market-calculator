import { IconSparkles } from "@tabler/icons-react";
import { Button } from "primereact/button";
import { InputNumber, InputNumberValueChangeEvent } from "primereact/inputnumber";
import React from "react";



import { useGeminiContext } from "@/context/GeminiContext";


interface IAIControlsSectionProps {
  targetPrice: number | null;
  setTargetPrice: (value: number | null) => void;
  onAISplit: () => void;
  isLoading: boolean;
}

const AIControlsSection = ({ targetPrice, setTargetPrice, onAISplit, isLoading }: IAIControlsSectionProps) => {
  const { isConnected } = useGeminiContext();

  const handleOnChange = (e: InputNumberValueChangeEvent) => {
    const regex = /000$/;
    if (!regex.test(String(e.value))) setTargetPrice((e.value ?? 0) * 1000);
    else setTargetPrice(e.value as number);
  };

  return (
    <div className="px-4 pb-4 border-b border-gray-700">
      <p className="mb-2 text-sm text-gray-400">Tách thông minh với AI</p>
      <div className="flex gap-2">
        <InputNumber
          value={targetPrice}
          onValueChange={handleOnChange}
          placeholder="Giá mục tiêu mỗi hoá đơn"
          className="flex-1"
          min={0}
          useGrouping
        />
        <Button
          icon={<IconSparkles size={18} />}
          onClick={onAISplit}
          disabled={!isConnected || !targetPrice || isLoading}
          className="shrink-0"
          severity={isConnected ? "info" : "secondary"}
        />
      </div>
    </div>
  );
};

export default AIControlsSection;