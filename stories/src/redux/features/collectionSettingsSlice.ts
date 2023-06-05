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

// export interface SourceForCollection {
//     collectionIds: number[] | null,
//     sourceUrl: string,
//     otherParam: string
// }

// export const addSourceToCollection: AsyncThunk<boolean, SourceForCollection, {}> = createAsyncThunk(
//     'collectionSettings/addSourceToCollection',
//     async (sourceForCollection: SourceForCollection, { dispatch }) => {
//         const { collectionIds, sourceUrl, otherParam } = sourceForCollection
        
//         try {
//             const source = await invoke('add_source', {
//                 collectionIds,
//                 sourceUrl,
//                 additionalParam: otherParam,
//             });

//             if (!source) {
//                 throw new Error("failed to add source!");
                
//             }
    
//             dispatch(setAllCollectionSettings([source] as SourceDto[]))
//             return true
//         } catch (e) {
//             console.error('failed to add source', e)

//             return false
//         }
//     }
// )

// export interface RemoveCollectionSettings {
//     collectionId: number,
//     sourceIds: number[]
// }

// export const removeCollectionSettings: AsyncThunk<boolean, RemoveCollectionSettings, {}> = createAsyncThunk(
//     'collectionSettings/removeCollectionSettings',
//     async (rmCollectionSettings: RemoveCollectionSettings, { dispatch }) => {
//         try {
//             await invoke('remove_collectionSettings', {...rmCollectionSettings})
//             dispatch(fetchCollectionSettingsOfCollection([rmCollectionSettings.collectionId]))
//             return true
//         } catch (e) {
//             console.error('failed to remove collectionSettings', e)
//             return false
//         }
//     }
// )

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
