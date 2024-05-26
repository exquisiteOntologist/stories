import { AsyncThunk, createAsyncThunk, createEntityAdapter, createSelector, createSlice } from "@reduxjs/toolkit";
import { invoke } from "@tauri-apps/api/core";
import { ContentDto, SourceDto } from "../../data/chirp-types";
import { RootState } from "../store";
import { fetchCollectionToSource, removeCollectionToSource, selectNestedSourceIds } from "./collectionToSourceSlice";

export const addMark = createAsyncThunk("mark/add", async (contentId: number, { dispatch }) => {
    try {
        await invoke("mark_add", {
            contentId,
        });

        // dispatch(upsertSources(sources as SourceDto[]))
        return true;
    } catch (e) {
        console.error("failed to add item to marks", e);
        return false;
    }
});

export const removeMark = createAsyncThunk("mark/remove", async (contentId: number, { dispatch }) => {
    try {
        await invoke("mark_remove", {
            contentId,
        });

        // dispatch(upsertSources(sources as SourceDto[]))
        return true;
    } catch (e) {
        console.error("failed to remove item from marks", e);
        return false;
    }
});

const marksAdapter = createEntityAdapter<ContentDto>({
    selectId: (source) => source.id,
});

const marksSlice = createSlice({
    name: "marks",
    initialState: marksAdapter.getInitialState(),
    reducers: {
        setAllMarks: marksAdapter.setAll,
        upsertMarks: marksAdapter.upsertMany,
    },
    extraReducers: {},
});

export const { setAllMarks, upsertMarks } = marksSlice.actions;
export const marksSelectors = marksAdapter.getSelectors<RootState>((state) => state.marks);

export const marksReducer = marksSlice.reducer;
