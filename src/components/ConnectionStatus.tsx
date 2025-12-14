import { IconCloudOff, IconLoader2, IconSparkles } from "@tabler/icons-react";
import { classNames } from "primereact/utils";
import React from "react";

import { useGeminiContext } from "@/context/GeminiContext";

interface IConnectionStatusProps {
  className?: string;
}

const ConnectionStatus: React.FC<IConnectionStatusProps> = ({ className }) => {
  const { isConnected, isChecking } = useGeminiContext();

  const containerClass = classNames(
    "flex w-fit self-center items-center gap-1 px-3 py-2 rounded-lg text-sm transition-all",
    {
      "bg-green-500/20 text-green-400": isConnected && !isChecking,
      "bg-gray-500/20 text-gray-400": !isConnected && !isChecking,
      "bg-yellow-500/20 text-yellow-400": isChecking,
    },
    className,
  );

  return (
    <div className={containerClass}>
      {isChecking ? (
        <>
          <IconLoader2 size={16} className="animate-spin" />
          <span>Connecting...</span>
        </>
      ) : isConnected ? (
        <>
          <IconSparkles size={16} />
          <span>AI Detection Ready</span>
        </>
      ) : (
        <>
          <IconCloudOff size={16} />
          <span>AI Detection Offline</span>
        </>
      )}
    </div>
  );
};

export default ConnectionStatus;
