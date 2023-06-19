import { ContentDto, SettingsLayout, SourceDto } from "../../../../data/chirp-types";

export interface ListingsContainerContentProps {
    className?: string
    view?: SettingsLayout
    contents: ContentDto[]
    sources: SourceDto[]
}
