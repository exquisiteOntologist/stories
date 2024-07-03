import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { minutesSince } from "../../utilities/dates";
import { invoke } from "@tauri-apps/api/core";

export interface SessionState {
    /** Whether ticker has started. (should immediately change from true to false on init) */
    ticking: boolean;
    /** When did the app launch? */
    launched: string;
    /** Is the update process still running? */
    hasRecentUpdates: boolean;
    /** Is loading? (retrieving content) */
    // isRetrieving: boolean;
}

const initialSessionState: SessionState = {
    ticking: false,
    launched: new Date().toISOString(),
    hasRecentUpdates: false,
    // isRetrieving: true,
};

export const checkRetrievalsIsUpdating = createAsyncThunk("session/retrievalsIsUpdating", async (_, { dispatch }) => {
    dispatch(setHasRecentUpdates(await invoke<boolean>("retrievals_is_updating")));
});

export const ticker = createAsyncThunk("session/ticker", async (_, { getState, dispatch }) => {
    let t = 0;
    const tick = () => {
        const s: RootState = getState() as RootState;
        if (t % 6 || t < 12) {
            dispatch(checkRetrievalsIsUpdating);
        }
        // tick
        t++;
        setTimeout(() => requestAnimationFrame(tick), 1000 * 10);
    };

    setTicker(true);
    tick();
});

/**
 * The Session for tracking app launch times, login state etc.
 */
const sessionSlice = createSlice({
    name: "session",
    initialState: initialSessionState,
    reducers: {
        setTicker(state, action: PayloadAction<boolean>) {
            state.ticking = action.payload;
        },
        setHasRecentUpdates(state, action: PayloadAction<boolean>) {
            state.hasRecentUpdates = action.payload;
        },
    },
    extraReducers: {},
});

export const { setHasRecentUpdates, setTicker } = sessionSlice.actions;
export const selectSession = (s: RootState): Readonly<RootState["session"]> => s.session;
export const selectLaunchDate = (s: RootState): string => s.session.launched;
export const selectTimeSinceLaunch = (s: RootState): number => minutesSince(s.session.launched);
/** Time frame since launch that another update was expected to be done by */
export const selectShouldHaveUpdated = (s: RootState): boolean => selectTimeSinceLaunch(s) > 15;
/** Has the server recorded a retrieval attempt recently? */
export const selectHasUpdated = (s: RootState): boolean => s.session.hasRecentUpdates;
/** Is initialising? If has updated it has (restart app after just update), otherwise only if time less than min */
export const selectIsInitializing = (s: RootState): boolean => (selectHasUpdated(s) ? false : selectTimeSinceLaunch(s) < 1);
/** Is loading? */
export const selectIsLoading = (s: RootState): boolean => selectIsInitializing(s);

export const sessionReducer = sessionSlice.reducer;
