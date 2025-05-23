import React from "react";
import { IconGrid } from "../../atoms/icons/grid";
import { IconList } from "../../atoms/icons/list";
import { IconAddCircle } from "../../atoms/icons/add-circle";
import { IconShapes } from "../../atoms/icons/shapes";
import { IconTickCircle } from "../../atoms/icons/tick-circle";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { Button } from "../../atoms/button";
import { CollectionSettings, SettingsLayout } from "../../../data/chirp-types";
import { setCollectionSettings } from "../../../redux/features/collectionSettingsSlice";
import { CollectionCustomizerProps } from "./interfaces";
import { setIsCustomizing } from "../../../redux/features/navSlice";
import { PopoverViewMode } from "../../molecules/popovers/popover-view-mode";
import {
  selectContentByRecency,
  selectContentOfCollection,
} from "../../../redux/features/contentsSlice";
import { sourcesSelectors } from "../../../redux/features/sourcesSlice";

export const CollectionCustomizer: React.FC<CollectionCustomizerProps> = ({
  collectionSettings,
  isCustomizing,
}) => {
  const dispatch = useAppDispatch();
  const previewContents = useAppSelector((s) => selectContentByRecency(s, 20));
  const sources = useAppSelector(sourcesSelectors.selectAll);

  const viewIsList = collectionSettings?.layout === SettingsLayout.ROWS;
  const otherLayoutOption = viewIsList
    ? SettingsLayout.CARDS
    : SettingsLayout.ROWS;

  return (
    <div
      className={`z-50 transition-all duration-100 ${isCustomizing ? "opacity-100 translate-x-0 translate-y-0" : "opacity-0 translate-x-3 -translate-y-3"} mb-6`}
    >
      <div className={`flex justify-start`}>
        <Button
          label="Done"
          Icon={IconTickCircle}
          action={() => dispatch(setIsCustomizing(false))}
        />
        <Button
          label={`View as ${viewIsList ? "Cards" : "List"}`}
          Icon={viewIsList ? IconGrid : IconList}
          action={() =>
            dispatch(
              setCollectionSettings({
                ...collectionSettings,
                layout: otherLayoutOption,
              } as CollectionSettings),
            )
          }
        >
          <PopoverViewMode
            contents={previewContents}
            sources={sources}
            layout={otherLayoutOption}
          />
        </Button>
        <Button
          label="Add Widget"
          Icon={IconAddCircle}
          action={() => void 8}
          disabled={true}
        />
        <Button Icon={IconShapes} label="Sources" linkTo={`/edit`} />
      </div>
    </div>
  );
};
