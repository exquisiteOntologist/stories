import { createAsyncThunk, createEntityAdapter, createSelector, createSlice, EntityId } from "@reduxjs/toolkit";
import { invoke } from "@tauri-apps/api/core";
import { ContentDto } from "../../data/chirp-types";
import { RootState } from "../store";
import { collectionToSourceSelectors } from "./collectionToSourceSlice";
import { selectCollectionId, selectNav } from "./navSlice";

export const fetchContentOfSources = createAsyncThunk("contents/fetchContentOfSources", async (sourceIds: EntityId[] | null, { dispatch, getState }) => {
    const content = await invoke("list_content", {
        sourceIds,
    });

    dispatch(addContents(content as ContentDto[]));
});

export const fetchContent = createAsyncThunk("contents/fetchContent", async (contentIds: number[] | null | undefined, { dispatch }) => {
    const content = await invoke("list_content");

    dispatch(addContents(content as ContentDto[]));
});

const contentsAdapter = createEntityAdapter<ContentDto>({
    selectId: (content) => content.id,
});

const contentsSlice = createSlice({
    name: "contents",
    initialState: contentsAdapter.getInitialState(),
    reducers: {
        setAllContents: contentsAdapter.setAll,
        addContents: contentsAdapter.addMany,
        upsertContents: contentsAdapter.upsertMany,
    },
    extraReducers: {},
});

export const { setAllContents, addContents } = contentsSlice.actions;
export const contentsSelectors = contentsAdapter.getSelectors<RootState>((state) => state.contents);

/**
 * Select the contents of the currently visible sources
 */
export const selectContentOfCollection = createSelector(
    // First, pass one or more "input selector" functions:
    contentsSelectors.selectAll,
    // State selector (in this case all state to use with other slice's selectors)
    (s: RootState) => s,
    // Then, an "output selector" that receives all the input results as arguments
    // and returns a final result value
    (contents, s) => {
        const collectionId = selectCollectionId(s);
        const collectionToSource = collectionToSourceSelectors.selectAll(s).filter((c_to_s) => collectionId === c_to_s.collection_id);
        const sourceIds = collectionToSource.map((c_to_s) => c_to_s.source_id);
        const collectionContents = contents.filter((c) => sourceIds.includes(c.source_id));

        return collectionContents;
    },
);

export const contentsReducer = contentsSlice.reducer;
