import React from "react";
import { motion } from "framer-motion";
import { motionProps } from "../../../../utilities/animate";
import { SourceLink } from "../source-link/source-link";
import { ListingRowProps } from "./interfaces";
import { RelativeDate } from "../../../atoms/relative-date";
import { IconBookmark } from "../../../atoms/icons/bookmark";
import { Button } from "../../../atoms/button";

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
    const actionBookmark = (
        <button className="absolute -left-6 mr-2">
            <IconBookmark />
        </button>
    );

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

    return (
        <motion.article {...motionProps} className="group relative select-none border-gray-100 dark:border-slate-800">
            {linkUrl && actionBookmark}
            <h1 className={`flex text-base ${bold ? "font-bold" : ""} mx-0 ${source ? "my-4" : "my-2"} whitespace-nowrap dark:text-slate-300`}>{nodeTitleLink}</h1>
        </motion.article>
    );
};
