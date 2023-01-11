import { Board } from "./board.js";
import { Canvas } from "./canvas.js";
import { FSM } from "./state.js";
import { scoreTile } from "./score.js";

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
                board.tiles.forEach((_, tileIndex) => {
                    const score = scoreTile(board, tileIndex);
                    if (score) {
                        console.log(score);
                    }
                })
            });
        },
        cleanup() {

        },
    });

    return { sidePanelState };
}

export { createSidePanelState };
