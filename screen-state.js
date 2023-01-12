import { FSM } from "./state.js";

function createScreenState() {
    const screenState = new FSM();

    screenState.addState("initial", {
        setup() {

        },
        cleanup() {

        },
    });

    screenState.addState("in-progress", {

    });

    return { screenState };
}

export { createScreenState };
