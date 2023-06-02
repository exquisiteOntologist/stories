import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { invoke } from "@tauri-apps/api";
import { ContentBody } from "../../data/chirp-types";
// import { components } from "../../data/openapi";
// import { getContentBodies } from "../../utilities/requests";
import { RootState } from "../store";

export const fetchContentBodies = createAsyncThunk(
    'contentBodies/fetchContentBodies',
    async (contentIds: number[] | null, { dispatch }) => {
        // @TODO: Check the localStorage first (or maybe simultaneously)
        
        const allContentBodiesData: Array<ContentBody> = []
        
        try {
            // There are limits to how many IDs are accepted from a GET request
            const atOnce = 50
            let i = 0
            while (i < contentIds.length) {
                const idsToFetchThisIteration = contentIds.slice(i, i + atOnce)
                i += atOnce

                const contentBodies = await invoke('content_bodies', {
                    contentIds: idsToFetchThisIteration
                })

                allContentBodiesData.push(...contentBodies)

            }
        } catch (e) {
            console.error('Content body retrieval failure', e)
        }

        dispatch(setAllContentBodies(allContentBodiesData))
    }
)

const contentBodiesAdapter = createEntityAdapter<ContentBody>({
    selectId: (contentBody) => contentBody.content_id,
})

const contentBodiesSlice = createSlice({
    name: 'contentBodies',
    initialState: contentBodiesAdapter.getInitialState(),
    reducers: {
        setAllContentBodies: contentBodiesAdapter.setAll
    },
    extraReducers: {}
})

export const { setAllContentBodies } = contentBodiesSlice.actions
export const contentBodiesSelectors = contentBodiesAdapter.getSelectors<RootState>((state) => state.contentBodies)

export const contentBodiesReducer = contentBodiesSlice.reducer
