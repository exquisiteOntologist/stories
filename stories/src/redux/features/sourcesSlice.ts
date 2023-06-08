import { AsyncThunk, createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { invoke } from "@tauri-apps/api";
import { SourceDto } from "../../data/chirp-types";
import { RootState } from "../store";

// /**
//  * Fetch sources.
//  * If no ID is specified, then recent sources are fetched.
//  */
// export const fetchSources = createAsyncThunk(
//     'sources/fetchSources',
//     async (sourceIds: number[] | null | undefined, { dispatch }) => {
//         // TODO: Do by sourceIds argument
//         const sources = await invoke('list_sources')

//         dispatch(setAllSources(sources as SourceDto[]))
//     }
// )

export const fetchSourcesOfCollection = createAsyncThunk(
    'sources/fetchSourcesOfCollection',
    async (collectionIds: number[], { dispatch }) => {
        try {
            const sources = await invoke('list_source_of_collections', {
                collectionIds: collectionIds
            })

            dispatch(upsertSources(sources as SourceDto[]))
            return true
        } catch (e) {
            console.error('failed to fetch sources of collection', e)
            return false
        }
    }
)

export interface SourceForCollection {
    collectionId: number,
    sourceUrl: string,
    otherParam: string
}

export const addSourceToCollection: AsyncThunk<boolean, SourceForCollection, {}> = createAsyncThunk(
    'sources/addSourceToCollection',
    async (sourceForCollection: SourceForCollection, { dispatch }) => {
        const { collectionId, sourceUrl, otherParam } = sourceForCollection
        
        try {
            const source = await invoke('add_source', {
                collectionId,
                sourceUrl,
                additionalParam: otherParam,
            });

            if (!source) {
                throw new Error("failed to add source!");
            }
    
            dispatch(upsertSources([source] as SourceDto[]))
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
        setAllSources: sourcesAdapter.setAll,
        upsertSources: sourcesAdapter.upsertMany
    },
    extraReducers: {}
})

export const { setAllSources, upsertSources } = sourcesSlice.actions
export const sourcesSelectors = sourcesAdapter.getSelectors<RootState>((state) => state.sources)

export const sourcesReducer = sourcesSlice.reducer
