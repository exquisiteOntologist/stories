import { AsyncThunk, createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { invoke } from "@tauri-apps/api";
import { SourceDto } from "../../data/chirp-types";
import { RootState } from "../store";

/**
 * Fetch sources.
 * If no ID is specified, then recent sources are fetched.
 */
export const fetchSources = createAsyncThunk(
    'sources/fetchSources',
    async (sourceIds: number[] | null | undefined, { dispatch }) => {
        // TODO: Do by sourceIds argument
        const sources = await invoke('list_sources')

        dispatch(setAllSources(sources as SourceDto[]))
    }
)

export const fetchSourcesOfCollection = createAsyncThunk(
    'sources/fetchSourcesOfCollection',
    async (collectionIds: number[] | null, { dispatch }) => {
        // TODO: Do by collection ids argument
        const sources = await invoke('list_sources')

        dispatch(setAllSources(sources as SourceDto[]))
    }
)

export interface SourceForCollection {
    collectionIds: number[] | null,
    sourceUrl: string,
    otherParam: string
}

export const addSourceToCollection: AsyncThunk<boolean, SourceForCollection, {}> = createAsyncThunk(
    'sources/addSourceToCollection',
    async (sourceForCollection: SourceForCollection, { dispatch }) => {
        const { collectionIds, sourceUrl, otherParam } = sourceForCollection
        
        try {
            const source = await invoke('add_source', {
                collectionIds,
                sourceUrl,
                additionalParam: otherParam,
            });

            if (!source) {
                throw new Error("failed to add source!");
                
            }
    
            dispatch(setAllSources([source] as SourceDto[]))
            return true
        } catch (e) {
            console.error('failed to add source', e)

            return false
        }
    }
)

export interface RemoveSources {
    collectionId: number,
    sourceIds: number[]
}

export const removeSources: AsyncThunk<boolean, RemoveSources, {}> = createAsyncThunk(
    'sources/removeSources',
    async (rmSources: RemoveSources, { dispatch }) => {
        try {
            await invoke('remove_sources', {...rmSources})
            dispatch(fetchSourcesOfCollection([rmSources.collectionId]))
            return true
        } catch (e) {
            console.error('failed to remove sources', e)
            return false
        }
    }
)

const sourcesAdapter = createEntityAdapter<SourceDto>({
    selectId: (source) => source.id
})

const sourcesSlice = createSlice({
    name: 'sources',
    initialState: sourcesAdapter.getInitialState(),
    reducers: {
        setAllSources: sourcesAdapter.setAll
    },
    extraReducers: {}
})

export const { setAllSources } = sourcesSlice.actions
export const sourcesSelectors = sourcesAdapter.getSelectors<RootState>((state) => state.sources)

export const sourcesReducer = sourcesSlice.reducer
