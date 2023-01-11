

// class State {
//     constructor(data) {
//         this.data = data;
//     }

//     handleInput()
// }

// class FSM {
//     constructor(initState) {
//         this.state = initState;
//         this.data = data;
//         this.states = {};
//     }

//     addState(state, actions) {
//        this.states[state] = actions;
//     }

    
//     dispatch(action) {
//         const action = this.states[this.state][action];
//         if (action) {
//             action.call(this);
//         }
//     } 
// }

// const machine = {
//     state: "MOVE_TOKEN",
//     MOVE_TOKEN() {

//     },
// }

// // const machine = new FSM("MOVE_TOKEN")

// machine.addState("MOVE_TOKEN", {
//     tick() {
//         this.state = "DROP_TOKEN"
//     }
// })

// machine.addState("DROP_TOKEN", {
//     tick() {
//         this.state = "MOVE_TOKEN";
//     }
// })

// console.log(machine.state);
// machine.dispatch("tick");
// console.log(machine.state);






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
            tick = () => void 0,
            cleanup = () => void 0
        } = {}
    ) {
        this.states[state] = {
            setup: setup.bind(this),
            tick: tick.bind(this),
            cleanup: cleanup.bind(this),
        };
    }

    tick() {
        this.states[this.state].tick();
    }

    setState(state) {
        if (this.state) {
            this.states[this.state].cleanup();
        }
        this.state = state;
        this.states[this.state].setup();
    }
}

export { FSM };
