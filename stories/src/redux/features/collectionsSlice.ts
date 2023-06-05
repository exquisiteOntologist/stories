import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { invoke } from "@tauri-apps/api";
import { Collection } from "../../data/chirp-types";
import { RootState } from "../store";
import { fetchCollectionSettings } from "./collectionSettingsSlice";

export const fetchCollection = createAsyncThunk(
    'collections/fetchCollection',
    async (collectionId: number, { dispatch }) => {
        try {
            const collections = await invoke('get_collection', {
                collectionIds: [collectionId]
            })
        
            dispatch(setAllCollections(collections as Collection[]))
            dispatch(fetchCollectionSettings([collectionId]))
        } catch (e) {
            console.error('Unable to fetch collection for', collectionId, e)
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
