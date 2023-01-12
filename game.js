import { Board } from "./board.js";
import { Canvas } from "./canvas.js";
// import { Board, ADD, SUBTRACT } from "./sandbox.js";
import { createCanvasState } from "./canvas-state.js";
import { createSidePanelState } from "./side-panel-state.js";
import { saveBoard, loadBoard } from "./storage.js";
import { paintBoard } from "./paint.js";


/**
 * 
 * @param {Board} board 
 * @param {string} player
 */
function generatePlayerTokens(board, player) {
    const values = Array.from(Array(4)).map((_, i) => i + 1);
    for (let i = 0; i < 6; i++) {
        values.forEach(value => {
            board.addToken(player, value);
        });
    }
}


function createGame(name) {
    const canvas = new Canvas("canvas");
    const board = window.board = loadBoard(name, b => {
        generatePlayerTokens(b, "p1");
        generatePlayerTokens(b, "p2");
        generatePlayerTokens(b, "p3");
        generatePlayerTokens(b, "p4");
        const playerTokenIds = Object.values(b.tokens).reduce((accum, token) => {
            if (!accum[token.player]) {
                accum[token.player] = [];
            }
            accum[token.player].push(token.id);
            return accum;
        }, {});
        b.moveToken(playerTokenIds.p1[0], 8);
        b.moveToken(playerTokenIds.p1[10], 12);
        b.moveToken(playerTokenIds.p1[20], 12);
        b.moveToken(playerTokenIds.p2[0], 8);
        b.moveToken(playerTokenIds.p2[10], 12);
        b.moveToken(playerTokenIds.p2[20], 11);
        b.moveToken(playerTokenIds.p3[0], 5);
        b.moveToken(playerTokenIds.p3[10], 11);
        b.moveToken(playerTokenIds.p3[20], 12);
        b.moveToken(playerTokenIds.p4[0], 5);
        b.moveToken(playerTokenIds.p4[10], 11);
        b.moveToken(playerTokenIds.p4[20], 12);
        // b.positionTokenInTile(playerTokenIds.p1[0]);
    });

    const { canvasState, moveValidityState } = createCanvasState(board, canvas, paint);
    const { sidePanelState } = createSidePanelState(board, canvas, paint);

    function setup() {
        canvas.width = board.cols * board.tileSize;
        canvas.height = board.rows * board.tileSize;

        canvasState.setState("idle");
        moveValidityState.setState("valid");
        sidePanelState.setState("initial");

        saveBoard(board)
    }

    function paint() {
        paintBoard(canvas, board);
    }

    return { setup, paint };
}

export { createGame };
