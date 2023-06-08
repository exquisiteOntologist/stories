import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { invoke } from "@tauri-apps/api";
import { CollectionToSource } from "../../data/chirp-types";
import { RootState } from "../store";
import { fetchSourcesOfCollection } from "./sourcesSlice";

export const fetchCollectionToSource = createAsyncThunk(
    'collectionToSource/fetchCollectionToSource',
    async (collectionIds: number[], { dispatch }) => {
        try {
            const collectionToSourceItems = await invoke('get_collection_to_source', {
                collectionIds: collectionIds
            })

            console.log('received C to S items:', collectionIds, collectionToSourceItems)
        
            await dispatch(upsertCollectionToSource(collectionToSourceItems as CollectionToSource[]))
            await dispatch(fetchSourcesOfCollection(collectionIds))
        } catch (e) {
            console.error('Unable to fetch Collection to Source mappings for', collectionIds, e)
            throw new Error("Unable to fetch Collection to Source");
        }
    }
)

const collectionToSourceAdapter = createEntityAdapter<CollectionToSource>({
    selectId: (collectionToSource) => (collectionToSource.collection_id, collectionToSource.source_id),
})

const collectionToSourceSlice = createSlice({
    name: 'collectionToSource',
    initialState: collectionToSourceAdapter.getInitialState(),
    reducers: {
        setAllCollectionToSource: collectionToSourceAdapter.setAll,
        addManyCollectionToSource: collectionToSourceAdapter.addMany,
        upsertCollectionToSource: collectionToSourceAdapter.upsertMany
    },
    extraReducers: {}
})

export const { setAllCollectionToSource, addManyCollectionToSource, upsertCollectionToSource } = collectionToSourceSlice.actions
export const collectionToSourceSelectors = collectionToSourceAdapter.getSelectors<RootState>((state) => state.collectionToSource)

// /**
//  * Select the nested collection IDs within the current collection
//  */
// export const selectNestedCollectionIds = createSelector(
//     // First, pass one or more "input selector" functions:
//     collectionToSourceSelectors.selectAll,
//     // State selector (in this case all state to use with other slice's selectors)
//     (s: RootState) => s,
//     // Then, an "output selector" that receives all the input results as arguments
//     // and returns a final result value
//     (cToCs, s) => {
//         const currentCollectionId = selectCollectionId(s)
//         const nestedCollections = cToCs.filter(cToC => currentCollectionId === cToC.collection_parent_id)
//         const nestedCollectionIds: number[] = nestedCollections.map(cToC => cToC.collection_inside_id)

//         return nestedCollectionIds
//     }
// )

// export const selectCollectionToSourceParentIds = createSelector(
//     // First, pass one or more "input selector" functions:
//     collectionToSourceSelectors.selectAll,
//     // Then, an "output selector" that receives all the input results as arguments
//     // and returns a final result value
//     cToCs => cToCs.map(cToC => cToC.collection_parent_id)
// )

export const collectionToSourceReducer = collectionToSourceSlice.reducer
