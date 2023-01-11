

class Canvas {
    constructor(containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            const canvas = document.createElement("canvas");
            this.ctx = canvas.getContext("2d");
            container.appendChild(canvas);
        } else {
            throw new Error(`Could not find element with id "${containerId}"!`);
        }
        this.listeners = {};
    }

    get height() {
        return this.ctx.canvas.height;
    }

    set height(h) {
        return this.ctx.canvas.height = h;
    }

    get width() {
        return this.ctx.canvas.width;
    }

    set width(w) {
        return this.ctx.canvas.width = w;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    /**
     * 
     * @param {Event["type"]} event 
     * @param {(event: Event) => void} listener 
     */
    on(event, listener) {
        this.off(event);
        this.listeners[event] = listener;
        this.ctx.canvas.addEventListener(event, listener);
    }
    
    off(event) {
        const listener = this.listeners[event];
        if (listener) {
            this.ctx.canvas.removeEventListener(event, listener);
            delete this.listeners[event];
        }
    }
}

export { Canvas };
