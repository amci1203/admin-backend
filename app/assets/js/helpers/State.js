/*
    initialState is an object that looks like:

    [
        prop: {
            type    : ['number', 'string', 'boolean', 'object', 'array'] 'symbol' should work, though I'm not sure of its usefulness here,
            default : self explanatory,
            allowed : [an array of whitelisted values--if included, values not here will throw an error--useful for string (maybe number) props]
        }
    ]
*/

export default function State (initialState) {
    const
        state = {},

        fireEvent = prop => {
            const event = new CustomEvent('state', { state: prop });
            document.dispatchEvent(event);
        },

        isValidValue = (prop, val) => {
            if ( typeof val == prop.type ) return true;
            else if ( prop.type == 'any' ) return true;
            else if ( prop.type == 'array' && Array.isArray(val) ) return true;
            else return false;
        },

        get = prop => {
            if (state.hasOwnProperty(prop)) {
                return state[prop].value;
            } else throw new Error(`property "${prop}" does not exist!`)
        },

        set = (prop, val) => {
            if (state.hasOwnProperty(prop)) {
                if ( isValidValue(state[prop], val) ) {
                    if (!state[prop].allowed || state[prop].allowed.indexOf(val) != -1) {
                        state[prop].value = val;
                        fireEvent(prop);
                    } else throw new Error(`the value "${val}" is not in this prop's allowed values`)
                } else throw new Error(`the value does not satisfy the property's type constraint`)
            } else throw new Error(`property "${prop}" does not exist`)
        }

    for (let prop in initialState) {
        const
            _init = initialState,
            _this = {};

        if ( _init[prop].default && !isValidValue(_init[prop], _init[prop].default) ) {
            throw new Error(`default value is not of type "${_init[prop].type}"`)
        }

        _this.value = _init[prop].default ? _init[prop].default : null;
        _this.type  = _init[prop].type ? _init[prop].type : 'any';

        const allowed = _init[prop].allowed;
        if (allowed) {
            let allValid = true;
            allowed.forEach(item => {
                if (typeof item != _this.type) {
                    throw new Error(`the allowed value "#{item}" is not of the specified type "${_this.type}"`);
                    allValid = false
                }
            })
            if (allValid) _this.allowed = allowed;

            if (_init[prop].default && allowed.indexOf(_init[prop].default) == -1) {
                throw new Error(`the default value "${_init[prop].default}" is not an allowed value`);
            }
        }

        state[prop] = _this;
    }

    return (function () {
        return { get, set, isValidValue }
    })()
}
