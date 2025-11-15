import React from "react";
import { motion } from "framer-motion";
import { motionProps } from "../../../../utilities/animate";
import { ListingRowProps } from "./interfaces";
import { Surface } from "../../../atoms/surface";

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
  const titleClasses = `flex font-bold cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis rounded-md ${hasBg ? "py-2" : "py-0"}`;
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

  // the pseudo-element helps capture the mouse so the user can seamlessly move to the leadingContent (bookmark icon)
  return (
    <motion.article
      {...motionProps}
      className={`group relative before:block before:absolute before:z-0 before:-inset-0 before:-left-2`}
    >
      {leadingContent}
      <Surface
        Tag={"h1"}
        className={`${source ? "mt-4" : "mt-0"}`}
        bold={bold}
        hasBg={hasBg}
      >
        {nodeTitleLink}
      </Surface>
      {metaDetail}
    </motion.article>
  );
};
