import { randFromRange, randId, sum } from "./utils.js";

class Tile {
    /**
     * 
     * @param {number} threshold 
     * @param {"add" | "subtract"} operator 
     * @param {[number, number, number] | [number, number, number, number]} color 
     */
    constructor(threshold, operator, [r, g, b, a]) {
        this.threshold = threshold;
        this.operator = operator;
        this.color = typeof a === "number"
            ? `rgba(${r}, ${g}, ${b}, ${a})`
            : `rgb(${r}, ${g}, ${b})`;
    }
}

class Token {
    /**
     * 
     * @param {string} player A unique identifier for a player
     * @param {number} value 
     * @param {number} tileIndex 
     * @param {number} r 
     */
    constructor(player, value, tileIndex, r) {
        this.id = randId(6);
        this.x = 0;
        this.y = 0;
        this.isFocused = false;

        this.value = value;
        this.player = player;
        this.tileIndex = typeof tileIndex === "number" ? tileIndex : -1;
        this.r = r;
    }
}


class Board {
    /**
     * 
     * @param {string} gameId
     * @param {number} rows 
     * @param {number} cols 
     * @param {number} tileSize 
     */
    constructor(gameId, rows, cols, tileSize) {
        this.gameId = gameId;
        this.rows = rows;
        this.cols = cols;
        this.tileSize = tileSize;
        /** @type {Tile[]} */
        this.tiles = Array.from(Array(rows * cols)).map(
            () => new Tile(
                randFromRange(5, 15),
                Math.random() < 0.5 ? "add" : "subtract",
                [
                    randFromRange(0, 255),
                    randFromRange(0, 255),
                    randFromRange(0, 255),
                    0.8
                ]
            )
        );
        /** @type {Record<Token["id"], Token>} */
        this.tokens = {};
        /** @type {Token["id"][][]} */
        this.graph = this.tiles.map(() => []);
    }

    addToken(player, value, tileIndex) {
        const token = new Token(player, value, tileIndex, this.tileSize / 6);
        if (Boolean(this.tokens[token.id])) {
            this.addToken(player, value, tileIndex);
        } else {
            this.tokens[token.id] = token;
            this.moveToken(token.id, tileIndex);
            this.positionTokenInTile(token.id);
        }
    }

    /**
     * 
     * @param {number} tileIndex 
     */
    getTileCoords(tileIndex) {
        const row = Math.floor(tileIndex / this.cols);
        const col = tileIndex % this.cols;
        return {
            x: col * this.tileSize,
            y: row * this.tileSize,
        }
    }

    /**
     * 
     * @param {number} x 
     * @param {number} y 
     */
    getTileFromCoords(x, y) {
        const col = Math.floor(x / this.tileSize);
        const row = Math.floor(y / this.tileSize);
        const tileIndex = row * this.cols + col;
        return {
            tileIndex,
            tile: this.tiles[tileIndex],
        };
    }

    /**
     * Move a token from its current tile to a new tile
     * @param {string} tokenId 
     * @param {number} tileIndex 
     */
    moveToken(tokenId, tileIndex) {
        const token = this.tokens[tokenId];
        if (token) {
            if (token.tileIndex > -1) {
                this.graph[token.tileIndex] = this.graph[token.tileIndex].filter(
                    tokenId => tokenId !== token.id
                );
            }
            token.tileIndex = tileIndex;
            if (tileIndex > -1) {
                this.graph[tileIndex].push(token.id);
            } else {
                // add to player's token reserve
            }
            this.positionTokenInTile(token.id);
        }
    }

    /**
     * 
     * @param {string} tokenId 
     */
    positionTokenInTile(tokenId) {
        const token = this.tokens[tokenId];
        if (token && token.tileIndex > -1) {
            const tileTokenIndex = this.graph[token.tileIndex].indexOf(tokenId);
            const { x: tileX, y: tileY } = this.getTileCoords(token.tileIndex);
            token.x = tileX + this.tileSize / 4 * (tileTokenIndex % 2 === 0 ? 1 : 3);
            token.y = tileY + this.tileSize / 4 * (tileTokenIndex < 2 ? 1 : 3);
        }
    }

    // /**
    //  * 
    //  * @param {string} tokenId 
    //  * @param {number} tileIndex 
    //  */
    // placeToken(tokenId, tileIndex) {
    //     this.moveToken(tokenId, tileIndex);
    //     this.positionTokenInTile()
    // }

    /**
     * 
     * @param {string} tokenId 
     * @param {number} x 
     * @param {number} y 
     */
    updateTokenCoords(tokenId, x, y) {
        this.tokens[tokenId].x = x;
        this.tokens[tokenId].y = y;
    }
}

export { Board, Token };
