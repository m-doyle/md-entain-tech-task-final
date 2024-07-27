"use client";

import { useEffect, useState } from "react";
import styles from "./race_card.module.css";
import {
    calculateSecondsUntilStartTime,
    timeRemainingAsString,
    getCategoryName,
    RaceSummary,
} from "../utils";
import { connect } from "react-redux";
import { ActionTypes, deleteRaceAndRefresh } from "../redux/actions";
import { ThunkDispatch } from "redux-thunk";
import { State } from "../redux/state";

type Props = {
    raceData: RaceSummary;
    deleteRace: Function;
};

/**
 * Display a race card with a countdown timer till advertised_start.
 * Card will update with "Started!" once the advertised_start time is reached
 * and will self delete 1 minute past the start time.
 */
const _RaceCard = ({ deleteRace, raceData }: Props) => {
    const {
        meeting_name,
        race_number,
        race_id,
        category_id,
        advertised_start,
    } = raceData;
    const startTime = advertised_start.seconds;
    const [timeRemaining, setTimeRemaining] = useState<string>(
        timeRemainingAsString(startTime)
    );
    const [overtime, setOvertime] = useState<boolean>(false);

    // Live countdown timer - updates every second
    useEffect(() => {
        const updateRemainingTime = () => {
            let operator = "";
            const secondsRemaining: number =
                calculateSecondsUntilStartTime(startTime);
            if (secondsRemaining <= 0) {
                setOvertime(true);
                operator = "-";
            }
            if (secondsRemaining <= -60) {
                setOvertime(false);
                deleteRace(race_id);
            }
            setTimeRemaining(operator + timeRemainingAsString(startTime));
        };

        // Update remaining time immediately on mount
        updateRemainingTime();

        const interval = setInterval(updateRemainingTime, 1000);
        return () => clearInterval(interval); // Cleanup on component unmount
    }, [startTime, race_id, deleteRace]);

    return (
        <div className={styles.race_card_wrapper} id={race_id}>
            <div className={styles.card_heading_wrapper}>
                <p>
                    {meeting_name} Race {race_number}
                </p>
                <p className={overtime ? styles.timerTextOT : styles.timerText}>
                    {timeRemaining}
                </p>
            </div>
            <div className={styles.card_footer_wrapper}>
                <p>{getCategoryName(category_id)}</p>
                <p className={styles.timerTextOT}>
                    {overtime ? "Started!" : null}
                </p>
            </div>
        </div>
    );
};

const mapDispatchToProps = (
    dispatch: ThunkDispatch<State, unknown, ActionTypes>
) => ({
    deleteRace: (race_id: string) => {
        dispatch(deleteRaceAndRefresh(race_id));
    },
});

const RaceCard = connect(null, mapDispatchToProps)(_RaceCard);

export { RaceCard };
