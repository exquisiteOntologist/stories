import React from "react";
import { FilterButtonProps } from "./interfaces";

export const FilterButton: React.FC<FilterButtonProps> = ({ action, active, number, colour, Icon }) => (
    <button className={`flex align-middle items-center ${active ? "bg-current" : "bg-transparent"} border-2 border-current rounded-md px-4 py-3 mr-4 hover:border-current`} style={{ color: colour }} onClick={action}>
        <Icon filled={!active} strokeColour="white" />
        <span className={`text-lg ${active ? "text-white" : "text-current"} font-bold ml-20`}>{number}</span>
    </button>
);
