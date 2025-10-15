import React from "react";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { selectContentByRecency } from "../../../redux/features/contentsSlice";
import { sourcesSelectors } from "../../../redux/features/sourcesSlice";
import {
  collectionsSelectors,
  selectNestedCollections,
} from "../../../redux/features/collectionsSlice";
import { collectionSettingsSelectors } from "../../../redux/features/collectionSettingsSlice";
import { SettingsLayout } from "../../../data/chirp-types";
import {
  chooseCollection,
  isViewModeActive,
  selectCollectionId,
  selectFilter,
  selectIsCustomizing,
  toggleFilterViewMode,
  ViewMode,
} from "../../../redux/features/navSlice";
import { ListingsContainerContent } from "../../molecules/listings/listings-container-content";
import { TitleCrumbs } from "../../organisms/title-crumbs";
import { ListingsContainerCollections } from "../../molecules/listings/listings-container-collections";
import { CollectionCustomizer } from "../../organisms/collection-customizer";
import { CollectionViewProps } from "./interface";
import { motionProps } from "../../../utilities/animate";
import { selectNestedSourceIds } from "../../../redux/features/collectionToSourceSlice";
import { RefreshBar } from "../../molecules/listings/refresh-bar";
import { marksSelectors } from "../../../redux/features/marksSlice";
import { FailBanner } from "../../organisms/fail-banner";
import { LoadingIndicator } from "../../organisms/loading-indicator";
import { FilterButton } from "../../molecules/filter-button";
import { IconBookmark } from "../../atoms/icons/bookmark";
import { IconFlower } from "../../atoms/icons/flower";
import { selectPhrasesOfCollection } from "../../../redux/features/phrasesSlice";
import { ListingsContainerPhrase } from "../../molecules/listings/listings-container-phrase";
import {
  useFetchCollection,
  useFetchContent,
  useFetchContentOnFocus,
  useFetchNestedCollections,
  useGetRefreshedContent,
  useResetThemeColours,
  useTitle,
} from "./hooks";

const clientItemsLimit: number = 100;

const CollectionView: React.FC<CollectionViewProps> = () => {
  const dispatch = useAppDispatch();

  const collectionId = useAppSelector(selectCollectionId);
  const collection = useAppSelector((s) =>
    collectionsSelectors.selectById(s, collectionId),
  );
  const nestedCollections = useAppSelector(selectNestedCollections);
  const collectionSettings = useAppSelector((s) =>
    collectionSettingsSelectors.selectById(s, collectionId),
  );
  // these source selectors assume that the sources store only has the current sources
  const sources = useAppSelector(sourcesSelectors.selectAll);
  const sourceIds = useAppSelector(selectNestedSourceIds);
  const contents = useAppSelector((s) =>
    selectContentByRecency(s, clientItemsLimit),
  );
  const marks = useAppSelector(marksSelectors.selectAll);
  const phrases = useAppSelector(selectPhrasesOfCollection);
  const filter = useAppSelector(selectFilter);
  const isCustomizing = useAppSelector(selectIsCustomizing);

  useFetchCollection({
    dispatch,
    collectionId,
  });

  useFetchNestedCollections({
    dispatch,
    collection,
    collectionSettings,
    collectionId,
  });

  useFetchContent({
    dispatch,
    collectionId,
    sourceIds,
    sources,
  });

  useFetchContentOnFocus({
    dispatch,
    sourceIds,
  });

  useResetThemeColours({ dispatch });

  const { title } = useTitle({ dispatch, isCustomizing });

  const { filteredContent, refreshPossible, setDoRefresh } =
    useGetRefreshedContent({
      dispatch,
      collectionId,
      contents,
    });

  return (
    <motion.div
      {...motionProps}
      key={collectionId}
      className="collection h-min-content w-full max-w-7xl"
    >
      <div className="flex justify-between">
        <TitleCrumbs collectionId={collectionId} title={title} />
        <CollectionCustomizer
          collectionSettings={collectionSettings}
          isCustomizing={isCustomizing}
        />
      </div>
      <FailBanner />
      <LoadingIndicator />
      <RefreshBar
        refreshAction={() => setDoRefresh(true)}
        refreshPossible={refreshPossible}
      />
      {/*<CombinedCount collectionId={collectionId} key={contents?.[0]?.id ?? "article-count"} /> */}
      <div className="flex align-middle mb-8">
        <FilterButton
          number={marks.length}
          colour="#F0315D"
          label="bookmarks"
          Icon={IconBookmark}
          action={() => {
            dispatch(toggleFilterViewMode(ViewMode.BOOKMARKS));
            setDoRefresh(true);
          }}
          active={isViewModeActive(filter, ViewMode.BOOKMARKS)}
        />
        <FilterButton
          number={phrases.length ? phrases.length + "+" : 0}
          colour="#2F959F"
          label="entities"
          Icon={IconFlower}
          action={() => {
            dispatch(toggleFilterViewMode(ViewMode.PHRASES));
          }}
          active={isViewModeActive(filter, ViewMode.PHRASES)}
        />
      </div>
      <ListingsContainerCollections
        className="mb-12"
        view={collectionSettings?.layout as SettingsLayout}
        collections={nestedCollections}
        selectAction={(c) => dispatch(chooseCollection(c.id))}
      />
      {isViewModeActive(filter, ViewMode.PHRASES) && (
        <ListingsContainerPhrase
          view={collectionSettings?.layout as SettingsLayout}
          phrases={phrases}
        />
      )}
      <ListingsContainerContent
        view={collectionSettings?.layout as SettingsLayout}
        contents={filteredContent}
        sources={sources}
      />
    </motion.div>
  );
};

export default CollectionView;
