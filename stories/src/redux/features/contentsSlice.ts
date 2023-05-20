// import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
// import { components } from "../../data/openapi";
// import { getContents, getSourcesContents } from "../../utilities/requests";
// import { RootState } from "../store";
// import { fetchContentBodies } from "./contentBodiesSlice";

// export const fetchContentOfSources = createAsyncThunk(
//     'contents/fetchContentOfSources',
//     async (sourceIds: number[] | null, { dispatch, getState }) => {
//         // @TODO: Check the localStorage first (or maybe simultaneously)
        
//         const contents = await getSourcesContents({ sourceIds })

//         if (contents.status !== 200) throw Error('Failed to fetch content from sources')
       
//         const data = contents.data

//         dispatch(setAllContents(data))
//         dispatch(fetchContentBodies(data.map(x => x.contentId)))
//     }
// )

// export const fetchContent = createAsyncThunk(
//     'contents/fetchContent',
//     async (contentIds: number[] | null, { dispatch }) =>{
//         const contents = await getContents({ contentIds })

//         if (contents.status != 200) throw Error('Failed to fetch content')

//         const data = contents.data

//         dispatch(setAllContents(data))
//         dispatch(fetchContentBodies(data.map(x => x.contentId)))
//     }
// )

// const contentsAdapter = createEntityAdapter<components["schemas"]["ContentDto"]>({
//     selectId: (content) => content.contentId
// })

// const contentsSlice = createSlice({
//     name: 'contents',
//     initialState: contentsAdapter.getInitialState(),
//     reducers: {
//         setAllContents: contentsAdapter.setAll
//     },
//     extraReducers: {}
// })

// export const { setAllContents } = contentsSlice.actions
// export const contentsSelectors = contentsAdapter.getSelectors<RootState>((state) => state.contents)

// export const contentsReducer = contentsSlice.reducer
