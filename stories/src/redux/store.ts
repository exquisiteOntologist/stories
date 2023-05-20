import reducers from "./reducers"
// import { rootInitialState } from "./initial-state";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
    devTools: true,
    // preloadedState: rootInitialState,
    reducer: reducers
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
