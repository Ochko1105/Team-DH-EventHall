import { Sparkles } from "lucide-react";
import React from "react";

export const Logo = () => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br bg-blue-600 shadow-[0_0_30px_rgba(76,139,255,0.4)]">
        <Sparkles className="h-5 w-5 text-white" />
      </div>
      <span className="text-xl font-bold tracking-tight text-white">
        EventLux
      </span>
    </div>
  );
};
