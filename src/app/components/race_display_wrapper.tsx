"use client";

import { RacesList } from "./races_list";
import { CategoryFilter } from "./category_filter";
import { getCategoryName, RacingCategory } from "../utils";
import { connect } from "react-redux";
import { ActionTypes, fetchRaces, filterRaces } from "../redux/actions";
import { State } from "../redux/state";
import { ThunkDispatch } from "redux-thunk";
import styles from "./race_display_wrapper.module.css";

type Props = {
    updateRaceCategory: Function;
    category: RacingCategory;
};

/**
 * Display the category filter buttons and the RacesList component.
 */
export const _RaceDisplayWrapper = ({
    updateRaceCategory,
    category,
}: Props) => {
    // Handle category selection or de-selection.
    const handleChange = (newCategory: RacingCategory) => {
        if (newCategory === category) {
            updateRaceCategory(RacingCategory.All);
        } else {
            updateRaceCategory(newCategory);
        }
    };

    return (
        <div className={styles.display_wrapper}>
            <p>Filter by race type:</p>
            <div className={styles.category_list}>
                {[
                    RacingCategory.Greyhound,
                    RacingCategory.Harness,
                    RacingCategory.Horse,
                ].map((value, index) => (
                    <CategoryFilter
                        key={index}
                        id={`filter_${getCategoryName(value)}`}
                        categoryValue={value}
                        changeCategory={handleChange}
                        selected={category == value}
                    />
                ))}
            </div>
            <RacesList />
        </div>
    );
};

const mapStateToProps = (state: State) => ({
    category: state.category,
});

const mapDispatchToProps = (
    dispatch: ThunkDispatch<State, unknown, ActionTypes>
) => ({
    updateRaceCategory: (category: RacingCategory) => {
        dispatch(filterRaces(category));
        dispatch(fetchRaces(false));
    },
});

const RaceDisplayWrapper = connect(
    mapStateToProps,
    mapDispatchToProps
)(_RaceDisplayWrapper);

export { RaceDisplayWrapper };
