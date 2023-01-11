
import { createDb } from "./database.js";
import { Canvas } from "./canvas.js";
import { drawArc, drawRect, drawText } from "./draw.js";
import { isCircleCollision, randFromRange } from "./utils.js";
// import { Board, ADD, SUBTRACT } from "./sandbox.js";
import { Board, paintToken } from "./board.js";
import { FSM } from "./state.js";

function saveBoard(board) {
    localStorage.board = JSON.stringify(board);
}

function loadBoard() {
    const board = new Board(8, 12, 80);
    try {
        const saved = JSON.parse(localStorage.board);
        board.rows = saved.rows;
        board.cols = saved.cols;
        board.tileSize = saved.tileSize;
        board.tiles = saved.tiles;
        board.tokens = saved.tokens;
        board.graph = saved.graph;
    } catch {
        console.log("couldn't load board");
        board.addToken(3, 30);
        board.addToken(2, 30);
        board.addToken(5, 30);
        board.addToken(5, 30);
        board.addToken(1, 21);
        board.addToken(6, 74);
    }
    return board;
}


function createGame() {
    const canvas = new Canvas("canvas");
    const board = window.board = loadBoard();

    const state = new FSM({ selectedTokenId: null });

    state.addState("mousedown", {
        setup() {
            board.tokens[this.data.selectedTokenId].isFocused = true;
            canvas.on("mousemove", (e) => {
                board.updateTokenCoords(this.data.selectedTokenId, e.offsetX, e.offsetY);
                paint();
            });
            canvas.on("mouseup", (e) => {
                const { tileIndex } = board.getTileFromCoords(e.offsetX, e.offsetY);
                const nTileTokens = board.graph[tileIndex].length;
                if (nTileTokens < 4) {
                    board.moveToken(this.data.selectedTokenId, tileIndex);
                }
                board.positionTokenInTile(this.data.selectedTokenId);
                saveBoard(board)
                paint();
                this.setState("idle");
            })
        },
        cleanup() {
            board.tokens[this.data.selectedTokenId].isFocused = false;
            this.data.selectedTokenId = null;
            canvas.off("mousemove");
            canvas.off("mouseup");
        }
    })

    state.addState("idle", {
        setup() {
            canvas.on("mousedown", (e) => {
                const { tileIndex } = board.getTileFromCoords(e.offsetX, e.offsetY);
                const selectedTokenId = board.graph[tileIndex].find(tokenId => {
                    const token = board.tokens[tokenId];
                    return isCircleCollision(token, { x: e.offsetX, y: e.offsetY, r: 1 });
                });
                if (selectedTokenId) {
                    this.data.selectedTokenId = selectedTokenId;
                    this.setState("mousedown");
                }
            });
        },
    });

    function setup() {
        canvas.width = board.cols * board.tileSize;
        canvas.height = board.rows * board.tileSize;

        state.setState("idle");

        saveBoard(board)
    }

    function paint() {
        canvas.clear();
        board.tiles.forEach((tile, tileIndex) => {
            const { x: tileX, y: tileY } = board.getTileCoords(tileIndex);
            drawRect(canvas, {
                x: tileX,
                y: tileY,
                w: board.tileSize,
                h: board.tileSize,
                fill: true,
                fillStyle: tile.color,
                stroke: true,
            });
        });
        const deferred = [];
        board.graph.forEach((tokenIds, tileIndex) => {
            tokenIds.forEach((tokenId, tileTokenIndex) => {
                const token = board.tokens[tokenId];
                if (token) {
                    if (token.isFocused) {
                        deferred.push(token);
                    } else {
                        paintToken(canvas, token)
                    }
                }
            });
        });
        deferred.forEach((token) => {
            paintToken(canvas, token);
        });
    }

    return { setup, paint };
}

export { createGame };
