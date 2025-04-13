import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import { invoke } from "@tauri-apps/api/core";
import { CollectionToPhrase, PhraseResult } from "../../data/chirp-types";
import { RootState } from "../store";
import { selectCollectionId } from "./navSlice";
import { addPhrases } from "./phrasesSlice";

export const fetchPhrasesToCollection = createAsyncThunk(
  "collectionToPhrase/fetchCollectionToPhrase",
  async (collectionId: number, { dispatch }) => {
    try {
      const phrases: PhraseResult[] = (await invoke(
        "collection_phrases_today",
        {
          collectionId,
        },
      )) as PhraseResult[];

      // add phrases to the other "phrases" slice"
      dispatch(addPhrases(phrases));

      const collectionToPhrases: CollectionToPhrase[] = phrases.map(
        (p) =>
          ({
            collection_id: collectionId,
            phrase_id: p.id,
          }) as CollectionToPhrase,
      );

      // add the mapping between the given collection and the phrases retrieved
      dispatch(upsertCollectionToPhrase(collectionToPhrases));
    } catch (e) {
      console.error(
        "Unable to fetch Collection to Phrase mappings for",
        collectionId,
        e,
      );
      throw new Error("Unable to fetch Collection to Phrase");
    }
  },
);

const collectionToPhraseAdapter = createEntityAdapter<CollectionToPhrase>({
  selectId: (collectionToPhrase) => (
    collectionToPhrase.collection_id, collectionToPhrase.phrase_id
  ),
});

const collectionToPhraseSlice = createSlice({
  name: "collectionToPhrase",
  initialState: collectionToPhraseAdapter.getInitialState(),
  reducers: {
    setAllCollectionToPhrase: collectionToPhraseAdapter.setAll,
    addManyCollectionToPhrase: collectionToPhraseAdapter.addMany,
    upsertCollectionToPhrase: collectionToPhraseAdapter.upsertMany,
    removeCollectionToPhrase: collectionToPhraseAdapter.removeMany,
  },
});

export const {
  setAllCollectionToPhrase,
  addManyCollectionToPhrase,
  upsertCollectionToPhrase,
  removeCollectionToPhrase,
} = collectionToPhraseSlice.actions;
export const collectionToPhraseSelectors =
  collectionToPhraseAdapter.getSelectors<RootState>(
    (state) => state.collectionToPhrase,
  );

/**
 * Select the nested phrase IDs within the current collection.
 * Note that the current collection is set in the "nav" slice.
 */
export const selectNestedPhraseIds = createSelector(
  // First, pass one or more "input selector" functions:
  collectionToPhraseSelectors.selectAll,
  // State selector (in this case all state to use with other slice's selectors)
  (s: RootState) => s,
  // Then, an "output selector" that receives all the input results as arguments
  // and returns a final result value
  (cToSs, s) => {
    const currentCollectionId = selectCollectionId(s);
    const nestedPhrases = cToSs.filter(
      (cToS) => currentCollectionId === cToS.collection_id,
    );
    const nestedPhraseIds: number[] = nestedPhrases.map(
      (cToC) => cToC.phrase_id,
    );

    return nestedPhraseIds;
  },
);

export const collectionToPhraseReducer = collectionToPhraseSlice.reducer;
