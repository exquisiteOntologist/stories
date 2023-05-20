export interface ButtonProps {
    className?: string
    label?: string
    Icon?: React.FC
    /** For internal links */
    linkTo?: string
    /** For external links */
    href?: string
    /** For non-link actions */
    action?: () => any
    /** Provide standard button padding */
    usePadding?: boolean
    disabled?: boolean
}
