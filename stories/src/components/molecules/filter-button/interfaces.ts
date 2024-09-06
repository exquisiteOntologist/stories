import { FC, ReactNode } from "react";
import { FilterButtonIconProps } from "../../atoms/icons/interfaces";

export interface FilterButtonProps {
    /** Action, typically to toggle this button */
    action: () => any;
    /** The button's represented state active state */
    active: boolean;
    /** Number of items to represent filtering */
    number: number | string;
    /** An Icon representing the filter state item */
    Icon: FC<FilterButtonIconProps>;
    /** Button colour theme, usually distinct for reach representation */
    colour: string;
    /** Label to display alongside the icon and number */
    label: string
}
