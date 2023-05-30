import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { invoke } from "@tauri-apps/api";
import { ContentDto } from "../../data/chirp-types";
import { RootState } from "../store";
// import { fetchContentBodies } from "./contentBodiesSlice";

export const fetchContentOfSources = createAsyncThunk(
    'contents/fetchContentOfSources',
    async (sourceIds: number[] | null, { dispatch, getState }) => {
        // @TODO: Check the localStorage first (or maybe simultaneously)
        
        // const contents = await getSourcesContents({ sourceIds })

        // if (contents.status !== 200) throw Error('Failed to fetch content from sources')
       
        // const data = contents.data

        const content = await new Promise(r => invoke('list_content').then((response) => r(response)))

        dispatch(setAllContents(content as ContentDto[]))
        // dispatch(fetchContentBodies(data.map(x => x.contentId)))
    }
)

export const fetchContent = createAsyncThunk(
    'contents/fetchContent',
    async (contentIds: number[] | null | undefined, { dispatch }) =>{
        // const contents = await getContents({ contentIds })

        // if (contents.status != 200) throw Error('Failed to fetch content')

        // const data = contents.data

        const content = await new Promise(r => invoke('list_content').then((response) => r(response)))

        dispatch(setAllContents(content as ContentDto[]))
        // dispatch(fetchContentBodies(data.map(x => x.contentId)))
    }
)

const contentsAdapter = createEntityAdapter<ContentDto>({
    selectId: (content) => content.id
})

const contentsSlice = createSlice({
    name: 'contents',
    initialState: contentsAdapter.getInitialState(),
    reducers: {
        setAllContents: contentsAdapter.setAll
    },
    extraReducers: {}
})

export const { setAllContents } = contentsSlice.actions
export const contentsSelectors = contentsAdapter.getSelectors<RootState>((state) => state.contents)

export const contentsReducer = contentsSlice.reducer
