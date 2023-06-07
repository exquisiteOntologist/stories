import { createAsyncThunk, createEntityAdapter, createSelector, createSlice } from "@reduxjs/toolkit";
import { invoke } from "@tauri-apps/api";
import { CollectionToCollection } from "../../data/chirp-types";
import { RootState } from "../store";

export const fetchCollectionToCollection = createAsyncThunk(
    'collectionToCollection/fetchCollectionToCollection',
    async (parentCollectionIds: number[], { dispatch }) => {
        try {
            const collectionToCollectionItems = await invoke('get_collection_to_collection', {
                parentIds: parentCollectionIds
            })
        
            dispatch(addManyCollectionToCollection(collectionToCollectionItems as CollectionToCollection[]))
        } catch (e) {
            console.error('Unable to fetch Collection to Collection mappings for', parentCollectionIds, e)
            throw new Error("Unable to fetch Collection to Collection");
            
        }
    }
)

const collectionToCollectionAdapter = createEntityAdapter<CollectionToCollection>({
    selectId: (collectionToCollection) => (collectionToCollection.collection_parent_id, collectionToCollection.collection_inside_id),
})

const collectionToCollectionSlice = createSlice({
    name: 'collectionToCollection',
    initialState: collectionToCollectionAdapter.getInitialState(),
    reducers: {
        setAllCollectionToCollection: collectionToCollectionAdapter.setAll,
        addManyCollectionToCollection: collectionToCollectionAdapter.addMany
    },
    extraReducers: {}
})

export const { setAllCollectionToCollection, addManyCollectionToCollection } = collectionToCollectionSlice.actions
export const collectionToCollectionSelectors = collectionToCollectionAdapter.getSelectors<RootState>((state) => state.collectionToCollection)

export const selectCollectionToCollectionParentIds = createSelector(
    // First, pass one or more "input selector" functions:
    collectionToCollectionSelectors.selectAll,
    // Then, an "output selector" that receives all the input results as arguments
    // and returns a final result value
    cToCs => cToCs.map(cToC => cToC.collection_parent_id)
)

export const collectionToCollectionReducer = collectionToCollectionSlice.reducer
