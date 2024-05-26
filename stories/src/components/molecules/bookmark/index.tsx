import React from "react";
import { IconBookmark } from "../../atoms/icons/bookmark";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { addMark, marksSelectors, removeMark } from "../../../redux/features/marksSlice";
import { ContentDto } from "../../../data/chirp-types";

export interface BookmarkProps {
    content: ContentDto;
}

export const Bookmark: React.FC<BookmarkProps> = ({ content }) => {
    const dispatch = useAppDispatch();
    const isBookmarked: boolean = typeof useAppSelector((s) => marksSelectors.selectById(s, content.id)) === "number";
    const actionToggleMark = () => dispatch(isBookmarked ? removeMark(content) : addMark(content));

    return (
        <button className={`absolute -left-6 right-full pr-2 bg-transparent text-rose-500 ${isBookmarked ? "opacity-1" : "opacity-0"} group-hover:opacity-100`} onClick={actionToggleMark}>
            <IconBookmark active={isBookmarked} />
        </button>
    );
};
