import React from "react";
import { Button } from "../../atoms/button";
import { IconBookmark } from "../../atoms/icons/bookmark";
import { FilterButtonProps } from "./interfaces";

export const FilterButton: React.FC<FilterButtonProps> = ({ number, colour }) => (
    <button className="flex align-middle items-center border-2 rounded-md px-4 py-3 hover:border-current" style={{ borderColor: colour }}>
        <IconBookmark active={true} />
        <span className={`text-lg font-bold ml-20 hover:text-current`} style={{ color: colour }}>
            {number}
        </span>
    </button>
);
