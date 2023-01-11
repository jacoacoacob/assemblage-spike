import { Board } from "./board.js";
import { sum } from "./utils.js";

/**
 * 
 * @param {Board} board 
 * @param {number} tileIndex 
 */
function scoreTile(board, tileIndex) {
    const tile = board.tiles[tileIndex];
    const tileContents = board.graph[tileIndex].reduce((accum, tokenId) => {
        const token = board.tokens[tokenId];
        accum.tileIndex = tileIndex;
        accum.tileThreshold = board.tiles[tileIndex].threshold;
        if (!accum.players[token.player]) {
            accum.players[token.player] = [];
        }
        accum.players[token.player].push(token);
        accum.tokenValueTotal += token.value;
        return accum;
    }, {
        tileIndex,
        tileThreshold: board.tiles[tileIndex].threshold,
        tokenValueTotal: 0,
        players: {}
    });

    const playerNames = Object.keys(tileContents.players);

    if (playerNames.length > 1) {
        const playerTotals = playerNames.reduce((accum, player) => {
            accum[player] = sum(tileContents.players[player].map(token => token.value))
            return accum;
        }, {});

        const remainingTileThreshold = tile.threshold - tileContents.tokenValueTotal;

        const playerScores = playerNames.reduce((accum, player) => {
            accum[player] = 0;
            playerNames
                .filter(player_ => player_ !== player)
                .forEach(otherPlayer => {
                    const diff = playerTotals[player] - playerTotals[otherPlayer];
                    // if (tile.operator === "add") {
                        accum[player] += diff + remainingTileThreshold;
                    // } else {
                        // accum[player] += diff  remainingTileThreshold;
                    // }
                });
            return accum;
        }, {});

        return playerScores;
    }

    return null;
}

export { scoreTile };
