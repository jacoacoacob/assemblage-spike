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
            accum[token.player] = { tile: board.tiles[tileIndex], tokens: [] };
        }
        accum[token.player].tokens.push(token);
        return accum;
    }, {});

    const playerNames = Object.keys(players);

    if (playerNames.length > 1) {
        console.log(tileIndex, players)
    }

    return players;
}

export { scoreTile };
