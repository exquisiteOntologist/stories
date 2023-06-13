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

            console.log('results', results)

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
        search_phrase: 'string',
        collections: [],
        sources: [],
        contents: [],
        bodies: []
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
// export const selectSearch = (state: RootState) => state.search
// export const selectCollectionId = (state: RootState) => state.search.collectionId
// export const selectHistory = (state: RootState) => state.search.submergeHistory
// export const selectPriorCollId = (state: RootState) => state.search.priorCollId
// export const selectSourceId = (state: RootState) => state.search.sourceId
// export const selectContentId = (state: RootState) => state.search.contentId

export const searchReducer = searchSlice.reducer
