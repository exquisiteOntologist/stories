import React from "react";
import { ListingsContainerProps } from "./interfaces";
import { SettingsLayout } from "../../../../data/chirp-types";

// @TODO: Determine whether the listings-container should directly add the listings contents instead of using `children`.
const ListingsContainer: React.FC<ListingsContainerProps> = ({
  className,
  children,
  view,
}) => {
  const listingContainerClasses = ["listing-container relative"];
  if (className) listingContainerClasses.push(className);
  if (view === SettingsLayout.COLUMNS)
    listingContainerClasses.push("grid grid-flow-row grid-cols-4 gap-2");

  return <div className={listingContainerClasses.join(" ")}>{children}</div>;
};

export default ListingsContainer;
