import React from "react";
import { IconBookmark } from "../../atoms/icons/bookmark";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
  addMark,
  marksSelectors,
  removeMark,
} from "../../../redux/features/marksSlice";
import { ContentDto, SettingsLayout } from "../../../data/chirp-types";

export interface BookmarkProps {
  content: ContentDto;
  layout: SettingsLayout;
}

export const Bookmark: React.FC<BookmarkProps> = ({ content, layout }) => {
  const dispatch = useAppDispatch();
  const isBookmarked: boolean =
    typeof useAppSelector((s) => marksSelectors.selectById(s, content.id)) ===
    "number";
  const actionToggleMark = () =>
    dispatch(isBookmarked ? removeMark(content) : addMark(content));
  const layoutStyles =
    layout === SettingsLayout.CARDS
      ? "absolute top-0 left-0 p-2"
      : "absolute -left-6 right-full pr-2";

  return (
    <button
      className={`${layoutStyles} bg-transparent text-rose-500 ${isBookmarked ? "opacity-100" : "opacity-0"} group-hover:opacity-100`}
      onClick={actionToggleMark}
    >
      <IconBookmark filled={isBookmarked} />
    </button>
  );
};
