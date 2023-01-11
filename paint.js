import { Board, Token } from "./board.js";
import { Canvas } from "./canvas.js";
import { drawArc, drawRect, drawText } from "./draw.js";

/**
 * 
 * @param {Canvas} canvas 
 * @param {Board} board 
 */
function paintBoard(canvas, board) {
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

const TOKEN_COLORS = {
    p1: "#adf",
    p2: "#fad",
    p3: "#dfa"
};

/**
 * 
 * @param {Canvas} canvas 
 * @param {Token} token 
 */
function paintToken(canvas, token) {
    drawArc(canvas, {
        x: token.x,
        y: token.y,
        r: token.r,
        fill: true,
        fillStyle: TOKEN_COLORS[token.player],
        stroke: true,
        strokeStyle: "#555"
    });
    drawText(canvas, {
        x: token.x - 7,
        y: token.y + 4,
        font: "12px sans-serif",
        fillStyle: "black",
        // text: `${token.polarity === "positive" ? "+" : "-"}${token.value}`
        text: token.value
    });
}


export { paintBoard, paintToken };
