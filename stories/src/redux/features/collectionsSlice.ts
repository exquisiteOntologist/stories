import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { Collection } from "../../data/chirp-types";
import { RootState } from "../store";

export const fetchCollection = createAsyncThunk(
    'collections/fetchCollection',
    async (collectionId: number | null, { dispatch }) => {
        // @TODO: Check the localStorage first (or maybe simultaneously)
        
        // @TODO: Swap for collection retrieval instead of sources contents
        // const collections = await getSourcesContents({
        //     sourceIds: [collectionId]
        // })

        // const successful = collections.status === 200
        // const data = collections.data

        // dispatch(setAllCollections(data))
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
