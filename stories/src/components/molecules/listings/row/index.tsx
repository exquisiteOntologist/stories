import React from "react";
import { motion } from "framer-motion";
import { motionProps } from "../../../../utilities/animate";
import { ListingRowProps } from "./interfaces";

export const ListingRow: React.FC<ListingRowProps> = ({
  title,
  linkUrl,
  action,
  content,
  source,
  bold,
  trailingIcon,
  leadingContent,
  metaDetail,
  hasBg,
}) => {
  const titleClasses = `flex font-bold cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis rounded-md ${hasBg ? "py-2" : "py-0"} px-4`;
  const titleInner = (
    <>
      <span className="grow me-2">{title}</span>
      {trailingIcon && <span>{trailingIcon}</span>}
    </>
  );

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

  const nodeTitleLink = <span className="truncate w-full">{titleContent}</span>;

  // the pseudo-element helps capture the mouse so the user can seamlessly move to the bookmark icon
  return (
    <motion.article
      {...motionProps}
      className={`group relative border-gray-100 dark:border-slate-800 before:block before:absolute before:z-0 before:-inset-0 before:-left-2`}
    >
      {leadingContent}
      <h1
        className={`flex text-base ${bold ? "font-bold" : ""} mx-0 ${source ? "mt-4" : "mt-0"} mb-0 relative z-10 whitespace-nowrap rounded-md ${hasBg ? "bg-[#F9F9F9] dark:bg-[#1A1E28]" : "bg-transparent"} dark:text-slate-400 select-none`}
      >
        {nodeTitleLink}
      </h1>
      {metaDetail}
    </motion.article>
  );
};
