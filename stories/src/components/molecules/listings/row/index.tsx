import React from "react";
import { motion } from "framer-motion";
import { motionProps } from "../../../../utilities/animate";
import { SourceLink } from "../source-link/source-link";
import { ListingRowProps } from "./interfaces";
import { RelativeDate } from "../../../atoms/relative-date";
import { IconBookmark } from "../../../atoms/icons/bookmark";
import { Button } from "../../../atoms/button";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { addMark, marksSelectors } from "../../../../redux/features/marksSlice";
import { ContentDto } from "../../../../data/chirp-types";

export interface ActionBookmarkProps {
    content: ContentDto;
}

export const ActionBookmark: React.FC<ActionBookmarkProps> = ({ content }) => {
    const dispatch = useAppDispatch();
    const isBookmarked: boolean = !!useAppSelector((s) => marksSelectors.selectById(s, content.id));

    // TODO: Add remove mark
    return (
        <button className="absolute -left-6 right-full pr-2 bg-transparent text-rose-500 opacity-0 group-hover:opacity-100" onClick={() => dispatch(addMark(content?.id))}>
            <IconBookmark active={isBookmarked} />
        </button>
    );
};

export const ListingRow: React.FC<ListingRowProps> = ({ title, linkUrl, action, content, source, bold }) => {
    // const description = content && (
    //     <span className='font-normal ml-6 text-gray-300'>
    //         {/* {content?.description?.slice(0, 100)} */}
    //     </span>
    // )

    const actionInner = (
        <>
            {title}
            {/* {description} */}
        </>
    );

    // top-1/2 -translate-y-1/2
    // transition-all duration-75
    const actionBookmark = content && linkUrl && <ActionBookmark content={content} />;

    const titleInner = linkUrl ? (
        <a className="block" href={linkUrl} target="_blank">
            {actionInner}
        </a>
    ) : (
        action && (
            <span className="block cursor-pointer" onClick={action}>
                {actionInner}
            </span>
        )
    );

    const nodeRecency = content?.date_published && (
        <span className="ml-2 text-sm text-gray-300 select-none cursor-default">
            <RelativeDate date={content?.date_published} />
        </span>
    );

    const nodeTitleLink = (
        <span className="truncate">
            {titleInner}
            <SourceLink source={source} isBlock={false} />
            {nodeRecency}
        </span>
    );

    // the pseudo-element helps capture the mouse so the user can seamlessly move to the bookmark icon
    return (
        <motion.article {...motionProps} className="group relative bg-transparent border-gray-100 dark:border-slate-800 before:block before:absolute before:z-0 before:-inset-0 before:-left-2">
            {actionBookmark}
            <h1 className={`flex text-base ${bold ? "font-bold" : ""} mx-0 ${source ? "my-4" : "my-2"} relative z-10 whitespace-nowrap dark:text-slate-300 select-none`}>{nodeTitleLink}</h1>
        </motion.article>
    );
};
