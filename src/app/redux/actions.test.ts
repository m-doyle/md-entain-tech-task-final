import axios from "axios";
import {
    ActionTypes,
    deleteRaceAndRefresh,
    FETCH_RACES_SUCCESS,
    fetchRaces,
    filterRaces,
} from "./actions";
import { createStore } from "./store";
import { RaceSummary, RacingCategory } from "../utils";

// Functions to create mock data and mock API response
function createMockRaceSummary(id: string, category: RacingCategory) {
    return {
        race_id: id,
        category_id: category,
        advertised_start: { seconds: 0 },
    } as RaceSummary;
}

function createMockApiResponse(id: string, category: RacingCategory) {
    return {
        data: {
            data: {
                race_summaries: {
                    [id]: createMockRaceSummary(id, category),
                },
            },
        },
        status: 200,
        statusText: "OK",
    };
}

// Mock axios for API requests
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;
mockedAxios.get = jest.fn();

// Mock time returned to be the time given, rather than using date.now
jest.mock("../utils", () => ({
    ...jest.requireActual("../utils"),
    calculateSecondsUntilStartTime: jest.fn((time) => time),
}));

/**
 * This test suite verifies that all async Redux Thunk actions update state correctly
 */
describe("Redux Thunk actions", () => {
    test("fetchRaces updates state with new race correctly", async () => {
        // Create mock response for API
        mockedAxios.get.mockResolvedValue(
            createMockApiResponse("11", RacingCategory.Greyhound)
        );
        const store = createStore();

        // Call fetchRaces and confirm matching race summary in state
        await store.dispatch(fetchRaces(false));
        const state = store.getState();
        expect(state.races).toStrictEqual([
            createMockRaceSummary("11", RacingCategory.Greyhound),
        ]);
    });

    test("deleteRaceAndRefresh deletes race by id and fetches new race correctly", async () => {
        mockedAxios.get.mockResolvedValue(
            createMockApiResponse("11", RacingCategory.Greyhound)
        );
        const store = createStore();

        // Add race 77 to state so we can verify once it has been deleted
        const updateRacesAction: ActionTypes = {
            type: FETCH_RACES_SUCCESS,
            payload: [createMockRaceSummary("77", RacingCategory.Greyhound)],
        };
        await store.dispatch(updateRacesAction);

        // Confirm race 77 exists in state
        expect(store.getState().races).toEqual(
            expect.arrayContaining([expect.objectContaining({ race_id: "77" })])
        );

        // Dispatch action and confirm race 77 deleted
        await store.dispatch(deleteRaceAndRefresh("77"));
        expect(store.getState().races).toEqual(
            expect.arrayContaining([
                expect.not.objectContaining({ race_id: "77" }),
            ])
        );

        // Confirm fetchRaces has updated with mocked response race
        expect(store.getState().races).toStrictEqual([
            createMockRaceSummary("11", RacingCategory.Greyhound),
        ]);
    });

    test("filterRaces updates displayed races to only include Greyhound races", async () => {
        const store = createStore();

        // Add races to state
        const updateRacesAction: ActionTypes = {
            type: FETCH_RACES_SUCCESS,
            payload: [
                createMockRaceSummary("1", RacingCategory.Horse),
                createMockRaceSummary("2", RacingCategory.Harness),
                createMockRaceSummary("3", RacingCategory.Harness),
                createMockRaceSummary("4", RacingCategory.Greyhound),
                createMockRaceSummary("5", RacingCategory.Greyhound),
                createMockRaceSummary("6", RacingCategory.Greyhound),
            ],
        };
        await store.dispatch(updateRacesAction);

        // Call filterRaces to update greyhound races
        await store.dispatch(filterRaces(RacingCategory.Greyhound));

        // Confirm exactly 3 greyhound races
        const racesToDisplay = store.getState().racesToDisplay;
        expect(racesToDisplay).toHaveLength(3);
        expect(
            racesToDisplay.filter(
                (race) => race.category_id === RacingCategory.Greyhound
            )
        ).toHaveLength(3);
    });

    test("filterRaces updates displayed races to only include Harness races", async () => {
        const store = createStore();

        // Add races to state
        const updateRacesAction: ActionTypes = {
            type: FETCH_RACES_SUCCESS,
            payload: [
                createMockRaceSummary("1", RacingCategory.Horse),
                createMockRaceSummary("2", RacingCategory.Harness),
                createMockRaceSummary("3", RacingCategory.Harness),
                createMockRaceSummary("4", RacingCategory.Greyhound),
                createMockRaceSummary("5", RacingCategory.Greyhound),
                createMockRaceSummary("6", RacingCategory.Greyhound),
            ],
        };
        await store.dispatch(updateRacesAction);

        // Call filterRaces to update harness races
        await store.dispatch(filterRaces(RacingCategory.Harness));

        // Confirm exactly 2 harness races
        const racesToDisplay = store.getState().racesToDisplay;
        expect(racesToDisplay).toHaveLength(2);
        expect(
            racesToDisplay.filter(
                (race) => race.category_id === RacingCategory.Harness
            )
        ).toHaveLength(2);
    });
});
