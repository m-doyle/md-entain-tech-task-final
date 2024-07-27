import "@testing-library/jest-dom";
import { act, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { createStore } from "src/app/redux/store";
import { RaceSummary } from "src/app/utils";
import { RacesList } from "../races_list";
import {
    ActionTypes,
    FETCH_RACES_FAILURE,
    UPDATE_DISPLAYED_RACES,
} from "src/app/redux/actions";

const raceData = {
    race_id: "def8e3eb-cf0c-4936-a9da-a7e4a2b4fcce",
    race_number: 100,
    meeting_name: "Meeting Name",
    category_id: "161d9be2-e909-4326-8c2c-35ed71fb460b",
    advertised_start: {
        seconds: Date.now() / 1000,
    },
} as RaceSummary;

/**
 * Smoke testing to verify all RacesList component scenarios
 */
describe("RacesList component", () => {
    test("renders RaceCards when races are present", async () => {
        const store = createStore();
        render(
            <Provider store={store}>
                <RacesList />
            </Provider>
        );

        // Dispatch action to update displayed races
        const action: ActionTypes = {
            type: UPDATE_DISPLAYED_RACES,
            payload: [raceData, { ...raceData, race_number: 200 }],
        };

        // Wrap in act() as this will update state
        await act(() => {
            store.dispatch(action);
        });

        // The store has no data so RacesList will be showing the ErrorCard
        const race1 = screen.getByText("Meeting Name Race 100");
        const race2 = screen.getByText("Meeting Name Race 200");
        expect(race1).toBeInTheDocument();
        expect(race2).toBeInTheDocument();
    });
    test("renders ErrorCard when no races", () => {
        render(
            <Provider store={createStore()}>
                <RacesList />
            </Provider>
        );

        // The store has no data so RacesList will be showing the ErrorCard
        const errorCard = screen.getByText("Try again");
        expect(errorCard).toBeInTheDocument();
    });
    test("renders ErrorCard error message when in error state", async () => {
        const store = createStore();
        render(
            <Provider store={store}>
                <RacesList />
            </Provider>
        );

        // Dispatch action to update application error state
        const action: ActionTypes = {
            type: FETCH_RACES_FAILURE,
            payload: "500 Internal Server Error",
        };

        // Wrap in act() as this will update state
        await act(() => {
            store.dispatch(action);
        });

        // The store has no data so RacesList will be showing the ErrorCard
        const errorCard = screen.getByText("Unexpected error!");
        expect(errorCard).toBeInTheDocument();
    });
});
