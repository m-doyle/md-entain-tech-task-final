"use client";

import {
    getCategoryName,
    RaceSummaries,
    RaceSummary,
    RacingCategory,
} from "../utils";
import { RaceCard } from "./race_card";
import { connect } from "react-redux";
import { useEffect, useState } from "react";
import { State } from "../redux/state";
import styles from "./races_list.module.css";
import { ErrorCard } from "./error_card";

type Props = {
    loading: boolean;
    races: RaceSummaries;
    category: RacingCategory;
    error: string | null;
};

/**
 * Displays list of race cards to user if they are present.
 * Else will show an error card with retry button.
 */
const _RacesList = ({ loading, races, category, error }: Props) => {
    // Return null on first render, so the client and server match
    const [hydrated, setHydrated] = useState(false);
    useEffect(() => {
        setHydrated(true);
    }, []);
    if (!hydrated || loading) {
        return <ErrorCard tryAgain={false} errorMessage={"Loading..."} />;
    }

    // If no races found for a category, display 'Try again' error component.
    // If error, display error message.
    if (races.length == 0) {
        const displayMessage =
            error == null
                ? `Unable to find any ${getCategoryName(category)} races...`
                : "Unexpected error!";
        return (
            <div className={styles.races_list_wrapper}>
                <ErrorCard errorMessage={displayMessage} tryAgain={true} />
            </div>
        );
    }

    // Return race list as normal
    return (
        <div className={styles.races_list_wrapper}>
            {races.map((race: RaceSummary, index: number) => {
                return (
                    <RaceCard
                        key={`${index}_${race.race_id}`}
                        raceData={race}
                    />
                );
            })}
        </div>
    );
};

const mapStateToProps = (state: State) => ({
    loading: state.loading,
    races: state.racesToDisplay,
    category: state.category,
    error: state.error,
});

const RacesList = connect(mapStateToProps)(_RacesList);

export { RacesList };
