import { ContentDto, SettingsLayout, SourceDto } from "../../../../data/chirp-types";

export interface ListingsContainerContentProps {
    view?: SettingsLayout,
    contents: ContentDto[],
    sources: SourceDto[]
}
