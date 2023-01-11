
function randFromRange(low, high) {
    return Math.floor(Math.random() * (high + 1 - low) + low);
}

const RAND_ID_SEED = "abcdefghijklmnopqrstuvwxyz0123456789";

/**
 * 
 * @param {number} len 
 */
function randId(len) {
    let rv = "";
    for (let i = 0; i < len; i++) {
        rv += RAND_ID_SEED[randFromRange(0, RAND_ID_SEED.length - 1)];
    }
    return rv;
}

function isCircleCollision(c1, c2) {
    const dx = c1.x - c2.x;
    const dy = c1.y - c2.y;
    const distance = Math.sqrt(dx ** 2 + dy ** 2);
    return distance < c1.r + c2.r;
}

/**
 * 
 * @param  {number[]} numbers 
 * @returns 
 */
function sum(numbers) {
    return numbers.reduce((accum, n) => accum + n, 0);
}

export { randFromRange, randId, isCircleCollision, sum };
