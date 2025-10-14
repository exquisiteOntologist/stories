import { useEffect } from "react";
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
