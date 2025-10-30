import React from "react";
import { motion } from "framer-motion";
import { motionProps } from "../../../../utilities/animate";
import { SourceLink } from "../source-link/source-link";
import { ListingRowProps } from "./interfaces";
import { RelativeDate } from "../../../atoms/relative-date";
import { Bookmark } from "../../bookmark";
import { SettingsLayout } from "../../../../data/chirp-types";

export const ListingRow: React.FC<ListingRowProps> = ({
  title,
  linkUrl,
  action,
  content,
  source,
  bold,
  trailingIcon,
  hasBg,
}) => {
  // const description = content && (
  //     <span className='font-normal ml-6 text-gray-300'>
  //         {/* {content?.description?.slice(0, 100)} */}
  //     </span>
  // )

  const titleInner = (
    <>
      <span className="grow me-2">{title}</span>
      {/* {description} */}
      {trailingIcon && <span>{trailingIcon}</span>}
    </>
  );

  const titleClasses =
    "flex font-bold cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis";

  const titleContent = linkUrl ? (
    <a className={titleClasses} href={linkUrl} target="_blank">
      {titleInner}
    </a>
  ) : (
    action && (
      <span className={titleClasses} onClick={action}>
        {titleInner}
      </span>
    )
  );

  const nodeRecency = content?.date_published && (
    <span className="ml-2 text-sm text-gray-300 dark:text-gray-500 select-none cursor-default">
      <RelativeDate date={content?.date_published} />
    </span>
  );

  const nodeTitleLink = (
    <span className="truncate w-full">
      {titleContent}
      <SourceLink source={source} isBlock={false} />
      {nodeRecency}
    </span>
  );

  const actionBookmark = content && linkUrl && (
    <Bookmark content={content} layout={SettingsLayout.ROWS} />
  );

  // the pseudo-element helps capture the mouse so the user can seamlessly move to the bookmark icon
  return (
    <motion.article
      {...motionProps}
      className={`group relative ${hasBg ? "py-1 bg-[#F9F9F9] dark:bg-slate-900" : "bg-transparent"} border-gray-100 dark:border-slate-800 rounded-md px-4 before:block before:absolute before:z-0 before:-inset-0 before:-left-2`}
    >
      {actionBookmark}
      <h1
        className={`flex text-base ${bold ? "font-bold" : ""} mx-0 ${source ? "my-4" : "my-2"} relative z-10 whitespace-nowrap dark:text-slate-400 select-none`}
      >
        {nodeTitleLink}
      </h1>
    </motion.article>
  );
};
