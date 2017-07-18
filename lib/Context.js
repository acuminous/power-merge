var R = require('ramda')
var Node = require('./Node')

module.exports = function(_state) {

    var state = R.merge({
        options: {},
        namedCommands: {},
        rules: [],
        node: new Node()
    }, _state)

    this.get = function(key) {
        return state[key]
    }

    this.set = function(key, value) {
        state[key] = value
    }
}
