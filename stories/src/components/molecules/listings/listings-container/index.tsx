import React from "react";
import { ListingsContainerProps } from "./interfaces";

// @TODO: Determine whether the listings-container should directly add the listings contents instead of using `children`.
const ListingsContainer: React.FC<ListingsContainerProps> = ({ className, children, view, onMouseOver }) => {
    const listingContainerClasses = ["listing-container relative"];
    if (className) listingContainerClasses.push(className);
    if (view === "CARDS") listingContainerClasses.push("grid grid-flow-row grid-cols-4 gap-4");

    return (
        <div className={listingContainerClasses.join(" ")} onMouseOver={onMouseOver}>
            {children}
        </div>
    );
};

export default ListingsContainer;
