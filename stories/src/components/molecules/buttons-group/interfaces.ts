import { ReactNode } from "react";

export interface ButtonGroupProps {
    children: ReactNode
    className?: string
    expands?: boolean
    /** Expands leftwards? (from right opens leftwards) */
    leftward?: boolean
    IconExpand?: React.FC
}