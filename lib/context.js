var R = require('ramda')

module.exports = function(_state) {

    var state = R.merge({ namedCommands: {}, rules: [], depth: 0 }, _state)

    this.get = function(key) {
        return state[key]
    }

    this.set = function(key, value) {
        state[key] = value
    }

    this.inc = function(key) {
        state[key]++
    }

    this.dec = function(key) {
        state[key]--
    }
}
