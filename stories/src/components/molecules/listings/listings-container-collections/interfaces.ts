import { Collection, SettingsLayout } from "../../../../data/chirp-types";

export interface ListingsContainerCollectionsProps {
    className?: string
    view?: SettingsLayout
    collections: Collection[]
    selectAction: (c: Collection) => any
}
