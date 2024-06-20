import { ContentDto, SettingsLayout, SourceDto } from "../../../../data/chirp-types";

export interface PopoverViewModeProps {
    contents: ContentDto[];
    sources: SourceDto[];
    layout: SettingsLayout;
}
