import { Board } from "./board.js";

/**
 * 
 * @param {Board} board 
 * @param {number} tileIndex 
 */
function scoreTile(board, tileIndex) {
    const players = board.graph[tileIndex].reduce((accum, tokenId) => {
        const token = board.tokens[tokenId];
        if (!accum[token.player]) {
            accum[token.player] = [];
        }
        accum[token.player].push(token);
        return accum;
    }, {});

    return players;
}

export { scoreTile };
