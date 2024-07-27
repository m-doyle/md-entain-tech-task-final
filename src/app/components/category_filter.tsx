import { getCategoryName, RacingCategory } from "../utils";
import styles from "./category_filter.module.css";

type Props = {
    changeCategory: Function;
    categoryValue: RacingCategory;
    id: string;
    selected: boolean;
};

/**
 * Simple category filter button component. Will fire callback when clicked.
 */
export const CategoryFilter = ({
    changeCategory,
    categoryValue,
    id,
    selected,
}: Props) => {
    return (
        <button
            className={styles.category_card}
            id={id}
            onClick={() => changeCategory(categoryValue)}
            data-selected={selected}
        >
            {getCategoryName(categoryValue)}
        </button>
    );
};
