import { Board } from "./board.js";
import { Canvas } from "./canvas.js";
import { FSM } from "./state.js";
import { scoreBoard } from "./score.js";

/**
 * 
 * @param {Board} board 
 * @param {Canvas} canvas 
 * @param {() => void} paint
 */
function createSidePanelState(board, canvas, paint) {
    const sidePanelState = new FSM();

    sidePanelState.addState("initial", {
        setup() {
            const btnScore = document.querySelector("#btn-score");

            btnScore.addEventListener("click", (e) => {
                const scores = scoreBoard(board);
                console.log(scores);
            });
        },
        cleanup() {
            
        },
    });

    return { sidePanelState };
}

export { createSidePanelState };
