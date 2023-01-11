import { createGame } from "./game.js";

const game = window.game = createGame("game-1");

function main() {
    game.setup();
    game.paint();
    // requestAnimationFrame(main);
}

main();

// // function player(name, xValue) {
// //     return {
// //         name,
// //         xValue
// //     }
// // }

// // const j = player("j", 3);
// // const c = player("c", 6);
// // const x = player("x", 1);

// // const NEU_THRESHOLD = 2; 

// // function neutrantagonisym(p1, p2, tile) {
// //     // let rel = (p1.xValue - p2.xValue) / tile;
// //     let rel = (p1.xValue + p2.xValue) / tile / 2;
// //     rel = Math.round(rel * 100) / 100;
// //     const absRel = Math.abs(rel);
// //     rel = rel > NEU_THRESHOLD ? "sym" : rel < -NEU_THRESHOLD ? "ant" : "neu";
// //     return { p1: p1.name, p2: p2.name, tile, rel, absRel };
// // }

// // console.log(neutrantagonisym(j, c, Math.random()))

// const NEUTRAL_UPPER = 1;
// const NEUTRAL_LOWER = -1;

// function isNegative(value) {
//     return value < NEUTRAL_LOWER;
// }
// function isPositive(value) {
//     return value > NEUTRAL_UPPER;
// }

// function assemblageModifyer(tile, p1, p2) {
//     let modifier = 0
//     if (p1 === p2) {
//         modifier = NEUTRAL_LOWER + NEUTRAL_UPPER;
//     }
//     if (p1 > tile) {
//         modifier = p1 - tile - p2;
//     }
//     if (p1 < tile) {
//         modifier = p1 + tile - p2;
//     }
//     modifier = tile / (p1 - p2);
//     return modifier * 4;
// }

// const TILES = [
//     1, 2, 3, 1, 1,
//     3, 2, 3, 1, 2,
//     1, 3, 1, 3, 2,
//     2, 3, 2, 1, 1,
//     2, 3, 1, 2, 3,
// ]

// const PLAYERS = {
//     p1: {
//         tokens: [0,1,2],
//         xValue: 1,
//     },
//     p2: {
//         tokens: [0,1,2],
//         xValue: 2,
//     },
//     p3: {
//         tokens: [0,1,2],
//         xValue: 3,
//     }
// }

// const GRAPH = boardGraph(PLAYERS, TILES);

// [0,1,2].forEach(tileIndex => {
//     const s1 = scoreTile(tileIndex, "p1")
//     const s2 = scoreTile(tileIndex, "p2")
//     const s3 = scoreTile(tileIndex, "p3")
    
//     const modifierScoreRankings = [s1, s2, s3].sort((a, b) => a.assemblageModifierScore - b.assemblageModifierScore);
//     const finalScoreRankings = [s1, s2, s3].sort((a, b) => a.finalScore - b.finalScore);
    
//     console.log(modifierScoreRankings.map(s => s.player))
//     console.log(finalScoreRankings.map(s => s.player))
//     console.log(s1.assemblages.map(a => a.assemblageModifier));
//     console.log(s2.assemblages.map(a => a.assemblageModifier));
//     console.log(s3.assemblages.map(a => a.assemblageModifier));
// })


// function boardGraph(players, tiles) {
//     const playerNames = Object.keys(players);
//     return tiles.reduce((accum, tileValue, tileIndex) => {
//         accum.push([]);
//         playerNames.forEach(playerName => {
//             if (players[playerName].tokens.includes(tileIndex)) {
//                 accum[tileIndex].push(playerName)
//             }
//         })
//         return accum;
//     }, []);
// }

// function scoreTile(tile, player) {
//     const others = GRAPH[tile].filter((p) => p !== player);
//     const assemblages = others.map((other) => ({
//         player,
//         other,
//         assemblageModifier: assemblageModifyer(
//             TILES[tile],
//             PLAYERS[player].xValue,
//             PLAYERS[other].xValue
//         ),
//     }));
//     const assemblageModifierScore = assemblages.reduce(
//         (accum, a) => accum + a.assemblageModifier,
//         0
//     );
//     const finalScore = assemblages.reduce(
//         (accum, a) => accum + randFromRange(1, 6) + a.assemblageModifier,
//         0
//     );
//     return { tile, player, assemblages, finalScore, assemblageModifierScore };
// }
