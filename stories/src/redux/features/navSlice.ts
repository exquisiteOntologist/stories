import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ContentColours } from "../../utilities/graphics/colours";
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
        // increment: (state, action: PayloadAction<number>) => state + action.payload,
        // setNavColours: (state, action: PayloadAction<ContentColours>) => ({
        //     ...state,
        //     colours: {
        //         ...state.colours,
        //         ...action.payload
        //     }
        // }),
        // resetNavColours: (state, action: PayloadAction) => ({
        //     ...state,
        //     colours: {}
        // }),
    },
    extraReducers: {}
})

export const { /* setNavColours, resetNavColours */ } = navSlice.actions
export const selectNav = (state: RootState) => state.nav
export const selectCollectionId = (state: RootState) => state.nav.collectionId
export const selectSourceId = (state: RootState) => state.nav.sourceId
export const selectContentId = (state: RootState) => state.nav.contentId

export const navReducer = navSlice.reducer
