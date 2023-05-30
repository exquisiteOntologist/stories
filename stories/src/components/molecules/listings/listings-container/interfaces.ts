import { ReactNode } from "react";

export type ListingViews = 'Rows' | 'Cards'

export interface ListingsContainerProps {
    children: ReactNode
    view: ListingViews
}
