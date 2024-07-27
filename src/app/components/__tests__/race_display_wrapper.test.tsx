import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { createStore } from "src/app/redux/store";
import { RaceDisplayWrapper } from "../race_display_wrapper";

/**
 * Smoke testing to verify RaceDisplayWrapper component
 */
describe("RaceDisplayWrapper component", () => {
    test("renders props correctly", () => {
        render(
            <Provider store={createStore()}>
                <RaceDisplayWrapper />
            </Provider>
        );

        // Confirm all category filters render correctly
        const greyhoundFilter = screen.getByText("Greyhound");
        const harnessFilter = screen.getByText("Harness");
        const horseFilter = screen.getByText("Horse");
        expect(greyhoundFilter).toBeInTheDocument();
        expect(harnessFilter).toBeInTheDocument();
        expect(horseFilter).toBeInTheDocument();

        // Verify racesList component is present
        // The store has no data so RacesList will be showing the ErrorCard
        const racesListErrorCard = screen.getByText("Try again");
        expect(racesListErrorCard).toBeInTheDocument();
    });
});
