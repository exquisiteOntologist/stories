import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { minutesSince } from "../../utilities/dates";

export interface SessionState {
    launched: string;
}

const initialSessionState: SessionState = {
    launched: new Date().toISOString(),
};

/**
 * The Session for tracking app launch times, login state etc.
 */
const sessionSlice = createSlice({
    name: "session",
    initialState: initialSessionState,
    reducers: {
        setLaunchDate(state, action: PayloadAction<Date>) {
            state.launched = action.payload.toISOString();
        },
    },
    extraReducers: {},
});

export const { setLaunchDate } = sessionSlice.actions;
export const selectLaunchDate = (state: RootState) => state.session.launched;
export const selectTimeSinceLaunch = (state: RootState) => {
    return minutesSince(state.session.launched);
};

export const sessionReducer = sessionSlice.reducer;
