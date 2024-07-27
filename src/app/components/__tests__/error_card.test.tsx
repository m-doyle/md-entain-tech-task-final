import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { ErrorCard } from "../error_card";
import { Provider } from "react-redux";
import { createStore } from "src/app/redux/store";

/**
 * Smoke testing to verify ErrorCard component
 */
describe("ErrorCard component", () => {
    test("renders props correctly", () => {
        render(
            <Provider store={createStore()}>
                <ErrorCard errorMessage="Error!" tryAgain={true} />
            </Provider>
        );

        // Verify props passed correctly
        const errorText = screen.getByText("Error!");
        const button = screen.getByText("Try again");
        expect(errorText).toBeInTheDocument();
        expect(button).toBeInTheDocument();
    });
});
