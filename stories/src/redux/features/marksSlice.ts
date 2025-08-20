import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import { invoke } from "@tauri-apps/api/core";
import { ContentDto } from "../../data/chirp-types";
import { RootState } from "../store";
import { addContents } from "./contentsSlice";
import { selectNestedSourceIds } from "./collectionToSourceSlice";

export const addMark = createAsyncThunk(
  "mark/add",
  async (content: ContentDto, { dispatch }) => {
    try {
      await invoke("mark_add", {
        contentId: content.id,
      });

      dispatch(retrieveMarks());
      return true;
    } catch (e) {
      console.error("failed to add item to marks", e, content);
      return false;
    }
  },
);

export const removeMark = createAsyncThunk(
  "mark/remove",
  async (content: ContentDto, { dispatch }) => {
    try {
      await invoke("mark_remove", {
        contentId: content.id,
      });

      dispatch(retrieveMarks());
      return true;
    } catch (e) {
      console.error("failed to remove item from marks", e, content);
      return false;
    }
  },
);

/**
    Retrieve all marks.
    Adds marks and also the associated content to the store.
    When no Source Ids are specified then the current sources for the current collection in view will be used.
*/
export const retrieveMarks = createAsyncThunk(
  "mark/fetch",
  async (sourceIds: number[] | undefined, { dispatch, getState }) => {
    try {
      const state = getState() as RootState;
      const sourcesToCheck: number[] =
        sourceIds || selectNestedSourceIds(state);
      const contents = (await invoke("list_marks_of_sources", {
        sourceIds: sourcesToCheck,
      })) as ContentDto[];

      dispatch(setAllMarks(contents.map((c) => c.id)));
      dispatch(addContents(contents as ContentDto[]));

      return true;
    } catch (e) {
      console.error("failed to fetch marks for given sources", e, sourceIds);
      return false;
    }
  },
);

const marksAdapter = createEntityAdapter({
  selectId: (markId: number) => markId,
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
});

export const { setAllMarks, upsertMarks, addOneMark, removeOneMark } =
  marksSlice.actions;
export const marksSelectors = marksAdapter.getSelectors<RootState>(
  (state) => state.marks,
);

export const marksReducer = marksSlice.reducer;
