import axios from "axios";
import { RaceSummaries, RacingCategory } from "../utils";
import { selectFilteredRaces } from "./selector";
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { State } from "./state";

// Action types
export const FETCH_RACES_REQUEST = "FETCH_RACES_REQUEST";
export const FETCH_RACES_SUCCESS = "FETCH_RACES_SUCCESS";
export const FETCH_RACES_FAILURE = "FETCH_RACES_FAILURE";
export const UPDATE_DISPLAYED_RACES = "UPDATE_DISPLAYED_RACES";
export const UPDATE_CATEGORY = "UPDATE_CATEGORY";
export const DELETE_RACE = "DELETE_RACE";

// Action interfaces
interface FetchRacesRequestAction {
    type: typeof FETCH_RACES_REQUEST;
    payload: boolean;
}
interface FetchRacesSuccessAction {
    type: typeof FETCH_RACES_SUCCESS;
    payload: RaceSummaries;
}
interface FetchRacesFailureAction {
    type: typeof FETCH_RACES_FAILURE;
    payload: string;
}
interface UpdateCategoryAction {
    type: typeof UPDATE_CATEGORY;
    payload: RacingCategory;
}
interface DeleteRaceAction {
    type: typeof DELETE_RACE;
    payload: string;
}
interface UpdateDisplayedRacesAction {
    type: typeof UPDATE_DISPLAYED_RACES;
    payload: RaceSummaries;
}

// Combined Action types
export type ActionTypes =
    | FetchRacesRequestAction
    | FetchRacesSuccessAction
    | FetchRacesFailureAction
    | UpdateDisplayedRacesAction
    | UpdateCategoryAction
    | DeleteRaceAction;

// Action creators
/**
 * Actions supporting the API request.
 * These actions will handle application loading state,
 * error state, and successful response.
 */
const fetchRacesRequest = (setLoading: boolean): FetchRacesRequestAction => {
    return {
        type: FETCH_RACES_REQUEST,
        payload: setLoading,
    };
};
const fetchRacesSuccess = (races: RaceSummaries): FetchRacesSuccessAction => {
    return {
        type: FETCH_RACES_SUCCESS,
        payload: races,
    };
};
const fetchRacesFailure = (error: string): FetchRacesFailureAction => {
    return {
        type: FETCH_RACES_FAILURE,
        payload: error,
    };
};

/**
 * Action to update category filter.
 */
export const updateCategory = (
    category: RacingCategory
): UpdateCategoryAction => {
    return {
        type: UPDATE_CATEGORY,
        payload: category,
    };
};

/**
 * Action to remove a specific race from state.
 */
const deleteRace = (raceId: string): DeleteRaceAction => {
    return {
        type: DELETE_RACE,
        payload: raceId,
    };
};

/**
 * Action to update displayed races.
 */
const updateDisplayedRaces = (
    racesToDisplay: RaceSummaries
): UpdateDisplayedRacesAction => {
    return {
        type: UPDATE_DISPLAYED_RACES,
        payload: racesToDisplay,
    };
};

// Thunk actions
/**
 * Thunk action to fetch races list from Neds API.
 */
export const fetchRaces = (
    setLoading: boolean
): ThunkAction<void, State, unknown, ActionTypes> => {
    return async function (
        dispatch: ThunkDispatch<State, unknown, ActionTypes>
    ) {
        dispatch(fetchRacesRequest(setLoading));
        try {
            const response = await axios.get(
                "https://api.neds.com.au/rest/v1/racing/?method=nextraces&count=10"
            );
            const races: RaceSummaries = Object.values(
                response.data.data.race_summaries
            );
            dispatch(fetchRacesSuccess(races));
            dispatch(filterRaces());
        } catch (error: any) {
            console.error(error.message);
            dispatch(fetchRacesFailure(error.message));
        }
    };
};

/**
 * Thunk action to delete a race and refresh the race list.
 */
export const deleteRaceAndRefresh = (
    raceId: string
): ThunkAction<void, State, unknown, ActionTypes> => {
    return function (dispatch: ThunkDispatch<State, unknown, ActionTypes>) {
        dispatch(deleteRace(raceId));
        dispatch(fetchRaces(false));
    };
};

/**
 * Thunk action to filter races by category and update displayed races.
 */
export const filterRaces = (
    category?: RacingCategory
): ThunkAction<void, State, unknown, ActionTypes> => {
    return function (
        dispatch: ThunkDispatch<State, unknown, ActionTypes>,
        getState: () => State
    ) {
        // Update category if necessary
        if (category !== undefined) {
            dispatch(updateCategory(category));
        }
        const filteredRaces = selectFilteredRaces(getState());
        dispatch(updateDisplayedRaces(filteredRaces));
    };
};
