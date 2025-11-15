import React from "react";
import { SettingsLayout } from "../../../../data/chirp-types";
import ListingsContainer from "../listings-container";
import { ListingRow } from "../row";
import { ListingsContainerCollectionsProps } from "./interfaces";
import { IconCaretExpandRight } from "../../../atoms/icons/caret-expand-right";

export const ListingsContainerCollections: React.FC<
  ListingsContainerCollectionsProps
> = ({ className, view, collections, selectAction }) => (
  <ListingsContainer className={className} view={SettingsLayout.COLUMNS}>
    {collections.map((c) => (
      <ListingRow
        key={c.id}
        id={c.id}
        title={c.name}
        action={() => selectAction(c)}
        bold={true}
        trailingIcon={<IconCaretExpandRight />}
        hasBg={true}
      />
    ))}
    {/* {view === SettingsLayout.CARDS} */}
  </ListingsContainer>
);
