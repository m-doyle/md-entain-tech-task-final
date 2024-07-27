import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { createStore } from "src/app/redux/store";
import { RaceCard } from "../race_card";
import { getCategoryName, RaceSummary, RacingCategory } from "src/app/utils";

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
 * Smoke testing to verify RaceCard component
 */
describe("RaceCard component", () => {
    test("renders props correctly", () => {
        render(
            <Provider store={createStore()}>
                <RaceCard raceData={raceData} />
            </Provider>
        );

        const category = screen.getByText(
            getCategoryName(RacingCategory.Harness)
        );
        const raceInfo = screen.getByText("Meeting Name Race 100");
        expect(category).toBeInTheDocument();
        expect(raceInfo).toBeInTheDocument();
    });
});
