/*
 Generated by typeshare 1.6.0
*/

export enum MediaKind {
	IMAGE = "IMAGE",
}

export interface ContentMedia {
	id: number;
	content_id: number;
	src: string;
	kind: MediaKind;
}

export interface ContentDto {
	id: number;
	source_id: number;
	title: string;
	url: string;
	date_published: string;
	date_retrieved: string;
	media: ContentMedia[];
}

export interface ContentBody {
	id: number;
	content_id: number;
	body_text: string;
}

export enum SourceKind {
	RSS = "RSS",
	WEB = "WEB",
}

