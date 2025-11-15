import React from "react";
import { PillButtonProps } from "./interfaces";

export const PillButton: React.FC<PillButtonProps> = ({
  label,
  Icon,
  action,
  active,
  activeClass,
}) => {
  return (
    <button
      className={`flex text-base font-bold leading-none items-center px-4 py-0 cursor-pointer rounded-full ${active ? activeClass : "bg-transparent"}`}
      onClick={action}
    >
      {Icon && (
        <span className="py-2">
          <Icon
            filled={true}
            fillColour={active ? "#fff" : "#000"}
            strokeColour="transparent"
          />
        </span>
      )}
      <span className="py-2 ml-2">{label}</span>
    </button>
  );
};
