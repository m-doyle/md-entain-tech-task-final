import { createStore } from "./store";
import {
    RacingCategory,
    RaceSummary,
    calculateSecondsUntilStartTime,
} from "../utils";
import { ActionTypes, FETCH_RACES_SUCCESS } from "./actions";
import { selectFilteredRaces } from "./selector";

// Mock data creation function
function createMockRaceSummary(
    id: string,
    category: RacingCategory,
    time: number
): RaceSummary {
    return {
        race_id: id,
        category_id: category,
        advertised_start: { seconds: time },
    } as RaceSummary;
}

const initialState = [
    createMockRaceSummary("1", RacingCategory.Horse, 0 + 30),
    createMockRaceSummary("2", RacingCategory.Harness, 0 + 60),
    createMockRaceSummary("3", RacingCategory.Greyhound, 0 + 90),
    createMockRaceSummary("4", RacingCategory.Horse, 0 - 120),
    createMockRaceSummary("5", RacingCategory.Harness, 0 + 120),
    createMockRaceSummary("6", RacingCategory.Greyhound, 0 + 150),
];

// Mock time returned to be the time given, rather than using date.now
jest.mock("../utils", () => ({
    ...jest.requireActual("../utils"),
    calculateSecondsUntilStartTime: jest.fn((time) => time),
}));

/**
 * This test suite verifies the selectFilteredRaces selector returns the correct data
 */
describe("selectFilteredRaces selector", () => {
    let store: any;

    // Update store with initialState to filter
    beforeEach(async () => {
        store = createStore();
        const updateRacesAction: ActionTypes = {
            type: FETCH_RACES_SUCCESS,
            payload: initialState,
        };
        await store.dispatch(updateRacesAction);
    });

    test("filters out races more than 1 minute past start time", () => {
        const filteredRaces = selectFilteredRaces(store.getState());

        // Check that races more than 1 minute past start time are filtered out
        const pastRaces = initialState.filter(
            (race) =>
                calculateSecondsUntilStartTime(race.advertised_start.seconds) <
                -60
        );
        pastRaces.forEach((race) => {
            expect(filteredRaces).not.toContainEqual(race);
        });
    });
    test("filters out races more than 1 minute past start time", () => {
        const filteredRaces = selectFilteredRaces(store.getState());

        // Check that races within 1 minute of start time are included
        const validRaces = initialState.filter(
            (race) =>
                calculateSecondsUntilStartTime(race.advertised_start.seconds) >=
                -60
        );
        validRaces.forEach((race) => {
            expect(filteredRaces).toContainEqual(race);
        });
    });

    test("sorts races by start time in ascending order", () => {
        const filteredRaces = selectFilteredRaces(store.getState());

        // Check that races are sorted by start time
        const sortedRaces = [...initialState]
            .filter(
                (race) =>
                    calculateSecondsUntilStartTime(
                        race.advertised_start.seconds
                    ) >= -60
            )
            .sort(
                (a, b) =>
                    a.advertised_start.seconds - b.advertised_start.seconds
            );

        expect(filteredRaces).toEqual(sortedRaces.slice(0, 5));
    });

    test("filters races by the correct category", () => {
        // Set category to Harness
        store.dispatch({
            type: "UPDATE_CATEGORY",
            payload: RacingCategory.Harness,
        });
        const filteredRaces = selectFilteredRaces(store.getState());

        // Check that only Harness races are included
        const harnessRaces = initialState.filter(
            (race) => race.category_id === RacingCategory.Harness
        );
        expect(filteredRaces).toEqual(harnessRaces.slice(0, 5));
    });

    test("returns a maximum of 5 races", () => {
        const filteredRaces = selectFilteredRaces(store.getState());
        expect(filteredRaces).toHaveLength(5);
    });
});
