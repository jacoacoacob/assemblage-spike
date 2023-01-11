import { NASError } from "./error.js";
import { randFromRange } from "./utils.js";

/**
 * 
 * @typedef Player
 * @property {string} name
 * @property {number} xValue
 */


/** @returns {Player[]} */
function initPlayersData() {
    return [];
}

/**
 * 
 * @param {import("./database").Data} data 
 * @param {() => void} saveToLocalStorage 
 * @returns 
 */
function playersActions(data, saveToLocalStorage) {
    return {
        add(name) {
            if (data.players.some(player => player.name === name)) {
                throw new NASError(`Player with name ${name} already exists. Please choose a unique name.`);
            }
            data.players.push({
                name,
                xValue: randFromRange(1, 6),
            });
            saveToLocalStorage();
        },
        remove(name) {
            data.players = data.players.filter(player => player.name !== name);
            saveToLocalStorage();
        },
        update(name, playerData) {
            data.players = data.players.map(player => {
                if (player.name === name) {
                    return { ...player, ...playerData };
                }
                return player;
            });
            saveToLocalStorage();
        },
        list() {
            return data.players;
        }
    }
}

export { initPlayersData, playersActions };
