// import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
// // import { components } from "../../data/openapi";
// // import { getContentBodies } from "../../utilities/requests";
// import { RootState } from "../store";

// export const fetchContentBodies = createAsyncThunk(
//     'contentBodies/fetchContentBodies',
//     async (contentIds: number[] | null, { dispatch }) => {
//         // @TODO: Check the localStorage first (or maybe simultaneously)
        
//         const allContentBodiesData: Array<components["schemas"]["ContentBodyDto"]> = []
        
//         try {
//             // There are limits to how many IDs are accepted from a GET request
//             const atOnce = 50
//             let i = 0
//             while (i < contentIds.length) {
//                 const setToFetch = contentIds.slice(i, i + atOnce)
//                 i += atOnce

//                 const contentBodies = await getContentBodies({
//                     contentIds: setToFetch
//                 })

//                 if (contentBodies.status !== 200) return //@TODO: handle error when on and offline

//                 allContentBodiesData.push(...contentBodies.data)

//             }
//         } catch (e) {
//             console.error('Content body retrieval failure', e)
//         }

//         dispatch(setAllContentBodies(allContentBodiesData))
//     }
// )

// const contentBodiesAdapter = createEntityAdapter<components["schemas"]["ContentBodyDto"]>({
//     selectId: (contentBody) => contentBody.contentBodyId
// })

// const contentBodiesSlice = createSlice({
//     name: 'contentBodies',
//     initialState: contentBodiesAdapter.getInitialState(),
//     reducers: {
//         setAllContentBodies: contentBodiesAdapter.setAll
//     },
//     extraReducers: {}
// })

// export const { setAllContentBodies } = contentBodiesSlice.actions
// export const contentBodiesSelectors = contentBodiesAdapter.getSelectors<RootState>((state) => state.contentBodies)

// export const contentBodiesReducer = contentBodiesSlice.reducer
