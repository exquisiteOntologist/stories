import React from "react";
import { FilterButtonProps } from "./interfaces";
import { PillButton } from "../../atoms/pill-button";

export const FilterButton: React.FC<FilterButtonProps> = ({
  action,
  active,
  // number,
  activeClass,
  Icon,
  label,
}) => (
  <PillButton
    action={action}
    active={active}
    activeClass={activeClass}
    Icon={Icon}
    label={label}
  />
);
