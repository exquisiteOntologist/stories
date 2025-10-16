import { useEffect, useState } from "react";
import {
  Collection,
  CollectionSettings,
  ContentDto,
  SourceDto,
} from "../../../data/chirp-types";
import { ThunkDispatch } from "@reduxjs/toolkit";
import {
  fetchCollection,
  fetchNestedCollections,
} from "../../../redux/features/collectionsSlice";
import { fetchSourcesOfCollection } from "../../../redux/features/sourcesSlice";
import { fetchContentOfSources } from "../../../redux/features/contentsSlice";
import { retrieveMarks } from "../../../redux/features/marksSlice";
import { resetThemeColours } from "../../../redux/features/themeSlice";
import { fetchPhrasesToCollection } from "../../../redux/features/collectionToPhraseSlice";

type Dispatch = ThunkDispatch<any, any, any>;

export const useFetchCollection = ({
  dispatch,
  collectionId,
}: {
  dispatch: Dispatch;
  collectionId: number;
}) => {
  useEffect(() => {
    dispatch(fetchCollection([collectionId]));
    dispatch(fetchSourcesOfCollection([collectionId]));
  }, [dispatch]);
};

export const useFetchNestedCollections = ({
  dispatch,
  collectionId,
  collection,
  collectionSettings,
}: {
  dispatch: Dispatch;
  collectionId: number;
  collection: Collection;
  collectionSettings: CollectionSettings;
}) => {
  useEffect(() => {
    dispatch(fetchNestedCollections([collectionId]));
  }, [collection, collectionSettings, collectionId]);
};

export const useFetchContent = ({
  dispatch,
  collectionId,
  sourceIds,
  sources,
}: {
  dispatch: Dispatch;
  collectionId: number;
  sourceIds: number[];
  sources: SourceDto[];
}) => {
  useEffect(() => {
    // if content is in another collection it tricks the refresh qeue mechanism
    // so we here just set the contents visible straight away.
    // Only because this dispatch's fetch is not synchronous
    dispatch(fetchContentOfSources(sourceIds)); /*.then(() =>
      setContentsVisible(contents),
      );*/
    dispatch(retrieveMarks(sourceIds));
  }, [collectionId, sources]);
};

export const useFetchContentOnFocus = ({
  dispatch,
  sourceIds,
}: {
  dispatch: Dispatch;
  sourceIds: number[];
}) => {
  let updateTimeout: NodeJS.Timeout | undefined;

  useEffect(() => {
    updateTimeout && clearTimeout(updateTimeout);

    /** fetches - content from the DB */
    const fetchCurrentContent = () => {
      dispatch(fetchContentOfSources(sourceIds));
      // console.log("updated", new Date(), collectionId, sourceIds);
      updateTimeout = setTimeout(
        () => requestAnimationFrame(fetchCurrentContent),
        1000 * 10,
      );
    };

    fetchCurrentContent();
    window.removeEventListener("focus", fetchCurrentContent);
    window.addEventListener("focus", fetchCurrentContent);

    return () => {
      updateTimeout && clearTimeout(updateTimeout);
      window.removeEventListener("focus", fetchCurrentContent);
    };
  }, [dispatch, sourceIds]);
};

export const useResetThemeColours = ({ dispatch }: { dispatch: Dispatch }) => {
  useEffect(() => {
    dispatch(resetThemeColours());
  }, [dispatch]);
};

export const useGreeting = ({ dispatch }: { dispatch: Dispatch }): string => {
  const [greeting, setGreeting] = useState<string>("");

  useEffect(() => {
    const updateGreeting = () => {
      const greeting = new Date().getHours() >= 12 ? "afternoon" : "morning";
      setGreeting(greeting);
      setTimeout(updateGreeting, 1000 * 60); // I don't know how setInterval will be handled in long sessions
    };
    updateGreeting();
  }, [dispatch]);

  return greeting;
};

export const useTitle = ({
  dispatch,
  isCustomizing,
}: {
  dispatch: Dispatch;
  isCustomizing: boolean;
}): { title: string } => {
  const greeting = useGreeting({ dispatch });
  const title = isCustomizing ? "edit" : greeting;
  return { title };
};

/**
 * Get the visible content based on the current state.
 * There is an array in the content reducer with the content,
 * and there is an array in state here for the visible content.
 *
 * Based on a couple of scenarios we update the visible content
 * with the latest content from the reducer.
 *
 * The 2 scenarios are the user clicking refresh, or the user navigating to a different collection.
 */
export const useGetRefreshedContent = ({
  dispatch,
  collectionId,
  contents,
}: {
  dispatch: Dispatch;
  collectionId: number;
  contents: ContentDto[];
}): {
  contentForDisplay: ContentDto[];
  refreshPossible: boolean;
  setDoRefresh: (value: boolean) => void;
} => {
  // "contentsVisible" is the displayed subset of the current contents
  // when the user clicks "reveal/refresh" then all contents are made visible.
  // Non-visible content is typically new content that is fetched after the last load.
  // For example, after visiting a "wikis" collection a new wiki article is fetched.
  const [contentsVisible, setContentsVisible] = useState<ContentDto[]>([]);
  const [doRefresh, setDoRefresh] = useState<boolean>(true);
  const [contentVisibleCollectionId, setContentVisibleCollectionId] =
    useState<number>(collectionId);

  useEffect(() => {
    // refresh because the user activated refresh or changed view filter to bookmarks
    console.log("refresh?", doRefresh);
    // we don't want to refresh before there is contents (contents.length)
    // because we `setDoRefresh = false` when we refresh
    if (doRefresh && contents.length) {
      // set contents visible items to avoid shifting items in view after new updates
      setContentsVisible(contents);
      setDoRefresh(false); // set back to false
      setContentVisibleCollectionId(collectionId);
    }
    console.log("refresh after?", doRefresh);
  }, [contents, doRefresh]);

  useEffect(() => {
    // when changing collections enable the content queue to refresh
    setDoRefresh(true);
    setContentsVisible(contents);
    setContentVisibleCollectionId(collectionId);
    dispatch(fetchPhrasesToCollection(collectionId));
  }, [collectionId]);

  // useEffect(() => {
  //   if (doRefresh) setContentsVisible(contents);
  // }, [doRefresh]);

  // know whether to just show content of collection or to show recency-based filtered list (cycles & speed)
  const isContentsVisible = contentVisibleCollectionId === collectionId;

  // is the most recent content item also the most recent visible item?
  // const isShowingMostCurrent =
  //   contents[0]?.date_published === contentsVisible[0]?.date_published &&
  //   contents[0]?.url === contentsVisible[0]?.url;

  // is the most recent content item also the most recent visible item?
  const isShowingMostCurrent = contents[0]?.id === contentsVisible[0]?.id;

  const contentForDisplay = isContentsVisible ? contentsVisible : contents;
  const refreshPossible = isContentsVisible && !isShowingMostCurrent;

  return {
    contentForDisplay,
    refreshPossible,
    setDoRefresh,
  };
};
