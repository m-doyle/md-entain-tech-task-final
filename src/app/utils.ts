// Race information as received from Neds API.
export type RaceSummary = {
    race_id: string;
    race_name: string;
    race_number: number;
    meeting_id: string;
    meeting_name: string;
    category_id: string;
    advertised_start: {
        seconds: number;
    };
    race_form: any;
    venue_id: string;
    venue_name: string;
    venue_state: string;
    venue_country: string;
};

export type RaceSummaries = RaceSummary[];

export enum RacingCategory {
    Greyhound = "9daef0d7-bf3c-4f50-921d-8e818c60fe61",
    Harness = "161d9be2-e909-4326-8c2c-35ed71fb460b",
    Horse = "4a2788f8-e825-4d36-9894-efd4baf1cfae",
    All = "",
}

// Returns the category name given the category UUID.
export const getCategoryName = (category: RacingCategory | string): string => {
    switch (category) {
        case RacingCategory.Greyhound:
            return "Greyhound";
        case RacingCategory.Harness:
            return "Harness";
        case RacingCategory.Horse:
            return "Horse";
        case RacingCategory.All:
            return "All";
        default:
            return "All";
    }
};

/**
 * Calculates the number of seconds remaining until the starting time.
 *
 * @param {number} startingTime - The starting time as epoch time.
 * @returns {number} The number of seconds until the starting time.
 */
export const calculateSecondsUntilStartTime = (
    startingTime: number
): number => {
    return startingTime - Date.now() / 1000;
};

/**
 * Returns a MM:SS string of time remaining until the starting time.
 *
 * @param {number} startingTime - The starting time as epoch time.
 * @returns {string} The formatted time remaining as MM:SS.
 */
export const timeRemainingAsString = (startingTime: number): string => {
    const difference = calculateSecondsUntilStartTime(startingTime);

    const minutes = Math.floor(Math.abs(difference / 60))
        .toString()
        .padStart(2, "0");
    const seconds: string = Math.floor(Math.abs(difference % 60))
        .toString()
        .padStart(2, "0");

    return `${minutes}:${seconds}`;
};
