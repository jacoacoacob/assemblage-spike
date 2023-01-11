import { Canvas } from "./canvas.js";
// import { Board, ADD, SUBTRACT } from "./sandbox.js";
import { createCanvasState } from "./canvas-state.js";
import { saveBoard, loadBoard } from "./storage.js";
import { paintBoard } from "./paint.js";


function createGame(name) {
    const canvas = new Canvas("canvas");
    const board = window.board = loadBoard(name, b => {
        b.addToken("p1", 3, 30);
        b.addToken("p1", 2, 30);
        b.addToken("p1", 2, 30);
        b.addToken("p2", 3, 30);
        b.addToken("p2", 1, 21);
        b.addToken("p2", 4, 74);
    });

    const { canvasState, moveValidityState } = createCanvasState(board, canvas, paint);

    function setup() {
        canvas.width = board.cols * board.tileSize;
        canvas.height = board.rows * board.tileSize;

        canvasState.setState("idle");
        moveValidityState.setState("valid");

        saveBoard(board)
    }

    function paint() {
        paintBoard(canvas, board);
    }

    return { setup, paint };
}

export { createGame };
