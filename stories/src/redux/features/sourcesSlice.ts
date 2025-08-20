import {
  AsyncThunk,
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import { invoke } from "@tauri-apps/api/core";
import { SourceDto } from "../../data/chirp-types";
import { RootState } from "../store";
import {
  fetchCollectionToSource,
  removeCollectionToSource,
  selectNestedSourceIds,
} from "./collectionToSourceSlice";
import { forwardFilterOrdered } from "../../utilities/arrays";

// /**
//  * Fetch sources.
//  * If no ID is specified, then recent sources are fetched.
//  */
// export const fetchSources = createAsyncThunk(
//     'sources/fetchSources',
//     async (sourceIds: number[] | null | undefined, { dispatch }) => {
//         // TODO: Do by sourceIds argument
//         const sources = await invoke('list_sources')

//         dispatch(setAllSources(sources as SourceDto[]))
//     }
// )

export const fetchSourcesOfCollection = createAsyncThunk(
  "sources/fetchSourcesOfCollection",
  async (collectionIds: number[], { dispatch }) => {
    try {
      const sources = await invoke("list_source_of_collections", {
        collectionIds: collectionIds,
      });

      dispatch(upsertSources(sources as SourceDto[]));
      return true;
    } catch (e) {
      console.error("failed to fetch sources of collection", e);
      return false;
    }
  },
);

export interface SourceForCollection {
  collectionId: number;
  sourceUrl: string;
  otherParam: string;
}

export const addSourceToCollection: AsyncThunk<
  boolean,
  SourceForCollection,
  {}
> = createAsyncThunk(
  "sources/addSourceToCollection",
  async (sourceForCollection: SourceForCollection, { dispatch }) => {
    const { collectionId, sourceUrl, otherParam } = sourceForCollection;

    try {
      const source = await invoke("add_source", {
        collectionId,
        sourceUrl,
        additionalParam: otherParam,
      });

      if (!source) {
        throw new Error("failed to add source!");
      }

      await dispatch(
        fetchCollectionToSource([sourceForCollection.collectionId]),
      );
      return true;
    } catch (e) {
      console.error("failed to add source", e);

      return false;
    }
  },
);

export interface RemoveSources {
  collectionId: number;
  sourceIds: number[];
}

export const removeSources: AsyncThunk<boolean, RemoveSources, {}> =
  createAsyncThunk(
    "sources/removeSources",
    async (rmSources: RemoveSources, { dispatch }) => {
      try {
        await invoke("remove_sources", { ...rmSources });
        // here we remove locally because upsert etc may not do it (fetch)
        dispatch(removeCollectionToSource(rmSources.sourceIds));
        await dispatch(fetchCollectionToSource([rmSources.collectionId]));
        return true;
      } catch (e) {
        console.error("failed to remove sources", e);
        return false;
      }
    },
  );

const sourcesAdapter = createEntityAdapter({
  selectId: (source: SourceDto) => source.id,
});

const sourcesSlice = createSlice({
  name: "sources",
  initialState: sourcesAdapter.getInitialState(),
  reducers: {
    setAllSources: sourcesAdapter.setAll,
    upsertSources: sourcesAdapter.upsertMany,
  },
});

export const { setAllSources, upsertSources } = sourcesSlice.actions;
export const sourcesSelectors = sourcesAdapter.getSelectors<RootState>(
  (state) => state.sources,
);

/**
 * Select the nested sources within the current collection
 */
export const selectNestedSources = createSelector(
  // First, pass one or more "input selector" functions:
  sourcesSelectors.selectAll,
  // State selector (in this case all state to use with other slice's selectors)
  (s: RootState) => s,
  // Then, an "output selector" that receives all the input results as arguments
  // and returns a final result value
  (sources, s) => {
    const nestedSourceIds: number[] = selectNestedSourceIds(s);
    const nestedSources: SourceDto[] = forwardFilterOrdered(
      sources,
      nestedSourceIds,
      (c) => c.id,
    );

    return nestedSources;
  },
);

export const sourcesReducer = sourcesSlice.reducer;
