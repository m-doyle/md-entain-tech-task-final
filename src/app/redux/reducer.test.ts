import { RacingCategory } from "../utils";
import {
    FETCH_RACES_SUCCESS,
    DELETE_RACE,
    ActionTypes,
    FETCH_RACES_REQUEST,
    FETCH_RACES_FAILURE,
    UPDATE_CATEGORY,
    UPDATE_DISPLAYED_RACES,
} from "./actions";
import raceReducer from "./reducer";
import { State } from "./state";

// Reusable mock data
const initialState: State = {
    loading: false,
    error: null,
    races: [],
    racesToDisplay: [],
    category: RacingCategory.All,
};
const races = [
    {
        race_id: "7355608",
        race_name: "Race Name",
        race_number: 1,
        meeting_id: "2",
        meeting_name: "Meeting Name",
        category_id: "161d9be2-e909-4326-8c2c-35ed71fb460b",
        advertised_start: { seconds: 1234 },
        race_form: new Map(),
        venue_id: "3",
        venue_name: "Venue Name",
        venue_state: "QLD",
        venue_country: "Australia",
    },
];

/**
 * This test suite verifies each action type will update state correctly
 */
describe("raceReducer", () => {
    test("can handle FETCH_RACES_REQUEST", () => {
        const action: ActionTypes = {
            type: FETCH_RACES_REQUEST,
            payload: true,
        };
        const expectedState = {
            ...initialState,
            loading: true,
        };
        expect(raceReducer(initialState, action)).toEqual(expectedState);
    });

    test("can handle FETCH_RACES_SUCCESS", () => {
        const action: ActionTypes = {
            type: FETCH_RACES_SUCCESS,
            payload: races,
        };
        const expectedState = {
            ...initialState,
            loading: false,
            races,
        };
        expect(raceReducer(initialState, action)).toEqual(expectedState);
    });

    test("can handle FETCH_RACES_FAILURE", () => {
        const action: ActionTypes = {
            type: FETCH_RACES_FAILURE,
            payload: "Unexpected error occured",
        };
        const expectedState = {
            ...initialState,
            error: "Unexpected error occured",
        };
        expect(raceReducer(initialState, action)).toEqual(expectedState);
    });

    test("can handle UPDATE_CATEGORY", () => {
        const action: ActionTypes = {
            type: UPDATE_CATEGORY,
            payload: RacingCategory.Greyhound,
        };
        const expectedState = {
            ...initialState,
            category: RacingCategory.Greyhound,
        };
        expect(raceReducer(initialState, action)).toEqual(expectedState);
    });

    test("can handle UPDATE_DISPLAYED_RACES", () => {
        const action: ActionTypes = {
            type: UPDATE_DISPLAYED_RACES,
            payload: races,
        };
        const expectedState = {
            ...initialState,
            racesToDisplay: races,
        };
        expect(raceReducer(initialState, action)).toEqual(expectedState);
    });

    test("should handle DELETE_RACE", () => {
        const initialStateWithRaces: State = {
            ...initialState,
            races: races,
        };
        const action: ActionTypes = {
            type: DELETE_RACE,
            payload: "7355608",
        };
        const expectedState = {
            ...initialStateWithRaces,
            races: [],
        };
        expect(raceReducer(initialStateWithRaces, action)).toEqual(
            expectedState
        );
    });
});
