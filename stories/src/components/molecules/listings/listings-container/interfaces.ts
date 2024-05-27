import { ReactNode, SyntheticEvent } from "react";
import { SettingsLayout } from "../../../../data/chirp-types";

export interface ListingsContainerProps {
    /** Class Names - note added in addition to setting-based defaults */
    className?: string;
    children: ReactNode;
    view?: SettingsLayout;
}
