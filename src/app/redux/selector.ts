import { createSelector } from "@reduxjs/toolkit";
import {
    calculateSecondsUntilStartTime,
    RaceSummary,
    RacingCategory,
} from "../utils";
import { State } from "./state";

/**
 * Selector to filter and sort races based on start time and selected category.
 *
 * This selector performs the following steps:
 * 1. Filters out races more than 1 minute past start time.
 * 2. Sorts remaining races by start time in ascending order.
 * 3. Filters races by the appropriate category.
 * 4. Returns a maximum of 5 upcoming races.
 *
 * @param {State} state - The Redux state.
 * @returns {RaceSummaries} The filtered and sorted array of races.
 */
export const selectFilteredRaces = createSelector(
    [(state: State) => state.races, (state: State) => state.category],
    (races, selectedCategory) => {
        // Remove any races 1 minute past start time
        const racesFilteredByStartTime = races.filter(
            (race) =>
                calculateSecondsUntilStartTime(race.advertised_start.seconds) >=
                -60
        );

        // Sort by time remaining ascending
        racesFilteredByStartTime.sort(
            (a: RaceSummary, b: RaceSummary) =>
                a.advertised_start.seconds - b.advertised_start.seconds
        );

        // Return only 5 of the correct category.
        if (selectedCategory === RacingCategory.All) {
            return racesFilteredByStartTime.slice(0, 5);
        }
        return racesFilteredByStartTime
            .filter((race) => race.category_id === selectedCategory)
            .slice(0, 5);
    }
);
