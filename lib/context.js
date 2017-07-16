var R = require('ramda')

module.exports = function(_state) {

    var state = R.merge({
        options: {},
        namedCommands: {},
        rules: [],
        path: []
    }, _state)

    this.get = function(key) {
        return state[key]
    }

    this.set = function(key, value) {
        state[key] = value
    }

    this.push = function(key, value) {
        state[key].push(value)
    }

    this.pop = function(key) {
        return state[key].pop()
    }

    this.toArray = function(value) {
        if (R.type(value) === 'Array') return value
        if (R.type(value) === 'String') return value.split(state.options.pathSeparator)
        return [value]
    }
}
