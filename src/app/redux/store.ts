import { configureStore } from "@reduxjs/toolkit";
import raceReducer from "./reducer";
import { thunk } from "redux-thunk";

/**
 * Configures and creates the Redux store with middleware.
 *
 * This store is configured with:
 * - raceReducer to handle application state.
 * - thunk middleware to support async actions.
 *
 * The store is immediately populated with an initial fetch of races.
 *
 * @returns {Store} The configured Redux store.
 */
export function createStore() {
    return configureStore({
        reducer: raceReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(thunk),
    });
}
