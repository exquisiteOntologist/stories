import { AsyncThunk, createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { invoke } from "@tauri-apps/api";
import { CollectionSettings, SourceDto } from "../../data/chirp-types";
import { RootState } from "../store";

export const fetchCollectionSettings = createAsyncThunk(
    'collectionSettings/fetchCollectionSettings',
    async (collection_ids: number[], { dispatch }) => {
        const collectionSettings = await invoke('get_collection_settings', {
            collectionIds: collection_ids
        })

        dispatch(setAllCollectionSettings(collectionSettings as CollectionSettings[]))
    }
)

export const setCollectionSettings = createAsyncThunk(
    'collectionSettings/setCollectionSettings',
    async (cs: CollectionSettings, { dispatch }) => {
        await invoke('set_collection_settings', {
            // object argument's name has to be property name
            cs
        })

        dispatch(fetchCollectionSettings([cs.collection_id]))
    }
)

const collectionSettingsAdapter = createEntityAdapter<CollectionSettings>({
    selectId: (collectionSettings) => collectionSettings.collection_id
})

const collectionSettingsSlice = createSlice({
    name: 'collectionSettings',
    initialState: collectionSettingsAdapter.getInitialState(),
    reducers: {
        setAllCollectionSettings: collectionSettingsAdapter.setAll
    },
    extraReducers: {}
})

export const { setAllCollectionSettings } = collectionSettingsSlice.actions
export const collectionSettingsSelectors = collectionSettingsAdapter.getSelectors<RootState>((state) => state.collectionSettings)

export const collectionSettingsReducer = collectionSettingsSlice.reducer
