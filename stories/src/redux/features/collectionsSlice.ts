import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { invoke } from "@tauri-apps/api";
import { Collection } from "../../data/chirp-types";
import { RootState } from "../store";
import { fetchCollectionSettings } from "./collectionSettingsSlice";
import { collectionToCollectionSelectors, fetchCollectionToCollection } from "./collectionToCollectionSlice";

export const fetchCollection = createAsyncThunk(
    'collections/fetchCollection',
    async (collectionIds: number[], { dispatch }) => {
        try {
            const collections = await invoke('get_collection', {
                collectionIds: collectionIds
            })
        
            dispatch(setAllCollections(collections as Collection[]))
            dispatch(fetchCollectionSettings(collectionIds))
            dispatch(fetchCollectionToCollection(collectionIds))
        } catch (e) {
            console.error('Unable to fetch collection for', collectionIds, e)
        }
    }
)

export const fetchNestedCollections = createAsyncThunk(
    'collections/fetchNestedCollections',
    async (parentIds: number[], { dispatch, getState }) => {
        try {
            const allCtoC = collectionToCollectionSelectors.selectAll(getState());
            const children = allCtoC.filter(cToC => parentIds.includes(cToC.collection_parent_id))
            dispatch(fetchCollection(children.map(c => c.collection_inside_id)))
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

export const collectionsReducer = collectionsSlice.reducer
