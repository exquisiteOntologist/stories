import { AsyncThunk, createAsyncThunk, createEntityAdapter, createSelector, createSlice } from "@reduxjs/toolkit";
import { invoke } from "@tauri-apps/api/core";
import { ContentDto, SourceDto } from "../../data/chirp-types";
import { RootState } from "../store";
import { fetchCollectionToSource, removeCollectionToSource, selectNestedSourceIds } from "./collectionToSourceSlice";
import { addContents } from "./contentsSlice";

export const addMark = createAsyncThunk("mark/add", async (content: ContentDto, { dispatch }) => {
    try {
        await invoke("mark_add", {
            contentId: content.id,
        });

        dispatch(retrieveMarks([content.source_id]));
        return true;
    } catch (e) {
        console.error("failed to add item to marks", e, content);
        return false;
    }
});

export const removeMark = createAsyncThunk("mark/remove", async (content: ContentDto, { dispatch }) => {
    try {
        await invoke("mark_remove", {
            contentId: content.id,
        });

        dispatch(retrieveMarks([content.source_id]));
        return true;
    } catch (e) {
        console.error("failed to remove item from marks", e, content);
        return false;
    }
});

export const retrieveMarks = createAsyncThunk("mark/fetch", async (sourceIds: number[], { dispatch }) => {
    try {
        const contents = (await invoke("list_marks_of_sources", {
            sourceIds,
        })) as ContentDto[];

        dispatch(upsertMarks(contents.map((c) => c.id)));
        dispatch(addContents(contents as ContentDto[]));
        return true;
    } catch (e) {
        console.error("failed to fetch marks for given sources", e, sourceIds);
        return false;
    }
});

const marksAdapter = createEntityAdapter<number>({
    selectId: (markId) => markId,
});

const marksSlice = createSlice({
    name: "marks",
    initialState: marksAdapter.getInitialState(),
    reducers: {
        setAllMarks: marksAdapter.setAll,
        upsertMarks: marksAdapter.upsertMany,
        addOneMark: marksAdapter.addOne,
        removeOneMark: marksAdapter.removeOne,
    },
    extraReducers: {},
});

export const { setAllMarks, upsertMarks, addOneMark, removeOneMark } = marksSlice.actions;
export const marksSelectors = marksAdapter.getSelectors<RootState>((state) => state.marks);

export const marksReducer = marksSlice.reducer;
