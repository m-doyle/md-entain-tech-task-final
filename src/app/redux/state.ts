import { RaceSummaries, RacingCategory } from "../utils";

// State interface for the reducer
export interface State {
    loading: boolean;
    error: string | null;
    races: RaceSummaries;
    racesToDisplay: RaceSummaries;
    category: RacingCategory;
}

// Initial application state
export const initialState: State = {
    loading: false,
    error: null,
    races: [],
    racesToDisplay: [],
    category: RacingCategory.All,
};
