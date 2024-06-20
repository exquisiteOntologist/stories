export interface ButtonProps {
    className?: string;
    children?: React.ReactNode;
    label?: string;
    Icon?: React.FC;
    PopoverIcon?: React.FC;
    /** For internal links */
    linkTo?: string;
    /** For external links */
    href?: string;
    /** For non-link actions */
    action?: () => any;
    /** Secondary action for link buttons */
    sideAction?: () => any;
    /** Provide standard button padding */
    usePadding?: boolean;
    disabled?: boolean;
}
