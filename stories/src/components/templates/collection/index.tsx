import React from "react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { fetchContentOfSources, selectContentByRecency } from "../../../redux/features/contentsSlice";
import { fetchSourcesOfCollection, sourcesSelectors } from "../../../redux/features/sourcesSlice";
import { resetThemeColours } from "../../../redux/features/themeSlice";
import { collectionsSelectors, fetchCollection, fetchNestedCollections, selectNestedCollections } from "../../../redux/features/collectionsSlice";
import { collectionSettingsSelectors } from "../../../redux/features/collectionSettingsSlice";
import { ContentDto, SettingsLayout } from "../../../data/chirp-types";
import { chooseCollection, isViewModeActive, selectCollectionId, selectFilter, selectIsCustomizing, toggleFilterViewMode, ViewMode } from "../../../redux/features/navSlice";
import { ListingsContainerContent } from "../../molecules/listings/listings-container-content";
import { TitleCrumbs } from "../../organisms/title-crumbs";
import { ListingsContainerCollections } from "../../molecules/listings/listings-container-collections";
import { CollectionCustomizer } from "../../organisms/collection-customizer";
import { CollectionViewProps } from "./interface";
import { motionProps } from "../../../utilities/animate";
import { selectNestedSourceIds } from "../../../redux/features/collectionToSourceSlice";
import { RefreshBar } from "../../molecules/listings/refresh-bar";
import { marksSelectors, retrieveMarks } from "../../../redux/features/marksSlice";
import { fetchPhrasesToCollection } from "../../../redux/features/collectionToPhraseSlice";
import { FailBanner } from "../../organisms/fail-banner";
import { CombinedCount } from "../../organisms/statistics/combined_counts";
import { LoadingIndicator } from "../../organisms/loading-indicator";
import { FilterButton } from "../../molecules/filter-button";
import { IconBookmark } from "../../atoms/icons/bookmark";
import { IconFlower } from "../../atoms/icons/flower";
import { selectPhrasesOfCollection } from "../../../redux/features/phrasesSlice";
import { ListingsContainerPhrase } from "../../molecules/listings/listings-container-phrase";

const clientItemsLimit: number = 100;

const CollectionView: React.FC<CollectionViewProps> = () => {
    const dispatch = useAppDispatch();

    const collectionId = useAppSelector(selectCollectionId);
    const collection = useAppSelector((s) => collectionsSelectors.selectById(s, collectionId));
    const nestedCollections = useAppSelector(selectNestedCollections);
    const collectionSettings = useAppSelector((s) => collectionSettingsSelectors.selectById(s, collectionId));
    // these source selectors assume that the sources store only has the current sources
    const sources = useAppSelector(sourcesSelectors.selectAll);
    const sourceIds = useAppSelector(selectNestedSourceIds);
    const contents = useAppSelector((s) => selectContentByRecency(s, clientItemsLimit));
    const marks = useAppSelector(marksSelectors.selectAll);
    const phrases = useAppSelector(selectPhrasesOfCollection);
    const filter = useAppSelector(selectFilter);
    const isCustomizing = useAppSelector(selectIsCustomizing);
    const [doRefresh, setDoRefresh] = useState<boolean>(true);
    // "contentsVisible" is the displayed subset of the current contents
    // when the user clicks "reveal/refresh" then all contents are made visible.
    // Non-visible content is typically the content that comes in later.
    const [contentsVisible, setContentsVisible] = useState<ContentDto[]>([]);
    const [filteringCollectionId, setFilteringCollectionId] = useState<number | null>(null);

    const title = isCustomizing ? "edit" : "hi";
    let updateTimeout: NodeJS.Timeout | undefined;

    useEffect(() => {
        dispatch(fetchCollection([collectionId]));
        dispatch(fetchSourcesOfCollection([collectionId]));
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchNestedCollections([collectionId]));
    }, [collection, collectionSettings]);

    useEffect(() => {
        // if content is in another collection it tricks the refresh qeue mechanism
        // so we here just set the contents visible straight away.
        // Only because this dispatch's fetch is not synchronous
        dispatch(fetchContentOfSources(sourceIds)).then(() => setContentsVisible(contents));
        dispatch(retrieveMarks(sourceIds));
    }, [collectionId, sources]);

    useEffect(() => {
        updateTimeout && clearTimeout(updateTimeout);

        /** fetches - content from the DB */
        const fetchCurrentContent = () => {
            dispatch(fetchContentOfSources(sourceIds));
            // console.log("updated", new Date(), collectionId, sourceIds);
            updateTimeout = setTimeout(() => requestAnimationFrame(fetchCurrentContent), 1000 * 10);
        };

        fetchCurrentContent();
        window.removeEventListener("focus", fetchCurrentContent);
        window.addEventListener("focus", fetchCurrentContent);

        return () => {
            updateTimeout && clearTimeout(updateTimeout);
            window.removeEventListener("focus", fetchCurrentContent);
        };
    }, [dispatch, sourceIds]);

    useEffect(() => {
        dispatch(resetThemeColours());
    }, [dispatch]);

    useEffect(() => {
        console.log("refresh?", doRefresh);
        if (doRefresh && contents.length) {
            // set contents visible items to avoid shifting items in view after new updates
            setContentsVisible(contents);
            setDoRefresh(false);
            setFilteringCollectionId(collectionId);
        }
        console.log("refresh after?", doRefresh);
    }, [contents]);

    useEffect(() => {
        // when changing collections enable the content queue to refresh
        setContentsVisible(contents);
        setDoRefresh(true);
        setFilteringCollectionId(collectionId);
        dispatch(fetchPhrasesToCollection(collectionId));
    }, [collectionId]);

    useEffect(() => {
        if (doRefresh) setContentsVisible(contents);
    }, [doRefresh]);

    // know whether to just show content of collection or to show recency-based filtered list (cycles & speed)
    const isFilteredCollection = filteringCollectionId === collectionId;
    const isShowingMostCurrent = contents[0]?.date_published === contentsVisible[0]?.date_published && contents[0]?.url === contentsVisible[0]?.url;

    return (
        <motion.div {...motionProps} key={collectionId} className="collection h-min-content mx-4 w-full max-w-7xl">
            <div className="flex justify-between">
                <TitleCrumbs collectionId={collectionId} title={title} />
                <CollectionCustomizer collectionSettings={collectionSettings} isCustomizing={isCustomizing} />
            </div>
            <FailBanner />
            <LoadingIndicator />
            <RefreshBar refreshAction={() => setDoRefresh(true)} refreshPossible={isFilteredCollection && !isShowingMostCurrent} />
            <CombinedCount collectionId={collectionId} key={contents?.[0]?.id ?? "article-count"} />
            <div className="flex align-middle mb-8">
                <FilterButton
                    number={marks.length}
                    colour="#F0315D"
                    Icon={IconBookmark}
                    action={() => {
                        dispatch(toggleFilterViewMode(ViewMode.BOOKMARKS));
                        setDoRefresh(true);
                    }}
                    active={isViewModeActive(filter, ViewMode.BOOKMARKS)}
                />
                <FilterButton
                    number={phrases.length}
                    colour="#2F959F"
                    Icon={IconFlower}
                    action={() => {
                        dispatch(toggleFilterViewMode(ViewMode.PHRASES));
                    }}
                    active={isViewModeActive(filter, ViewMode.PHRASES)}
                />
            </div>
            <ListingsContainerCollections className="mb-12" view={collectionSettings?.layout as SettingsLayout} collections={nestedCollections} selectAction={(c) => dispatch(chooseCollection(c.id))} />
            {isViewModeActive(filter, ViewMode.PHRASES) && <ListingsContainerPhrase view={collectionSettings?.layout as SettingsLayout} phrases={phrases.slice(0, 15)} />}
            <ListingsContainerContent view={collectionSettings?.layout as SettingsLayout} contents={isFilteredCollection ? contentsVisible : contents} sources={sources} />
        </motion.div>
    );
};

export default CollectionView;
