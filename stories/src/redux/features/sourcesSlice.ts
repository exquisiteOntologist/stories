import { AsyncThunk, createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { invoke } from "@tauri-apps/api";
import { RootState } from "../store";

/**
 * Fetch sources.
 * If no ID is specified, then recent sources are fetched.
 */
export const fetchSources = createAsyncThunk(
    'sources/fetchSources',
    async (sourceIds: number[] | null | undefined, { dispatch }) => {
        // const sources = await getSources({
        //     sourceIds
        // })

        // if (sources.status !== 200) return

        // dispatch(setAllSources(sources.data))

        const sources = await new Promise(r => invoke('list_sources').then((response) => r(response)))

        dispatch(setAllSources(sources))
    }
)

// export const fetchSourcesOfCollection = createAsyncThunk(
//     'sources/fetchSourcesOfCollection',
//     async (collectionIds: number[] | null, { dispatch }) => {
//         const sources = await getSourcesOfCollection({
//             collectionIds
//         })

//         if (sources.status !== 200) return

//         dispatch(setAllSources(sources.data))
//     }
// )

// export interface SourceForCollection {
//     sourceUrl: string
//     collectionIds: number[] | null
// }

// export const addSourceToCollection: AsyncThunk<boolean, SourceForCollection, {}> = createAsyncThunk(
//     'sources/addSourceToCollection',
//     async (sourceForCollection: SourceForCollection, { dispatch }) => {
//         const { sourceUrl, collectionIds } = sourceForCollection
        
//         try {
//             const sourceAdded = await postAddSource({
//                 sourceUrl,
//                 collectionIds
//             })
    
//             if (sourceAdded.status !== 200) throw new Error('failed to add source')
    
//             const newSources = [sourceAdded.data]
//             dispatch(setAllSources(newSources))
//             return true
//         } catch (e) {
//             console.error('failed to add source', e)

//             return false
//         }
//     }
// )

const sourcesAdapter = createEntityAdapter<any /* SourceDto type */>({
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
