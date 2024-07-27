"use client";

import { Provider } from "react-redux";
import styles from "./page.module.css";
import { RaceDisplayWrapper } from "./components/race_display_wrapper";
import { createStore } from "./redux/store";
import { fetchRaces } from "./redux/actions";

export default function App() {
    // Create then make initial call to populate store
    const store = createStore();
    store.dispatch(fetchRaces(true));

    return (
        <main className={styles.main}>
            <Provider store={store}>
                <div className={styles.page_wrapper}>
                    <div className={styles.header_wrapper}>
                        <h3>NEXT TO GO!</h3>
                    </div>
                    <RaceDisplayWrapper />
                </div>
            </Provider>
        </main>
    );
}
