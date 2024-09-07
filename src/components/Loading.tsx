import { IconLoader2 } from "@tabler/icons-react";
import React from "react";
const Loading = () => {
  return (
    <div className="w-[inherit] h-[inherit] flex justify-center items-center text-white">
      <IconLoader2 size="50%" className="animate-spin max-w-[150px]" />
    </div>
  );
};

export default Loading;
