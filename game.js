
// import { createDb } from "./database.js";
import { Canvas } from "./canvas.js";
import { drawRect, drawText } from "./draw.js";
import { isCircleCollision, randFromRange, sum } from "./utils.js";
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
        board.addToken("p1", 3, 30);
        board.addToken("p1", 2, 30);
        board.addToken("p1", 5, 30);
        board.addToken("p2", 5, 30);
        board.addToken("p2", 1, 21);
        board.addToken("p2", 6, 74);
    }
    return board;
}


function createGame() {
    const canvas = new Canvas("canvas");
    const board = window.board = loadBoard();

    const canvasState = new FSM({ selectedTokenId: null });
    const moveState = new FSM({ selector: "#messages", message: "" });

    moveState.addState("valid");
    moveState.addState("invalid", {
        setup() {
            document.querySelector(this.data.selector).textContent = this.data.message;
        },
        cleanup() {
            this.data.message = "";
            document.querySelector(this.data.selector).textContent = "";
        }
    })

    canvasState.addState("mousedown", {
        setup() {
            board.tokens[this.data.selectedTokenId].isFocused = true;
            canvas.on("mousemove", (e) => {
                const {  } = board.getTileFromCoords(e.offsetX, e.offsetY);
                board.updateTokenCoords(this.data.selectedTokenId, e.offsetX, e.offsetY);
                const tileIsFull = false;
                const tileIsOverThreshold = false;
                if (tileIsFull || tileIsOverThreshold) {
                    if (moveState.state === "valid") {
                        moveState.setState(
                            "invalid",
                            {
                                message: tileIsFull
                                    ? "Each tile can contain a maximum of 4 tokens."
                                    : "The sum of all token values in a tile must be less than or equal to the tile's threshold."
                            }
                        );
                    }
                }
                paint();
            });
            canvas.on("mouseup", (e) => {
                moveState.setState("valid");
                const { tileIndex, tile } = board.getTileFromCoords(e.offsetX, e.offsetY);
                const selectedToken = board.tokens[this.data.selectedTokenId];
                const originalTileIndex = board.tokens[selectedToken.id].tileIndex;
                const nTileTokens = board.graph[tileIndex].length;
                const tileTokenSum = sum(board.graph[tileIndex].map(tokenId => board.tokens[tokenId].value))
                if (nTileTokens < 4 && tileTokenSum + selectedToken.value <= tile.threshold) {
                    board.moveToken(selectedToken.id, tileIndex);
                }
                board.graph[originalTileIndex].forEach(tokenId => {
                    board.positionTokenInTile(tokenId);
                });
                board.positionTokenInTile(selectedToken.id);
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

    canvasState.addState("idle", {
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

        canvasState.setState("idle");
        moveState.setState("valid");

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
                // fillStyle: tile.color,
                fillStyle: "whitesmoke",
                stroke: true,
            });
            drawText(canvas, {
                x: tileX + board.tileSize / 2 - 4,
                y: tileY + board.tileSize / 2 + 4,
                font: "14px sans-serif",
                text: tile.threshold,
            })
        });
        const deferred = [];
        board.graph.forEach((tokenIds) => {
            tokenIds.forEach((tokenId) => {
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
