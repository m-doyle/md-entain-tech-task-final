"use client";

import styles from "./error_card.module.css";
import { connect } from "react-redux";
import { ActionTypes, fetchRaces } from "../redux/actions";
import { ThunkDispatch } from "redux-thunk";
import { State } from "../redux/state";

type Props = {
    errorMessage: string;
    tryAgain: boolean;
    updateRaces: Function;
};

/**
 * Error card will display whatever message is passed as well as an optional
 * 'Try again' button which will fetch new races.
 */
const _ErrorCard = ({ errorMessage, tryAgain, updateRaces }: Props) => {
    return (
        <div className={styles.error_card}>
            <p>{errorMessage}</p>
            {tryAgain ? (
                <button onClick={() => updateRaces()}>Try again</button>
            ) : null}
        </div>
    );
};

const mapDispatchToProps = (
    dispatch: ThunkDispatch<State, unknown, ActionTypes>
) => ({
    updateRaces: () => {
        dispatch(fetchRaces(true));
    },
});

const ErrorCard = connect(null, mapDispatchToProps)(_ErrorCard);

export { ErrorCard };
