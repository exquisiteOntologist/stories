import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export enum SelectionKind {
    COLLECTION = 'COLLECTION',
    SOURCE = 'SOURCE',
    CONTENT = 'CONTENT'
}

export interface NavState {
    selectionKind: SelectionKind,
    submergeHistory: Array<number>,
    /**
     * 0 is the root collection (seeded on Rust lib init)
     */
    collectionId: number,
    priorCollId: number,
    sourceId: number,
    contentId: number
}

const initialNavState: NavState = {
    selectionKind: SelectionKind.COLLECTION,
    submergeHistory: [0],
    collectionId: 0,
    priorCollId: 0,
    sourceId: 0,
    contentId: 0
}

/**
 * The Nav for the app as a whole.
 */
const navSlice = createSlice({
    name: 'nav',
    initialState: initialNavState,
    reducers: {
        chooseCollection (state, action: PayloadAction<number>) {            
            // See if the current item is in history (before setting new item)

            if (!state.submergeHistory.includes(state.collectionId)) state.submergeHistory.push(state.collectionId)

            // Okay lets add the new history item

            const historyIndexPos = state.submergeHistory.indexOf(action.payload)
            const inHistory = historyIndexPos !== -1

            if (inHistory) state.submergeHistory.splice(historyIndexPos, state.submergeHistory.length - historyIndexPos)
            state.submergeHistory.push(action.payload)
            
            state.collectionId = action.payload
        }
    },
    extraReducers: {}
})

export const { chooseCollection } = navSlice.actions
export const selectNav = (state: RootState) => state.nav
export const selectCollectionId = (state: RootState) => state.nav.collectionId
export const selectHistory = (state: RootState) => state.nav.submergeHistory
export const selectPriorCollId = (state: RootState) => state.nav.priorCollId
export const selectSourceId = (state: RootState) => state.nav.sourceId
export const selectContentId = (state: RootState) => state.nav.contentId

export const navReducer = navSlice.reducer
