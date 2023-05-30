import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ContentColours } from "../../utilities/graphics/colours";
import { RootState } from "../store";

export interface ThemeState {
    colours: ContentColours
}

const initialThemeState: ThemeState = {
    colours: {
        primary: null,
        title: null,
        text: null,
        background: null
    }
}

/**
 * The Theme for the app as a whole.
 */
const themeSlice = createSlice({
    name: 'theme',
    initialState: initialThemeState,
    reducers: {
        // increment: (state, action: PayloadAction<number>) => state + action.payload,
        setThemeColours: (state, action: PayloadAction<ContentColours>) => ({
            ...state,
            colours: {
                ...state.colours,
                ...action.payload
            }
        }),
        resetThemeColours: (state, action: PayloadAction) => ({
            ...state,
            colours: {}
        }),
    },
    extraReducers: {}
})

export const { setThemeColours, resetThemeColours } = themeSlice.actions
export const selectColours = (state: RootState) => state.theme.colours

export const themeReducer = themeSlice.reducer
