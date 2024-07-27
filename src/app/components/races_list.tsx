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
};

/**
 * Display races to user if there are any. Else will show an error card.
 */
const _RacesList = ({ loading, races, category }: Props) => {
    // Return null on first render, so the client and server match
    const [hydrated, setHydrated] = useState(false);
    useEffect(() => {
        setHydrated(true);
    }, []);
    if (!hydrated || loading) {
        return <ErrorCard tryAgain={false} errorMessage={"Loading..."} />;
    }

    return (
        <div className={styles.races_list_wrapper}>
            {races.length == 0 ? (
                <ErrorCard
                    errorMessage={`Unable to find any ${getCategoryName(
                        category
                    )} races...`}
                    tryAgain={true}
                />
            ) : (
                races.map((race: RaceSummary, index: number) => {
                    return <RaceCard key={index} raceData={race} />;
                })
            )}
        </div>
    );
};

const mapStateToProps = (state: State) => ({
    loading: state.loading,
    races: state.racesToDisplay,
    category: state.category,
});

const RacesList = connect(mapStateToProps)(_RacesList);

export { RacesList };
