// import { AsyncThunk, createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
// import { components } from "../../data/openapi";
// import { getSources, getSourcesOfCollection, postAddSource } from "../../utilities/requests";
// import { RootState } from "../store";

// export const fetchSources = createAsyncThunk(
//     'sources/fetchSources',
//     async (sourceIds: number[] | null, { dispatch }) => {
//         const sources = await getSources({
//             sourceIds
//         })

//         if (sources.status !== 200) return

//         dispatch(setAllSources(sources.data))
//     }
// )

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

// const sourcesAdapter = createEntityAdapter<components["schemas"]["SourceDto"]>({
//     selectId: (source) => source.sourceId
// })

// const sourcesSlice = createSlice({
//     name: 'sources',
//     initialState: sourcesAdapter.getInitialState(),
//     reducers: {
//         setAllSources: sourcesAdapter.setAll
//     },
//     extraReducers: {}
// })

// export const { setAllSources } = sourcesSlice.actions
// export const sourcesSelectors = sourcesAdapter.getSelectors<RootState>((state) => state.sources)

// export const sourcesReducer = sourcesSlice.reducer
