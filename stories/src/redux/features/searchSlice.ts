import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { invoke } from "@tauri-apps/api";
import { SearchResultsDto } from "../../data/chirp-types";
import { RootState } from "../store";

export const search = createAsyncThunk(
    'search/search',
    async (searchPhrase: string, { dispatch }) => {
        try {
            const results = await invoke('search', {
                searchPhrase
            })

            dispatch(setSearchResults(results as SearchResultsDto))

            return true
        } catch (e) {
            console.error('Failed to get search results')
            return false
        }
    }
)

export interface SearchState {
    searchResults: SearchResultsDto
}

const initialSearchState: SearchState = {
    searchResults: {
        search_id: 0,
        search_phrase: 'string',
        collections: [],
        sources: [],
        contents: [],
        body_content_ids: [],
        entity_people: [],
        entity_places: [],
        entity_brands: [],
        entity_chemicals: [],
        entity_materials: [],
        entity_concepts: [],
        mean_temperament: 1
    }
}

/**
 * The Search for the app as a whole.
 */
const searchSlice = createSlice({
    name: 'search',
    initialState: initialSearchState,
    reducers: {
        setSearchResults (state, action: PayloadAction<SearchResultsDto>) {
            state.searchResults = action.payload
        }
    },
    extraReducers: {}
})

export const { setSearchResults } = searchSlice.actions
export const selectSearchResults = (state: RootState) => state.search.searchResults

export const searchReducer = searchSlice.reducer
