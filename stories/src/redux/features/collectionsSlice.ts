import { createAsyncThunk, createEntityAdapter, createSelector, createSlice } from "@reduxjs/toolkit";
import { invoke } from "@tauri-apps/api";
import { Collection } from "../../data/chirp-types";
import { useAppSelector } from "../hooks";
import { RootState } from "../store";
import { fetchCollectionSettings } from "./collectionSettingsSlice";
import { collectionToCollectionSelectors, fetchCollectionToCollection, selectNestedCollectionIds } from "./collectionToCollectionSlice";

export const fetchCollection = createAsyncThunk(
    'collections/fetchCollection',
    async (collectionIds: number[], { dispatch }) => {
        try {
            const collections = await invoke('get_collection', {
                collectionIds: collectionIds
            })
        
            dispatch(setAllCollections(collections as Collection[]))
            dispatch(fetchCollectionSettings(collectionIds))
            await dispatch(fetchCollectionToCollection(collectionIds))
        } catch (e) {
            console.error('Unable to fetch collection for', collectionIds, e)
        }
    }
)

export const fetchNestedCollections = createAsyncThunk(
    'collections/fetchNestedCollections',
    async (parentIds: number[], { dispatch, getState }) => {
        try {
            const nestedCollectionIds = selectNestedCollectionIds(getState() as RootState)
            dispatch(fetchCollection(nestedCollectionIds))
        } catch (e) {
            console.error('Unable to fetch collection for', parentIds, e)
        }
    }
)

export interface NewCollection {
    collectionName: string,
    parentId: number
}

export const addNewCollection = createAsyncThunk(
    'collections/addNewCollection',
    async (newCollection: NewCollection, { dispatch }) => {
        try {
            await invoke('add_collection', {
                cName: newCollection.collectionName,
                cParentId: newCollection.parentId
            })
        
            dispatch(fetchCollection([newCollection.parentId]))
            dispatch(fetchNestedCollections([newCollection.parentId]))
            return true
        } catch (e) {
            console.error('Unable to add new collection', newCollection, e)
            return false
        }
    }
)

const collectionsAdapter = createEntityAdapter<Collection>({
    selectId: (collection) => collection.id
})

const collectionsSlice = createSlice({
    name: 'collections',
    initialState: collectionsAdapter.getInitialState(),
    reducers: {
        setAllCollections: collectionsAdapter.setAll
    },
    extraReducers: {}
})

export const { setAllCollections } = collectionsSlice.actions
export const collectionsSelectors = collectionsAdapter.getSelectors<RootState>((state) => state.collections)

/**
 * Select the nested collection IDs within the current collection
 */
export const selectNestedCollections = createSelector(
    // First, pass one or more "input selector" functions:
    collectionsSelectors.selectAll,
    // State selector (in this case all state to use with other slice's selectors)
    (s: RootState) => s,
    // Then, an "output selector" that receives all the input results as arguments
    // and returns a final result value
    (collections, s) => {
        const nestedCollectionIds: number[] = selectNestedCollectionIds(s)
        const nestedCollections: Collection[] = collections.filter(c => nestedCollectionIds.includes(c.id))

        return nestedCollections
    }
)

export const collectionsReducer = collectionsSlice.reducer
