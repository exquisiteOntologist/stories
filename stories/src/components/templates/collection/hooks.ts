import { useEffect, useState } from "react";
import {
  Collection,
  CollectionSettings,
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
}): string => {
  const greeting = useGreeting({ dispatch });
  const title = isCustomizing ? "edit" : greeting;
  return title;
};
