import { createAsyncThunk, createEntityAdapter, createSelector, createSlice, EntityId } from "@reduxjs/toolkit";
import { invoke } from "@tauri-apps/api/core";
import { PhraseResult } from "../../data/chirp-types";
import { RootState } from "../store";
import { collectionToSourceSelectors } from "./collectionToSourceSlice";
import { selectCollectionId, selectNav } from "./navSlice";

export const fetchPhrasesOfCollection = createAsyncThunk("phrases/fetchPhrasesOfCollection", async (collectionId: number, { dispatch }) => {
    const phrase = await invoke("collection_phrases_today", {
        collectionId,
    });

    dispatch(setAllPhrases(phrase as PhraseResult[]));
});

const phrasesAdapter = createEntityAdapter<PhraseResult>({
    selectId: (phrase) => phrase.id,
});

const phrasesSlice = createSlice({
    name: "phrases",
    initialState: phrasesAdapter.getInitialState(),
    reducers: {
        setAllPhrases: phrasesAdapter.setAll,
        addPhrasess: phrasesAdapter.addMany,
        upsertPhrases: phrasesAdapter.upsertMany,
    },
    extraReducers: {},
});

export const { setAllPhrases, addPhrasess, upsertPhrases } = phrasesSlice.actions;
export const phrasesSelectors = phrasesAdapter.getSelectors<RootState>((state) => state.phrases);

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
        // const collectionId = selectCollectionId(s);
        // const collectionToSource = collectionToSourceSelectors.selectAll(s).filter((c_to_s) => collectionId === c_to_s.collection_id);
        // const sourceIds = collectionToSource.map((c_to_s) => c_to_s.source_id);
        // const collectionPhrasess = phrases.filter((c) => sourceIds.includes(c.source_id));

        // return collectionPhrasess;
        return phrases;
    },
);

export const phrasesReducer = phrasesSlice.reducer;
