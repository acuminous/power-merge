var R = require('ramda')

module.exports = function(_store) {

    var store = R.merge({ namedCommands: {} }, _store)

    this.get = function(key) {
        return store[key]
    }

    this.set = function(key, value) {
        store[key] = value
    }
}
