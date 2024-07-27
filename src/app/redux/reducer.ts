"use client";
import {
    ActionTypes,
    DELETE_RACE,
    FETCH_RACES_FAILURE,
    FETCH_RACES_REQUEST,
    FETCH_RACES_SUCCESS,
    UPDATE_CATEGORY,
    UPDATE_DISPLAYED_RACES,
} from "./actions";
import { initialState, State } from "./state";

/**
 * Race reducer function to manage application state.
 * Handles actions around API fetching, updating categories,
 * and updating / removing displayed races.
 *
 * @param {State} state - The current state of the application.
 * @param {ActionTypes} action - The action being dispatched.
 * @returns {State} The new state after applying the action.
 */
export const raceReducer = (
    state: State = initialState,
    action: ActionTypes
) => {
    switch (action.type) {
        case FETCH_RACES_REQUEST:
            return { ...state, loading: action.payload, error: null };
        case FETCH_RACES_SUCCESS:
            return { ...state, loading: false, races: action.payload };
        case FETCH_RACES_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case UPDATE_DISPLAYED_RACES:
            return { ...state, racesToDisplay: action.payload };
        case UPDATE_CATEGORY:
            return { ...state, category: action.payload };
        case DELETE_RACE:
            return {
                ...state,
                races: state.races.filter(
                    (race) => race.race_id !== action.payload
                ),
            };
        default:
            return state;
    }
};

export default raceReducer;
