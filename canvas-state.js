import { Board } from "./board.js";
import { Canvas } from "./canvas.js";
import { FSM } from "./state.js";
import { isCircleCollision, sum } from "./utils.js";
import { saveBoard } from "./storage.js";

/**
 * 
 * @param {Board} board
 * @param {number} tileIndex 
 * @param {string} tokenId 
 */
function validateMove(board, tileIndex, tokenId) {
    const tileTokenIds = board.graph[tileIndex].filter(
        tokenId_ => tokenId_ !== tokenId
    );
    if (tileTokenIds.length > 3) {
        return {
            isValid: false,
            message: "Each tile can contain a maximum of 4 tokens.",
        };
    }
    const tile = board.tiles[tileIndex];
    const token = board.tokens[tokenId];
    const tileTokenValueSum = sum(
        tileTokenIds.map(tokenId => Math.abs(board.tokens[tokenId].value))
    );
    if (tileTokenValueSum + Math.abs(token.value) > tile.threshold) {
        return {
            isValid: false,
            message: `The sum of all token values in a tile must be less than or equal to the tile's threshold (${tile.threshold}).`
        }
    }
    return { isValid: true };
}


/**
 * 
 * @param {Board} board 
 * @param {Canvas} canvas 
 * @param {() => void} paint
 */
function createCanvasState(board, canvas, paint) {
    const canvasState = new FSM({ selectedTokenId: null });
    const moveValidityState = new FSM({
        selector: "#messages",
        message: "",
        isValid: true,
        tileIndex: null,
    });

    moveValidityState.addState("valid", {
        setup() {
            this.data.isValid = true;
            this.data.message = "";
        },
        tick(tileIndex, tokenId) {
            if (tileIndex !== this.data.tileIndex) {
                this.data.tileIndex = tileIndex;
                const { isValid, message } = validateMove(board, tileIndex, tokenId);
                if (!isValid) {
                    this.data.message = message;
                    this.setState("invalid");
                }
            }
        }
    });

    moveValidityState.addState("invalid", {
        setup() {
            this.data.isValid = false;
            document.querySelector(this.data.selector).textContent = this.data.message;
        },
        tick(tileIndex, tokenId) {
            if (tileIndex !== this.data.tileIndex) {
                this.data.tileIndex = tileIndex;
                const { isValid } = validateMove(board, tileIndex, tokenId);
                if (isValid) {
                    this.setState("valid");
                }
            }
        },
        cleanup() {
            document.querySelector(this.data.selector).textContent = "";
        }
    });

    canvasState.addState("mousedown", {
        setup() {
            const selectedToken = board.tokens[this.data.selectedTokenId];
            selectedToken.isFocused = true;
            canvas.on("mousemove", (e) => {
                const { tileIndex } = board.getTileFromCoords(e.offsetX, e.offsetY);
                moveValidityState.tick(tileIndex, selectedToken.id);
                board.updateTokenCoords(selectedToken.id, e.offsetX, e.offsetY);
                paint();
            });
            canvas.on("mouseup", (e) => {
                const { tileIndex } = board.getTileFromCoords(e.offsetX, e.offsetY);
                const originalTileIndex = selectedToken.tileIndex;
                if (moveValidityState.data.isValid) {
                    board.moveToken(selectedToken.id, tileIndex);
                    board.graph[originalTileIndex].forEach(tokenId => {
                        board.positionTokenInTile(tokenId);
                    });
                } else {
                    moveValidityState.setState("valid");
                }
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

    return { canvasState, moveValidityState };
}

export { createCanvasState };
