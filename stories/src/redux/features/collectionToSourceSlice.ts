import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import { invoke } from "@tauri-apps/api/core";
import { CollectionToSource } from "../../data/chirp-types";
import { RootState } from "../store";
import { selectCollectionId } from "./navSlice";
import { fetchSourcesOfCollection } from "./sourcesSlice";

export const fetchCollectionToSource = createAsyncThunk(
  "collectionToSource/fetchCollectionToSource",
  async (collectionIds: number[], { dispatch }) => {
    try {
      const collectionToSourceItems = await invoke("get_collection_to_source", {
        collectionIds: collectionIds,
      });

      // console.log('received C to S items:', collectionIds, collectionToSourceItems)

      dispatch(
        addManyCollectionToSource(
          // upsertCollectionToSource(
          collectionToSourceItems as CollectionToSource[],
        ),
      );
      await dispatch(fetchSourcesOfCollection(collectionIds));
    } catch (e) {
      console.error(
        "Unable to fetch Collection to Source mappings for",
        collectionIds,
        e,
      );
      throw new Error("Unable to fetch Collection to Source");
    }
  },
);

const collectionToSourceAdapter = createEntityAdapter({
  // selectId: (collectionToSource) => (collectionToSource.collection_id, collectionToSource.source_id),
  // Going to a string selection here fixed a bug with upsert where tuple would not recognise the combined key
  selectId: (collectionToSource: CollectionToSource) =>
    // by combining both ids they are treated as a unique single entity
    // if we instead have seperate id values in the tuple,
    // for some reason all source_ids of the same id are treated as the same entity,
    // ignoring the collection id
    // so using a string creates a combined key
    // this fixes some collections not showing the source if it is in another collection too
    `${collectionToSource.collection_id},${collectionToSource.source_id}`,
  // collectionToSource.collection_id,
  // collectionToSource.source_id
});

const collectionToSourceSlice = createSlice({
  name: "collectionToSource",
  initialState: collectionToSourceAdapter.getInitialState(),
  reducers: {
    // note here that if you fetch other collections mappings,
    // if you replace the current collection's mapping it will break.
    // If you upsert note that it replaces on the ID, so if the ID
    // is just the collection id then it won't work,
    // as there are many map items for the same collection
    setAllCollectionToSource: collectionToSourceAdapter.setAll,
    addManyCollectionToSource: collectionToSourceAdapter.addMany,
    upsertCollectionToSource: collectionToSourceAdapter.upsertMany,
    removeCollectionToSource: collectionToSourceAdapter.removeMany,
  },
});

export const {
  setAllCollectionToSource,
  addManyCollectionToSource,
  upsertCollectionToSource,
  removeCollectionToSource,
} = collectionToSourceSlice.actions;
export const collectionToSourceSelectors =
  collectionToSourceAdapter.getSelectors<RootState>(
    (state) => state.collectionToSource,
  );

/**
 * Select the nested source IDs within the current collection
 */
export const selectNestedSourceIds = createSelector(
  // First, pass one or more "input selector" functions:
  collectionToSourceSelectors.selectAll,
  // State selector (in this case all state to use with other slice's selectors)
  (s: RootState) => s,
  // Then, an "output selector" that receives all the input results as arguments
  // and returns a final result value
  (cToSs, s) => {
    const currentCollectionId = selectCollectionId(s);
    // console.log("cToSs", cToSs);
    const nestedSources = cToSs.filter(
      (cToS) => currentCollectionId === cToS.collection_id,
    );
    const nestedSourceIds: number[] = nestedSources.map(
      (cToC) => cToC.source_id,
    );

    // console.log("current collection id", currentCollectionId);
    // console.log("nested sources", nestedSources);
    // console.log("nested source ids", nestedSourceIds);

    return nestedSourceIds;
  },
);

export const collectionToSourceReducer = collectionToSourceSlice.reducer;
