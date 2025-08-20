import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import { invoke } from "@tauri-apps/api/core";
import { PhraseResult } from "../../data/chirp-types";
import { RootState } from "../store";
import { selectNestedPhraseIds } from "./collectionToPhraseSlice";
import {
  _testForwardFilterOrderedContiguous,
  forwardFilterOrdered,
} from "../../utilities/arrays";

export const fetchPhrasesOfCollection = createAsyncThunk(
  "phrases/fetchPhrasesOfCollection",
  async (collectionId: number, { dispatch }) => {
    const phrase = await invoke("collection_phrases_today", {
      collectionId,
    });

    dispatch(setAllPhrases(phrase as PhraseResult[]));
  },
);

const phrasesAdapter = createEntityAdapter({
  selectId: (phrase: PhraseResult) => phrase.id,
});

const phrasesSlice = createSlice({
  name: "phrases",
  initialState: phrasesAdapter.getInitialState(),
  reducers: {
    setAllPhrases: phrasesAdapter.setAll,
    addPhrases: phrasesAdapter.addMany,
    upsertPhrases: phrasesAdapter.upsertMany,
  },
});

export const { setAllPhrases, addPhrases, upsertPhrases } =
  phrasesSlice.actions;
export const phrasesSelectors = phrasesAdapter.getSelectors<RootState>(
  (state) => state.phrases,
);

/**
 * Select the phrases of the currently visible sources
 */
export const selectPhrasesOfCollection = createSelector(
  // First, pass one or more "input selector" functions:
  phrasesSelectors.selectAll,
  // State selector (in this case all state to use with other slice's selectors)
  (s: RootState) => s,
  // Then, an "output selector" that receives all the input results as arguments
  // and returns a final result value
  (phrases, s) => {
    const phraseIds = selectNestedPhraseIds(s);
    const collectionPhrases = forwardFilterOrdered(
      phrases,
      phraseIds,
      (p) => p.id,
    );
    return collectionPhrases;
  },
);

export const phrasesReducer = phrasesSlice.reducer;
