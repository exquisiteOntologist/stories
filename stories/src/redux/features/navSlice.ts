import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export enum SelectionKind {
  COLLECTION = "COLLECTION",
  SOURCE = "SOURCE",
  PHRASE = "PHRASE",
  CONTENT = "CONTENT",
}

export enum ViewMode {
  BOOKMARKS,
  PHRASES,
}

export interface Filter {
  viewModes: ViewMode[];
}

export interface NavState {
  selectionKind: SelectionKind;
  submergeHistory: Array<number>;
  /**
   * 0 is the root collection (seeded on Rust lib init)
   */
  collectionId: number;
  sourceId: number;
  contentId: number;
  isCustomizing: boolean;
  loading: boolean;
  filter: Filter;
}

const initialNavState: NavState = {
  selectionKind: SelectionKind.COLLECTION,
  submergeHistory: [0],
  collectionId: 0,
  sourceId: 0,
  contentId: 0,
  isCustomizing: false,
  loading: true,
  filter: {
    viewModes: [],
  },
};

/**
 * The Nav for the app as a whole.
 */
const navSlice = createSlice({
  name: "nav",
  initialState: initialNavState,
  reducers: {
    setSelectionKind(state, action: PayloadAction<SelectionKind>) {
      state.selectionKind = action.payload;
    },
    chooseCollection(state, action: PayloadAction<number>) {
      // See if the current item is in history (before setting new item)

      if (!state.submergeHistory.includes(state.collectionId))
        state.submergeHistory.push(state.collectionId);

      // Okay lets add the new history item

      const historyIndexPos = state.submergeHistory.indexOf(action.payload);
      const inHistory = historyIndexPos !== -1;

      if (inHistory)
        state.submergeHistory.splice(
          historyIndexPos,
          state.submergeHistory.length - historyIndexPos,
        );
      state.submergeHistory.push(action.payload);

      state.collectionId = action.payload;
    },
    setIsCustomizing(state, action: PayloadAction<boolean>) {
      state.isCustomizing = action.payload;
    },
    toggleIsCustomizing(state, action: PayloadAction) {
      state.isCustomizing = !state.isCustomizing;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setFilter(state, action: PayloadAction<Filter>) {
      state.filter = action.payload;
    },
    toggleFilterViewMode(state, action: PayloadAction<ViewMode>) {
      const viewModes = state.filter.viewModes;
      const activeIndex = viewModes.indexOf(action.payload);
      if (activeIndex !== -1) {
        viewModes.splice(activeIndex, 1);
      } else {
        viewModes.push(action.payload);
      }
    },
  },
});

export const {
  chooseCollection,
  setIsCustomizing,
  toggleIsCustomizing,
  setLoading,
  setFilter,
  toggleFilterViewMode,
} = navSlice.actions;
export const selectNav = (state: RootState) => state.nav;
export const selectCollectionId = (state: RootState) => state.nav.collectionId;
export const selectHistory = (state: RootState) => state.nav.submergeHistory;
export const selectSourceId = (state: RootState) => state.nav.sourceId;
export const selectContentId = (state: RootState) => state.nav.contentId;
export const selectIsCustomizing = (state: RootState) =>
  state.nav.isCustomizing;
export const selectLoading = (state: RootState) => state.nav.loading;
export const selectFilter = (state: RootState) => state.nav.filter;
export const isViewModeActive = (
  state: RootState["nav"]["filter"],
  viewMode: ViewMode,
): boolean => {
  return state.viewModes.includes(viewMode);
};
export const selectIsViewModeActive = (state: RootState, viewMode: ViewMode) =>
  isViewModeActive(state.nav.filter, viewMode);

export const navReducer = navSlice.reducer;
