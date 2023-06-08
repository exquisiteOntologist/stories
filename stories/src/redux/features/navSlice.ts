import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export enum SelectionKind {
    COLLECTION = 'COLLECTION',
    SOURCE = 'SOURCE',
    CONTENT = 'CONTENT'
}

export interface NavState {
    selectionKind: SelectionKind,
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
            console.log('choosing collection', action.payload)
            state.priorCollId = state.collectionId
            state.collectionId = action.payload
        }
    },
    extraReducers: {}
})

export const { chooseCollection } = navSlice.actions
export const selectNav = (state: RootState) => state.nav
export const selectCollectionId = (state: RootState) => state.nav.collectionId
export const selectPriorCollId = (state: RootState) => state.nav.priorCollId
export const selectSourceId = (state: RootState) => state.nav.sourceId
export const selectContentId = (state: RootState) => state.nav.contentId

export const navReducer = navSlice.reducer
