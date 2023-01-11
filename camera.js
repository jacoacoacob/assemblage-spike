

function createCamera(x, y, ) {

    let cameraX = x;
    let cameraY = y;

    return {
        worldToScreen(x, y) {
            return {
                x: x - cameraX,
                y: y - cameraY,
            };
        },
        screenToWorld
    }
}

class Camera {
    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {number} width 
     * @param {number} height 
     */
    constructor(x, y, grid) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    
    get maxX
    
}