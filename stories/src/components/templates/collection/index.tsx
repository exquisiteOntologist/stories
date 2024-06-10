import * as React from "react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { fetchContentOfSources, selectContentOfCollection } from "../../../redux/features/contentsSlice";
import { fetchSourcesOfCollection, sourcesSelectors } from "../../../redux/features/sourcesSlice";
import { resetThemeColours } from "../../../redux/features/themeSlice";
import { collectionsSelectors, fetchCollection, fetchNestedCollections, selectNestedCollections } from "../../../redux/features/collectionsSlice";
import { collectionSettingsSelectors } from "../../../redux/features/collectionSettingsSlice";
import { ContentDto, PhraseResult, SettingsLayout } from "../../../data/chirp-types";
import { chooseCollection, selectCollectionId, selectIsCustomizing } from "../../../redux/features/navSlice";
import { ListingsContainerContent } from "../../molecules/listings/listings-container-content";
import { TitleCrumbs } from "../../organisms/title-crumbs";
import { ListingsContainerCollections } from "../../molecules/listings/listings-container-collections";
import { CollectionCustomizer } from "../../organisms/collection-customizer";
import { CollectionViewProps } from "./interface";
import { motionProps } from "../../../utilities/animate";
import { CollectionEmptyMessage } from "../../organisms/collection-empty-message";
import { selectNestedSourceIds } from "../../../redux/features/collectionToSourceSlice";
import { RefreshBar } from "../../molecules/listings/refresh-bar";
import { retrieveMarks } from "../../../redux/features/marksSlice";
import { ArticleCount } from "../../organisms/statistics/article_count";
import { invoke } from "@tauri-apps/api/core";
import { PhraseCount } from "../../organisms/statistics/phrase_count";
import { ListingsContainerPhrase } from "../../molecules/listings/listings-container-phrase";

const clientItemsLimit: number = 100;
const time = (s: string): number => new Date(s).getTime();
const sortContentPublished = (cA: ContentDto, cB: ContentDto) => time(cB.date_published) - time(cA.date_published);
// in the event multiple items have same date, but not fetched together, you could append id to time string in comparison
const sortId = (cA: ContentDto, cB: ContentDto) => cB.id - cA.id;

const CollectionView: React.FC<CollectionViewProps> = () => {
    const dispatch = useAppDispatch();

    const collectionId = useAppSelector(selectCollectionId);
    const collection = useAppSelector((s) => collectionsSelectors.selectById(s, collectionId));
    const nestedCollections = useAppSelector(selectNestedCollections);
    const collectionSettings = useAppSelector((s) => collectionSettingsSelectors.selectById(s, collectionId));
    // these source selectors assume that the sources store only has the current sources
    const sources = useAppSelector(sourcesSelectors.selectAll);
    const sourceIds = useAppSelector(selectNestedSourceIds);
    console.log("source ids", sourceIds);
    const contents = useAppSelector(selectContentOfCollection).sort(sortContentPublished).slice(0, clientItemsLimit);
    const isCustomizing = useAppSelector(selectIsCustomizing);
    const [doRefresh, setDoRefresh] = useState<boolean>(true);
    const [contentsVisible, setContentsVisible] = useState<ContentDto[]>([]);
    const [filteringCollectionId, setFilteringCollectionId] = useState<number | null>(null);
    const [phrases, setPhrases] = useState<PhraseResult[]>([]);

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
        dispatch(fetchContentOfSources(sourceIds));
        dispatch(retrieveMarks(sourceIds));
    }, [collectionId, sources]);

    // useEffect(() => {
    // dispatch(retrieveMarks(sourceIds));
    // }, [sourceIds]);

    useEffect(() => {
        updateTimeout && clearTimeout(updateTimeout);

        /** fetch content from the DB, but don't display it until desired (see `doRefresh`) */
        const fetchCurrentContent = () => {
            dispatch(fetchContentOfSources(sourceIds));
            console.log("updated", collectionId, sourceIds);
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
        invoke("collection_phrases_today", {
            collectionId,
        }).then((phrases) => setPhrases(phrases as PhraseResult[]));
        console.log("set update to true again");
    }, [collectionId]);

    useEffect(() => {
        if (doRefresh) {
            setContentsVisible(contents);
        }
    }, [doRefresh]);

    // know whether to just show content of collection or to show recency-based filtered list (cycles & speed)
    const isFilteredCollection = filteringCollectionId === collectionId;
    const isShowingMostCurrent = contents[0]?.date_published === contentsVisible[0]?.date_published && contents[0]?.url === contentsVisible[0]?.url;
    // console.log('first date', contents[0].date_published, contentsVisible[0].date_published, isShowingMostCurrent)

    return (
        <motion.div {...motionProps} key={collectionId} className="collection h-min-content mx-4 w-full max-w-7xl">
            <div className="flex justify-between">
                <TitleCrumbs collectionId={collectionId} title={title} />
                <CollectionCustomizer collectionSettings={collectionSettings} isCustomizing={isCustomizing} />
            </div>
            <RefreshBar refreshAction={() => setDoRefresh(true)} refreshPossible={isFilteredCollection && !isShowingMostCurrent} />
            <CollectionEmptyMessage />
            <ListingsContainerCollections className="mb-12" view={collectionSettings?.layout as SettingsLayout} collections={nestedCollections} selectAction={(c) => dispatch(chooseCollection(c.id))} />
            <div className="flex items-end">
                <ArticleCount collectionId={collectionId} key={contents?.[0]?.id ?? "article-count"} />
                <PhraseCount collectionId={collectionId} key={"phrase-count" + contents?.[0]?.id ?? "article-count"} />
            </div>
            <ListingsContainerPhrase view={collectionSettings?.layout as SettingsLayout} phrases={phrases.slice(0, 15)} />
            <ListingsContainerContent view={collectionSettings?.layout as SettingsLayout} contents={isFilteredCollection ? contentsVisible : contents} sources={sources} />
        </motion.div>
    );
};

export default CollectionView;
