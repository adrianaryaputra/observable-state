module.exports = class ObservableState {

    constructor(stateHandle) {
        if(typeof stateHandle == "object") this.stateHandle = stateHandle;
        else this.stateHandle = {};
        this.state = new Object();
    }

    observe(newHandle) {
        this.stateHandle = Object.assign(
            this.stateHandle,
            newHandle,
        );
        return this;
    }

    update(newStates) {
        if(typeof(newStates) == 'object') {
            for (const key in newStates) {
                switch(typeof(newStates[key])) {
                    case 'object':
                        this._updateStateObject(key, newStates[key]);
                        break;
                    default:
                        this._updateStatePrimitive(key, newStates[key]);
                }
            }
        } else {
            console.error("state must be an object. we have: ", typeof newStates, newStates);
        }
        return this;
    }

    get() {
        return this.state
    }

    _updateStateObject(newStateKey, newStateValue) {
        // filter the damn data
        if (newStateValue === undefined) return
        if (newStateValue === null) return

        // serialize object
        let serOld = JSON.stringify(this.state[newStateKey]);
        let serNew = JSON.stringify(newStateValue);

        if (Array.isArray(newStateValue)) 
            if(newStateValue.length !== this.state[newStateKey]?.length)
                serNew = undefined

        if (serOld !== serNew) {
            // change it
            this.state[newStateKey] = newStateValue;
            // call the handle
            this.stateHandle[newStateKey](
                this.state[newStateKey]
            )
        }

    }

    _updateStatePrimitive(newStateKey, newStateValue) {
        // filter the damn data
        if (newStateValue === undefined) return
        if (newStateValue === null) return

        // if there is change
        if (this.state[newStateKey] !== newStateValue) {
            // change it
            this.state[newStateKey] = newStateValue;
            // call the handle
            this.stateHandle[newStateKey](
                this.state[newStateKey]
            )
        }
    }

}