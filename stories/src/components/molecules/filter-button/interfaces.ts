export interface FilterButtonProps {
    /** Action, typically to toggle this button */
    action: () => any;
    /** The button's represented state active state */
    active: boolean;
    /** Number of items to represent filtering */
    number: number;
    /** Button colour theme, usually distinct for reach representation */
    colour: string;
}
