import { Board } from "./board.js";

/**
 * 
 * @param {Board} board 
 */
function saveBoard(board) {
    localStorage.setItem(`assemblage-${board.gameId}`, JSON.stringify(board));
}

/**
 * 
 * @param {string} gameId 
 * @param {(board: Board) => void} fallbackCallback 
 */
function loadBoard(gameId, fallbackCallback) {
    const board = new Board(gameId, 8, 12, 80);
    try {
        const saved = JSON.parse(localStorage.getItem(`assemblage-${gameId}`));
        board.rows = saved.rows;
        board.cols = saved.cols;
        board.tileSize = saved.tileSize;
        board.tiles = saved.tiles;
        board.tokens = saved.tokens;
        board.graph = saved.graph;
    } catch (error) {
        console.log(error.message);
        console.log("Falling back to default board setup.");
        fallbackCallback(board);
    }
    return board;
}

export { saveBoard, loadBoard };
