import { ContentDto, SourceDto } from "./chirp-types";

export interface Listing {
    id: string | number
    title: string
    linkUrl?: string
    action?: () => any
    content?: ContentDto
    source?: SourceDto
}
