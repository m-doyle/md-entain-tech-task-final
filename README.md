# Entain Technical Task - Front-end

## Running the project

This project was bootstrapped using `create-next-app`.

#### Using Yarn:

```python
yarn           # Install dependencies
yarn dev       # Run app in development mode
yarn test      # Start Jest test runner - press `a` to run all tests
# To run a production build:
yarn build
yarn start
```

#### Using npm:

```python
npm install    # Install dependencies
npm run dev    # Run app in development mode
npm test       # Start Jest test runner - press `a` to run all tests
# To run a production build:
npm run build
npm start
```

The application will be running at: http://localhost:3000

## About the app

### Features

-   This app uses the Neds 'next to go' API to fetch a list of upcoming races.
-   Users can see up to a maximum of `5` races at all times, displayed as a list of race cards below the category filter.
-   The app maintains a list of all upcoming races (currently `20`) and will filter this down to a max of `5` from the appropriate category, in ascending order of start time.
-   A race card will display the meeting name, race number, category, starting status, and a live countdown to the advertised start time.
-   Once a race reaches start time it will update to say `Started!` and continue counting down to `-60` seconds. At `-60` (one minute past start) the race is removed from the UI.
-   Category filter buttons are available for `Greyhound`, `Harness`, and `Horse`. You can remove filtering by clicking an already set filter.
-   The app will fetch new races whenever the user changes categories, or a race is removed. If no races are available in a category the user will see an error card which will prompt them to manually refresh using a `Try again` button.
-   All application states are handled by the UI: no races state, loading state, error state.

### Design Considerations

This app was built as thought it were a real, customer-facing application. I kept two things in mind during development: **customer experience** and **maintainability**.

#### Customer experience:

-   All application states are handled so the user is never left waiting or guessing as to what is happening.
-   The initial loading state will show a loading card. Error states or a 'no race for a category' state will show a status card alongside a `Try again` button for the user.
-   The app will continue to show saved races while fetching in the background for a seamless UX.
    -   Try running the project with a throttled connection and switching categories. The user will never be left with nothing on screen or unnecessary loading screens.
    -   There are no 'in-between' states where a user has a non-functional or non-representative UI.

#### Developer experience:

The app is designed to be easily maintable and extendable.

-   Separation of concerns:
    -   Redux is used for state management, while UI logic is handled by React components.
    -   All mapping and filtering of races occurs through Redux. Any UI logic is handled inside `useEffect`, and components are kept as simple as possible.
-   Maintainability:
    -   Type safety with TypeScript, strong test suite, clearly defined Redux actions, and a single reducer all help keep the app maintainable and easily extendable.

## Technical Detail

### Redux

Redux and Redux Thunk are used to maintain application state. Actions are made with action creators, and are distinct, separate, and strongly typed to ensure clarity and increase confidence.

Only one reducer is used due to the scope of the application. Further extension to support multiple race or game types may require additional reducers.

All Redux features can be found in `src/app/redux`.

-   All actions and Thunk actions are defined in `actions.ts`
-   The `raceReducer` can be found in `reducer.ts`
-   The selector is in `selector.ts`
-   The application state definition and initial state are stored in `state.ts`. The `createStore` function can be found in `store.ts`

The Redux `selector`, `actions`, and `reducer` are all comprehensively tested.

| Action                   | Use                                                                                        |
| ------------------------ | ------------------------------------------------------------------------------------------ |
| `FETCH_RACES_REQUEST`    | Initiates the fetch races request, setting the loading state.                              |
| `FETCH_RACES_SUCCESS`    | Handles the successful response from the fetch races request, updating the races in state. |
| `FETCH_RACES_FAILURE`    | Handles errors from the fetch races request, updating the error state.                     |
| `UPDATE_CATEGORY`        | Updates the current category filter.                                                       |
| `DELETE_RACE`            | Removes a specific race from the state.                                                    |
| `UPDATE_DISPLAYED_RACES` | Updates the races to be displayed based on the current category filter.                    |
| `fetchRaces`             | Thunk action to fetch races list from the API, managing loading state and errors.          |
| `deleteRaceAndRefresh`   | Thunk action to delete a race and then refresh the race list by fetching the latest data.  |
| `filterRaces`            | Thunk action to filter races by category and update the displayed races.                   |

**NB:** As a result of the UX considerations detailed above it is necessary to have all these actions. They are required to maintain a comprehensive view of the app state e.g. loading / error state, category, and stored races / displayed races. Without these actions the UX and UI will suffer.

### Unit Testing

```bash
yarn test    # Start Jest test runner - press `a` to run all tests
npm test     # Start Jest test runner - press `a` to run all tests
```

The Redux `selector`, `actions`, and `reducer` have all been comprehensively tested as they handle the most important logic in the solution. This includes every action and Thunk action, the selector, and all reducer cases. These tests are located in: `src/app/redux/${filename}.test.ts`

All React UI components are tested using Jest DOM testing. In the interest of time only positive scenarios have been tested for the UI, however due to the strict type safety employed throughout the application I am confident in the tests provided. These tests can be found here: `src/app/components/__tests__/${filename}.test.tsx`

Effectively, comprehensive testing for Redux and smoke-testing for UI components.

#### Testing improvements:

Currently most of the tests written cover only positive scenarios or anticipated negative scenarios. This is due to time constraints, however if this were a full production application I would encourage the use of negative testing.

However, due to the the strict use of type safety within the application and the testing scenarios covered, I still have high degree of confidence in the testing provided.

There is no end-to-end testing due to the scope of the application. If the app were to be extended in future I would recommend use of Selenium or Playwright to build E2E tests for increased application confidence.

### Styling and linting

I've opted for no UI libraries to keep things simple.

This app uses Prettier for code formatting with a tab width of 4.

### Limitations

The given API endpoint is a limiting factor. If there was an additional parameter to return by `category_id` then more could be done with filtering.

### Future extension / optimisation

Potential improvements:

-   Prevent calling the API while another request is in progress
-   Additional Redux reducers to support multiple race or game types
-   End-to-end testing using Cypress / Playwright
-   Customised 404 handling
-   Endpoint builder function which allows changing race count and type
-   Environment variables support - e.g. DEV, UAT, PROD

Nice to have features that didn't make the cut:

-   Animations on removal or cancellation of a race
-   Icons for race types for clarity
-   Loading animation during initial request
