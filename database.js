import { gridActions, initGridData } from "./grid.js";
import { initPlayersData, playersActions } from "./players.js";

const DEFAULT_DATA = {
    players: initPlayersData(),
    grid: initGridData(),
};

// console.log(DEFAULT_DATA)

/**
 * 
 * @typedef Data
 * @property {import('./players.js').Player[]} players
 * @property {import("./grid.js").Grid} grid
 */

function createDb(namespace) {
    let data = DEFAULT_DATA;

    namespace = "neutrantagonisym-" + namespace;

    try {
        data = JSON.parse(localStorage.getItem(namespace)) || DEFAULT_DATA;
    } catch (error) {
        data = DEFAULT_DATA;
    }

    function saveData() {
        localStorage.setItem(namespace, JSON.stringify(data));
    }

    saveData();

    return {
        players: playersActions(data, saveData),
        grid: gridActions(data, saveData)
    };
}

export { createDb };