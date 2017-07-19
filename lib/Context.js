var R = require('ramda')
var Node = require('./Node')
var HashMap = require('hashmap')

module.exports = function(_state) {

    var state = R.merge({
        options: {},
        namedCommands: {},
        rules: [],
        node: new Node(),
        history: { 'Object': [], 'Array': [] }
    }, _state)

    this.get = function(key) {
        return state[key]
    }

    this.set = function(key, value) {
        state[key] = value
    }

    this.isCircular = function(candidate) {
        return !!(state.history[candidate.type] && ~state.history[candidate.type].indexOf(candidate.value))
    }

    this.recordHistory = function(candidate) {
        state.history[candidate.type] && state.history[candidate.type].push(candidate.value)
    }

    this.eraseHistory = function(candidate) {
        state.history[candidate.type] && state.history[candidate.type].pop()
    }

    this.reset = function() {
        state.node = new Node(),
        state.history = { 'Object': [], 'Array': [] }
    }

    function isCircularType(type) {
        return circularTypes[type]
    }
}
