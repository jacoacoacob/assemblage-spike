
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
                paint()
            });
            canvas.on("mouseup", (e) => {
                const { tileIndex } = board.getTileFromCoords(e.offsetX, e.offsetY);
                board.moveToken(this.data.selectedTokenId, tileIndex);
                board.positionTokenInTile(this.data.selectedTokenId);
                saveBoard(board)
                paint();
                this.setState("idle");
            })
        },
        cleanup() {
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
            paintToken(canvas, token)
        });
    }

    return { setup, paint };
}

// /**
//  * 
//  * @param {{
//  *  name: string;
//  * }} options 
//  */
// function createGame2(options) {
//     const {
//         name,
//     } = options;
//     const { grid, players } = createDb(name);
//     const canvas = new Canvas("canvas");
//     const board = new Board();


//     grid.listTiles().forEach(tile => {
//         board.addTile(randFromRange(5, 15));
//     });

//     const { rows, cols, tileSize } = grid.getDimensions();

//     board.addToken(3, ADD, 5, tileSize / 6);
//     board.addToken(4, ADD, 6, tileSize / 6);
//     board.addToken(2, ADD, 2, tileSize / 6);
//     board.addToken(2, ADD, 2, tileSize / 6);
//     board.addToken(2, ADD, 2, tileSize / 6);
//     board.addToken(3, ADD, 2, tileSize / 6);

//     canvas.width = cols * tileSize;
//     canvas.height = rows * tileSize;

//     canvas.on("mousedown", (e) => {
//         const { index } = grid.getTileFromCoords(e.offsetX, e.offsetY);
//         board.graph[index].forEach(tokenIndex => {
//             const token = board.tokens[tokenIndex];
//             token.isMoving = true;
//             if (isCircleCollision(token, { x: e.offsetX, y: e.offsetY, r: 1})) {
//                 function onMousemove(e) {
//                     token.updateCoords(e.offsetX, e.offsetY);
//                     paint();
//                     token.draw(canvas)
//                 }
//                 function onMouseup(e) {
//                     // drop token
//                     const { index: tileIndex } = grid.getTileFromCoords(e.offsetX, e.offsetY);
//                     const { x: tileX, y: tileY } = grid.getTileCoords(tileIndex);
//                     const tokensInTile = board.graph[tileIndex].length;
//                     if (tokensInTile > 3) {
//                         alert("Too many tokens in tile")
//                     } else {
//                         paint()
//                         token.snapToTile(tileSize, tileX, tileY, tokensInTile );
//                         token.isMoving = false;
//                         // token.draw(canvas);
//                         board.moveToken(tokenIndex, tileIndex)
//                         console.log(board.graph)
//                         // then
//                         canvas.off("mousemove", onMousemove);
//                         canvas.off("mouseup", onMouseup);
//                     }
//                 }
//                 canvas.on("mousemove", onMousemove)
//                 canvas.on("mouseup", onMouseup);
//             }
//         });
//     });

//     function paint() {
//         canvas.clear();
//         const { rows, cols, tileSize } = grid.getDimensions();
//         grid.listTiles().forEach(([r,g,b], tileIndex) => {
//             const { threshold: tileThreshold } = board.tiles[tileIndex];
//             const { x: tileX, y: tileY } = grid.getTileCoords(tileIndex);
//             const fill = true;
//             drawRect(canvas, {
//                 x: tileX,
//                 y: tileY,
//                 w: grid.getTileSize(),
//                 h: grid.getTileSize(),
//                 stroke: true,
//                 strokeStyle: fill ? "whitesmoke" : "#aaa",
//                 fill,
//                 fillStyle: `rgb(${r}, ${g}, ${b})`
//             });

//             board.graph[tileIndex].forEach((tokenIndex, i, arr) => {
//                 const token = board.tokens[tokenIndex];
//                 if (!token.isMoving) {
//                     token.snapToTile(tileSize, tileX, tileY, i);
//                 }
//                 token.draw(canvas);
//             });

//             drawText(canvas, {
//                 x: tileX + tileSize / 2 - (tileThreshold < 10 ? 6 : 8),
//                 y: tileY + tileSize / 2 + 4,
//                 font: "14px monospace",
//                 fillStyle: "black",
//                 text: board.tiles[tileIndex].threshold,
//             })
//         })
//     }

//     return {
//         paint,
//         update() {
            
//         },
//     }
// }

export { createGame };


function randomRGB() {
    return Math.floor(Math.random() * 256);
}