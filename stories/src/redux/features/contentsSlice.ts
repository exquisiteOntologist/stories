import { createAsyncThunk, createEntityAdapter, createSelector, createSlice, EntityId } from "@reduxjs/toolkit";
import { invoke } from "@tauri-apps/api/core";
import { ContentDto } from "../../data/chirp-types";
import { RootState } from "../store";
import { collectionToSourceSelectors } from "./collectionToSourceSlice";
import { selectCollectionId, selectNav } from "./navSlice";
import { sortRecencyDescending } from "../../utilities/dates";
import { checkRetrievalsIsUpdating } from "./sessionSlice";

export const fetchContentOfSources = createAsyncThunk("contents/fetchContentOfSources", async (sourceIds: EntityId[] | null, { dispatch, getState }) => {
    const content = await invoke("list_content", {
        sourceIds,
    });

    dispatch(addContents(content as ContentDto[]));
    dispatch(checkRetrievalsIsUpdating());
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

// in the event multiple items have same date, but not fetched together, you could append id to time string in comparison
const sortContentId = (cA: ContentDto, cB: ContentDto) => cB.id - cA.id;
const sortContentRecencyDescending = (cA: ContentDto, cB: ContentDto) => sortRecencyDescending(cA.date_published, cB.date_published);

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

export const selectContentByRecency = (s: RootState, itemLimit?: number) => {
    return selectContentOfCollection(s)
        .sort(sortContentRecencyDescending)
        .slice(0, itemLimit ?? 30);
};

export const contentsReducer = contentsSlice.reducer;
