import { ContentDto } from "./chirp-types";

export interface Listing {
    id: string | number
    title: string
    linkUrl: string
    content?: ContentDto
    source?: any
}
