import { AsyncThunk, createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { invoke } from "@tauri-apps/api/core";
import { CollectionSettings, SourceDto } from "../../data/chirp-types";
import { RootState } from "../store";

export const fetchCollectionSettings = createAsyncThunk(
    'collectionSettings/fetchCollectionSettings',
    async (collection_ids: number[], { dispatch }) => {
        const collectionSettings = await invoke('get_collection_settings', {
            collectionIds: collection_ids
        })

        // console.log('new settings', collection_ids, collectionSettings)

        dispatch(upsertCollectionSettings(collectionSettings as CollectionSettings[]))
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
        setAllCollectionSettings: collectionSettingsAdapter.setAll,
        addCollectionSettings: collectionSettingsAdapter.addMany,
        upsertCollectionSettings: collectionSettingsAdapter.upsertMany
    },
    extraReducers: {}
})

export const { setAllCollectionSettings, addCollectionSettings, upsertCollectionSettings } = collectionSettingsSlice.actions
export const collectionSettingsSelectors = collectionSettingsAdapter.getSelectors<RootState>((state) => state.collectionSettings)

export const collectionSettingsReducer = collectionSettingsSlice.reducer
