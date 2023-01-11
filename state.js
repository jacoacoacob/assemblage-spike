
class FSM {
    constructor(data = {}) {
        this.state = "";
        this.data = data;
        this.states = {};
    }

    addState(
        state,
        {
            setup = () => void 0,
            tick = (...args) => void 0,
            cleanup = () => void 0
        } = {}
    ) {
        this.states[state] = {
            setup: setup.bind(this),
            tick: tick.bind(this),
            cleanup: cleanup.bind(this),
        };
    }

    tick(...args) {
        this.states[this.state].tick(...args);
    }

    setState(state, data) {
        this.data = { ...this.data, ...data };
        if (this.state) {
            this.states[this.state].cleanup();
        }
        this.state = state;
        this.states[this.state].setup();
    }
}

export { FSM };
