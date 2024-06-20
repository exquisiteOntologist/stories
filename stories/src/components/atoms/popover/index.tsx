import React from "react";
import { PopoverProps } from "./interfaces";

export const Popover: React.FC<PopoverProps> = ({ children }) => (
    <div className="w-[280px] h-[260px] p-2 rounded-md overflow-hidden relative bg-inherit dark:bg-slate-900 shadow-xl shadow-black-500/50">
        <div className="absolute top-2 left-[50%] translate-x-[-50%] max-w-none w-[1280px] min-h-80 max-h-none origin-top scale-[0.2] pointer-events-none">{children}</div>
    </div>
);
