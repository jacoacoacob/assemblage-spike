
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
            render = () => void 0,
            cleanup = () => void 0
        } = {}
    ) {
        this.states[state] = {
            setup: setup.bind(this),
            render: render.bind(this),
            cleanup: cleanup.bind(this),
        };
    }

    render() {
        this.states[this.state].render();
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
