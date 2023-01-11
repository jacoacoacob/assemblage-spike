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

        console.log(playerTotals);

        const remainingTileThreshold = tile.threshold - tileContents.tokenValueTotal;

        playerNames.forEach(player => {
            const otherPlayers = playerNames.filter(player_ => player_ !== player);
            otherPlayers.forEach(otherPlayer => {
                const diff = playerTotals[player] - playerTotals[otherPlayer];
                console.log("score", player, diff + remainingTileThreshold);
            });
        });

    }

    return tileContents;
}

export { scoreTile };
