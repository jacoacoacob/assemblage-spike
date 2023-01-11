import { randFromRange } from "./utils.js";

/**
 * 
 * @typedef Grid 
 * @property {number} rows
 * @property {number} cols
 * @property {number} tileSize
 * @property {[number, number, number][]} tiles 
 */


/**
 * @param {number} rows
 * @param {number} cols
 * @param {number} tileSize
 * @returns {Grid}
 */
function initGridData(rows = 8, cols = 12, tileSize = 80) {
    return {
        rows,
        cols,
        tileSize,
        tiles: Array.from(Array(rows * cols)).map(() => [
            randFromRange(56, 255),
            randFromRange(56, 255),
            randFromRange(56, 255),
        ]),
    };
}

/**
 * 
 * @param {import("./database.js").Data} data 
 * @param {() => void} saveToLocalStorage 
 * @returns 
 */
function gridActions(data, saveToLocalStorage) {
    return {
        resizeGrid(rows, cols) {
            data.grid = initGridData(rows, cols);
            saveToLocalStorage();
        },
        getDimensions() {
            return {
                rows: data.grid.rows,
                cols: data.grid.cols,
                tileSize: data.grid.tileSize,
            }
        },
        setDimensions({ rows, cols, tileSize } = {}) {
            data.grid.rows = rows || data.grid.rows;
            data.grid.cols = cols || data.grid.cols;
            data.grid.tileSize = tileSize || data.grid.tileSize;
            saveToLocalStorage();
        },
        resizeTiles(tileSize) {
            data = { ...data, grid: { ...data.grid, tileSize } };
            saveToLocalStorage();
        },
        listTiles() {
            return data.grid.tiles;
        },
        getTileSize() {
            return data.grid.tileSize;
        },
        getTile(rowOrIndex, col) {
            if (typeof col === "undefined") {
                return { index: rowOrIndex, value: data.grid.tiles[rowOrIndex] };
            }
            const index = rowOrIndex * data.grid.cols + col;
            return { index, value: data.grid.tiles[index] };
        },
        getTileCoords(tileIndex) {
            const row = Math.floor(tileIndex / data.grid.cols);
            const col = tileIndex % data.grid.cols;
            return {
                x: col * data.grid.tileSize,
                y: row * data.grid.tileSize,
            };
        },
        getTileFromCoords(x, y) {
            const row = Math.floor(y / data.grid.tileSize);
            const col = Math.floor(x / data.grid.tileSize);
            return this.getTile(row, col);
        },
    };
}

export { initGridData, gridActions };
