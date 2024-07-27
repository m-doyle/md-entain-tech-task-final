import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { CategoryFilter } from "../category_filter";
import { RacingCategory } from "src/app/utils";

describe("CategoryFilter component", () => {
    it("renders correct text", () => {
        render(
            <CategoryFilter
                changeCategory={() => {}}
                categoryValue={RacingCategory.Greyhound}
                id={"123"}
                selected={false}
            />
        );

        // Query by text content instead of label text
        const button = screen.getByText("Greyhound");

        expect(button).toBeInTheDocument();
    });
});
