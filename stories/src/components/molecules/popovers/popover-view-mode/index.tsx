import React from "react";
import { ListingsContainerContent } from "../../listings/listings-container-content";
import { Popover } from "../../../atoms/popover";
import { PopoverViewModeProps } from "./interfaces";

export const PopoverViewMode: React.FC<PopoverViewModeProps> = ({ contents, sources, layout }) => (
    <Popover>
        <ListingsContainerContent view={layout} contents={contents.slice(0, 20)} sources={sources} />
    </Popover>
);
