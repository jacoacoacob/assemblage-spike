/**
 * 1. Tokens are primary; tiles are secondary
 */

import { randId } from "./utils.js";
import { drawArc, drawText } from "./draw.js";


const DIVIDE = "divide";
const MULTIPLY = "multiply";
const ADD = "add";
const SUBTRACT = "subtract";

const operation = {
    [DIVIDE]: (x, y) => x / y,
    [MULTIPLY]: (x, y) => x * y,
    [ADD]: (x, y) => x + y,
    [SUBTRACT]: (x, y) => x - y,
};

class Tile {
    constructor(threshold) {
        this.threshold = threshold;
    }
}

class Token {
    constructor(value, operator, tileIndex, r) {
        this.id = randId(6);
        this.value = value;
        this.operator = operator;
        this.tileIndex = tileIndex;
        this.r = r;
        this.x = null;
        this.y = null;
        this.isMoving = false;
    }

    updateCoords(x, y) {
        this.x = x;
        this.y = y;
    }

    snapToTile(tileSize, tileX, tileY, tileTokenIndex) {
        this.x = tileX + tileSize / 4 * (tileTokenIndex % 2 === 0 ? 1 : 3),
        this.y = tileY + tileSize / 4 * (tileTokenIndex < 2 ? 1 : 3)
    }

    draw(canvas) {
        drawArc(canvas, {
            x: this.x,
            y: this.y,
            r: this.r,
            fill: true,
        });
        drawText(canvas, {
            x: this.x - 3,
            y: this.y + 4,
            fillStyle: "whitesmoke",
            text: this.value
        });
    }
}

class Board {
    constructor() {
        /** @type {Tile[]} */
        this.tiles = [];
        /** @type {Token[]} */
        this.tokens = [];
        /** @type {number[][]} */
        this.graph = [];
    }

    /**
     * 
     * @param {number} threshold 
     */
    addTile(threshold) {
        this.tiles.push(new Tile(threshold));
        this.graph.push([]);
    }

    /**
     * 
     * @param {number} value 
     * @param {string} operator 
     * @param {number} tileIndex 
     */
    addToken(value, operator, tileIndex, tileSize) {
        this.tokens.push(new Token(value, operator, tileIndex, tileSize));
        this.moveToken(this.tokens.length - 1, tileIndex);
    }

    /**
     * 
     * @param {number} tokenIndex 
     * @returns {Token | undefined}
     */
    getToken(tokenIndex) {
        return this.tokens[tokenIndex]
    }

    /**
     * 
     * @param {number} tokenIndex 
     * @param {number} tileIndex 
     */
    moveToken(tokenIndex, tileIndex) {
        const token = this.tokens[tokenIndex];
        if (token) {
            this.graph[token.tileIndex] = this.graph[token.tileIndex].filter(
                tokenIndex => this.tokens[tokenIndex].id !== token.id
            );
            this.graph[tileIndex].push(tokenIndex);
            token.tileIndex = tileIndex;
        }
    }
}

export { Board, ADD, SUBTRACT };
