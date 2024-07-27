import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { CategoryFilter } from "../category_filter";
import { RacingCategory } from "src/app/utils";

/**
 * Smoke testing to verify CategoryFilter component
 */
describe("CategoryFilter component", () => {
    test("renders correct text", () => {
        render(
            <CategoryFilter
                changeCategory={() => {}}
                categoryValue={RacingCategory.Greyhound}
                id={"123"}
                selected={false}
            />
        );

        // Confirm component renders correctly
        const button = screen.getByText("Greyhound");
        expect(button).toBeInTheDocument();
    });
});
